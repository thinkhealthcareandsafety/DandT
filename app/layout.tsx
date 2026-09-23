import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { DM_Mono, DM_Sans, La_Belle_Aurore, Playfair_Display } from 'next/font/google'
import { siteUrl } from '@/lib/site'
import './globals.css'

const playfair = Playfair_Display({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  variable: '--font-serif',
  display: 'swap',
})

const dmSans = DM_Sans({ subsets: ['latin'], variable: '--font-sans', display: 'swap' })

const dmMono = DM_Mono({ subsets: ['latin'], weight: ['400', '500'], variable: '--font-mono', display: 'swap' })

// Ink-pen handwriting for the moodboard notes, captions and sign-offs — the human layer.
const hand = La_Belle_Aurore({ subsets: ['latin'], weight: '400', variable: '--font-hand', display: 'swap' })

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
    images: [{ url: '/og.jpg', width: 1200, height: 630, alt: 'A Dreams & Themes celebration set-up' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dreams & Themes | Make room for magic.',
    description: 'Beautifully considered celebrations across Pune, Dehradun and Lucknow.',
    images: ['/og.jpg'],
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

// The site is light-only; tint the mobile browser bar to match the cream page.
export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#f7f4ef',
  // Lets fixed UI (the WhatsApp button) sit clear of the iPhone home indicator via safe-area insets.
  viewportFit: 'cover',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${dmSans.variable} ${dmMono.variable} ${hand.variable}`}>
      <body className="antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'LocalBusiness',
              name: 'Dreams & Themes',
              url: siteUrl().href,
              image: new URL('/og.jpg', siteUrl()).href,
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
