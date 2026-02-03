import React from 'react'
import { useDistricts } from '../../context/DistrictContext'
import './Sidebar.css'

const Sidebar: React.FC = () => {
  const { districts, selectedDistrict, selectDistrict, loading } = useDistricts()

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2 className="sidebar-title">List of Districts</h2>
      </div>
      
      <div className="sidebar-content">
        {loading ? (
          <div className="sidebar-loading">Loading districts...</div>
        ) : (
          <div className="districts-list">
            {districts.map((district) => (
              <div
                key={district.id}
                className={`district-item ${selectedDistrict?.id === district.id ? 'selected' : ''}`}
                onClick={() => selectDistrict(district.id)}
              >
                <div className="district-name">{district.name}</div>
                <div className="district-info">
                  <span className="district-province">{district.province}</span>
                  {district.soviScore && (
                    <span className="district-score">{district.soviScore.toFixed(1)}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Sidebar