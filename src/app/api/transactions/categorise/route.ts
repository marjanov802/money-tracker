// src/app/api/transactions/categorise/route.ts
import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { transactionId, categoryId, saveAsRule, ruleType, ruleValue } = await req.json()

    // Update the transaction category
    const { error } = await supabase
        .from('transactions')
        .update({ category: categoryId })
        .eq('id', transactionId)
        .eq('user_id', userId)

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    // Optionally save as a rule for future transactions
    if (saveAsRule && ruleType && ruleValue) {
        await supabase.from('category_rules').insert([{
            user_id: userId,
            category_id: categoryId,
            rule_type: ruleType,
            value: ruleValue,
            priority: 10, // user rules override auto-guesser
        }])
    }

    return NextResponse.json({ success: true })
}