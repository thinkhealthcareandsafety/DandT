'use client'

import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useState } from 'react'

export function Preloader() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let seen = false
    try {
      seen = sessionStorage.getItem('dt-intro') === '1'
    } catch {
      seen = false
    }
    if (reduced || seen) return

    setShow(true)
    document.body.style.overflow = 'hidden'
    const timer = setTimeout(() => {
      setShow(false)
      document.body.style.overflow = ''
      try {
        sessionStorage.setItem('dt-intro', '1')
      } catch {
        /* storage unavailable */
      }
    }, 1500)

    return () => {
      clearTimeout(timer)
      document.body.style.overflow = ''
    }
  }, [])

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="preloader"
          exit={{ y: '-100%' }}
          transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
        >
          {/* The name "written" left to right, like a signature on a card. */}
          <motion.span
            className="preloader-script"
            initial={{ clipPath: 'inset(0 100% 0 0)' }}
            animate={{ clipPath: 'inset(0 0% 0 0)' }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.05, ease: [0.45, 0, 0.25, 1] }}
          >
            Dreams &amp; Themes
          </motion.span>
          <motion.span
            className="preloader-sub"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            Celebrations, made by hand
          </motion.span>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
