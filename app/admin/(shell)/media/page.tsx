import type { Metadata } from 'next'
import { MediaLibrary } from '@/components/admin/media-library'
import { buildLibrary } from '@/lib/admin/library'
import { findUsages } from '@/lib/admin/usage'
import { loadStored, resolve } from '@/lib/content'

export const metadata: Metadata = { title: 'Media library' }

export default async function MediaPage() {
  const { doc } = await loadStored()
  const content = resolve(doc.content)
  const usage = Object.fromEntries(buildLibrary(doc).map((asset) => [asset.src, findUsages(content, asset.src)]))
  return <MediaLibrary usage={usage} />
}
