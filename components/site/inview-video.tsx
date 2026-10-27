'use client'

import { useReducedMotion } from 'motion/react'
import { useEffect, useRef } from 'react'
import type { Media } from '@/lib/content/types'

/** A silent looping film that plays only while on screen, so off-screen clips cost no data or battery. */
export function InViewVideo({ media }: { media: Media }) {
  const ref = useRef<HTMLVideoElement>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    const video = ref.current
    if (!video || reduced) return
    const observer = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting ? video.play().catch(() => {}) : video.pause()),
      { threshold: 0.35 },
    )
    observer.observe(video)
    return () => observer.disconnect()
  }, [reduced])

  return (
    <video
      ref={ref}
      src={media.video}
      poster={media.src}
      muted
      loop
      playsInline
      preload="none"
      aria-hidden="true"
      style={{ objectPosition: media.focus }}
    />
  )
}
