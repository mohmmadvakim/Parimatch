import { Link, useLocation } from 'react-router-dom'
import { Avatar } from '../own/ui/data/Avatar.jsx'
import { Badge } from '../own/ui/feedback/Alert.jsx'
import { Icon } from '../own/ui/icons/Icons.jsx'
import { formatDateTime } from '../lib/data.js'
import { initialsOf } from './status.js'

/**
 * Compact user row: avatar | name + type badge + date/time | chevron
 */
export default function UserRow({ user, to, badge = 0 }) {
  const { pathname } = useLocation()
  const base = pathname.startsWith('/admin') ? '/admin' : ''
  const fullTo = base && to.startsWith('/') ? `${base}${to}` : to

  const complaintType = user.latestType || user.type || 'Complain'

  return (
    <Link className="own-list__row pa-userrow" to={fullTo}>
      <Avatar initials={initialsOf(user.name)} tone="accent" size="md" />

      <div className="own-list__meta">
        <strong>{user.name}</strong>
        <div className="pa-userrow__meta">
          <Badge tone="accent">{complaintType}</Badge>
          <span className="pa-userrow__time">{formatDateTime(user.lastAt || user.at)}</span>
          {badge > 1 ? <Badge tone="neutral">+{badge - 1} more</Badge> : null}
        </div>
      </div>

      <Icon name="chevron-right" size={16} className="pa-userrow__chev" />
    </Link>
  )
}
