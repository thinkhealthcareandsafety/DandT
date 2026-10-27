import type { Metadata } from 'next'
import './admin.css'

export const metadata: Metadata = {
  title: { default: 'Studio · Dreams & Themes', template: '%s · Studio · Dreams & Themes' },
  robots: { index: false, follow: false },
}

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return <div className="ad-root">{children}</div>
}
