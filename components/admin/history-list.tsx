'use client'

import { History, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
import { restoreVersion } from '@/app/admin/actions'
import { partFor } from '@/lib/admin/schema'
import type { ContentKey } from '@/lib/content/types'
import { useAdmin } from './admin-context'
import { fullDate, timeAgo } from './time'

type Row = { id: string; at: string; part: string; by: string }

function describe(part: string): { label: string; key: ContentKey | null } {
  const [verb, raw] = part.startsWith('reset-')
    ? ['Reset', part.slice(6)]
    : part.startsWith('restore-')
      ? ['Restored', part.slice(8)]
      : ['Updated', part]
  if (raw === 'library') return { label: 'Media library', key: null }
  if (raw === 'all') return { label: `${verb} the whole site`, key: null }
  const found = partFor(raw)
  return { label: `${verb} ${found?.label ?? raw}`, key: found ? found.key : null }
}

export function HistoryList({ versions }: { versions: Row[] }) {
  const { toast } = useAdmin()
  const router = useRouter()
  const [busy, setBusy] = useState<string | null>(null)
  const [, startTransition] = useTransition()

  const restore = (version: Row, key: ContentKey | 'all', label: string) => {
    const message =
      key === 'all'
        ? `Put the WHOLE site back to how it was ${timeAgo(version.at)}? Everything saved since then is undone (you can redo it from this list).`
        : `Bring back “${label}” as it was ${timeAgo(version.at)}?`
    if (!confirm(message)) return
    setBusy(`${version.id}-${key}`)
    startTransition(async () => {
      const result = await restoreVersion(version.id, key)
      setBusy(null)
      if (!result.ok) return toast(result.error, 'error')
      toast('Restored — it’s live on the site.')
      router.refresh()
    })
  }

  if (!versions.length) return <p className="ad-empty">No saves yet — the site is exactly as it launched.</p>

  return (
    <ol className="ad-history">
      {versions.map((version, i) => {
        const { label, key } = describe(version.part)
        return (
          <li key={version.id}>
            <div className="ad-history-text">
              <strong>{label}</strong>
              <small suppressHydrationWarning>
                {timeAgo(version.at)} · {fullDate(version.at)}
                {i === 0 && <span className="ad-pill">Live now</span>}
              </small>
            </div>
            {i > 0 && (
              <div className="ad-row">
                {key && (
                  <button type="button" className="ad-button" disabled={busy !== null} onClick={() => restore(version, key, partFor(key)!.label)}>
                    {busy === `${version.id}-${key}` ? <Loader2 size={14} className="ad-spin" /> : <History size={14} />} Restore this section
                  </button>
                )}
                <button type="button" className="ad-button ad-quiet" disabled={busy !== null} onClick={() => restore(version, 'all', '')}>
                  {busy === `${version.id}-all` && <Loader2 size={14} className="ad-spin" />} Whole site
                </button>
              </div>
            )}
          </li>
        )
      })}
    </ol>
  )
}
