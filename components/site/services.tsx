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
import Image, { type StaticImageData } from 'next/image'
import beadAndNailBar from '@/public/gallery/bead-and-nail-bar.jpg'
import ballPit from '@/public/gallery/ball-pit.jpg'
import bubbleHouse from '@/public/gallery/10-bubble-house-balloons.jpg'
import butterflyCentrepiece from '@/public/gallery/butterfly-centrepiece.jpg'
import canvasPainting from '@/public/gallery/canvas-painting.jpg'
import kpopArchEntrance from '@/public/gallery/kpop-arch-entrance.jpg'
import neonGlow from '@/public/themes/neon-glow.jpg'
import tattooArtistCorner from '@/public/gallery/12-tattoo-artist-corner.jpg'
import whiteArchEntrance from '@/public/gallery/white-arch-entrance.jpg'
import { Reveal, RevealGroup, RevealItem, SplitHeading } from './reveal'

/**
 * `image` is a real event photo — only set where one honestly represents that exact service.
 * Where none exists yet (return gifts, outstation), the card gets a tinted
 * gradient instead of a stock or AI photo, so nothing here misrepresents actual work.
 * Ordered so those three fall on a diagonal of the 3-up grid rather than bunching in one row.
 */
const services: {
  title: string
  copy: string
  Icon: typeof Cake
  image?: StaticImageData
  tint: 'rose' | 'gold' | 'plum'
}[] = [
  {
    title: 'Birthday Decorations',
    copy: 'Balloon installations, floral styling and photo-ready backdrops.',
    Icon: Cake,
    image: whiteArchEntrance,
    tint: 'rose',
  },
  {
    title: 'Theme Parties',
    copy: 'Fully art-directed worlds, built around what your child loves most.',
    Icon: PartyPopper,
    image: kpopArchEntrance,
    tint: 'plum',
  },
  {
    title: 'Bubble House',
    copy: 'A giant balloon-filled dome the little ones can bounce and play inside.',
    Icon: Droplets,
    image: bubbleHouse,
    tint: 'rose',
  },
  {
    title: 'Soft Play Area',
    copy: 'Clean, cushioned play zones designed for your littlest guests.',
    Icon: Baby,
    image: ballPit,
    tint: 'gold',
  },
  {
    title: 'Return Gifts',
    copy: 'Curated and beautifully wrapped — never an afterthought.',
    Icon: Gift,
    image: butterflyCentrepiece,
    tint: 'gold',
  },
  {
    title: 'Tattoo Artist',
    copy: 'Temporary art for tiny arms, on-site through the celebration.',
    Icon: Brush,
    image: tattooArtistCorner,
    tint: 'gold',
  },
  {
    title: 'Outstation Birthdays',
    copy: 'We travel, we build, you simply arrive and celebrate.',
    Icon: Plane,
    image: neonGlow,
    tint: 'plum',
  },
  {
    title: 'Canvas Paintings',
    copy: 'Guided painting corners that double as take-home keepsakes.',
    Icon: Palette,
    image: canvasPainting,
    tint: 'plum',
  },
  {
    title: 'DIY Activities',
    copy: 'Hands-on craft stations that keep every age happily busy.',
    Icon: Scissors,
    image: beadAndNailBar,
    tint: 'rose',
  },
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
          <Reveal className="section-kicker">Our specialties</Reveal>
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

              <span className={`service-media${service.image ? '' : ' service-media-tint'}`} data-tint={service.tint}>
                {service.image ? (
                  <Image
                    src={service.image}
                    alt=""
                    // Matches .service-media at each breakpoint: on phones the first card is full
                    // width and the rest are half; 2-up on tablets; then a third of the page's
                    // 1280px-capped container.
                    sizes={
                      i === 0
                        ? '(max-width: 1080px) 100vw, (max-width: 1328px) 33vw, 400px'
                        : '(max-width: 1080px) 50vw, (max-width: 1328px) 33vw, 400px'
                    }
                    quality={72}
                    placeholder="blur"
                  />
                ) : (
                  <service.Icon className="service-media-icon" size={56} strokeWidth={1} aria-hidden="true" />
                )}
                <span className="service-number">{String(i + 1).padStart(2, '0')}</span>
                <span className="service-view">
                  <ArrowUpRight size={16} strokeWidth={1.6} />
                </span>
              </span>

              <span className="service-body">
                <span className="service-heading">
                  <span className="service-icon">
                    <service.Icon size={17} strokeWidth={1.3} />
                  </span>
                  <span className="service-title">{service.title}</span>
                </span>
                <span className="service-copy">{service.copy}</span>
              </span>
            </a>
          </RevealItem>
        ))}
      </RevealGroup>
    </section>
  )
}
