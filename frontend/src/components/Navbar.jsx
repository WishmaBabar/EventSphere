import { useState, useRef, useEffect } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { LayoutDashboard, LogOut, ChevronDown, Plus, ShieldCheck, Ticket } from 'lucide-react'
import Badge from './ui/Badge'
import toast from 'react-hot-toast'

export default function Navbar() {
  const { user, isAdmin, logout } = useAuth()
  const navigate = useNavigate()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    function handleClick(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const handleLogout = () => {
    logout()
    toast.success('Logged out successfully')
    navigate('/login')
  }

  const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U'

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        {/* Logo */}
        <NavLink to="/dashboard" className="navbar-logo" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div className="navbar-logo-icon animate-morph" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
          </div>
          <span className="text-gradient" style={{ fontWeight: 800, fontSize: '1.25rem', letterSpacing: '-0.02em' }}>
            EventSphere
          </span>
        </NavLink>

        {/* Nav links */}
        <div className="navbar-nav">
          <NavLink to="/dashboard" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
            <LayoutDashboard size={16} />
            <span>Dashboard</span>
          </NavLink>
          <NavLink to="/events" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            <span>Events</span>
          </NavLink>
          {!isAdmin && (
            <NavLink to="/my-registrations" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
              <Ticket size={16} />
              <span>My Registrations</span>
            </NavLink>
          )}
          {isAdmin && (
            <>
              <NavLink to="/events/create" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
                <Plus size={16} />
                <span>Create</span>
              </NavLink>
              <NavLink to="/analytics" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="12 3 20 7.5 20 16.5 12 21 4 16.5 4 7.5 12 3"></polyline>
                  <line x1="12" y1="12" x2="20" y2="7.5"></line>
                  <line x1="12" y1="12" x2="12" y2="21"></line>
                  <line x1="12" y1="12" x2="4" y2="7.5"></line>
                </svg>
                <span>Analytics</span>
              </NavLink>
              <NavLink to="/approvals" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
                <ShieldCheck size={16} />
                <span>Approvals</span>
              </NavLink>
            </>
          )}
        </div>

        {/* User menu */}
        <div className="navbar-actions">
          {isAdmin && (
            <Badge variant="primary">
              Admin
            </Badge>
          )}
          <div className="dropdown" ref={dropdownRef}>
            <button
              className="user-avatar"
              onClick={() => setDropdownOpen(v => !v)}
              aria-label="User menu"
              title={user?.name}
            >
              {initials}
            </button>
            {dropdownOpen && (
              <div className="dropdown-menu animate-fade-in">
                <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--color-border)' }}>
                  <div style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '2px' }}>
                    {user?.name}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                    {user?.email}
                  </div>
                </div>
                <button className="dropdown-item danger" onClick={handleLogout}>
                  <LogOut size={14} />
                  <span>Log Out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
