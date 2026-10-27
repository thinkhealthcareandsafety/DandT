'use server'

import { revalidatePath, updateTag } from 'next/cache'
import { cookies, headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { DEFAULT_CONTENT } from '@/content/defaults'
import { requireAdmin } from '@/lib/admin/auth'
import { findUsages } from '@/lib/admin/usage'
import { passwordMatches, SESSION_COOKIE, SESSION_DAYS, signSession } from '@/lib/admin/session'
import { CONTENT_TAG, loadStored, resolve } from '@/lib/content'
import { deleteFiles, listVersions, readVersion, StorageNotConnected, writeVersion } from '@/lib/content/store'
import type { Asset, ContentKey, StoredContent } from '@/lib/content/types'

export type ActionResult = { ok: true; at?: string } | { ok: false; error: string; conflict?: boolean }

const CONTENT_KEYS = Object.keys(DEFAULT_CONTENT) as ContentKey[]

/* ---------------------------------- sign in --------------------------------- */

// Per-instance only, but it still turns a password-guessing script into a slow crawl.
const attempts = new Map<string, { count: number; until: number }>()
const MAX_ATTEMPTS = 6
const LOCKOUT_MS = 10 * 60 * 1000

export async function login(_: string | null, form: FormData): Promise<string | null> {
  const ip = (await headers()).get('x-forwarded-for')?.split(',')[0]?.trim() || 'local'
  const entry = attempts.get(ip)
  if (entry && entry.count >= MAX_ATTEMPTS && entry.until > Date.now()) {
    return 'Too many attempts. Please wait ten minutes and try again.'
  }

  const password = String(form.get('password') ?? '')

  if (!(await passwordMatches(password))) {
    const count = (entry && entry.until > Date.now() ? entry.count : 0) + 1
    attempts.set(ip, { count, until: Date.now() + LOCKOUT_MS })
    await new Promise((r) => setTimeout(r, 600))
    return 'That password isn’t right.'
  }

  attempts.delete(ip)
  const { value, expires } = await signSession('admin')
  ;(await cookies()).set(SESSION_COOKIE, value, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    expires,
    maxAge: SESSION_DAYS * 24 * 60 * 60,
  })

  const next = String(form.get('next') ?? '')
  redirect(next.startsWith('/admin') && !next.startsWith('//') ? next : '/admin')
}

export async function logout() {
  ;(await cookies()).delete(SESSION_COOKIE)
  redirect('/admin/login')
}

/* ---------------------------------- content --------------------------------- */

const BLOB_HOST = /^https:\/\/[a-z0-9-]+\.public\.blob\.vercel-storage\.com\//i

/** Every photo/film URL must be one the site can actually serve — a bad one would break the page. */
function checkMedia(value: unknown, path = ''): string | null {
  if (Array.isArray(value)) {
    for (let i = 0; i < value.length; i++) {
      const problem = checkMedia(value[i], `${path}[${i}]`)
      if (problem) return problem
    }
    return null
  }
  if (value && typeof value === 'object') {
    const record = value as Record<string, unknown>
    if (typeof record.src === 'string' && 'width' in record) {
      for (const url of [record.src, record.video].filter((u): u is string => typeof u === 'string')) {
        if (!(url.startsWith('/') && !url.startsWith('//')) && !BLOB_HOST.test(url)) {
          return `A photo has an address the site can’t use (${url.slice(0, 60)}). Pick it from the media library instead.`
        }
      }
    }
    for (const [key, child] of Object.entries(record)) {
      const problem = checkMedia(child, `${path}.${key}`)
      if (problem) return problem
    }
  }
  return null
}

function refreshSite() {
  updateTag(CONTENT_TAG)
  revalidatePath('/', 'layout')
}

async function commit(doc: StoredContent, part: string, by: string): Promise<ActionResult> {
  try {
    await writeVersion(doc, part, by)
  } catch (error) {
    console.error('[admin] Save failed:', error)
    return {
      ok: false,
      error: error instanceof StorageNotConnected ? error.message : 'Saving failed — check your connection and try again.',
    }
  }
  refreshSite()
  return { ok: true }
}

/**
 * Saves one part of the site. `baseAt` is when that part was last saved as the editor loaded it;
 * if someone else saved it since, this refuses rather than silently overwriting their work.
 */
