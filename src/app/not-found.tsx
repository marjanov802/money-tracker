'use client'

import Link from 'next/link'

export default function NotFound() {
    return (
        <div className="page">
            <div className="content">
                <h1>404</h1>
                <p>Page not found</p>
                <Link href="/" className="btn">Go home</Link>
            </div>

            <style jsx>{`
        .page {
          min-height: 100vh;
          background: var(--bg-primary);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .content {
          text-align: center;
        }
        h1 {
          font-size: 6rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 0.5rem;
        }
        p {
          color: var(--text-muted);
          font-size: 1.25rem;
          margin-bottom: 2rem;
        }
        .btn {
          display: inline-block;
          padding: 0.875rem 2rem;
          background: var(--accent-blue);
          color: white;
          border-radius: var(--radius-md);
          font-weight: 600;
        }
      `}</style>
        </div>
    )
}