'use client'

import { ArrowUpRight, X } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useCallback, useEffect, useRef, useState } from 'react'
import type { Service } from '@/lib/content/types'
import { whatsappLink } from '@/lib/whatsapp'
import { Photo } from './photo'
import { SERVICE_ICON_COMPONENTS } from './service-icons'

/**
 * Tapping a service opens its real photos: the work first, then a one-tap WhatsApp enquiry that
 * already names the service.
 */
export function ServiceViewer({
  service,
  index,
  whatsapp,
  onClose,
}: {
  service: Service | null
  index: number
  whatsapp: string
  onClose: () => void
}) {
  const [active, setActive] = useState(0)
  const closeRef = useRef<HTMLButtonElement>(null)
  const photos = service?.photos.filter((p) => p.media?.src) ?? []
  const count = photos.length

  const step = useCallback((delta: number) => setActive((i) => (i + delta + count) % count), [count])

  useEffect(() => {
    if (!service) return
    setActive(0)
    const opener = document.activeElement as HTMLElement | null
    closeRef.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') step(1)
      if (e.key === 'ArrowLeft') step(-1)
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
      opener?.focus()
    }
  }, [service, onClose, step])

  // Keep the active thumbnail in view as you step through.
  const strip = useRef<HTMLDivElement>(null)
  useEffect(() => {
    strip.current?.children[active]?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
  }, [active])

  const current = photos[active]
  const Icon = service ? (SERVICE_ICON_COMPONENTS[service.icon] ?? SERVICE_ICON_COMPONENTS.sparkles) : null
  const films = photos.filter((p) => p.media.video).length
  const tally = [
    count - films && `${count - films} photo${count - films === 1 ? '' : 's'}`,
    films && `${films} film${films === 1 ? '' : 's'}`,
  ]
    .filter(Boolean)
    .join(' · ')

  return (
    <AnimatePresence>
      {service && current && Icon && (
        <motion.div
          className="svc-viewer"
          role="dialog"
          aria-modal="true"
          aria-label={service.title}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
        >
          <button ref={closeRef} className="lightbox-close" onClick={onClose} aria-label="Close">
            <X size={20} />
          </button>

          <div className="svc-stage">
            <motion.figure
              key={`${current.media.src}-${active}`}
              className="svc-photo"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              drag={count > 1 ? 'x' : false}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.5}
              onDragEnd={(_, info) => {
                if (info.offset.x < -60 || info.velocity.x < -400) step(1)
                else if (info.offset.x > 60 || info.velocity.x > 400) step(-1)
              }}
            >
              {current.media.video ? (
                <video src={current.media.video} poster={current.media.src} autoPlay muted loop playsInline controls />
              ) : (
                <Photo
                  media={{ ...current.media, focus: undefined }}
                  alt={current.alt}
                  sizes="(max-width: 900px) 100vw, 64vw"
                  quality={85}
                  priority
                  draggable={false}
                />
              )}
            </motion.figure>

            {count > 1 && (
              <>
                <button className="lightbox-nav lightbox-prev" onClick={() => step(-1)} aria-label="Previous photo">
                  ←
                </button>
                <button className="lightbox-nav lightbox-next" onClick={() => step(1)} aria-label="Next photo">
                  →
                </button>
              </>
            )}
          </div>

          <aside className="svc-panel">
            <span className="svc-kicker">
              <span className="svc-icon">
                <Icon size={16} strokeWidth={1.4} />
              </span>
              Our specialties · {String(index + 1).padStart(2, '0')}
            </span>
            <h2>{service.title}</h2>
            <p>{service.copy}</p>
            <p className="svc-caption">
              <b>
                {active + 1} / {count}
              </b>
              {current.alt}
            </p>

            {count > 1 && (
              <div className="svc-strip" ref={strip} role="group" aria-label={`${service.title}: ${tally}`}>
                {photos.map((photo, i) => (
                  <button
                    key={`${photo.media.src}-${i}`}
                    className={i === active ? 'is-active' : undefined}
                    onClick={() => setActive(i)}
                    aria-label={`Show photo ${i + 1}`}
                    aria-current={i === active}
                  >
                    <Photo media={photo.media} alt="" fill sizes="72px" quality={60} />
                  </button>
                ))}
              </div>
            )}

            <a
              className="button button-light svc-cta"
              href={whatsappLink(
                whatsapp,
                `Hi Dreams & Themes! I'd love to know more about your ${service.title.toLowerCase()}. Could you share details?`,
              )}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span>Enquire about {service.title}</span>
              <ArrowUpRight size={17} />
            </a>
            <a className="svc-more" href="#gallery" onClick={onClose}>
              See the full gallery <ArrowUpRight size={14} />
            </a>
          </aside>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
