'use client'
import { SignUp } from '@clerk/nextjs'
import Link from 'next/link'

export default function SignupPage() {
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
                    <h1>Start your journey</h1>
                    <p>Join thousands of users who have transformed their relationship with money.</p>
                    <ul className="benefits">
                        <li>✓ Track unlimited transactions</li>
                        <li>✓ Connect all your accounts</li>
                        <li>✓ AI-powered insights</li>
                        <li>✓ 14-day free trial</li>
                    </ul>
                </div>

                <p className="copyright">© 2025 MoneyFlow</p>
            </div>

            <div className="right-panel">
                <Link href="/" className="back-link">← Back to home</Link>

                <div className="form-container">
                    <h2>Create your account</h2>
                    <p className="subtitle">Already have an account? <Link href="/login">Sign in</Link></p>

                    <SignUp
                        afterSignUpUrl="/app"
                        signInUrl="/login"
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
        
        .left-panel { width: 45%; background: linear-gradient(135deg, var(--accent-blue) 0%, var(--accent-purple) 100%); padding: 2rem; display: flex; flex-direction: column; position: relative; overflow: hidden; }
        .left-panel::before { content: ''; position: absolute; top: 20%; left: -20%; width: 60%; height: 60%; background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%); }
        
        .logo { display: flex; align-items: center; gap: 0.75rem; font-size: 1.25rem; font-weight: 700; position: relative; z-index: 1; }
        .logo-icon { width: 40px; height: 40px; background: rgba(255,255,255,0.2); border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center; }
        
        .welcome { flex: 1; display: flex; flex-direction: column; justify-content: center; max-width: 400px; position: relative; z-index: 1; }
        .welcome h1 { font-size: 2.5rem; margin-bottom: 1rem; }
        .welcome p { opacity: 0.9; font-size: 1.1rem; margin-bottom: 2rem; }
        
        .benefits { list-style: none; }
        .benefits li { padding: 0.75rem 0; font-size: 1rem; font-weight: 500; }
        
        .copyright { opacity: 0.7; font-size: 0.8rem; position: relative; z-index: 1; }
        
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