'use client'

import { motion, useScroll, useTransform } from 'motion/react'
import Image from 'next/image'
import { useRef } from 'react'
import heroImage from '@/public/dreams-hero.jpg'
import { SplitHeading } from './reveal'

export function Showcase() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['-12%', '12%'])
  const overlay = useTransform(scrollYProgress, [0, 0.5, 1], [0.76, 0.58, 0.76])

  return (
    <section className="showcase" ref={ref}>
      <motion.div className="showcase-media" style={{ y }}>
        {/* Below the fold, always shown through a CSS grayscale+contrast filter and a dark veil —
            compression artifacts a viewer would never notice, so it can compress harder. */}
        <Image src={heroImage} alt="" aria-hidden="true" sizes="100vw" quality={60} />
      </motion.div>
      <motion.div className="showcase-veil" style={{ opacity: overlay }} aria-hidden="true" />
      <div className="showcase-inner">
        <span className="quote-mark">“</span>
        <blockquote>
          <SplitHeading>The smallest details often make</SplitHeading>
          <br />
          <em>
            <SplitHeading delay={0.1}>the biggest memories.</SplitHeading>
          </em>
        </blockquote>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          — The Dreams &amp; Themes philosophy
        </motion.p>
      </div>
    </section>
  )
}
