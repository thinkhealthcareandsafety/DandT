import type { SiteContent } from '@/lib/content/types'
import { displayPhone, instagramUrl, telLink } from '@/lib/whatsapp'
import { Sparkle } from './decor'

const columns = [
  {
    title: 'Services',
    links: [
      { label: 'Birthday decorations', href: '#services' },
      { label: 'Theme parties', href: '#themes' },
      { label: 'Soft play rentals', href: '#services' },
      { label: 'Return gifts & DIY', href: '#services' },
    ],
  },
  {
    title: 'Explore',
    links: [
      { label: 'Gallery', href: '#gallery' },
      { label: 'Reviews', href: '#reviews' },
      { label: 'Packages', href: '#packages' },
      { label: 'How it works', href: '#process' },
      { label: 'Questions', href: '#faq' },
    ],
  },
]

export function Footer({ business }: { business: SiteContent['business'] }) {
  const [lead, ...rest] = business.footerLine.split(/,\s*/)
  const cities = {
    title: 'Cities',
    links: [...business.cities, 'Outstation'].map((city) => ({ label: city, href: '#contact' })),
  }

  return (
    <footer className="site-footer">
      <div className="footer-top">
        <div className="footer-lead">
          <span className="brand-mark">
            D<span>&amp;</span>T
          </span>
          <p>
            {rest.length ? `${lead}, ` : lead}
            {rest.length > 0 && <em>{rest.join(', ')}</em>}
          </p>
          <a className="footer-cta" href="#contact">
            Plan your celebration <Sparkle className="footer-spark" />
          </a>
        </div>

        <div className="footer-cols">
          {[...columns, cities].map((column) => (
            <div key={column.title}>
              <h3>{column.title}</h3>
              <ul>
                {column.links.map((link) => (
                  <li key={link.label}>
                    <a href={link.href}>{link.label}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div>
            <h3>Reach us</h3>
            <ul>
              <li>
                <a href={telLink(business.whatsapp)}>{displayPhone(business.whatsapp)}</a>
              </li>
              <li>
                <a href={`mailto:${business.email}`}>Email us</a>
              </li>
              <li>
                <a href={instagramUrl(business.instagram)} target="_blank" rel="noopener noreferrer">
                  Instagram
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="footer-base">
        <span>
          © {new Date().getFullYear()} {business.name} · {business.cities[0]}
        </span>
        <span>Birthday decor · Soft play · Theme parties</span>
        <span className="footer-credit">
          Made by <a href="mailto:sagarkadam8081@gmail.com">sagarkadam8081@gmail.com</a>
        </span>
      </div>
    </footer>
  )
}
