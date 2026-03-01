'use client'

import { useState, useEffect } from 'react'
import { useTransactions, Transaction, TransactionType, DEFAULT_CATEGORIES } from '../context/TransactionContext'

type TransactionModalProps = {
    date: string
    transaction?: Transaction | null
    onClose: () => void
}

export default function TransactionModal({ date, transaction, onClose }: TransactionModalProps) {
    const { addTransaction, updateTransaction, deleteTransaction } = useTransactions()
    const [type, setType] = useState<TransactionType>(transaction?.type || 'expense')
    const [amount, setAmount] = useState(transaction?.amount.toString() || '')
    const [category, setCategory] = useState(transaction?.category || '')
    const [description, setDescription] = useState(transaction?.description || '')
    const [selectedDate, setSelectedDate] = useState(transaction?.date || date)

    const filteredCategories = DEFAULT_CATEGORIES.filter(c => c.type === type)

    useEffect(() => {
        if (!filteredCategories.find(c => c.id === category)) {
            setCategory(filteredCategories[0]?.id || '')
        }
    }, [type, filteredCategories, category])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        const parsedAmount = parseFloat(amount)
        if (isNaN(parsedAmount) || parsedAmount <= 0 || !category) return

        const transactionData = { amount: parsedAmount, type, category, description, date: selectedDate }
        if (transaction) {
            updateTransaction(transaction.id, transactionData)
        } else {
            addTransaction(transactionData)
        }
        onClose()
    }

    const handleDelete = () => {
        if (transaction && confirm('Are you sure you want to delete this transaction?')) {
            deleteTransaction(transaction.id)
            onClose()
        }
    }

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>{transaction ? 'Edit Transaction' : 'Add Transaction'}</h2>
                    <button onClick={onClose} className="close-btn">✕</button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="type-toggle">
                        <button type="button" className={`type-btn ${type === 'expense' ? 'active expense' : ''}`} onClick={() => setType('expense')}>↑ Expense</button>
                        <button type="button" className={`type-btn ${type === 'income' ? 'active income' : ''}`} onClick={() => setType('income')}>↓ Income</button>
                    </div>
                    <div className="form-group">
                        <label>Amount</label>
                        <div className="amount-input">
                            <span className="currency">£</span>
                            <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0.00" step="0.01" min="0" required autoFocus />
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Date</label>
                        <input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} className="date-input" />
                    </div>
                    <div className="form-group">
                        <label>Category</label>
                        <div className="category-grid">
                            {filteredCategories.map(cat => (
                                <button key={cat.id} type="button" className={`category-btn ${category === cat.id ? 'selected' : ''}`} onClick={() => setCategory(cat.id)} style={{ '--cat-color': cat.color } as React.CSSProperties}>
                                    <span className="cat-icon">{cat.icon}</span>
                                    <span className="cat-name">{cat.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Description (optional)</label>
                        <input type="text" value={description} onChange={e => setDescription(e.target.value)} placeholder="Add a note..." className="text-input" />
                    </div>
                    <div className="modal-actions">
                        {transaction && <button type="button" onClick={handleDelete} className="delete-btn">Delete</button>}
                        <button type="button" onClick={onClose} className="cancel-btn">Cancel</button>
                        <button type="submit" className={`submit-btn ${type}`}>{transaction ? 'Save Changes' : 'Add Transaction'}</button>
                    </div>
                </form>
                <style jsx>{`
          .modal-overlay { position: fixed; inset: 0; background: rgba(0, 0, 0, 0.7); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 1rem; animation: fadeIn 0.2s ease-out; }
          .modal { background: var(--bg-card); border-radius: var(--radius-xl); border: 1px solid var(--border-color); width: 100%; max-width: 500px; max-height: 90vh; overflow-y: auto; animation: scaleIn 0.2s ease-out; }
          .modal-header { display: flex; justify-content: space-between; align-items: center; padding: 1.5rem; border-bottom: 1px solid var(--border-color); }
          .modal-header h2 { font-size: 1.25rem; font-weight: 600; }
          .close-btn { width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; background: transparent; border: none; color: var(--text-muted); cursor: pointer; border-radius: var(--radius-sm); font-size: 1.25rem; }
          .close-btn:hover { background: var(--bg-hover); color: var(--text-primary); }
          form { padding: 1.5rem; }
          .type-toggle { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; margin-bottom: 1.5rem; }
          .type-btn { display: flex; align-items: center; justify-content: center; gap: 0.5rem; padding: 1rem; background: var(--bg-secondary); border: 2px solid var(--border-color); border-radius: var(--radius-md); color: var(--text-secondary); font-size: 0.875rem; font-weight: 600; cursor: pointer; transition: all 0.2s; }
          .type-btn:hover { border-color: var(--border-hover); }
          .type-btn.active.expense { background: var(--accent-red-dim); border-color: var(--accent-red); color: var(--accent-red); }
          .type-btn.active.income { background: var(--accent-green-dim); border-color: var(--accent-green); color: var(--accent-green); }
          .form-group { margin-bottom: 1.5rem; }
          label { display: block; font-size: 0.75rem; font-weight: 600; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.5rem; }
          .amount-input { display: flex; align-items: center; background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 0 1rem; }
          .amount-input:focus-within { border-color: var(--accent-blue); }
          .currency { font-size: 1.5rem; font-weight: 600; color: var(--text-muted); font-family: var(--font-mono); }
          .amount-input input { flex: 1; background: transparent; border: none; padding: 1rem 0.5rem; font-size: 1.5rem; font-weight: 600; color: var(--text-primary); font-family: var(--font-mono); outline: none; }
          .date-input, .text-input { width: 100%; background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 0.875rem 1rem; font-size: 0.875rem; color: var(--text-primary); font-family: inherit; outline: none; }
          .date-input:focus, .text-input:focus { border-color: var(--accent-blue); }
          .category-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.5rem; max-height: 200px; overflow-y: auto; }
          .category-btn { display: flex; flex-direction: column; align-items: center; gap: 0.25rem; padding: 0.75rem 0.5rem; background: var(--bg-secondary); border: 2px solid var(--border-color); border-radius: var(--radius-md); cursor: pointer; transition: all 0.2s; }
          .category-btn:hover { border-color: var(--border-hover); background: var(--bg-hover); }
          .category-btn.selected { border-color: var(--cat-color); background: color-mix(in srgb, var(--cat-color) 15%, transparent); }
          .cat-icon { font-size: 1.25rem; }
          .cat-name { font-size: 0.7rem; color: var(--text-secondary); text-align: center; }
          .modal-actions { display: flex; gap: 0.75rem; margin-top: 1.5rem; padding-top: 1.5rem; border-top: 1px solid var(--border-color); }
          .delete-btn { padding: 0.875rem 1.25rem; background: transparent; border: 1px solid var(--accent-red); border-radius: var(--radius-md); color: var(--accent-red); font-size: 0.875rem; font-weight: 600; cursor: pointer; }
          .delete-btn:hover { background: var(--accent-red-dim); }
          .cancel-btn { padding: 0.875rem 1.25rem; background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: var(--radius-md); color: var(--text-secondary); font-size: 0.875rem; font-weight: 600; cursor: pointer; margin-left: auto; }
          .cancel-btn:hover { background: var(--bg-hover); }
          .submit-btn { padding: 0.875rem 1.5rem; border: none; border-radius: var(--radius-md); font-size: 0.875rem; font-weight: 600; cursor: pointer; }
          .submit-btn.expense { background: var(--accent-red); color: white; }
          .submit-btn.income { background: var(--accent-green); color: white; }
          .submit-btn:hover { filter: brightness(1.1); }
        `}</style>
            </div>
        </div>
    )
}