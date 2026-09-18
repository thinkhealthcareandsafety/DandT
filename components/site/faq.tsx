'use client'

import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
import { Reveal, SplitHeading } from './reveal'

const faqs = [
  {
    q: 'How far in advance should we book?',
    a: 'Two to three weeks gives us room to design properly, source props and lock your date. Last-minute celebrations are often possible too — message us and we will tell you honestly what we can do.',
  },
  {
    q: 'Do you travel outside Pune?',
    a: 'Yes. We regularly style celebrations in Dehradun and Lucknow, and we take on outstation birthdays where we travel with the full set-up and team.',
  },
  {
    q: 'What is included in the soft play rental?',
    a: 'Clean, cushioned play zones sized for toddlers and young children — ball pits, soft blocks and play equipment, set up and sanitised before your guests arrive.',
  },
  {
    q: 'Can you work in our home, society hall or a venue?',
    a: 'All three. We have styled compact apartment set-ups, society clubhouses and full venue builds. Share photos of the space and we will design around it.',
  },
  {
    q: 'How does the process start?',
    a: 'Send us a message on WhatsApp with the date, the age and anything your child is loving right now. We come back with ideas and an estimate, then take it from there.',
  },
]

export function Faq() {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <section className="faq section-pad" id="faq">
      <div className="faq-head">
        <Reveal className="section-kicker">08 &nbsp; Good to know</Reveal>
        <h2>
          <SplitHeading>Questions,</SplitHeading>
          <br />
          <em>
            <SplitHeading delay={0.1}>answered.</SplitHeading>
          </em>
        </h2>
        <Reveal delay={0.15}>
          <p>
            Still wondering about something? Message us — we would rather answer a small question than have you
            guess.
          </p>
        </Reveal>
      </div>

      <div className="faq-list">
        {faqs.map((faq, i) => {
          const isOpen = open === i
          return (
            <div className={`faq-item${isOpen ? ' is-open' : ''}`} key={faq.q}>
              <button onClick={() => setOpen(isOpen ? null : i)} aria-expanded={isOpen}>
                <span className="faq-index">{String(i + 1).padStart(2, '0')}</span>
                <span className="faq-q">{faq.q}</span>
                <span className="faq-toggle" aria-hidden="true">
                  <i />
                  <i />
                </span>
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    className="faq-a"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <p>{faq.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </div>
    </section>
  )
}
