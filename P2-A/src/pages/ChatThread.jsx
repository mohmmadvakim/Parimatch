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
      setError(err?.message || 'Failed to send message')
    } finally {
      setSending(false)
    }
  }

  return (
    <AppShell
      title={name}
      subtitle="Live Chat"
      back
      nav={false}
      right={
        userComplaints.length > 0 ? (
          <Link className="btn secondary sm" to={userTo}>
            <Icon name="grid" size={14} />
            <span>Complaint</span>
          </Link>
        ) : null
      }
    >
      <div className="pa-chat-wrap">
        {/* Messages Card */}
        <div className="pa-chat-box">
          {loading ? (
            <div className="pa-empty" style={{ padding: 24 }}>
              <span className="pa-empty-title">Loading messages…</span>
            </div>
          ) : rows.length === 0 ? (
            <div className="pa-empty" style={{ padding: 24 }}>
              <div className="pa-empty-icon">
                <Icon name="message" size={24} />
              </div>
              <strong className="pa-empty-title">No Messages Yet</strong>
              <p className="pa-empty-text">Type a message below to start chatting.</p>
            </div>
          ) : (
            rows.map((m) => {
              const mine = m.sender !== 'user'
              const stamp = formatStamp(m.createdAt)

              return (
                <div key={m.id} className={`pa-msg-row ${mine ? 'mine' : 'theirs'}`}>
                  <div className="pa-bubble">
                    {m.text && <div>{m.text}</div>}
                    {m.file?.name && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8rem', opacity: 0.9 }}>
                        <Icon name="folder" size={14} />
                        <span>{m.file.name}</span>
                      </div>
                    )}
                    <span className="pa-bubble-time">{stamp.time}</span>
                  </div>
                </div>
              )
            })
          )}
          <div ref={bottomRef} />
        </div>

        {error && (
          <div style={{ background: 'var(--no-soft)', color: 'var(--no)', padding: '8px 12px', borderRadius: 8, fontSize: '0.8rem' }}>
            {error}
          </div>
        )}

        {/* Input Bar with Blue Send Button */}
        <form className="pa-chat-bar" onSubmit={send}>
          <input
            type="text"
            placeholder="Type your reply…"
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={sending}
            maxLength={2000}
            autoFocus
          />
          <button
            type="submit"
            className="btn primary sm"
            disabled={!text.trim() || sending}
            style={{ padding: '0 16px', height: 36 }}
          >
            <Icon name="send" size={15} />
            <span>Send</span>
          </button>
        </form>
      </div>
    </AppShell>
  )
}
