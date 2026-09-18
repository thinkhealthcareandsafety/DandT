'use client'

export function Marquee({ items }: { items: string[] }) {
  const run = [...items, ...items]
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee-track">
        {[0, 1].map((copy) => (
          <div className="marquee-set" key={copy}>
            {run.map((item, i) => (
              <span className="marquee-item" key={`${copy}-${i}`}>
                {item}
                <i className="marquee-sep">✦</i>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
