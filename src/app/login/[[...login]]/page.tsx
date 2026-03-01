'use client'
import { SignIn } from '@clerk/nextjs'
import Link from 'next/link'

export default function LoginPage() {
    return (
        <div className="page">
            <div className="left-panel">
                <Link href="/" className="logo">
                    <div className="logo-icon">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M12 2L2 7l10 5 10-5-10-5z" fill="currentColor" opacity="0.3" />
                            <path d="M2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                    <span>MoneyFlow</span>
                </Link>

                <div className="welcome">
                    <h1>Welcome back</h1>
                    <p>Track your expenses, manage budgets, and achieve your financial goals.</p>
                    <div className="stats">
                        <div className="stat"><span className="value">50K+</span><span className="label">Users</span></div>
                        <div className="stat"><span className="value">$2.5B</span><span className="label">Tracked</span></div>
                        <div className="stat"><span className="value">4.9★</span><span className="label">Rating</span></div>
                    </div>
                </div>

                <p className="copyright">© 2025 MoneyFlow</p>
            </div>

            <div className="right-panel">
                <Link href="/" className="back-link">← Back to home</Link>

                <div className="form-container">
                    <h2>Sign in to your account</h2>
                    <p className="subtitle">Don't have an account? <Link href="/signup">Sign up</Link></p>

                    <SignIn
                        afterSignInUrl="/app"
                        signUpUrl="/signup"
                        appearance={{
                            elements: {
                                rootBox: 'clerk-root',
                                card: 'clerk-card',
                                headerTitle: 'clerk-hidden',
                                headerSubtitle: 'clerk-hidden',
                                formButtonPrimary: 'clerk-btn',
                                formFieldInput: 'clerk-input',
                                footerActionLink: 'clerk-link',
                            },
                        }}
                    />
                </div>
            </div>

            <style jsx>{`
        .page { min-height: 100vh; display: flex; }
        
        .left-panel { width: 45%; background: linear-gradient(135deg, #0a0a0f 0%, #12121a 100%); padding: 2rem; display: flex; flex-direction: column; position: relative; overflow: hidden; }
        .left-panel::before { content: ''; position: absolute; top: 20%; left: -20%; width: 60%; height: 60%; background: radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 70%); }
        .left-panel::after { content: ''; position: absolute; bottom: 10%; right: -10%; width: 40%; height: 40%; background: radial-gradient(circle, rgba(168,85,247,0.1) 0%, transparent 70%); }
        
        .logo { display: flex; align-items: center; gap: 0.75rem; font-size: 1.25rem; font-weight: 700; position: relative; z-index: 1; }
        .logo-icon { width: 40px; height: 40px; background: linear-gradient(135deg, var(--accent-blue), var(--accent-purple)); border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center; }
        
        .welcome { flex: 1; display: flex; flex-direction: column; justify-content: center; max-width: 400px; position: relative; z-index: 1; }
        .welcome h1 { font-size: 2.5rem; margin-bottom: 1rem; }
        .welcome p { color: var(--text-secondary); font-size: 1.1rem; margin-bottom: 2rem; }
        
        .stats { display: flex; gap: 2rem; }
        .stat { display: flex; flex-direction: column; }
        .value { font-size: 1.5rem; font-weight: 700; }
        .label { font-size: 0.8rem; color: var(--text-muted); }
        
        .copyright { color: var(--text-muted); font-size: 0.8rem; position: relative; z-index: 1; }
        
        .right-panel { flex: 1; background: var(--bg-primary); padding: 2rem; display: flex; flex-direction: column; }
        
        .back-link { color: var(--text-secondary); font-size: 0.9rem; margin-bottom: 2rem; }
        .back-link:hover { color: var(--text-primary); }
        
        .form-container { flex: 1; display: flex; flex-direction: column; justify-content: center; max-width: 400px; margin: 0 auto; width: 100%; }
        .form-container h2 { font-size: 1.75rem; margin-bottom: 0.5rem; }
        .subtitle { color: var(--text-secondary); margin-bottom: 2rem; }
        .subtitle a, .subtitle :global(a) { color: var(--accent-blue); }
        
        :global(.clerk-card) { background: transparent !important; box-shadow: none !important; padding: 0 !important; }
        :global(.clerk-hidden) { display: none !important; }
        :global(.clerk-btn) { background: var(--accent-blue) !important; border-radius: var(--radius-md) !important; }
        :global(.clerk-input) { background: var(--bg-secondary) !important; border: 1px solid var(--border-color) !important; border-radius: var(--radius-md) !important; color: var(--text-primary) !important; }
        :global(.clerk-link) { color: var(--accent-blue) !important; }
        
        @media (max-width: 900px) {
          .left-panel { display: none; }
          .right-panel { padding: 1.5rem; }
        }
      `}</style>
        </div>
    )
}