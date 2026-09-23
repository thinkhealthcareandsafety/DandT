'use client'

import { ArrowUpRight, Play, X } from 'lucide-react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import Image from 'next/image'
import { useCallback, useEffect, useRef, useState } from 'react'
import { GALLERY_CATEGORIES, type GalleryCategory } from '@/content/gallery'
import type { GalleryItem } from '@/lib/gallery'
import { Reveal, SplitHeading } from './reveal'

// Three full rows on desktop; on phones the first tile runs full width, so nine still ends evenly.
const INITIAL = 9

// Stable object (see reveal.tsx); a small amount so a tile shows as soon as its top edge arrives.
const TILE_VIEWPORT = { once: true, amount: 0.15 } as const

/** Plays only while on screen, so off-screen clips cost no data or battery. */
function VideoTile({ item }: { item: GalleryItem }) {
  const ref = useRef<HTMLVideoElement>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    const video = ref.current
    if (!video || reduced) return
    const observer = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting ? video.play().catch(() => {}) : video.pause()),
      { threshold: 0.35 },
    )
    observer.observe(video)
    return () => observer.disconnect()
  }, [reduced])

  return (
    <>
      <video ref={ref} src={item.video} poster={item.src} muted loop playsInline preload="none" aria-hidden="true" />
      <span className="gallery-film" aria-hidden="true">
        <Play size={11} fill="currentColor" strokeWidth={0} /> Film
      </span>
    </>
  )
}

export function Gallery({ items }: { items: GalleryItem[] }) {
  const [filter, setFilter] = useState<GalleryCategory | 'all'>('all')
  const [expanded, setExpanded] = useState(false)
  const [active, setActive] = useState<number | null>(null)

  const filtered = filter === 'all' ? items : items.filter((item) => item.category === filter)
  const visible = expanded ? filtered : filtered.slice(0, INITIAL)
  const categories = GALLERY_CATEGORIES.filter((c) => items.some((item) => item.category === c.id))

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

  const choose = (next: GalleryCategory | 'all') => {
    setFilter(next)
    setExpanded(false)
  }

  return (
    <section className="gallery section-pad" id="gallery">
      <div className="section-head">
        <div>
          <Reveal className="section-kicker">The lookbook</Reveal>
          <h2>
            <SplitHeading>Moments we</SplitHeading>
            <br />
            <em>
              <SplitHeading delay={0.1}>have made.</SplitHeading>
            </em>
          </h2>
        </div>
        <Reveal delay={0.15}>
          <p>
            Real set-ups from real celebrations — the decor, the play zones and the entertainment that fills the
            room.
            <a href="https://www.instagram.com/dreamsandthemespune/" target="_blank" rel="noopener noreferrer">
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
            key={item.src}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={TILE_VIEWPORT}
            transition={{ duration: 0.8, delay: (i % 3) * 0.06, ease: [0.16, 1, 0.3, 1] }}
          >
            <button
              className="gallery-tile"
              onClick={() => setActive(i)}
              aria-label={`${item.video ? 'Play film' : 'Open photo'}: ${item.alt}`}
            >
              {item.video ? (
                <VideoTile item={item} />
              ) : item.width && item.height ? (
                <Image
                  src={item.src}
                  alt={item.alt}
                  width={item.width}
                  height={item.height}
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
              ) : (
                // Remote Instagram media: already CDN-optimised, and its dimensions are not exposed.
                <img src={item.src} alt={item.alt} loading="lazy" decoding="async" />
              )}
              <span className="gallery-veil" aria-hidden="true">
                <span>{item.title ?? item.alt}</span>
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
              key={current.src}
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
              {current.video ? (
                <video src={current.video} poster={current.src} autoPlay muted loop playsInline controls />
              ) : current.width && current.height ? (
                <Image
                  src={current.src}
                  alt={current.alt}
                  width={current.width}
                  height={current.height}
                  // Matches `.lightbox figure img { max-width: min(1000px, 100%) }`.
                  sizes="(max-width: 1000px) 100vw, 1000px"
                  quality={85}
                  // Not an LCP concern (only mounts once the viewer opens it) — this just skips
                  // native lazy-load deferral for an image that's already centred on screen.
                  priority
                  draggable={false}
                />
              ) : (
                // Remote Instagram media: already CDN-optimised, and its dimensions are not exposed.
                <img src={current.src} alt={current.alt} draggable={false} />
              )}
              <figcaption>
                <span>
                  <b className="lightbox-count">
                    {active! + 1} / {filtered.length}
                  </b>
                  {current.alt}
                </span>
                {current.permalink && (
                  <a href={current.permalink} target="_blank" rel="noopener noreferrer">
                    View on Instagram <ArrowUpRight size={13} />
                  </a>
                )}
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
