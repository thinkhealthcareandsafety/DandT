'use client'

import { type MotionStyle, motion, useScroll, useTransform } from 'motion/react'
import { useRef } from 'react'
import { ArcLine } from './decor'
import { Reveal, RevealGroup, RevealItem, SplitHeading } from './reveal'

const steps = [
  {
    title: 'Tell us the dream',
    copy: 'A call, a mood, a favourite character — anything is enough to begin.',
  },
  {
    title: 'We design it',
    copy: 'Palette, props, play zones and the little surprises, planned to the last detail.',
  },
  {
    title: 'We build it',
    copy: 'Our team arrives, styles the space and handles everything on the day.',
  },
  {
    title: 'You celebrate',
    copy: 'You stay present with your people. We quietly take care of the rest.',
  },
]

export function Process() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.75', 'end 0.6'] })
  const lineScale = useTransform(scrollYProgress, [0, 1], [0, 1])

  return (
    <section className="process-band" id="process">
      <ArcLine className="process-arc" />
      <div className="process section-pad">
      <div className="process-heading">
        <Reveal className="section-kicker">How it works</Reveal>
        <h2>
          <SplitHeading>Four easy steps.</SplitHeading>
          <br />
          <em>
            <SplitHeading delay={0.1}>Zero stress.</SplitHeading>
          </em>
        </h2>
      </div>

      <div className="process-track" ref={ref}>
        {/* Progress is exposed as a variable so CSS can draw it across (desktop) or down (phones). */}
        <div className="process-line" aria-hidden="true">
          <motion.span style={{ '--p': lineScale } as MotionStyle} />
        </div>
        <RevealGroup className="process-steps" stagger={0.12}>
          {steps.map((step, i) => (
            <RevealItem className="process-step" key={step.title}>
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
