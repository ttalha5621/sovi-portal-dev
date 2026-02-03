import React from 'react'
import { useDistricts } from '../../context/DistrictContext'
import { SOVI_CONSTANTS } from '../../utils/constants'
import './ParameterPanel.css'

const ParameterPanel: React.FC = () => {
  const parameters = [
    { key: 'education', label: 'Education', color: SOVI_CONSTANTS.PARAMETERS.EDUCATION.color },
    { key: 'health', label: 'Health', color: SOVI_CONSTANTS.PARAMETERS.HEALTH.color },
    { key: 'economic', label: 'Economic', color: SOVI_CONSTANTS.PARAMETERS.ECONOMIC.color },
    { key: 'facility', label: 'Facility', color: SOVI_CONSTANTS.PARAMETERS.FACILITY.color },
    { key: 'population', label: 'Population', color: SOVI_CONSTANTS.PARAMETERS.POPULATION.color }
  ]

  return (
    <div className="parameter-panel">
      <div className="parameter-header">
        <h3 className="parameter-title">Parameters</h3>
        <p className="parameter-subtitle">Sub-Parameters Available</p>
      </div>
      
      <div className="parameter-list">
        {parameters.map((param) => (
          <div key={param.key} className="parameter-item">
            <div 
              className="parameter-indicator"
              style={{ backgroundColor: param.color }}
            />
            <span className="parameter-label">{param.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ParameterPanel