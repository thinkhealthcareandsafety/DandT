import fs from 'node:fs'
import path from 'node:path'
import { imageSize } from 'image-size'
import { GALLERY, type GalleryCategory } from '@/content/gallery'

export type GalleryItem = {
  src: string
  alt: string
  /** Short tile label; falls back to `alt` (e.g. for Instagram captions). */
  title?: string
  permalink?: string
  /** Local items only; Instagram media carries no category, which hides the filters. */
  category?: GalleryCategory
  /** A muted looping clip; `src` is then its poster frame. */
  video?: string
  /** Present for local files only. Lets next/image reserve space and avoid layout shift. */
  width?: number
  height?: number
}

function readLocalGallery(): GalleryItem[] {
  const dir = path.join(process.cwd(), 'public', 'gallery')
  return GALLERY.filter((entry) => {
    const exists = fs.existsSync(path.join(dir, entry.file))
    if (!exists) console.warn(`[gallery] Missing file public/gallery/${entry.file}; skipping it.`)
    return exists
  }).map((entry) => {
    const item: GalleryItem = {
      src: `/gallery/${entry.file}`,
      alt: entry.alt,
      title: entry.title,
      category: entry.category,
      video: entry.video && `/gallery/${entry.video}`,
    }
    try {
      const { width, height } = imageSize(fs.readFileSync(path.join(dir, entry.file)))
      if (width && height) {
        item.width = width
        item.height = height
      }
    } catch {
      // Unreadable header: fall back to an unsized <img> rather than dropping the image.
    }
    return item
  })
}

type InstagramMedia = {
  media_type: string
  media_url?: string
  thumbnail_url?: string
  permalink?: string
  caption?: string
}

function captionToAlt(caption?: string) {
  if (!caption) return 'A Dreams & Themes celebration'
  const firstLine = caption.split('\n')[0].replace(/#\w+/g, '').trim()
  return firstLine.length > 110 ? `${firstLine.slice(0, 107)}…` : firstLine || 'A Dreams & Themes celebration'
}

export async function getGalleryItems(): Promise<GalleryItem[]> {
  const token = process.env.INSTAGRAM_ACCESS_TOKEN
  if (!token) return readLocalGallery()

  try {
    const url = new URL('https://graph.instagram.com/me/media')
    url.searchParams.set('fields', 'media_type,media_url,thumbnail_url,permalink,caption')
    url.searchParams.set('limit', '18')
    url.searchParams.set('access_token', token)

    const res = await fetch(url, { next: { revalidate: 3600 } })
    if (!res.ok) return readLocalGallery()

    const payload = (await res.json()) as { data?: InstagramMedia[] }
    const items = (payload.data ?? [])
      .filter((media) => media.media_type !== 'VIDEO' || media.thumbnail_url)
      .map((media) => ({
        src: (media.media_url ?? media.thumbnail_url) as string,
        alt: captionToAlt(media.caption),
        permalink: media.permalink,
      }))
      .filter((item) => Boolean(item.src))

    return items.length ? items : readLocalGallery()
  } catch {
    return readLocalGallery()
  }
}
