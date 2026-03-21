'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'

const VALID_CATEGORIES = [
    { id: 'groceries', name: 'Groceries', icon: '🛒', color: '#84cc16', type: 'expense' },
    { id: 'food', name: 'Food & Dining', icon: '🍔', color: '#f97316', type: 'expense' },
    { id: 'transport', name: 'Transport', icon: '🚗', color: '#ef4444', type: 'expense' },
    { id: 'petrol', name: 'Petrol', icon: '⛽', color: '#dc2626', type: 'expense' },
    { id: 'shopping', name: 'Shopping', icon: '🛍️', color: '#ec4899', type: 'expense' },
    { id: 'bills', name: 'Bills & Utilities', icon: '📄', color: '#f59e0b', type: 'expense' },
    { id: 'subscriptions', name: 'Subscriptions', icon: '📱', color: '#3b82f6', type: 'expense' },
    { id: 'entertainment', name: 'Entertainment', icon: '🎬', color: '#a855f7', type: 'expense' },
    { id: 'health', name: 'Health & Medical', icon: '🏥', color: '#6366f1', type: 'expense' },
    { id: 'sport', name: 'Sport & Fitness', icon: '🏋️', color: '#8b5cf6', type: 'expense' },
    { id: 'travel', name: 'Travel', icon: '✈️', color: '#0891b2', type: 'expense' },
    { id: 'rent', name: 'Rent & Housing', icon: '🏠', color: '#be123c', type: 'expense' },
    { id: 'salary', name: 'Salary', icon: '💼', color: '#22c55e', type: 'income' },
    { id: 'freelance', name: 'Freelance', icon: '💻', color: '#10b981', type: 'income' },
    { id: 'investments', name: 'Investments', icon: '📈', color: '#14b8a6', type: 'income' },
    { id: 'gifts', name: 'Gifts', icon: '🎁', color: '#06b6d4', type: 'income' },
    { id: 'other-income', name: 'Other Income', icon: '💰', color: '#0ea5e9', type: 'income' },
    { id: 'other-expense', name: 'Other Expense', icon: '📦', color: '#64748b', type: 'expense' },
]

type RawTx = {
    id: string
    description: string
    merchant_name: string
    amount: number
    transaction_type: string
    transacted_at: string
    category: string
    date?: string
}

type GroupedMerchant = {
    key: string
    displayName: string
    transactions: RawTx[]
    totalAmount: number
    count: number
    suggestedCategory: string | null
    dates: string[]
}

