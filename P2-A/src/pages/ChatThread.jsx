import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import AppShell from '../components/AppShell.jsx'
import { initialsOf } from '../components/status.js'
import { Avatar } from '../own/ui/data/Avatar.jsx'
import Input from '../own/ui/input/Input.jsx'
import IconButton from '../own/ui/button/IconButton.jsx'
import { Alert } from '../own/ui/feedback/Alert.jsx'
import EmptyState from '../own/ui/feedback/EmptyState.jsx'
import { Spinner } from '../own/ui/feedback/Loaders.jsx'
import { Icon } from '../own/ui/icons/Icons.jsx'
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
      title={name}
      subtitle={userComplaints.length ? `${userComplaints.length} complaint${userComplaints.length === 1 ? '' : 's'}` : 'No complaints'}
      back
      nav={false}
      right={
        userComplaints.length ? (
          <Link className="own-btn own-btn--secondary own-btn--sm" to={userTo}>
            <Icon name="grid" size={15} />
            <span>Complains</span>
          </Link>
        ) : null
      }
    >
      <div className="pa-chat">
        {loading ? (
          <div className="pa-card pa-center"><Spinner label="Loading conversation…" /></div>
        ) : rows.length === 0 ? (
          <div className="pa-card">
            <EmptyState icon="message" title="Koi message nahi" text="Is user ne abhi koi message nahi bheja." />
          </div>
        ) : (
          rows.map((m) => {
            const mine = m.sender !== 'user'
            const stamp = formatStamp(m.createdAt)
            return (
              <div key={m.id} className={`pa-bubble-row ${mine ? 'pa-bubble-row--right' : ''}`}>
                {!mine ? <Avatar initials={initialsOf(name, 'U')} size="sm" tone="neutral" /> : null}
                <div className={`pa-bubble ${mine ? 'pa-bubble--mine' : 'pa-bubble--theirs'}`}>
                  {m.text ? <span>{m.text}</span> : null}
                  {m.file?.name ? (
                    <span className="pa-muted" style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                      <Icon name="folder" size={13} /> {m.file.name}
                    </span>
                  ) : null}
                  <span className="pa-bubble__time">{stamp.time}{m.edited ? ' · edited' : ''}</span>
                </div>
              </div>
            )
          })
        )}
        <div ref={bottomRef} />
      </div>

      {error ? (
        <div className="pa-composer__error">
          <Alert tone="danger" title="Send fail">{error}</Alert>
        </div>
      ) : null}

      <form className="pa-composer" onSubmit={send}>
        <Input
          id="chat-reply"
          placeholder="Reply likho…"
          value={text}
          onChange={(e) => setText(e.target.value)}
          maxLength={2000}
          aria-label="Reply"
          disabled={sending}
        />
        <IconButton
          icon="send"
          label="Send"
          variant="primary"
          type="submit"
          disabled={!text.trim() || sending}
        />
      </form>
    </AppShell>
  )
}
