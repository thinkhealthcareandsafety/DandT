import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { LoginForm } from '@/components/admin/login-form'
import { currentAdmin } from '@/lib/admin/auth'
import { adminConfigured } from '@/lib/admin/session'

export const metadata: Metadata = { title: 'Sign in' }

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  if (await currentAdmin()) redirect('/admin')
  const { next } = await searchParams

  return (
    <main className="ad-login">
      <div className="ad-login-card">
        <span className="ad-mark" aria-hidden="true">
          D<span>&amp;</span>T
        </span>
        <h1>
          Welcome to your <em>studio.</em>
        </h1>
        <p className="ad-login-lede">Change photos, words and prices on the site — it updates the moment you save.</p>

        {adminConfigured() ? (
          <LoginForm next={next ?? ''} />
        ) : (
          <div className="ad-banner is-warn">
            <p>
              The studio isn’t switched on yet. Add an <code>ADMIN_PASSWORD</code> environment variable (in Vercel:
              Settings → Environment Variables), then redeploy.
            </p>
          </div>
        )}
      </div>
      <a className="ad-login-site" href="/">
        ← Back to the site
      </a>
    </main>
  )
}
