import React from 'react'
import { useAuth } from '../../context/AuthContext'
import './Header.css'

const Header: React.FC = () => {
  const { user, logout } = useAuth()

  return (
    <header className="header">
      <div className="header-content">
        <div className="header-left">
          <h1 className="header-title">SoVI Portal</h1>
        </div>
        
        <div className="header-center">
          <nav className="navbar">
            <span className="nav-title">Navbar</span>
          </nav>
        </div>
        
        <div className="header-right">
          {user && (
            <div className="user-menu">
              <span className="user-name">{user.name}</span>
              <button onClick={logout} className="logout-btn">
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header