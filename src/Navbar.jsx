import React from 'react'
import { Link, useLocation } from 'react-router-dom'

const Navbar = () => {
  const { pathname } = useLocation()

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <div className="nav-logo">T</div>
        <span className="nav-title">TaskFlow</span>
      </div>
      <div className="nav-links">
        <Link to="/"      className={`nav-link ${pathname === '/'      ? 'active' : ''}`}>Dashboard</Link>
        <Link to="/tasks" className={`nav-link ${pathname === '/tasks' ? 'active' : ''}`}>All Tasks</Link>
        <Link to="/create" className="nav-cta">+ New Task</Link>
      </div>
    </nav>
  )
}

export default Navbar