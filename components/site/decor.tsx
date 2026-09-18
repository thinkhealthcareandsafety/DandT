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

export function BalloonCluster({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 180 260" fill="none" aria-hidden="true">
      <g stroke="currentColor" strokeWidth="1.1" fill="none">
        <ellipse cx="54" cy="62" rx="36" ry="44" />
        <path d="M54 106c-3 4 3 7 0 11" />
        <ellipse cx="122" cy="48" rx="28" ry="34" />
        <path d="M122 82c-2.5 3.5 2.5 6 0 9.5" />
        <ellipse cx="100" cy="122" rx="22" ry="27" />
        <path d="M100 149c-2 3 2 5 0 8" />
        <path d="M54 117c6 34-14 62-2 98" strokeDasharray="2 5" />
        <path d="M122 91c-4 30 10 56 2 88" strokeDasharray="2 5" />
        <path d="M100 157c2 22-6 40 0 60" strokeDasharray="2 5" />
      </g>
      <g fill="currentColor" opacity="0.5">
        <circle cx="40" cy="44" r="3" />
        <circle cx="112" cy="34" r="2.4" />
        <circle cx="92" cy="112" r="2" />
      </g>
    </svg>
  )
}

export function LeafMotif({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 180 200" fill="none" aria-hidden="true">
      <g stroke="currentColor" strokeWidth="1.1" strokeLinecap="round">
        <path d="M92 196c0-58-14-104-52-140 46 6 74 44 74 96" />
        <path d="M40 60c10 8 20 20 26 32M52 40c14 10 26 24 32 38M74 30c10 12 18 26 22 40" />
        <path d="M96 196c6-48 26-84 62-104-34-6-58 14-68 44" />
        <path d="M142 106c-10 4-20 12-26 22M150 88c-14 6-26 16-32 28" />
        <path d="M88 198c-14-26-34-42-62-48 18-14 42-6 54 14" />
      </g>
      <g fill="currentColor" opacity="0.5">
        <circle cx="128" cy="150" r="3" />
        <circle cx="46" cy="168" r="2.4" />
      </g>
    </svg>
  )
}

export function CrownMotif({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 180 160" fill="none" aria-hidden="true">
      <g stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" strokeLinecap="round">
        <path d="M44 112h92l10-62-32 24-24-40-24 40-32-24 10 62Z" />
        <path d="M44 112h92" />
        <path d="M38 128h104" />
        <path d="M14 30c26 16 44 34 52 54M166 30c-26 16-44 34-52 54" strokeDasharray="3 7" />
      </g>
      <g fill="currentColor">
        <circle cx="90" cy="34" r="4" />
        <circle cx="54" cy="58" r="3" />
        <circle cx="126" cy="58" r="3" />
        <circle cx="90" cy="98" r="3.4" opacity="0.6" />
      </g>
    </svg>
  )
}

export function MoonMotif({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 180 180" fill="none" aria-hidden="true">
      <g stroke="currentColor" strokeWidth="1.2">
        <path d="M108 26a58 58 0 1 0 40 90A64 64 0 0 1 108 26Z" />
        <ellipse cx="46" cy="140" rx="20" ry="20" />
        <ellipse cx="46" cy="140" rx="34" ry="9" transform="rotate(-18 46 140)" />
      </g>
      <g fill="currentColor">
        <path d="M148 34c.4 4.4 3.6 7.6 8 8-4.4.8-7.6 4-8 8-.4-4-3.6-7.2-8-8 4.4-.4 7.6-3.6 8-8Z" />
        <path d="M34 42c.3 3.3 2.7 5.7 6 6-3.3.6-5.7 3-6 6-.3-3-2.7-5.4-6-6 3.3-.3 5.7-2.7 6-6Z" />
        <circle cx="152" cy="92" r="2.6" />
        <circle cx="22" cy="96" r="2" />
        <circle cx="96" cy="160" r="2.2" />
      </g>
    </svg>
  )
}

export function ShellMotif({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 180 170" fill="none" aria-hidden="true">
      <g stroke="currentColor" strokeWidth="1.2" strokeLinecap="round">
        <path d="M90 128C56 128 30 100 30 66c0-8 6-12 12-8 14 8 30 12 48 12s34-4 48-12c6-4 12 0 12 8 0 34-26 62-60 62Z" />
        <path d="M90 128V70M66 122c-8-16-12-34-12-50M114 122c8-16 12-34 12-50M44 108c-4-12-6-26-6-38M136 108c4-12 6-26 6-38" />
        <path d="M18 150c14-8 28-8 42 0s28 8 42 0 28-8 42 0" />
        <path d="M30 166c12-6 24-6 36 0s24 6 36 0" strokeDasharray="3 6" />
      </g>
      <g fill="currentColor" opacity="0.55">
        <circle cx="146" cy="36" r="3" />
        <circle cx="30" cy="30" r="2.2" />
        <circle cx="158" cy="62" r="2" />
      </g>
    </svg>
  )
}

export function PampasMotif({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 180 200" fill="none" aria-hidden="true">
      <g stroke="currentColor" strokeWidth="1.1" strokeLinecap="round">
        <path d="M90 198c0-52-4-92-14-124M90 198c2-48 12-84 28-110M90 198c-4-42-18-72-40-92" />
        <ellipse cx="74" cy="60" rx="13" ry="30" transform="rotate(-10 74 60)" />
        <ellipse cx="121" cy="72" rx="11" ry="26" transform="rotate(14 121 72)" />
        <ellipse cx="49" cy="96" rx="9" ry="22" transform="rotate(-30 49 96)" />
        <path d="M30 22c22 4 40 18 50 38M150 22c-22 4-40 18-50 38" strokeDasharray="3 7" />
      </g>
      <g fill="currentColor" opacity="0.45">
        <circle cx="74" cy="60" r="2.6" />
        <circle cx="121" cy="72" r="2.2" />
        <circle cx="49" cy="96" r="2" />
      </g>
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
