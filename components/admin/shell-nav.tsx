'use client'

import { ExternalLink, History, Images, LayoutDashboard, LogOut, Menu, X } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { logout } from '@/app/admin/actions'
import { PARTS } from '@/lib/admin/schema'

export function ShellNav() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  // Close the phone drawer whenever a link takes you somewhere.
  useEffect(() => setOpen(false), [pathname])

  const link = (href: string, label: string, icon?: React.ReactNode) => (
    <Link href={href} className="ad-nav-link" aria-current={pathname === href ? 'page' : undefined}>
      {icon}
      <span>{label}</span>
    </Link>
  )

  return (
    <>
      <header className="ad-topbar">
        <button type="button" className="ad-icon-button" onClick={() => setOpen(true)} aria-label="Open menu">
          <Menu size={19} />
        </button>
        <Link href="/admin" className="ad-brand">
          <span className="ad-mark">
            D<span>&amp;</span>T
          </span>
          Studio
        </Link>
        <a href="/" target="_blank" rel="noopener noreferrer" className="ad-icon-button" aria-label="View the site">
          <ExternalLink size={17} />
        </a>
      </header>

      <div className={`ad-scrim${open ? ' is-open' : ''}`} onClick={() => setOpen(false)} aria-hidden="true" />

      <nav className={`ad-sidebar${open ? ' is-open' : ''}`} aria-label="Studio">
        <div className="ad-sidebar-head">
          <Link href="/admin" className="ad-brand">
            <span className="ad-mark">
              D<span>&amp;</span>T
            </span>
            Studio
          </Link>
          <button type="button" className="ad-icon-button ad-only-sm" onClick={() => setOpen(false)} aria-label="Close menu">
            <X size={18} />
          </button>
        </div>

        <div className="ad-nav-group">
          {link('/admin', 'Overview', <LayoutDashboard size={16} />)}
          {link('/admin/media', 'Media library', <Images size={16} />)}
        </div>

        {(['Homepage', 'Business'] as const).map((group) => (
          <div className="ad-nav-group" key={group}>
            <span className="ad-nav-title">{group}</span>
            {PARTS.filter((part) => part.group === group).map((part) => (
              <span key={part.key}>{link(`/admin/edit/${part.key}`, part.label)}</span>
            ))}
          </div>
        ))}

        <div className="ad-nav-group">
          {link('/admin/history', 'History & undo', <History size={16} />)}
          <a className="ad-nav-link" href="/" target="_blank" rel="noopener noreferrer">
            <ExternalLink size={16} />
            <span>View the site</span>
          </a>
        </div>

        <div className="ad-sidebar-foot">
          <span className="ad-who">
            <strong>Admin</strong>
            <small>Signed in</small>
          </span>
          <form action={logout}>
            <button className="ad-icon-button" aria-label="Sign out" title="Sign out">
              <LogOut size={16} />
            </button>
          </form>
        </div>
      </nav>
    </>
  )
}
