'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false)
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="page">
      {/* Navbar */}
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="nav-container">
          <button className="logo" onClick={() => scrollToSection('hero')}>
            <div className="logo-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L2 7l10 5 10-5-10-5z" fill="currentColor" opacity="0.3" />
                <path d="M2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span>MoneyFlow</span>
          </button>

          <div className="nav-links">
            <button onClick={() => scrollToSection('features')}>Features</button>
            <button onClick={() => scrollToSection('about')}>About</button>
            <button onClick={() => scrollToSection('pricing')}>Pricing</button>
            <button onClick={() => scrollToSection('contact')}>Contact</button>
          </div>

          <div className="nav-auth">
            <Link href="/login" className="btn-login">Log in</Link>
            <Link href="/signup" className="btn-signup">
              <span>Get Started</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          <button className="mobile-toggle" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>

        {/* Mobile Menu */}
        <div className={`mobile-menu ${mobileMenuOpen ? 'open' : ''}`}>
          <button onClick={() => scrollToSection('features')}>Features</button>
          <button onClick={() => scrollToSection('about')}>About</button>
          <button onClick={() => scrollToSection('pricing')}>Pricing</button>
          <button onClick={() => scrollToSection('contact')}>Contact</button>
          <div className="mobile-auth">
            <Link href="/login" className="btn-login-mobile">Log in</Link>
            <Link href="/signup" className="btn-signup-mobile">Get Started Free</Link>
          </div>
        </div>
      </nav>

      <main>
        {/* Hero Section */}
        <section id="hero" className="hero">
          <div className="hero-bg">
            <div className="gradient-orb orb-1"></div>
            <div className="gradient-orb orb-2"></div>
          </div>
          <div className="hero-content">
            <div className="badge">
              <span className="badge-dot"></span>
              <span>Now with AI-powered insights</span>
            </div>
            <h1>Take control of <span className="gradient-text">your money</span></h1>
            <p>Track expenses, manage budgets, and achieve your financial goals with our intelligent money management platform.</p>
            <div className="hero-buttons">
              <Link href="/signup" className="btn-cta-primary">
                <span>Start Free Trial</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
              <button onClick={() => scrollToSection('features')} className="btn-cta-secondary">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" /><path d="M10 8l6 4-6 4V8z" fill="currentColor" />
                </svg>
                <span>See how it works</span>
              </button>
            </div>
            <div className="trust-badges">
              <div className="trust-item"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6L9 17l-5-5" /></svg><span>Free 14-day trial</span></div>
              <div className="trust-item"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6L9 17l-5-5" /></svg><span>No credit card required</span></div>
              <div className="trust-item"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6L9 17l-5-5" /></svg><span>Cancel anytime</span></div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="stats">
          <div className="stats-grid">
            <div className="stat"><span className="stat-value">50K+</span><span className="stat-label">Active Users</span></div>
            <div className="stat"><span className="stat-value">$2.5B+</span><span className="stat-label">Money Tracked</span></div>
            <div className="stat"><span className="stat-value">4.9/5</span><span className="stat-label">App Rating</span></div>
            <div className="stat"><span className="stat-value">99.9%</span><span className="stat-label">Uptime</span></div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="features">
          <div className="section-header">
            <span className="section-tag">Features</span>
            <h2>Everything you need to master your finances</h2>
            <p>Powerful tools designed to give you complete control over your money</p>
          </div>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">💰</div>
              <h3>Expense Tracking</h3>
              <p>Automatically categorize and track every transaction in real-time.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>Smart Budgets</h3>
              <p>Create flexible budgets that adapt to your spending patterns.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🎯</div>
              <h3>Savings Goals</h3>
              <p>Set financial goals and watch your progress with visual charts.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📈</div>
              <h3>Visual Analytics</h3>
              <p>Beautiful charts and insights that make finances simple.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔔</div>
              <h3>Smart Alerts</h3>
              <p>Get notified about unusual spending and upcoming bills.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔒</div>
              <h3>Bank Security</h3>
              <p>256-bit encryption keeps your financial data safe.</p>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="about">
          <div className="about-content">
            <div className="about-text">
              <span className="section-tag">About Us</span>
              <h2>Our mission is <span className="gradient-text">financial freedom</span></h2>
              <p>MoneyFlow was born from a simple frustration: why is managing money so complicated?</p>
              <p>Our founders met while working at a large financial institution and saw how existing tools failed everyday people. In 2021, they left to build something better.</p>
              <p>Today, we serve over 100,000 users worldwide. But we're just getting started.</p>
            </div>
            <div className="values-grid">
              <div className="value-card">
                <div className="value-icon">❤️</div>
                <h4>User First</h4>
                <p>Every feature helps you achieve financial freedom.</p>
              </div>
              <div className="value-card">
                <div className="value-icon">🔒</div>
                <h4>Trust & Security</h4>
                <p>Bank-level encryption. We never sell your data.</p>
              </div>
              <div className="value-card">
                <div className="value-icon">💡</div>
                <h4>Simplicity</h4>
                <p>Powerful tools that anyone can use.</p>
              </div>
              <div className="value-card">
                <div className="value-icon">⚡</div>
                <h4>Innovation</h4>
                <p>Pushing boundaries with AI and automation.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="pricing">
          <div className="section-header">
            <span className="section-tag">Pricing</span>
            <h2>Simple, transparent pricing</h2>
            <p>Choose the plan that works for you. All plans include a 14-day free trial.</p>
          </div>
          <div className="pricing-grid">
            <div className="price-card">
              <h3>Free</h3>
              <p className="price-desc">Perfect for getting started</p>
              <div className="price"><span className="amount">$0</span><span className="period">/month</span></div>
              <Link href="/signup" className="btn-price">Get Started</Link>
              <ul>
                <li><span className="check">✓</span> 100 transactions/month</li>
                <li><span className="check">✓</span> 1 bank account</li>
                <li><span className="check">✓</span> Basic categories</li>
                <li><span className="check">✓</span> Monthly reports</li>
              </ul>
            </div>
            <div className="price-card popular">
              <div className="popular-badge">✨ Most Popular</div>
              <h3>Pro</h3>
              <p className="price-desc">For serious money managers</p>
              <div className="price"><span className="amount">$9</span><span className="period">/month</span></div>
              <Link href="/signup" className="btn-price-primary">Start Free Trial</Link>
              <ul>
                <li><span className="check">✓</span> Unlimited transactions</li>
                <li><span className="check">✓</span> Unlimited accounts</li>
                <li><span className="check">✓</span> Custom categories</li>
                <li><span className="check">✓</span> Advanced analytics</li>
                <li><span className="check">✓</span> AI insights</li>
                <li><span className="check">✓</span> Priority support</li>
              </ul>
            </div>
            <div className="price-card">
              <h3>Enterprise</h3>
              <p className="price-desc">For teams and businesses</p>
              <div className="price"><span className="amount">$29</span><span className="period">/month</span></div>
              <button onClick={() => scrollToSection('contact')} className="btn-price">Contact Sales</button>
              <ul>
                <li><span className="check">✓</span> Everything in Pro</li>
                <li><span className="check">✓</span> Team collaboration</li>
                <li><span className="check">✓</span> API access</li>
                <li><span className="check">✓</span> SSO authentication</li>
                <li><span className="check">✓</span> Dedicated manager</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="contact">
          <div className="contact-content">
            <div className="contact-info">
              <span className="section-tag">Contact</span>
              <h2>Get in touch</h2>
              <p>Have a question? We'd love to hear from you.</p>
              <div className="contact-methods">
                <div className="method"><span className="method-icon">📧</span><span>hello@moneyflow.app</span></div>
                <div className="method"><span className="method-icon">📞</span><span>+1 (555) 123-4567</span></div>
                <div className="method"><span className="method-icon">📍</span><span>123 Finance St, NY 10001</span></div>
              </div>
            </div>
            <form className="contact-form" onSubmit={(e) => e.preventDefault()}>
              <div className="form-row">
                <div className="form-group"><label>Name</label><input type="text" placeholder="John Doe" /></div>
                <div className="form-group"><label>Email</label><input type="email" placeholder="john@example.com" /></div>
              </div>
              <div className="form-group"><label>Message</label><textarea rows={4} placeholder="How can we help?"></textarea></div>
              <button type="submit" className="btn-submit">Send Message</button>
            </form>
          </div>
        </section>

        {/* Final CTA */}
        <section className="final-cta">
          <div className="cta-content">
            <h2>Ready to transform your finances?</h2>
            <p>Join thousands of users who have taken control of their money.</p>
            <Link href="/signup" className="btn-cta-white">
              <span>Get Started Free</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-brand">
            <div className="logo">
              <div className="logo-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2L2 7l10 5 10-5-10-5z" fill="currentColor" opacity="0.3" />
                  <path d="M2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <span>MoneyFlow</span>
            </div>
            <p>Take control of your finances with intelligent tracking.</p>
          </div>
          <div className="footer-links">
            <div className="footer-col">
              <h4>Product</h4>
              <button onClick={() => scrollToSection('features')}>Features</button>
              <button onClick={() => scrollToSection('pricing')}>Pricing</button>
            </div>
            <div className="footer-col">
              <h4>Company</h4>
              <button onClick={() => scrollToSection('about')}>About</button>
              <button onClick={() => scrollToSection('contact')}>Contact</button>
            </div>
            <div className="footer-col">
              <h4>Legal</h4>
              <button>Privacy</button>
              <button>Terms</button>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2025 MoneyFlow. All rights reserved.</p>
        </div>
      </footer>

      <style jsx>{`
        .page { min-height: 100vh; }
        
        /* Navbar */
        .navbar { position: fixed; top: 0; left: 0; right: 0; z-index: 100; padding: 1rem 0; transition: all 0.3s; }
        .navbar.scrolled { background: rgba(10, 10, 15, 0.95); backdrop-filter: blur(20px); border-bottom: 1px solid var(--border-color); }
        .nav-container { max-width: 1200px; margin: 0 auto; padding: 0 2rem; display: flex; align-items: center; justify-content: space-between; }
        .logo { display: flex; align-items: center; gap: 0.75rem; font-size: 1.25rem; font-weight: 700; background: none; border: none; color: var(--text-primary); cursor: pointer; }
        .logo-icon { width: 40px; height: 40px; background: linear-gradient(135deg, var(--accent-blue), var(--accent-purple)); border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center; }
        .nav-links { display: flex; gap: 0.5rem; }
        .nav-links button { padding: 0.625rem 1rem; background: none; border: none; color: var(--text-secondary); font-size: 0.9rem; cursor: pointer; border-radius: var(--radius-sm); transition: all 0.2s; }
        .nav-links button:hover { color: var(--text-primary); background: var(--bg-hover); }
        .nav-auth { display: flex; align-items: center; gap: 1rem; }
        .btn-login { padding: 0.625rem 1.25rem; color: var(--text-secondary); font-size: 0.9rem; font-weight: 500; transition: color 0.2s; }
        .btn-login:hover { color: var(--text-primary); }
        .btn-signup { display: flex; align-items: center; gap: 0.5rem; padding: 0.625rem 1.25rem; background: linear-gradient(135deg, var(--accent-blue), var(--accent-purple)); color: white; border-radius: var(--radius-md); font-weight: 600; font-size: 0.9rem; transition: all 0.3s; box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3); }
        .btn-signup:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4); }
        .mobile-toggle { display: none; background: none; border: none; color: var(--text-primary); font-size: 1.5rem; cursor: pointer; }
        .mobile-menu { display: none; }
        
        /* Hero */
        .hero { position: relative; padding: 10rem 2rem 6rem; overflow: hidden; }
        .hero-bg { position: absolute; inset: 0; overflow: hidden; }
        .gradient-orb { position: absolute; border-radius: 50%; filter: blur(80px); opacity: 0.5; }
        .orb-1 { top: -20%; left: 50%; transform: translateX(-50%); width: 800px; height: 600px; background: linear-gradient(135deg, rgba(59, 130, 246, 0.3), rgba(168, 85, 247, 0.2)); }
        .orb-2 { bottom: -30%; right: -10%; width: 500px; height: 500px; background: linear-gradient(135deg, rgba(34, 197, 94, 0.2), rgba(59, 130, 246, 0.1)); }
        .hero-content { position: relative; max-width: 800px; margin: 0 auto; text-align: center; }
        .badge { display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.5rem 1rem; background: rgba(59, 130, 246, 0.1); border: 1px solid rgba(59, 130, 246, 0.2); border-radius: 50px; font-size: 0.875rem; color: var(--accent-blue); margin-bottom: 2rem; }
        .badge-dot { width: 8px; height: 8px; background: var(--accent-green); border-radius: 50%; animation: pulse 2s infinite; }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
        .hero h1 { font-size: 4rem; font-weight: 700; line-height: 1.1; margin-bottom: 1.5rem; letter-spacing: -0.02em; }
        .gradient-text { background: linear-gradient(135deg, var(--accent-green), var(--accent-blue)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        .hero p { font-size: 1.25rem; color: var(--text-secondary); margin-bottom: 2.5rem; max-width: 600px; margin-left: auto; margin-right: auto; }
        .hero-buttons { display: flex; gap: 1rem; justify-content: center; margin-bottom: 3rem; flex-wrap: wrap; }
        .btn-cta-primary { display: flex; align-items: center; gap: 0.75rem; padding: 1rem 2rem; background: linear-gradient(135deg, var(--accent-green), #059669); color: white; border-radius: var(--radius-lg); font-weight: 600; font-size: 1rem; transition: all 0.3s; box-shadow: 0 4px 20px rgba(34, 197, 94, 0.4); }
        .btn-cta-primary:hover { transform: translateY(-3px); box-shadow: 0 8px 30px rgba(34, 197, 94, 0.5); }
        .btn-cta-secondary { display: flex; align-items: center; gap: 0.75rem; padding: 1rem 2rem; background: var(--bg-card); border: 1px solid var(--border-color); color: var(--text-primary); border-radius: var(--radius-lg); font-weight: 600; font-size: 1rem; cursor: pointer; transition: all 0.3s; }
        .btn-cta-secondary:hover { background: var(--bg-hover); border-color: var(--border-hover); }
        .trust-badges { display: flex; gap: 2rem; justify-content: center; flex-wrap: wrap; }
        .trust-item { display: flex; align-items: center; gap: 0.5rem; color: var(--text-muted); font-size: 0.9rem; }
        .trust-item svg { color: var(--accent-green); }
        
        /* Stats */
        .stats { padding: 4rem 2rem; background: var(--bg-card); border-top: 1px solid var(--border-color); border-bottom: 1px solid var(--border-color); }
        .stats-grid { max-width: 1000px; margin: 0 auto; display: grid; grid-template-columns: repeat(4, 1fr); gap: 2rem; }
        .stat { text-align: center; }
        .stat-value { display: block; font-size: 2.5rem; font-weight: 700; background: linear-gradient(135deg, var(--accent-green), var(--accent-blue)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        .stat-label { color: var(--text-muted); font-size: 0.9rem; }
        
        /* Sections Common */
        .section-header { text-align: center; margin-bottom: 4rem; }
        .section-tag { display: inline-block; padding: 0.375rem 1rem; background: var(--bg-tertiary); border-radius: 50px; font-size: 0.8rem; font-weight: 600; color: var(--accent-blue); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 1rem; }
        .section-header h2 { font-size: 2.5rem; margin-bottom: 1rem; }
        .section-header p { color: var(--text-secondary); font-size: 1.1rem; max-width: 600px; margin: 0 auto; }
        
        /* Features */
        .features { padding: 6rem 2rem; max-width: 1200px; margin: 0 auto; }
        .features-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; }
        .feature-card { background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius-lg); padding: 2rem; transition: all 0.3s; }
        .feature-card:hover { border-color: var(--border-hover); transform: translateY(-4px); box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3); }
        .feature-icon { font-size: 2.5rem; margin-bottom: 1rem; }
        .feature-card h3 { font-size: 1.25rem; margin-bottom: 0.5rem; }
        .feature-card p { color: var(--text-secondary); font-size: 0.9rem; }
        
        /* About */
        .about { padding: 6rem 2rem; background: var(--bg-secondary); }
        .about-content { max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; align-items: center; }
        .about-text h2 { font-size: 2.5rem; margin: 1rem 0; }
        .about-text p { color: var(--text-secondary); margin-bottom: 1rem; line-height: 1.8; }
        .values-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
        .value-card { background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 1.5rem; }
        .value-icon { font-size: 1.5rem; margin-bottom: 0.75rem; }
        .value-card h4 { font-size: 1rem; margin-bottom: 0.25rem; }
        .value-card p { color: var(--text-muted); font-size: 0.8rem; }
        
        /* Pricing */
        .pricing { padding: 6rem 2rem; max-width: 1100px; margin: 0 auto; }
        .pricing-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; }
        .price-card { background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius-xl); padding: 2rem; position: relative; }
        .price-card.popular { border-color: var(--accent-blue); background: linear-gradient(180deg, rgba(59,130,246,0.1) 0%, var(--bg-card) 100%); }
        .popular-badge { position: absolute; top: -12px; left: 50%; transform: translateX(-50%); padding: 0.5rem 1rem; background: var(--accent-blue); color: white; font-size: 0.8rem; font-weight: 600; border-radius: 50px; white-space: nowrap; }
        .price-card h3 { font-size: 1.5rem; margin-bottom: 0.5rem; }
        .price-desc { color: var(--text-muted); font-size: 0.9rem; margin-bottom: 1.5rem; }
        .price { margin-bottom: 1.5rem; }
        .amount { font-size: 3rem; font-weight: 700; }
        .period { color: var(--text-muted); }
        .btn-price { display: block; width: 100%; padding: 1rem; background: var(--bg-tertiary); border: 1px solid var(--border-color); border-radius: var(--radius-md); color: var(--text-primary); font-weight: 600; cursor: pointer; text-align: center; transition: all 0.2s; }
        .btn-price:hover { background: var(--bg-hover); }
        .btn-price-primary { display: block; width: 100%; padding: 1rem; background: linear-gradient(135deg, var(--accent-blue), var(--accent-purple)); border: none; border-radius: var(--radius-md); color: white; font-weight: 600; text-align: center; transition: all 0.2s; }
        .btn-price-primary:hover { filter: brightness(1.1); transform: translateY(-2px); }
        .price-card ul { list-style: none; margin-top: 1.5rem; }
        .price-card li { display: flex; align-items: center; gap: 0.75rem; padding: 0.5rem 0; font-size: 0.9rem; color: var(--text-secondary); }
        .check { color: var(--accent-green); }
        
        /* Contact */
        .contact { padding: 6rem 2rem; background: var(--bg-secondary); }
        .contact-content { max-width: 1000px; margin: 0 auto; display: grid; grid-template-columns: 1fr 1.2fr; gap: 4rem; }
        .contact-info h2 { font-size: 2rem; margin: 1rem 0; }
        .contact-info > p { color: var(--text-secondary); margin-bottom: 2rem; }
        .contact-methods { display: flex; flex-direction: column; gap: 1rem; }
        .method { display: flex; align-items: center; gap: 1rem; padding: 1rem; background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius-md); }
        .method-icon { font-size: 1.25rem; }
        .contact-form { background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius-xl); padding: 2rem; }
        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
        .form-group { margin-bottom: 1rem; }
        .form-group label { display: block; font-size: 0.8rem; font-weight: 600; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.5rem; }
        .form-group input, .form-group textarea { width: 100%; padding: 0.875rem 1rem; background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: var(--radius-md); color: var(--text-primary); font-family: inherit; font-size: 0.9rem; }
        .form-group input:focus, .form-group textarea:focus { outline: none; border-color: var(--accent-blue); }
        .btn-submit { width: 100%; padding: 1rem; background: linear-gradient(135deg, var(--accent-blue), var(--accent-purple)); border: none; border-radius: var(--radius-md); color: white; font-size: 1rem; font-weight: 600; cursor: pointer; transition: all 0.2s; }
        .btn-submit:hover { filter: brightness(1.1); transform: translateY(-2px); }
        
        /* Final CTA */
        .final-cta { padding: 6rem 2rem; background: linear-gradient(135deg, var(--accent-blue), var(--accent-purple)); text-align: center; }
        .cta-content h2 { font-size: 2.5rem; margin-bottom: 1rem; }
        .cta-content p { font-size: 1.25rem; opacity: 0.9; margin-bottom: 2rem; }
        .btn-cta-white { display: inline-flex; align-items: center; gap: 0.75rem; padding: 1rem 2rem; background: white; color: var(--bg-primary); border-radius: var(--radius-lg); font-weight: 600; font-size: 1rem; transition: all 0.3s; }
        .btn-cta-white:hover { transform: translateY(-3px); box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2); }
        
        /* Footer */
        .footer { background: var(--bg-primary); border-top: 1px solid var(--border-color); padding: 4rem 2rem 2rem; }
        .footer-content { max-width: 1200px; margin: 0 auto; display: flex; justify-content: space-between; margin-bottom: 3rem; }
        .footer-brand { max-width: 300px; }
        .footer-brand p { color: var(--text-muted); font-size: 0.9rem; margin-top: 1rem; }
        .footer-links { display: flex; gap: 4rem; }
        .footer-col { display: flex; flex-direction: column; gap: 0.75rem; }
        .footer-col h4 { font-size: 0.875rem; font-weight: 600; margin-bottom: 0.5rem; }
        .footer-col button { background: none; border: none; color: var(--text-muted); font-size: 0.875rem; cursor: pointer; text-align: left; padding: 0; }
        .footer-col button:hover { color: var(--text-primary); }
        .footer-bottom { max-width: 1200px; margin: 0 auto; padding-top: 2rem; border-top: 1px solid var(--border-color); }
        .footer-bottom p { color: var(--text-muted); font-size: 0.875rem; }
        
        /* Mobile Responsive */
        @media (max-width: 900px) {
          .nav-links, .nav-auth { display: none; }
          .mobile-toggle { display: block; }
          .mobile-menu { display: flex; flex-direction: column; gap: 0.5rem; padding: 1rem 2rem 2rem; border-top: 1px solid var(--border-color); margin-top: 1rem; max-height: 0; overflow: hidden; transition: all 0.3s; }
          .mobile-menu.open { max-height: 400px; }
          .mobile-menu button { padding: 0.75rem; background: none; border: none; color: var(--text-secondary); font-size: 1rem; text-align: left; cursor: pointer; border-radius: var(--radius-sm); }
          .mobile-menu button:hover { background: var(--bg-hover); color: var(--text-primary); }
          .mobile-auth { display: flex; flex-direction: column; gap: 0.75rem; margin-top: 1rem; padding-top: 1rem; border-top: 1px solid var(--border-color); }
          .btn-login-mobile { padding: 0.875rem; background: var(--bg-tertiary); border-radius: var(--radius-md); color: var(--text-primary); text-align: center; font-weight: 500; }
          .btn-signup-mobile { padding: 0.875rem; background: linear-gradient(135deg, var(--accent-blue), var(--accent-purple)); border-radius: var(--radius-md); color: white; text-align: center; font-weight: 600; }
          
          .hero h1 { font-size: 2.5rem; }
          .stats-grid { grid-template-columns: repeat(2, 1fr); }
          .features-grid { grid-template-columns: 1fr; }
          .about-content { grid-template-columns: 1fr; }
          .pricing-grid { grid-template-columns: 1fr; max-width: 400px; margin: 0 auto; }
          .contact-content { grid-template-columns: 1fr; }
          .footer-content { flex-direction: column; gap: 3rem; }
          .footer-links { gap: 2rem; flex-wrap: wrap; }
        }
      `}</style>
    </div>
  )
}