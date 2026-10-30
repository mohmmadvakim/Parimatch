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
  const [activeComplaintIndex, setActiveComplaintIndex] = useState(0)

  const base = pathname.startsWith('/admin') ? '/admin' : ''
  const chatTo = base ? `${base}/chat/${clientId}` : `/chat/${clientId}`

  const rows = useMemo(() => complaintsOf(complaints, clientId), [complaints, clientId])
  const name = rows.length ? userNameOf(rows[0]) : `User ${String(clientId || '').slice(0, 6)}`
  const mobile = rows[0]?.details?.mobile || ''
  const email = rows[0]?.details?.email || ''
  const chatCount = messages.filter((m) => m.clientId === clientId).length

  // Current active complaint for Card 2
  const currentComplaint = rows[activeComplaintIndex] || rows[0]

  const changeStatus = async (id, status) => {
    setSavingId(id)
    try {
      await updateComplaintStatus(id, status)
    } catch (err) {
      alert(err?.message || 'Status update failed')
    } finally {
      setSavingId('')
    }
  }

  return (
    <AppShell title="Complaint Details" back nav={false}>
      {loading ? (
        <div className="pa-card">
          <div className="pa-empty">
            <span className="pa-empty-title">Loading…</span>
          </div>
        </div>
      ) : !currentComplaint ? (
        <div className="pa-card">
          <div className="pa-empty">
            <div className="pa-empty-icon">
              <Icon name="grid" size={24} />
            </div>
            <strong className="pa-empty-title">No Complains</strong>
            <p className="pa-empty-text">No complaint record found for this user ID.</p>
          </div>
        </div>
      ) : (
        <>
          {/* ========================================================
              CARD 1: User Profile & Chat Action
              ======================================================== */}
          <div className="pa-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div className="pa-avatar" style={{ width: 46, height: 46, fontSize: '1.05rem' }}>
                {initialsOf(name)}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text)' }}>
                  {name}
                </h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginTop: 2, fontSize: '0.78rem', color: 'var(--muted)' }}>
                  {mobile && <span>📞 {mobile}</span>}
                  {email && <span>✉️ {email}</span>}
                  <span>ID: {String(clientId || '').slice(0, 8)}</span>
                </div>
              </div>
            </div>

            {/* Blue Main Action Button: Live Chat */}
            <Link className="btn primary block" to={chatTo}>
              <Icon name="message" size={16} />
              <span>Open Live Chat{chatCount ? ` (${chatCount})` : ''}</span>
            </Link>
          </div>

          {/* ========================================================
              CARD 2: Complaint Details, 2-Col Key-Values, Attachments, Status
              ======================================================== */}
          {(() => {
            const c = currentComplaint
            const files = Object.entries(c.files || {}).filter(([, f]) => f && (f.name || fileSrc(f)))
            const details = Object.entries(c.details || {}).filter(
              ([k]) => !['userName', 'user_name', 'password'].includes(k)
            )
            const currentStatus = String(c.status || 'pending').toLowerCase()

            return (
              <div className="pa-card">
                {/* Card 2 Header: Type, Status Pill & Multi-complaint Tabs if > 1 */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span className="pa-badge blue">{c.type || 'Complain'}</span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>
                        {formatDateTime(c.createdAt)}
                      </span>
                    </div>

                    <span className={`pa-badge ${currentStatus}`}>
                      {statusLabel(c.status)}
                    </span>
                  </div>

                  {/* If user has multiple complaints, switch inside Card 2 without creating extra cards */}
                  {rows.length > 1 && (
                    <div style={{ display: 'flex', gap: 6, paddingTop: 4 }}>
                      {rows.map((item, idx) => (
                        <button
                          key={item.id}
                          type="button"
                          className={`pa-filter-pill ${activeComplaintIndex === idx ? 'active' : ''}`}
                          style={{ padding: '3px 10px', fontSize: '0.74rem' }}
                          onClick={() => setActiveComplaintIndex(idx)}
                        >
                          Complaint #{idx + 1}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* 2-Column Key-Value Grid */}
                <div className="pa-kv-grid">
                  {details.map(([key, value]) => (
                    <div key={key} className="pa-kv-item">
                      <span className="pa-kv-lbl">{prettyLabel(key)}</span>
                      <span className="pa-kv-val">{String(value || '-')}</span>
                    </div>
                  ))}
                  {c.hasPassword && (
                    <div className="pa-kv-item">
                      <span className="pa-kv-lbl">Password</span>
                      <span className="pa-kv-val">••••••••</span>
                    </div>
                  )}
                  {details.length === 0 && !c.hasPassword && (
                    <div className="pa-kv-item">
                      <span className="pa-kv-lbl">Info</span>
                      <span className="pa-kv-val">-</span>
                    </div>
                  )}
                </div>

                {/* Attachments Section inside Card 2 */}
                {files.length > 0 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase' }}>
                      Attachments ({files.length})
                    </span>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      {files.map(([key, f]) => {
                        const src = fileSrc(f)
                        const label = prettyLabel(key)
                        return (
                          <div key={key} className="pa-file-row">
                            <Icon name="folder" size={16} style={{ color: 'var(--muted)', flexShrink: 0 }} />
                            <div className="pa-file-info">
                              <span className="pa-file-title">{label}</span>
                              <span className="pa-file-size">
                                {f.name}{f.size ? ` • ${formatFileSize(f.size)}` : ''}
                              </span>
                            </div>
                            {src ? (
                              isImageFile(f) ? (
                                <button
                                  type="button"
                                  className="btn secondary sm"
                                  style={{ padding: '4px 10px', minHeight: 30 }}
                                  onClick={() => setViewer({ src, name: f.name || label })}
                                >
                                  <Icon name="eye" size={14} />
                                  <span>View</span>
                                </button>
                              ) : (
                                <a
                                  className="btn secondary sm"
                                  style={{ padding: '4px 10px', minHeight: 30 }}
                                  href={src}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <Icon name="download" size={14} />
                                  <span>Open</span>
                                </a>
                              )
                            ) : null}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}

                {/* Status Update Choices inside Card 2 */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, paddingTop: 4 }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase' }}>
                    Update Status
                  </span>
                  <div className="pa-status-picker">
                    {STATUS_CHOICES.map((choice) => {
                      const isActive = currentStatus === choice.id
                      const isSaving = savingId === c.id
                      return (
                        <button
                          key={choice.id}
                          type="button"
                          disabled={isSaving}
                          className={`pa-status-opt is-${choice.id} ${isActive ? 'active' : ''}`}
                          style={{
                            borderWidth: isActive ? 2 : 1,
                            fontWeight: isActive ? 800 : 600,
                          }}
                          onClick={() => changeStatus(c.id, choice.id)}
                        >
                          <Icon name={choice.icon} size={15} />
                          <span>{choice.label}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>
            )
          })()}
        </>
      )}

      {/* File Viewer Modal */}
      <FileViewer
        open={Boolean(viewer)}
        src={viewer?.src}
        name={viewer?.name}
        onClose={() => setViewer(null)}
      />
    </AppShell>
  )
}
