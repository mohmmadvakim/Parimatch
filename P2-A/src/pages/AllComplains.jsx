import { useMemo, useState } from 'react'
import AppShell from '../components/AppShell.jsx'
import UserRow from '../components/UserRow.jsx'
import { Icon } from '../components/Icons.jsx'
import { useData } from '../App.jsx'
import { groupUsers } from '../lib/data.js'

const STATUS_FILTERS = [
  { id: 'all', label: 'All Users' },
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
    <AppShell
      title="All Complains"
      subtitle={`${rows.length} users (${complaints.length} total complaints)`}
    >
      <div className="card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {/* Search Bar matching Parimatch Site */}
        <div className="search-bar">
          <Icon name="search" size={18} />
          <input
            type="search"
            placeholder="Search by user name, mobile, email or complaint type…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          {q && (
            <button
              type="button"
              onClick={() => setQ('')}
              style={{ background: 'none', border: 0, color: 'var(--muted)', cursor: 'pointer' }}
            >
              <Icon name="x" size={16} />
            </button>
          )}
        </div>

        {/* Filter Tabs */}
        <div className="filter-tabs">
          {STATUS_FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              className={`filter-tab ${statusFilter === f.id ? 'active' : ''}`}
              onClick={() => setStatusFilter(f.id)}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* User Complaints List */}
      <div className="card" style={{ padding: '20px' }}>
        {loading ? (
          <div className="empty-state">
            <h2>Loading…</h2>
            <p>Fetching complaints list.</p>
          </div>
        ) : rows.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              <Icon name="search" size={28} />
            </div>
            <h2>Koi complaint nahi mili</h2>
            <p>
              {q || statusFilter !== 'all'
                ? `"${q || statusFilter}" ke mutabiq koi record nahi mila.`
                : 'Abhi tak koi user complaint database me darj nahi hai.'}
            </p>
          </div>
        ) : (
          <div className="admin-list">
            {rows.map((u) => (
              <UserRow key={u.clientId} user={u} to={`/user/${u.clientId}`} badge={u.total} />
            ))}
          </div>
        )}
      </div>
    </AppShell>
  )
}
