import { SOVI_CONSTANTS } from '../utils/constants'
import { MapLayer, DistrictFeature, MapBounds } from '../types/map.types'

interface District {
    id: string
    name: string
    soviScore?: number
    rating?: number
    province: string
}

interface ClusterProperties {
    count: number
    averageScore: number
    maxScore: number
    minScore: number
}

class MapService {
    private mapboxToken: string
    private defaultLayers: MapLayer[]

    constructor() {
        this.mapboxToken = (import.meta as any).env.VITE_MAPBOX_TOKEN
        if (!this.mapboxToken) {
            throw new Error('VITE_MAPBOX_TOKEN environment variable is required')
        }
        
        this.defaultLayers = [
            {
                id: SOVI_CONSTANTS.LAYERS.NATIONAL.id,
                name: SOVI_CONSTANTS.LAYERS.NATIONAL.name,
                url: SOVI_CONSTANTS.LAYERS.NATIONAL.url,
                visible: true,
                opacity: 0.8,
            },
            {
                id: SOVI_CONSTANTS.LAYERS.PROVINCIAL.id,
                name: SOVI_CONSTANTS.LAYERS.PROVINCIAL.name,
                url: SOVI_CONSTANTS.LAYERS.PROVINCIAL.url,
                visible: true,
                opacity: 0.6,
            },
            {
                id: SOVI_CONSTANTS.LAYERS.DISTRICT.id,
                name: SOVI_CONSTANTS.LAYERS.DISTRICT.name,
                url: SOVI_CONSTANTS.LAYERS.DISTRICT.url,
                visible: true,
                opacity: 0.7,
            },
        ]
    }

    getMapboxToken(): string {
        return this.mapboxToken
    }

    getDefaultLayers(): MapLayer[] {
        return [...this.defaultLayers]
    }

    private getLayerInfo(layerId: string): { layerName: string; url: string } {
        const { NATIONAL, PROVINCIAL, DISTRICT } = SOVI_CONSTANTS.LAYERS

        if (layerId === NATIONAL.id) {
            return { layerName: NATIONAL.layerName, url: NATIONAL.url }
        } else if (layerId === PROVINCIAL.id) {
            return { layerName: PROVINCIAL.layerName, url: PROVINCIAL.url }
        } else if (layerId === DISTRICT.id) {
            return { layerName: DISTRICT.layerName, url: DISTRICT.url }
        }
        
        throw new Error(`Unknown layer ID: ${layerId}`)
    }

    getWMSSourceUrl(layer: MapLayer): string {
        const { layerName } = this.getLayerInfo(layer.id)

        const params = new URLSearchParams({
            service: 'WMS',
            version: '1.1.0',
            request: 'GetMap',
            layers: layerName,
            bbox: '60.87174689200003,23.81095778300005,79.30735174000006,37.09108839100003',
            width: '256',
            height: '256',
            srs: 'EPSG:4326',
            format: 'image/png',
            transparent: 'true',
        })

        return `${layer.url}?${params.toString()}`
    }

    getWMSLegendUrl(layerId: string): string {
        const { layerName, url } = this.getLayerInfo(layerId)

        const params = new URLSearchParams({
            service: 'WMS',
            version: '1.1.1',
            request: 'GetLegendGraphic',
            format: 'image/png',
            layer: layerName,
            legend_options: 'fontName:Times New Roman;fontSize:12;fontColor:0x000000;dpi:96',
        })

        return `${url}?${params.toString()}`
    }

    createDistrictFeature(district: District): DistrictFeature {
        if (!district || !district.id || !district.name) {
            throw new Error('Invalid district data: id and name are required')
        }
        return {
            type: 'Feature',
            properties: {
                id: district.id,
                name: district.name,
                soviScore: district.soviScore || 0,
                rating: district.rating || 1,
                province: district.province,
            },
            geometry: {
                type: 'Polygon',
                coordinates: [[]], // Would be populated with actual geometry data
            },
        }
    }

    getDistrictColor(score: number): string {
        const threshold = SOVI_CONSTANTS.RATING_THRESHOLDS.find(
            t => score >= t.min && score <= t.max
        )
        return threshold ? threshold.color : '#6b7280'
    }

    calculateBounds(features: DistrictFeature[]): MapBounds {
        if (!features || features.length === 0) {
            throw new Error('Cannot calculate bounds: features array is empty')
        }

        let minLng = 180
        let minLat = 90
        let maxLng = -180
        let maxLat = -90

        features.forEach(feature => {
            feature.geometry.coordinates.forEach(ring => {
                ring.forEach(coord => {
                    const [lng, lat] = coord
                    minLng = Math.min(minLng, lng)
                    minLat = Math.min(minLat, lat)
                    maxLng = Math.max(maxLng, lng)
                    maxLat = Math.max(maxLat, lat)
                })
            })
        })

        return {
            minLng,
            minLat,
            maxLng,
            maxLat,
        }
    }

    fitBounds(map: any, bounds: MapBounds, padding: number = 50): void {
        map.fitBounds(
            [
                [bounds.minLng, bounds.minLat],
                [bounds.maxLng, bounds.maxLat],
            ],
            { padding }
        )
    }

    addPopup(map: any, lngLat: [number, number], content: string): void {
        new mapboxgl.Popup()
            .setLngLat(lngLat)
            .setHTML(content)
            .addTo(map)
    }

    createMarker(element: HTMLElement): any {
        return new mapboxgl.Marker({
            element,
            anchor: 'bottom',
        })
    }

    getClusterProperties(districts: District[]): ClusterProperties {
        if (!districts || districts.length === 0) {
            return {
                count: 0,
                averageScore: 0,
                maxScore: 0,
                minScore: 0,
            }
        }

        const scores = districts.map(d => d.soviScore || 0)
        return {
            count: districts.length,
            averageScore: scores.reduce((sum, score) => sum + score, 0) / districts.length,
            maxScore: Math.max(...scores),
            minScore: Math.min(...scores),
        }
    }
}

export default new MapService()