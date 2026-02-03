import React, { useState } from 'react'
import { useMap } from '../../context/MapContext'
import { FiLayers, FiEye, FiEyeOff, FiSliders } from 'react-icons/fi'
import './LayerToggle.css'

interface LayerToggleProps {
    showOpacityControls?: boolean
}

const LayerToggle: React.FC<LayerToggleProps> = ({ showOpacityControls = true }) => {
    const { layers, toggleLayer, setLayerOpacity } = useMap()
    const [showControls, setShowControls] = useState(false)

    const handleOpacityChange = (layerId: string, value: number) => {
        setLayerOpacity(layerId, value / 100)
    }

    return (
        <div className="layer-toggle">
            {/* Toggle Button */}
            <button
                onClick={() => setShowControls(!showControls)}
                className="toggle-button"
                title="Layer controls"
            >
                <FiLayers />
            </button>

            {/* Controls Panel */}
            {showControls && (
                <div className="controls-panel">
                    <div className="panel-header">
                        <h3 className="panel-title">Map Layers</h3>
                        <button
                            onClick={() => setShowControls(false)}
                            className="close-button"
                        >
                            ×
                        </button>
                    </div>

                    <div className="layers-list">
                        {layers.map((layer) => (
                            <div key={layer.id} className="layer-item">
                                <div className="layer-header">
                                    <button
                                        onClick={() => toggleLayer(layer.id)}
                                        className={`visibility-toggle ${layer.visible ? 'visible' : 'hidden'}`}
                                        title={layer.visible ? 'Hide layer' : 'Show layer'}
                                    >
                                        {layer.visible ? <FiEye /> : <FiEyeOff />}
                                    </button>
                                    <span className="layer-name">{layer.name}</span>
                                </div>

                                {showOpacityControls && layer.visible && (
                                    <div className="layer-controls">
                                        <div className="opacity-control">
                                            <span className="opacity-label">Opacity:</span>
                                            <div className="opacity-slider">
                                                <input
                                                    type="range"
                                                    min="0"
                                                    max="100"
                                                    value={layer.opacity * 100}
                                                    onChange={(e) => handleOpacityChange(layer.id, parseInt(e.target.value))}
                                                    className="slider-input"
                                                />
                                                <span className="opacity-value">
                                                    {Math.round(layer.opacity * 100)}%
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="panel-footer">
                        <button className="reset-button">
                            <FiSliders />
                            Reset to Defaults
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default LayerToggle