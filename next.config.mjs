/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Instagram CDN, used only when INSTAGRAM_ACCESS_TOKEN is configured.
    remotePatterns: [{ protocol: 'https', hostname: '*.cdninstagram.com' }, { protocol: 'https', hostname: '*.fbcdn.net' }],
    // AVIF first (typically 20-30% smaller than WebP at equal quality), WebP as the fallback for
    // the handful of browsers without AVIF support. Sharp (present in node_modules) encodes both.
    formats: ['image/avif', 'image/webp'],
    // Next only serves quality=75 unless every other value used via the `quality` prop is
    // listed here too — an unlisted value 400s at request time, not at build time. Keep this in
    // sync with every `quality={n}` in components/site/*.tsx (75 is the unset default).
    qualities: [60, 68, 72, 75, 85],
  },
}

export default nextConfig
