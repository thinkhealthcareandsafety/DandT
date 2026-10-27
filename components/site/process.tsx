'use client'

import { type MotionStyle, motion, useScroll, useTransform } from 'motion/react'
import { useRef } from 'react'
import { ArcLine } from './decor'
import type { SiteContent } from '@/lib/content/types'
import { Reveal, RevealGroup, RevealItem, SplitHeading } from './reveal'

export function Process({ data }: { data: SiteContent['process'] }) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.75', 'end 0.6'] })
  const lineScale = useTransform(scrollYProgress, [0, 1], [0, 1])

  return (
    <section className="process-band" id="process">
      <ArcLine className="process-arc" />
      <div className="process section-pad">
      <div className="process-heading">
        <Reveal className="section-kicker">{data.kicker}</Reveal>
        <h2>
          <SplitHeading>{data.heading.line1}</SplitHeading>
          <br />
          <em>
            <SplitHeading delay={0.1}>{data.heading.line2}</SplitHeading>
          </em>
        </h2>
      </div>

      <div className="process-track" ref={ref}>
        {/* Progress is exposed as a variable so CSS can draw it across (desktop) or down (phones). */}
        <div className="process-line" aria-hidden="true">
          <motion.span style={{ '--p': lineScale } as MotionStyle} />
        </div>
        <RevealGroup className="process-steps" stagger={0.12}>
          {data.steps.map((step, i) => (
            <RevealItem className="process-step" key={`${i}-${step.title}`}>
              <span className="process-index">{String(i + 1).padStart(2, '0')}</span>
              <h3>{step.title}</h3>
              <p>{step.copy}</p>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
      </div>
    </section>
  )
}
