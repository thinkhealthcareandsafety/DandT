import { ArrowUpRight, Images, MessageSquareQuote, Phone, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { timeAgo } from '@/components/admin/time'
import { requireAdminPage } from '@/lib/admin/auth'
import { PARTS, partFor } from '@/lib/admin/schema'
import { loadStored, resolve } from '@/lib/content'
import { listVersions } from '@/lib/content/store'
import type { SectionId } from '@/lib/content/types'

function greeting() {
  const hour = Number(new Date().toLocaleString('en-IN', { hour: 'numeric', hour12: false, timeZone: 'Asia/Kolkata' }))
  return hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'
}

function partName(part: string) {
  const [verb, key] = part.startsWith('reset-') ? ['Reset', part.slice(6)] : part.startsWith('restore-') ? ['Restored', part.slice(8)] : ['Updated', part]
  if (key === 'library') return 'Updated the media library'
  if (key === 'all') return `${verb} the whole site`
  return `${verb} ${partFor(key)?.label ?? key}`
}

export default async function Overview() {
  await requireAdminPage()
  const [{ doc }, versions] = await Promise.all([loadStored(), listVersions().catch(() => [])])
  const content = resolve(doc.content)

  const films = content.gallery.items.filter((i) => i.media.video).length
  const stats = [
    { label: 'Gallery photos', value: content.gallery.items.length - films, href: '/admin/edit/gallery' },
    { label: 'Films', value: films, href: '/admin/edit/gallery' },
    { label: 'Themes', value: content.themes.items.length, href: '/admin/edit/themes' },
    { label: 'Services', value: content.services.items.length, href: '/admin/edit/services' },
    { label: 'Reviews', value: content.reviews.items.length, href: '/admin/edit/reviews' },
    { label: 'Your uploads', value: doc.library.length, href: '/admin/media' },
  ]

  const quick = [
    { href: '/admin/edit/gallery', icon: <Images size={18} />, title: 'Add photos to the gallery', copy: 'Drop in a batch from your last party.' },
    { href: '/admin/edit/services', icon: <Sparkles size={18} />, title: 'Services & their photos', copy: 'What opens when a family taps a service.' },
    { href: '/admin/edit/reviews', icon: <MessageSquareQuote size={18} />, title: 'Add a review', copy: 'Paste what a family sent you.' },
    { href: '/admin/edit/business', icon: <Phone size={18} />, title: 'Phone numbers & cities', copy: 'Who enquiries reach, and where you work.' },
  ]

  return (
    <div className="ad-page">
      <header className="ad-page-head">
        <p className="ad-kicker">{greeting()}</p>
        <h1>
          Welcome to your <em>studio.</em>
        </h1>
        <p>Everything on the site is yours to change. Pick something below — it goes live the moment you save.</p>
      </header>

      <section className="ad-quick">
        {quick.map((q) => (
          <Link href={q.href} key={q.href} className="ad-quick-card">
            <span className="ad-quick-icon">{q.icon}</span>
            <strong>{q.title}</strong>
            <small>{q.copy}</small>
            <ArrowUpRight size={16} className="ad-quick-arrow" />
          </Link>
        ))}
      </section>

      <section className="ad-stats" aria-label="On the site now">
        {stats.map((s) => (
          <Link href={s.href} key={s.label} className="ad-stat">
            <strong>{s.value}</strong>
            <span>{s.label}</span>
          </Link>
        ))}
      </section>

      <div className="ad-columns">
        <section>
          <h2 className="ad-h2">Every part of the site</h2>
          <div className="ad-parts">
            {PARTS.map((part) => {
              const edit = doc.edits[part.key]
              const hidden = part.key in content.sections && !content.sections[part.key as SectionId]
              return (
                <Link href={`/admin/edit/${part.key}`} key={part.key} className="ad-part">
                  <span className="ad-part-top">
                    <strong>{part.label}</strong>
                    {hidden && <span className="ad-pill">Hidden</span>}
                  </span>
                  <small>{part.blurb}</small>
                  <span className="ad-part-meta">{edit ? `Edited ${timeAgo(edit.at)}` : 'Original'}</span>
                </Link>
              )
            })}
          </div>
        </section>

        <aside>
          <h2 className="ad-h2">Recent changes</h2>
          {versions.length ? (
            <ol className="ad-activity">
              {versions.slice(0, 8).map((v) => (
                <li key={v.id}>
                  <span>
                    {partName(v.part)}
                    <small>{timeAgo(v.at)}</small>
                  </span>
                </li>
              ))}
            </ol>
          ) : (
            <p className="ad-empty">No changes yet. Everything is as it launched.</p>
          )}
          <Link href="/admin/history" className="ad-text-link">
            See all &amp; undo <ArrowUpRight size={14} />
          </Link>
        </aside>
      </div>
    </div>
  )
}
