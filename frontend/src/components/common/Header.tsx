import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import './Header.css'

const Header: React.FC = () => {
  const { user, logout, isAdmin } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header className="header">
      <div className="header-content">
        <div className="header-left">
          <Link to="/" className="header-title-link">
            <h1 className="header-title">SoVI Portal</h1>
          </Link>
        </div>
        
        <div className="header-center">
          <nav className="navbar">
            <Link to="/" className="nav-link">Dashboard</Link>
            <Link to="/about" className="nav-link">About</Link>
            {isAdmin && (
              <Link to="/admin" className="nav-link">Admin</Link>
            )}
          </nav>
        </div>
        
        <div className="header-right">
          {user ? (
            <div className="user-menu">
              <span className="user-name">{user.name}</span>
              <button onClick={handleLogout} className="logout-btn">
                Logout
              </button>
            </div>
          ) : (
            <div className="auth-links">
              <Link to="/login" className="login-link">Login</Link>
              <Link to="/register" className="register-link">Register</Link>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header