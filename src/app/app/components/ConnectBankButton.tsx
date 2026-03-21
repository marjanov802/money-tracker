'use client'
// components/ConnectBankButton.tsx
// Shows "Connect bank" button OR connected status + last sync time + re-connect option

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'

interface BankStatus {
    connected: boolean
    status: string          // 'active' | 'expired' | 'revoked' | null
    lastSynced: string | null
    providerName: string | null
}

export default function ConnectBankButton() {
    const [bankStatus, setBankStatus] = useState<BankStatus | null>(null)
    const [syncing, setSyncing] = useState(false)
    const [loading, setLoading] = useState(true)
    const searchParams = useSearchParams()

    useEffect(() => {
        fetchBankStatus()
    }, [])

    // Handle redirect back from TrueLayer
    useEffect(() => {
        if (searchParams.get('bank_connected') === 'true') {
            fetchBankStatus()
            // Clean URL
            window.history.replaceState({}, '', window.location.pathname)
        }
        if (searchParams.get('bank_error')) {
            console.error('Bank connection error:', searchParams.get('bank_error'))
            window.history.replaceState({}, '', window.location.pathname)
        }
    }, [searchParams])

    async function fetchBankStatus() {
        try {
            const res = await fetch('/api/bank/status')
            if (res.ok) setBankStatus(await res.json())
        } catch (e) {
            console.error('Failed to fetch bank status:', e)
        } finally {
            setLoading(false)
        }
    }

    async function handleSync() {
        setSyncing(true)
        try {
            const res = await fetch('/api/bank/sync', { method: 'POST' })
            const data = await res.json()
            if (data.success) {
                await fetchBankStatus()
            }
        } catch (e) {
            console.error('Sync failed:', e)
        } finally {
            setSyncing(false)
        }
    }

    function handleConnect() {
        window.location.href = '/api/bank/connect'
    }

    if (loading) {
        return (
            <div className="flex items-center gap-2 text-sm text-gray-400">
                <div className="h-4 w-4 rounded-full border-2 border-gray-300 border-t-transparent animate-spin" />
                Checking bank connection...
            </div>
        )
    }

    // No connection or expired → show connect button
    if (!bankStatus?.connected || bankStatus.status === 'expired') {
        return (
            <div className="flex flex-col gap-2">
                {bankStatus?.status === 'expired' && (
                    <p className="text-sm text-amber-600">
                        Your bank connection expired (90-day re-auth required). Please reconnect.
                    </p>
                )}
                <button
                    onClick={handleConnect}
                    className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 transition-colors w-fit"
                >
                    <BankIcon />
                    Connect your bank
                </button>
            </div>
        )
    }

    // Connected → show status + manual sync
    return (
        <div className="flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 px-4 py-3 dark:border-green-800 dark:bg-green-950">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
                <CheckIcon />
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-green-800 dark:text-green-200">
                    {bankStatus.providerName ?? 'Bank'} connected
                </p>
                <p className="text-xs text-green-600 dark:text-green-400">
                    {bankStatus.lastSynced
                        ? `Last synced ${formatRelativeTime(bankStatus.lastSynced)}`
                        : 'Never synced'}
                </p>
            </div>
            <button
                onClick={handleSync}
                disabled={syncing}
                className="flex items-center gap-1.5 rounded-lg border border-green-300 bg-white px-3 py-1.5 text-xs font-medium text-green-700 hover:bg-green-50 disabled:opacity-50 transition-colors dark:bg-green-900 dark:border-green-700 dark:text-green-300"
            >
                <RefreshIcon spinning={syncing} />
                {syncing ? 'Syncing...' : 'Sync now'}
            </button>
        </div>
    )
}

// ─── Small icons ──────────────────────────────────────────────────────────────

function BankIcon() {
    return (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M2 6h12M8 2l6 4H2l6-4zM3 6v6m3-6v6m3-6v6m3-6v6M2 12h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    )
}

function CheckIcon() {
    return (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M2.5 7L6 10.5L11.5 3.5" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    )
}

function RefreshIcon({ spinning }: { spinning: boolean }) {
    return (
        <svg
            width="12" height="12" viewBox="0 0 12 12" fill="none"
            className={spinning ? 'animate-spin' : ''}
        >
            <path d="M10.5 6A4.5 4.5 0 1 1 6 1.5c1.5 0 2.84.74 3.68 1.87M10.5 1.5V3.5H8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    )
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatRelativeTime(isoString: string): string {
    const diff = Date.now() - new Date(isoString).getTime()
    const mins = Math.floor(diff / 60_000)
    const hours = Math.floor(diff / 3_600_000)
    const days = Math.floor(diff / 86_400_000)

    if (mins < 1) return 'just now'
    if (mins < 60) return `${mins}m ago`
    if (hours < 24) return `${hours}h ago`
    return `${days}d ago`
}