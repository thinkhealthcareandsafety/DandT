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
import { getSiteContent } from '@/lib/content'
import { instagramUrl } from '@/lib/whatsapp'
import { getReviews } from '@/lib/reviews'

// Static, and rebuilt the moment an owner saves in /admin. The hourly refresh is only a safety net
// in case storage was unreachable during a rebuild.
export const revalidate = 3600

export default async function Page() {
  const content = await getSiteContent()
  const reviewData = await getReviews(content.reviews.items)
  const { sections: show, business } = content

  return (
    <>
      <Preloader />
      <Grain />
      <ScrollProgress />

      <Nav business={business} sections={show} />

      <main className="site-shell">
        <Hero hero={content.hero} />
        {show.ticker && <Marquee items={content.ticker} />}
        {show.process && <Process data={content.process} />}
        {show.themes && <Themes data={content.themes} />}
        {show.services && <Services data={content.services} whatsapp={business.whatsapp} />}
        {show.gallery && <Gallery data={content.gallery} instagram={instagramUrl(business.instagram)} />}
        {show.showcase && <Showcase data={content.showcase} />}
        {show.reviews && <Reviews data={reviewData} copy={content.reviews} />}
        {show.packages && <Packages data={content.packages} />}
        {show.faq && <Faq data={content.faq} />}
        {show.instagram && <InstagramBand handle={business.instagram} />}
        <Contact data={content.contact} business={business} />
      </main>

      <Footer business={business} />
      <WhatsAppFab number={business.whatsapp} />
    </>
  )
}
