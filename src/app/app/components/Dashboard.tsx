'use client'

import { useState, useMemo } from 'react'
import { useTransactions, Transaction } from '../context/TransactionContext'
import PieChart from './PieChart'
import TransactionList from './TransactionList'
import TransactionModal from './TransactionModal'

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

export default function Dashboard() {
    const { transactions, loading, getTransactionsByMonth, getTotalIncome, getTotalExpenses, getBalance, getCategoryTotals } = useTransactions()
    const [selectedMonth, setSelectedMonth] = useState(() => ({ year: new Date().getFullYear(), month: new Date().getMonth() }))
    const [showModal, setShowModal] = useState(false)
    const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null)

    const monthTransactions = useMemo(() => getTransactionsByMonth(selectedMonth.year, selectedMonth.month), [transactions, selectedMonth, getTransactionsByMonth])
    const totalIncome = getTotalIncome(monthTransactions)
    const totalExpenses = getTotalExpenses(monthTransactions)
    const balance = getBalance(monthTransactions)
    const expensesByCategory = getCategoryTotals('expense', monthTransactions)
    const incomeByCategory = getCategoryTotals('income', monthTransactions)

    const formatCurrency = (amount: number) => new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount)

    const goToPreviousMonth = () => setSelectedMonth(prev => prev.month === 0 ? { year: prev.year - 1, month: 11 } : { ...prev, month: prev.month - 1 })
    const goToNextMonth = () => setSelectedMonth(prev => prev.month === 11 ? { year: prev.year + 1, month: 0 } : { ...prev, month: prev.month + 1 })
    const goToCurrentMonth = () => setSelectedMonth({ year: new Date().getFullYear(), month: new Date().getMonth() })

    const recentTransactions = [...transactions].sort((a, b) => b.date.localeCompare(a.date) || b.created_at.localeCompare(a.created_at)).slice(0, 10)

    if (loading) {
        return (
            <div className="loading">
                <div className="spinner"></div>
                <p>Loading transactions...</p>
                <style jsx>{`
          .loading { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 400px; color: var(--text-muted); }
          .spinner { width: 40px; height: 40px; border: 3px solid var(--border-color); border-top-color: var(--accent-blue); border-radius: 50%; animation: spin 1s linear infinite; margin-bottom: 1rem; }
          @keyframes spin { to { transform: rotate(360deg); } }
        `}</style>
            </div>
        )
    }

    return (
        <div className="dashboard">
            <div className="month-selector">
                <button onClick={goToPreviousMonth} className="nav-btn">←</button>
                <div className="month-display">
                    <h2>{MONTHS[selectedMonth.month]} {selectedMonth.year}</h2>
                    <button onClick={goToCurrentMonth} className="today-link">Go to current month</button>
                </div>
                <button onClick={goToNextMonth} className="nav-btn">→</button>
            </div>

            <div className="summary-cards">
                <div className="summary-card income-card">
                    <div className="card-header"><span className="card-icon">↓</span><span className="card-label">Income</span></div>
                    <div className="card-amount income">+{formatCurrency(totalIncome)}</div>
                    <div className="card-subtext">{incomeByCategory.length} sources</div>
                </div>
                <div className="summary-card expense-card">
                    <div className="card-header"><span className="card-icon">↑</span><span className="card-label">Expenses</span></div>
                    <div className="card-amount expense">-{formatCurrency(totalExpenses)}</div>
                    <div className="card-subtext">{expensesByCategory.length} categories</div>
                </div>
                <div className={`summary-card balance-card ${balance >= 0 ? 'positive' : 'negative'}`}>
                    <div className="card-header"><span className="card-icon">=</span><span className="card-label">Balance</span></div>
                    <div className={`card-amount ${balance >= 0 ? 'income' : 'expense'}`}>{balance >= 0 ? '+' : ''}{formatCurrency(balance)}</div>
                    <div className="card-subtext">{totalIncome > 0 ? `${((totalExpenses / totalIncome) * 100).toFixed(0)}% spent` : 'No income yet'}</div>
                </div>
            </div>

            <div className="charts-section">
                <PieChart data={expensesByCategory} title="Expenses Breakdown" total={totalExpenses} />
                <PieChart data={incomeByCategory} title="Income Sources" total={totalIncome} />
            </div>

            <div className="recent-section">
                <div className="section-header">
                    <h3>Recent Transactions</h3>
                    <button onClick={() => { setEditingTransaction(null); setShowModal(true) }} className="add-btn">+ Add</button>
                </div>
                <TransactionList transactions={recentTransactions} onEdit={t => { setEditingTransaction(t); setShowModal(true) }} showDate />
            </div>

            {showModal && <TransactionModal date={new Date().toISOString().split('T')[0]} transaction={editingTransaction} onClose={() => { setShowModal(false); setEditingTransaction(null) }} />}

            <style jsx>{`
        .dashboard { display: flex; flex-direction: column; gap: 1.5rem; }
        .month-selector { display: flex; align-items: center; justify-content: center; gap: 1rem; }
        .month-display { text-align: center; }
        .month-display h2 { font-size: 1.5rem; font-weight: 600; color: var(--text-primary); margin-bottom: 0.25rem; }
        .today-link { background: none; border: none; color: var(--accent-blue); font-size: 0.75rem; cursor: pointer; text-decoration: underline; }
        .nav-btn { width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius-md); color: var(--text-secondary); cursor: pointer; font-size: 1.25rem; }
        .nav-btn:hover { background: var(--bg-hover); color: var(--text-primary); }
        .summary-cards { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; }
        @media (max-width: 768px) { .summary-cards { grid-template-columns: 1fr; } }
        .summary-card { background: var(--bg-card); border-radius: var(--radius-lg); padding: 1.5rem; border: 1px solid var(--border-color); }
        .income-card { border-left: 3px solid var(--accent-green); }
        .expense-card { border-left: 3px solid var(--accent-red); }
        .balance-card.positive { border-left: 3px solid var(--accent-green); }
        .balance-card.negative { border-left: 3px solid var(--accent-red); }
        .card-header { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.75rem; }
        .card-icon { width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; background: var(--bg-secondary); border-radius: var(--radius-sm); font-size: 0.875rem; color: var(--text-muted); }
        .card-label { font-size: 0.75rem; font-weight: 600; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em; }
        .card-amount { font-size: 1.75rem; font-weight: 700; font-family: var(--font-mono); margin-bottom: 0.25rem; }
        .card-subtext { font-size: 0.75rem; color: var(--text-muted); }
        .charts-section { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; }
        @media (max-width: 900px) { .charts-section { grid-template-columns: 1fr; } }
        .recent-section { background: var(--bg-card); border-radius: var(--radius-lg); padding: 1.5rem; border: 1px solid var(--border-color); }
        .section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
        .section-header h3 { font-size: 0.75rem; font-weight: 600; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.1em; }
        .add-btn { display: flex; align-items: center; gap: 0.375rem; padding: 0.5rem 0.875rem; background: var(--accent-blue); border: none; border-radius: var(--radius-sm); color: white; font-size: 0.8125rem; font-weight: 600; cursor: pointer; }
        .add-btn:hover { filter: brightness(1.1); }
      `}</style>
        </div>
    )
}