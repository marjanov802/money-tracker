'use client'
import Link from 'next/link'

export default function AboutPage() {
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
                    <h1>Our mission is <span className="gradient-text">financial freedom</span></h1>
                    <p>We believe everyone deserves powerful financial tools. MoneyFlow makes managing money simple and enjoyable.</p>
                </section>

                <section className="story">
                    <div className="story-content">
                        <h2>Our Story</h2>
                        <p>MoneyFlow was born from a simple frustration: why is managing money so complicated?</p>
                        <p>Our founders met while working at a large financial institution and saw how existing tools failed everyday people. In 2021, they left to build something better.</p>
                        <p>Today, we serve over 100,000 users worldwide. But we're just getting started.</p>
                    </div>
                </section>

                <section className="values">
                    <h2>Our Values</h2>
                    <div className="values-grid">
                        <div className="value-card">
                            <div className="value-icon">❤️</div>
                            <h3>User First</h3>
                            <p>Every feature starts with how it helps you achieve financial freedom.</p>
                        </div>
                        <div className="value-card">
                            <div className="value-icon">🔒</div>
                            <h3>Trust & Security</h3>
                            <p>Bank-level encryption. We never sell your data.</p>
                        </div>
                        <div className="value-card">
                            <div className="value-icon">💡</div>
                            <h3>Simplicity</h3>
                            <p>Powerful tools that anyone can use.</p>
                        </div>
                        <div className="value-card">
                            <div className="value-icon">⚡</div>
                            <h3>Innovation</h3>
                            <p>Pushing boundaries with AI and automation.</p>
                        </div>
                    </div>
                </section>

                <section className="team">
                    <h2>Meet Our Team</h2>
                    <div className="team-grid">
                        <div className="team-card">
                            <div className="avatar">AT</div>
                            <h3>Alex Thompson</h3>
                            <p>CEO & Co-Founder</p>
                        </div>
                        <div className="team-card">
                            <div className="avatar">SK</div>
                            <h3>Sarah Kim</h3>
                            <p>CTO & Co-Founder</p>
                        </div>
                        <div className="team-card">
                            <div className="avatar">MC</div>
                            <h3>Marcus Chen</h3>
                            <p>Head of Design</p>
                        </div>
                        <div className="team-card">
                            <div className="avatar">ER</div>
                            <h3>Emily Rodriguez</h3>
                            <p>Head of Security</p>
                        </div>
                    </div>
                </section>

                <section className="cta">
                    <h2>Join us on our mission</h2>
                    <Link href="/signup" className="btn-white btn-lg">Get Started Free →</Link>
                </section>
            </main>

            <style jsx>{`
        .page { min-height: 100vh; }
        
        .navbar { position: fixed; top: 0; left: 0; right: 0; z-index: 100; background: rgba(10, 10, 15, 0.8); backdrop-filter: blur(12px); border-bottom: 1px solid var(--border-color); }
        .nav-container { max-width: 1200px; margin: 0 auto; padding: 1rem 2rem; display: flex; align-items: center; justify-content: space-between; }
        .logo { display: flex; align-items: center; gap: 0.75rem; font-size: 1.25rem; font-weight: 700; }
        .logo-icon { width: 40px; height: 40px; background: linear-gradient(135deg, var(--accent-blue), var(--accent-purple)); border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center; }
        .nav-links { display: flex; gap: 2rem; }
        .nav-links a { color: var(--text-secondary); font-size: 0.9rem; transition: color 0.2s; }
        .nav-links a:hover { color: var(--text-primary); }
        .nav-auth { display: flex; align-items: center; gap: 1rem; }
        
        .btn-ghost { padding: 0.5rem 1rem; color: var(--text-secondary); font-size: 0.9rem; }
        .btn-ghost:hover { color: var(--text-primary); }
        .btn-primary { padding: 0.625rem 1.25rem; background: var(--accent-blue); color: white; border-radius: var(--radius-md); font-weight: 600; font-size: 0.9rem; }
        .btn-white { display: inline-block; padding: 1rem 2rem; background: white; color: var(--bg-primary); border-radius: var(--radius-md); font-weight: 600; }
        .btn-lg { font-size: 1rem; }
        
        .hero { padding: 10rem 2rem 4rem; text-align: center; max-width: 800px; margin: 0 auto; }
        .hero h1 { font-size: 3.5rem; font-weight: 700; margin-bottom: 1.5rem; }
        .gradient-text { background: linear-gradient(135deg, var(--accent-green), var(--accent-blue)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .hero p { font-size: 1.25rem; color: var(--text-secondary); }
        
        .story { padding: 4rem 2rem; max-width: 700px; margin: 0 auto; }
        .story h2 { font-size: 2rem; margin-bottom: 1.5rem; }
        .story p { color: var(--text-secondary); margin-bottom: 1rem; line-height: 1.8; }
        
        .values { padding: 4rem 2rem; max-width: 1200px; margin: 0 auto; }
        .values h2 { font-size: 2rem; text-align: center; margin-bottom: 3rem; }
        .values-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.5rem; }
        .value-card { background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius-lg); padding: 2rem; text-align: center; }
        .value-icon { font-size: 2.5rem; margin-bottom: 1rem; }
        .value-card h3 { margin-bottom: 0.5rem; }
        .value-card p { color: var(--text-secondary); font-size: 0.9rem; }
        
        .team { padding: 4rem 2rem; max-width: 1000px; margin: 0 auto; }
        .team h2 { font-size: 2rem; text-align: center; margin-bottom: 3rem; }
        .team-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 2rem; }
        .team-card { text-align: center; }
        .avatar { width: 80px; height: 80px; margin: 0 auto 1rem; background: linear-gradient(135deg, var(--accent-blue), var(--accent-purple)); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 1.5rem; }
        .team-card h3 { font-size: 1.1rem; margin-bottom: 0.25rem; }
        .team-card p { color: var(--accent-blue); font-size: 0.875rem; }
        
        .cta { padding: 6rem 2rem; text-align: center; background: linear-gradient(135deg, var(--accent-blue), var(--accent-purple)); margin-top: 4rem; }
        .cta h2 { font-size: 2.5rem; margin-bottom: 2rem; }
        
        @media (max-width: 900px) {
          .nav-links { display: none; }
          .hero h1 { font-size: 2.5rem; }
          .values-grid, .team-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 600px) {
          .values-grid, .team-grid { grid-template-columns: 1fr; }
        }
      `}</style>
        </div>
    )
}