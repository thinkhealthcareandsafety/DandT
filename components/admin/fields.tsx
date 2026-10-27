'use client'

/* eslint-disable @typescript-eslint/no-explicit-any -- the form engine walks arbitrary content shapes */

import {
  ArrowDown,
  ArrowUp,
  Copy,
  Crosshair,
  GripVertical,
  ImagePlus,
  Plus,
  Replace,
  Trash2,
  Upload,
  X,
} from 'lucide-react'
import Image from 'next/image'
import { useEffect, useId, useRef, useState } from 'react'
import type { Field } from '@/lib/admin/schema'
import type { Media } from '@/lib/content/types'
import { useAdmin } from './admin-context'
import { assetToMedia, Dropzone, MediaPicker, Thumb } from './media'

type Value = any

function move<T>(list: T[], from: number, to: number) {
  const next = [...list]
  const [item] = next.splice(from, 1)
  next.splice(to, 0, item)
  return next
}

function Label({ field, htmlFor, count }: { field: { label: string; help?: string }; htmlFor?: string; count?: string }) {
  return (
    <div className="ad-label">
      <label htmlFor={htmlFor}>{field.label}</label>
      {count && <span className="ad-count">{count}</span>}
      {field.help && <p>{field.help}</p>}
    </div>
  )
}

/* ------------------------------------------------------------------ simple fields */

function TextField({ field, value, onChange }: { field: Extract<Field, { kind: 'text' }>; value: string; onChange: (v: string) => void }) {
  const id = useId()
  const length = (value ?? '').length
  return (
    <div className="ad-field">
      <Label field={field} htmlFor={id} count={field.max && length > field.max * 0.7 ? `${length}/${field.max}` : undefined} />
      <input
        id={id}
        className="ad-input"
        value={value ?? ''}
        maxLength={field.max ? field.max + 40 : undefined}
        placeholder={field.placeholder}
        onChange={(e) => onChange(e.target.value)}
        data-over={field.max && length > field.max ? '' : undefined}
      />
    </div>
  )
}

function TextareaField({ field, value, onChange }: { field: Extract<Field, { kind: 'textarea' }>; value: string; onChange: (v: string) => void }) {
  const id = useId()
  const length = (value ?? '').length
  return (
    <div className="ad-field">
      <Label field={field} htmlFor={id} count={field.max && length > field.max * 0.7 ? `${length}/${field.max}` : undefined} />
      <textarea
        id={id}
        className="ad-input"
        rows={field.rows ?? 3}
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value)}
        data-over={field.max && length > field.max ? '' : undefined}
      />
    </div>
  )
}

function HeadingField({ field, value, onChange }: { field: Extract<Field, { kind: 'heading' }>; value: { line1: string; line2: string }; onChange: (v: Value) => void }) {
  const v = value ?? { line1: '', line2: '' }
  return (
    <div className="ad-field">
      <Label field={field} />
      <div className="ad-heading">
        <input className="ad-input ad-serif" value={v.line1} onChange={(e) => onChange({ ...v, line1: e.target.value })} aria-label={`${field.label}, first line`} />
        <input className="ad-input ad-serif ad-italic" value={v.line2} onChange={(e) => onChange({ ...v, line2: e.target.value })} aria-label={`${field.label}, second line (italic)`} />
      </div>
    </div>
  )
}

