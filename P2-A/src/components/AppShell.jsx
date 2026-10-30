import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Icon } from './Icons.jsx'
import { useData } from '../App.jsx'

const LOGO = '/site/logo/logo.png'

const NAV_ITEMS = [
  { to: '/', label: 'Home', icon: 'home' },
  { to: '/all', label: 'Complains', icon: 'grid', badgeKey: 'complaints' },
  { to: '/chat', label: 'Chat', icon: 'message', badgeKey: 'chat' },
  { to: '/activity', label: 'Activity', icon: 'clock' },
  { to: '/setting', label: 'Setting', icon: 'settings' },
]

export default function AppShell({ title, subtitle, back = false, right = null, children, nav = true }) {
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
    <div className="pa-mobile-wrap">
      {/* Mobile Sticky Header */}
      <header className="pa-header">
        <div className="pa-header-left">
          {back ? (
            <button
              type="button"
              className="pa-icon-btn"
              onClick={() => navigate(-1)}
              aria-label="Back"
            >
              <Icon name="arrow-left" size={20} />
            </button>
          ) : (
            <Link to={getFullTo('/')} style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <img
                src={LOGO}
                alt="Parimatch"
                style={{ width: 28, height: 28, objectFit: 'contain', borderRadius: 4 }}
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                }}
              />
              <span className="pa-brand-badge">PM</span>
            </Link>
          )}

          <div style={{ minWidth: 0 }}>
            <h1 className="pa-header-title">{title || 'Admin Panel'}</h1>
            {subtitle && <p className="pa-header-sub">{subtitle}</p>}
          </div>
        </div>

        {right ? (
          <div>{right}</div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span
              style={{
                display: 'inline-block',
                width: 7,
                height: 7,
                borderRadius: '50%',
                background: '#16a34a',
              }}
            />
            <span style={{ fontSize: '0.72rem', fontWeight: 600, color: '#16a34a' }}>Live</span>
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className={`pa-body ${!nav ? 'pa-body--no-nav' : ''}`}>
        {children}
      </main>

      {/* Mobile Bottom Navigation Bar */}
      {nav && (
        <nav className="pa-nav-bottom" aria-label="Bottom Navigation">
          {NAV_ITEMS.map((item) => {
            const active = isTabActive(item.to)
            const count = item.badgeKey ? getBadgeCount(item.badgeKey) : null
            return (
              <Link
                key={item.to}
                to={getFullTo(item.to)}
                className={`pa-nav-tab ${active ? 'active' : ''}`}
              >
                <div style={{ position: 'relative', display: 'inline-flex' }}>
                  <Icon name={item.icon} size={20} />
                  {count != null && (
                    <span
                      style={{
                        position: 'absolute',
                        top: -5,
                        right: -10,
                        background: '#dc2626',
                        color: '#fff',
                        fontSize: '0.62rem',
                        fontWeight: 700,
                        padding: '1px 5px',
                        borderRadius: 999,
                        minWidth: 16,
                        textAlign: 'center',
                        lineHeight: '13px',
                      }}
                    >
                      {count}
                    </span>
                  )}
                </div>
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>
      )}
    </div>
  )
}
