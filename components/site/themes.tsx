'use client'

import { ArrowUpRight } from 'lucide-react'
import { motion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import type { SiteContent } from '@/lib/content/types'
import { Photo } from './photo'
import { Reveal, SplitHeading } from './reveal'

export function Themes({ data }: { data: SiteContent['themes'] }) {
  const themes = data.items
  const [active, setActive] = useState(0)
  const rowRefs = useRef<(HTMLAnchorElement | null)[]>([])
  // While the pointer is over the list it picks the photo; scrolling picks it otherwise.
  const pointerInside = useRef(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (pointerInside.current) return
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(Number((entry.target as HTMLElement).dataset.index))
        }
      },
      // A thin band across the middle of the viewport: the row crossing it is the active one.
      { rootMargin: '-46% 0px -52% 0px' },
    )
    for (const row of rowRefs.current) if (row) observer.observe(row)
    return () => observer.disconnect()
  }, [])

  if (!themes.length) return null
  const current = themes[Math.min(active, themes.length - 1)]

  return (
    <section className="themes section-pad" id="themes">
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
          <p>{data.intro}</p>
        </Reveal>
      </div>

      <div className="theme-layout">
        <div
          className="theme-list"
          onPointerEnter={(e) => {
            if (e.pointerType === 'mouse') pointerInside.current = true
          }}
          onPointerLeave={() => {
            pointerInside.current = false
          }}
        >
          {themes.map((theme, i) => (
            <motion.a
              key={`${i}-${theme.name}`}
              ref={(el) => {
                rowRefs.current[i] = el
              }}
              data-index={i}
              href="#contact"
              className={`theme-row${active === i ? ' is-active' : ''}`}
              onPointerEnter={(e) => {
                if (e.pointerType === 'mouse') setActive(i)
              }}
              onFocus={() => setActive(i)}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.8, delay: (i % 4) * 0.05, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="theme-index">{String(i + 1).padStart(2, '0')}</span>
              <span className="theme-text">
                <span className="theme-name">{theme.name}</span>
                <span className="theme-note">{theme.note}</span>
                {/* Phones only — on wide screens the palette sits under the big photo instead. */}
                <span className="theme-swatches theme-swatches-inline" aria-hidden="true">
                  {theme.palette.map((c, ci) => (
                    <i key={`${c}-${ci}`} style={{ background: c }} />
                  ))}
                </span>
              </span>
              <span className="theme-thumb">
                <Photo media={theme.media} alt={theme.alt} sizes="84px" quality={68} />
              </span>
              <ArrowUpRight className="theme-arrow" size={20} strokeWidth={1.4} />
            </motion.a>
          ))}
        </div>

        {/* Wide screens only: a sticky photo that follows the active row. Hidden (and so never
            fetched, since the images lazy-load) where the rows carry their own thumbnails. */}
        <div className="theme-stage" aria-hidden="true">
          <div className="theme-stage-frame">
            {themes.map((theme, i) => (
              <Photo
                key={`${i}-${theme.name}`}
                media={theme.media}
                alt=""
                fill
                sizes="(max-width: 1328px) 36vw, 470px"
                quality={72}
                className={i === active ? 'is-active' : undefined}
              />
            ))}
          </div>
          <div className="theme-stage-caption">
            <span>
              {String(active + 1).padStart(2, '0')} <i>/ {String(themes.length).padStart(2, '0')}</i>
            </span>
            <strong key={current.name}>{current.name}</strong>
          </div>
          <div className="theme-palette">
            <em>the palette</em>
            <span className="theme-swatches">
              {current.palette.map((c, i) => (
                <motion.i
                  key={`${current.name}-${c}-${i}`}
                  style={{ background: c }}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 320, damping: 18, delay: i * 0.05 }}
                />
              ))}
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
