import React from 'react'
import './LoadingSpinner.css'

interface LoadingSpinnerProps {
    size?: 'small' | 'medium' | 'large'
    color?: string
    fullScreen?: boolean
    message?: string
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
    size = 'medium',
    color = 'primary-600',
    fullScreen = false,
    message = 'Loading...',
}) => {
    const sizeClasses = {
        small: 'w-6 h-6',
        medium: 'w-12 h-12',
        large: 'w-16 h-16',
    }

    const colorClasses = {
        'primary-600': 'text-primary-600',
        'white': 'text-white',
        'gray-600': 'text-gray-600',
    }

    const spinner = (
        <div className={`spinner-container ${fullScreen ? 'full-screen' : ''}`}>
            <div className="spinner-content">
                <div className={`spinner ${sizeClasses[size]} ${colorClasses[color as keyof typeof colorClasses] || colorClasses['primary-600']}`}>
                    <svg className="spinner-svg" viewBox="0 0 50 50">
                        <circle className="spinner-path" cx="25" cy="25" r="20" fill="none" strokeWidth="4" />
                    </svg>
                </div>
                {message && (
                    <p className="spinner-message">{message}</p>
                )}
            </div>
        </div>
    )

    if (fullScreen) {
        return (
            <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
                {spinner}
            </div>
        )
    }

    return spinner
}

export default LoadingSpinner