// src/app/api/category-rules/route.ts
import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET() {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { data, error } = await supabase
        .from('category_rules')
        .select('*')
        .eq('user_id', userId)
        .order('priority', { ascending: false })

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json(data)
}

export async function POST(req: Request) {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await req.json()

    const { data, error } = await supabase
        .from('category_rules')
        .insert([{ ...body, user_id: userId }])
        .select()
        .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    // Re-apply rules to existing transactions immediately
    await reapplyRules(userId)

    return NextResponse.json(data)
}

export async function DELETE(req: Request) {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { id } = await req.json()

    const { error } = await supabase
        .from('category_rules')
        .delete()
        .eq('id', id)
        .eq('user_id', userId)

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ success: true })
}

export async function PATCH(req: Request) {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { id, ...updates } = await req.json()

    const { data, error } = await supabase
        .from('category_rules')
        .update(updates)
        .eq('id', id)
        .eq('user_id', userId)
        .select()
        .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json(data)
}

// Re-applies all rules to existing bank transactions for this user
async function reapplyRules(userId: string) {
    const { data: rules } = await supabase
        .from('category_rules')
        .select('*')
        .eq('user_id', userId)
        .order('priority', { ascending: false })

    if (!rules?.length) return

    const { data: txns } = await supabase
        .from('transactions')
        .select('id, merchant_name, description, amount, transaction_type')
        .eq('user_id', userId)
        .not('transacted_at', 'is', null) // only bank transactions

    if (!txns?.length) return

    for (const txn of txns) {
        const matched = matchRule(txn, rules)
        if (matched) {
            await supabase
                .from('transactions')
                .update({ category: matched })
                .eq('id', txn.id)
        }
    }
}

function matchRule(
    txn: { merchant_name?: string; description?: string; amount?: number; transaction_type?: string },
    rules: Array<{ rule_type: string; value?: string; amount_min?: number; amount_max?: number; category_id: string }>
): string | null {
    const merchant = (txn.merchant_name || '').toLowerCase()
    const description = (txn.description || '').toLowerCase()
    const amount = Math.abs(Number(txn.amount))

    for (const rule of rules) {
        const keyword = (rule.value || '').toLowerCase()
        if (rule.rule_type === 'exact_merchant' && merchant === keyword) return rule.category_id
        if (rule.rule_type === 'merchant_contains' && merchant.includes(keyword)) return rule.category_id
        if (rule.rule_type === 'description_contains' && description.includes(keyword)) return rule.category_id
        if (rule.rule_type === 'amount_range') {
            const aboveMin = rule.amount_min == null || amount >= rule.amount_min
            const belowMax = rule.amount_max == null || amount <= rule.amount_max
            if (aboveMin && belowMax) return rule.category_id
        }
    }
    return null
}