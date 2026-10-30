import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Icon } from '../own/ui/icons/Icons.jsx'
import IconButton from '../own/ui/button/IconButton.jsx'
import { Badge } from '../own/ui/feedback/Alert.jsx'
import { useData } from '../App.jsx'

const TABS = [
  { to: '/', label: 'Home', icon: 'home', badgeKey: null },
  { to: '/all', label: 'Complains', icon: 'grid', badgeKey: 'complaints' },
  { to: '/chat', label: 'Chat', icon: 'message', badgeKey: 'chat' },
  { to: '/activity', label: 'Activity', icon: 'clock', badgeKey: null },
  { to: '/setting', label: 'Setting', icon: 'settings', badgeKey: null },
]

/** Mobile shell — topbar + bottom nav (OWN Library BottomNav classes) */
export default function AppShell({ title, subtitle, back = false, right = null, children, nav = true }) {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { complaints = [], messages = [] } = useData()

  const base = pathname.startsWith('/admin') ? '/admin' : ''
  const getFullTo = (to) => (base ? (to === '/' ? '/admin' : `/admin${to}`) : to)

  const isTabActive = (to) => {
    const full = getFullTo(to)
    if (to === '/') {
      return pathname === full || pathname === `${full}/`
    }
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
    <div className={`pa-app ${nav ? '' : 'pa-app--no-nav'}`}>
      <header className="pa-topbar">
        <div className="pa-topbar__left">
          {back ? (
            <IconButton
              icon="chevron-left"
              label="Back"
              variant="plain"
              size="sm"
              onClick={() => navigate(-1)}
            />
          ) : (
            <span className="pa-brand">
              <span className="pa-brand__badge">P2</span>
              <span>Admin</span>
            </span>
          )}

          <div className="pa-topbar__text">
            <h1>{title}</h1>
            {subtitle ? <p>{subtitle}</p> : null}
          </div>
        </div>

        <div>
          {right || (back ? null : <Badge tone="success" dot>Live</Badge>)}
        </div>
      </header>

      <main className="pa-screen">{children}</main>

      {nav ? (
        <nav className="own-bottomnav pa-bottomnav" aria-label="Main navigation">
          {TABS.map(({ to, label, icon, badgeKey }) => {
            const fullTo = getFullTo(to)
            const active = isTabActive(to)
            const count = badgeKey ? getBadgeCount(badgeKey) : null
            return (
              <Link
                key={to}
                to={fullTo}
                className={`own-bottomnav__item ${active ? 'is-active' : ''}`}
                aria-current={active ? 'page' : undefined}
              >
                <span className="own-bottomnav__icon">
                  <Icon name={icon} size={20} />
                  {count != null && <span className="own-bottomnav__badge">{count}</span>}
                </span>
                <span className="own-bottomnav__label">{label}</span>
              </Link>
            )
          })}
        </nav>
      ) : null}
    </div>
  )
}
