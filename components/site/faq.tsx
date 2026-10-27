'use client'

import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
import type { SiteContent } from '@/lib/content/types'
import { jsonLd } from '@/lib/json-ld'
import { Reveal, SplitHeading } from './reveal'

export function Faq({ data }: { data: SiteContent['faq'] }) {
  const faqs = data.items
  const [open, setOpen] = useState<number | null>(0)

  return (
    <section className="faq section-pad" id="faq">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLd({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: faqs.map((faq) => ({
              '@type': 'Question',
              name: faq.q,
              acceptedAnswer: { '@type': 'Answer', text: faq.a },
            })),
          }),
        }}
      />
      <div className="faq-head">
        <Reveal className="section-kicker">{data.kicker}</Reveal>
        <h2>
          <SplitHeading>{data.heading.line1}</SplitHeading>
          <br />
          <em>
            <SplitHeading delay={0.1}>{data.heading.line2}</SplitHeading>
          </em>
        </h2>
        <Reveal delay={0.15}>
          <p>{data.intro}</p>
        </Reveal>
      </div>

      <div className="faq-list">
        {faqs.map((faq, i) => {
          const isOpen = open === i
          return (
            <div className={`faq-item${isOpen ? ' is-open' : ''}`} key={`${i}-${faq.q}`}>
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
