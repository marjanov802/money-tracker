// app/api/bank/sync/route.ts
// Steps 5, 6, 7: Fetch accounts → fetch transactions → upsert everything to Supabase
// Also called by the cron job and on app open

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createClient } from '@supabase/supabase-js'
import {
    fetchAccounts,
    fetchTransactions,
    refreshAccessToken,
    expiresAt,
} from '@/lib/truelayer'

function getSupabase() {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
}

async function getValidAccessToken(userId: string): Promise<{ token: string; connectionId: string } | null> {
    const supabase = getSupabase()
    const { data: conn, error } = await supabase
        .from('bank_connections')
        .select('id, access_token, refresh_token, expires_at, status')
        .eq('user_id', userId)
        .eq('status', 'active')
        .single()

    if (error || !conn) return null

    const now = new Date()
    const expiry = new Date(conn.expires_at)

    // Token still valid
    if (expiry > now) {
        return { token: conn.access_token, connectionId: conn.id }
    }

    // Token expired — refresh it
    try {
        const refreshed = await refreshAccessToken(conn.refresh_token)
        await supabase
            .from('bank_connections')
            .update({
                access_token: refreshed.access_token,
                refresh_token: refreshed.refresh_token,
                expires_at: expiresAt(refreshed.expires_in).toISOString(),
            })
            .eq('id', conn.id)

        return { token: refreshed.access_token, connectionId: conn.id }
    } catch (e) {
        // Refresh failed — likely 90-day AIS re-auth needed
        await supabase
            .from('bank_connections')
            .update({ status: 'expired' })
            .eq('id', conn.id)

        console.warn(`Connection ${conn.id} expired (90-day re-auth needed)`)
        return null
    }
}

export async function POST(req: NextRequest) {
    // Accept calls from Clerk-auth users OR internal cron/callback token
    let userId: string | null = null

    const internalToken = req.headers.get('x-internal-token')
    if (internalToken === process.env.INTERNAL_API_TOKEN) {
        const body = await req.json()
        userId = body.userId
    } else {
        const { userId: clerkId } = await auth()
        userId = clerkId
    }

    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get a valid (possibly refreshed) access token
    const tokenData = await getValidAccessToken(userId)
    if (!tokenData) {
        return NextResponse.json({ error: 'No active bank connection. Please reconnect your bank.' }, { status: 400 })
    }

    const { token, connectionId } = tokenData
    const supabase = getSupabase()

    // ── Step 5: Fetch accounts ─────────────────────────────────────────────────
    let accounts
    try {
        accounts = await fetchAccounts(token)
    } catch (e) {
        console.error('Fetch accounts error:', e)
        return NextResponse.json({ error: 'Failed to fetch accounts' }, { status: 502 })
    }

    // Save accounts to Supabase
    const accountRows = accounts.map(a => ({
        user_id: userId,
        connection_id: connectionId,
        account_id: a.account_id,
        display_name: a.display_name,
        currency: a.currency,
        account_type: a.account_type,
        provider_id: a.provider?.provider_id,
        provider_name: a.provider?.display_name,
    }))

    await supabase
        .from('bank_accounts')
        .upsert(accountRows, { onConflict: 'user_id,account_id' })

    // ── Step 6: Fetch transactions for each account ────────────────────────────
    // Sync last 90 days on first run; last 7 days on subsequent syncs
    const { data: lastSync } = await supabase
        .from('bank_connections')
        .select('last_synced_at')
        .eq('id', connectionId)
        .single()

    const from = lastSync?.last_synced_at
        ? new Date(lastSync.last_synced_at)
        : new Date(Date.now() - 90 * 24 * 60 * 60 * 1000) // 90 days ago

    const to = new Date()
    let totalSynced = 0

    for (const account of accounts) {
        let txns
        try {
            txns = await fetchTransactions(token, account.account_id, from, to)
        } catch (e) {
            console.error(`Fetch transactions error for account ${account.account_id}:`, e)
            continue // skip this account, try next
        }

        if (txns.length === 0) continue

        // ── Step 7: Upsert transactions ─────────────────────────────────────────
        const rows = txns.map(t => ({
            user_id: userId,
            account_id: account.account_id,
            transaction_id: t.transaction_id,
            amount: t.amount,
            currency: t.currency,
            description: t.description,
            merchant_name: t.merchant_name ?? null,
            category: t.transaction_category ?? null,
            transaction_type: t.transaction_type,
            transacted_at: t.timestamp,
            running_balance: t.running_balance?.amount ?? null,
        }))

        const { error: upsertError } = await supabase
            .from('transactions')
            .upsert(rows, { onConflict: 'user_id,transaction_id' })

        if (upsertError) {
            console.error('Transaction upsert error:', upsertError)
        } else {
            totalSynced += rows.length
        }
    }

    // Update last synced timestamp
    await supabase
        .from('bank_connections')
        .update({ last_synced_at: to.toISOString() })
        .eq('id', connectionId)

    return NextResponse.json({
        success: true,
        accounts: accounts.length,
        transactions_synced: totalSynced,
        synced_from: from.toISOString(),
        synced_to: to.toISOString(),
    })
}