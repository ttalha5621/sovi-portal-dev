import { useEffect, useRef, useState, useCallback } from 'react'
import mapboxgl, { Map } from 'mapbox-gl'
import mapService from '../services/map.service'
import { MapLayer, MapViewState, DistrictFeature } from '../types/map.types'
import { SOVI_CONSTANTS } from '../utils/constants'

mapboxgl.accessToken = mapService.getMapboxToken()

interface UseMapboxOptions {
    containerId: string
    initialViewState?: MapViewState
    layers?: MapLayer[]
    onDistrictClick?: (district: any) => void
    onLoad?: (map: Map) => void
}

export const useMapbox = (options: UseMapboxOptions) => {
    const {
        containerId,
        initialViewState = {
            longitude: SOVI_CONSTANTS.MAP_CONFIG.DEFAULT_CENTER[0],
            latitude: SOVI_CONSTANTS.MAP_CONFIG.DEFAULT_CENTER[1],
            zoom: SOVI_CONSTANTS.MAP_CONFIG.DEFAULT_ZOOM,
        },
        layers = mapService.getDefaultLayers(),
        onDistrictClick,
        onLoad,
    } = options

    const mapContainer = useRef<HTMLDivElement>(null)
    const map = useRef<Map | null>(null)
    const [isLoaded, setIsLoaded] = useState(false)
    const [viewState, setViewState] = useState<MapViewState>(initialViewState)

    // Initialize map
    useEffect(() => {
        if (!mapContainer.current || map.current) return

        map.current = new mapboxgl.Map({
            container: containerId,
            style: 'mapbox://styles/mapbox/light-v10',
            center: [viewState.longitude, viewState.latitude],
            zoom: viewState.zoom,
            minZoom: SOVI_CONSTANTS.MAP_CONFIG.MIN_ZOOM,
            maxZoom: SOVI_CONSTANTS.MAP_CONFIG.MAX_ZOOM,
            attributionControl: false,
        })

        // Add navigation controls
        map.current.addControl(new mapboxgl.NavigationControl(), 'top-right')

        // Add scale control
        map.current.addControl(new mapboxgl.ScaleControl({
            maxWidth: 100,
            unit: 'metric',
        }), 'bottom-left')

        // Handle map load
        map.current.on('load', () => {
            setIsLoaded(true)

            // Add WMS layers
            layers.forEach(layer => {
                addWMSLayer(layer)
            })

            if (onLoad) {
                onLoad(map.current!)
            }
        })

        // Update view state on move
        map.current.on('move', () => {
            if (!map.current) return

            const { lng, lat } = map.current.getCenter()
            const zoom = map.current.getZoom()

            setViewState({
                longitude: lng,
                latitude: lat,
                zoom,
            })
        })

        // Cleanup
        return () => {
            if (map.current) {
                map.current.remove()
                map.current = null
            }
        }
    }, [])

    // Add WMS layer
    const addWMSLayer = useCallback((layer: MapLayer) => {
        if (!map.current || !isLoaded) return

        const sourceId = `${layer.id}-source`
        const layerId = `${layer.id}-raster`

        // Remove existing layer if it exists
        if (map.current.getLayer(layerId)) {
            map.current.removeLayer(layerId)
        }
        if (map.current.getSource(sourceId)) {
            map.current.removeSource(sourceId)
        }

        // Add WMS source
        map.current.addSource(sourceId, {
            type: 'raster',
            tiles: [mapService.getWMSSourceUrl(layer)],
            tileSize: 256,
        })

        // Add raster layer
        map.current.addLayer({
            id: layerId,
            type: 'raster',
            source: sourceId,
            paint: {
                'raster-opacity': layer.visible ? layer.opacity : 0,
            },
        })
    }, [isLoaded])

    // Update layers when they change
    useEffect(() => {
        if (!map.current || !isLoaded) return

        layers.forEach(layer => {
            const layerId = `${layer.id}-raster`

            if (map.current?.getLayer(layerId)) {
                map.current.setPaintProperty(layerId, 'raster-opacity', layer.visible ? layer.opacity : 0)
            } else {
                addWMSLayer(layer)
            }
        })
    }, [layers, isLoaded, addWMSLayer])

    // Fly to location
    const flyTo = useCallback((coordinates: [number, number], zoom?: number) => {
        if (!map.current) return

        map.current.flyTo({
            center: coordinates,
            zoom: zoom || SOVI_CONSTANTS.MAP_CONFIG.DEFAULT_ZOOM,
            essential: true,
        })
    }, [])

    // Reset view
    const resetView = useCallback(() => {
        flyTo(SOVI_CONSTANTS.MAP_CONFIG.DEFAULT_CENTER, SOVI_CONSTANTS.MAP_CONFIG.DEFAULT_ZOOM)
    }, [flyTo])

    // Add district features
    const addDistrictFeatures = useCallback((features: DistrictFeature[]) => {
        if (!map.current || !isLoaded) return

        const sourceId = 'districts-source'
        const layerId = 'districts-layer'

        // Remove existing layer if it exists
        if (map.current.getLayer(layerId)) {
            map.current.removeLayer(layerId)
        }
        if (map.current.getSource(sourceId)) {
            map.current.removeSource(sourceId)
        }

        // Add GeoJSON source
        map.current.addSource(sourceId, {
            type: 'geojson',
            data: {
                type: 'FeatureCollection',
                features,
            },
        })

        // Add fill layer for districts
        map.current.addLayer({
            id: layerId,
            type: 'fill',
            source: sourceId,
            paint: {
                'fill-color': [
                    'interpolate',
                    ['linear'],
                    ['get', 'soviScore'],
                    0, SOVI_CONSTANTS.RATING_THRESHOLDS[0].color,
                    20, SOVI_CONSTANTS.RATING_THRESHOLDS[0].color,
                    40, SOVI_CONSTANTS.RATING_THRESHOLDS[1].color,
                    60, SOVI_CONSTANTS.RATING_THRESHOLDS[2].color,
                    80, SOVI_CONSTANTS.RATING_THRESHOLDS[3].color,
                    100, SOVI_CONSTANTS.RATING_THRESHOLDS[4].color,
                ],
                'fill-opacity': 0.7,
                'fill-outline-color': '#000',
            },
        })

        // Add click event
        map.current.on('click', layerId, (e) => {
            if (!e.features || e.features.length === 0) return

            const feature = e.features[0]
            const properties = feature.properties

            if (onDistrictClick) {
                onDistrictClick(properties)
            }

            // Show popup
            const popup = new mapboxgl.Popup()
                .setLngLat(e.lngLat)
                .setHTML(`
          <div class="p-2">
            <h3 class="font-bold text-lg">${properties.name}</h3>
            <p class="text-sm text-gray-600">${properties.province || 'Unknown Province'}</p>
            <div class="mt-2">
              <span class="inline-block px-2 py-1 text-xs font-semibold rounded-full"
                    style="background-color: ${mapService.getDistrictColor(properties.soviScore)}; color: white">
                SoVI Score: ${properties.soviScore.toFixed(2)}
              </span>
            </div>
          </div>
        `)
                .addTo(map.current!)
        })

        // Change cursor on hover
        map.current.on('mouseenter', layerId, () => {
            if (map.current) {
                map.current.getCanvas().style.cursor = 'pointer'
            }
        })

        map.current.on('mouseleave', layerId, () => {
            if (map.current) {
                map.current.getCanvas().style.cursor = ''
            }
        })
    }, [isLoaded, onDistrictClick])

    // Remove district features
    const removeDistrictFeatures = useCallback(() => {
        if (!map.current || !isLoaded) return

        const layerId = 'districts-layer'
        const sourceId = 'districts-source'

        if (map.current.getLayer(layerId)) {
            map.current.removeLayer(layerId)
        }
        if (map.current.getSource(sourceId)) {
            map.current.removeSource(sourceId)
        }
    }, [isLoaded])

    // Export map as image
    const exportMap = useCallback(async (format: 'png' | 'jpeg' = 'png'): Promise<string> => {
        if (!map.current) {
            throw new Error('Map not initialized')
        }

        const canvas = map.current.getCanvas()
        const dataUrl = canvas.toDataURL(`image/${format}`)

        return dataUrl
    }, [])

    return {
        mapContainer,
        map: map.current,
        isLoaded,
        viewState,
        flyTo,
        resetView,
        addDistrictFeatures,
        removeDistrictFeatures,
        exportMap,
    }
}