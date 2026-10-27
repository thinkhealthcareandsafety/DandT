/**
 * Regenerates content/static-media.json: the size and a tiny blur placeholder for every photo that
 * ships in public/. The admin's media library offers these alongside uploads, and the site uses the
 * placeholder to fade photos in the way static imports used to.
 *
 * Run after adding or replacing a file in public/gallery, public/themes or public/dreams-hero.jpg:
 *   node scripts/media-manifest.mjs
 */
import fs from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'

const root = path.resolve(import.meta.dirname, '..')
const publicDir = path.join(root, 'public')
const folders = ['gallery', 'gallery/video', 'themes']
const singles = ['dreams-hero.jpg']

const files = [
  ...folders.flatMap((folder) =>
    fs
      .readdirSync(path.join(publicDir, folder))
      .filter((name) => /\.(jpe?g|png|webp)$/i.test(name))
      .map((name) => `${folder}/${name}`),
  ),
  ...singles,
]

const entries = []
for (const file of files.sort()) {
  const full = path.join(publicDir, file)
  const { width, height } = await sharp(full).metadata()
  const tiny = await sharp(full).resize(12).jpeg({ quality: 50 }).toBuffer()
  const clip = full.replace(/\.(jpe?g|png|webp)$/i, '.mp4')
  entries.push({
    id: `static:${file}`,
    src: `/${file}`,
    width,
    height,
    blur: `data:image/jpeg;base64,${tiny.toString('base64')}`,
    ...(fs.existsSync(clip) ? { video: `/${file.replace(/\.(jpe?g|png|webp)$/i, '.mp4')}` } : {}),
  })
}

fs.writeFileSync(path.join(root, 'content', 'static-media.json'), `${JSON.stringify(entries, null, 1)}\n`)
console.log(`Wrote ${entries.length} entries to content/static-media.json`)
