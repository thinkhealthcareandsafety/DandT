import { type HandleUploadBody, handleUpload } from '@vercel/blob/client'
import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin/auth'
import { putLocalFile, storeMode } from '@/lib/content/store'

const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif']
const VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/quicktime']
const MAX_BYTES = 250 * 1024 * 1024

/**
 * Production: issues a short-lived token so the browser uploads straight to Vercel Blob (no size
 * limit from the server in between). Development: receives the file and writes it to .data/uploads.
 */
export async function POST(request: Request) {
  if (request.headers.get('content-type')?.startsWith('multipart/form-data')) {
    try {
      await requireAdmin()
      const form = await request.formData()
      const file = form.get('file')
      if (!(file instanceof File)) return NextResponse.json({ error: 'No file received.' }, { status: 400 })
      if (![...IMAGE_TYPES, ...VIDEO_TYPES].includes(file.type)) {
        return NextResponse.json({ error: `${file.type || 'This file type'} can’t be used on the site.` }, { status: 415 })
      }
      const ext = file.name.split('.').pop()?.toLowerCase().replace(/[^a-z0-9]/g, '') || 'bin'
      const name = `${Date.now().toString(36)}-${crypto.randomUUID().slice(0, 8)}.${ext}`
      return NextResponse.json(await putLocalFile(name, await file.arrayBuffer()))
    } catch (error) {
      return NextResponse.json({ error: (error as Error).message }, { status: 400 })
    }
  }

  if (storeMode() !== 'blob') {
    return NextResponse.json({ error: 'Storage is not connected, so files can’t be uploaded yet.' }, { status: 503 })
  }

  try {
    const body = (await request.json()) as HandleUploadBody
    const result = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname) => {
        await requireAdmin()
        if (!pathname.startsWith('media/')) throw new Error('Uploads go in the media folder.')
        return {
          allowedContentTypes: [...IMAGE_TYPES, ...VIDEO_TYPES],
          maximumSizeInBytes: MAX_BYTES,
          addRandomSuffix: true,
          cacheControlMaxAge: 60 * 60 * 24 * 365,
        }
      },
    })
    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 })
  }
}
