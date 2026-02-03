import React from 'react'
import { FiX, FiMapPin, FiTrendingUp, FiUsers, FiHome } from 'react-icons/fi'
import { formatScore, getRatingLabel } from '../../utils/calculations'
import { SOVI_CONSTANTS } from '../../utils/constants'
import './DistrictPopup.css'

interface DistrictPopupProps {
    data: any
    position: [number, number]
    onClose: () => void
}

const DistrictPopup: React.FC<DistrictPopupProps> = ({ data, position, onClose }) => {
    const rating = data.rating || 1
    const ratingInfo = SOVI_CONSTANTS.RATING_THRESHOLDS.find(r => r.rating === rating)

    const scoreComponents = [
        { label: 'Education', value: data.scores?.Sedu || 0, color: SOVI_CONSTANTS.PARAMETERS.EDUCATION.color },
        { label: 'Health', value: data.scores?.Shealth || 0, color: SOVI_CONSTANTS.PARAMETERS.HEALTH.color },
        { label: 'Economic', value: data.scores?.Seconomic || 0, color: SOVI_CONSTANTS.PARAMETERS.ECONOMIC.color },
        { label: 'Facility', value: data.scores?.Sfacility || 0, color: SOVI_CONSTANTS.PARAMETERS.FACILITY.color },
        { label: 'Population', value: data.scores?.Spopulation || 0, color: SOVI_CONSTANTS.PARAMETERS.POPULATION.color },
    ]

    return (
        <div className="district-popup">
            <div className="popup-header">
                <div className="popup-title">
                    <FiMapPin className="popup-icon" />
                    <h3 className="popup-name">{data.name}</h3>
                </div>
                <button onClick={onClose} className="popup-close">
                    <FiX />
                </button>
            </div>

            <div className="popup-content">
                {/* Basic Info */}
                <div className="popup-info">
                    <div className="info-item">
                        <span className="info-label">Province:</span>
                        <span className="info-value">{data.province || 'N/A'}</span>
                    </div>
                    <div className="info-item">
                        <span className="info-label">Division:</span>
                        <span className="info-value">{data.division || 'N/A'}</span>
                    </div>
                </div>

                {/* Main Score */}
                <div className="popup-score">
                    <div className="score-main">
                        <span className="score-label">SoVI Score</span>
                        <div
                            className="score-value"
                            style={{ color: ratingInfo?.color }}
                        >
                            {formatScore(data.soviScore)}
                        </div>
                        <div
                            className="score-rating"
                            style={{ backgroundColor: ratingInfo?.color }}
                        >
                            {ratingInfo?.label || 'Unknown'}
                        </div>
                    </div>

                    {/* Score Components */}
                    <div className="score-components">
                        <h4 className="components-title">Component Scores</h4>
                        <div className="components-grid">
                            {scoreComponents.map((component) => (
                                <div key={component.label} className="component-item">
                                    <div className="component-header">
                                        <div
                                            className="component-color"
                                            style={{ backgroundColor: component.color }}
                                        />
                                        <span className="component-label">{component.label}</span>
                                    </div>
                                    <span className="component-value">
                                        {formatScore(component.value)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="popup-actions">
                    <button className="action-button primary">
                        <FiTrendingUp />
                        View Details
                    </button>
                    <button className="action-button secondary">
                        <FiUsers />
                        Compare
                    </button>
                    <button className="action-button outline">
                        <FiHome />
                        Dashboard
                    </button>
                </div>

                {/* Quick Stats */}
                <div className="popup-stats">
                    <div className="stat-item">
                        <span className="stat-label">Rank</span>
                        <span className="stat-value">#{data.rank || 'N/A'}</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-label">Trend</span>
                        <span className="stat-value positive">+2.5% ↗</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-label">Last Updated</span>
                        <span className="stat-value">2024</span>
                    </div>
                </div>
            </div>

            {/* Arrow */}
            <div className="popup-arrow" />
        </div>
    )
}

export default DistrictPopup