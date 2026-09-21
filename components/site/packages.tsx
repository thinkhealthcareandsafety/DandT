'use client'

import { ArrowUpRight, Check } from 'lucide-react'
import { useRef, useState } from 'react'
import { Reveal, RevealGroup, RevealItem, SplitHeading } from './reveal'

const tiers = [
  {
    name: 'Essentials',
    price: '₹7,000',
    note: 'starting from',
    copy: 'A beautiful set-up for an intimate celebration at home.',
    includes: ['Balloon backdrop & garland', 'Name banner and signage', 'Cake table styling', 'Setup and clean-up'],
  },
  {
    name: 'Signature',
    price: 'On request',
    note: 'tailored quote',
    copy: 'The full themed world, props and play — our most booked format.',
    includes: [
      'Custom theme design & palette',
      'Themed props and backdrop build',
      'Soft play corner for little ones',
      'Return gifts, styled and wrapped',
      'On-site team through the party',
    ],
    featured: true,
  },
  {
    name: 'Grand',
    price: 'On request',
    note: 'venues & outstation',
    copy: 'Large venue builds, activities and entertainment, start to finish.',
    includes: [
      'Full venue design & installation',
      'Soft play zone and activity stations',
      'Bubble show, tattoo artist, DIY corners',
      'Outstation travel and logistics',
    ],
  },
]

export function Packages() {
  const scrollerRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)

  // The scroller is positioned, so each card's offsetLeft is measured from it. Cards snap
  // to its padding edge, so that is where a card's scroll position begins.
  const cards = () => Array.from(scrollerRef.current?.querySelectorAll<HTMLElement>('.tier-grid > div') ?? [])
  const snapLeft = (scroller: HTMLElement, card: HTMLElement) =>
    card.offsetLeft - parseFloat(getComputedStyle(scroller).paddingLeft)

  const handleScroll = () => {
    const scroller = scrollerRef.current
    if (!scroller) return
    let nearest = 0
    let best = Infinity
    cards().forEach((card, i) => {
      const distance = Math.abs(snapLeft(scroller, card) - scroller.scrollLeft)
      if (distance < best) {
        best = distance
        nearest = i
      }
    })
    setActive(nearest)
  }

  const scrollToCard = (i: number) => {
    const scroller = scrollerRef.current
    const card = cards()[i]
    if (scroller && card) scroller.scrollTo({ left: snapLeft(scroller, card), behavior: 'smooth' })
  }

  return (
    <section className="packages section-pad" id="packages">
      <div className="section-head">
        <div>
          <Reveal className="section-kicker">Ways to celebrate</Reveal>
          <h2>
            <SplitHeading>Simple packages.</SplitHeading>
            <br />
            <em>
              <SplitHeading delay={0.1}>Everything included.</SplitHeading>
            </em>
          </h2>
        </div>
        <Reveal delay={0.15}>
          <p>Every celebration is quoted to your space and guest list — these are the shapes we usually start from.</p>
        </Reveal>
      </div>

      {/* On phones this becomes a swipeable, snapping row; on larger screens it is a plain grid. */}
      <div className="tier-scroller" ref={scrollerRef} onScroll={handleScroll}>
      <RevealGroup className="tier-grid" stagger={0.1}>
        {tiers.map((tier) => (
          <RevealItem key={tier.name}>
            <div className={`tier${tier.featured ? ' is-featured' : ''}`}>
              {tier.featured && <span className="tier-flag">Most loved</span>}
              <span className="tier-name">{tier.name}</span>
              <span className="tier-price">
                <small>{tier.note}</small>
                {tier.price}
              </span>
              <p className="tier-copy">{tier.copy}</p>
              <ul>
                {tier.includes.map((item) => (
                  <li key={item}>
                    <Check size={14} /> {item}
                  </li>
                ))}
              </ul>
              <a className="tier-cta" href="#contact">
                Enquire <ArrowUpRight size={15} />
              </a>
            </div>
          </RevealItem>
        ))}
      </RevealGroup>
      </div>

      <div className="tier-dots" role="group" aria-label="Choose a package">
        {tiers.map((tier, i) => (
          <button
            key={tier.name}
            className={i === active ? 'is-active' : undefined}
            onClick={() => scrollToCard(i)}
            aria-label={`Show ${tier.name}`}
            aria-current={i === active}
          >
            <span />
          </button>
        ))}
      </div>
    </section>
  )
}