export async function savePart(key: ContentKey, value: unknown, baseAt: string | null): Promise<ActionResult> {
  const admin = await requireAdmin()
  if (!CONTENT_KEYS.includes(key)) return { ok: false, error: 'Unknown section.' }
  if (value === null || typeof value !== 'object') return { ok: false, error: 'Nothing to save.' }

  const problem = checkMedia(value)
  if (problem) return { ok: false, error: problem }

  const { doc } = await loadStored()
  const last = doc.edits[key]
  if ((last?.at ?? null) !== baseAt) {
    return {
      ok: false,
      conflict: true,
      error: 'This section was saved from another tab or device while you were editing. Reload to see the latest, then make your change again.',
    }
  }

  const at = new Date().toISOString()
  const result = await commit(
    {
      ...doc,
      content: { ...doc.content, [key]: value },
      edits: { ...doc.edits, [key]: { at, by: admin.name } },
    },
    key,
    admin.name,
  )
  return result.ok ? { ok: true, at } : result
}

/** Puts one part back to how it shipped with the site. */
export async function resetPart(key: ContentKey): Promise<ActionResult> {
  const admin = await requireAdmin()
  if (!CONTENT_KEYS.includes(key)) return { ok: false, error: 'Unknown section.' }
  const { doc } = await loadStored()
  const content = { ...doc.content }
  delete content[key]
  const at = new Date().toISOString()
  const result = await commit(
    { ...doc, content, edits: { ...doc.edits, [key]: { at, by: admin.name } } },
    `reset-${key}`,
    admin.name,
  )
  return result.ok ? { ok: true, at } : result
}

/** Brings back one part (or everything) as it was in an earlier version. */
export async function restoreVersion(versionId: string, key: ContentKey | 'all'): Promise<ActionResult> {
  const admin = await requireAdmin()
  const version = (await listVersions()).find((v) => v.id === versionId)
  if (!version) return { ok: false, error: 'That version no longer exists.' }

  const [{ doc }, old] = await Promise.all([loadStored(), readVersion(version)])
  const at = new Date().toISOString()
  let next: StoredContent

  if (key === 'all') {
    const edits = Object.fromEntries(CONTENT_KEYS.map((k) => [k, { at, by: admin.name }]))
    // The media library is kept as it is now: files uploaded since must stay findable.
    next = { content: old.content ?? {}, edits, library: doc.library }
  } else {
    if (!CONTENT_KEYS.includes(key)) return { ok: false, error: 'Unknown section.' }
    const content = { ...doc.content }
    if (old.content?.[key] === undefined) delete content[key]
    else (content as Record<string, unknown>)[key] = old.content[key]
    next = { ...doc, content, edits: { ...doc.edits, [key]: { at, by: admin.name } } }
  }

  return commit(next, `restore-${key}`, admin.name)
}

/* ----------------------------------- media ---------------------------------- */

export async function addAssets(assets: Asset[]): Promise<ActionResult> {
  const admin = await requireAdmin()
  const problem = checkMedia(assets)
  if (problem) return { ok: false, error: problem }
  const { doc } = await loadStored()
  const known = new Set(doc.library.map((a) => a.id))
  const fresh = assets.filter((a) => !known.has(a.id)).map((a) => ({ ...a, uploadedAt: new Date().toISOString() }))
  return commit({ ...doc, library: [...fresh, ...doc.library] }, 'library', admin.name)
}

export async function renameAsset(id: string, name: string): Promise<ActionResult> {
  const admin = await requireAdmin()
  const { doc } = await loadStored()
  const library = doc.library.map((a) => (a.id === id ? { ...a, name: name.trim().slice(0, 80) || a.name } : a))
  return commit({ ...doc, library }, 'library', admin.name)
}

/** Deletes an upload. Refuses while the site still shows it, and says where. */
export async function deleteAsset(id: string): Promise<ActionResult> {
  const admin = await requireAdmin()
  const { doc } = await loadStored()
  const asset = doc.library.find((a) => a.id === id)
  if (!asset) return { ok: false, error: 'That file is already gone.' }

  const usages = findUsages(resolve(doc.content), asset.src)
  if (usages.length) {
    return { ok: false, error: `Still on the site in: ${usages.join(', ')}. Swap it out there first.` }
  }

  const result = await commit({ ...doc, library: doc.library.filter((a) => a.id !== id) }, 'library', admin.name)
  if (result.ok && asset.keys?.length) {
    await deleteFiles(asset.keys).catch((error) => console.warn('[admin] Could not delete files:', error))
  }
  return result
}