export default function SmartCategorisePage() {
    const [allOther, setAllOther] = useState<RawTx[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [view, setView] = useState<'triage' | 'grouped' | 'history'>('triage')
    const [saving, setSaving] = useState<string | null>(null)
    const [doneIds, setDoneIds] = useState<Set<string>>(new Set())
    const [triageIndex, setTriageIndex] = useState(0)
    const [rules, setRules] = useState<Record<string, string>>({}) // merchant -> category
    const [toast, setToast] = useState<string | null>(null)

    useEffect(() => { loadData() }, [])

    async function loadData() {
        setLoading(true)
        const [txRes, ruleRes] = await Promise.all([
            fetch('/api/transactions'),
            fetch('/api/category-rules'),
        ])
        const txData = await txRes.json()
        const ruleData = await ruleRes.json()

        // Build quick lookup of existing rules
        const ruleMap: Record<string, string> = {}
        if (Array.isArray(ruleData)) {
            ruleData.forEach((r: { rule_type: string; value: string; category_id: string }) => {
                if (r.rule_type === 'merchant_contains' || r.rule_type === 'exact_merchant') {
                    ruleMap[r.value.toLowerCase()] = r.category_id
                }
            })
        }
        setRules(ruleMap)

        if (Array.isArray(txData)) {
            const VALID_IDS = new Set(VALID_CATEGORIES.map(c => c.id))
            const others = txData.filter((t: RawTx) =>
                !t.category || !VALID_IDS.has(t.category) || t.category === 'other-expense' || t.category === 'other-income'
            )
            setAllOther(others)
        }
        setLoading(false)
    }

    function showToast(msg: string) {
        setToast(msg)
        setTimeout(() => setToast(null), 2500)
    }

    async function categorise(txId: string, categoryId: string, merchant: string, saveRule: boolean) {
        setSaving(txId)
        const res = await fetch('/api/transactions/categorise', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                transactionId: txId,
                categoryId,
                saveAsRule: saveRule && !!merchant,
                ruleType: 'merchant_contains',
                ruleValue: merchant,
            }),
        })
        if (res.ok) {
            setDoneIds(prev => new Set([...prev, txId]))
            showToast(saveRule ? `Saved & rule created for "${merchant}"` : 'Category saved')
            if (saveRule && merchant) {
                setRules(prev => ({ ...prev, [merchant.toLowerCase()]: categoryId }))
            }
        }
        setSaving(null)
    }

    async function categoriseGroup(txIds: string[], categoryId: string, merchant: string) {
        setSaving(merchant)
        // categorise all + save rule
        await Promise.all(txIds.map((id, i) =>
            fetch('/api/transactions/categorise', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    transactionId: id,
                    categoryId,
                    saveAsRule: i === 0, // only save rule once
                    ruleType: 'merchant_contains',
                    ruleValue: merchant,
                }),
            })
        ))
        setDoneIds(prev => new Set([...prev, ...txIds]))
        showToast(`${txIds.length} transactions categorised + rule saved`)
        setSaving(null)
    }

    // Pending transactions not yet done
    const pending = useMemo(() =>
        allOther.filter(t => !doneIds.has(t.id)).filter(t => {
            if (!search) return true
            const s = search.toLowerCase()
            return (t.merchant_name || t.description || '').toLowerCase().includes(s)
        }),
        [allOther, doneIds, search]
    )

    // Group by merchant for grouped view
    const grouped = useMemo((): GroupedMerchant[] => {
        const map = new Map<string, RawTx[]>()
        pending.forEach(t => {
            const key = (t.merchant_name || t.description || 'Unknown').toLowerCase().trim()
            if (!map.has(key)) map.set(key, [])
            map.get(key)!.push(t)
        })
        return Array.from(map.entries())
            .map(([key, txs]) => ({
                key,
                displayName: txs[0].merchant_name || txs[0].description || 'Unknown',
                transactions: txs,
                totalAmount: txs.reduce((s, t) => s + Math.abs(Number(t.amount)), 0),
                count: txs.length,
                suggestedCategory: rules[key] || null,
                dates: [...new Set(txs.map(t => (t.transacted_at || t.date || '').split('T')[0]))].sort().reverse(),
            }))
            .sort((a, b) => b.count - a.count)
    }, [pending, rules])

    const currentTriage = pending[triageIndex]
    const triageRemaining = pending.length

    const formatCurrency = (n: number) =>
        new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', minimumFractionDigits: 2 }).format(n)
    const formatDate = (s: string) =>
        new Date(s).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })

    return (
        <div className="page">
            {/* Header */}
            <div className="header">
                <div className="header-left">
                    <h1>Smart Categorise</h1>
                    <p>
                        {loading ? 'Loading...' : `${triageRemaining} transactions need categorising`}
                        {doneIds.size > 0 && ` · ${doneIds.size} done this session`}
                    </p>
                </div>
                <div className="header-right">
                    <div className="search-box">
                        <span className="search-icon">🔍</span>
                        <input
                            placeholder="Search merchant or description..."
                            value={search}
                            onChange={e => { setSearch(e.target.value); setTriageIndex(0) }}
                        />
                        {search && <button className="clear-search" onClick={() => setSearch('')}>✕</button>}
                    </div>
                </div>
            </div>

            {/* View tabs */}
            <div className="tabs">
                {(['triage', 'grouped', 'history'] as const).map(v => (
                    <button
                        key={v}
                        className={`tab ${view === v ? 'active' : ''}`}
                        onClick={() => setView(v)}
                    >
                        {v === 'triage' && '⚡ Quick Triage'}
                        {v === 'grouped' && `📦 By Merchant (${grouped.length})`}
                        {v === 'history' && `✅ Done (${doneIds.size})`}
                    </button>
                ))}
            </div>

            {loading ? (
                <div className="loading-state">
                    <div className="spinner" />
                    <p>Loading transactions...</p>
                </div>
            ) : triageRemaining === 0 && view !== 'history' ? (
                <div className="done-state">
                    <div className="done-icon">🎉</div>
                    <h2>All caught up!</h2>
                    <p>No uncategorised transactions{search ? ' matching your search' : ''}.</p>
                    {search && <button className="clear-btn" onClick={() => setSearch('')}>Clear search</button>}
                </div>
            ) : (
                <>
                    {/* ── TRIAGE VIEW ─────────────────────────────────────────── */}
                    {view === 'triage' && currentTriage && (
                        <div className="triage-view">
                            <div className="progress-bar">
                                <div
                                    className="progress-fill"
                                    style={{ width: `${(doneIds.size / (doneIds.size + triageRemaining)) * 100}%` }}
                                />
                            </div>
                            <div className="triage-card">
                                <div className="triage-nav">
                                    <button
                                        className="nav-arrow"
                                        disabled={triageIndex === 0}
                                        onClick={() => setTriageIndex(i => i - 1)}
                                    >←</button>
                                    <span className="triage-counter">{triageIndex + 1} / {triageRemaining}</span>
                                    <button
                                        className="nav-arrow"
                                        disabled={triageIndex >= triageRemaining - 1}
                                        onClick={() => setTriageIndex(i => i + 1)}
                                    >→</button>
                                </div>

                                <div className="tx-detail">
                                    <div className="tx-merchant">
                                        {currentTriage.merchant_name || currentTriage.description || 'Unknown'}
                                    </div>
                                    {currentTriage.merchant_name && currentTriage.description && currentTriage.merchant_name !== currentTriage.description && (
                                        <div className="tx-desc">{currentTriage.description}</div>
                                    )}
                                    <div className="tx-meta">
                                        <span className={`tx-amount ${currentTriage.transaction_type?.toUpperCase() === 'CREDIT' ? 'credit' : 'debit'}`}>
                                            {currentTriage.transaction_type?.toUpperCase() === 'CREDIT' ? '+' : '-'}
                                            {formatCurrency(Math.abs(Number(currentTriage.amount)))}
                                        </span>
                                        <span className="tx-date">
                                            {formatDate((currentTriage.transacted_at || currentTriage.date || '').split('T')[0])}
                                        </span>
                                    </div>
                                </div>

                                <p className="pick-label">Pick a category:</p>
                                <div className="cat-grid">
                                    {VALID_CATEGORIES.filter(c => c.id !== 'other-expense' && c.id !== 'other-income').map(cat => (
                                        <button
                                            key={cat.id}
                                            className={`cat-btn ${saving === currentTriage.id ? 'disabled' : ''}`}
                                            style={{ '--cat-color': cat.color } as React.CSSProperties}
                                            onClick={() => {
                                                categorise(
                                                    currentTriage.id,
                                                    cat.id,
                                                    currentTriage.merchant_name || currentTriage.description,
                                                    true
                                                ).then(() => {
                                                    if (triageIndex >= pending.length - 2) setTriageIndex(Math.max(0, triageIndex - 1))
                                                })
                                            }}
                                        >
                                            <span className="cat-icon">{cat.icon}</span>
                                            <span className="cat-name">{cat.name}</span>
                                        </button>
                                    ))}
                                </div>

                                <div className="triage-actions">
                                    <button
                                        className="skip-btn"
                                        onClick={() => setTriageIndex(i => Math.min(i + 1, triageRemaining - 1))}
                                    >
                                        Skip for now →
                                    </button>
                                    <button
                                        className="keep-btn"
                                        onClick={() => categorise(currentTriage.id, currentTriage.transaction_type?.toUpperCase() === 'CREDIT' ? 'other-income' : 'other-expense', '', false)
                                            .then(() => { if (triageIndex >= pending.length - 2) setTriageIndex(Math.max(0, triageIndex - 1)) })}
                                    >
                                        Keep as Other
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ── GROUPED VIEW ─────────────────────────────────────────── */}
                    {view === 'grouped' && (
                        <div className="grouped-view">
                            {grouped.map(group => (
                                <GroupCard
                                    key={group.key}
                                    group={group}
                                    saving={saving === group.key}
                                    onCategorise={(catId) => categoriseGroup(
                                        group.transactions.map(t => t.id),
                                        catId,
                                        group.key
                                    )}
                                    formatCurrency={formatCurrency}
                                    formatDate={formatDate}
                                />
                            ))}
                        </div>
                    )}

                    {/* ── HISTORY VIEW ─────────────────────────────────────────── */}
                    {view === 'history' && (
                        <div className="history-view">
                            {doneIds.size === 0 ? (
                                <div className="done-state">
                                    <p>Nothing categorised this session yet.</p>
                                </div>
                            ) : (
                                allOther.filter(t => doneIds.has(t.id)).map(t => (
                                    <div key={t.id} className="history-row">
                                        <span className="history-merchant">{t.merchant_name || t.description}</span>
                                        <span className="history-amount">{formatCurrency(Math.abs(Number(t.amount)))}</span>
                                        <span className="history-done">✓ Categorised</span>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </>
            )}

            {/* Toast */}
            {toast && <div className="toast">{toast}</div>}

            <style jsx>{`
                .page { display: flex; flex-direction: column; gap: 1.5rem; max-width: 860px; }
                .header { display: flex; justify-content: space-between; align-items: flex-start; gap: 1rem; flex-wrap: wrap; }
                .header-left h1 { font-size: 1.5rem; font-weight: 700; color: var(--text-primary); margin: 0 0 0.25rem; }
                .header-left p { font-size: 0.875rem; color: var(--text-muted); margin: 0; }
                .search-box { display: flex; align-items: center; gap: 0.5rem; background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 0.5rem 0.75rem; min-width: 280px; }
                .search-icon { font-size: 0.875rem; }
                .search-box input { background: none; border: none; outline: none; color: var(--text-primary); font-size: 0.875rem; flex: 1; }
                .clear-search { background: none; border: none; color: var(--text-muted); cursor: pointer; font-size: 0.75rem; padding: 0; }
                .tabs { display: flex; gap: 0.5rem; border-bottom: 1px solid var(--border-color); padding-bottom: 0; }
                .tab { padding: 0.625rem 1rem; background: none; border: none; border-bottom: 2px solid transparent; color: var(--text-muted); font-size: 0.875rem; font-weight: 500; cursor: pointer; margin-bottom: -1px; transition: all 0.15s; }
                .tab:hover { color: var(--text-primary); }
                .tab.active { color: var(--accent-blue); border-bottom-color: var(--accent-blue); }
                .loading-state { display: flex; flex-direction: column; align-items: center; gap: 1rem; padding: 4rem; color: var(--text-muted); }
                .spinner { width: 32px; height: 32px; border: 2px solid var(--border-color); border-top-color: var(--accent-blue); border-radius: 50%; animation: spin 0.8s linear infinite; }
                @keyframes spin { to { transform: rotate(360deg); } }
                .done-state { text-align: center; padding: 4rem 2rem; color: var(--text-muted); }
                .done-icon { font-size: 3rem; margin-bottom: 1rem; }
                .done-state h2 { font-size: 1.25rem; color: var(--text-primary); margin: 0 0 0.5rem; }
                .done-state p { font-size: 0.875rem; margin: 0 0 1rem; }
                .clear-btn { padding: 0.5rem 1rem; background: var(--accent-blue); border: none; border-radius: var(--radius-sm); color: white; font-size: 0.875rem; cursor: pointer; }

                /* Triage */
                .triage-view { display: flex; flex-direction: column; gap: 1rem; }
                .progress-bar { height: 4px; background: var(--bg-secondary); border-radius: 2px; overflow: hidden; }
                .progress-fill { height: 100%; background: var(--accent-blue); border-radius: 2px; transition: width 0.3s ease; }
                .triage-card { background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius-lg); padding: 1.75rem; display: flex; flex-direction: column; gap: 1.25rem; }
                .triage-nav { display: flex; align-items: center; justify-content: space-between; }
                .nav-arrow { background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: var(--radius-sm); padding: 0.375rem 0.75rem; color: var(--text-primary); cursor: pointer; font-size: 1rem; }
                .nav-arrow:disabled { opacity: 0.3; cursor: not-allowed; }
                .triage-counter { font-size: 0.875rem; color: var(--text-muted); font-variant-numeric: tabular-nums; }
                .tx-detail { text-align: center; padding: 1rem 0; }
                .tx-merchant { font-size: 1.5rem; font-weight: 700; color: var(--text-primary); margin-bottom: 0.25rem; }
                .tx-desc { font-size: 0.875rem; color: var(--text-muted); margin-bottom: 0.75rem; }
                .tx-meta { display: flex; align-items: center; justify-content: center; gap: 1rem; }
                .tx-amount { font-size: 1.25rem; font-weight: 700; font-family: var(--font-mono); }
                .tx-amount.credit { color: var(--accent-green); }
                .tx-amount.debit { color: var(--accent-red); }
                .tx-date { font-size: 0.875rem; color: var(--text-muted); }
                .pick-label { font-size: 0.75rem; font-weight: 600; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.08em; margin: 0; }
                .cat-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 0.5rem; }
                @media (max-width: 600px) { .cat-grid { grid-template-columns: repeat(3, 1fr); } }
                .cat-btn { display: flex; flex-direction: column; align-items: center; gap: 0.25rem; padding: 0.75rem 0.5rem; background: var(--bg-secondary); border: 1.5px solid transparent; border-radius: var(--radius-md); cursor: pointer; transition: all 0.15s; }
                .cat-btn:hover { border-color: var(--cat-color); background: var(--bg-hover); transform: translateY(-1px); }
                .cat-btn.disabled { opacity: 0.5; pointer-events: none; }
                .cat-icon { font-size: 1.5rem; }
                .cat-name { font-size: 0.7rem; color: var(--text-secondary); text-align: center; line-height: 1.2; }
                .triage-actions { display: flex; gap: 0.75rem; justify-content: center; }
                .skip-btn { padding: 0.5rem 1rem; background: none; border: 1px solid var(--border-color); border-radius: var(--radius-sm); color: var(--text-muted); font-size: 0.875rem; cursor: pointer; }
                .keep-btn { padding: 0.5rem 1rem; background: none; border: 1px solid var(--border-color); border-radius: var(--radius-sm); color: var(--text-muted); font-size: 0.875rem; cursor: pointer; }

                /* Grouped */
                .grouped-view { display: flex; flex-direction: column; gap: 0.75rem; }

                /* History */
                .history-view { display: flex; flex-direction: column; gap: 0.5rem; }
                .history-row { display: flex; align-items: center; gap: 1rem; padding: 0.875rem 1rem; background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius-md); }
                .history-merchant { flex: 1; font-size: 0.875rem; color: var(--text-primary); }
                .history-amount { font-size: 0.875rem; font-family: var(--font-mono); color: var(--text-secondary); }
                .history-done { font-size: 0.75rem; color: var(--accent-green); font-weight: 600; }

                /* Toast */
                .toast { position: fixed; bottom: 2rem; left: 50%; transform: translateX(-50%); background: var(--text-primary); color: var(--bg-card); padding: 0.75rem 1.25rem; border-radius: var(--radius-md); font-size: 0.875rem; font-weight: 500; z-index: 200; animation: fadeUp 0.2s ease; pointer-events: none; }
                @keyframes fadeUp { from { opacity: 0; transform: translateX(-50%) translateY(8px); } to { opacity: 1; transform: translateX(-50%) translateY(0); } }
            `}</style>
        </div>
    )
}

// ── Group Card ────────────────────────────────────────────────────────────────

function GroupCard({ group, saving, onCategorise, formatCurrency, formatDate }: {
    group: GroupedMerchant
    saving: boolean
    onCategorise: (catId: string) => void
    formatCurrency: (n: number) => string
    formatDate: (s: string) => string
}) {
    const [expanded, setExpanded] = useState(false)
    const [selected, setSelected] = useState(group.suggestedCategory || '')

    return (
        <div className="group-card">
            <div className="group-header" onClick={() => setExpanded(e => !e)}>
                <div className="group-info">
                    <span className="group-name">{group.displayName}</span>
                    <span className="group-badges">
                        <span className="badge">{group.count}x</span>
                        <span className="badge">{formatCurrency(group.totalAmount)}</span>
                        <span className="badge dates">{group.dates[0]}{group.dates.length > 1 ? ` → ${group.dates[group.dates.length - 1]}` : ''}</span>
                    </span>
                </div>
                <span className="expand-icon">{expanded ? '▲' : '▼'}</span>
            </div>

            {expanded && (
                <div className="group-body">
                    <div className="group-txns">
                        {group.transactions.map(t => (
                            <div key={t.id} className="group-tx-row">
                                <span className="group-tx-date">{formatDate((t.transacted_at || t.date || '').split('T')[0])}</span>
                                <span className="group-tx-desc">{t.description || t.merchant_name}</span>
                                <span className="group-tx-amount">{formatCurrency(Math.abs(Number(t.amount)))}</span>
                            </div>
                        ))}
                    </div>

                    <div className="group-cat-row">
                        <select
                            value={selected}
                            onChange={e => setSelected(e.target.value)}
                            className="cat-select"
                        >
                            <option value="">Pick category...</option>
                            {VALID_CATEGORIES.map(c => (
                                <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
                            ))}
                        </select>
                        <button
                            className="apply-btn"
                            disabled={!selected || saving}
                            onClick={() => selected && onCategorise(selected)}
                        >
                            {saving ? 'Saving...' : `Apply to all ${group.count}`}
                        </button>
                    </div>
                    {group.suggestedCategory && (
                        <p className="suggestion">
                            💡 You have a rule for this merchant → {VALID_CATEGORIES.find(c => c.id === group.suggestedCategory)?.name}
                        </p>
                    )}
                </div>
            )}

            <style jsx>{`
                .group-card { background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius-lg); overflow: hidden; }
                .group-header { display: flex; align-items: center; justify-content: space-between; padding: 1rem 1.25rem; cursor: pointer; }
                .group-header:hover { background: var(--bg-hover); }
                .group-info { display: flex; flex-direction: column; gap: 0.375rem; }
                .group-name { font-size: 0.9375rem; font-weight: 600; color: var(--text-primary); }
                .group-badges { display: flex; gap: 0.5rem; flex-wrap: wrap; }
                .badge { font-size: 0.75rem; padding: 0.2rem 0.5rem; background: var(--bg-secondary); border-radius: 4px; color: var(--text-muted); font-family: var(--font-mono); }
                .badge.dates { color: var(--text-secondary); }
                .expand-icon { font-size: 0.625rem; color: var(--text-muted); }
                .group-body { padding: 0 1.25rem 1.25rem; display: flex; flex-direction: column; gap: 1rem; border-top: 1px solid var(--border-color); padding-top: 1rem; }
                .group-txns { display: flex; flex-direction: column; gap: 0.375rem; }
                .group-tx-row { display: flex; gap: 1rem; align-items: center; font-size: 0.8125rem; }
                .group-tx-date { color: var(--text-muted); min-width: 100px; }
                .group-tx-desc { flex: 1; color: var(--text-secondary); }
                .group-tx-amount { font-family: var(--font-mono); color: var(--text-primary); }
                .group-cat-row { display: flex; gap: 0.75rem; }
                .cat-select { flex: 1; padding: 0.5rem 0.75rem; background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: var(--radius-sm); color: var(--text-primary); font-size: 0.875rem; }
                .apply-btn { padding: 0.5rem 1rem; background: var(--accent-blue); border: none; border-radius: var(--radius-sm); color: white; font-size: 0.875rem; font-weight: 600; cursor: pointer; white-space: nowrap; }
                .apply-btn:disabled { opacity: 0.5; cursor: not-allowed; }
                .suggestion { font-size: 0.75rem; color: var(--text-muted); margin: 0; }
            `}</style>
        </div>
    )
}