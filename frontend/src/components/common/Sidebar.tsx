import React from 'react'
import { useDistricts } from '../../context/DistrictContext'
import DistrictList from '../dashboard/DistrictList'
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
          <DistrictList
            districts={districts}
            selectedDistrict={selectedDistrict}
            onSelectDistrict={selectDistrict}
          />
        )}
      </div>
    </div>
  )
}

export default Sidebar