import React, { createContext, useState, useContext, ReactNode, useCallback } from 'react'
import mapService from '../services/map.service'
import { MapLayer, MapViewState } from '../types/map.types'
import { showError } from '../utils/helpers'

interface MapContextType {
    // State
    viewState: MapViewState
    layers: MapLayer[]
    selectedLayer: string | null
    loading: boolean

    // Map operations
    setViewState: (viewState: MapViewState) => void
    flyTo: (coordinates: [number, number], zoom?: number) => void
    resetView: () => void

    // Layer operations
    toggleLayer: (layerId: string) => void
    setLayerOpacity: (layerId: string, opacity: number) => void
    setSelectedLayer: (layerId: string | null) => void
    addLayer: (layer: MapLayer) => void
    removeLayer: (layerId: string) => void

    // Utility
    getLayerById: (layerId: string) => MapLayer | undefined
    getVisibleLayers: () => MapLayer[]
    exportMap: (format: 'png' | 'jpeg') => Promise<string>
}

const MapContext = createContext<MapContextType | undefined>(undefined)

export const useMap = () => {
    const context = useContext(MapContext)
    if (!context) {
        throw new Error('useMap must be used within a MapProvider')
    }
    return context
}

interface MapProviderProps {
    children: ReactNode
}

export const MapProvider: React.FC<MapProviderProps> = ({ children }) => {
    const [viewState, setViewState] = useState<MapViewState>({
        longitude: 71.5249,
        latitude: 30.3753,
        zoom: 4,
    })

    const [layers, setLayers] = useState<MapLayer[]>(() => {
        return mapService.getDefaultLayers()
    })

    const [selectedLayer, setSelectedLayer] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)

    const flyTo = useCallback((coordinates: [number, number], zoom: number = 8) => {
        setViewState(prev => ({
            ...prev,
            longitude: coordinates[0],
            latitude: coordinates[1],
            zoom,
        }))
    }, [])

    const resetView = useCallback(() => {
        setViewState({
            longitude: 71.5249,
            latitude: 30.3753,
            zoom: 4,
        })
    }, [])

    const toggleLayer = useCallback((layerId: string) => {
        setLayers(prev => prev.map(layer =>
            layer.id === layerId ? { ...layer, visible: !layer.visible } : layer
        ))
    }, [])

    const setLayerOpacity = useCallback((layerId: string, opacity: number) => {
        setLayers(prev => prev.map(layer =>
            layer.id === layerId ? { ...layer, opacity } : layer
        ))
    }, [])

    const addLayer = useCallback((layer: MapLayer) => {
        setLayers(prev => [...prev, layer])
    }, [])

    const removeLayer = useCallback((layerId: string) => {
        setLayers(prev => prev.filter(layer => layer.id !== layerId))
    }, [])

    const getLayerById = useCallback((layerId: string): MapLayer | undefined => {
        return layers.find(layer => layer.id === layerId)
    }, [layers])

    const getVisibleLayers = useCallback((): MapLayer[] => {
        return layers.filter(layer => layer.visible)
    }, [layers])

    const exportMap = useCallback(async (format: 'png' | 'jpeg'): Promise<string> => {
        try {
            setLoading(true)

            // In a real implementation, this would capture the map canvas
            // and convert it to a data URL
            const canvas = document.createElement('canvas')
            canvas.width = 1920
            canvas.height = 1080

            const ctx = canvas.getContext('2d')
            if (ctx) {
                // Draw a simple representation (in reality, capture map canvas)
                ctx.fillStyle = '#ffffff'
                ctx.fillRect(0, 0, canvas.width, canvas.height)

                ctx.fillStyle = '#000000'
                ctx.font = '24px Arial'
                ctx.fillText('Map Export', 100, 100)
                ctx.fillText(`Center: ${viewState.longitude.toFixed(4)}, ${viewState.latitude.toFixed(4)}`, 100, 150)
                ctx.fillText(`Zoom: ${viewState.zoom}`, 100, 200)
            }

            const dataUrl = canvas.toDataURL(`image/${format}`)

            return dataUrl
        } catch (err: any) {
            const message = err.message || 'Failed to export map'
            showError(message)
            throw err
        } finally {
            setLoading(false)
        }
    }, [viewState])

    const value: MapContextType = {
        // State
        viewState,
        layers,
        selectedLayer,
        loading,

        // Map operations
        setViewState,
        flyTo,
        resetView,

        // Layer operations
        toggleLayer,
        setLayerOpacity,
        setSelectedLayer,
        addLayer,
        removeLayer,

        // Utility
        getLayerById,
        getVisibleLayers,
        exportMap,
    }

    return (
        <MapContext.Provider value={value}>
            {children}
        </MapContext.Provider>
    )
}