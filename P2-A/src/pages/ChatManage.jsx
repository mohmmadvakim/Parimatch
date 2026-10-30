import { useMemo } from 'react'
import { Link, useLocation } from 'react-router-dom'
import AppShell from '../components/AppShell.jsx'
import { initialsOf } from '../components/status.js'
import { Icon } from '../components/Icons.jsx'
import { useData } from '../App.jsx'
import { chatUsers, formatStamp } from '../lib/data.js'

export default function ChatManage() {
  const { pathname } = useLocation()
  const { messages, complaints, loading } = useData()
  const rows = useMemo(() => chatUsers(messages, complaints), [messages, complaints])

  const base = pathname.startsWith('/admin') ? '/admin' : ''

  return (
    <AppShell
      title="Live Chat Manager"
      subtitle={`${rows.length} conversations active`}
    >
      <div className="card" style={{ padding: '20px' }}>
        {loading ? (
          <div className="empty-state">
            <h2>Loading…</h2>
            <p>Fetching active chat threads.</p>
          </div>
        ) : rows.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              <Icon name="message" size={28} />
            </div>
            <h2>Koi active chat nahi hai</h2>
            <p>Jab koi user Parimatch Support live chat me message karega, uska chat session yahan turant aa jayega.</p>
          </div>
        ) : (
          <div className="admin-list">
            {rows.map((u) => {
              const stamp = formatStamp(u.lastAt)
              const mine = u.lastSender !== 'user'
              const chatTo = base ? `${base}/chat/${u.clientId}` : `/chat/${u.clientId}`

              return (
                <Link key={u.clientId} className="admin-row" to={chatTo}>
                  <div className="admin-avatar">
                    {initialsOf(u.name)}
                  </div>

                  <div className="admin-row-meta">
                    <strong className="admin-row-name">{u.name}</strong>
                    <div className="admin-row-sub">
                      <span>{mine ? 'You: ' : ''}{u.lastText || 'Attachment'}</span>
                      <span style={{ fontVariantNumeric: 'tabular-nums' }}>• {stamp.date} {stamp.time}</span>
                    </div>
                  </div>

                  <div className="admin-row-right">
                    <span className="badge accent">{u.count} msg</span>
                    <Icon name="chevron-right" size={18} />
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
