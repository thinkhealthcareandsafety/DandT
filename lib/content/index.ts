import 'server-only'
import { unstable_cache } from 'next/cache'
import { DEFAULT_CONTENT } from '@/content/defaults'
import { listVersions, readVersion, type Version } from './store'
import type { ContentKey, SiteContent, StoredContent } from './types'

export const CONTENT_TAG = 'site-content'

const EMPTY: StoredContent = { content: {}, edits: {}, library: [] }

/** The newest saved version, read fresh — for the admin, which must never edit stale content. */
export async function loadStored(): Promise<{ doc: StoredContent; version: Version | null }> {
  const [latest] = await listVersions()
  if (!latest) return { doc: EMPTY, version: null }
  const doc = await readVersion(latest)
  return { doc: { ...EMPTY, ...doc }, version: latest }
}

/**
 * Saved content over the defaults, one part at a time. Objects merge shallowly, so a field added
 * to the defaults in a later release still appears for owners who saved that part before it existed.
 */
export function resolve(stored: Partial<SiteContent>): SiteContent {
  const out = { ...DEFAULT_CONTENT } as Record<ContentKey, unknown>
  for (const key of Object.keys(DEFAULT_CONTENT) as ContentKey[]) {
    const saved = stored[key]
    if (saved === undefined || saved === null) continue
    const base = DEFAULT_CONTENT[key]
    out[key] = Array.isArray(base) ? saved : { ...(base as object), ...(saved as object) }
  }
  return out as SiteContent
}

/**
 * What the public site renders. Cached until the admin saves (which expires the tag), so visitors
 * get a static page and storage is only read once per change.
 */
/**
 * A fingerprint of the shipped defaults. The cache outlives deployments, so without this a release
 * that changes the defaults would keep serving the previous release's content until someone saved.
 */
const DEFAULTS_VERSION = (() => {
  const text = JSON.stringify(DEFAULT_CONTENT)
  let hash = 2166136261
  for (let i = 0; i < text.length; i++) hash = Math.imul(hash ^ text.charCodeAt(i), 16777619)
  return (hash >>> 0).toString(36)
})()

const cachedContent = unstable_cache(
  async () => resolve((await loadStored()).doc.content),
  ['site-content', DEFAULTS_VERSION],
  { tags: [CONTENT_TAG] },
)

export async function getSiteContent(): Promise<SiteContent> {
  try {
    return await cachedContent()
  } catch (error) {
    // Storage being briefly unreachable must never take the site down. The fallback is outside the
    // cache on purpose: a failed read is retried on the next render instead of being remembered.
    console.error('[content] Could not load saved content; showing defaults.', error)
    return DEFAULT_CONTENT
  }
}
