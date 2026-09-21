'use client'

import { ArrowUpRight, MessageCircle, Phone, Sparkles } from 'lucide-react'
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'motion/react'
import { useEffect, useState } from 'react'
import { Magnetic } from './magnetic'

const links = [
  { label: 'Services', href: '#services' },
  { label: 'Gallery', href: '#gallery' },
  { label: 'Packages', href: '#packages' },
  { label: 'How it works', href: '#process' },
  { label: 'Contact', href: '#contact' },
]

export function Nav() {
  const { scrollY } = useScroll()
  const [hidden, setHidden] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    if (open) window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  useMotionValueEvent(scrollY, 'change', (latest) => {
    const previous = scrollY.getPrevious() ?? 0
    setScrolled(latest > 40)
    setHidden(latest > previous && latest > 320 && !open)
  })

  return (
    <>
      <motion.header
        className={`top-stack${scrolled ? ' is-scrolled' : ''}${open ? ' is-menu-open' : ''}`}
        animate={{ y: hidden ? '-110%' : '0%' }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="announcement">
          <Sparkles size={13} />
          <span className="announcement-long">Thoughtfully planned celebrations, wherever you are.</span>
          <span className="announcement-short">Thoughtfully planned celebrations</span>
        </div>
        <div className="nav-wrap">
        <a href="#top" className="brand" aria-label="Dreams and Themes home">
          <span className="brand-mark">
            D<span>&amp;</span>T
          </span>
          <span className="brand-name">
            Dreams <i>and</i> Themes
          </span>
        </a>
        <nav className="nav-links" aria-label="Main navigation">
          {links.map((link) => (
            <a href={link.href} key={link.href}>
              <span>{link.label}</span>
            </a>
          ))}
        </nav>
        <Magnetic className="nav-cta-wrap">
          <a className="nav-cta" href="#contact">
            Plan a celebration <ArrowUpRight size={16} />
          </a>
        </Magnetic>
        <button
          className={`nav-burger${open ? ' is-open' : ''}`}
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
        >
          <span />
          <span />
        </button>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            className="nav-overlay"
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0% 0)' }}
            exit={{ clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
          >
            <motion.nav
              initial="hidden"
              animate="show"
              variants={{ hidden: {}, show: { transition: { staggerChildren: 0.07, delayChildren: 0.25 } } }}
            >
              {links.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  variants={{
                    hidden: { opacity: 0, y: 34 },
                    show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
                  }}
                >
                  <small>{String(i + 1).padStart(2, '0')}</small>
                  {link.label}
                </motion.a>
              ))}
            </motion.nav>
            <motion.div
              className="nav-overlay-foot"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0, transition: { delay: 0.55, duration: 0.6, ease: [0.16, 1, 0.3, 1] } }}
            >
              <div className="nav-overlay-actions">
                <a
                  className="nav-overlay-wa"
                  href="https://wa.me/919559507878?text=Hi%20Dreams%20%26%20Themes!%20I'd%20love%20to%20plan%20a%20celebration."
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle size={17} /> WhatsApp us
                </a>
                <a className="nav-overlay-call" href="tel:+919559507878" aria-label="Call +91 95595 07878">
                  <Phone size={17} />
                </a>
              </div>
              <span>Pune · Dehradun · Lucknow</span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