function SelectField({ field, value, onChange }: { field: Extract<Field, { kind: 'select' }>; value: string; onChange: (v: string) => void }) {
  const id = useId()
  const known = field.options.some((o) => o.value === value)
  return (
    <div className="ad-field">
      <Label field={field} htmlFor={id} />
      <select id={id} className="ad-input" value={value ?? ''} onChange={(e) => onChange(e.target.value)}>
        {!known && <option value={value ?? ''}>{value || 'Choose…'}</option>}
        {field.options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  )
}

function ToggleField({ field, value, onChange }: { field: Extract<Field, { kind: 'toggle' }>; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="ad-toggle">
      <input type="checkbox" checked={Boolean(value)} onChange={(e) => onChange(e.target.checked)} />
      <span className="ad-switch" aria-hidden="true" />
      <span>
        {field.label}
        {field.help && <small>{field.help}</small>}
      </span>
    </label>
  )
}

function NumberField({ field, value, onChange }: { field: Extract<Field, { kind: 'number' }>; value: number; onChange: (v: number) => void }) {
  const id = useId()
  if (field.key === 'rating') {
    return (
      <div className="ad-field">
        <Label field={field} />
        <div className="ad-stars" role="radiogroup" aria-label={field.label}>
          {Array.from({ length: field.max }, (_, i) => i + 1).map((n) => (
            <button type="button" key={n} role="radio" aria-checked={value === n} aria-label={`${n} stars`} data-on={n <= value ? '' : undefined} onClick={() => onChange(n)}>
              ★
            </button>
          ))}
        </div>
      </div>
    )
  }
  return (
    <div className="ad-field">
      <Label field={field} htmlFor={id} />
      <input
        id={id}
        className="ad-input ad-narrow"
        type="number"
        min={field.min}
        max={field.max}
        value={value ?? field.min}
        onChange={(e) => onChange(Math.max(field.min, Math.min(field.max, Number(e.target.value) || field.min)))}
      />
    </div>
  )
}

function PhoneField({ field, value, onChange }: { field: Extract<Field, { kind: 'phone' }>; value: string; onChange: (v: string) => void }) {
  const id = useId()
  const digits = (value ?? '').replace(/\D/g, '')
  return (
    <div className="ad-field">
      <Label field={field} htmlFor={id} />
      <div className="ad-phone" data-invalid={digits.length !== 10 ? '' : undefined}>
        <span>+91</span>
        <input id={id} className="ad-input" inputMode="numeric" value={digits} maxLength={10} onChange={(e) => onChange(e.target.value.replace(/\D/g, '').slice(0, 10))} placeholder="98765 43210" />
      </div>
      {digits.length !== 10 && <p className="ad-warn">Needs ten digits.</p>}
    </div>
  )
}

function ColorField({ field, value, onChange }: { field: Extract<Field, { kind: 'color' }>; value: string; onChange: (v: string) => void }) {
  const id = useId()
  return (
    <div className="ad-field">
      <Label field={field} htmlFor={id} />
      <div className="ad-color">
        <input id={id} type="color" value={value || '#ffffff'} onChange={(e) => onChange(e.target.value)} />
        <input className="ad-input ad-mono" value={value ?? ''} onChange={(e) => onChange(e.target.value)} aria-label={`${field.label} code`} />
      </div>
    </div>
  )
}

function ColorsField({ field, value, onChange }: { field: Extract<Field, { kind: 'colors' }>; value: string[]; onChange: (v: string[]) => void }) {
  const colors = value ?? []
  return (
    <div className="ad-field">
      <Label field={field} />
      <div className="ad-swatches">
        {colors.map((color, i) => (
          <span className="ad-swatch" key={i}>
            <input type="color" value={color} onChange={(e) => onChange(colors.map((c, j) => (j === i ? e.target.value : c)))} aria-label={`Colour ${i + 1}`} />
            <button type="button" aria-label={`Remove colour ${i + 1}`} onClick={() => onChange(colors.filter((_, j) => j !== i))}>
              <X size={11} />
            </button>
          </span>
        ))}
        {colors.length < 8 && (
          <button type="button" className="ad-swatch-add" onClick={() => onChange([...colors, colors[colors.length - 1] ?? '#e8c9c4'])} aria-label="Add a colour">
            <Plus size={15} />
          </button>
        )}
      </div>
    </div>
  )
}

function StringsField({ field, value, onChange }: { field: Extract<Field, { kind: 'strings' }>; value: string[]; onChange: (v: string[]) => void }) {
  const items = value ?? []
  return (
    <div className="ad-field">
      <Label field={field} count={`${items.length}`} />
      <div className="ad-strings">
        {items.map((item, i) => (
          <div className="ad-string" key={i}>
            <input className="ad-input" value={item} placeholder={field.placeholder} onChange={(e) => onChange(items.map((s, j) => (j === i ? e.target.value : s)))} aria-label={`${field.itemLabel} ${i + 1}`} />
            <div className="ad-mini-actions">
              <button type="button" disabled={i === 0} onClick={() => onChange(move(items, i, i - 1))} aria-label="Move up">
                <ArrowUp size={14} />
              </button>
              <button type="button" disabled={i === items.length - 1} onClick={() => onChange(move(items, i, i + 1))} aria-label="Move down">
                <ArrowDown size={14} />
              </button>
              <button type="button" onClick={() => onChange(items.filter((_, j) => j !== i))} aria-label={`Remove ${field.itemLabel}`}>
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
        <button type="button" className="ad-add" onClick={() => onChange([...items, ''])}>
          <Plus size={15} /> Add {field.itemLabel}
        </button>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ media */

function MediaField({ field, value, onChange }: { field: Extract<Field, { kind: 'media' }>; value: Media | undefined; onChange: (v: Media | undefined) => void }) {
  const [picking, setPicking] = useState(false)
  const media = value?.src ? value : undefined
  const [fx, fy] = (media?.focus ?? '50% 50%').split(' ').map((n) => parseFloat(n))

  // Click the photo to choose the point that must stay in frame when the site crops it.
  const setFocus = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!media) return
    const rect = e.currentTarget.getBoundingClientRect()
    const x = Math.round(((e.clientX - rect.left) / rect.width) * 100)
    const y = Math.round(((e.clientY - rect.top) / rect.height) * 100)
    onChange({ ...media, focus: `${x}% ${y}%` })
  }

  return (
    <div className="ad-field">
      <Label field={field} />
      {media ? (
        <div className="ad-media">
          <button type="button" className="ad-media-full" onClick={setFocus} aria-label="Set the focal point">
            <Image src={media.src} alt="" fill sizes="(max-width: 700px) 60vw, 280px" quality={60} style={{ objectFit: 'contain' }} />
            <span className="ad-focus" style={{ left: `${fx}%`, top: `${fy}%` }} aria-hidden="true" />
          </button>
          <div className="ad-media-side">
            <div className="ad-crops" aria-hidden="true">
              <span style={{ aspectRatio: '4 / 5' }}>
                <Thumb media={media} sizes="90px" />
              </span>
              <span style={{ aspectRatio: '16 / 10' }}>
                <Thumb media={media} sizes="120px" />
              </span>
            </div>
            <p className="ad-hint">
              <Crosshair size={13} /> Tap the photo to set what stays in frame. The small previews show how it crops.
            </p>
            <div className="ad-row">
              <button type="button" className="ad-button" onClick={() => setPicking(true)}>
                <Replace size={15} /> Change
              </button>
              {media.focus && (
                <button type="button" className="ad-button ad-quiet" onClick={() => onChange({ ...media, focus: undefined })}>
                  Re-centre
                </button>
              )}
              {field.optional && (
                <button type="button" className="ad-button ad-quiet ad-danger" onClick={() => onChange(undefined)}>
                  Remove
                </button>
              )}
            </div>
          </div>
        </div>
      ) : (
        <button type="button" className="ad-media-empty" onClick={() => setPicking(true)}>
          <ImagePlus size={22} strokeWidth={1.4} />
          <span>Choose {field.films ? 'a photo or film' : 'a photo'}</span>
        </button>
      )}
      <MediaPicker
        open={picking}
        films={field.films}
        current={media?.src}
        onClose={() => setPicking(false)}
        onPick={(asset) => {
          // A new photo starts centred; the old focal point belonged to the old photo.
          onChange(assetToMedia(asset))
          setPicking(false)
        }}
      />
    </div>
  )
}

/* ------------------------------------------------------------------ lists */

function ItemSheet({ title, open, onClose, children }: { title: string; open: boolean; onClose: () => void; children: React.ReactNode }) {
  const ref = useRef<HTMLDialogElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (open && !el.open) el.showModal()
    if (!open && el.open) el.close()
  }, [open])
  return (
    <dialog ref={ref} className="ad-dialog ad-sheet" onClose={onClose} onCancel={onClose}>
      <header className="ad-dialog-head">
        <h2>{title}</h2>
        <button type="button" className="ad-button ad-primary" onClick={onClose}>
          Done
        </button>
      </header>
      <div className="ad-sheet-body">{open && children}</div>
    </dialog>
  )
}

function ListField({ field, value, onChange }: { field: Extract<Field, { kind: 'list' }>; value: Value[]; onChange: (v: Value[]) => void }) {
  const items = value ?? []
  const { uploadFiles } = useAdmin()
  const [open, setOpen] = useState<number | null>(null)
  const [dragging, setDragging] = useState<number | null>(null)
  const atMax = field.max !== undefined && items.length >= field.max
  const atMin = field.min !== undefined && items.length <= field.min
  const fixed = field.min !== undefined && field.min === field.max

  const add = () => {
    onChange([...items, field.create()])
    setOpen(items.length)
  }
  const remove = (i: number) => {
    const summary = field.summary(items[i] as never)
    if (!confirm(`Remove “${summary.title}”? You can still discard changes before saving.`)) return
    onChange(items.filter((_, j) => j !== i))
    setOpen(null)
  }

  const controls = (i: number) => (
    <div className="ad-mini-actions">
      <button type="button" disabled={i === 0} onClick={() => onChange(move(items, i, i - 1))} aria-label="Move earlier">
        <ArrowUp size={14} />
      </button>
      <button type="button" disabled={i === items.length - 1} onClick={() => onChange(move(items, i, i + 1))} aria-label="Move later">
        <ArrowDown size={14} />
      </button>
      {!fixed && !atMax && (
        <button type="button" onClick={() => onChange([...items.slice(0, i + 1), structuredClone(items[i]), ...items.slice(i + 1)])} aria-label="Duplicate">
          <Copy size={14} />
        </button>
      )}
      {!atMin && (
        <button type="button" onClick={() => remove(i)} aria-label={`Remove ${field.itemLabel}`}>
          <Trash2 size={14} />
        </button>
      )}
    </div>
  )

  const dragProps = (i: number) => ({
    draggable: true,
    onDragStart: (e: React.DragEvent) => {
      setDragging(i)
      e.dataTransfer.effectAllowed = 'move'
    },
    onDragOver: (e: React.DragEvent) => {
      if (dragging === null || dragging === i) return
      e.preventDefault()
      onChange(move(items, dragging, i))
      setDragging(i)
    },
    onDragEnd: () => setDragging(null),
  })

  const editor = (i: number) => (
    <FieldsView fields={field.fields} value={items[i]} onChange={(next) => onChange(items.map((item, j) => (j === i ? next : item)))} />
  )

  return (
    <div className="ad-field ad-list-field">
      <div className="ad-list-head">
        <Label field={field} count={`${items.length}${field.max ? ` / ${field.max}` : ''}`} />
        <div className="ad-row">
          {field.bulk && !atMax && (
            <Dropzone
              className="ad-inline-drop"
              onFiles={async (files) => {
                const assets = await uploadFiles(files)
                if (assets.length) onChange([...assets.map((a) => field.bulk!(assetToMedia(a), a.name)), ...items])
              }}
            >
              <Upload size={15} /> Upload photos
            </Dropzone>
          )}
          {!atMax && (
            <button type="button" className="ad-button" onClick={add}>
              <Plus size={15} /> Add {field.itemLabel}
            </button>
          )}
        </div>
      </div>

      {field.grid ? (
        <>
          <div className="ad-grid">
            {items.map((item, i) => {
              const s = field.summary(item as never)
              return (
                <div key={i} className={`ad-card${dragging === i ? ' is-dragging' : ''}`} {...dragProps(i)}>
                  <button type="button" className="ad-card-open" onClick={() => setOpen(i)}>
                    <Thumb media={s.media as Media} sizes="200px" />
                    {i === 0 && <span className="ad-badge">First</span>}
                    <span className="ad-card-text">
                      <strong>{s.title}</strong>
                      {s.sub && <small>{s.sub}</small>}
                    </span>
                  </button>
                  {controls(i)}
                </div>
              )
            })}
          </div>
          <ItemSheet
            title={open !== null && items[open] ? `Edit ${field.itemLabel}` : ''}
            open={open !== null && items[open] !== undefined}
            onClose={() => setOpen(null)}
          >
            {open !== null && items[open] !== undefined && (
              <>
                {editor(open)}
                <div className="ad-sheet-foot">
                  {controls(open)}
                </div>
              </>
            )}
          </ItemSheet>
        </>
      ) : (
        <div className="ad-rows">
          {items.map((item, i) => {
            const s = field.summary(item as never)
            const isOpen = open === i
            return (
              <div key={i} className={`ad-item${isOpen ? ' is-open' : ''}${dragging === i ? ' is-dragging' : ''}`} {...(isOpen ? {} : dragProps(i))}>
                <div className="ad-item-head">
                  <span className="ad-grip" aria-hidden="true">
                    <GripVertical size={15} />
                  </span>
                  <button type="button" className="ad-item-toggle" onClick={() => setOpen(isOpen ? null : i)} aria-expanded={isOpen}>
                    {s.media !== undefined && <Thumb media={s.media} sizes="64px" />}
                    <span>
                      <strong>{s.title}</strong>
                      {s.sub && <small>{s.sub}</small>}
                    </span>
                  </button>
                  {controls(i)}
                </div>
                {isOpen && <div className="ad-item-body">{editor(i)}</div>}
              </div>
            )
          })}
          {!items.length && <p className="ad-empty">Nothing here yet.</p>}
        </div>
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ dispatch */

function FieldView({ field, value, onChange }: { field: Field; value: Value; onChange: (v: Value) => void }) {
  switch (field.kind) {
    case 'text':
      return <TextField field={field} value={value} onChange={onChange} />
    case 'textarea':
      return <TextareaField field={field} value={value} onChange={onChange} />
    case 'heading':
      return <HeadingField field={field} value={value} onChange={onChange} />
    case 'media':
      return <MediaField field={field} value={value} onChange={onChange} />
    case 'select':
      return <SelectField field={field} value={value} onChange={onChange} />
    case 'toggle':
      return <ToggleField field={field} value={value} onChange={onChange} />
    case 'number':
      return <NumberField field={field} value={value} onChange={onChange} />
    case 'phone':
      return <PhoneField field={field} value={value} onChange={onChange} />
    case 'color':
      return <ColorField field={field} value={value} onChange={onChange} />
    case 'colors':
      return <ColorsField field={field} value={value} onChange={onChange} />
    case 'strings':
      return <StringsField field={field} value={value} onChange={onChange} />
    case 'list':
      return <ListField field={field} value={value} onChange={onChange} />
    default:
      return null
  }
}

/** Renders a set of fields against one object. A field with an empty key edits the object itself. */
export function FieldsView({ fields, value, onChange }: { fields: Field[]; value: Value; onChange: (v: Value) => void }) {
  return (
    <div className="ad-fields">
      {fields.map((field, i) => {
        if (field.kind === 'group') {
          return (
            <fieldset className="ad-group" key={`g${i}`}>
              <legend>{field.label}</legend>
              <FieldsView fields={field.fields} value={value} onChange={onChange} />
            </fieldset>
          )
        }
        const own = field.key === '' ? value : value?.[field.key]
        return (
          <FieldView
            key={field.key || i}
            field={field}
            value={own}
            onChange={(next) => onChange(field.key === '' ? next : { ...value, [field.key]: next })}
          />
        )
      })}
    </div>
  )
}
