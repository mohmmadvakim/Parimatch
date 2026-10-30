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
    <AppShell
      title="Live Activity Feed"
      subtitle="Chronological feed of complaints and messages"
    >
      <div className="card" style={{ padding: '20px' }}>
        {loading ? (
          <div className="empty-state">
            <h2>Loading…</h2>
            <p>Fetching real-time activity.</p>
          </div>
        ) : events.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              <Icon name="clock" size={28} />
            </div>
            <h2>Koi activity record nahi hai</h2>
            <p>Jaise hi koi complaint ya chat message aayega, yahan real-time timeline me log hota rahega.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {events.map((it) => {
              const isComplaint = it.kind === 'complaint'
              const userTo = base ? `${base}/user/${it.clientId}` : `/user/${it.clientId}`

              return (
                <Link
                  key={it.id}
                  to={userTo}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 14,
                    padding: '12px 14px',
                    borderRadius: 'var(--radius)',
                    background: '#1e2128',
                    border: '1px solid var(--border)',
                    textDecoration: 'none',
                    color: 'inherit',
                    transition: 'border-color 0.15s',
                  }}
                >
                  <span
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 6,
                      background: isComplaint ? 'rgba(245, 255, 0, 0.12)' : 'rgba(53, 201, 139, 0.12)',
                      color: isComplaint ? 'var(--accent)' : 'var(--yes)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <Icon name={isComplaint ? 'grid' : 'message'} size={16} />
                  </span>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap' }}>
                      <strong style={{ fontSize: '0.92rem', color: 'var(--text)' }}>{it.title}</strong>
                      <span style={{ fontSize: '0.75rem', color: 'var(--muted)', fontVariantNumeric: 'tabular-nums' }}>
                        {formatDateTime(it.at)}
                      </span>
                    </div>
                    <p style={{ fontSize: '0.82rem', color: 'var(--muted)', marginTop: 2 }}>{it.subtitle}</p>
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
