import fs from 'node:fs/promises'
import path from 'node:path'
import { LOCAL_UPLOADS } from '@/lib/content/store'

const TYPES: Record<string, string> = {
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
  avif: 'image/avif',
  mp4: 'video/mp4',
  webm: 'video/webm',
  mov: 'video/quicktime',
}

/** Serves files uploaded in development (production uploads are served by Vercel Blob). */
export async function GET(request: Request, { params }: { params: Promise<{ path: string[] }> }) {
  const name = path.basename((await params).path.join('/'))
  const type = TYPES[name.split('.').pop()?.toLowerCase() ?? '']
  if (!type) return new Response('Not found', { status: 404 })

  const data = await fs.readFile(path.join(LOCAL_UPLOADS, name)).catch(() => null)
  if (!data) return new Response('Not found', { status: 404 })

  const headers = { 'content-type': type, 'cache-control': 'public, max-age=31536000, immutable', 'accept-ranges': 'bytes' }
  // Safari won't play a video unless byte ranges are honoured.
  const range = request.headers.get('range')?.match(/bytes=(\d*)-(\d*)/)
  if (range) {
    const start = range[1] ? Number(range[1]) : 0
    const end = range[2] ? Math.min(Number(range[2]), data.length - 1) : data.length - 1
    return new Response(data.subarray(start, end + 1), {
      status: 206,
      headers: { ...headers, 'content-range': `bytes ${start}-${end}/${data.length}`, 'content-length': String(end - start + 1) },
    })
  }
  return new Response(data, { headers: { ...headers, 'content-length': String(data.length) } })
}
