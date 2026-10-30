import { useMemo } from 'react'
import { Link, useLocation } from 'react-router-dom'
import AppShell from '../components/AppShell.jsx'
import { Icon } from '../components/Icons.jsx'
import { useData } from '../App.jsx'
import { activityFeed, formatDateTime } from '../lib/data.js'

export default function Activity() {
  const { pathname } = useLocation()
  const { complaints, messages, loading } = useData()

  const base = pathname.startsWith('/admin') ? '/admin' : ''

  const events = useMemo(
    () => activityFeed(complaints, messages),
    [complaints, messages]
  )

  return (
    <AppShell title="Live Activity">
      <div className="pa-card">
        <div className="pa-card-head">
          <h2 className="pa-card-title">Recent Activity ({events.length})</h2>
        </div>

        {loading ? (
          <div className="pa-empty">
            <span className="pa-empty-title">Loading…</span>
          </div>
        ) : events.length === 0 ? (
          <div className="pa-empty">
            <div className="pa-empty-icon">
              <Icon name="clock" size={24} />
            </div>
            <strong className="pa-empty-title">No Activity</strong>
            <p className="pa-empty-text">No activity records logged yet.</p>
          </div>
        ) : (
          <div className="pa-list">
            {events.map((it) => {
              const isComplaint = it.kind === 'complaint'
              const userTo = base ? `${base}/user/${it.clientId}` : `/user/${it.clientId}`

              return (
                <Link
                  key={it.id}
                  to={userTo}
                  className="pa-row-item"
                  style={{ alignItems: 'flex-start' }}
                >
                  <span
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 6,
                      background: isComplaint ? 'var(--accent-soft)' : '#dcfce7',
                      color: isComplaint ? 'var(--accent)' : '#16a34a',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <Icon name={isComplaint ? 'grid' : 'message'} size={16} />
                  </span>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                      <strong className="pa-row-name" style={{ fontSize: '0.88rem' }}>
                        {it.title}
                      </strong>
                      <span style={{ fontSize: '0.72rem', color: 'var(--muted)', flexShrink: 0 }}>
                        {formatDateTime(it.at)}
                      </span>
                    </div>
                    <p style={{ fontSize: '0.78rem', color: 'var(--muted)', marginTop: 2 }}>
                      {it.subtitle}
                    </p>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </AppShell>
  )
}
