import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Navbar() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout, isAdmin, isCitizen } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
    setMenuOpen(false)
  }

  const isActive = (path) => location.pathname === path
  const close = () => setMenuOpen(false)

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">
          <span className="brand-icon">⚖️</span>
          <span className="brand-name">PeopleVoice</span>
        </Link>
      </div>

      <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
        {menuOpen ? '✕' : '☰'}
      </button>

      <ul className={`navbar-links ${menuOpen ? 'open' : ''}`}>
        <li><Link to="/" className={isActive('/') ? 'active' : ''} onClick={close}>Home</Link></li>

        {!user && (
          <>
            <li><Link to="/login" className={isActive('/login') ? 'active' : ''} onClick={close}>Login</Link></li>
            <li><Link to="/register" className={isActive('/register') ? 'active' : ''} onClick={close}>Register</Link></li>
          </>
        )}

        {isCitizen && (
          <>
            <li><Link to="/register-complaint" className={isActive('/register-complaint') ? 'active' : ''} onClick={close}>File Complaint</Link></li>
            <li><Link to="/citizen-dashboard" className={isActive('/citizen-dashboard') ? 'active' : ''} onClick={close}>My Complaints</Link></li>
          </>
        )}

        {isAdmin && (
          <li><Link to="/admin-dashboard" className={isActive('/admin-dashboard') ? 'active' : ''} onClick={close}>Admin Panel</Link></li>
        )}

        {user && (
          <li className="nav-user-info">
            <span className="nav-username">👤 {user.name}</span>
            <button className="btn-logout" onClick={handleLogout}>Logout</button>
          </li>
        )}
      </ul>
    </nav>
  )
}

export default Navbar
