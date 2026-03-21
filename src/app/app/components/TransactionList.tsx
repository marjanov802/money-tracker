'use client'

import { useState } from 'react'
import { Transaction, DEFAULT_CATEGORIES } from '../context/TransactionContext'
import CategoryOverrideModal from './CategoryOverrideModal'

type TransactionListProps = {
    transactions: Transaction[]
    onEdit?: (transaction: Transaction) => void
    onCategoryChanged?: (id: string, newCategory: string) => void
    showDate?: boolean
}

export default function TransactionList({ transactions, onEdit, onCategoryChanged, showDate = false }: TransactionListProps) {
    const [overrideTarget, setOverrideTarget] = useState<Transaction | null>(null)

    const formatCurrency = (amount: number) => new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', minimumFractionDigits: 2 }).format(amount)
    const formatDate = (dateStr: string) => new Date(dateStr + 'T00:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
    const getCategory = (categoryId: string) => DEFAULT_CATEGORIES.find(c => c.id === categoryId)

    if (transactions.length === 0) {
        return (
            <div className="empty-state">
                <div className="empty-icon">💸</div>
                <p>No transactions yet</p>
                <style jsx>{`
                    .empty-state { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 3rem 1rem; color: var(--text-muted); text-align: center; }
                    .empty-icon { font-size: 2.5rem; margin-bottom: 1rem; opacity: 0.5; }
                    p { font-size: 0.875rem; }
                `}</style>
            </div>
        )
    }

    const sortedTransactions = [...transactions].sort((a, b) => {
        const dateCompare = b.date.localeCompare(a.date)
        if (dateCompare !== 0) return dateCompare
        return b.created_at.localeCompare(a.created_at)
    })

    return (
        <div className="transaction-list">
            {sortedTransactions.map((transaction) => {
                const category = getCategory(transaction.category)
                return (
                    <div key={transaction.id} className="transaction-item">
                        <div
                            className="transaction-icon"
                            style={{ backgroundColor: (category?.color || '#64748b') + '20' }}
                            onClick={() => onEdit?.(transaction)}
                        >
                            {category?.icon || '📦'}
                        </div>
                        <div className="transaction-info" onClick={() => onEdit?.(transaction)}>
                            <div className="transaction-category">{category?.name || 'Unknown'}</div>
                            {transaction.description && (
                                <div className="transaction-description">{transaction.description}</div>
                            )}
                            {showDate && (
                                <div className="transaction-date">{formatDate(transaction.date)}</div>
                            )}
                        </div>
                        <div className="transaction-right">
                            <div className={`transaction-amount ${transaction.type}`}>
                                {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                            </div>
                            <button
                                className="recategorise-btn"
                                onClick={e => { e.stopPropagation(); setOverrideTarget(transaction) }}
                                title="Change category"
                            >
                                🏷️
                            </button>
                        </div>
                    </div>
                )
            })}

            {overrideTarget && (
                <CategoryOverrideModal
                    transactionId={overrideTarget.id}
                    merchantName={overrideTarget.description}
                    currentCategory={overrideTarget.category}
                    onClose={() => setOverrideTarget(null)}
                    onSaved={(newCategory) => {
                        onCategoryChanged?.(overrideTarget.id, newCategory)
                        setOverrideTarget(null)
                    }}
                />
            )}

            <style jsx>{`
                .transaction-list { display: flex; flex-direction: column; gap: 0.5rem; flex: 1; overflow-y: auto; }
                .transaction-item { display: flex; align-items: center; gap: 0.75rem; padding: 0.875rem; background: var(--bg-secondary); border-radius: var(--radius-md); transition: all 0.2s; }
                .transaction-item:hover { background: var(--bg-hover); }
                .transaction-item:hover .recategorise-btn { opacity: 1; }
                .transaction-icon { width: 40px; height: 40px; border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center; font-size: 1.25rem; flex-shrink: 0; cursor: pointer; }
                .transaction-info { flex: 1; min-width: 0; cursor: pointer; }
                .transaction-category { font-size: 0.875rem; font-weight: 500; color: var(--text-primary); margin-bottom: 0.125rem; }
                .transaction-description { font-size: 0.75rem; color: var(--text-muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
                .transaction-date { font-size: 0.75rem; color: var(--text-muted); margin-top: 0.125rem; }
                .transaction-right { display: flex; align-items: center; gap: 0.5rem; flex-shrink: 0; }
                .transaction-amount { font-family: var(--font-mono); font-size: 0.875rem; font-weight: 600; white-space: nowrap; }
                .transaction-amount.income { color: var(--accent-green); }
                .transaction-amount.expense { color: var(--accent-red); }
                .recategorise-btn { background: none; border: none; cursor: pointer; font-size: 0.875rem; opacity: 0; transition: opacity 0.15s; padding: 0.25rem; border-radius: 4px; line-height: 1; }
                .recategorise-btn:hover { background: var(--bg-card); }
            `}</style>
        </div>
    )
}