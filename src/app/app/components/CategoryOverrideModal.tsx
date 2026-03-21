'use client'

import { useState } from 'react'

const CATEGORIES = [
    { id: 'salary', name: 'Salary', icon: '💼', type: 'income' },
    { id: 'freelance', name: 'Freelance', icon: '💻', type: 'income' },
    { id: 'investments', name: 'Investments', icon: '📈', type: 'income' },
    { id: 'gifts', name: 'Gifts', icon: '🎁', type: 'income' },
    { id: 'other-income', name: 'Other Income', icon: '💰', type: 'income' },
    { id: 'food', name: 'Food & Dining', icon: '🍔', type: 'expense' },
    { id: 'transport', name: 'Transport', icon: '🚗', type: 'expense' },
    { id: 'petrol', name: 'Petrol', icon: '⛽', type: 'expense' },
    { id: 'bills', name: 'Bills & Utilities', icon: '📄', type: 'expense' },
    { id: 'shopping', name: 'Shopping', icon: '🛍️', type: 'expense' },
    { id: 'entertainment', name: 'Entertainment', icon: '🎬', type: 'expense' },
    { id: 'health', name: 'Health & Medical', icon: '🏥', type: 'expense' },
    { id: 'sport', name: 'Sport & Fitness', icon: '🏋️', type: 'expense' },
    { id: 'groceries', name: 'Groceries', icon: '🛒', type: 'expense' },
    { id: 'subscriptions', name: 'Subscriptions', icon: '📱', type: 'expense' },
    { id: 'travel', name: 'Travel', icon: '✈️', type: 'expense' },
    { id: 'rent', name: 'Rent & Housing', icon: '🏠', type: 'expense' },
    { id: 'other-expense', name: 'Other Expense', icon: '📦', type: 'expense' },
]

type Props = {
    transactionId: string
    merchantName: string
    currentCategory: string
    onClose: () => void
    onSaved: (newCategory: string) => void
}

export default function CategoryOverrideModal({ transactionId, merchantName, currentCategory, onClose, onSaved }: Props) {
    const [selected, setSelected] = useState(currentCategory)
    const [saveRule, setSaveRule] = useState(false)
    const [ruleType, setRuleType] = useState('merchant_contains')
    const [ruleValue, setRuleValue] = useState(merchantName || '')
    const [saving, setSaving] = useState(false)

    async function handleSave() {
        setSaving(true)
        const res = await fetch('/api/transactions/categorise', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                transactionId,
                categoryId: selected,
                saveAsRule: saveRule,
                ruleType,
                ruleValue,
            }),
        })
        if (res.ok) {
            onSaved(selected)
            onClose()
        }
        setSaving(false)
    }

    return (
        <div className="overlay" onClick={onClose}>
            <div className="modal" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h3>Change category</h3>
                    <button onClick={onClose} className="close-btn">✕</button>
                </div>

                {merchantName && (
                    <p className="merchant-name">Transaction: <strong>{merchantName}</strong></p>
                )}

                <div className="categories-grid">
                    {CATEGORIES.map(cat => (
                        <button
                            key={cat.id}
                            onClick={() => setSelected(cat.id)}
                            className={`cat-btn ${selected === cat.id ? 'active' : ''}`}
                        >
                            <span className="cat-icon">{cat.icon}</span>
                            <span className="cat-name">{cat.name}</span>
                        </button>
                    ))}
                </div>

                <div className="save-rule-section">
                    <label className="checkbox-row">
                        <input
                            type="checkbox"
                            checked={saveRule}
                            onChange={e => setSaveRule(e.target.checked)}
                        />
                        <span>Save as a rule for future transactions</span>
                    </label>

                    {saveRule && (
                        <div className="rule-config">
                            <select value={ruleType} onChange={e => setRuleType(e.target.value)}>
                                <option value="exact_merchant">Exact merchant match</option>
                                <option value="merchant_contains">Merchant contains keyword</option>
                                <option value="description_contains">Description contains keyword</option>
                            </select>
                            <input
                                type="text"
                                value={ruleValue}
                                onChange={e => setRuleValue(e.target.value)}
                                placeholder="Keyword or merchant name"
                            />
                        </div>
                    )}
                </div>

                <div className="modal-actions">
                    <button onClick={onClose} className="cancel-btn">Cancel</button>
                    <button onClick={handleSave} disabled={saving} className="save-btn">
                        {saving ? 'Saving...' : 'Save'}
                    </button>
                </div>
            </div>

            <style jsx>{`
                .overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 100; padding: 1rem; }
                .modal { background: var(--bg-card); border-radius: var(--radius-lg); padding: 1.5rem; width: 100%; max-width: 480px; display: flex; flex-direction: column; gap: 1.25rem; }
                .modal-header { display: flex; justify-content: space-between; align-items: center; }
                .modal-header h3 { font-size: 1rem; font-weight: 600; color: var(--text-primary); margin: 0; }
                .close-btn { background: none; border: none; color: var(--text-muted); font-size: 1rem; cursor: pointer; }
                .merchant-name { font-size: 0.875rem; color: var(--text-muted); margin: 0; }
                .categories-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.5rem; }
                .cat-btn { display: flex; flex-direction: column; align-items: center; gap: 0.25rem; padding: 0.625rem 0.5rem; background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: var(--radius-sm); cursor: pointer; transition: all 0.15s; }
                .cat-btn:hover { border-color: var(--accent-blue); }
                .cat-btn.active { border-color: var(--accent-blue); background: var(--bg-hover); }
                .cat-icon { font-size: 1.25rem; }
                .cat-name { font-size: 0.7rem; color: var(--text-secondary); text-align: center; }
                .save-rule-section { display: flex; flex-direction: column; gap: 0.75rem; }
                .checkbox-row { display: flex; align-items: center; gap: 0.5rem; font-size: 0.875rem; color: var(--text-secondary); cursor: pointer; }
                .rule-config { display: flex; flex-direction: column; gap: 0.5rem; }
                .rule-config select, .rule-config input { padding: 0.5rem 0.75rem; background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: var(--radius-sm); color: var(--text-primary); font-size: 0.875rem; }
                .modal-actions { display: flex; gap: 0.75rem; justify-content: flex-end; }
                .cancel-btn { padding: 0.5rem 1rem; background: transparent; border: 1px solid var(--border-color); border-radius: var(--radius-sm); color: var(--text-secondary); font-size: 0.875rem; cursor: pointer; }
                .save-btn { padding: 0.5rem 1rem; background: var(--accent-blue); border: none; border-radius: var(--radius-sm); color: white; font-size: 0.875rem; font-weight: 600; cursor: pointer; }
                .save-btn:disabled { opacity: 0.6; }
            `}</style>
        </div>
    )
}