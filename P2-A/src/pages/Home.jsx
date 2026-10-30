import { useMemo } from 'react'
import AppShell from '../components/AppShell.jsx'
import UserRow from '../components/UserRow.jsx'
import { Icon } from '../components/Icons.jsx'
import { useData } from '../App.jsx'
import { groupUsers, todayUsers } from '../lib/data.js'

export default function Home() {
  const { complaints, messages, loading } = useData()

  const todays = useMemo(() => todayUsers(complaints), [complaints])
  const users = useMemo(() => groupUsers(complaints), [complaints])
  const todayCount = todays.reduce((n, u) => n + u.todayCount, 0)

  const stats = [
    { id: 'today', label: 'Aaj ki complaints', value: todayCount, delta: 'Today', icon: 'bell' },
    { id: 'users', label: 'Total users', value: users.length, delta: 'Active', icon: 'user' },
    { id: 'all', label: 'Total complaints', value: complaints.length, delta: 'All time', icon: 'grid' },
    { id: 'chat', label: 'Chat messages', value: messages.length, delta: 'Live', icon: 'message' },
  ]

  return (
    <AppShell title="Dashboard Overview" subtitle="Real-time complaints and user status">
      {/* 4 Stat Boxes */}
      <div className="stats-grid">
        {stats.map((s) => (
          <div key={s.id} className="stat-box">
            <div className="stat-top">
              <span className="stat-icon">
                <Icon name={s.icon} size={18} />
              </span>
              <span className="stat-tag">{s.delta}</span>
            </div>
            <div className="stat-num">{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Today's Users Section */}
      <div className="card" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <div>
            <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text)' }}>
              Aaj ke users ({todays.length})
            </h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--muted)', marginTop: 2 }}>
              Sirf aaj submit ki gayi complaints wale users
            </p>
          </div>
          {todays.length > 0 && (
            <span className="badge accent">{todayCount} complaints today</span>
          )}
        </div>

        {loading ? (
          <div className="empty-state" style={{ padding: '30px' }}>
            <h2>Loading…</h2>
            <p>Fetching today's activity.</p>
          </div>
        ) : todays.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              <Icon name="user" size={28} />
            </div>
            <h2>Aaj koi complaint nahi</h2>
            <p>Aaj ke din abhi tak koi nayi user complaint nahi aayi hai. Jaise hi user submit karega, yahan turant live dikhegi.</p>
          </div>
        ) : (
          <div className="admin-list">
            {todays.map((u) => (
              <UserRow key={u.clientId} user={u} to={`/user/${u.clientId}`} badge={u.todayCount} />
            ))}
          </div>
        )}
      </div>
    </AppShell>
  )
}
