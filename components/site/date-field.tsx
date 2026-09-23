'use client'

import { Popover } from '@base-ui/react/popover'
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react'
import { useState } from 'react'

const DAY_LABELS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
const MONTH_LABELS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

function toISO(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function fromISO(iso: string) {
  if (!iso) return null
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export function displayDate(iso: string) {
  const d = fromISO(iso)
  if (!d) return ''
  return `${d.getDate()} ${MONTH_LABELS[d.getMonth()].slice(0, 3)} ${d.getFullYear()}`
}

function sameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}

/**
 * A branded calendar to replace the browser's native <input type="date"> pop-up, which is
 * drawn by the OS and can't be restyled — matches the site's cream/plum/serif language, and
 * two weeks out is highlighted, since that's how much notice a booking usually needs.
 */
export function DateField({
  label,
  value,
  onValueChange,
}: {
  label: string
  value: string
  onValueChange: (iso: string) => void
}) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const selected = fromISO(value)
  const [open, setOpen] = useState(false)
  const [cursor, setCursor] = useState(() => selected ?? today)

  const monthStart = new Date(cursor.getFullYear(), cursor.getMonth(), 1)
  const firstWeekday = monthStart.getDay()
  const daysInMonth = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0).getDate()
  const cells: (Date | null)[] = [
    ...Array(firstWeekday).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => new Date(cursor.getFullYear(), cursor.getMonth(), i + 1)),
  ]
  const twoWeeksOut = new Date(today)
  twoWeeksOut.setDate(twoWeeksOut.getDate() + 14)

  const changeMonth = (delta: number) => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + delta, 1))

  const pick = (d: Date) => {
    onValueChange(toISO(d))
    setOpen(false)
  }

  return (
    <Popover.Root
      open={open}
      onOpenChange={(next) => {
        setOpen(next)
        if (next) setCursor(selected ?? today)
      }}
    >
      <span className="field-label" id="enq-date-label">
        {label}
      </span>
      <Popover.Trigger
        className="date-trigger"
        aria-labelledby="enq-date-label"
        data-empty={!value || undefined}
      >
        {value ? displayDate(value) : 'dd / mm / yyyy'}
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Positioner className="date-positioner" sideOffset={8} align="start">
          <Popover.Popup className="date-popup">
            <div className="date-nav">
              <button type="button" onClick={() => changeMonth(-1)} aria-label="Previous month">
                <ChevronLeft size={15} />
              </button>
              <span>
                {MONTH_LABELS[cursor.getMonth()]} {cursor.getFullYear()}
              </span>
              <button type="button" onClick={() => changeMonth(1)} aria-label="Next month">
                <ChevronRight size={15} />
              </button>
            </div>

            <div className="date-weekdays">
              {DAY_LABELS.map((d) => (
                <span key={d}>{d}</span>
              ))}
            </div>

            <div className="date-grid">
              {cells.map((d, i) =>
                d ? (
                  <button
                    key={d.toISOString()}
                    type="button"
                    className="date-cell"
                    data-selected={(selected && sameDay(d, selected)) || undefined}
                    data-today={sameDay(d, today) || undefined}
                    data-past={d < today || undefined}
                    disabled={d < today}
                    onClick={() => pick(d)}
                  >
                    {d.getDate()}
                    {sameDay(d, twoWeeksOut) && <Sparkles className="date-cell-badge" size={9} />}
                  </button>
                ) : (
                  <span key={`gap-${i}`} aria-hidden="true" />
                ),
              )}
            </div>

            <p className="date-note">
              <Sparkles size={11} /> Two weeks out gives us room to design it properly.
            </p>
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  )
}
