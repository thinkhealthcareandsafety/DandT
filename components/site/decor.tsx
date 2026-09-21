export function Sparkle({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 0c.6 6.2 5.2 10.8 12 12-6.8 1.2-11.4 5.8-12 12-.6-6.2-5.2-10.8-12-12C6.8 10.8 11.4 6.2 12 0Z"
        fill="currentColor"
      />
    </svg>
  )
}

export function ArcLine({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 320 160" fill="none" aria-hidden="true">
      <path d="M4 156C4 72 76 4 160 4s156 68 156 152" stroke="currentColor" strokeWidth="1" strokeDasharray="3 7" />
      <circle cx="160" cy="4" r="4" fill="currentColor" />
    </svg>
  )
}
