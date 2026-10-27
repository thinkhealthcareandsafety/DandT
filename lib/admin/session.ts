/**
 * Admin sessions: a signed, httpOnly cookie holding who signed in and when it expires. Uses only
 * Web Crypto, so the same check runs in proxy.ts and in every server action.
 */

export const SESSION_COOKIE = 'dt_admin'
export const SESSION_DAYS = 14

export type Session = { name: string; exp: number }

const encoder = new TextEncoder()

function secret() {
  // Falls back to the password itself, so changing ADMIN_PASSWORD also signs everyone out.
  return process.env.ADMIN_SESSION_SECRET?.trim() || process.env.ADMIN_PASSWORD?.trim() || ''
}

export function adminConfigured() {
  return Boolean(process.env.ADMIN_PASSWORD?.trim())
}

function toBase64Url(bytes: Uint8Array) {
  let binary = ''
  for (const byte of bytes) binary += String.fromCharCode(byte)
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

function fromBase64Url(value: string) {
  const binary = atob(value.replace(/-/g, '+').replace(/_/g, '/'))
  return Uint8Array.from(binary, (c) => c.charCodeAt(0))
}

async function key() {
  return crypto.subtle.importKey('raw', encoder.encode(secret()), { name: 'HMAC', hash: 'SHA-256' }, false, [
    'sign',
    'verify',
  ])
}

export async function signSession(name: string): Promise<{ value: string; expires: Date }> {
  const exp = Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000
  const payload = toBase64Url(encoder.encode(JSON.stringify({ name, exp } satisfies Session)))
  const signature = new Uint8Array(await crypto.subtle.sign('HMAC', await key(), encoder.encode(payload)))
  return { value: `${payload}.${toBase64Url(signature)}`, expires: new Date(exp) }
}

export async function verifySession(value: string | undefined): Promise<Session | null> {
  if (!value || !adminConfigured()) return null
  const [payload, signature] = value.split('.')
  if (!payload || !signature) return null
  try {
    const valid = await crypto.subtle.verify(
      'HMAC',
      await key(),
      fromBase64Url(signature),
      encoder.encode(payload),
    )
    if (!valid) return null
    const session = JSON.parse(new TextDecoder().decode(fromBase64Url(payload))) as Session
    return session.exp > Date.now() ? session : null
  } catch {
    return null
  }
}

/** Constant-time password check (both sides hashed first, so length can't leak either). */
export async function passwordMatches(attempt: string) {
  const expected = process.env.ADMIN_PASSWORD?.trim()
  if (!expected) return false
  const [a, b] = await Promise.all(
    [attempt, expected].map(async (v) => new Uint8Array(await crypto.subtle.digest('SHA-256', encoder.encode(v)))),
  )
  let diff = 0
  for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i]
  return diff === 0
}
