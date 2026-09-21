'use client'

import { ArrowUpRight } from 'lucide-react'
import { AnimatePresence, motion, useMotionValue, useSpring } from 'motion/react'
import Image, { type StaticImageData } from 'next/image'
import { useRef, useState } from 'react'
import barbieGlam from '@/public/themes/barbie-glam.jpg'
import characterWorlds from '@/public/themes/character-worlds.jpg'
import floralEntrances from '@/public/themes/floral-entrances.jpg'
import inflatables from '@/public/themes/inflatables.jpg'
import neonGlow from '@/public/themes/neon-glow.jpg'
import pastelGold from '@/public/themes/pastel-gold.jpg'
import softPlay from '@/public/themes/soft-play.jpg'
import { Reveal, SplitHeading } from './reveal'

type Theme = { name: string; note: string; image: StaticImageData; alt: string }

const themes: Theme[] = [
  {
    name: 'Pastel & Gold',
    note: 'Balloon tunnels and arches in blush, mint and gold',
    image: pastelGold,
    alt: 'A pastel and gold balloon arch leading to a Happy Birthday backdrop',
  },
  {
    name: 'Neon Glow',
    note: 'Lit balloon pillars and neon signs for evening parties',
    image: neonGlow,
    alt: 'A hotel corridor lined with glowing balloon pillars',
  },
  {
    name: 'Barbie Glam',
    note: 'Hot pink tables, silhouettes and confetti',
    image: barbieGlam,
    alt: 'A pink Barbie-themed table with a silhouette centrepiece',
  },
  {
    name: 'Character Worlds',
    note: 'Life-size cut-outs of the characters they love',
    image: characterWorlds,
    alt: 'A balloon arch entrance flanked by cartoon character cut-outs',
  },
  {
    name: 'Soft Play Wonderland',
    note: 'Ball pits, slides and padded play for the little ones',
    image: softPlay,
    alt: 'Children playing in a colourful ball pit',
  },
  {
    name: 'Floral Entrances',
    note: 'Flower carts and blooms that greet guests at the door',
    image: floralEntrances,
    alt: 'A white flower cart with pink blossoms and balloons at a venue entrance',
  },
  {
    name: 'Pastel Inflatables',
    note: 'Bouncy castles and bubble houses in soft colours',
    image: inflatables,
    alt: 'A pastel bouncy castle set up indoors',
  },
]

export function Themes() {
  const listRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState<number | null>(null)

  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 260, damping: 28, mass: 0.6 })
  const springY = useSpring(y, { stiffness: 260, damping: 28, mass: 0.6 })

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = listRef.current?.getBoundingClientRect()
    if (!rect) return
    x.set(e.clientX - rect.left)
    y.set(e.clientY - rect.top)
  }

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

      <div
        className="theme-list"
        ref={listRef}
        onMouseMove={handleMove}
        onMouseLeave={() => setActive(null)}
        data-has-active={active !== null || undefined}
      >
        {themes.map((theme, i) => (
          <motion.a
            key={theme.name}
            href="#contact"
            className={`theme-row${active === i ? ' is-active' : ''}`}
            onMouseEnter={() => setActive(i)}
            onFocus={() => setActive(i)}
            onBlur={() => setActive(null)}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.8, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="theme-index">{String(i + 1).padStart(2, '0')}</span>
            <span className="theme-name">{theme.name}</span>
            <span className="theme-note">{theme.note}</span>
            <span className="theme-thumb">
              <Image src={theme.image} alt={theme.alt} sizes="96px" placeholder="blur" />
            </span>
            <ArrowUpRight className="theme-arrow" size={20} strokeWidth={1.4} />
          </motion.a>
        ))}

        {/* Follows the pointer on devices that can hover; hidden on touch, where the inline thumbs show instead. */}
        <motion.div className="theme-preview" style={{ x: springX, y: springY }} aria-hidden="true">
          <AnimatePresence>
            {active !== null && (
              <motion.div
                key={active}
                className="theme-preview-card"
                initial={{ opacity: 0, scale: 0.86, rotate: -4 }}
                animate={{ opacity: 1, scale: 1, rotate: active % 2 ? 3 : -3 }}
                exit={{ opacity: 0, scale: 0.92 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              >
                <Image src={themes[active].image} alt="" sizes="300px" placeholder="blur" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  )
}
