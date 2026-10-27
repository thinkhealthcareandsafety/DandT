import { GoogleAnalytics } from '@next/third-parties/google'
import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { DM_Mono, DM_Sans, La_Belle_Aurore, Playfair_Display } from 'next/font/google'
import { LeadTracking } from '@/components/site/lead-tracking'
import { getSiteContent } from '@/lib/content'
import { jsonLd } from '@/lib/json-ld'
import { siteUrl } from '@/lib/site'
import './globals.css'

const isProduction = process.env.NODE_ENV === 'production'
const gaId = process.env.NEXT_PUBLIC_GA_ID?.trim()

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

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getSiteContent()
  const image = seo.image?.src
    ? { url: seo.image.src, width: seo.image.width, height: seo.image.height, alt: seo.title }
    : { url: '/og.jpg', width: 1200, height: 630, alt: 'A Dreams & Themes celebration set-up' }

  return {
    metadataBase: siteUrl(),
    title: seo.title,
    description: seo.description,
    keywords: [
      'birthday decoration Pune',
      'soft play rental Pune',
      'theme party planner Pune',
      'table decoration Pune',
      'birthday party organiser Dehradun',
      'kids party decor Lucknow',
    ],
    alternates: { canonical: '/' },
    verification: {
      google: process.env.GOOGLE_SITE_VERIFICATION?.trim() || undefined,
      other: process.env.BING_SITE_VERIFICATION?.trim()
        ? { 'msvalidate.01': process.env.BING_SITE_VERIFICATION.trim() }
        : undefined,
    },
    openGraph: {
      url: '/',
      title: seo.title,
      description: seo.description,
      type: 'website',
      locale: 'en_IN',
      siteName: 'Dreams & Themes',
      images: [image],
    },
    twitter: { card: 'summary_large_image', title: seo.title, description: seo.description, images: [image.url] },
  }
}

// The site is light-only; tint the mobile browser bar to match the cream page.
export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#f7f4ef',
  // Lets fixed UI (the WhatsApp button) sit clear of the iPhone home indicator via safe-area insets.
  viewportFit: 'cover',
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const { business, seo } = await getSiteContent()

  return (
    <html lang="en" className={`${playfair.variable} ${dmSans.variable} ${dmMono.variable} ${hand.variable}`}>
      <body className="antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: jsonLd({
              '@context': 'https://schema.org',
              '@type': 'LocalBusiness',
              name: business.name,
              url: siteUrl().href,
              image: new URL(seo.image?.src || '/og.jpg', siteUrl()).href,
              description: seo.description,
              email: business.email,
              telephone: `+91-${business.whatsapp}`,
              areaServed: business.cities,
              address: { '@type': 'PostalAddress', addressLocality: business.cities[0], addressCountry: 'IN' },
              sameAs: [`https://www.instagram.com/${business.instagram.replace(/^@/, '')}/`],
            }),
          }}
        />
        {children}
        {isProduction && <Analytics />}
        {isProduction && gaId && <LeadTracking />}
      </body>
      {isProduction && gaId && <GoogleAnalytics gaId={gaId} />}
    </html>
  )
}
