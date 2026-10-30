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
    { id: 'today', label: 'Today Complains', value: todayCount, icon: 'bell' },
    { id: 'users', label: 'Active Users', value: users.length, icon: 'user' },
    { id: 'all', label: 'Total Complains', value: complaints.length, icon: 'grid' },
    { id: 'chat', label: 'Chat Messages', value: messages.length, icon: 'message' },
  ]

  return (
    <AppShell title="Dashboard">
      {/* 2x2 Clean Stats Grid */}
      <div className="pa-stats-grid">
        {stats.map((s) => (
          <div key={s.id} className="pa-stat-box">
            <div className="pa-stat-top">
              <span className="pa-stat-lbl">{s.label}</span>
              <span className="pa-stat-icon">
                <Icon name={s.icon} size={16} />
              </span>
            </div>
            <div className="pa-stat-val">{s.value}</div>
          </div>
        ))}
      </div>

      {/* Today's Users Card */}
      <div className="pa-card">
        <div className="pa-card-head">
          <h2 className="pa-card-title">
            Today Users ({todays.length})
          </h2>
          {todayCount > 0 && (
            <span className="pa-badge blue">
              {todayCount} new
            </span>
          )}
        </div>

        {loading ? (
          <div className="pa-empty">
            <span className="pa-empty-title">Loading…</span>
          </div>
        ) : todays.length === 0 ? (
          <div className="pa-empty">
            <div className="pa-empty-icon">
              <Icon name="user" size={24} />
            </div>
            <strong className="pa-empty-title">No Complains Today</strong>
            <p className="pa-empty-text">Today no new complains submitted.</p>
          </div>
        ) : (
          <div className="pa-list">
            {todays.map((u) => (
              <UserRow
                key={u.clientId}
                user={u}
                to={`/user/${u.clientId}`}
                badge={u.todayCount}
              />
            ))}
          </div>
        )}
      </div>
    </AppShell>
  )
}
