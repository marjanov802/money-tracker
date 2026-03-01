'use client'

import { useState } from 'react'
import { Category } from '../context/TransactionContext'

type PieChartProps = {
    data: { category: Category; total: number }[]
    title: string
    total: number
}

export default function PieChart({ data, title, total }: PieChartProps) {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

    const formatCurrency = (amount: number) => new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount)

    if (data.length === 0) {
        return (
            <div className="pie-chart-container">
                <h3 className="pie-chart-title">{title}</h3>
                <div className="pie-chart-empty">
                    <div className="empty-circle">No data</div>
                </div>
                <style jsx>{`
          .pie-chart-container { background: var(--bg-card); border-radius: var(--radius-lg); padding: 1.5rem; border: 1px solid var(--border-color); }
          .pie-chart-title { font-size: 0.75rem; font-weight: 600; color: var(--text-muted); margin-bottom: 1.5rem; text-transform: uppercase; letter-spacing: 0.1em; }
          .pie-chart-empty { display: flex; justify-content: center; padding: 2rem; }
          .empty-circle { width: 180px; height: 180px; border-radius: 50%; background: var(--bg-secondary); display: flex; align-items: center; justify-content: center; color: var(--text-muted); font-size: 0.875rem; }
        `}</style>
            </div>
        )
    }

    let currentAngle = -90
    const slices = data.map((item, index) => {
        const percentage = (item.total / total) * 100
        const angle = (percentage / 100) * 360
        const startAngle = currentAngle
        currentAngle += angle
        return { ...item, percentage, startAngle, angle, index }
    })

    const createArcPath = (startAngle: number, angle: number, radius: number, innerRadius: number) => {
        const startRad = (startAngle * Math.PI) / 180
        const endRad = ((startAngle + angle) * Math.PI) / 180
        const x1 = 100 + radius * Math.cos(startRad)
        const y1 = 100 + radius * Math.sin(startRad)
        const x2 = 100 + radius * Math.cos(endRad)
        const y2 = 100 + radius * Math.sin(endRad)
        const x3 = 100 + innerRadius * Math.cos(endRad)
        const y3 = 100 + innerRadius * Math.sin(endRad)
        const x4 = 100 + innerRadius * Math.cos(startRad)
        const y4 = 100 + innerRadius * Math.sin(startRad)
        const largeArc = angle > 180 ? 1 : 0
        return `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} L ${x3} ${y3} A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${x4} ${y4} Z`
    }

    return (
        <div className="pie-chart-container">
            <h3 className="pie-chart-title">{title}</h3>
            <div className="chart-wrapper">
                <svg viewBox="0 0 200 200" className="pie-svg">
                    {slices.map((slice, i) => (
                        <path
                            key={slice.category.id}
                            d={createArcPath(slice.startAngle, slice.angle - 1, hoveredIndex === i ? 88 : 85, 50)}
                            fill={slice.category.color}
                            onMouseEnter={() => setHoveredIndex(i)}
                            onMouseLeave={() => setHoveredIndex(null)}
                            style={{ cursor: 'pointer', opacity: hoveredIndex === null || hoveredIndex === i ? 1 : 0.5, transition: 'all 0.2s' }}
                        />
                    ))}
                    <text x="100" y="95" textAnchor="middle" style={{ fill: 'var(--text-muted)', fontSize: 10 }}>Total</text>
                    <text x="100" y="115" textAnchor="middle" style={{ fill: 'var(--text-primary)', fontSize: 14, fontWeight: 600, fontFamily: 'var(--font-mono)' }}>{formatCurrency(total)}</text>
                </svg>
            </div>
            <div className="legend">
                {slices.map((slice) => (
                    <div key={slice.category.id} className="legend-item" onMouseEnter={() => setHoveredIndex(slice.index)} onMouseLeave={() => setHoveredIndex(null)}>
                        <div className="legend-color" style={{ backgroundColor: slice.category.color }} />
                        <span className="legend-icon">{slice.category.icon}</span>
                        <span className="legend-name">{slice.category.name}</span>
                        <span className="legend-value">{formatCurrency(slice.total)}</span>
                    </div>
                ))}
            </div>
            <style jsx>{`
        .pie-chart-container { background: var(--bg-card); border-radius: var(--radius-lg); padding: 1.5rem; border: 1px solid var(--border-color); }
        .pie-chart-title { font-size: 0.75rem; font-weight: 600; color: var(--text-muted); margin-bottom: 1.5rem; text-transform: uppercase; letter-spacing: 0.1em; }
        .chart-wrapper { position: relative; display: flex; justify-content: center; margin-bottom: 1.5rem; }
        .pie-svg { width: 200px; height: 200px; }
        .legend { display: flex; flex-direction: column; gap: 0.5rem; max-height: 200px; overflow-y: auto; }
        .legend-item { display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem; border-radius: var(--radius-sm); cursor: pointer; transition: background 0.2s; }
        .legend-item:hover { background: var(--bg-hover); }
        .legend-color { width: 12px; height: 12px; border-radius: 3px; flex-shrink: 0; }
        .legend-icon { font-size: 1rem; width: 24px; text-align: center; }
        .legend-name { flex: 1; font-size: 0.875rem; color: var(--text-secondary); }
        .legend-value { font-size: 0.875rem; color: var(--text-primary); font-family: var(--font-mono); }
      `}</style>
        </div>
    )
}