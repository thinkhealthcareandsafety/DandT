import type { Metadata } from 'next'
import { HistoryList } from '@/components/admin/history-list'
import { listVersions } from '@/lib/content/store'

export const metadata: Metadata = { title: 'History & undo' }

export default async function HistoryPage() {
  const versions = await listVersions().catch(() => [])
  return (
    <div className="ad-page">
      <header className="ad-page-head">
        <p className="ad-kicker">History &amp; undo</p>
        <h1>
          Nothing is ever <em>lost.</em>
        </h1>
        <p>
          Every save is kept. Bring back one section as it was after any change — or, if something has gone badly
          wrong, the whole site.
        </p>
      </header>
      <HistoryList versions={versions.map(({ id, at, part, by }) => ({ id, at, part, by }))} />
    </div>
  )
}
