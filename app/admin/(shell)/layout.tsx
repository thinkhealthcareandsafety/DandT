import { AdminProvider } from '@/components/admin/admin-context'
import { ShellNav } from '@/components/admin/shell-nav'
import { requireAdminPage } from '@/lib/admin/auth'
import { buildLibrary } from '@/lib/admin/library'
import { loadStored } from '@/lib/content'
import { storeMode } from '@/lib/content/store'

export default async function ShellLayout({ children }: { children: React.ReactNode }) {
  await requireAdminPage()
  const { doc } = await loadStored()
  const mode = storeMode()

  return (
    <AdminProvider mode={mode} initialLibrary={buildLibrary(doc)}>
      <div className="ad-shell">
        <ShellNav />
        <main className="ad-main">
          {mode === 'readonly' && (
            <div className="ad-banner is-warn">
              <p>
                <strong>Saving is switched off.</strong> This deployment has no storage connected, so the site is showing
                its built-in content. In Vercel open the project → Storage → Create Database → Blob (choose{' '}
                <em>public</em> access), connect it to this project, then redeploy.
              </p>
            </div>
          )}
          {mode === 'local' && (
            <div className="ad-banner is-info">
              <p>
                <strong>Local preview.</strong> Changes save to this computer (the <code>.data</code> folder) — the live site
                is not affected.
              </p>
            </div>
          )}
          {children}
        </main>
      </div>
    </AdminProvider>
  )
}
