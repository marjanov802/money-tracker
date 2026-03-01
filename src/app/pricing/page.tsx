'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function PricingPage() {
    const [yearly, setYearly] = useState(true)

    const plans = [
        {
            name: 'Free',
            price: 0,
            description: 'Perfect for getting started',
            features: ['100 transactions/month', '1 bank account', 'Basic categories', 'Monthly reports'],
            notIncluded: ['Custom categories', 'AI insights'],
            cta: 'Get Started',
            popular: false,
        },
        {
            name: 'Pro',
            price: yearly ? 7 : 9,
            description: 'For serious money managers',
            features: ['Unlimited transactions', 'Unlimited accounts', 'Custom categories', 'Advanced analytics', 'AI insights', 'Priority support'],
            notIncluded: [],
            cta: 'Start Free Trial',
            popular: true,
        },
        {
            name: 'Enterprise',
            price: yearly ? 24 : 29,
            description: 'For teams and businesses',
            features: ['Everything in Pro', 'Team collaboration', 'API access', 'SSO authentication', 'Dedicated manager', 'Custom onboarding'],
            notIncluded: [],
            cta: 'Contact Sales',
            popular: false,
        },
    ]

    return (
        <div className="page">
            <nav className="navbar">
                <div className="nav-container">
                    <Link href="/" className="logo">
                        <div className="logo-icon">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <path d="M12 2L2 7l10 5 10-5-10-5z" fill="currentColor" opacity="0.3" />
                                <path d="M2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                        <span>MoneyFlow</span>
                    </Link>
                    <div className="nav-links">
                        <Link href="/">Home</Link>
                        <Link href="/about">About</Link>
                        <Link href="/pricing">Pricing</Link>
                        <Link href="/contact">Contact</Link>
                    </div>
                    <div className="nav-auth">
                        <Link href="/login" className="btn-ghost">Log in</Link>
                        <Link href="/signup" className="btn-primary">Get Started</Link>
                    </div>
                </div>
            </nav>

            <main>
                <section className="hero">
                    <h1>Simple, transparent <span className="gradient-text">pricing</span></h1>
                    <p>Choose the plan that works for you. All plans include a 14-day free trial.</p>

                    <div className="toggle">
                        <button className={!yearly ? 'active' : ''} onClick={() => setYearly(false)}>Monthly</button>
                        <button className={yearly ? 'active' : ''} onClick={() => setYearly(true)}>
                            Yearly <span className="badge">Save 20%</span>
                        </button>
                    </div>
                </section>

                <section className="plans">
                    <div className="plans-grid">
                        {plans.map((plan) => (
                            <div key={plan.name} className={`plan-card ${plan.popular ? 'popular' : ''}`}>
                                {plan.popular && <div className="popular-badge">✨ Most Popular</div>}
                                <h3>{plan.name}</h3>
                                <p className="plan-desc">{plan.description}</p>
                                <div className="price">
                                    <span className="amount">${plan.price}</span>
                                    <span className="period">/month</span>
                                </div>
                                <Link href={plan.name === 'Enterprise' ? '/contact' : '/signup'} className="plan-btn">
                                    {plan.cta} →
                                </Link>
                                <ul className="features">
                                    {plan.features.map((feature) => (
                                        <li key={feature} className="included">✓ {feature}</li>
                                    ))}
                                    {plan.notIncluded.map((feature) => (
                                        <li key={feature} className="not-included">✗ {feature}</li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="faq">
                    <h2>Frequently Asked Questions</h2>
                    <div className="faq-grid">
                        <div className="faq-item">
                            <h4>Can I switch plans anytime?</h4>
                            <p>Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately.</p>
                        </div>
                        <div className="faq-item">
                            <h4>Is there a free trial?</h4>
                            <p>Yes, we offer a 14-day free trial of our Pro plan. No credit card required.</p>
                        </div>
                        <div className="faq-item">
                            <h4>What payment methods do you accept?</h4>
                            <p>We accept all major credit cards, PayPal, and bank transfers for annual plans.</p>
                        </div>
                        <div className="faq-item">
                            <h4>Can I cancel anytime?</h4>
                            <p>Yes, you can cancel your subscription at any time. No cancellation fees.</p>
                        </div>
                    </div>
                </section>
            </main>

            <style jsx>{`
        .page { min-height: 100vh; }
        
        .navbar { position: fixed; top: 0; left: 0; right: 0; z-index: 100; background: rgba(10, 10, 15, 0.8); backdrop-filter: blur(12px); border-bottom: 1px solid var(--border-color); }
        .nav-container { max-width: 1200px; margin: 0 auto; padding: 1rem 2rem; display: flex; align-items: center; justify-content: space-between; }
        .logo { display: flex; align-items: center; gap: 0.75rem; font-size: 1.25rem; font-weight: 700; }
        .logo-icon { width: 40px; height: 40px; background: linear-gradient(135deg, var(--accent-blue), var(--accent-purple)); border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center; }
        .nav-links { display: flex; gap: 2rem; }
        .nav-links a { color: var(--text-secondary); font-size: 0.9rem; }
        .nav-links a:hover { color: var(--text-primary); }
        .nav-auth { display: flex; align-items: center; gap: 1rem; }
        .btn-ghost { padding: 0.5rem 1rem; color: var(--text-secondary); font-size: 0.9rem; }
        .btn-primary { padding: 0.625rem 1.25rem; background: var(--accent-blue); color: white; border-radius: var(--radius-md); font-weight: 600; font-size: 0.9rem; }
        
        .hero { padding: 10rem 2rem 4rem; text-align: center; }
        .hero h1 { font-size: 3.5rem; font-weight: 700; margin-bottom: 1rem; }
        .gradient-text { background: linear-gradient(135deg, var(--accent-green), var(--accent-blue)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .hero p { font-size: 1.25rem; color: var(--text-secondary); margin-bottom: 2rem; }
        
        .toggle { display: inline-flex; background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius-lg); padding: 0.25rem; }
        .toggle button { padding: 0.75rem 1.5rem; background: transparent; border: none; color: var(--text-secondary); font-size: 0.9rem; font-weight: 500; cursor: pointer; border-radius: var(--radius-md); display: flex; align-items: center; gap: 0.5rem; }
        .toggle button.active { background: var(--bg-hover); color: var(--text-primary); }
        .toggle .badge { padding: 0.25rem 0.5rem; background: var(--accent-green-dim); color: var(--accent-green); font-size: 0.75rem; border-radius: 50px; }
        
        .plans { padding: 2rem 2rem 4rem; max-width: 1200px; margin: 0 auto; }
        .plans-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; }
        .plan-card { background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius-xl); padding: 2rem; position: relative; }
        .plan-card.popular { border-color: var(--accent-blue); background: linear-gradient(180deg, rgba(59,130,246,0.1) 0%, var(--bg-card) 100%); }
        .popular-badge { position: absolute; top: -12px; left: 50%; transform: translateX(-50%); padding: 0.5rem 1rem; background: var(--accent-blue); color: white; font-size: 0.8rem; font-weight: 600; border-radius: 50px; white-space: nowrap; }
        .plan-card h3 { font-size: 1.5rem; margin-bottom: 0.5rem; }
        .plan-desc { color: var(--text-muted); font-size: 0.9rem; margin-bottom: 1.5rem; }
        .price { margin-bottom: 1.5rem; }
        .amount { font-size: 3rem; font-weight: 700; }
        .period { color: var(--text-muted); }
        .plan-btn { display: block; width: 100%; padding: 1rem; background: var(--accent-blue); color: white; text-align: center; border-radius: var(--radius-md); font-weight: 600; margin-bottom: 1.5rem; }
        .plan-btn:hover { filter: brightness(1.1); }
        .features { list-style: none; }
        .features li { padding: 0.5rem 0; font-size: 0.9rem; }
        .features .included { color: var(--text-secondary); }
        .features .not-included { color: var(--text-muted); }
        
        .faq { padding: 4rem 2rem; max-width: 900px; margin: 0 auto; }
        .faq h2 { text-align: center; font-size: 2rem; margin-bottom: 3rem; }
        .faq-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1.5rem; }
        .faq-item { background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius-lg); padding: 1.5rem; }
        .faq-item h4 { margin-bottom: 0.5rem; }
        .faq-item p { color: var(--text-secondary); font-size: 0.9rem; }
        
        @media (max-width: 900px) {
          .nav-links { display: none; }
          .hero h1 { font-size: 2.5rem; }
          .plans-grid { grid-template-columns: 1fr; max-width: 400px; margin: 0 auto; }
          .faq-grid { grid-template-columns: 1fr; }
        }
      `}</style>
        </div>
    )
}