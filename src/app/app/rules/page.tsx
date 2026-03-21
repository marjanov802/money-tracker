'use client'

import { useState, useEffect } from 'react'

const CATEGORIES = [
    { id: 'salary', name: 'Salary', icon: '💼' },
    { id: 'freelance', name: 'Freelance', icon: '💻' },
    { id: 'investments', name: 'Investments', icon: '📈' },
    { id: 'gifts', name: 'Gifts', icon: '🎁' },
    { id: 'other-income', name: 'Other Income', icon: '💰' },
    { id: 'food', name: 'Food & Dining', icon: '🍔' },
    { id: 'transport', name: 'Transport', icon: '🚗' },
    { id: 'petrol', name: 'Petrol', icon: '⛽' },
    { id: 'bills', name: 'Bills & Utilities', icon: '📄' },
    { id: 'shopping', name: 'Shopping', icon: '🛍️' },
    { id: 'entertainment', name: 'Entertainment', icon: '🎬' },
    { id: 'health', name: 'Health & Medical', icon: '🏥' },
    { id: 'sport', name: 'Sport & Fitness', icon: '🏋️' },
    { id: 'groceries', name: 'Groceries', icon: '🛒' },
    { id: 'subscriptions', name: 'Subscriptions', icon: '📱' },
    { id: 'travel', name: 'Travel', icon: '✈️' },
    { id: 'rent', name: 'Rent & Housing', icon: '🏠' },
    { id: 'other-expense', name: 'Other Expense', icon: '📦' },
]

const RULE_TYPES = [
    { id: 'exact_merchant', label: 'Exact merchant name' },
    { id: 'merchant_contains', label: 'Merchant name contains' },
    { id: 'description_contains', label: 'Description contains' },
    { id: 'amount_range', label: 'Amount range' },
]

type Rule = {
    id: string
    category_id: string
    rule_type: string
    value?: string
    amount_min?: number
    amount_max?: number
    priority: number
    created_at: string
}

