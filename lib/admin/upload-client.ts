'use client'

import { upload } from '@vercel/blob/client'
import type { StoreMode } from '@/lib/content/store'
import type { Asset } from '@/lib/content/types'

/**
 * Everything the browser does with a file before it reaches the site: phone photos are scaled to
 * a sensible size and re-encoded (a 6 MB camera JPEG becomes ~400 KB with no visible loss), a blur
 * placeholder is made, and films get a poster frame grabbed from their first moments.
 */

const MAX_EDGE = 2400
const MAX_VIDEO_BYTES = 250 * 1024 * 1024

export type Progress = (fraction: number) => void

function canvasToBlob(canvas: HTMLCanvasElement, quality = 0.86) {
  return new Promise<Blob>((resolve, reject) =>
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error('Could not encode the image.'))), 'image/jpeg', quality),
  )
}

function draw(source: CanvasImageSource, width: number, height: number, maxEdge: number) {
  const scale = Math.min(1, maxEdge / Math.max(width, height))
  const canvas = document.createElement('canvas')
  canvas.width = Math.round(width * scale)
  canvas.height = Math.round(height * scale)
  const ctx = canvas.getContext('2d')!
  ctx.imageSmoothingQuality = 'high'
  ctx.drawImage(source, 0, 0, canvas.width, canvas.height)
  return canvas
}

function blurOf(source: CanvasImageSource, width: number, height: number) {
  const canvas = document.createElement('canvas')
  canvas.width = 12
  canvas.height = Math.max(1, Math.round((12 * height) / width))
  canvas.getContext('2d')!.drawImage(source, 0, 0, canvas.width, canvas.height)
  return canvas.toDataURL('image/jpeg', 0.5)
}

function baseName(file: File) {
  return file.name.replace(/\.[^.]+$/, '').replace(/[_-]+/g, ' ').trim() || 'Untitled'
}

function slug(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40) || 'file'
}

async function send(body: Blob, filename: string, mode: StoreMode, onProgress?: Progress) {
  if (mode === 'blob') {
    const result = await upload(`media/${filename}`, body, {
      access: 'public',
      handleUploadUrl: '/api/admin/upload',
      contentType: body.type,
      multipart: body.size > 8 * 1024 * 1024,
      onUploadProgress: ({ percentage }) => onProgress?.(percentage / 100),
    })
    return { url: result.url, key: result.url }
  }
  if (mode === 'readonly') throw new Error('Storage isn’t connected yet, so files can’t be uploaded.')

  // Local development: a plain multipart POST, with progress from XHR.
  return new Promise<{ url: string; key: string }>((resolve, reject) => {
    const form = new FormData()
    form.append('file', new File([body], filename, { type: body.type }))
    const xhr = new XMLHttpRequest()
    xhr.open('POST', '/api/admin/upload')
    xhr.upload.onprogress = (e) => e.lengthComputable && onProgress?.(e.loaded / e.total)
    xhr.onload = () => {
      const data = JSON.parse(xhr.responseText || '{}')
      if (xhr.status >= 200 && xhr.status < 300) resolve(data)
      else reject(new Error(data.error || 'Upload failed.'))
    }
    xhr.onerror = () => reject(new Error('Upload failed — check your connection.'))
    xhr.send(form)
  })
}

async function prepareImage(file: File, mode: StoreMode, onProgress?: Progress): Promise<Asset> {
  let bitmap: ImageBitmap
  try {
    bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' })
  } catch {
    throw new Error(
      `${file.name} couldn’t be opened. iPhone HEIC photos need converting first — sharing them through WhatsApp does it.`,
    )
  }
  const canvas = draw(bitmap, bitmap.width, bitmap.height, MAX_EDGE)
  const blur = blurOf(bitmap, bitmap.width, bitmap.height)
  bitmap.close()

  const body = await canvasToBlob(canvas)
  const name = baseName(file)
  const { url, key } = await send(body, `${slug(name)}.jpg`, mode, onProgress)
  return { id: `up:${key}`, name, src: url, width: canvas.width, height: canvas.height, blur, keys: [key], size: body.size }
}

async function prepareVideo(file: File, mode: StoreMode, onProgress?: Progress): Promise<Asset> {
  if (file.size > MAX_VIDEO_BYTES) throw new Error(`${file.name} is over 250 MB — trim it shorter first.`)

  const objectUrl = URL.createObjectURL(file)
  try {
    const video = document.createElement('video')
    video.muted = true
    video.playsInline = true
    video.preload = 'auto'
    video.src = objectUrl
    await new Promise<void>((resolve, reject) => {
      video.onloadeddata = () => resolve()
      video.onerror = () => reject(new Error(`${file.name} can’t be played in this browser, so it won’t play on the site either. MP4 works everywhere.`))
    })
    video.currentTime = Math.min(0.2, (video.duration || 1) / 4)
    await new Promise<void>((resolve) => (video.onseeked = () => resolve()))

    const { videoWidth: width, videoHeight: height } = video
    const posterCanvas = draw(video, width, height, 1280)
    const blur = blurOf(video, width, height)
    const poster = await canvasToBlob(posterCanvas, 0.88)

    const name = baseName(file)
    const ext = file.type === 'video/webm' ? 'webm' : file.type === 'video/quicktime' ? 'mov' : 'mp4'
    const posterUpload = await send(poster, `${slug(name)}-poster.jpg`, mode)
    const videoUpload = await send(file, `${slug(name)}.${ext}`, mode, onProgress)

    return {
      id: `up:${videoUpload.key}`,
      name,
      src: posterUpload.url,
      video: videoUpload.url,
      width: posterCanvas.width,
      height: posterCanvas.height,
      blur,
      keys: [videoUpload.key, posterUpload.key],
      size: file.size + poster.size,
    }
  } finally {
    URL.revokeObjectURL(objectUrl)
  }
}

export function isAcceptedFile(file: File) {
  return file.type.startsWith('image/') || file.type.startsWith('video/') || /\.(heic|heif)$/i.test(file.name)
}

export function prepareAndUpload(file: File, mode: StoreMode, onProgress?: Progress): Promise<Asset> {
  return file.type.startsWith('video/') ? prepareVideo(file, mode, onProgress) : prepareImage(file, mode, onProgress)
}
