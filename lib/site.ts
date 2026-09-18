const FALLBACK_SITE_URL = 'https://dreamsandthemes.in'

/**
 * Tolerates the env var being blank or entered without a protocol, either of which
 * would otherwise throw at build time and fail the deployment.
 */
export function siteUrl() {
  const value = process.env.NEXT_PUBLIC_SITE_URL?.trim()
  if (!value) return new URL(FALLBACK_SITE_URL)
  try {
    return new URL(/^https?:\/\//i.test(value) ? value : `https://${value}`)
  } catch {
    return new URL(FALLBACK_SITE_URL)
  }
}
