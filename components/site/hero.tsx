'use client'

import { ArrowUpRight } from 'lucide-react'
import { type MotionValue, motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import Image, { type StaticImageData } from 'next/image'
import { useRef } from 'react'
import pastelTunnel from '@/public/gallery/01-pastel-balloon-tunnel.jpg'
import frozenStage from '@/public/gallery/frozen-elsa-stage.jpg'
import magicShow from '@/public/gallery/magician-silks.jpg'
import fairyGarden from '@/public/themes/fairy-garden.jpg'
import { Magnetic } from './magnetic'

const ease = [0.16, 1, 0.3, 1] as const

/**
 * The owner's own work, pinned up like a designer's moodboard. Every photo is from a real
 * Dreams & Themes party (colour-graded, names cropped out) — never stock or AI imagery.
 * x/y/w are percentages of the board; depth sets the scroll parallax.
 */
const pins: {
  src: StaticImageData
  alt: string
  caption: string
  x: number
  y: number
  w: number
  rotate: number
  ratio: string
  depth: number
  tape: 'rose' | 'gold'
  position?: string
}[] = [
  {
    src: frozenStage,
    alt: 'A Frozen stage with Elsa and Anna cut-outs and a lit number five',
    caption: 'Frozen, turning five',
    x: 0,
    y: 6,
    w: 47,
    rotate: -6,
    ratio: '4 / 5',
    depth: 10,
    tape: 'rose',
  },
  {
    src: pastelTunnel,
    alt: 'A pastel and gold balloon tunnel leading to a Happy Birthday backdrop',
    caption: 'pastel & gold',
    x: 45,
    y: 0,
    w: 43,
    rotate: 4,
    ratio: '3 / 4',
    depth: 4,
    tape: 'gold',
    position: '50% 40%',
  },
  {
    src: magicShow,
    alt: 'A magician pulling rainbow silks from a newspaper as the birthday girl watches',
    caption: 'the magic show',
    x: 2,
    y: 61,
    w: 50,
    rotate: 3,
    ratio: '4 / 3',
    depth: -6,
    tape: 'gold',
  },
  {
    src: fairyGarden,
    alt: 'A lilac balloon arch with a fairy cut-out and a lit number one',
    caption: 'fairy first birthday',
    x: 55,
    y: 53,
    w: 41,
    rotate: -3.5,
    ratio: '4 / 5',
    depth: 8,
    tape: 'rose',
  },
]

function Pin({
  pin,
  index,
  progress,
}: {
  pin: (typeof pins)[number]
  index: number
  progress: MotionValue<number>
}) {
  const y = useTransform(progress, [0, 1], ['0%', `${pin.depth * 3}%`])
  return (
    <motion.div
      className="pin"
      style={{ left: `${pin.x}%`, top: `${pin.y}%`, width: `${pin.w}%`, zIndex: index + 1, y }}
    >
      <motion.figure
        className="polaroid"
        initial={{ opacity: 0, y: -70, rotate: pin.rotate * 2.6, scale: 1.08 }}
        animate={{ opacity: 1, y: 0, rotate: pin.rotate, scale: 1 }}
        transition={{ type: 'spring', stiffness: 110, damping: 15, mass: 0.9, delay: 0.5 + index * 0.16 }}
        whileHover={{ rotate: 0, scale: 1.045, transition: { type: 'spring', stiffness: 260, damping: 20 } }}
      >
        <span className={`tape tape-${pin.tape}`} aria-hidden="true" />
        <span className="polaroid-photo" style={{ aspectRatio: pin.ratio }}>
          <Image
            src={pin.src}
            alt={pin.alt}
            fill
            priority={index < 2}
            sizes="(max-width: 1080px) 50vw, 300px"
            quality={75}
            placeholder="blur"
            style={{ objectPosition: pin.position }}
          />
        </span>
        <figcaption>{pin.caption}</figcaption>
      </motion.figure>
    </motion.div>
  )
}

export function Hero() {
  const ref = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const copyY = useTransform(scrollYProgress, [0, 1], ['0%', '22%'])
  const copyOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])

  return (
    <section className="hero" id="top" ref={ref}>
      <motion.div className="hero-copy" style={{ y: copyY, opacity: copyOpacity }}>
        <motion.p
          className="eyebrow"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.3, ease }}
        >
          <motion.span
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.9, delay: 0.4, ease }}
            style={{ originX: 0 }}
          />
          Pune · Dehradun · Lucknow
        </motion.p>

        <h1>
          <span className="line-mask">
            <motion.span
              className="line-inner"
              initial={{ y: '112%' }}
              animate={{ y: '0%' }}
              transition={{ duration: 1.1, delay: 0.42, ease }}
            >
              Make room for
            </motion.span>
          </span>
          <span className="line-mask hero-magic">
            <motion.span
              className="line-inner"
              initial={{ y: '112%' }}
              animate={{ y: '0%' }}
              transition={{ duration: 1.1, delay: 0.54, ease }}
            >
              <em>magic.</em>
            </motion.span>
            {/* A pen stroke under the word, drawn on once the headline has landed. */}
            <svg className="hero-swash" viewBox="0 0 320 34" aria-hidden="true" preserveAspectRatio="none">
              <motion.path
                d="M4 22 C 60 8, 118 30, 176 17 S 268 6, 316 19"
                initial={{ pathLength: reduced ? 1 : 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.1, delay: 1.35, ease: [0.65, 0, 0.35, 1] }}
              />
            </svg>
          </span>
        </h1>

        <motion.p
          className="hero-lede"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8, ease }}
        >
          Frozen stages, K-pop arches, fairy gardens and soft-play kingdoms — dreamt up with you, built by hand,
          and styled down to the last balloon.
        </motion.p>

        <motion.div
          className="hero-actions"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.92, ease }}
        >
          <Magnetic strength={0.28}>
            <a className="button button-dark" href="#contact">
              <span>Start planning</span>
              <ArrowUpRight size={17} />
            </a>
          </Magnetic>
          <a className="text-link" href="#gallery">
            See our parties <span>↗</span>
          </a>
        </motion.div>
      </motion.div>

      {/* A sibling of the copy (not inside it) so phones can place it under the board, like a caption. */}
      <motion.ul
        className="hero-trust"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 1.25, ease }}
      >
        <li>
          <strong>Set-ups from ₹7,000</strong>
          <span>Transparent, itemised quotes</span>
        </li>
        <li>
          <strong>Same-team delivery</strong>
          <span>We design, build and clean up</span>
        </li>
        <li>
          <strong>Soft play specialists</strong>
          <span>Sanitised before every party</span>
        </li>
      </motion.ul>

      <div className="hero-visual">
        <div className="hero-board">
          {pins.map((pin, i) => (
            <Pin pin={pin} index={i} progress={scrollYProgress} key={pin.caption} />
          ))}

          <motion.p
            className="board-note"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 1.5, ease }}
          >
            <svg viewBox="0 0 60 44" aria-hidden="true">
              <path d="M56 40 C 44 30, 34 14, 10 8" />
              <path d="M18 3 L 9 8 L 16 16" />
            </svg>
            every photo here is a real party of ours
          </motion.p>

          <motion.div
            className="hero-stamp"
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 1.3, ease }}
          >
            <motion.div
              className="hero-stamp-ring"
              animate={reduced ? undefined : { rotate: 360 }}
              transition={{ duration: 26, repeat: Infinity, ease: 'linear' }}
            >
              <svg viewBox="0 0 120 120">
                <defs>
                  <path id="stamp-circle" d="M60,60 m-44,0 a44,44 0 1,1 88,0 a44,44 0 1,1 -88,0" />
                </defs>
                <text>
                  <textPath href="#stamp-circle" startOffset="0%">
                    · DECOR · SOFT PLAY · THEME PARTIES · CELEBRATIONS
                  </textPath>
                </text>
              </svg>
            </motion.div>
            <span>
              For the little
              <br />
              <i>big days</i>
            </span>
          </motion.div>
        </div>
      </div>

      <motion.a
        href="#process"
        className="scroll-cue"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.7 }}
      >
        <span>Scroll</span>
        <i />
      </motion.a>
    </section>
  )
}
