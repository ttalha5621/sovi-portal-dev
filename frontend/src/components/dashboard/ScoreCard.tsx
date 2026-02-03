import React from 'react'
import { useDistricts } from '../../context/DistrictContext'
import './ScoreCard.css'

const ScoreCard: React.FC = () => {
  const { selectedDistrict, districtData } = useDistricts()

  return (
    <div className="score-card">
      <div className="score-header">
        <h3 className="score-title">Individual Score of Parameter</h3>
      </div>
      
      <div className="score-content">
        {selectedDistrict ? (
          <div className="score-display">
            <div className="district-name">{selectedDistrict.name}</div>
            <div className="main-score">
              <span className="score-label">Main SoVI Score of District</span>
              <div className="score-value">
                {districtData?.totalSoVI?.toFixed(2) || '0.00'}
              </div>
            </div>
          </div>
        ) : (
          <div className="score-empty">
            <p>Select a district to view scores</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default ScoreCard