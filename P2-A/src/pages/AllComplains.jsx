import { useMemo, useState } from 'react'
import AppShell from '../components/AppShell.jsx'
import UserRow from '../components/UserRow.jsx'
import Input from '../own/ui/input/Input.jsx'
import EmptyState from '../own/ui/feedback/EmptyState.jsx'
import { Skeleton } from '../own/ui/feedback/Loaders.jsx'
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
    <AppShell title="All Complains" subtitle={`${rows.length} users (${complaints.length} complaints)`}>
      <div className="pa-stack" style={{ gap: 10 }}>
        <Input
          id="search-complains"
          icon="search"
          type="search"
          placeholder="Naam, mobile ya complaint type se search…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />

        <div className="pa-filter-bar" role="tablist" aria-label="Status filters">
          {STATUS_FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              role="tab"
              aria-selected={statusFilter === f.id}
              className={`pa-filter-btn ${statusFilter === f.id ? 'is-active' : ''}`}
              onClick={() => setStatusFilter(f.id)}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="own-card pa-card"><Skeleton lines={4} /></div>
      ) : rows.length === 0 ? (
        <div className="own-card pa-card">
          <EmptyState
            icon="search"
            title={q || statusFilter !== 'all' ? 'Kuch nahi mila' : 'Abhi koi complaint nahi'}
            text={
              q || statusFilter !== 'all'
                ? 'Aapke search filter se koi complaint match nahi hui.'
                : 'Jab user complaint karega, wo yahan aa jayega.'
            }
          />
        </div>
      ) : (
        <div className="own-list pa-list">
          {rows.map((u) => (
            <UserRow key={u.clientId} user={u} to={`/user/${u.clientId}`} badge={u.total} />
          ))}
        </div>
      )}
    </AppShell>
  )
}
