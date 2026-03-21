// app/api/bank/connect/route.ts
// Step 1 & 2: User clicks Connect → we redirect to TrueLayer consent screen

import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { buildAuthUrl } from '@/lib/truelayer'

export async function GET() {
    const { userId } = await auth()

    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const authUrl = buildAuthUrl(userId)

    return NextResponse.redirect(authUrl)
}