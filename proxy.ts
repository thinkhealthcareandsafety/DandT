import { type NextRequest, NextResponse } from 'next/server'
import { SESSION_COOKIE, verifySession } from '@/lib/admin/session'

/** Sends signed-out visitors of /admin to the login screen before anything renders. */
export async function proxy(request: NextRequest) {
  const session = await verifySession(request.cookies.get(SESSION_COOKIE)?.value)
  if (session) return NextResponse.next()

  const login = new URL('/admin/login', request.url)
  if (request.nextUrl.pathname !== '/admin') login.searchParams.set('next', request.nextUrl.pathname)
  return NextResponse.redirect(login)
}

export const config = {
  matcher: ['/admin', '/admin/((?!login).*)'],
}
