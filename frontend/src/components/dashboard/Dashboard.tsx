import React from 'react'
import { useAuth } from '../../context/AuthContext'
import { useDistricts } from '../../context/DistrictContext'
import Sidebar from '../common/Sidebar'
import Mapbox from '../map/Mapbox'
import ParameterPanel from './ParameterPanel'
import ScoreCard from './ScoreCard'
import './Dashboard.css'

const Dashboard: React.FC = () => {
  return (
    <div className="dashboard">
      <div className="dashboard-layout">
        {/* Left Sidebar - Districts List */}
        <div className="dashboard-sidebar">
          <Sidebar />
        </div>

        {/* Center - Map */}
        <div className="dashboard-main">
          <div className="map-container">
            <Mapbox />
          </div>
        </div>

        {/* Right Panel - Parameters & Scores */}
        <div className="dashboard-right">
          <div className="parameter-section">
            <ParameterPanel />
          </div>
          
          <div className="score-section">
            <ScoreCard />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard