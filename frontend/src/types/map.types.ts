export interface MapLayer {
    id: string
    name: string
    url: string
    visible: boolean
    opacity: number
}

export interface MapViewState {
    longitude: number
    latitude: number
    zoom: number
}

export interface DistrictFeature {
    type: 'Feature'
    properties: {
        id: number
        name: string
        soviScore: number
        rating: number
        province?: string
    }
    geometry: {
        type: 'Polygon'
        coordinates: number[][][]
    }
}

export interface MapBounds {
    minLng: number
    minLat: number
    maxLng: number
    maxLat: number
}

export interface WMSLayerConfig {
    service: string
    version: string
    request: string
    layers: string
    bbox: string
    width: number
    height: number
    srs: string
    format: string
}