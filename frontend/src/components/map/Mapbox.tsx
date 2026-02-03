import React, { useRef, useEffect } from 'react'
import { useMapbox } from '../../hooks/useMapbox'
import { useDistricts } from '../../context/DistrictContext'
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

  useEffect(() => {
    if (isLoaded && mapData.length > 0) {
      // Add district features to map
      const features = mapData.map(district => ({
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
          coordinates: [[]] // Would be populated with actual geometry
        }
      }))
      
      addDistrictFeatures(features)
    }
  }, [isLoaded, mapData, addDistrictFeatures])

  useEffect(() => {
    if (selectedDistrict && map) {
      // Fly to selected district (would use actual coordinates)
      flyTo([71.5249, 30.3753], 8)
    }
  }, [selectedDistrict, map, flyTo])

  return (
    <div className="mapbox-container">
      <div className="map-header">
        <h2 className="map-title">Mapbox</h2>
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