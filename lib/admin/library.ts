import 'server-only'
import staticMedia from '@/content/static-media.json'
import type { Asset, StoredContent } from '@/lib/content/types'

/** "/gallery/08-happy-birthday-backdrop.jpg" → "Happy birthday backdrop" */
function nameFromPath(src: string) {
  const base = src.split('/').pop()!.replace(/\.[^.]+$/, '').replace(/^\d+-/, '').replace(/-/g, ' ')
  const name = base.charAt(0).toUpperCase() + base.slice(1)
  return src.includes('/video/') ? `${name} (film)` : name
}

/** The owners' uploads (newest first), then every photo that shipped with the site. */
export function buildLibrary(doc: StoredContent): Asset[] {
  const shipped: Asset[] = staticMedia.map((entry) => ({ ...(entry as Asset), name: nameFromPath(entry.src) }))
  return [...doc.library, ...shipped]
}
