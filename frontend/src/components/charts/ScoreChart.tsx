import React from 'react'
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    Cell,
    PieChart,
    Pie,
    Sector
} from 'recharts'
import { SOVI_CONSTANTS } from '../../utils/constants'
import './ScoreChart.css'

interface ScoreChartProps {
    data: any[]
    type?: 'line' | 'bar' | 'pie'
    title?: string
    xAxisKey: string
    yAxisKey: string
    color?: string
    height?: number
    showGrid?: boolean
    showLegend?: boolean
    showTooltip?: boolean
}

const ScoreChart: React.FC<ScoreChartProps> = ({
    data,
    type = 'line',
    title,
    xAxisKey,
    yAxisKey,
    color = SOVI_CONSTANTS.PARAMETERS.EDUCATION.color,
    height = 300,
    showGrid = true,
    showLegend = true,
    showTooltip = true,
}) => {
    const renderLineChart = () => (
        <ResponsiveContainer width="100%" height={height}>
            <LineChart data={data}>
                {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />}
                <XAxis
                    dataKey={xAxisKey}
                    stroke="#6b7280"
                    fontSize={12}
                />
                <YAxis
                    stroke="#6b7280"
                    fontSize={12}
                    domain={[0, 100]}
                />
                {showTooltip && (
                    <Tooltip
                        contentStyle={{
                            backgroundColor: 'white',
                            border: '1px solid #e5e7eb',
                            borderRadius: '0.375rem',
                        }}
                    />
                )}
                {showLegend && <Legend />}
                <Line
                    type="monotone"
                    dataKey={yAxisKey}
                    stroke={color}
                    strokeWidth={2}
                    dot={{ stroke: color, strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: color, strokeWidth: 2 }}
                />
            </LineChart>
        </ResponsiveContainer>
    )

    const renderBarChart = () => (
        <ResponsiveContainer width="100%" height={height}>
            <BarChart data={data}>
                {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />}
                <XAxis
                    dataKey={xAxisKey}
                    stroke="#6b7280"
                    fontSize={12}
                />
                <YAxis
                    stroke="#6b7280"
                    fontSize={12}
                    domain={[0, 100]}
                />
                {showTooltip && (
                    <Tooltip
                        contentStyle={{
                            backgroundColor: 'white',
                            border: '1px solid #e5e7eb',
                            borderRadius: '0.375rem',
                        }}
                    />
                )}
                {showLegend && <Legend />}
                <Bar dataKey={yAxisKey} fill={color} radius={[4, 4, 0, 0]} />
            </BarChart>
        </ResponsiveContainer>
    )

    const renderPieChart = () => {
        const total = data.reduce((sum, item) => sum + item[yAxisKey], 0)

        return (
            <ResponsiveContainer width="100%" height={height}>
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={(entry) => `${entry[xAxisKey]}: ${((entry[yAxisKey] / total) * 100).toFixed(1)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey={yAxisKey}
                    >
                        {data.map((entry, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={SOVI_CONSTANTS.RATING_THRESHOLDS[index % SOVI_CONSTANTS.RATING_THRESHOLDS.length].color}
                            />
                        ))}
                    </Pie>
                    {showTooltip && <Tooltip />}
                    {showLegend && <Legend />}
                </PieChart>
            </ResponsiveContainer>
        )
    }

    const renderChart = () => {
        switch (type) {
            case 'bar':
                return renderBarChart()
            case 'pie':
                return renderPieChart()
            case 'line':
            default:
                return renderLineChart()
        }
    }

    return (
        <div className="score-chart">
            {title && <h3 className="chart-title">{title}</h3>}
            {renderChart()}

            {data.length === 0 && (
                <div className="chart-empty">
                    <p className="empty-text">No data available</p>
                </div>
            )}
        </div>
    )
}

export default ScoreChart