'use client'

import { ArrowUpRight, MapPin, Phone } from 'lucide-react'
import { useState } from 'react'
import type { SiteContent } from '@/lib/content/types'
import { displayPhone, instagramUrl, telLink, whatsappLink } from '@/lib/whatsapp'
import { DateField, displayDate } from './date-field'
import { Magnetic } from './magnetic'
import { Reveal, RevealGroup, RevealItem, SplitHeading } from './reveal'
import { SelectField } from './select-field'

export function Contact({ data, business }: { data: SiteContent['contact']; business: SiteContent['business'] }) {
  const occasions = data.occasions.length ? data.occasions : ['Birthday']
  const cities = [...business.cities, 'Outstation']
  const [name, setName] = useState('')
  const [occasion, setOccasion] = useState(occasions[0])
  const [date, setDate] = useState('')
  const [city, setCity] = useState(cities[0])

  const message = `Hi Dreams & Themes! I'm ${name || '—'}. I'd like to plan a ${occasion.toLowerCase()} in ${city}${
    date ? ` on ${displayDate(date)}` : ''
  }. Could you share details?`
  const whatsapp = whatsappLink(business.whatsapp, message)

  return (
    <section className="contact section-pad" id="contact">
      <div className="contact-copy">
        <Reveal className="section-kicker">{data.kicker}</Reveal>
        <h2>
          <SplitHeading>{data.heading.line1}</SplitHeading>
          <br />
          <SplitHeading delay={0.1}>{data.heading.line2}</SplitHeading>
        </h2>
        <Reveal delay={0.1}>
          <p>{data.lede}</p>
          <p className="signoff">
            <span>with love,</span> {data.signoff}
          </p>
        </Reveal>

        <RevealGroup className="enquiry" stagger={0.07}>
          <RevealItem className="field">
            <label htmlFor="enq-name">Your name</label>
            <input
              id="enq-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Riya Sharma"
              autoComplete="name"
              autoCapitalize="words"
              enterKeyHint="next"
            />
          </RevealItem>
          <RevealItem className="field">
            <SelectField label="Occasion" value={occasion} onValueChange={setOccasion} items={occasions} />
          </RevealItem>
          <RevealItem className="field">
            <DateField label="Date" value={date} onValueChange={setDate} />
          </RevealItem>
          <RevealItem className="field">
            <SelectField label="City" value={city} onValueChange={setCity} items={cities} />
          </RevealItem>
          <RevealItem className="field field-full">
            <Magnetic strength={0.22}>
              <a className="button button-dark" href={whatsapp} target="_blank" rel="noopener noreferrer">
                <span>Send on WhatsApp</span>
                <ArrowUpRight size={17} />
              </a>
            </Magnetic>
            <small>{data.note}</small>
          </RevealItem>
        </RevealGroup>

        <Reveal className="contact-cities" delay={0.1}>
          <>
            <MapPin size={17} />
            <span>
              Available in {listCities(business.cities)}
              <br />
              <small>Outstation celebrations, too.</small>
            </span>
          </>
        </Reveal>
      </div>

      <Reveal className="contact-card" delay={0.15} y={40}>
        <>
          <p className="card-label">Speak to our team</p>
          {business.contacts.map((contact, i) => (
            <a className="contact-row" href={telLink(contact.number)} key={`${i}-${contact.name}`}>
              <span>
                <strong>{contact.name}</strong>
                <small>{contact.role}</small>
              </span>
              <span className="phone-number">
                {displayPhone(contact.number)} <Phone size={15} />
              </span>
            </a>
          ))}
          <a href={`mailto:${business.email}`} className="button button-light">
            <span>Send an email</span>
            <ArrowUpRight size={17} />
          </a>
          <a
            className="social-line"
            href={instagramUrl(business.instagram)}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span>Follow along</span>
            <em>@{business.instagram.replace(/^@/, '')}</em>
          </a>
        </>
      </Reveal>
    </section>
  )
}

/** "Pune, Dehradun & Lucknow" */
function listCities(cities: string[]) {
  if (cities.length < 2) return cities.join('')
  return `${cities.slice(0, -1).join(', ')} & ${cities[cities.length - 1]}`
}
