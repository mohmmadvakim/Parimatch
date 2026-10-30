import { useMemo, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import AppShell from '../components/AppShell.jsx'
import FileViewer from '../components/FileViewer.jsx'
import { prettyLabel, statusLabel, statusTone, initialsOf } from '../components/status.js'
import { Avatar } from '../own/ui/data/Avatar.jsx'
import KeyValue from '../own/ui/data/KeyValue.jsx'
import Button from '../own/ui/button/Button.jsx'
import { Badge } from '../own/ui/feedback/Alert.jsx'
import EmptyState from '../own/ui/feedback/EmptyState.jsx'
import { Spinner } from '../own/ui/feedback/Loaders.jsx'
import { Icon } from '../own/ui/icons/Icons.jsx'
import { useData } from '../App.jsx'
import { complaintsOf, fileSrc, formatDateTime, formatFileSize, isImageFile, userNameOf } from '../lib/data.js'
import { updateComplaintStatus } from '../lib/actions.js'

const STATUS_OPTIONS = [
  { id: 'pending', label: 'Pending', icon: 'clock' },
  { id: 'resolved', label: 'Resolved', icon: 'check-circle' },
  { id: 'rejected', label: 'Rejected', icon: 'x-circle' },
]

export default function UserDetail() {
  const { clientId } = useParams()
  const { pathname } = useLocation()
  const { complaints, messages, loading } = useData()
  const [viewer, setViewer] = useState(null)
  const [savingId, setSavingId] = useState('')

  const base = pathname.startsWith('/admin') ? '/admin' : ''
  const chatTo = base ? `${base}/chat/${clientId}` : `/chat/${clientId}`

  const rows = useMemo(() => complaintsOf(complaints, clientId), [complaints, clientId])
  const name = rows.length ? userNameOf(rows[0]) : `User ${String(clientId || '').slice(0, 6)}`
  const mobile = (rows[0]?.details?.mobile) || ''
  const email = (rows[0]?.details?.email) || ''
  const chatCount = messages.filter((m) => m.clientId === clientId).length

  const changeStatus = async (id, status) => {
    setSavingId(id)
    try {
      await updateComplaintStatus(id, status)
    } catch (err) {
      alert(err?.message || 'Status update fail')
    } finally {
      setSavingId('')
    }
  }

  return (
    <AppShell
      title={name}
      subtitle={`${rows.length} complaint${rows.length === 1 ? '' : 's'}`}
      back
      nav={false}
    >
      {/* Top User Profile Card */}
      <section className="pa-card">
        <div className="pa-spread">
          <div className="pa-row" style={{ gap: 14 }}>
            <Avatar initials={initialsOf(name)} size="lg" tone="accent" />
            <div className="own-list__meta">
              <strong>{name}</strong>
              <span>{mobile || 'Mobile not provided'}</span>
              {email ? <span>{email}</span> : null}
              <span className="pa-muted">ID: {String(clientId || '').slice(0, 8)}</span>
            </div>
          </div>

          <Link className="own-btn own-btn--secondary own-btn--sm" to={chatTo}>
            <Icon name="message" size={15} />
            <span>Chat{chatCount ? ` (${chatCount})` : ''}</span>
          </Link>
        </div>
      </section>

      {/* Complaints List */}
      {loading ? (
        <div className="pa-card pa-center"><Spinner label="Loading user complaints…" /></div>
      ) : rows.length === 0 ? (
        <div className="pa-card">
          <EmptyState icon="grid" title="Koi complaint nahi" text="Is user ki koi complaint nahi mili." />
        </div>
      ) : (
        rows.map((c) => {
          const files = Object.entries(c.files || {}).filter(([, f]) => f && (f.name || fileSrc(f)))
          const details = Object.entries(c.details || {}).filter(
            ([k]) => !['userName', 'user_name', 'password'].includes(k)
          )
          const kv = details.map(([k, v]) => ({ k: prettyLabel(k), v: String(v) }))
          if (c.hasPassword) kv.push({ k: 'Password', v: '•••••••• (secured)' })

          const currentStatus = String(c.status || 'pending').toLowerCase()

          return (
            <article key={c.id} className="pa-card">
              <div className="pa-card__head">
                <span className="pa-card__title">{c.title || `${c.type || 'Complain'} complaint`}</span>
                <div className="pa-badges">
                  <Badge tone="accent">{c.type || 'Complain'}</Badge>
                  <Badge tone={statusTone(c.status)}>{statusLabel(c.status)}</Badge>
                </div>
              </div>

              <p className="pa-muted">{formatDateTime(c.createdAt)}</p>

              <KeyValue rows={kv.length ? kv : [{ k: 'Details', v: '-' }]} />

              {/* Attachments Section */}
              {files.length > 0 && (
                <div className="pa-stack" style={{ gap: 8 }}>
                  <span className="pa-section__title">Attachments ({files.length})</span>
                  {files.map(([key, f]) => {
                    const src = fileSrc(f)
                    const label = prettyLabel(key)
                    return (
                      <div key={key} className="pa-file">
                        <span className="pa-file__icon"><Icon name="folder" size={16} /></span>
                        <span className="pa-file__meta">
                          <span className="pa-file__name">{label}</span>
                          <span className="pa-file__sub">
                            {f.name}{f.size ? ` • ${formatFileSize(f.size)}` : ''}
                          </span>
                        </span>
                        {src ? (
                          isImageFile(f) ? (
                            <Button size="sm" variant="secondary" icon="eye" onClick={() => setViewer({ src, name: f.name || label })}>
                              View
                            </Button>
                          ) : (
                            <a className="own-btn own-btn--secondary own-btn--sm" href={src} download={f.name} target="_blank" rel="noopener">
                              Open
                            </a>
                          )
                        ) : (
                          <span className="pa-muted">N/A</span>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}

              {/* Status Action Buttons */}
              <div className="pa-stack" style={{ gap: 8 }}>
                <span className="pa-section__title">Update Status</span>
                <div className="pa-chip-row">
                  {STATUS_OPTIONS.map((s) => {
                    const isSelected = currentStatus === s.id
                    return (
                      <button
                        key={s.id}
                        type="button"
                        className={`pa-status-chip ${isSelected ? `is-active-${s.id}` : ''}`}
                        onClick={() => savingId !== c.id && changeStatus(c.id, s.id)}
                        disabled={savingId === c.id}
                      >
                        <Icon name={s.icon} size={14} />
                        <span>{s.label}</span>
                        {isSelected && <Icon name="check" size={12} />}
                      </button>
                    )
                  })}
                </div>
                {savingId === c.id ? <span className="pa-muted">Updating status…</span> : null}
              </div>
            </article>
          )
        })
      )}

      <FileViewer open={Boolean(viewer)} src={viewer?.src} name={viewer?.name} onClose={() => setViewer(null)} />
    </AppShell>
  )
}
