// app/api/bank/callback/route.ts
// Steps 3 & 4: TrueLayer redirects back → we exchange code for tokens → save to Supabase

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { exchangeCode, expiresAt, parseState } from '@/lib/truelayer'

function getSupabase() {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY! // service role bypasses RLS for server writes
    )
}

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url)
    const code = searchParams.get('code')
    const state = searchParams.get('state')
    const error = searchParams.get('error')

    // User denied consent or something went wrong at TrueLayer
    if (error) {
        console.error('TrueLayer auth error:', error)
        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/app?bank_error=${error}`)
    }

    if (!code || !state) {
        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/app?bank_error=missing_params`)
    }

    let userId: string
    try {
        const parsed = parseState(state)
        userId = parsed.userId
        // Basic replay-attack guard: state must be less than 10 minutes old
        if (Date.now() - parsed.ts > 10 * 60 * 1000) {
            throw new Error('State expired')
        }
    } catch (e) {
        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/app?bank_error=invalid_state`)
    }

    // Exchange code for tokens
    let tokens
    try {
        tokens = await exchangeCode(code)
    } catch (e) {
        console.error('Token exchange error:', e)
        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/app?bank_error=token_exchange_failed`)
    }

    // Save connection to Supabase
    const supabase = getSupabase()
    const { data: connection, error: dbError } = await supabase
        .from('bank_connections')
        .upsert(
            {
                user_id: userId,
                access_token: tokens.access_token,
                refresh_token: tokens.refresh_token,
                expires_at: expiresAt(tokens.expires_in).toISOString(),
                status: 'active',
                connected_at: new Date().toISOString(),
            },
            { onConflict: 'user_id' } // one connection per user for now; extend for multi-bank
        )
        .select()
        .single()

    if (dbError || !connection) {
        console.error('DB save error:', dbError)
        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/app?bank_error=db_error`)
    }

    // Kick off initial sync (accounts + transactions) in the background
    // We fire-and-forget so the redirect is instant
    fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/bank/sync`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-internal-token': process.env.INTERNAL_API_TOKEN! },
        body: JSON.stringify({ userId }),
    }).catch(err => console.error('Background sync trigger failed:', err))

    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/app?bank_connected=true`)
}