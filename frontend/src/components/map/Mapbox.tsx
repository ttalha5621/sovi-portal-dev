import React, { useRef, useEffect } from 'react'
import { useMapbox } from '../../hooks/useMapbox'
import { useDistricts } from '../../context/DistrictContext'
import { DISTRICT_COORDINATES } from '../../utils/districtCoordinates'
import './Mapbox.css'

const Mapbox: React.FC = () => {
  const mapContainer = useRef<HTMLDivElement>(null)
  const { selectedDistrict, mapData } = useDistricts()

  const {
    map,
    isLoaded,
    addDistrictFeatures,
    flyTo
  } = useMapbox({
    containerId: 'map-container',
    onDistrictClick: (district) => {
      console.log('District clicked:', district)
    }
  })

  // Helper to create a box polygon from a center point
  const createBox = (center: [number, number], size: number = 0.1) => {
    const [lng, lat] = center
    return [
      [
        [lng - size, lat - size],
        [lng + size, lat - size],
        [lng + size, lat + size],
        [lng - size, lat + size],
        [lng - size, lat - size]
      ]
    ]
  }

  useEffect(() => {
    if (isLoaded && mapData.length > 0) {
      // Add district features to map
      const features = mapData.map(district => {
        const coords = DISTRICT_COORDINATES[district.name] || [71.5, 30.5] // Default to center of Pakistan if unknown
        
        return {
          type: 'Feature' as const,
          properties: {
            id: district.id,
            name: district.name,
            soviScore: district.soviScore,
            rating: district.rating,
            province: district.province
          },
          geometry: {
            type: 'Polygon' as const,
            coordinates: createBox(coords)
          }
        }
      })
      
      addDistrictFeatures(features)
    }
  }, [isLoaded, mapData, addDistrictFeatures])

  useEffect(() => {
    if (selectedDistrict && map.current) {
      const coords = DISTRICT_COORDINATES[selectedDistrict.name]
      if (coords) {
        flyTo(coords, 8)
      }
    }
  }, [selectedDistrict, map, flyTo])

  return (
    <div className="mapbox-container">
      <div className="map-header">
        <h2 className="map-title">Interactive Map</h2>
      </div>
      <div 
        id="map-container"
        ref={mapContainer}
        className="map-canvas"
      />
      {!isLoaded && (
        <div className="map-loading">
          Loading map...
        </div>
      )}
    </div>
  )
}

export default Mapbox