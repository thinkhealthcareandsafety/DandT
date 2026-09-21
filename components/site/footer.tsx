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
  {
    title: 'Cities',
    links: [
      { label: 'Pune', href: '#contact' },
      { label: 'Dehradun', href: '#contact' },
      { label: 'Lucknow', href: '#contact' },
      { label: 'Outstation', href: '#contact' },
    ],
  },
]

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-top">
        <div className="footer-lead">
          <span className="brand-mark">
            D<span>&amp;</span>T
          </span>
          <p>
            Curating joy, <em>one celebration at a time.</em>
          </p>
          <a className="footer-cta" href="#contact">
            Plan your celebration <Sparkle className="footer-spark" />
          </a>
        </div>

        <div className="footer-cols">
          {columns.map((column) => (
            <div key={column.title}>
              <h4>{column.title}</h4>
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
            <h4>Reach us</h4>
            <ul>
              <li>
                <a href="tel:+919559507878">+91 95595 07878</a>
              </li>
              <li>
                <a href="mailto:dreamsandthemespune@gmail.com">Email us</a>
              </li>
              <li>
                <a href="https://www.instagram.com/dreamsandthemespune/" target="_blank" rel="noopener noreferrer">
                  Instagram
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="footer-base">
        <span>© {new Date().getFullYear()} Dreams &amp; Themes · Pune</span>
        <span>Birthday decor · Soft play · Theme parties</span>
      </div>
    </footer>
  )
}
