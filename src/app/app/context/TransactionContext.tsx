'use client'

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react'
import { useUser } from '@clerk/nextjs'

export type TransactionType = 'income' | 'expense'

export type Category = {
    id: string
    name: string
    icon: string
    color: string
    type: TransactionType
}

export type Transaction = {
    id: string
    amount: number
    type: TransactionType
    category: string
    description: string
    date: string
    created_at: string
}

export const DEFAULT_CATEGORIES: Category[] = [
    { id: 'salary', name: 'Salary', icon: '💼', color: '#22c55e', type: 'income' },
    { id: 'freelance', name: 'Freelance', icon: '💻', color: '#10b981', type: 'income' },
    { id: 'investments', name: 'Investments', icon: '📈', color: '#14b8a6', type: 'income' },
    { id: 'gifts', name: 'Gifts', icon: '🎁', color: '#06b6d4', type: 'income' },
    { id: 'other-income', name: 'Other Income', icon: '💰', color: '#0ea5e9', type: 'income' },
    { id: 'food', name: 'Food & Dining', icon: '🍔', color: '#f97316', type: 'expense' },
    { id: 'transport', name: 'Transport', icon: '🚗', color: '#ef4444', type: 'expense' },
    { id: 'petrol', name: 'Petrol', icon: '⛽', color: '#dc2626', type: 'expense' },
    { id: 'bills', name: 'Bills & Utilities', icon: '📄', color: '#f59e0b', type: 'expense' },
    { id: 'shopping', name: 'Shopping', icon: '🛍️', color: '#ec4899', type: 'expense' },
    { id: 'entertainment', name: 'Entertainment', icon: '🎬', color: '#a855f7', type: 'expense' },
    { id: 'health', name: 'Health & Medical', icon: '🏥', color: '#6366f1', type: 'expense' },
    { id: 'sport', name: 'Sport & Fitness', icon: '🏋️', color: '#8b5cf6', type: 'expense' },
    { id: 'groceries', name: 'Groceries', icon: '🛒', color: '#84cc16', type: 'expense' },
    { id: 'subscriptions', name: 'Subscriptions', icon: '📱', color: '#3b82f6', type: 'expense' },
    { id: 'travel', name: 'Travel', icon: '✈️', color: '#0891b2', type: 'expense' },
    { id: 'rent', name: 'Rent & Housing', icon: '🏠', color: '#be123c', type: 'expense' },
    { id: 'other-expense', name: 'Other Expense', icon: '📦', color: '#64748b', type: 'expense' },
]

type TransactionContextType = {
    transactions: Transaction[]
    loading: boolean
    categories: Category[]
    refreshTransactions: () => Promise<void>
    addTransaction: (transaction: Omit<Transaction, 'id' | 'created_at'>) => Promise<void>
    updateTransaction: (id: string, transaction: Partial<Transaction>) => Promise<void>
    deleteTransaction: (id: string) => Promise<void>
    getTransactionsByDate: (date: string) => Transaction[]
    getTransactionsByMonth: (year: number, month: number) => Transaction[]
    getTotalIncome: (transactions?: Transaction[]) => number
    getTotalExpenses: (transactions?: Transaction[]) => number
    getBalance: (transactions?: Transaction[]) => number
    getCategoryTotals: (type: TransactionType, transactions?: Transaction[]) => { category: Category; total: number }[]
}

const TransactionContext = createContext<TransactionContextType | undefined>(undefined)

function guessCategoryFromBank(merchant: string, description: string, type: TransactionType): string {
    const text = `${merchant || ''} ${description || ''}`.toLowerCase()
    if (type === 'income') {
        if (text.match(/salary|payroll|wages/)) return 'salary'
        if (text.match(/freelance|invoice/)) return 'freelance'
        if (text.match(/dividend|interest|invest/)) return 'investments'
        return 'other-income'
    }
    if (text.match(/tesco|asda|sainsbury|lidl|aldi|morrisons|waitrose|co-op|marks|m&s food/)) return 'groceries'
    if (text.match(/restaurant|cafe|coffee|mcdonald|kfc|burger|pizza|nando|subway|deliveroo|uber eat|just eat/)) return 'food'
    if (text.match(/petrol|fuel|shell|bp |esso|texaco/)) return 'petrol'
    if (text.match(/uber|taxi|bus|train|tfl|rail|transport|parking/)) return 'transport'
    if (text.match(/netflix|spotify|amazon prime|disney|apple|youtube|subscription/)) return 'subscriptions'
    if (text.match(/gym|fitness|sport|swimming|leisure/)) return 'sport'
    if (text.match(/amazon|ebay|asos|next|zara|h&m|primark|shopping/)) return 'shopping'
    if (text.match(/electric|gas|water|council|broadband|sky|virgin|bt |ee |vodafone|o2 /)) return 'bills'
    if (text.match(/rent|mortgage|landlord/)) return 'rent'
    if (text.match(/pharmacy|doctor|hospital|dental|optician|health/)) return 'health'
    if (text.match(/hotel|airbnb|flight|holiday|travel|booking\.com/)) return 'travel'
    if (text.match(/cinema|theatre|entertainment|ticketmaster/)) return 'entertainment'
    return 'other-expense'
}

