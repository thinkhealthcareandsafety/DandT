'use client'

import { ArrowUpRight } from 'lucide-react'
import { motion, useScroll, useTransform } from 'motion/react'
import { useRef } from 'react'
import { Sparkle } from './decor'
import { Magnetic } from './magnetic'

const ease = [0.16, 1, 0.3, 1] as const

function Line({ children, delay }: { children: React.ReactNode; delay: number }) {
  return (
    <span className="line-mask">
      <motion.span
        className="line-inner"
        initial={{ y: '112%' }}
        animate={{ y: '0%' }}
        transition={{ duration: 1.1, delay, ease }}
      >
        {children}
      </motion.span>
    </span>
  )
}

export function Hero() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const imageY = useTransform(scrollYProgress, [0, 1], ['0%', '16%'])
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.12])
  const copyY = useTransform(scrollYProgress, [0, 1], ['0%', '22%'])
  const copyOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])

  return (
    <section className="hero" id="top" ref={ref}>
      <motion.div className="hero-copy" style={{ y: copyY, opacity: copyOpacity }}>
        <motion.p
          className="eyebrow"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5, ease }}
        >
          <motion.span
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.9, delay: 0.6, ease }}
            style={{ originX: 0 }}
          />
          Pune · Dehradun · Lucknow
        </motion.p>

        <h1>
          <Line delay={0.62}>Make room for</Line>
          <Line delay={0.74}>
            <em>magic.</em>
          </Line>
        </h1>

        <motion.p
          className="hero-lede"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.95, ease }}
        >
          Beautifully considered celebrations — decor, soft play and theme builds — for the moments your family
          will remember forever.
        </motion.p>

        <motion.div
          className="hero-actions"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.06, ease }}
        >
          <Magnetic strength={0.28}>
            <a className="button button-dark" href="#contact">
              <span>Start planning</span>
              <ArrowUpRight size={17} />
            </a>
          </Magnetic>
          <a className="text-link" href="#services">
            Explore our services <span>↗</span>
          </a>
        </motion.div>

        <motion.div
          className="hero-note"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.1, delay: 1.25, ease }}
        >
          <div className="avatar-stack">
            <span>✦</span>
            <span>✧</span>
            <span>♡</span>
          </div>
          <p>
            <strong>Celebrations, curated with care.</strong>
            <br />
            From the first idea to the last little detail.
          </p>
        </motion.div>

        <motion.ul
          className="hero-trust"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.4, ease }}
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
      </motion.div>

      <div className="hero-visual">
        <motion.div
          className="image-frame"
          initial={{ clipPath: 'inset(100% 0% 0% 0%)' }}
          animate={{ clipPath: 'inset(0% 0% 0% 0%)' }}
          transition={{ duration: 1.5, delay: 0.42, ease }}
        >
          <motion.div
            className="image-inner"
            initial={{ scale: 1.22 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.9, delay: 0.42, ease }}
          >
            <motion.img
              src="/dreams-hero.png"
              alt="A styled birthday celebration with a balloon garland, florals and a dessert table"
              style={{ y: imageY, scale: imageScale }}
            />
          </motion.div>
        </motion.div>

        <span className="hero-glow" aria-hidden="true" />
        <Sparkle className="hero-sparkle hero-sparkle-a" />
        <Sparkle className="hero-sparkle hero-sparkle-b" />

        <motion.div
          className="vertical-label"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.4 }}
        >
          DREAMS &amp; THEMES <span>EST. 2018</span>
        </motion.div>

        <motion.div
          className="hero-stamp"
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 1.5, ease }}
        >
          <motion.div
            className="hero-stamp-ring"
            animate={{ rotate: 360 }}
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

      <motion.a
        href="#story"
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
