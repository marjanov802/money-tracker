// app/api/cron/bank-sync/route.ts
// Step 8: Scheduled sync — Vercel calls this every 6 hours via vercel.json cron

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(req: NextRequest) {
    // Vercel cron sends this header — reject anything without it
    const cronSecret = req.headers.get('authorization')
    if (cronSecret !== `Bearer ${process.env.CRON_SECRET}`) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get all active connections that haven't been synced in the last 4 hours
    const cutoff = new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
    const { data: connections, error } = await supabase
        .from('bank_connections')
        .select('user_id')
        .eq('status', 'active')
        .or(`last_synced_at.is.null,last_synced_at.lt.${cutoff}`)

    if (error) {
        console.error('Cron: failed to fetch connections:', error)
        return NextResponse.json({ error: 'DB error' }, { status: 500 })
    }

    if (!connections || connections.length === 0) {
        return NextResponse.json({ message: 'No connections to sync' })
    }

    // Fan out — sync each user in parallel (fire-and-forget per user)
    const syncResults = await Promise.allSettled(
        connections.map(({ user_id }) =>
            fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/bank/sync`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-internal-token': process.env.INTERNAL_API_TOKEN!,
                },
                body: JSON.stringify({ userId: user_id }),
            })
        )
    )

    const succeeded = syncResults.filter(r => r.status === 'fulfilled').length
    const failed = syncResults.filter(r => r.status === 'rejected').length

    console.log(`Cron sync: ${succeeded} succeeded, ${failed} failed out of ${connections.length}`)

    return NextResponse.json({
        total: connections.length,
        succeeded,
        failed,
    })
}