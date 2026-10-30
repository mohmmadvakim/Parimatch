import { useMemo, useState } from 'react'
import AppShell from '../components/AppShell.jsx'
import UserRow from '../components/UserRow.jsx'
import { Icon } from '../components/Icons.jsx'
import { useData } from '../App.jsx'
import { groupUsers } from '../lib/data.js'

const STATUS_FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'pending', label: 'Pending' },
  { id: 'resolved', label: 'Resolved' },
  { id: 'rejected', label: 'Rejected' },
]

export default function AllComplains() {
  const { complaints, loading } = useData()
  const [q, setQ] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const rows = useMemo(() => {
    let all = groupUsers(complaints)

    if (statusFilter !== 'all') {
      all = all.filter((u) =>
        u.complaints.some((c) => String(c.status || 'pending').toLowerCase() === statusFilter)
      )
    }

    const term = q.trim().toLowerCase()
    if (!term) return all

    return all.filter((u) =>
      [u.name, u.mobile, u.email, u.latestType, ...u.complaints.map((c) => c.type)]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(term))
    )
  }, [complaints, q, statusFilter])

  return (
    <AppShell title="All Complains">
      {/* Search & Filter Header Box */}
      <div className="pa-card" style={{ gap: 10, padding: 12 }}>
        <div className="pa-search-input">
          <Icon name="search" size={17} style={{ color: 'var(--muted)', flexShrink: 0 }} />
          <input
            type="search"
            placeholder="Search name, phone, type…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          {q && (
            <button
              type="button"
              onClick={() => setQ('')}
              style={{ background: 'none', border: 0, color: 'var(--muted)', cursor: 'pointer', padding: 4 }}
            >
              <Icon name="x" size={15} />
            </button>
          )}
        </div>

        <div className="pa-filter-row">
          {STATUS_FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              className={`pa-filter-pill ${statusFilter === f.id ? 'active' : ''}`}
              onClick={() => setStatusFilter(f.id)}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Complaints User List */}
      <div className="pa-card">
        <div className="pa-card-head">
          <h2 className="pa-card-title">Users List ({rows.length})</h2>
        </div>

        {loading ? (
          <div className="pa-empty">
            <span className="pa-empty-title">Loading…</span>
          </div>
        ) : rows.length === 0 ? (
          <div className="pa-empty">
            <div className="pa-empty-icon">
              <Icon name="search" size={24} />
            </div>
            <strong className="pa-empty-title">No Complains Found</strong>
            <p className="pa-empty-text">No matching records found.</p>
          </div>
        ) : (
          <div className="pa-list">
            {rows.map((u) => (
              <UserRow
                key={u.clientId}
                user={u}
                to={`/user/${u.clientId}`}
                badge={u.total}
              />
            ))}
          </div>
        )}
      </div>
    </AppShell>
  )
}
