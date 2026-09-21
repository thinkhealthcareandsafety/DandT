import { Contact } from '@/components/site/contact'
import { Faq } from '@/components/site/faq'
import { Footer } from '@/components/site/footer'
import { Gallery } from '@/components/site/gallery'
import { Grain } from '@/components/site/grain'
import { Hero } from '@/components/site/hero'
import { InstagramBand } from '@/components/site/instagram'
import { Marquee } from '@/components/site/marquee'
import { Nav } from '@/components/site/nav'
import { Packages } from '@/components/site/packages'
import { Preloader } from '@/components/site/preloader'
import { Process } from '@/components/site/process'
import { Reviews } from '@/components/site/reviews'
import { ScrollProgress } from '@/components/site/scroll-progress'
import { Services } from '@/components/site/services'
import { Showcase } from '@/components/site/showcase'
import { Themes } from '@/components/site/themes'
import { WhatsAppFab } from '@/components/site/whatsapp-fab'
import { getGalleryItems } from '@/lib/gallery'
import { getReviews } from '@/lib/reviews'

const ticker = [
  'Birthday Decorations',
  'Soft Play Rentals',
  'Theme Parties',
  'Bubble Shows',
  'Return Gifts',
  'DIY Activities',
  'Canvas Painting',
  'Outstation Celebrations',
]

export default async function Page() {
  const [galleryItems, reviewData] = await Promise.all([getGalleryItems(), getReviews()])

  return (
    <>
      <Preloader />
      <Grain />
      <ScrollProgress />

      <Nav />

      <main className="site-shell">
        <Hero />
        <Marquee items={ticker} />
        <Process />
        <Themes />
        <Services />
        <Gallery items={galleryItems} />
        <Showcase />
        <Reviews data={reviewData} />
        <Packages />
        <Faq />
        <InstagramBand />
        <Contact />
      </main>

      <Footer />
      <WhatsAppFab />
    </>
  )
}
