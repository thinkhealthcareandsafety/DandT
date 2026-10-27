'use client'

import { ArrowUpRight, Star } from 'lucide-react'
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
  wrap,
} from 'motion/react'
import { useRef } from 'react'
import type { SiteContent } from '@/lib/content/types'
import type { Review, ReviewData } from '@/lib/reviews'
import { Reveal, SplitHeading } from './reveal'

// Percent of the track's width travelled per second — slow enough to actually read.
const BASE_SPEED = 0.9

const SOURCE_LABEL: Record<NonNullable<Review['source']>, string> = {
  google: 'Google',
  whatsapp: 'WhatsApp',
  instagram: 'Instagram',
  email: 'Email',
  'in-person': '',
}

function ReviewCard({ review }: { review: Review }) {
  return (
    <article className="review-card">
      <span className="review-quote-mark" aria-hidden="true">
        “
      </span>
      <span className="review-stars" aria-label={`${review.rating} out of 5`}>
        {Array.from({ length: Math.round(review.rating) }).map((_, s) => (
          <Star key={s} size={13} fill="currentColor" strokeWidth={0} />
        ))}
      </span>
      <blockquote>{review.quote}</blockquote>
      <footer>
        <span className="review-avatar" aria-hidden="true">
          {review.name.trim().charAt(0).toUpperCase() || '·'}
        </span>
        <span className="review-who">
          <span className="review-name">{review.name}</span>
          <span className="review-meta">{review.meta}</span>
        </span>
        {review.source && SOURCE_LABEL[review.source] && (
          <span className="review-source">{SOURCE_LABEL[review.source]}</span>
        )}
      </footer>
    </article>
  )
}

export function Reviews({ data, copy }: { data: ReviewData; copy: SiteContent['reviews'] }) {
  const reduced = useReducedMotion()
  const paused = useRef(false)

  const baseX = useMotionValue(0)
  const { scrollY } = useScroll()
  const scrollVelocity = useVelocity(scrollY)
  const smoothVelocity = useSpring(scrollVelocity, { damping: 50, stiffness: 400 })
  const velocityFactor = useTransform(smoothVelocity, [-2000, 0, 2000], [-4, 0, 4], { clamp: false })
  const x = useTransform(baseX, (value) => `${wrap(-50, 0, value)}%`)

  const direction = useRef(1)
  const speed = useRef(1)

  useAnimationFrame((_, delta) => {
    if (reduced) return

    // Ease toward a stop on hover instead of snapping, then ease back up.
    const target = paused.current ? 0 : 1
    speed.current += (target - speed.current) * Math.min(1, delta / 260)

    let moveBy = direction.current * BASE_SPEED * speed.current * (delta / 1000)

    // Page scrolling nudges the rail: faster with the scroll, and it reverses when scrolling up.
    const factor = velocityFactor.get()
    if (factor < 0) direction.current = -1
    else if (factor > 0) direction.current = 1
    moveBy += moveBy * factor

    baseX.set(baseX.get() + moveBy)
  })

  if (!data.reviews.length) return null

  const showRating = data.average

  return (
    <section className="reviews section-pad" id="reviews">
      <div className="section-head">
        <div>
          <Reveal className="section-kicker">{copy.kicker}</Reveal>
          <h2>
            <SplitHeading>{copy.heading.line1}</SplitHeading>
            <br />
            <em>
              <SplitHeading delay={0.1}>{copy.heading.line2}</SplitHeading>
            </em>
          </h2>
        </div>

        <Reveal delay={0.15}>
          {showRating ? (
            <div className="rating-badge">
              <span className="rating-score">{data.average!.toFixed(1)}</span>
              <span className="rating-stars" aria-label={`${data.average!.toFixed(1)} out of 5`}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={13} fill="currentColor" strokeWidth={0} />
                ))}
              </span>
              <span className="rating-meta">{data.total ? `${data.total} Google reviews` : 'Google reviews'}</span>
            </div>
          ) : (
            <p className="reviews-intro">
              {copy.intro}
              <a href="#contact">
                Plan yours <ArrowUpRight size={14} />
              </a>
            </p>
          )}
        </Reveal>
      </div>

      <div
        className={`reviews-rail${reduced ? ' is-static' : ''}`}
        onPointerEnter={() => {
          paused.current = true
        }}
        onPointerLeave={() => {
          paused.current = false
        }}
        onFocusCapture={() => {
          paused.current = true
        }}
        onBlurCapture={() => {
          paused.current = false
        }}
      >
        <motion.div className="reviews-track" style={reduced ? undefined : { x }}>
          {[0, 1].map((set) => (
            <div className="reviews-set" key={set} aria-hidden={set === 1}>
              {data.reviews.map((review, i) => (
                <ReviewCard review={review} key={`${set}-${i}`} />
              ))}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
