/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Instagram CDN, used only when INSTAGRAM_ACCESS_TOKEN is configured.
    remotePatterns: [{ protocol: 'https', hostname: '*.cdninstagram.com' }, { protocol: 'https', hostname: '*.fbcdn.net' }],
  },
}

export default nextConfig
