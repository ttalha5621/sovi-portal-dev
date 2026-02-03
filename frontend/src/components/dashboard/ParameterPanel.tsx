import React from 'react'
import { useDistricts } from '../../context/DistrictContext'
import { SOVI_CONSTANTS } from '../../utils/constants'
import './ParameterPanel.css'

const ParameterPanel: React.FC = () => {
  const { selectedDistrict, districtData } = useDistricts()
  
  // Use districtData if available, otherwise fallback to selectedDistrict properties if they exist
  // or default to 0
  
  const getScore = (key: string) => {
    if (!districtData) return 0
    switch(key) {
      case 'education': return districtData.Sedu || 0
      case 'health': return districtData.Shealth || 0
      case 'economic': return districtData.Seconomic || 0
      case 'facility': return districtData.Sfacility || 0
      case 'population': return districtData.Spopulation || 0
      default: return 0
    }
  }

  const parameters = [
    { key: 'education', label: 'Education', color: SOVI_CONSTANTS.PARAMETERS.EDUCATION.color },
    { key: 'health', label: 'Health', color: SOVI_CONSTANTS.PARAMETERS.HEALTH.color },
    { key: 'economic', label: 'Economic', color: SOVI_CONSTANTS.PARAMETERS.ECONOMIC.color },
    { key: 'facility', label: 'Facility', color: SOVI_CONSTANTS.PARAMETERS.FACILITY.color },
    { key: 'population', label: 'Population', color: SOVI_CONSTANTS.PARAMETERS.POPULATION.color }
  ]

  return (
    <>
    <div className="parameter-panel">
      <div className="parameter-header">
        <h3 className="parameter-title">Parameters</h3>
        <p className="parameter-subtitle">
          {selectedDistrict ? `Scores for ${selectedDistrict.name}` : 'Select a district'}
        </p>
      </div>
      
      <div className="parameter-list">
        {parameters.map((param) => {
          const score = getScore(param.key)
          return (
            <div key={param.key} className="parameter-item">
              <div className="parameter-info">
                <div 
                  className="parameter-indicator"
                  style={{ backgroundColor: param.color }}
                />
                <span className="parameter-label">{param.label}</span>
              </div>
              {selectedDistrict && (
                <div className="parameter-value">
                  {score.toFixed(2)}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
    </>
  )
}

export default ParameterPanel