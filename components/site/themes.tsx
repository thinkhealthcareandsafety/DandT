'use client'

import { ArrowUpRight } from 'lucide-react'
import { motion } from 'motion/react'
import Image, { type StaticImageData } from 'next/image'
import { useEffect, useRef, useState } from 'react'
import barbieGlam from '@/public/themes/barbie-glam.jpg'
import fairyGarden from '@/public/themes/fairy-garden.jpg'
import floralEntrances from '@/public/themes/floral-entrances.jpg'
import football from '@/public/themes/football.jpg'
import inflatables from '@/public/themes/inflatables.jpg'
import kpopStars from '@/public/themes/kpop-stars.jpg'
import lightRingArch from '@/public/gallery/light-ring-arch.jpg'
import neonGlow from '@/public/themes/neon-glow.jpg'
import pastelGold from '@/public/themes/pastel-gold.jpg'
import softPlay from '@/public/themes/soft-play.jpg'
import { Reveal, SplitHeading } from './reveal'

/** `position` is the photo's object-position, for shots whose subject sits off-centre. */
type Theme = {
  name: string
  note: string
  image: StaticImageData
  alt: string
  position?: string
  /** The theme's colour story, read by eye from the balloons and fabrics in its photo. */
  palette: string[]
}

const themes: Theme[] = [
  {
    name: 'Pastel & Gold',
    note: 'Balloon tunnels and arches in blush, mint and gold',
    image: pastelGold,
    alt: 'A pastel and gold balloon arch leading to a Happy Birthday backdrop',
    palette: ['#f4c2c0', '#e98b86', '#9fd3d6', '#f3e19a', '#c9a45c'],
  },
  {
    name: 'Neon Glow',
    note: 'Lit balloon pillars and neon signs for evening parties',
    image: neonGlow,
    alt: 'A hotel corridor lined with glowing balloon pillars',
    palette: ['#e96bc4', '#8f86dc', '#e8aa90', '#f6f0ec', '#e2bd78'],
  },
  {
    name: 'Barbie Glam',
    note: 'Hot pink tables, silhouettes and confetti',
    image: barbieGlam,
    alt: 'A pink Barbie-themed table with a silhouette centrepiece',
    palette: ['#d6246e', '#e48fb0', '#b8e0e6', '#f5f2ef', '#8e3fa0'],
  },
  {
    name: 'Character Worlds',
    note: 'Life-size cut-outs of the characters they love',
    image: kpopStars,
    alt: 'A balloon arch entrance flanked by life-size K-pop character cut-outs',
    palette: ['#d9b62c', '#e86fa0', '#9b7fd6', '#c7b9ec', '#f0dbe9'],
  },
  {
    name: 'Frozen Wonderland',
    note: 'Icy blues, snowflakes and a Frozen-favourite entrance',
    image: lightRingArch,
    alt: 'A glowing ring-light arch flanked by Olaf, Elsa and Anna cut-outs in a marble hotel foyer',
    position: '50% 62%',
    palette: ['#e1dfd8', '#b4cce8', '#8aa2cc', '#54688f', '#2d3a59'],
  },
  {
    name: 'Fairy Garden',
    note: 'Blush and lilac blooms with a fairy of their own',
    image: fairyGarden,
    alt: 'A blush and lilac balloon arch with a fairy cut-out and floral accents',
    palette: ['#d8c7ec', '#7b5aa6', '#f1c9d4', '#e2f1a3', '#ad7eb3'],
  },
  {
    name: 'Soft Play Wonderland',
    note: 'Ball pits, slides and padded play for the little ones',
    image: softPlay,
    alt: 'A garden soft play area with a slide, see-saw and colourful play fencing',
    palette: ['#b2e1eb', '#a6cd79', '#e2bb24', '#658f45', '#d52a3c'],
  },
  {
    name: 'Floral Entrances',
    note: 'Flower carts and blooms that greet guests at the door',
    image: floralEntrances,
    alt: 'A white flower cart with pink blossoms and balloons at a venue entrance',
    palette: ['#e8a0b4', '#b99ac2', '#f4eee6', '#9fb58a', '#c4a36a'],
  },
  {
    name: 'Pastel Inflatables',
    note: 'Bouncy castles and bubble houses in soft colours',
    image: inflatables,
    alt: 'A pastel bouncy castle set up indoors',
    palette: ['#e9cfe6', '#f4e7a8', '#b9d6ec', '#f5c6cf', '#f6f3ee'],
  },
  {
    name: 'Match Day',
    note: 'Football goals and team colours for the sports-mad',
    image: football,
    alt: 'A football-themed balloon display with a giant football and goal props',
    palette: ['#f3f2ee', '#9dbc64', '#13956d', '#336819', '#26282a'],
  },
]

export function Themes() {
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

  const current = themes[active]

  return (
    <section className="themes section-pad" id="themes">
      <div className="section-head">
        <div>
          <Reveal className="section-kicker">Themes we love</Reveal>
          <h2>
            <SplitHeading>Pick a world.</SplitHeading>
            <br />
            <em>
              <SplitHeading delay={0.1}>We&apos;ll build it.</SplitHeading>
            </em>
          </h2>
        </div>
        <Reveal delay={0.15}>
          <p>
            A few of the worlds we build most often. Every one gets tailored to your child, your space and whatever
            they love this year.
          </p>
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
              key={theme.name}
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
                  {theme.palette.map((c) => (
                    <i key={c} style={{ background: c }} />
                  ))}
                </span>
              </span>
              <span className="theme-thumb">
                <Image
                  src={theme.image}
                  alt={theme.alt}
                  sizes="84px"
                  quality={68}
                  placeholder="blur"
                  style={{ objectPosition: theme.position }}
                />
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
              <Image
                key={theme.name}
                src={theme.image}
                alt=""
                fill
                sizes="(max-width: 1328px) 36vw, 470px"
                quality={72}
                placeholder="blur"
                className={i === active ? 'is-active' : undefined}
                style={{ objectPosition: theme.position }}
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
                  key={`${current.name}-${c}`}
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
