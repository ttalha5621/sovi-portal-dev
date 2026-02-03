import React from 'react'
import { useMap } from '../../context/MapContext'
import {
    FiZoomIn,
    FiZoomOut,
    FiCompass,
    FiLayers,
    FiDownload,
    FiMaximize,
    FiMinimize
} from 'react-icons/fi'
import './MapControls.css'

const MapControls: React.FC = () => {
    const { viewState, flyTo, resetView, exportMap } = useMap()
    const [isFullscreen, setIsFullscreen] = React.useState(false)

    const handleZoomIn = () => {
        flyTo([viewState.longitude, viewState.latitude], viewState.zoom + 1)
    }

    const handleZoomOut = () => {
        flyTo([viewState.longitude, viewState.latitude], viewState.zoom - 1)
    }

    const handleFullscreen = () => {
        const mapContainer = document.getElementById('map-container')

        if (!document.fullscreenElement) {
            mapContainer?.requestFullscreen()
            setIsFullscreen(true)
        } else {
            document.exitFullscreen()
            setIsFullscreen(false)
        }
    }

    const handleExport = async () => {
        try {
            const dataUrl = await exportMap('png')

            // Create download link
            const link = document.createElement('a')
            link.href = dataUrl
            link.download = `sovi-map-${new Date().toISOString().split('T')[0]}.png`
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
        } catch (error) {
            console.error('Failed to export map:', error)
        }
    }

    const controlButtons = [
        {
            icon: <FiZoomIn />,
            label: 'Zoom in',
            onClick: handleZoomIn,
            disabled: viewState.zoom >= 12,
        },
        {
            icon: <FiZoomOut />,
            label: 'Zoom out',
            onClick: handleZoomOut,
            disabled: viewState.zoom <= 2,
        },
        {
            icon: <FiCompass />,
            label: 'Reset view',
            onClick: resetView,
        },
        {
            icon: <FiLayers />,
            label: 'Toggle layers',
            onClick: () => { }, // Would toggle layer panel
        },
        {
            icon: isFullscreen ? <FiMinimize /> : <FiMaximize />,
            label: isFullscreen ? 'Exit fullscreen' : 'Fullscreen',
            onClick: handleFullscreen,
        },
        {
            icon: <FiDownload />,
            label: 'Export map',
            onClick: handleExport,
        },
    ]

    return (
        <div className="map-controls">
            <div className="controls-container">
                {controlButtons.map((button) => (
                    <button
                        key={button.label}
                        onClick={button.onClick}
                        disabled={button.disabled}
                        className={`control-button ${button.disabled ? 'disabled' : ''}`}
                        title={button.label}
                    >
                        {button.icon}
                    </button>
                ))}
            </div>

            {/* Zoom Display */}
            <div className="zoom-display">
                <span className="zoom-label">Zoom:</span>
                <span className="zoom-value">{viewState.zoom.toFixed(1)}</span>
            </div>
        </div>
    )
}

export default MapControls