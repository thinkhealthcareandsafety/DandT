'use client'

import {
  ArrowUpRight,
  Baby,
  Brush,
  Cake,
  Droplets,
  Gift,
  Palette,
  PartyPopper,
  Plane,
  Scissors,
} from 'lucide-react'
import { Reveal, RevealGroup, RevealItem, SplitHeading } from './reveal'

const services = [
  { title: 'Birthday Decorations', copy: 'Balloon installations, floral styling and photo-ready backdrops.', Icon: Cake },
  { title: 'Theme Parties', copy: 'Fully art-directed worlds, built around what your child loves most.', Icon: PartyPopper },
  { title: 'Soft Play Area', copy: 'Clean, cushioned play zones designed for your littlest guests.', Icon: Baby },
  { title: 'Bubble Show', copy: 'A performer, a sky full of bubbles, and a room full of delight.', Icon: Droplets },
  { title: 'Tattoo Artist', copy: 'Temporary art for tiny arms, on-site through the celebration.', Icon: Brush },
  { title: 'Canvas Paintings', copy: 'Guided painting corners that double as take-home keepsakes.', Icon: Palette },
  { title: 'DIY Activities', copy: 'Hands-on craft stations that keep every age happily busy.', Icon: Scissors },
  { title: 'Return Gifts', copy: 'Curated and beautifully wrapped — never an afterthought.', Icon: Gift },
  { title: 'Outstation Birthdays', copy: 'We travel, we build, you simply arrive and celebrate.', Icon: Plane },
]

export function Services() {
  const handleMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    e.currentTarget.style.setProperty('--mx', `${e.clientX - rect.left}px`)
    e.currentTarget.style.setProperty('--my', `${e.clientY - rect.top}px`)
  }

  return (
    <section className="services section-pad" id="services">
      <div className="section-head">
        <div>
          <Reveal className="section-kicker">03 &nbsp; Our specialties</Reveal>
          <h2>
            <SplitHeading>Everything for a</SplitHeading>
            <br />
            <em>
              <SplitHeading delay={0.1}>day worth remembering.</SplitHeading>
            </em>
          </h2>
        </div>
        <Reveal delay={0.15}>
          <p>
            From intimate home set-ups to destination birthdays, we bring the imagination, the polish, and the
            calm.
          </p>
        </Reveal>
      </div>

      <RevealGroup className="service-grid" stagger={0.06}>
        {services.map((service, i) => (
          <RevealItem key={service.title}>
            <a className="service-card" href="#contact" onMouseMove={handleMove}>
              <span className="service-spotlight" aria-hidden="true" />
              <span className="service-top">
                <span className="service-icon">
                  <service.Icon size={19} strokeWidth={1.3} />
                </span>
                <span className="service-number">{String(i + 1).padStart(2, '0')}</span>
                <ArrowUpRight size={19} className="service-arrow" />
              </span>
              <span className="service-body">
                <span className="service-title">{service.title}</span>
                <span className="service-copy">{service.copy}</span>
              </span>
            </a>
          </RevealItem>
        ))}
      </RevealGroup>
    </section>
  )
}
