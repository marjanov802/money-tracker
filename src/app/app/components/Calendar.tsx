'use client'

import { useState, useMemo } from 'react'
import { useTransactions, Transaction } from '../context/TransactionContext'
import TransactionModal from './TransactionModal'
import TransactionList from './TransactionList'

const DAYS_OF_WEEK = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

export default function Calendar() {
    const { transactions, getTransactionsByDate, getTotalIncome, getTotalExpenses } = useTransactions()
    const [currentDate, setCurrentDate] = useState(new Date())
    const [selectedDate, setSelectedDate] = useState<string | null>(null)
    const [showModal, setShowModal] = useState(false)
    const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null)

    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()

    const calendarDays = useMemo(() => {
        const firstDay = new Date(year, month, 1)
        const lastDay = new Date(year, month + 1, 0)
        const startOffset = (firstDay.getDay() + 6) % 7
        const totalDays = lastDay.getDate()
        const days: { date: Date; isCurrentMonth: boolean }[] = []
        for (let i = startOffset - 1; i >= 0; i--) days.push({ date: new Date(year, month, -i), isCurrentMonth: false })
        for (let i = 1; i <= totalDays; i++) days.push({ date: new Date(year, month, i), isCurrentMonth: true })
        const remainingDays = 42 - days.length
        for (let i = 1; i <= remainingDays; i++) days.push({ date: new Date(year, month + 1, i), isCurrentMonth: false })
        return days
    }, [year, month])

    const formatDateKey = (date: Date) => date.toISOString().split('T')[0]
    const isToday = (date: Date) => date.toDateString() === new Date().toDateString()
    const formatCurrency = (amount: number) => new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount)

    const selectedTransactions = selectedDate ? getTransactionsByDate(selectedDate) : []
    const selectedIncome = getTotalIncome(selectedTransactions)
    const selectedExpenses = getTotalExpenses(selectedTransactions)

    return (
        <div className="calendar-container">
            <div className="calendar-main">
                <div className="calendar-header">
                    <h2>{MONTHS[month]} <span className="year">{year}</span></h2>
                    <div className="header-controls">
                        <button onClick={() => setCurrentDate(new Date())} className="today-btn">Today</button>
                        <button onClick={() => setCurrentDate(new Date(year, month - 1, 1))} className="nav-btn">←</button>
                        <button onClick={() => setCurrentDate(new Date(year, month + 1, 1))} className="nav-btn">→</button>
                    </div>
                </div>
                <div className="weekdays">{DAYS_OF_WEEK.map(day => <div key={day} className="weekday">{day}</div>)}</div>
                <div className="calendar-grid">
                    {calendarDays.map(({ date, isCurrentMonth }, index) => {
                        const dateKey = formatDateKey(date)
                        const dayTransactions = getTransactionsByDate(dateKey)
                        const hasIncome = dayTransactions.some(t => t.type === 'income')
                        const hasExpense = dayTransactions.some(t => t.type === 'expense')
                        const dayIncome = getTotalIncome(dayTransactions)
                        const dayExpense = getTotalExpenses(dayTransactions)
                        const isSelected = selectedDate === dateKey
                        const isTodayDate = isToday(date)
                        return (
                            <div key={index} className={`calendar-day ${!isCurrentMonth ? 'other-month' : ''} ${isSelected ? 'selected' : ''} ${isTodayDate ? 'today' : ''}`} onClick={() => setSelectedDate(dateKey)}>
                                <div className="day-header">
                                    <span className={`day-number ${isTodayDate ? 'today-number' : ''}`}>{date.getDate()}</span>
                                    {dayTransactions.length > 0 && <div className="indicators">{hasIncome && <div className="indicator income" />}{hasExpense && <div className="indicator expense" />}</div>}
                                </div>
                                {isCurrentMonth && dayTransactions.length > 0 && (
                                    <div className="day-summary">
                                        {hasIncome && <div className="summary-item income">+{formatCurrency(dayIncome)}</div>}
                                        {hasExpense && <div className="summary-item expense">-{formatCurrency(dayExpense)}</div>}
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </div>
            </div>

            <div className={`day-panel ${selectedDate ? 'open' : ''}`}>
                {selectedDate && (
                    <>
                        <div className="panel-header">
                            <div><span className="panel-day">{new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-GB', { weekday: 'long' })}</span><span className="panel-full-date">{new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</span></div>
                            <button onClick={() => setSelectedDate(null)} className="close-btn">✕</button>
                        </div>
                        <div className="panel-summary">
                            <div className="summary-card income-card"><span className="summary-label">Income</span><span className="summary-amount income">+{formatCurrency(selectedIncome)}</span></div>
                            <div className="summary-card expense-card"><span className="summary-label">Expenses</span><span className="summary-amount expense">-{formatCurrency(selectedExpenses)}</span></div>
                        </div>
                        <button onClick={() => { setEditingTransaction(null); setShowModal(true) }} className="add-transaction-btn">+ Add Transaction</button>
                        <TransactionList transactions={selectedTransactions} onEdit={t => { setEditingTransaction(t); setShowModal(true) }} />
                    </>
                )}
            </div>

            {showModal && <TransactionModal date={selectedDate || formatDateKey(new Date())} transaction={editingTransaction} onClose={() => { setShowModal(false); setEditingTransaction(null) }} />}

            <style jsx>{`
        .calendar-container { display: flex; gap: 0; height: calc(100vh - 180px); min-height: 600px; }
        .calendar-main { flex: 1; display: flex; flex-direction: column; background: var(--bg-card); border-radius: var(--radius-lg); border: 1px solid var(--border-color); overflow: hidden; }
        .calendar-header { display: flex; justify-content: space-between; align-items: center; padding: 1.5rem; border-bottom: 1px solid var(--border-color); }
        .calendar-header h2 { font-size: 1.5rem; font-weight: 600; color: var(--text-primary); }
        .year { color: var(--text-muted); font-weight: 400; }
        .header-controls { display: flex; gap: 0.5rem; }
        .today-btn { padding: 0.5rem 1rem; background: var(--bg-tertiary); border: 1px solid var(--border-color); border-radius: var(--radius-sm); color: var(--text-secondary); font-size: 0.875rem; cursor: pointer; }
        .today-btn:hover { background: var(--bg-hover); color: var(--text-primary); }
        .nav-btn { width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; background: var(--bg-tertiary); border: 1px solid var(--border-color); border-radius: var(--radius-sm); color: var(--text-secondary); cursor: pointer; font-size: 1.25rem; }
        .nav-btn:hover { background: var(--bg-hover); color: var(--text-primary); }
        .weekdays { display: grid; grid-template-columns: repeat(7, 1fr); border-bottom: 1px solid var(--border-color); }
        .weekday { padding: 0.75rem; text-align: center; font-size: 0.75rem; font-weight: 600; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em; }
        .calendar-grid { flex: 1; display: grid; grid-template-columns: repeat(7, 1fr); grid-template-rows: repeat(6, 1fr); }
        .calendar-day { padding: 0.5rem; border-right: 1px solid var(--border-color); border-bottom: 1px solid var(--border-color); cursor: pointer; transition: all 0.2s; display: flex; flex-direction: column; min-height: 80px; }
        .calendar-day:nth-child(7n) { border-right: none; }
        .calendar-day:nth-last-child(-n+7) { border-bottom: none; }
        .calendar-day:hover { background: var(--bg-hover); }
        .calendar-day.other-month { background: var(--bg-secondary); }
        .calendar-day.other-month .day-number { color: var(--text-muted); }
        .calendar-day.selected { background: var(--bg-tertiary); box-shadow: inset 0 0 0 2px var(--accent-blue); }
        .calendar-day.today { background: rgba(59, 130, 246, 0.1); }
        .day-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.25rem; }
        .day-number { font-size: 0.875rem; font-weight: 500; color: var(--text-secondary); }
        .today-number { background: var(--accent-blue); color: white; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 600; }
        .indicators { display: flex; gap: 3px; }
        .indicator { width: 6px; height: 6px; border-radius: 50%; }
        .indicator.income { background: var(--accent-green); }
        .indicator.expense { background: var(--accent-red); }
        .day-summary { display: flex; flex-direction: column; gap: 2px; margin-top: auto; }
        .summary-item { font-size: 0.7rem; font-family: var(--font-mono); padding: 2px 4px; border-radius: 3px; }
        .summary-item.income { background: var(--accent-green-dim); color: var(--accent-green); }
        .summary-item.expense { background: var(--accent-red-dim); color: var(--accent-red); }
        .day-panel { width: 0; overflow: hidden; background: var(--bg-card); border-radius: var(--radius-lg); border: 1px solid var(--border-color); margin-left: 0; transition: all 0.3s ease; display: flex; flex-direction: column; }
        .day-panel.open { width: 380px; margin-left: 1rem; padding: 1.5rem; }
        .panel-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1.5rem; }
        .panel-day { display: block; font-size: 0.875rem; color: var(--text-muted); margin-bottom: 0.25rem; }
        .panel-full-date { font-size: 1.25rem; font-weight: 600; color: var(--text-primary); display: block; }
        .close-btn { width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; background: transparent; border: none; color: var(--text-muted); cursor: pointer; border-radius: var(--radius-sm); font-size: 1.25rem; }
        .close-btn:hover { background: var(--bg-hover); color: var(--text-primary); }
        .panel-summary { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; margin-bottom: 1rem; }
        .summary-card { padding: 1rem; border-radius: var(--radius-md); display: flex; flex-direction: column; gap: 0.25rem; }
        .income-card { background: var(--accent-green-dim); }
        .expense-card { background: var(--accent-red-dim); }
        .summary-label { font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em; }
        .summary-amount { font-size: 1.125rem; font-weight: 600; font-family: var(--font-mono); }
        .add-transaction-btn { display: flex; align-items: center; justify-content: center; gap: 0.5rem; width: 100%; padding: 0.875rem; background: var(--accent-blue); border: none; border-radius: var(--radius-md); color: white; font-size: 0.875rem; font-weight: 600; cursor: pointer; margin-bottom: 1rem; }
        .add-transaction-btn:hover { filter: brightness(1.1); }
        @media (max-width: 900px) {
          .calendar-container { flex-direction: column; height: auto; }
          .calendar-main { min-height: 500px; }
          .day-panel { width: 100% !important; margin-left: 0 !important; margin-top: 1rem; }
          .day-panel.open { padding: 1.5rem; }
        }
      `}</style>
        </div>
    )
}