export default function CategoryRulesPage() {
    const [rules, setRules] = useState<Rule[]>([])
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [showForm, setShowForm] = useState(false)

    const [ruleType, setRuleType] = useState('merchant_contains')
    const [keyword, setKeyword] = useState('')
    const [amountMin, setAmountMin] = useState('')
    const [amountMax, setAmountMax] = useState('')
    const [categoryId, setCategoryId] = useState('other-expense')

    useEffect(() => { loadRules() }, [])

    async function loadRules() {
        setLoading(true)
        const res = await fetch('/api/category-rules')
        const data = await res.json()
        setRules(Array.isArray(data) ? data : [])
        setLoading(false)
    }

    async function handleSave() {
        if (ruleType !== 'amount_range' && !keyword.trim()) return
        setSaving(true)

        const body: Record<string, unknown> = { rule_type: ruleType, category_id: categoryId }
        if (ruleType === 'amount_range') {
            if (amountMin) body.amount_min = Number(amountMin)
            if (amountMax) body.amount_max = Number(amountMax)
        } else {
            body.value = keyword.trim()
        }

        const res = await fetch('/api/category-rules', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        })

        if (res.ok) {
            await loadRules()
            setShowForm(false)
            setKeyword('')
            setAmountMin('')
            setAmountMax('')
        }
        setSaving(false)
    }

    async function handleDelete(id: string) {
        await fetch('/api/category-rules', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id }),
        })
        setRules(prev => prev.filter(r => r.id !== id))
    }

    function ruleDescription(rule: Rule) {
        const cat = CATEGORIES.find(c => c.id === rule.category_id)
        const catLabel = cat ? `${cat.icon} ${cat.name}` : rule.category_id
        const typeLabel = RULE_TYPES.find(t => t.id === rule.rule_type)?.label || rule.rule_type

        if (rule.rule_type === 'amount_range') {
            const min = rule.amount_min != null ? `£${rule.amount_min}` : '£0'
            const max = rule.amount_max != null ? `£${rule.amount_max}` : '∞'
            return { condition: `Amount between ${min} and ${max}`, category: catLabel }
        }
        return { condition: `${typeLabel}: "${rule.value}"`, category: catLabel }
    }

    return (
        <div className="rules-page">
            <div className="page-header">
                <div>
                    <h1>Category Rules</h1>
                    <p>Rules are applied to all bank transactions — new syncs and existing ones. Higher priority rules run first.</p>
                </div>
                <button onClick={() => setShowForm(true)} className="add-btn">+ New rule</button>
            </div>

            {showForm && (
                <div className="form-card">
                    <h3>New rule</h3>

                    <div className="form-row">
                        <label>Rule type</label>
                        <select value={ruleType} onChange={e => setRuleType(e.target.value)}>
                            {RULE_TYPES.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
                        </select>
                    </div>

                    {ruleType === 'amount_range' ? (
                        <div className="form-row">
                            <label>Amount range (£)</label>
                            <div className="range-inputs">
                                <input
                                    type="number"
                                    placeholder="Min (e.g. 2000)"
                                    value={amountMin}
                                    onChange={e => setAmountMin(e.target.value)}
                                />
                                <span>to</span>
                                <input
                                    type="number"
                                    placeholder="Max (leave blank for no limit)"
                                    value={amountMax}
                                    onChange={e => setAmountMax(e.target.value)}
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="form-row">
                            <label>
                                {ruleType === 'exact_merchant' ? 'Exact merchant name' : 'Keyword'}
                            </label>
                            <input
                                type="text"
                                placeholder={ruleType === 'exact_merchant' ? 'e.g. NETFLIX.COM' : 'e.g. netflix'}
                                value={keyword}
                                onChange={e => setKeyword(e.target.value)}
                            />
                        </div>
                    )}

                    <div className="form-row">
                        <label>Assign to category</label>
                        <select value={categoryId} onChange={e => setCategoryId(e.target.value)}>
                            {CATEGORIES.map(c => (
                                <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="form-actions">
                        <button onClick={() => setShowForm(false)} className="cancel-btn">Cancel</button>
                        <button onClick={handleSave} disabled={saving} className="save-btn">
                            {saving ? 'Saving & applying...' : 'Save rule'}
                        </button>
                    </div>

                    <p className="form-note">
                        Saving this rule will immediately re-categorise all matching existing transactions.
                    </p>
                </div>
            )}

            {loading ? (
                <div className="empty-state">Loading rules...</div>
            ) : rules.length === 0 ? (
                <div className="empty-state">
                    <p>No rules yet.</p>
                    <p>Add a rule to automatically categorise transactions — e.g. anything from "Tesco" → Groceries.</p>
                </div>
            ) : (
                <div className="rules-list">
                    {rules.map(rule => {
                        const { condition, category } = ruleDescription(rule)
                        return (
                            <div key={rule.id} className="rule-row">
                                <div className="rule-info">
                                    <span className="rule-condition">{condition}</span>
                                    <span className="rule-arrow">→</span>
                                    <span className="rule-category">{category}</span>
                                </div>
                                <button onClick={() => handleDelete(rule.id)} className="delete-btn">Delete</button>
                            </div>
                        )
                    })}
                </div>
            )}

            <style jsx>{`
                .rules-page { display: flex; flex-direction: column; gap: 1.5rem; max-width: 800px; }
                .page-header { display: flex; justify-content: space-between; align-items: flex-start; gap: 1rem; }
                .page-header h1 { font-size: 1.5rem; font-weight: 600; color: var(--text-primary); margin-bottom: 0.25rem; }
                .page-header p { font-size: 0.875rem; color: var(--text-muted); }
                .add-btn { padding: 0.5rem 1rem; background: var(--accent-blue); border: none; border-radius: var(--radius-sm); color: white; font-size: 0.875rem; font-weight: 600; cursor: pointer; white-space: nowrap; }
                .add-btn:hover { filter: brightness(1.1); }
                .form-card { background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius-lg); padding: 1.5rem; display: flex; flex-direction: column; gap: 1rem; }
                .form-card h3 { font-size: 1rem; font-weight: 600; color: var(--text-primary); margin: 0; }
                .form-row { display: flex; flex-direction: column; gap: 0.375rem; }
                .form-row label { font-size: 0.75rem; font-weight: 600; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em; }
                .form-row input, .form-row select { padding: 0.625rem 0.75rem; background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: var(--radius-sm); color: var(--text-primary); font-size: 0.875rem; }
                .form-row input:focus, .form-row select:focus { outline: none; border-color: var(--accent-blue); }
                .range-inputs { display: flex; align-items: center; gap: 0.5rem; }
                .range-inputs input { flex: 1; }
                .range-inputs span { color: var(--text-muted); font-size: 0.875rem; }
                .form-actions { display: flex; gap: 0.75rem; justify-content: flex-end; }
                .cancel-btn { padding: 0.5rem 1rem; background: transparent; border: 1px solid var(--border-color); border-radius: var(--radius-sm); color: var(--text-secondary); font-size: 0.875rem; cursor: pointer; }
                .save-btn { padding: 0.5rem 1rem; background: var(--accent-blue); border: none; border-radius: var(--radius-sm); color: white; font-size: 0.875rem; font-weight: 600; cursor: pointer; }
                .save-btn:disabled { opacity: 0.6; cursor: not-allowed; }
                .form-note { font-size: 0.75rem; color: var(--text-muted); margin: 0; }
                .rules-list { display: flex; flex-direction: column; gap: 0.5rem; }
                .rule-row { display: flex; align-items: center; justify-content: space-between; padding: 1rem 1.25rem; background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius-md); gap: 1rem; }
                .rule-info { display: flex; align-items: center; gap: 0.75rem; flex-wrap: wrap; }
                .rule-condition { font-size: 0.875rem; color: var(--text-primary); font-family: var(--font-mono); background: var(--bg-secondary); padding: 0.2rem 0.5rem; border-radius: 4px; }
                .rule-arrow { color: var(--text-muted); font-size: 1rem; }
                .rule-category { font-size: 0.875rem; color: var(--text-primary); font-weight: 500; }
                .delete-btn { padding: 0.375rem 0.75rem; background: transparent; border: 1px solid var(--accent-red); border-radius: var(--radius-sm); color: var(--accent-red); font-size: 0.75rem; cursor: pointer; white-space: nowrap; }
                .delete-btn:hover { background: var(--accent-red); color: white; }
                .empty-state { text-align: center; padding: 3rem; color: var(--text-muted); background: var(--bg-card); border: 1px dashed var(--border-color); border-radius: var(--radius-lg); }
                .empty-state p { margin: 0.25rem 0; font-size: 0.875rem; }
            `}</style>
        </div>
    )
}