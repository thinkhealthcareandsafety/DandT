'use client'

import { ArrowUpRight, Images, MessageCircle } from 'lucide-react'
import { useCallback, useState } from 'react'
import type { SiteContent } from '@/lib/content/types'
import { Photo } from './photo'
import { Reveal, RevealGroup, RevealItem, SplitHeading } from './reveal'
import { SERVICE_ICON_COMPONENTS } from './service-icons'
import { ServiceViewer } from './service-viewer'

/**
 * A card's photo is a real event photo — only set where one honestly represents that service.
 * Where none exists yet, the card gets a tinted gradient with its icon instead of a stock or AI
 * photo, so nothing here misrepresents actual work.
 */
export function Services({ data, whatsapp }: { data: SiteContent['services']; whatsapp: string }) {
  const [open, setOpen] = useState<number | null>(null)
  const close = useCallback(() => setOpen(null), [])

  const handleMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    e.currentTarget.style.setProperty('--mx', `${e.clientX - rect.left}px`)
    e.currentTarget.style.setProperty('--my', `${e.clientY - rect.top}px`)
  }

  const count = data.items.length
  if (!count) return null

  // The owners can list any number of services, so a closing card fills whatever is left of the
  // last row at each breakpoint: 3 columns on desktop, 2 on tablets, and on phones the first card
  // runs full width with the rest in pairs. Zero means the row is already full and it hides.
  const fill = `service-fill fill-lg-${(3 - (count % 3)) % 3} fill-md-${(2 - (count % 2)) % 2} fill-sm-${(count - 1) % 2}`

  return (
    <section className="services section-pad" id="services">
      <div className="section-head">
        <div>
          <Reveal className="section-kicker">{data.kicker}</Reveal>
          <h2>
            <SplitHeading>{data.heading.line1}</SplitHeading>
            <br />
            <em>
              <SplitHeading delay={0.1}>{data.heading.line2}</SplitHeading>
            </em>
          </h2>
        </div>
        <Reveal delay={0.15}>
          <p>{data.intro}</p>
        </Reveal>
      </div>

      <RevealGroup className="service-grid" stagger={0.06}>
        {data.items.map((service, i) => {
          const Icon = SERVICE_ICON_COMPONENTS[service.icon] ?? SERVICE_ICON_COMPONENTS.sparkles
          const media = service.media?.src ? service.media : undefined
          const photos = service.photos?.filter((p) => p.media?.src).length ?? 0
          // With photos, the card opens them; without, it goes straight to the enquiry form.
          const Card = photos ? 'button' : 'a'
          const cardProps = photos
            ? { type: 'button' as const, onClick: () => setOpen(i), 'aria-label': `${service.title}: see ${photos} photos` }
            : { href: '#contact' }
          return (
            <RevealItem key={`${i}-${service.title}`}>
              <Card className="service-card" onMouseMove={handleMove} {...cardProps}>
                <span className="service-spotlight" aria-hidden="true" />

                <span className={`service-media${media ? '' : ' service-media-tint'}`} data-tint={service.tint}>
                  {media ? (
                    <Photo
                      media={media}
                      alt=""
                      fill
                      // Matches .service-media at each breakpoint: on phones the first card is full
                      // width and the rest are half; 2-up on tablets; then a third of the page's
                      // 1280px-capped container.
                      sizes={
                        i === 0
                          ? '(max-width: 1080px) 100vw, (max-width: 1328px) 33vw, 400px'
                          : '(max-width: 1080px) 50vw, (max-width: 1328px) 33vw, 400px'
                      }
                      quality={72}
                    />
                  ) : (
                    <Icon className="service-media-icon" size={56} strokeWidth={1} aria-hidden="true" />
                  )}
                  <span className="service-number">{String(i + 1).padStart(2, '0')}</span>
                  {photos ? (
                    <span className="service-view service-count">
                      <Images size={13} strokeWidth={1.6} />
                      {photos}
                    </span>
                  ) : (
                    <span className="service-view">
                      <ArrowUpRight size={16} strokeWidth={1.6} />
                    </span>
                  )}
                </span>

                <span className="service-body">
                  <span className="service-heading">
                    <span className="service-icon">
                      <Icon size={17} strokeWidth={1.3} />
                    </span>
                    <span className="service-title">{service.title}</span>
                  </span>
                  <span className="service-copy">{service.copy}</span>
                </span>
              </Card>
            </RevealItem>
          )
        })}
        <RevealItem className={fill}>
          <a className="service-fill-card" href="#contact">
            <span className="service-fill-mark" aria-hidden="true">
              <MessageCircle size={20} strokeWidth={1.3} />
            </span>
            <span className="service-fill-title">
              Something else <em>in mind?</em>
            </span>
            <span className="service-fill-copy">
              Tell us the idea — if it can be built, styled or hired for a party, we’ll find a way.
            </span>
            <span className="service-fill-link">
              Ask us <ArrowUpRight size={15} />
            </span>
          </a>
        </RevealItem>
      </RevealGroup>

      <ServiceViewer service={open === null ? null : data.items[open]} index={open ?? 0} whatsapp={whatsapp} onClose={close} />
    </section>
  )
}
