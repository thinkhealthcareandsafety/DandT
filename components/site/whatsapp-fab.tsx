'use client'

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'motion/react'
import { useEffect, useState } from 'react'

const message = "Hi Dreams & Themes! I'd love to plan a celebration. Could you share some details?"
const href = `https://wa.me/919559507878?text=${encodeURIComponent(message)}`

function WhatsAppGlyph() {
  return (
    <svg viewBox="0 0 24 24" width="19" height="19" aria-hidden="true" fill="currentColor">
      <path d="M12.04 2a9.9 9.9 0 0 0-8.5 14.98L2 22l5.16-1.5A9.93 9.93 0 1 0 12.04 2Zm0 18.1a8.2 8.2 0 0 1-4.2-1.15l-.3-.18-3.06.89.9-2.98-.2-.31a8.18 8.18 0 1 1 6.86 3.73Zm4.5-6.13c-.25-.12-1.46-.72-1.69-.8-.23-.08-.39-.12-.56.12-.16.25-.64.8-.78.97-.14.16-.29.18-.53.06a6.7 6.7 0 0 1-3.34-2.92c-.25-.43.25-.4.72-1.34.08-.16.04-.3-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.4-.41-.56-.42h-.47a.9.9 0 0 0-.65.3 2.74 2.74 0 0 0-.85 2.03 4.76 4.76 0 0 0 1 2.53 10.9 10.9 0 0 0 4.17 3.68c1.55.67 2.16.73 2.94.61.47-.07 1.46-.6 1.66-1.17.21-.58.21-1.07.15-1.17-.06-.1-.22-.16-.47-.28Z" />
    </svg>
  )
}

/** Floating WhatsApp shortcut — the main way families here actually enquire. */
export function WhatsAppFab() {
  const { scrollY } = useScroll()
  const [pastHero, setPastHero] = useState(false)
  const [atContact, setAtContact] = useState(false)

  useMotionValueEvent(scrollY, 'change', (y) => setPastHero(y > window.innerHeight * 0.7))

  // Step aside while the contact section (which has its own WhatsApp button) is on screen.
  useEffect(() => {
    const contact = document.getElementById('contact')
    if (!contact) return
    const observer = new IntersectionObserver(([entry]) => setAtContact(entry.isIntersecting), { threshold: 0.15 })
    observer.observe(contact)
    return () => observer.disconnect()
  }, [])

  return (
    <AnimatePresence>
      {pastHero && !atContact && (
        <motion.a
          className="wa-fab"
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat with us on WhatsApp"
          initial={{ opacity: 0, y: 24, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 24, scale: 0.9 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="wa-fab-icon">
            <WhatsAppGlyph />
          </span>
          <span className="wa-fab-label">Chat on WhatsApp</span>
        </motion.a>
      )}
    </AnimatePresence>
  )
}
