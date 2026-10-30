import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Icon } from './Icons.jsx'
import { useData } from '../App.jsx'

const LOGO = '/site/logo/logo.png'

const NAV_ITEMS = [
  { to: '/', label: 'Home', icon: 'home' },
  { to: '/all', label: 'All Complains', icon: 'grid', badgeKey: 'complaints' },
  { to: '/chat', label: 'Live Chat', icon: 'message', badgeKey: 'chat' },
  { to: '/activity', label: 'Activity', icon: 'clock' },
  { to: '/setting', label: 'Settings', icon: 'settings' },
]

export default function AppShell({ title, subtitle, back = false, right = null, children, nav = true }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { complaints = [], messages = [] } = useData()

  const base = pathname.startsWith('/admin') ? '/admin' : ''
  const getFullTo = (to) => (base ? (to === '/' ? '/admin' : `/admin${to}`) : to)

  const isTabActive = (to) => {
    const full = getFullTo(to)
    if (to === '/') return pathname === full || pathname === `${full}/`
    return pathname === full || pathname.startsWith(`${full}/`)
  }

  const getBadgeCount = (key) => {
    if (key === 'complaints') {
      const pending = complaints.filter((c) => String(c.status || 'pending').toLowerCase() === 'pending').length
      return pending > 0 ? pending : null
    }
    if (key === 'chat') {
      const userMsgs = messages.filter((m) => m.sender === 'user').length
      return userMsgs > 0 ? (userMsgs > 99 ? '99+' : userMsgs) : null
    }
    return null
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--bg)' }}>
      {/* Parimatch Header */}
      <header className="page-header">
        <div className="header-inner">
          <Link className="header-brand" to={getFullTo('/')}>
            <img className="logo-icon" src={LOGO} alt="Parimatch logo" />
            <div className="logo-text">
              <span>Parimatch</span>
              <span className="admin-tag">Admin</span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          {nav && (
            <nav className="header-nav" aria-label="Desktop Admin Navigation">
              {NAV_ITEMS.map(({ to, label, icon, badgeKey }) => {
                const count = badgeKey ? getBadgeCount(badgeKey) : null
                const active = isTabActive(to)
                return (
                  <Link
                    key={to}
                    to={getFullTo(to)}
                    className={`header-nav-link ${active ? 'active' : ''}`}
                  >
                    <Icon name={icon} size={16} />
                    <span>{label}</span>
                    {count != null && <span className="nav-badge">{count}</span>}
                  </Link>
                )
              })}
            </nav>
          )}

          <div className="header-actions">
            {back ? (
              <button
                type="button"
                className="btn secondary sm"
                onClick={() => navigate(-1)}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
              >
                <Icon name="chevron-left" size={16} />
                <span>Back</span>
              </button>
            ) : (
              <span className="badge success" style={{ background: 'rgba(53, 201, 139, 0.15)', color: '#35c98b' }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'currentColor', display: 'inline-block' }} />
                Live
              </span>
            )}

            {nav && (
              <button
                className="menu-btn"
                type="button"
                aria-label="Open menu"
                onClick={() => setMenuOpen(true)}
              >
                <Icon name="menu" size={20} />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {nav && (
        <>
          <div className={`menu-overlay ${menuOpen ? 'open' : ''}`} onClick={() => setMenuOpen(false)} />
          <nav className={`side-menu ${menuOpen ? 'open' : ''}`} aria-label="Mobile Navigation">
            <div className="side-menu-head">
              <img src={LOGO} alt="" />
              <span>Parimatch Admin</span>
              <button className="side-close" type="button" aria-label="Close" onClick={() => setMenuOpen(false)}>
                <Icon name="x" size={16} />
              </button>
            </div>
            {NAV_ITEMS.map((item) => {
              const count = item.badgeKey ? getBadgeCount(item.badgeKey) : null
              return (
                <Link
                  key={item.to}
                  className={`side-link ${isTabActive(item.to) ? 'active' : ''}`}
                  to={getFullTo(item.to)}
                  onClick={() => setMenuOpen(false)}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <Icon name={item.icon} size={18} />
                    <span>{item.label}</span>
                  </span>
                  {count != null && <span className="nav-badge">{count}</span>}
                </Link>
              )
            })}
          </nav>
        </>
      )}

      {/* Main Container */}
      <main className="container">
        {title && (
          <div className="card panel" style={{ marginBottom: 4 }}>
            <div className="panel-head">
              <div>
                <h1 className="page-title">{title}</h1>
                {subtitle && <p className="page-sub">{subtitle}</p>}
              </div>
              {right}
            </div>
          </div>
        )}
        {children}
      </main>

      {/* Mobile Bottom Navigation Bar */}
      {nav && (
        <nav className="admin-bottom-nav" aria-label="Mobile Bottom Nav">
          {NAV_ITEMS.map(({ to, label, icon, badgeKey }) => {
            const count = badgeKey ? getBadgeCount(badgeKey) : null
            const active = isTabActive(to)
            return (
              <Link
                key={to}
                to={getFullTo(to)}
                className={`admin-nav-item ${active ? 'active' : ''}`}
              >
                <div style={{ position: 'relative' }}>
                  <Icon name={icon} size={20} />
                  {count != null && (
                    <span
                      style={{
                        position: 'absolute',
                        top: -5,
                        right: -8,
                        minWidth: 15,
                        height: 15,
                        padding: '0 3px',
                        borderRadius: 999,
                        background: 'var(--accent)',
                        color: '#16181e',
                        fontSize: '0.6rem',
                        fontWeight: 800,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {count}
                    </span>
                  )}
                </div>
                <span>{label}</span>
              </Link>
            )
          })}
        </nav>
      )}

      {/* Parimatch Footer */}
      <footer className="admin-footer">
        <div className="footer-main">
          <p>&copy; 2026 Parimatch Support · Admin Control Center</p>
          <nav className="footer-nav">
            <Link to={getFullTo('/')}>Home</Link>
            <span className="sep">·</span>
            <Link to={getFullTo('/all')}>Complains</Link>
            <span className="sep">·</span>
            <Link to={getFullTo('/chat')}>Chat</Link>
            <span className="sep">·</span>
            <Link to={getFullTo('/setting')}>Settings</Link>
          </nav>
        </div>
      </footer>
    </div>
  )
}
