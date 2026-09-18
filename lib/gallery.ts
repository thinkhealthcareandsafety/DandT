import fs from 'node:fs'
import path from 'node:path'

export type GalleryItem = {
  src: string
  alt: string
  permalink?: string
}

const IMAGE_EXT = /\.(jpe?g|png|webp|avif)$/i

function labelFromFilename(file: string) {
  const base = file.replace(IMAGE_EXT, '').replace(/^\d+[-_]/, '').replace(/[-_]+/g, ' ').trim()
  return base ? base.charAt(0).toUpperCase() + base.slice(1) : 'Dreams & Themes celebration'
}

function readLocalGallery(): GalleryItem[] {
  const dir = path.join(process.cwd(), 'public', 'gallery')
  if (!fs.existsSync(dir)) return []
  return fs
    .readdirSync(dir)
    .filter((file) => IMAGE_EXT.test(file))
    .sort()
    .map((file) => ({ src: `/gallery/${file}`, alt: labelFromFilename(file) }))
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
