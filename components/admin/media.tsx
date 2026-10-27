'use client'

import { Check, Film, ImagePlus, Search, Upload, X } from 'lucide-react'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import type { Asset, Media } from '@/lib/content/types'
import { useAdmin } from './admin-context'

/** A small preview of a photo or film, served through the image optimiser so lists stay light. */
export function Thumb({ media, sizes = '160px', focus = true }: { media: Media; sizes?: string; focus?: boolean }) {
  if (!media?.src) {
    return (
      <span className="ad-thumb is-empty">
        <ImagePlus size={20} strokeWidth={1.4} />
      </span>
    )
  }
  return (
    <span className="ad-thumb">
      <Image
        src={media.src}
        alt=""
        fill
        sizes={sizes}
        quality={60}
        style={{ objectPosition: focus ? media.focus : undefined }}
        placeholder={media.blur ? 'blur' : 'empty'}
        blurDataURL={media.blur}
      />
      {media.video && (
        <span className="ad-thumb-film">
          <Film size={11} /> Film
        </span>
      )}
    </span>
  )
}

/** The content-safe part of an asset: what gets stored wherever the photo is used. */
export function assetToMedia(asset: Asset): Media {
  const { src, width, height, blur, video } = asset
  return { src, width, height, ...(blur ? { blur } : {}), ...(video ? { video } : {}) }
}

/** Drop files anywhere on it, or tap to choose. Works with a phone's photo picker too. */
export function Dropzone({
  onFiles,
  films = true,
  multiple = true,
  className = '',
  children,
}: {
  onFiles: (files: File[]) => void
  films?: boolean
  multiple?: boolean
  className?: string
  children: React.ReactNode
}) {
  const input = useRef<HTMLInputElement>(null)
  const [over, setOver] = useState(false)
  return (
    <div
      className={`ad-drop${over ? ' is-over' : ''} ${className}`}
      onDragOver={(e) => {
        if (!e.dataTransfer.types.includes('Files')) return
        e.preventDefault()
        setOver(true)
      }}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => {
        if (!e.dataTransfer.files.length) return
        e.preventDefault()
        setOver(false)
        onFiles(Array.from(e.dataTransfer.files))
      }}
    >
      <button type="button" className="ad-drop-button" onClick={() => input.current?.click()}>
        {children}
      </button>
      <input
        ref={input}
        type="file"
        hidden
        multiple={multiple}
        accept={films ? 'image/*,video/*' : 'image/*'}
        onChange={(e) => {
          const files = Array.from(e.target.files ?? [])
          e.target.value = ''
          if (files.length) onFiles(files)
        }}
      />
    </div>
  )
}

type Filter = 'all' | 'photos' | 'films' | 'uploads'

export function MediaPicker({
  open,
  onClose,
  onPick,
  films = true,
  current,
}: {
  open: boolean
  onClose: () => void
  onPick: (asset: Asset) => void
  films?: boolean
  current?: string
}) {
  const dialog = useRef<HTMLDialogElement>(null)
  const { library, uploadFiles } = useAdmin()
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<Filter>('all')

  useEffect(() => {
    const el = dialog.current
    if (!el) return
    if (open && !el.open) el.showModal()
    if (!open && el.open) el.close()
  }, [open])

  const q = query.trim().toLowerCase()
  const shown = library.filter((asset) => {
    if (!films && asset.video) return false
    if (filter === 'photos' && asset.video) return false
    if (filter === 'films' && !asset.video) return false
    if (filter === 'uploads' && !asset.id.startsWith('up:')) return false
    return !q || asset.name.toLowerCase().includes(q)
  })

  return (
    <dialog ref={dialog} className="ad-dialog ad-picker" onClose={onClose} onCancel={onClose}>
      <header className="ad-dialog-head">
        <div>
          <h2>Choose a {films ? 'photo or film' : 'photo'}</h2>
          <p>From your library, or upload something new.</p>
        </div>
        <button type="button" className="ad-icon-button" onClick={onClose} aria-label="Close">
          <X size={18} />
        </button>
      </header>

      <div className="ad-picker-tools">
        <label className="ad-search">
          <Search size={15} />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by name" />
        </label>
        <div className="ad-chips" role="group" aria-label="Show">
          {(['all', 'photos', ...(films ? ['films'] : []), 'uploads'] as Filter[]).map((f) => (
            <button type="button" key={f} aria-pressed={filter === f} onClick={() => setFilter(f)}>
              {f === 'all' ? 'All' : f === 'photos' ? 'Photos' : f === 'films' ? 'Films' : 'My uploads'}
            </button>
          ))}
        </div>
      </div>

      <div className="ad-picker-grid">
        <Dropzone
          films={films}
          className="ad-picker-upload"
          onFiles={async (files) => {
            const added = await uploadFiles(files)
            // Picking a single new upload is almost always what they wanted.
            if (added.length === 1) onPick(added[0])
          }}
        >
          <Upload size={20} strokeWidth={1.5} />
          <span>Upload new</span>
          <small>or drop files here</small>
        </Dropzone>
        {shown.map((asset) => (
          <button
            type="button"
            key={asset.id}
            className={`ad-pick${asset.src === current ? ' is-current' : ''}`}
            onClick={() => onPick(asset)}
            title={asset.name}
          >
            <Thumb media={asset} sizes="180px" focus={false} />
            <span className="ad-pick-name">{asset.name}</span>
            {asset.src === current && (
              <span className="ad-pick-check">
                <Check size={13} />
              </span>
            )}
          </button>
        ))}
      </div>
      {!shown.length && <p className="ad-empty">Nothing matches — try another search, or upload it.</p>}
    </dialog>
  )
}
