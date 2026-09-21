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

export function Confetti({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 200 120" fill="none" aria-hidden="true">
      <g stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
        <path d="M12 28l8-10M46 14l3-12M84 30l10-8M132 16l2-12M168 32l9-9" />
        <path d="M24 78l6-11M62 92l10-7M108 84l4-12M152 96l9-8M186 72l6-11" />
      </g>
      <g fill="currentColor" opacity="0.55">
        <circle cx="34" cy="48" r="2.6" />
        <circle cx="98" cy="58" r="2" />
        <circle cx="146" cy="44" r="2.4" />
        <circle cx="72" cy="20" r="1.8" />
        <circle cx="178" cy="104" r="2.2" />
      </g>
    </svg>
  )
}
