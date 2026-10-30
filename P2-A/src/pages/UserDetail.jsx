import { useMemo, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import AppShell from '../components/AppShell.jsx'
import FileViewer from '../components/FileViewer.jsx'
import { prettyLabel, statusLabel, statusTone, initialsOf } from '../components/status.js'
import { Icon } from '../components/Icons.jsx'
import { useData } from '../App.jsx'
import { complaintsOf, fileSrc, formatDateTime, formatFileSize, isImageFile, userNameOf } from '../lib/data.js'
import { updateComplaintStatus } from '../lib/actions.js'

const STATUS_CHOICES = [
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
      subtitle={`${rows.length} total complaint${rows.length === 1 ? '' : 's'}`}
      back
      nav={false}
      right={
        <Link className="btn primary sm" to={chatTo}>
          <Icon name="message" size={16} />
          <span>Live Chat{chatCount ? ` (${chatCount})` : ''}</span>
        </Link>
      }
    >
      {/* Top Profile Card */}
      <div className="card panel">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div className="admin-avatar" style={{ width: 52, height: 52, fontSize: '1.2rem' }}>
              {initialsOf(name)}
            </div>
            <div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text)' }}>{name}</h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', marginTop: 4, color: 'var(--muted)', fontSize: '0.85rem' }}>
                {mobile ? <span>📱 {mobile}</span> : <span>Mobile: Not provided</span>}
                {email && <span>✉️ {email}</span>}
                <span style={{ fontVariantNumeric: 'tabular-nums' }}>ID: {String(clientId || '').slice(0, 10)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Complaints List in Parimatch Site Card Design */}
      {loading ? (
        <div className="card empty-state">
          <h2>Loading…</h2>
          <p>Fetching user details.</p>
        </div>
      ) : rows.length === 0 ? (
        <div className="card empty-state">
          <div className="empty-icon">
            <Icon name="grid" size={28} />
          </div>
          <h2>Koi complaint nahi hai</h2>
          <p>Is user ID se koi complaint darj nahi mili.</p>
        </div>
      ) : (
        rows.map((c) => {
          const files = Object.entries(c.files || {}).filter(([, f]) => f && (f.name || fileSrc(f)))
          const details = Object.entries(c.details || {}).filter(
            ([k]) => !['userName', 'user_name', 'password'].includes(k)
          )
          const currentStatus = String(c.status || 'pending').toLowerCase()

          return (
            <div key={c.id} className="card complain-item">
              {/* Corner Status Pill (Parimatch Site signature design) */}
              <span className={`complain-status ${statusTone(c.status)}`}>
                {statusLabel(c.status)}
              </span>

              <div className="complain-item-head">
                <span className="badge accent">{c.type || 'Complain'}</span>
                <span className="complain-item-date">{formatDateTime(c.createdAt)}</span>
              </div>

              <h3 className="complain-item-title">{c.title || `${c.type || 'Complain'} Complaint`}</h3>

              {/* Details Grid (Parimatch Site 2-column key-value grid) */}
              <div className="complain-details-grid">
                {details.map(([key, value]) => (
                  <div key={key} className="complain-detail">
                    <span className="complain-detail-label">{prettyLabel(key)}</span>
                    <span className="complain-detail-value">{String(value || '-')}</span>
                  </div>
                ))}
                {c.hasPassword && (
                  <div className="complain-detail">
                    <span className="complain-detail-label">Password</span>
                    <span className="complain-detail-value">•••••••• <small style={{ color: 'var(--muted)' }}>(secured)</small></span>
                  </div>
                )}
                {details.length === 0 && !c.hasPassword && (
                  <div className="complain-detail">
                    <span className="complain-detail-label">Details</span>
                    <span className="complain-detail-value">-</span>
                  </div>
                )}
              </div>

              {/* Uploaded Files Section */}
              {files.length > 0 && (
                <div className="complain-files">
                  <div className="complain-files-title">Attachments ({files.length})</div>
                  <div className="complain-file-list">
                    {files.map(([key, f]) => {
                      const src = fileSrc(f)
                      const label = prettyLabel(key)
                      return (
                        <div key={key} className="complain-file-row">
                          <span className="complain-file-icon">
                            <Icon name="folder" size={17} />
                          </span>
                          <span className="complain-file-meta">
                            <span className="complain-file-name">{label}</span>
                            <span className="complain-file-sub">
                              {f.name}{f.size ? ` • ${formatFileSize(f.size)}` : ''}
                            </span>
                          </span>
                          {src ? (
                            isImageFile(f) ? (
                              <button
                                type="button"
                                className="btn secondary sm"
                                onClick={() => setViewer({ src, name: f.name || label })}
                              >
                                <Icon name="eye" size={15} />
                                <span>View</span>
                              </button>
                            ) : (
                              <a
                                className="btn secondary sm"
                                href={src}
                                download={f.name}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                Open
                              </a>
                            )
                          ) : (
                            <span style={{ fontSize: '0.78rem', color: 'var(--muted)' }}>N/A</span>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Status Update Actions */}
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: '14px', marginTop: '4px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase' }}>
                      Change Status:
                    </span>
                    <div className="status-btn-group" style={{ margin: 0 }}>
                      {STATUS_CHOICES.map((s) => {
                        const isSelected = currentStatus === s.id
                        return (
                          <button
                            key={s.id}
                            type="button"
                            className={`status-choice-btn ${isSelected ? `active-${s.id}` : ''}`}
                            onClick={() => savingId !== c.id && changeStatus(c.id, s.id)}
                            disabled={savingId === c.id}
                          >
                            <Icon name={s.icon} size={15} />
                            <span>{s.label}</span>
                            {isSelected && <Icon name="check" size={14} />}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                  {savingId === c.id && (
                    <span style={{ fontSize: '0.8rem', color: 'var(--accent)' }}>Updating…</span>
                  )}
                </div>
              </div>
            </div>
          )
        })
      )}

      <FileViewer open={Boolean(viewer)} src={viewer?.src} name={viewer?.name} onClose={() => setViewer(null)} />
    </AppShell>
  )
}
