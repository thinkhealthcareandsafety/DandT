'use client'

import { ArrowUpRight } from 'lucide-react'

const phrase = ['Follow the celebrations', '@dreamsandthemespune']

export function InstagramBand() {
  return (
    <a
      className="ig-band"
      href="https://www.instagram.com/dreamsandthemespune/"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Follow Dreams and Themes on Instagram"
     
    >
      <div className="ig-track" aria-hidden="true">
        {[0, 1].map((copy) => (
          <div className="ig-set" key={copy}>
            {[0, 1, 2].map((rep) =>
              phrase.map((item, i) => (
                <span className="ig-item" key={`${copy}-${rep}-${i}`}>
                  {item}
                  <i>✦</i>
                </span>
              )),
            )}
          </div>
        ))}
      </div>
      <span className="ig-badge">
        Visit Instagram <ArrowUpRight size={16} />
      </span>
    </a>
  )
}
