'use client'

import { Check, Pencil, Search, Trash2, Upload } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
import { deleteAsset, renameAsset } from '@/app/admin/actions'
import { useAdmin } from './admin-context'
import { Dropzone, Thumb } from './media'

type Filter = 'all' | 'photos' | 'films' | 'uploads' | 'unused'

function size(bytes?: number) {
  if (!bytes) return ''
  return bytes > 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(1)} MB` : `${Math.round(bytes / 1024)} KB`
}

export function MediaLibrary({ usage }: { usage: Record<string, string[]> }) {
  const { library, uploadFiles, removeFromLibrary, renameInLibrary, toast } = useAdmin()
  const router = useRouter()
  const [filter, setFilter] = useState<Filter>('all')
  const [query, setQuery] = useState('')
  const [editing, setEditing] = useState<string | null>(null)
  const [draft, setDraft] = useState('')
  const [pending, startTransition] = useTransition()

  const q = query.trim().toLowerCase()
  const shown = library.filter((asset) => {
    if (filter === 'photos' && asset.video) return false
    if (filter === 'films' && !asset.video) return false
    if (filter === 'uploads' && !asset.id.startsWith('up:')) return false
    if (filter === 'unused' && (usage[asset.src]?.length ?? 0) > 0) return false
    return !q || asset.name.toLowerCase().includes(q)
  })

  const remove = (id: string, name: string) => {
    if (!confirm(`Delete “${name}” for good? This can’t be undone.`)) return
    startTransition(async () => {
      const result = await deleteAsset(id)
      if (!result.ok) return toast(result.error, 'error')
      removeFromLibrary(id)
      toast('Deleted.')
    })
  }

  const rename = (id: string) => {
    const name = draft.trim()
    setEditing(null)
    if (!name) return
    renameInLibrary(id, name)
    startTransition(async () => {
      const result = await renameAsset(id, name)
      if (!result.ok) toast(result.error, 'error')
    })
  }

  return (
    <div className="ad-page">
      <header className="ad-page-head">
        <p className="ad-kicker">Media library</p>
        <h1>
          Every photo &amp; <em>film.</em>
        </h1>
        <p>
          Upload here, then choose them anywhere on the site. Large phone photos are resized automatically, and films
          get a cover frame of their own.
        </p>
      </header>

      <Dropzone
        className="ad-bigdrop"
        onFiles={async (files) => {
          await uploadFiles(files)
          router.refresh()
        }}
      >
        <Upload size={24} strokeWidth={1.4} />
        <strong>Drop photos and films here</strong>
        <span>or tap to choose from your phone or computer</span>
      </Dropzone>

      <div className="ad-picker-tools">
        <label className="ad-search">
          <Search size={15} />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by name" />
        </label>
        <div className="ad-chips" role="group" aria-label="Show">
          {(
            [
              ['all', `All ${library.length}`],
              ['photos', 'Photos'],
              ['films', 'Films'],
              ['uploads', 'My uploads'],
              ['unused', 'Not on the site'],
            ] as [Filter, string][]
          ).map(([f, label]) => (
            <button type="button" key={f} aria-pressed={filter === f} onClick={() => setFilter(f)}>
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="ad-library">
        {shown.map((asset) => {
          const used = usage[asset.src] ?? []
          const uploaded = asset.id.startsWith('up:')
          return (
            <figure className="ad-asset" key={asset.id}>
              <a href={asset.video ?? asset.src} target="_blank" rel="noopener noreferrer" className="ad-asset-media">
                <Thumb media={asset} sizes="220px" focus={false} />
              </a>
              <figcaption>
                {editing === asset.id ? (
                  <form
                    className="ad-rename"
                    onSubmit={(e) => {
                      e.preventDefault()
                      rename(asset.id)
                    }}
                  >
                    <input className="ad-input" value={draft} autoFocus onChange={(e) => setDraft(e.target.value)} onBlur={() => rename(asset.id)} />
                    <button className="ad-icon-button" aria-label="Save name">
                      <Check size={15} />
                    </button>
                  </form>
                ) : (
                  <strong title={asset.name}>{asset.name}</strong>
                )}
                <small>
                  {asset.width}×{asset.height}
                  {asset.size ? ` · ${size(asset.size)}` : ''}
                  {!uploaded && ' · came with the site'}
                </small>
                <span className={`ad-usage${used.length ? '' : ' is-unused'}`}>
                  {used.length ? `On the site: ${used.join(', ')}` : 'Not on the site yet'}
                </span>
              </figcaption>
              {uploaded && (
                <div className="ad-asset-actions">
                  <button
                    type="button"
                    className="ad-icon-button"
                    aria-label={`Rename ${asset.name}`}
                    onClick={() => {
                      setDraft(asset.name)
                      setEditing(asset.id)
                    }}
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    type="button"
                    className="ad-icon-button ad-danger"
                    aria-label={`Delete ${asset.name}`}
                    disabled={pending || used.length > 0}
                    title={used.length ? 'Swap it out on the site before deleting' : 'Delete'}
                    onClick={() => remove(asset.id, asset.name)}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              )}
            </figure>
          )
        })}
      </div>
      {!shown.length && <p className="ad-empty">Nothing here.</p>}
    </div>
  )
}
