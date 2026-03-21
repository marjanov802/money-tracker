'use client'

import { useState } from 'react'
import { UserButton } from '@clerk/nextjs'
import { TransactionProvider } from './context/TransactionContext'
import Dashboard from './components/Dashboard'
import Calendar from './components/Calendar'
import SmartCategorisePage from './categorise/page'
import CategoryRulesPage from './rules/page'

type View = 'dashboard' | 'calendar' | 'categorise' | 'rules'

function AppContent() {
    const [currentView, setCurrentView] = useState<View>('dashboard')

    return (
        <div className="app">
            <header className="header">
                <div className="header-content">
                    <div className="logo">
                        <div className="logo-icon">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <path d="M12 2L2 7l10 5 10-5-10-5z" fill="currentColor" opacity="0.3" />
                                <path d="M2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                        <span className="logo-text">MoneyFlow</span>
                    </div>

                    <nav className="nav">
                        <button className={`nav-item ${currentView === 'dashboard' ? 'active' : ''}`} onClick={() => setCurrentView('dashboard')}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <rect x="3" y="3" width="7" height="9" rx="1" /><rect x="14" y="3" width="7" height="5" rx="1" />
                                <rect x="14" y="12" width="7" height="9" rx="1" /><rect x="3" y="16" width="7" height="5" rx="1" />
                            </svg>
                            <span>Dashboard</span>
                        </button>

                        <button className={`nav-item ${currentView === 'calendar' ? 'active' : ''}`} onClick={() => setCurrentView('calendar')}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" />
                            </svg>
                            <span>Calendar</span>
                        </button>

                        <button className={`nav-item ${currentView === 'categorise' ? 'active' : ''}`} onClick={() => setCurrentView('categorise')}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                <path d="M9 12l2 2 4-4" />
                            </svg>
                            <span>Categorise</span>
                        </button>

                        <button className={`nav-item ${currentView === 'rules' ? 'active' : ''}`} onClick={() => setCurrentView('rules')}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                            </svg>
                            <span>Rules</span>
                        </button>
                    </nav>

                    <UserButton afterSignOutUrl="/" />
                </div>
            </header>

            <main className="main">
                <div className="container">
                    {currentView === 'dashboard' && <Dashboard />}
                    {currentView === 'calendar' && <Calendar />}
                    {currentView === 'categorise' && <SmartCategorisePage />}
                    {currentView === 'rules' && <CategoryRulesPage />}
                </div>
            </main>

            <style jsx>{`
                .app { min-height: 100vh; display: flex; flex-direction: column; }
                .header { background: var(--bg-card); border-bottom: 1px solid var(--border-color); position: sticky; top: 0; z-index: 100; }
                .header-content { max-width: 1400px; margin: 0 auto; padding: 1rem 2rem; display: flex; align-items: center; justify-content: space-between; }
                .logo { display: flex; align-items: center; gap: 0.75rem; }
                .logo-icon { width: 40px; height: 40px; background: linear-gradient(135deg, var(--accent-blue), var(--accent-purple)); border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center; color: white; }
                .logo-text { font-size: 1.25rem; font-weight: 700; color: var(--text-primary); letter-spacing: -0.02em; }
                .nav { display: flex; align-items: center; gap: 0.5rem; background: var(--bg-secondary); padding: 0.375rem; border-radius: var(--radius-lg); }
                .nav-item { display: flex; align-items: center; gap: 0.5rem; padding: 0.625rem 1rem; background: transparent; border: none; border-radius: var(--radius-md); color: var(--text-muted); font-size: 0.875rem; font-weight: 500; cursor: pointer; transition: all 0.2s; white-space: nowrap; }
                .nav-item:hover { color: var(--text-secondary); background: var(--bg-hover); }
                .nav-item.active { background: var(--bg-card); color: var(--text-primary); box-shadow: 0 2px 8px rgba(0,0,0,0.3); }
                .main { flex: 1; padding: 2rem; }
                .container { max-width: 1400px; margin: 0 auto; }
                @media (max-width: 640px) {
                    .header-content { padding: 1rem; }
                    .main { padding: 1rem; }
                    .logo-text { display: none; }
                    .nav-item span { display: none; }
                    .nav-item { padding: 0.625rem 0.75rem; }
                }
            `}</style>
        </div>
    )
}

export default function AppPage() {
    return (
        <TransactionProvider>
            <AppContent />
        </TransactionProvider>
    )
}