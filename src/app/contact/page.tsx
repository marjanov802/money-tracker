'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function ContactPage() {
    const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
    const [submitted, setSubmitted] = useState(false)
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        await new Promise((r) => setTimeout(r, 1000))
        setLoading(false)
        setSubmitted(true)
    }

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
                    <h1>Get in <span className="gradient-text">touch</span></h1>
                    <p>Have a question? We'd love to hear from you.</p>
                </section>

                <section className="contact-section">
                    <div className="contact-methods">
                        <div className="method">
                            <div className="method-icon">📧</div>
                            <h3>Email</h3>
                            <p>hello@moneyflow.app</p>
                        </div>
                        <div className="method">
                            <div className="method-icon">📞</div>
                            <h3>Phone</h3>
                            <p>+1 (555) 123-4567</p>
                        </div>
                        <div className="method">
                            <div className="method-icon">📍</div>
                            <h3>Office</h3>
                            <p>123 Finance St, NY 10001</p>
                        </div>
                    </div>

                    <div className="form-container">
                        {submitted ? (
                            <div className="success">
                                <div className="success-icon">✓</div>
                                <h3>Message sent!</h3>
                                <p>We'll get back to you within 24 hours.</p>
                                <button onClick={() => setSubmitted(false)} className="btn-link">Send another message</button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit}>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Name</label>
                                        <input
                                            type="text"
                                            required
                                            value={form.name}
                                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                                            placeholder="John Doe"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Email</label>
                                        <input
                                            type="email"
                                            required
                                            value={form.email}
                                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                                            placeholder="john@example.com"
                                        />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Subject</label>
                                    <select
                                        required
                                        value={form.subject}
                                        onChange={(e) => setForm({ ...form, subject: e.target.value })}
                                    >
                                        <option value="">Select a topic</option>
                                        <option value="general">General Inquiry</option>
                                        <option value="support">Technical Support</option>
                                        <option value="billing">Billing Question</option>
                                        <option value="enterprise">Enterprise Sales</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Message</label>
                                    <textarea
                                        rows={5}
                                        required
                                        value={form.message}
                                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                                        placeholder="How can we help?"
                                    />
                                </div>
                                <button type="submit" className="submit-btn" disabled={loading}>
                                    {loading ? 'Sending...' : 'Send Message →'}
                                </button>
                            </form>
                        )}
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
        
        .hero { padding: 10rem 2rem 3rem; text-align: center; }
        .hero h1 { font-size: 3.5rem; font-weight: 700; margin-bottom: 1rem; }
        .gradient-text { background: linear-gradient(135deg, var(--accent-green), var(--accent-blue)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .hero p { font-size: 1.25rem; color: var(--text-secondary); }
        
        .contact-section { max-width: 900px; margin: 0 auto; padding: 2rem; }
        
        .contact-methods { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; margin-bottom: 3rem; }
        .method { background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius-lg); padding: 1.5rem; text-align: center; }
        .method-icon { font-size: 2rem; margin-bottom: 0.75rem; }
        .method h3 { font-size: 1rem; margin-bottom: 0.25rem; }
        .method p { color: var(--accent-blue); font-size: 0.9rem; }
        
        .form-container { background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius-xl); padding: 2rem; }
        
        .success { text-align: center; padding: 3rem 1rem; }
        .success-icon { width: 60px; height: 60px; margin: 0 auto 1.5rem; background: var(--accent-green-dim); color: var(--accent-green); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; }
        .success h3 { font-size: 1.5rem; margin-bottom: 0.5rem; }
        .success p { color: var(--text-secondary); margin-bottom: 1.5rem; }
        .btn-link { background: none; border: none; color: var(--accent-blue); cursor: pointer; font-size: 0.9rem; }
        
        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
        .form-group { margin-bottom: 1.25rem; }
        label { display: block; font-size: 0.8rem; font-weight: 600; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.5rem; }
        input, select, textarea { width: 100%; padding: 0.875rem 1rem; background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: var(--radius-md); color: var(--text-primary); font-family: inherit; font-size: 0.9rem; }
        input:focus, select:focus, textarea:focus { outline: none; border-color: var(--accent-blue); }
        textarea { resize: vertical; min-height: 120px; }
        select { cursor: pointer; }
        
        .submit-btn { width: 100%; padding: 1rem; background: var(--accent-blue); border: none; border-radius: var(--radius-md); color: white; font-size: 1rem; font-weight: 600; cursor: pointer; }
        .submit-btn:hover { filter: brightness(1.1); }
        .submit-btn:disabled { opacity: 0.7; cursor: not-allowed; }
        
        @media (max-width: 900px) {
          .nav-links { display: none; }
          .hero h1 { font-size: 2.5rem; }
          .contact-methods { grid-template-columns: 1fr; }
          .form-row { grid-template-columns: 1fr; }
        }
      `}</style>
        </div>
    )
}