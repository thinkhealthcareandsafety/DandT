'use client'

import { ArrowUpRight, Star } from 'lucide-react'
import { motion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import type { ReviewData } from '@/lib/reviews'
import { Reveal, SplitHeading } from './reveal'

export function Reviews({ data }: { data: ReviewData }) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const [bound, setBound] = useState(0)

  useEffect(() => {
    const update = () => {
      const wrap = wrapRef.current
      const track = trackRef.current
      if (!wrap || !track) return
      setBound(Math.max(0, track.scrollWidth - wrap.clientWidth))
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [data.reviews.length])

  if (!data.reviews.length) return null

  return (
    <section className="reviews section-pad" id="reviews">
      <div className="reviews-head">
        <div>
          <Reveal className="section-kicker">05 &nbsp; Kind words</Reveal>
          <h2>
            <SplitHeading>What families</SplitHeading>
            <br />
            <em>
              <SplitHeading delay={0.1}>say afterwards.</SplitHeading>
            </em>
          </h2>
        </div>

        <Reveal delay={0.15}>
          {data.source === 'google' && data.average ? (
            <div className="rating-badge">
              <span className="rating-score">{data.average.toFixed(1)}</span>
              <span className="rating-stars" aria-label={`${data.average.toFixed(1)} out of 5`}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={13} fill="currentColor" strokeWidth={0} />
                ))}
              </span>
              <span className="rating-meta">
                {data.total ? `${data.total} Google reviews` : 'Google reviews'}
              </span>
            </div>
          ) : (
            <p className="reviews-intro">
              The part we care about most — what parents tell us once the balloons come down.
              <a href="#contact">
                Plan yours <ArrowUpRight size={14} />
              </a>
            </p>
          )}
        </Reveal>
      </div>

      <div className="reviews-rail" ref={wrapRef}>
        <motion.div
          className="reviews-track"
          ref={trackRef}
          drag="x"
          dragConstraints={{ left: -bound, right: 0 }}
          dragElastic={0.06}
          dragTransition={{ power: 0.25, timeConstant: 260 }}
        >
          {data.reviews.map((review, i) => (
            <motion.article
              className="review-card"
              key={`${review.name}-${i}`}
              initial={{ opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.75, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="review-stars" aria-label={`${review.rating} out of 5`}>
                {Array.from({ length: Math.round(review.rating) }).map((_, s) => (
                  <Star key={s} size={13} fill="currentColor" strokeWidth={0} />
                ))}
              </span>
              <blockquote>{review.quote}</blockquote>
              <footer>
                <span className="review-name">{review.name}</span>
                <span className="review-meta">{review.meta}</span>
              </footer>
            </motion.article>
          ))}
        </motion.div>
      </div>

      {bound > 0 && (
        <p className="reviews-hint" aria-hidden="true">
          Drag to read more →
        </p>
      )}
    </section>
  )
}
