'use client'

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react'
import { useUser } from '@clerk/nextjs'
import { supabase } from '@/lib/supabase'

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

export function TransactionProvider({ children }: { children: ReactNode }) {
    const { user, isLoaded } = useUser()
    const [transactions, setTransactions] = useState<Transaction[]>([])
    const [loading, setLoading] = useState(true)

    // Fetch transactions from Supabase
    const fetchTransactions = useCallback(async () => {
        if (!user?.id) return

        setLoading(true)
        const { data, error } = await supabase
            .from('transactions')
            .select('*')
            .eq('user_id', user.id)
            .order('date', { ascending: false })

        if (error) {
            console.error('Error fetching transactions:', error)
        } else {
            setTransactions(data || [])
        }
        setLoading(false)
    }, [user?.id])

    useEffect(() => {
        if (isLoaded && user?.id) {
            fetchTransactions()
        }
    }, [isLoaded, user?.id, fetchTransactions])

    const addTransaction = async (transaction: Omit<Transaction, 'id' | 'created_at'>) => {
        if (!user?.id) return

        const { data, error } = await supabase
            .from('transactions')
            .insert([{ ...transaction, user_id: user.id }])
            .select()
            .single()

        if (error) {
            console.error('Error adding transaction:', error)
        } else if (data) {
            setTransactions(prev => [data, ...prev])
        }
    }

    const updateTransaction = async (id: string, updates: Partial<Transaction>) => {
        const { data, error } = await supabase
            .from('transactions')
            .update(updates)
            .eq('id', id)
            .select()
            .single()

        if (error) {
            console.error('Error updating transaction:', error)
        } else if (data) {
            setTransactions(prev => prev.map(t => t.id === id ? data : t))
        }
    }

    const deleteTransaction = async (id: string) => {
        const { error } = await supabase
            .from('transactions')
            .delete()
            .eq('id', id)

        if (error) {
            console.error('Error deleting transaction:', error)
        } else {
            setTransactions(prev => prev.filter(t => t.id !== id))
        }
    }

    const getTransactionsByDate = (date: string) => transactions.filter(t => t.date === date)

    const getTransactionsByMonth = (year: number, month: number) => {
        return transactions.filter(t => {
            const d = new Date(t.date)
            return d.getFullYear() === year && d.getMonth() === month
        })
    }

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
            transactions, loading, categories: DEFAULT_CATEGORIES, addTransaction, updateTransaction, deleteTransaction,
            getTransactionsByDate, getTransactionsByMonth, getTotalIncome, getTotalExpenses, getBalance, getCategoryTotals,
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