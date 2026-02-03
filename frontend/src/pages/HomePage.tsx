import React from 'react'
import Header from '../components/common/Header'
import Dashboard from '../components/dashboard/Dashboard'
import './HomePage.css'

const HomePage: React.FC = () => {
  return (
    <div className="home-page">
      <Header />
      <main className="main-content">
        <Dashboard />
      </main>
    </div>
  )
}

export default HomePage