import 'server-only'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { SESSION_COOKIE, type Session, verifySession } from './session'

/** The signed-in admin, or null. */
export async function currentAdmin(): Promise<Session | null> {
  return verifySession((await cookies()).get(SESSION_COOKIE)?.value)
}

/**
 * For admin pages: sends anyone not signed in to the login screen. proxy.ts does the same check
 * up front, but every page and action re-checks — proxy is a convenience, not the security boundary.
 */
export async function requireAdminPage(): Promise<Session> {
  const session = await currentAdmin()
  if (!session) redirect('/admin/login')
  return session
}

/** For server actions and route handlers, which must refuse rather than redirect. */
export async function requireAdmin(): Promise<Session> {
  const session = await currentAdmin()
  if (!session) throw new Error('Your session has ended — please sign in again.')
  return session
}
