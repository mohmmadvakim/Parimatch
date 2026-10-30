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
    <AppShell title="Live Chat">
      <div className="pa-card">
        <div className="pa-card-head">
          <h2 className="pa-card-title">Conversations ({rows.length})</h2>
        </div>

        {loading ? (
          <div className="pa-empty">
            <span className="pa-empty-title">Loading…</span>
          </div>
        ) : rows.length === 0 ? (
          <div className="pa-empty">
            <div className="pa-empty-icon">
              <Icon name="message" size={24} />
            </div>
            <strong className="pa-empty-title">No Active Chats</strong>
            <p className="pa-empty-text">No user chat messages found yet.</p>
          </div>
        ) : (
          <div className="pa-list">
            {rows.map((u) => {
              const stamp = formatStamp(u.lastAt)
              const mine = u.lastSender !== 'user'
              const chatTo = base ? `${base}/chat/${u.clientId}` : `/chat/${u.clientId}`

              return (
                <Link key={u.clientId} className="pa-row-item" to={chatTo}>
                  <div className="pa-avatar">
                    {initialsOf(u.name)}
                  </div>

                  <div className="pa-row-info">
                    <strong className="pa-row-name">{u.name}</strong>
                    <div className="pa-row-sub">
                      <span>{mine ? 'You: ' : ''}{u.lastText || 'Message'}</span>
                      <span>• {stamp.time}</span>
                    </div>
                  </div>

                  <span className="pa-badge blue" style={{ flexShrink: 0 }}>
                    {u.count}
                  </span>
                  <Icon name="chevron-right" size={18} style={{ color: '#94a3b8', flexShrink: 0 }} />
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </AppShell>
  )
}
