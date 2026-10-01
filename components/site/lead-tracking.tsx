'use client'

import { sendGAEvent } from '@next/third-parties/google'
import { useEffect } from 'react'

// Every enquiry route on the site is a plain link, so one delegated listener counts them all
// as GA4 `generate_lead` events — mark the event as a key event in GA4 to see enquiries per source.
const methods: [prefix: string, method: string][] = [
  ['https://wa.me/', 'whatsapp'],
  ['tel:', 'phone'],
  ['mailto:', 'email'],
]

export function LeadTracking() {
  useEffect(() => {
    function onClick(event: MouseEvent) {
      const link = (event.target as Element | null)?.closest?.('a[href]')
      const href = link?.getAttribute('href')
      if (!href) return
      const match = methods.find(([prefix]) => href.startsWith(prefix))
      if (match) sendGAEvent('event', 'generate_lead', { method: match[1] })
    }
    document.addEventListener('click', onClick, { capture: true })
    return () => document.removeEventListener('click', onClick, { capture: true })
  }, [])

  return null
}
