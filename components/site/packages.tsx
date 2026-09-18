'use client'

import { ArrowUpRight, Check } from 'lucide-react'
import { Confetti } from './decor'
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
  return (
    <section className="packages section-pad" id="packages">
      <Confetti className="packages-confetti" />
      <div className="packages-head">
        <Reveal className="section-kicker">06 &nbsp; Ways to celebrate</Reveal>
        <h2>
          <SplitHeading>Simple packages.</SplitHeading>
          <br />
          <em>
            <SplitHeading delay={0.1}>Everything included.</SplitHeading>
          </em>
        </h2>
        <Reveal delay={0.15}>
          <p>Every celebration is quoted to your space and guest list — these are the shapes we usually start from.</p>
        </Reveal>
      </div>

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
    </section>
  )
}
