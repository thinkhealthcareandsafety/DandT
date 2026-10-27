import 'server-only'
import fs from 'node:fs/promises'
import path from 'node:path'
import { del, list, put } from '@vercel/blob'
import type { StoredContent } from './types'

/**
 * Where the admin's edits live. Every save writes a new, never-overwritten version of the whole
 * content document, so the newest version is the live site and the older ones are its history.
 *
 * - `blob`: Vercel Blob (production). Needs BLOB_READ_WRITE_TOKEN, which Vercel sets when a Blob
 *   store is connected to the project.
 * - `local`: files under .data/ (development, or any server with a writable disk).
 * - `readonly`: deployed on Vercel without a Blob store — the site shows content/defaults.ts and the
 *   admin explains how to connect storage.
 */
export type StoreMode = 'blob' | 'local' | 'readonly'

export function storeMode(): StoreMode {
  if (process.env.BLOB_READ_WRITE_TOKEN) return 'blob'
  if (process.env.VERCEL) return 'readonly'
  return 'local'
}

export type Version = {
  /** Blob pathname or local file name; unique and sortable by time. */
  id: string
  at: string
  /** Which part of the site this save changed. */
  part: string
  by: string
  url?: string
}

const BLOB_PREFIX = 'site/content/'
export const LOCAL_ROOT = path.join(process.cwd(), '.data')
const LOCAL_CONTENT = path.join(LOCAL_ROOT, 'content')
export const LOCAL_UPLOADS = path.join(LOCAL_ROOT, 'uploads')

/** Oldest versions beyond this are deleted on save. */
const KEEP_VERSIONS = 80

// `<13-digit ms>~<part>~<who>` — the timestamp leads, so names sort oldest to newest.
const NAME = /(\d{13})~([a-z-]+)~([a-z0-9-]*)/

function parse(id: string, url?: string): Version | null {
  const match = NAME.exec(id)
  if (!match) return null
  return { id, at: new Date(Number(match[1])).toISOString(), part: match[2], by: match[3], url }
}

const slug = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 24)

/** Newest first. */
export async function listVersions(): Promise<Version[]> {
  const mode = storeMode()
  if (mode === 'readonly') return []

  let versions: Version[] = []
  if (mode === 'blob') {
    let cursor: string | undefined
    do {
      const page = await list({ prefix: BLOB_PREFIX, cursor, limit: 1000 })
      for (const blob of page.blobs) {
        const version = parse(blob.pathname, blob.url)
        if (version) versions.push(version)
      }
      cursor = page.hasMore ? page.cursor : undefined
    } while (cursor)
  } else {
    const names = await fs.readdir(LOCAL_CONTENT).catch(() => [] as string[])
    versions = names.map((name) => parse(name)).filter((v): v is Version => v !== null)
  }
  return versions.sort((a, b) => (a.id < b.id ? 1 : -1))
}

export async function readVersion(version: Version): Promise<StoredContent> {
  if (version.url) {
    // Every version has its own unique URL and is never overwritten, so the CDN copy is always right.
    const res = await fetch(version.url, { cache: 'force-cache' })
    if (!res.ok) throw new Error(`Could not read content version ${version.id} (${res.status})`)
    return (await res.json()) as StoredContent
  }
  return JSON.parse(await fs.readFile(path.join(LOCAL_CONTENT, version.id), 'utf8')) as StoredContent
}

export async function writeVersion(doc: StoredContent, part: string, by: string): Promise<Version> {
  const mode = storeMode()
  if (mode === 'readonly') throw new StorageNotConnected()

  const name = `${Date.now()}~${slug(part) || 'content'}~${slug(by)}`
  const body = JSON.stringify(doc)
  let version: Version

  if (mode === 'blob') {
    const blob = await put(`${BLOB_PREFIX}${name}.json`, body, {
      access: 'public',
      // The random suffix keeps old versions unguessable; the name still sorts by time.
      addRandomSuffix: true,
      contentType: 'application/json',
      cacheControlMaxAge: 60 * 60 * 24 * 365,
    })
    version = parse(blob.pathname, blob.url)!
  } else {
    await fs.mkdir(LOCAL_CONTENT, { recursive: true })
    await fs.writeFile(path.join(LOCAL_CONTENT, `${name}.json`), body)
    version = parse(`${name}.json`)!
  }

  await prune().catch((error) => console.warn('[content] Could not prune old versions:', error))
  return version
}

async function prune() {
  const stale = (await listVersions()).slice(KEEP_VERSIONS)
  if (!stale.length) return
  if (storeMode() === 'blob') await del(stale.map((v) => v.url!))
  else await Promise.all(stale.map((v) => fs.rm(path.join(LOCAL_CONTENT, v.id), { force: true })))
}

/** Saves an uploaded file to the local disk (development); production uploads go straight to Blob. */
export async function putLocalFile(name: string, data: ArrayBuffer): Promise<{ url: string; key: string }> {
  if (storeMode() !== 'local') throw new StorageNotConnected()
  await fs.mkdir(LOCAL_UPLOADS, { recursive: true })
  await fs.writeFile(path.join(LOCAL_UPLOADS, name), Buffer.from(data))
  return { url: `/media/${name}`, key: `local:${name}` }
}

export async function deleteFiles(keys: string[]) {
  const blobUrls = keys.filter((key) => key.startsWith('https://'))
  const localNames = keys.filter((key) => key.startsWith('local:')).map((key) => key.slice('local:'.length))
  if (blobUrls.length && storeMode() === 'blob') await del(blobUrls)
  await Promise.all(
    localNames.map((name) => fs.rm(path.join(LOCAL_UPLOADS, path.basename(name)), { force: true })),
  )
}

export class StorageNotConnected extends Error {
  constructor() {
    super(
      'Storage is not connected, so changes cannot be saved. In Vercel, open the project → Storage → ' +
        'Create → Blob (public), connect it to this project, then redeploy.',
    )
  }
}