function normalizeTransaction(row: Record<string, unknown>): Transaction {
    const isBankTx = !row.date && !!row.transacted_at
    const date = isBankTx
        ? (row.transacted_at as string).split('T')[0]
        : row.date as string
    const type: TransactionType = isBankTx
        ? ((row.transaction_type as string)?.toUpperCase() === 'CREDIT' ? 'income' : 'expense')
        : row.type as TransactionType
    const VALID_IDS = ["salary", "freelance", "investments", "gifts", "other-income", "food", "transport", "petrol", "bills", "shopping", "entertainment", "health", "sport", "groceries", "subscriptions", "travel", "rent", "other-expense"]
    const stored = row.category as string
    const category = (stored && VALID_IDS.includes(stored))
        ? stored
        : guessCategoryFromBank(row.merchant_name as string, row.description as string, type)
    return {
        id: row.id as string,
        amount: Math.abs(Number(row.amount)),
        type,
        category,
        description: (row.merchant_name as string) || (row.description as string) || '',
        date,
        created_at: (row.created_at as string) || date,
    }
}

export function TransactionProvider({ children }: { children: ReactNode }) {
    const { user, isLoaded } = useUser()
    const [transactions, setTransactions] = useState<Transaction[]>([])
    const [loading, setLoading] = useState(true)

    const fetchTransactions = useCallback(async () => {
        if (!user?.id) return
        setLoading(true)
        try {
            const res = await fetch('/api/transactions')
            const data = await res.json()
            if (Array.isArray(data)) {
                setTransactions(data.map(normalizeTransaction))
            } else {
                console.error('Fetch transactions error:', data)
            }
        } catch (e) {
            console.error('Fetch transactions failed:', e)
        }
        setLoading(false)
    }, [user?.id])

    useEffect(() => {
        if (isLoaded && user?.id) fetchTransactions()
    }, [isLoaded, user?.id, fetchTransactions])

    const addTransaction = async (transaction: Omit<Transaction, 'id' | 'created_at'>) => {
        const res = await fetch('/api/transactions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(transaction),
        })
        const data = await res.json()
        if (data.id) setTransactions(prev => [normalizeTransaction(data), ...prev])
        else console.error('Add transaction error:', data)
    }

    const updateTransaction = async (id: string, updates: Partial<Transaction>) => {
        const res = await fetch('/api/transactions', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, ...updates }),
        })
        const data = await res.json()
        if (data.id) setTransactions(prev => prev.map(t => t.id === id ? normalizeTransaction(data) : t))
        else console.error('Update transaction error:', data)
    }

    const deleteTransaction = async (id: string) => {
        const res = await fetch('/api/transactions', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id }),
        })
        const data = await res.json()
        if (data.success) setTransactions(prev => prev.filter(t => t.id !== id))
        else console.error('Delete transaction error:', data)
    }

    const getTransactionsByDate = (date: string) => transactions.filter(t => t.date === date)
    const getTransactionsByMonth = (year: number, month: number) => transactions.filter(t => {
        const d = new Date(t.date)
        return d.getFullYear() === year && d.getMonth() === month
    })
    const getTotalIncome = (txns = transactions) => txns.filter(t => t.type === 'income').reduce((sum, t) => sum + Number(t.amount), 0)
    const getTotalExpenses = (txns = transactions) => txns.filter(t => t.type === 'expense').reduce((sum, t) => sum + Number(t.amount), 0)
    const getBalance = (txns = transactions) => getTotalIncome(txns) - getTotalExpenses(txns)
    const getCategoryTotals = (type: TransactionType, txns = transactions) => {
        const filtered = txns.filter(t => t.type === type)
        const totals = new Map<string, number>()
        filtered.forEach(t => totals.set(t.category, (totals.get(t.category) || 0) + Number(t.amount)))
        return DEFAULT_CATEGORIES
            .filter(c => c.type === type && totals.has(c.id))
            .map(category => ({ category, total: totals.get(category.id) || 0 }))
            .sort((a, b) => b.total - a.total)
    }

    return (
        <TransactionContext.Provider value={{
            transactions, loading, categories: DEFAULT_CATEGORIES,
            refreshTransactions: fetchTransactions,
            addTransaction, updateTransaction, deleteTransaction,
            getTransactionsByDate, getTransactionsByMonth,
            getTotalIncome, getTotalExpenses, getBalance, getCategoryTotals,
        }}>
            {children}
        </TransactionContext.Provider>
    )
}

export function useTransactions() {
    const context = useContext(TransactionContext)
    if (!context) throw new Error('useTransactions must be used within TransactionProvider')
    return context
}