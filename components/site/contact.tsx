'use client'

import { ArrowUpRight, MapPin, Phone } from 'lucide-react'
import { useState } from 'react'
import { Magnetic } from './magnetic'
import { Reveal, RevealGroup, RevealItem, SplitHeading } from './reveal'
import { SelectField } from './select-field'

const contacts = [
  // Nikita is always listed first — she holds the largest stake in the business.
  { name: 'Nikita', number: '8007000606' },
  { name: 'Pakhi', number: '9559507878' },
  { name: 'Neeta', number: '9623614682' },
]

const occasions = ['Birthday', 'Theme party', 'Soft play rental', 'Corporate / school', 'Something else']
const cities = ['Pune', 'Dehradun', 'Lucknow', 'Outstation']

export function Contact() {
  const [name, setName] = useState('')
  const [occasion, setOccasion] = useState(occasions[0])
  const [date, setDate] = useState('')
  const [city, setCity] = useState('Pune')

  const message = `Hi Dreams & Themes! I'm ${name || '—'}. I'd like to plan a ${occasion.toLowerCase()} in ${city}${
    date ? ` on ${date}` : ''
  }. Could you share details?`
  const whatsapp = `https://wa.me/919559507878?text=${encodeURIComponent(message)}`

  return (
    <section className="contact section-pad" id="contact">
      <div className="contact-copy">
        <Reveal className="section-kicker">Let&apos;s make it memorable</Reveal>
        <h2>
          <SplitHeading>Have a dream</SplitHeading>
          <br />
          <SplitHeading delay={0.1}>in mind?</SplitHeading>
        </h2>
        <Reveal delay={0.1}>
          <p>
            Tell us a little about it. We&apos;ll take it from there — thoughtfully, creatively, and with a little
            bit of magic.
          </p>
          <p className="signoff">
            <span>with love,</span> Nikita, Pakhi &amp; Neeta
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
            <label htmlFor="enq-date">Date</label>
            <input id="enq-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
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
            <small>Opens WhatsApp with your details filled in. No forms, no waiting.</small>
          </RevealItem>
        </RevealGroup>

        <Reveal className="contact-cities" delay={0.1}>
          <>
            <MapPin size={17} />
            <span>
              Available in Pune, Dehradun &amp; Lucknow
              <br />
              <small>Outstation celebrations, too.</small>
            </span>
          </>
        </Reveal>
      </div>

      <Reveal className="contact-card" delay={0.15} y={40}>
        <>
          <p className="card-label">Speak to our team</p>
          {contacts.map((contact) => (
            <a className="contact-row" href={`tel:+91${contact.number}`} key={contact.name}>
              <span>
                <strong>{contact.name}</strong>
                <small>Celebration curator</small>
              </span>
              <span className="phone-number">
                +91 {contact.number.slice(0, 5)} {contact.number.slice(5)} <Phone size={15} />
              </span>
            </a>
          ))}
          <a href="mailto:dreamsandthemespune@gmail.com" className="button button-light">
            <span>Send an email</span>
            <ArrowUpRight size={17} />
          </a>
          <a
            className="social-line"
            href="https://www.instagram.com/dreamsandthemespune/"
            target="_blank"
            rel="noopener noreferrer"
           
          >
            <span>Follow along</span>
            <em>@dreamsandthemespune</em>
          </a>
        </>
      </Reveal>
    </section>
  )
}
