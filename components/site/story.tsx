'use client'

import { motion, useScroll, useTransform } from 'motion/react'
import { useRef } from 'react'
import { Counter } from './counter'
import { Reveal, RevealGroup, RevealItem, SplitHeading } from './reveal'

const paragraph =
  'We believe the best celebrations are the ones that feel entirely yours. A little unexpected, deeply personal, and full of the details that make everyone pause and smile.'

function ScrollFillText({ text }: { text: string }) {
  const ref = useRef<HTMLParagraphElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.9', 'end 0.7'] })
  const words = text.split(' ')

  return (
    <p className="fill-text" ref={ref}>
      {words.map((word, i) => {
        const start = i / words.length
        const end = start + 1 / words.length
        return (
          <Word key={i} progress={scrollYProgress} range={[start, end]}>
            {word}
          </Word>
        )
      })}
    </p>
  )
}

function Word({
  children,
  progress,
  range,
}: {
  children: string
  progress: ReturnType<typeof useScroll>['scrollYProgress']
  range: [number, number]
}) {
  const opacity = useTransform(progress, range, [0.26, 1])
  return (
    <span className="fill-word">
      <motion.span style={{ opacity }}>{children}</motion.span>{' '}
    </span>
  )
}

const stats = [
  { value: 8, suffix: '+', label: 'Years of celebrations' },
  { value: 3, suffix: '', label: 'Cities we style in' },
  { value: 9, suffix: '', label: 'Signature services' },
]

export function Story() {
  return (
    <section className="intro section-pad" id="story">
      <Reveal className="section-kicker">
        <>01 &nbsp; The D&amp;T way</>
      </Reveal>
      <div className="intro-content">
        <h2>
          <SplitHeading>Not just a party.</SplitHeading>
          <br />
          <em>
            <SplitHeading delay={0.12}>A feeling.</SplitHeading>
          </em>
        </h2>
        <div className="intro-body">
          <ScrollFillText text={paragraph} />
          <Reveal delay={0.1}>
            <a className="text-link" href="#contact">
              Meet your celebration team <span>↗</span>
            </a>
          </Reveal>
        </div>
      </div>

      <RevealGroup className="stat-row">
        {stats.map((stat) => (
          <RevealItem className="stat" key={stat.label}>
            <span className="stat-value">
              <Counter to={stat.value} suffix={stat.suffix} />
            </span>
            <span className="stat-label">{stat.label}</span>
          </RevealItem>
        ))}
      </RevealGroup>
    </section>
  )
}
