'use client'

import { ArrowLeft, Eye, EyeOff, Loader2, RotateCcw, Save, Undo2 } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useState, useTransition } from 'react'
import { resetPart, savePart } from '@/app/admin/actions'
import { partFor, withLiveOptions } from '@/lib/admin/schema'
import type { ContentKey } from '@/lib/content/types'
import { useAdmin } from './admin-context'
import { FieldsView } from './fields'
import { timeAgo } from './time'

export function PartEditor({
  partKey,
  initialValue,
  initialBaseAt,
  lastEdit,
  customised,
}: {
  partKey: ContentKey
  initialValue: unknown
  initialBaseAt: string | null
  lastEdit: { at: string; by: string } | null
  /** Whether this part has ever been saved (so it can be reset to the original). */
  customised: boolean
}) {
  const part = partFor(partKey)!
  const router = useRouter()
  const { toast } = useAdmin()
  const [saved, setSaved] = useState(initialValue)
  const [value, setValue] = useState(initialValue)
  const [baseAt, setBaseAt] = useState(initialBaseAt)
  const [edit, setEdit] = useState(lastEdit)
  const [conflict, setConflict] = useState<string | null>(null)
  const [preview, setPreview] = useState(false)
  const [previewKey, setPreviewKey] = useState(0)
  const [pending, startTransition] = useTransition()

  const dirty = JSON.stringify(value) !== JSON.stringify(saved)

  const save = useCallback(() => {
    if (!dirty || pending) return
    startTransition(async () => {
      const result = await savePart(partKey, value, baseAt)
      if (!result.ok) {
        if (result.conflict) setConflict(result.error)
        toast(result.error, 'error')
        return
      }
      setSaved(value)
      setBaseAt(result.at ?? null)
      setEdit({ at: result.at ?? new Date().toISOString(), by: 'admin' })
      setPreviewKey((k) => k + 1)
      toast('Saved — it’s live on the site.')
      router.refresh()
    })
  }, [dirty, pending, partKey, value, baseAt, toast, router])

  // Ctrl/⌘+S saves, like everywhere else.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault()
        save()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [save])

  // Don't let an accidental back-swipe throw away work.
  useEffect(() => {
    if (!dirty) return
    const onLeave = (e: BeforeUnloadEvent) => e.preventDefault()
    window.addEventListener('beforeunload', onLeave)
    return () => window.removeEventListener('beforeunload', onLeave)
  }, [dirty])

  const reset = () => {
    if (!confirm(`Put “${part.label}” back to how it was when the site launched? Your version stays in History.`)) return
    startTransition(async () => {
      const result = await resetPart(partKey)
      if (!result.ok) return toast(result.error, 'error')
      toast('Back to the original.')
      router.refresh()
      // The server now holds the original; reload so the form shows it.
      window.location.reload()
    })
  }

  return (
    <div className={`ad-editor${preview ? ' has-preview' : ''}`}>
      <div className="ad-savebar">
        <Link href="/admin" className="ad-back" aria-label="Back to overview">
          <ArrowLeft size={17} />
        </Link>
        <div className="ad-savebar-title">
          <h1>{part.label}</h1>
          <p>
            {dirty ? (
              <span className="ad-dot is-dirty">Unsaved changes</span>
            ) : edit ? (
              <span className="ad-dot" suppressHydrationWarning>
                Saved {timeAgo(edit.at)}
              </span>
            ) : (
              <span className="ad-dot">As it shipped with the site</span>
            )}
          </p>
        </div>
        <div className="ad-row">
          {part.anchor && (
            <button type="button" className="ad-button ad-quiet ad-hide-sm" onClick={() => setPreview((p) => !p)} aria-pressed={preview}>
              {preview ? <EyeOff size={15} /> : <Eye size={15} />} Preview
            </button>
          )}
          {dirty && (
            <button type="button" className="ad-button ad-quiet" onClick={() => setValue(saved)} disabled={pending}>
              <Undo2 size={15} /> <span className="ad-hide-sm">Discard</span>
            </button>
          )}
          <button type="button" className="ad-button ad-primary" onClick={save} disabled={!dirty || pending}>
            {pending ? <Loader2 size={15} className="ad-spin" /> : <Save size={15} />} Save
          </button>
        </div>
      </div>

      {conflict && (
        <div className="ad-banner is-warn">
          <p>{conflict}</p>
          <button type="button" className="ad-button" onClick={() => window.location.reload()}>
            Reload
          </button>
        </div>
      )}

      <div className="ad-editor-body">
        <div className="ad-form">
          <p className="ad-blurb">{part.blurb}</p>
          <FieldsView fields={withLiveOptions(part, value as never)} value={value} onChange={setValue} />

          {customised && (
            <div className="ad-danger-zone">
              <div>
                <strong>Start over</strong>
                <p>Put this section back to how it was at launch. Nothing is lost — every version is kept in History.</p>
              </div>
              <button type="button" className="ad-button ad-quiet" onClick={reset} disabled={pending}>
                <RotateCcw size={15} /> Reset to original
              </button>
            </div>
          )}
        </div>

        {preview && part.anchor && (
          <aside className="ad-preview">
            <div className="ad-preview-bar">
              <span>Live site{dirty ? ' — save to see your changes' : ''}</span>
              <a href={`/#${part.anchor}`} target="_blank" rel="noopener noreferrer">
                Open ↗
              </a>
            </div>
            <iframe key={previewKey} src={`/?v=${previewKey}#${part.anchor}`} title="Live preview of the site" />
          </aside>
        )}
      </div>
    </div>
  )
}
