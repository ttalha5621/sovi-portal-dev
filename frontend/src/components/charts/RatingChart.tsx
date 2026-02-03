import React from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts'
import { SOVI_CONSTANTS } from '../../utils/constants'

interface RatingChartProps {
    data: Array<{
        rating: number
        count: number
        label: string
    }>
    type?: 'pie' | 'bar'
    title?: string
    height?: number
    showTooltip?: boolean
    showLegend?: boolean
}

const RatingChart: React.FC<RatingChartProps> = ({
    data,
    type = 'pie',
    title,
    height = 300,
    showTooltip = true,
    showLegend = true,
}) => {
    const getRatingColor = (rating: number) => {
        const threshold = SOVI_CONSTANTS.RATING_THRESHOLDS.find(
            t => rating >= t.min && rating <= t.max
        )
        return threshold?.color || '#6b7280'
    }

    const chartData = data.map(item => ({
        ...item,
        color: getRatingColor(item.rating),
    }))

    const renderPieChart = () => (
        <ResponsiveContainer width="100%" height={height}>
            <PieChart>
                <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ label, count, percent }) => 
                        `${label}: ${count} (${(percent * 100).toFixed(1)}%)`
                    }
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                >
                    {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                </Pie>
                {showTooltip && (
                    <Tooltip
                        formatter={(value, name) => [`${value} districts`, 'Count']}
                        contentStyle={{
                            backgroundColor: 'white',
                            border: '1px solid #e5e7eb',
                            borderRadius: '0.375rem',
                        }}
                    />
                )}
                {showLegend && <Legend />}
            </PieChart>
        </ResponsiveContainer>
    )

    const renderBarChart = () => (
        <ResponsiveContainer width="100%" height={height}>
            <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                    dataKey="label" 
                    stroke="#6b7280"
                    fontSize={12}
                />
                <YAxis 
                    stroke="#6b7280"
                    fontSize={12}
                />
                {showTooltip && (
                    <Tooltip
                        formatter={(value) => [`${value} districts`, 'Count']}
                        contentStyle={{
                            backgroundColor: 'white',
                            border: '1px solid #e5e7eb',
                            borderRadius: '0.375rem',
                        }}
                    />
                )}
                {showLegend && <Legend />}
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                    {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    )

    return (
        <div className="rating-chart">
            {title && <h3 className="chart-title">{title}</h3>}
            
            {chartData.length > 0 ? (
                type === 'pie' ? renderPieChart() : renderBarChart()
            ) : (
                <div className="chart-empty">
                    <p className="empty-text">No rating data available</p>
                </div>
            )}

            {/* Rating Legend */}
            <div className="rating-legend">
                <h4 className="legend-title">Rating Scale</h4>
                <div className="legend-items">
                    {SOVI_CONSTANTS.RATING_THRESHOLDS.map((threshold) => (
                        <div key={threshold.rating} className="legend-item">
                            <div 
                                className="legend-color"
                                style={{ backgroundColor: threshold.color }}
                            />
                            <span className="legend-label">
                                {threshold.label} ({threshold.min}-{threshold.max})
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default RatingChart