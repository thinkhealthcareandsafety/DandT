import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import './globals.css'

const FALLBACK_SITE_URL = 'https://dreamsandthemes.in'

// Tolerates the env var being blank or entered without a protocol, either of which
// would otherwise throw at build time and fail the deployment.
function siteUrl() {
  const value = process.env.NEXT_PUBLIC_SITE_URL?.trim()
  if (!value) return new URL(FALLBACK_SITE_URL)
  try {
    return new URL(/^https?:\/\//i.test(value) ? value : `https://${value}`)
  } catch {
    return new URL(FALLBACK_SITE_URL)
  }
}

export const metadata: Metadata = {
  metadataBase: siteUrl(),
  title: 'Dreams & Themes | Birthday Decor & Soft Play in Pune',
  description:
    'Birthday decorations, theme parties, soft play rentals and return gifts — thoughtfully styled celebrations across Pune, Dehradun and Lucknow.',
  keywords: [
    'birthday decoration Pune',
    'soft play rental Pune',
    'theme party planner Pune',
    'birthday party organiser Dehradun',
    'kids party decor Lucknow',
  ],
  openGraph: {
    title: 'Dreams & Themes | Make room for magic.',
    description: 'Beautifully considered celebrations for the moments your family will remember forever.',
    type: 'website',
    locale: 'en_IN',
    siteName: 'Dreams & Themes',
    images: [{ url: '/dreams-hero.png', width: 1024, height: 1024, alt: 'A Dreams & Themes celebration set-up' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dreams & Themes | Make room for magic.',
    description: 'Beautifully considered celebrations across Pune, Dehradun and Lucknow.',
    images: ['/dreams-hero.png'],
  },
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'LocalBusiness',
              name: 'Dreams & Themes',
              description:
                'Birthday decorations, theme parties, soft play rentals and return gifts across Pune, Dehradun and Lucknow.',
              email: 'dreamsandthemespune@gmail.com',
              telephone: '+91-9559507878',
              areaServed: ['Pune', 'Dehradun', 'Lucknow'],
              address: { '@type': 'PostalAddress', addressLocality: 'Pune', addressCountry: 'IN' },
              sameAs: ['https://www.instagram.com/dreamsandthemespune/'],
            }),
          }}
        />
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
