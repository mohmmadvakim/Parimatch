import { useMemo } from 'react'
import { Link, useLocation } from 'react-router-dom'
import AppShell from '../components/AppShell.jsx'
import { Timeline } from '../own/ui/data/Timeline.jsx'
import EmptyState from '../own/ui/feedback/EmptyState.jsx'
import { Skeleton } from '../own/ui/feedback/Loaders.jsx'
import { useData } from '../App.jsx'
import { activityFeed, formatDateTime } from '../lib/data.js'

const toneOf = (kind) => (kind === 'complaint' ? 'accent' : 'success')

export default function Activity() {
  const { pathname } = useLocation()
  const { complaints, messages, loading } = useData()

  const base = pathname.startsWith('/admin') ? '/admin' : ''

  const events = useMemo(
    () =>
      activityFeed(complaints, messages).map((it) => ({
        id: it.id,
        tone: toneOf(it.kind),
        time: formatDateTime(it.at),
        title: (
          <Link className="pa-link" to={base ? `${base}/user/${it.clientId}` : `/user/${it.clientId}`}>
            <strong>{it.title}</strong> · <span>{it.subtitle}</span>
          </Link>
        ),
      })),
    [complaints, messages, base]
  )

  return (
    <AppShell title="Activity" subtitle="Complaints + chat ka poora feed">
      {loading ? (
        <div className="own-card pa-card"><Skeleton lines={5} /></div>
      ) : events.length === 0 ? (
        <div className="own-card pa-card">
          <EmptyState
            icon="clock"
            title="Koi activity nahi"
            text="Jaise hi koi complaint ya message aayega, yahan timeline me dikhega."
          />
        </div>
      ) : (
        <div className="own-card pa-card">
          <Timeline events={events} />
        </div>
      )}
    </AppShell>
  )
}
