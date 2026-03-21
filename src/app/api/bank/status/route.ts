// app/api/bank/status/route.ts
// Called by ConnectBankButton to check current connection state

import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET() {
    const { userId } = await auth()

    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: conn } = await supabase
        .from('bank_connections')
        .select('status, last_synced_at, connected_at')
        .eq('user_id', userId)
        .single()

    if (!conn) {
        return NextResponse.json({ connected: false, status: null, lastSynced: null, providerName: null })
    }

    // Get provider name from accounts table
    const { data: account } = await supabase
        .from('bank_accounts')
        .select('provider_name')
        .eq('user_id', userId)
        .limit(1)
        .single()

    return NextResponse.json({
        connected: conn.status === 'active',
        status: conn.status,
        lastSynced: conn.last_synced_at,
        providerName: account?.provider_name ?? null,
    })
}