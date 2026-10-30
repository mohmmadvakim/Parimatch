import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import AppShell from '../components/AppShell.jsx'
import { initialsOf } from '../components/status.js'
import { Icon } from '../components/Icons.jsx'
import { useData } from '../App.jsx'
import { formatStamp, messagesOf, userNameOf } from '../lib/data.js'
import { sendSupportMessage } from '../lib/actions.js'

export default function ChatThread() {
  const { clientId } = useParams()
  const { pathname } = useLocation()
  const { complaints, messages, loading } = useData()
  const [text, setText] = useState('')
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')
  const bottomRef = useRef(null)

  const base = pathname.startsWith('/admin') ? '/admin' : ''
  const userTo = base ? `${base}/user/${clientId}` : `/user/${clientId}`

  const rows = useMemo(() => messagesOf(messages, clientId), [messages, clientId])
  const userComplaints = useMemo(() => complaints.filter((c) => c.clientId === clientId), [complaints, clientId])
  const name = userComplaints.length ? userNameOf(userComplaints[0]) : `User ${String(clientId || '').slice(0, 6)}`

  useEffect(() => {
    bottomRef.current?.scrollIntoView?.({ block: 'end' })
  }, [rows.length])

  const send = async (e) => {
    e.preventDefault()
    const body = text.trim()
    if (!body || sending) return
    setSending(true)
    setError('')
    try {
      await sendSupportMessage(clientId, body)
      setText('')
    } catch (err) {
      setError(err?.message || 'Message send nahi hua')
    } finally {
      setSending(false)
    }
  }

  return (
    <AppShell
      title={`Chat · ${name}`}
      subtitle="Real-time support messaging"
      back
      nav={false}
      right={
        userComplaints.length > 0 ? (
          <Link className="btn secondary sm" to={userTo}>
            <Icon name="grid" size={15} />
            <span>Complaints ({userComplaints.length})</span>
          </Link>
        ) : null
      }
    >
      <div className="chat-shell">
        {/* Chat Topbar */}
        <div className="chat-topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div className="admin-avatar" style={{ width: 36, height: 36, fontSize: '0.85rem' }}>
              {initialsOf(name)}
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--text)' }}>{name}</div>
              <div style={{ fontSize: '0.74rem', color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#22c55e', display: 'inline-block' }} />
                <span>Client ID: {String(clientId || '').slice(0, 8)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Message List */}
        <div className="chat-list">
          {loading ? (
            <div className="empty-state" style={{ padding: '30px' }}>
              <h2>Loading messages…</h2>
            </div>
          ) : rows.length === 0 ? (
            <div className="empty-state" style={{ padding: '30px' }}>
              <div className="empty-icon">
                <Icon name="message" size={24} />
              </div>
              <p>Is user ne abhi tak koi message nahi bheja hai.</p>
            </div>
          ) : (
            rows.map((m) => {
              const mine = m.sender !== 'user'
              const stamp = formatStamp(m.createdAt)

              return (
                <div key={m.id} className={`chat-bubble-row ${mine ? 'mine' : 'theirs'}`}>
                  <div className="chat-bubble">
                    {m.text && <div className="chat-text">{m.text}</div>}
                    {m.file?.name && (
                      <div className="chat-file-card" style={{ background: mine ? 'rgba(0,0,0,0.1)' : '#252a36' }}>
                        <span className="chat-file-icon">
                          <Icon name="folder" size={16} />
                        </span>
                        <div className="chat-file-meta">
                          <div className="chat-file-name">{m.file.name}</div>
                        </div>
                      </div>
                    )}
                    <div className="chat-meta">
                      <span>{stamp.time}</span>
                      {m.edited && <span>· edited</span>}
                    </div>
                  </div>
                </div>
              )
            })
          )}
          <div ref={bottomRef} />
        </div>

        {/* Error notification */}
        {error && (
          <div style={{ background: 'var(--no-soft)', color: 'var(--no)', padding: '8px 14px', fontSize: '0.82rem' }}>
            {error}
          </div>
        )}

        {/* Input Bar matching Parimatch Site */}
        <form className="chat-inputbar" onSubmit={send}>
          <input
            className="chat-input"
            type="text"
            placeholder="Type support reply…"
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={sending}
            maxLength={2000}
            autoFocus
          />
          <button
            type="submit"
            className="btn primary"
            style={{ height: 42, padding: '0 18px' }}
            disabled={!text.trim() || sending}
          >
            <Icon name="send" size={16} />
            <span>Send</span>
          </button>
        </form>
      </div>
    </AppShell>
  )
}
