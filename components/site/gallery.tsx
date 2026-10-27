'use client'

import { ArrowUpRight, Play, X } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useCallback, useEffect, useState } from 'react'
import type { GalleryItem, SiteContent } from '@/lib/content/types'
import { InViewVideo } from './inview-video'
import { Photo } from './photo'
import { Reveal, SplitHeading } from './reveal'

// Stable object (see reveal.tsx); a small amount so a tile shows as soon as its top edge arrives.
const TILE_VIEWPORT = { once: true, amount: 0.15 } as const

function VideoTile({ item }: { item: GalleryItem }) {
  return (
    <>
      <InViewVideo media={item.media} />
      <span className="gallery-film" aria-hidden="true">
        <Play size={11} fill="currentColor" strokeWidth={0} /> Film
      </span>
    </>
  )
}

export function Gallery({ data, instagram }: { data: SiteContent['gallery']; instagram: string }) {
  const items = data.items.filter((item) => item.media?.src)
  // Three full rows on desktop by default; on phones the first tile runs full width.
  const initial = Math.max(3, data.initial || 9)
  const [filter, setFilter] = useState<string>('all')
  const [expanded, setExpanded] = useState(false)
  const [active, setActive] = useState<number | null>(null)

  const filtered = filter === 'all' ? items : items.filter((item) => item.category === filter)
  const visible = expanded ? filtered : filtered.slice(0, initial)
  const categories = data.categories.filter((c) => items.some((item) => item.category === c.id))

  const close = useCallback(() => setActive(null), [])
  const step = useCallback(
    (delta: number) =>
      setActive((current) => (current === null ? null : (current + delta + filtered.length) % filtered.length)),
    [filtered.length],
  )

  useEffect(() => {
    if (active === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
      if (e.key === 'ArrowRight') step(1)
      if (e.key === 'ArrowLeft') step(-1)
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [active, close, step])

  if (!items.length) return null

  const current = active === null ? null : filtered[active]

  const choose = (next: string) => {
    setFilter(next)
    setExpanded(false)
  }

  return (
    <section className="gallery section-pad" id="gallery">
      <div className="section-head">
        <div>
          <Reveal className="section-kicker">{data.kicker}</Reveal>
          <h2>
            <SplitHeading>{data.heading.line1}</SplitHeading>
            <br />
            <em>
              <SplitHeading delay={0.1}>{data.heading.line2}</SplitHeading>
            </em>
          </h2>
        </div>
        <Reveal delay={0.15}>
          <p>
            {data.intro}
            <a href={instagram} target="_blank" rel="noopener noreferrer">
              More on Instagram <ArrowUpRight size={14} />
            </a>
          </p>
        </Reveal>
      </div>

      {categories.length > 1 && (
        <Reveal className="gallery-filters" delay={0.1}>
          <div role="group" aria-label="Filter the lookbook">
            {[{ id: 'all' as const, label: 'All' }, ...categories].map((c) => {
              const count = c.id === 'all' ? items.length : items.filter((item) => item.category === c.id).length
              return (
                <button key={c.id} aria-pressed={filter === c.id} onClick={() => choose(c.id)}>
                  {c.label}
                  <small>{count}</small>
                </button>
              )
            })}
          </div>
        </Reveal>
      )}

      {/* Keyed by filter so a new selection replays the entrance. The lead photo doubles up (2×2)
          on desktop — but only when the count keeps every row full. */}
      <div className={`gallery-grid${visible.length % 3 === 0 ? ' has-feature' : ''}`} key={filter}>
        {visible.map((item, i) => (
          // Each tile reveals itself as it scrolls in. A group-level reveal broke "Show all": the
          // grown grid is too tall for its visibility threshold ever to be met, so it stayed blank.
          <motion.div
            className="gallery-cell"
            key={`${item.media.src}-${i}`}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={TILE_VIEWPORT}
            transition={{ duration: 0.8, delay: (i % 3) * 0.06, ease: [0.16, 1, 0.3, 1] }}
          >
            <button
              className="gallery-tile"
              onClick={() => setActive(i)}
              aria-label={`${item.media.video ? 'Play film' : 'Open photo'}: ${item.alt}`}
            >
              {item.media.video ? (
                <VideoTile item={item} />
              ) : (
                <Photo
                  media={item.media}
                  alt={item.alt}
                  // Two columns up to 1080px, then a third of the page's 1280px-capped container —
                  // never the raw vw-scaled width a wide monitor would otherwise request. The
                  // lead tile is full-width on tablets/phones and two-thirds wide on desktop.
                  sizes={
                    i === 0
                      ? '(max-width: 1080px) 100vw, (max-width: 1328px) 66vw, 800px'
                      : '(max-width: 1080px) 50vw, (max-width: 1328px) 33vw, 400px'
                  }
                  quality={72}
                />
              )}
              <span className="gallery-veil" aria-hidden="true">
                <span>{item.title || item.alt}</span>
              </span>
            </button>
          </motion.div>
        ))}
      </div>

      {filtered.length > visible.length && (
        <div className="gallery-more">
          <button className="button button-outline" onClick={() => setExpanded(true)}>
            <span>Show all {filtered.length}</span>
          </button>
        </div>
      )}

      <AnimatePresence>
        {current && (
          <motion.div
            className="lightbox"
            role="dialog"
            aria-modal="true"
            aria-label={current.alt}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            onClick={close}
          >
            <button className="lightbox-close" onClick={close} aria-label="Close gallery">
              <X size={20} />
            </button>
            <button
              className="lightbox-nav lightbox-prev"
              onClick={(e) => {
                e.stopPropagation()
                step(-1)
              }}
              aria-label="Previous"
            >
              ←
            </button>
            <motion.figure
              key={`${current.media.src}-${active}`}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              // Swipe between photos on touch screens; the arrows remain for mouse and keyboard.
              drag="x"
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
                  // Matches `.lightbox figure img { max-width: min(1000px, 100%) }`.
                  sizes="(max-width: 1000px) 100vw, 1000px"
                  quality={85}
                  // Not an LCP concern (only mounts once the viewer opens it) — this just skips
                  // native lazy-load deferral for an image that's already centred on screen.
                  priority
                  draggable={false}
                />
              )}
              <figcaption>
                <span>
                  <b className="lightbox-count">
                    {active! + 1} / {filtered.length}
                  </b>
                  {current.alt}
                </span>
              </figcaption>
            </motion.figure>
            <button
              className="lightbox-nav lightbox-next"
              onClick={(e) => {
                e.stopPropagation()
                step(1)
              }}
              aria-label="Next"
            >
              →
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
