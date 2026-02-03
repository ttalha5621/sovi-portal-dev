import React from 'react'
import {
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    Radar,
    ResponsiveContainer,
    Tooltip,
    Legend
} from 'recharts'
import { SOVI_CONSTANTS } from '../../utils/constants'
import './ParameterChart.css'

interface ParameterChartProps {
    data: Record<string, number>
    title?: string
    height?: number
    showTooltip?: boolean
    showLegend?: boolean
}

const ParameterChart: React.FC<ParameterChartProps> = ({
    data,
    title,
    height = 400,
    showTooltip = true,
    showLegend = true,
}) => {
    // Transform data for radar chart
    const chartData = Object.entries(data).map(([key, value]) => ({
        parameter: key,
        score: value,
        fullMark: 100,
    }))

    const parameters = Object.keys(data)
    const colors = [
        SOVI_CONSTANTS.PARAMETERS.EDUCATION.color,
        SOVI_CONSTANTS.PARAMETERS.HEALTH.color,
        SOVI_CONSTANTS.PARAMETERS.ECONOMIC.color,
        SOVI_CONSTANTS.PARAMETERS.FACILITY.color,
        SOVI_CONSTANTS.PARAMETERS.POPULATION.color,
    ]

    const getParameterLabel = (key: string) => {
        const param = Object.values(SOVI_CONSTANTS.PARAMETERS).find(p =>
            p.key === key.toLowerCase()
        )
        return param?.label || key
    }

    const chartDataWithLabels = chartData.map(item => ({
        ...item,
        parameter: getParameterLabel(item.parameter),
    }))

    return (
        <div className="parameter-chart">
            {title && <h3 className="chart-title">{title}</h3>}

            {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={height}>
                    <RadarChart data={chartDataWithLabels}>
                        <PolarGrid stroke="#e5e7eb" />
                        <PolarAngleAxis
                            dataKey="parameter"
                            stroke="#6b7280"
                            fontSize={12}
                        />
                        <PolarRadiusAxis
                            angle={30}
                            domain={[0, 100]}
                            stroke="#6b7280"
                        />
                        {showTooltip && (
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'white',
                                    border: '1px solid #e5e7eb',
                                    borderRadius: '0.375rem',
                                }}
                                formatter={(value) => [`${value}`, 'Score']}
                            />
                        )}
                        {showLegend && <Legend />}
                        <Radar
                            name="Parameter Score"
                            dataKey="score"
                            stroke={colors[0]}
                            fill={colors[0]}
                            fillOpacity={0.6}
                        />
                    </RadarChart>
                </ResponsiveContainer>
            ) : (
                <div className="chart-empty">
                    <p className="empty-text">No parameter data available</p>
                </div>
            )}

            {/* Parameter Summary */}
            {chartData.length > 0 && (
                <div className="parameter-summary">
                    <h4 className="summary-title">Parameter Summary</h4>
                    <div className="summary-grid">
                        {chartData.map((item, index) => (
                            <div key={item.parameter} className="summary-item">
                                <div className="summary-header">
                                    <div
                                        className="summary-color"
                                        style={{ backgroundColor: colors[index % colors.length] }}
                                    />
                                    <span className="summary-label">{getParameterLabel(item.parameter)}</span>
                                </div>
                                <div className="summary-value">
                                    <span className="score">{item.score.toFixed(1)}</span>
                                    <span className="max">/100</span>
                                </div>
                                <div className="summary-progress">
                                    <div
                                        className="progress-bar"
                                        style={{
                                            width: `${item.score}%`,
                                            backgroundColor: colors[index % colors.length],
                                        }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

export default ParameterChart