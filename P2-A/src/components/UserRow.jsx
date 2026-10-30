import { Link, useLocation } from 'react-router-dom'
import { Icon } from './Icons.jsx'
import { formatDateTime } from '../lib/data.js'
import { initialsOf } from './status.js'

export default function UserRow({ user, to, badge = 0 }) {
  const { pathname } = useLocation()
  const base = pathname.startsWith('/admin') ? '/admin' : ''
  const fullTo = base && to.startsWith('/') ? `${base}${to}` : to

  const complaintType = user.latestType || user.type || 'Complain'

  return (
    <Link className="pa-row-item" to={fullTo}>
      <div className="pa-avatar">
        {initialsOf(user.name)}
      </div>

      <div className="pa-row-info">
        <strong className="pa-row-name">{user.name}</strong>
        <div className="pa-row-sub">
          <span className="pa-badge blue">{complaintType}</span>
          <span>{formatDateTime(user.lastAt || user.at)}</span>
          {badge > 1 && (
            <span style={{ fontSize: '0.7rem', color: 'var(--muted)', fontWeight: 600 }}>
              +{badge - 1} more
            </span>
          )}
        </div>
      </div>

      <Icon name="chevron-right" size={18} style={{ color: '#94a3b8', flexShrink: 0 }} />
    </Link>
  )
}
