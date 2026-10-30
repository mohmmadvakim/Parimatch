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
    <Link className="admin-row" to={fullTo}>
      <div className="admin-avatar">
        {initialsOf(user.name)}
      </div>

      <div className="admin-row-meta">
        <strong className="admin-row-name">{user.name}</strong>
        <div className="admin-row-sub">
          <span className="badge accent">{complaintType}</span>
          <span style={{ fontVariantNumeric: 'tabular-nums' }}>{formatDateTime(user.lastAt || user.at)}</span>
          {badge > 1 && <span className="badge info">+{badge - 1} more</span>}
        </div>
      </div>

      <div className="admin-row-right">
        <Icon name="chevron-right" size={18} className="icon-chevron" />
      </div>
    </Link>
  )
}
