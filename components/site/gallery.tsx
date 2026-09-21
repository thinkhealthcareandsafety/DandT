'use client'

import { ArrowUpRight, X } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import Image from 'next/image'
import { useCallback, useEffect, useState } from 'react'
import type { GalleryItem } from '@/lib/gallery'
import { Reveal, RevealGroup, RevealItem, SplitHeading } from './reveal'

export function Gallery({ items }: { items: GalleryItem[] }) {
  const [active, setActive] = useState<number | null>(null)

  const close = useCallback(() => setActive(null), [])
  const step = useCallback(
    (delta: number) => setActive((current) => (current === null ? null : (current + delta + items.length) % items.length)),
    [items.length],
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

  const current = active === null ? null : items[active]

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
            A little of what we have styled — balloon installations, dessert tables and the details in between.
            <a href="https://www.instagram.com/dreamsandthemespune/" target="_blank" rel="noopener noreferrer">
              See it all on Instagram <ArrowUpRight size={14} />
            </a>
          </p>
        </Reveal>
      </div>

      <RevealGroup className="gallery-grid" stagger={0.05}>
        {items.map((item, i) => (
          <RevealItem className="gallery-cell" key={item.src} y={18}>
            <button className="gallery-tile" onClick={() => setActive(i)} aria-label={`Open image: ${item.alt}`}>
              {item.width && item.height ? (
                <Image
                  src={item.src}
                  alt={item.alt}
                  width={item.width}
                  height={item.height}
                  sizes="(max-width: 760px) 100vw, (max-width: 1080px) 50vw, 33vw"
                />
              ) : (
                // Remote Instagram media: already CDN-optimised, and its dimensions are not exposed.
                <img src={item.src} alt={item.alt} loading="lazy" decoding="async" />
              )}
              <span className="gallery-veil" aria-hidden="true">
                <span>{item.alt}</span>
              </span>
            </button>
          </RevealItem>
        ))}
      </RevealGroup>

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
              aria-label="Previous image"
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
              <img src={current.src} alt={current.alt} draggable={false} />
              <figcaption>
                <span>
                  <b className="lightbox-count">
                    {active! + 1} / {items.length}
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
              aria-label="Next image"
            >
              →
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
