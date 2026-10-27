'use client'

import { motion, useScroll, useTransform } from 'motion/react'
import { useRef } from 'react'
import type { SiteContent } from '@/lib/content/types'
import { Photo } from './photo'
import { SplitHeading } from './reveal'

export function Showcase({ data }: { data: SiteContent['showcase'] }) {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['-12%', '12%'])
  const overlay = useTransform(scrollYProgress, [0, 0.5, 1], [0.76, 0.58, 0.76])

  return (
    <section className="showcase" ref={ref}>
      <motion.div className="showcase-media" style={{ y }}>
        {/* Below the fold, always shown through a CSS grayscale+contrast filter and a dark veil —
            compression artifacts a viewer would never notice, so it can compress harder. */}
        <Photo media={data.media} alt="" aria-hidden="true" sizes="100vw" quality={60} />
      </motion.div>
      <motion.div className="showcase-veil" style={{ opacity: overlay }} aria-hidden="true" />
      <div className="showcase-inner">
        <span className="quote-mark">“</span>
        <blockquote>
          <SplitHeading>{data.heading.line1}</SplitHeading>
          <br />
          <em>
            <SplitHeading delay={0.1}>{data.heading.line2}</SplitHeading>
          </em>
        </blockquote>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          {data.attribution}
        </motion.p>
      </div>
    </section>
  )
}
