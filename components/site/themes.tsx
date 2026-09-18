'use client'

import { ArrowUpRight } from 'lucide-react'
import { BalloonCluster, CrownMotif, LeafMotif, MoonMotif, PampasMotif, ShellMotif, Sparkle } from './decor'
import { Reveal, RevealGroup, RevealItem, SplitHeading } from './reveal'

const themes = [
  {
    name: 'Unicorn Pastel',
    copy: 'Blush clouds, iridescent balloons and a little glitter.',
    gradient: 'linear-gradient(150deg, #f7dbe8 0%, #e4cdf2 52%, #fbe9d6 100%)',
    dots: ['#f2c3d9', '#d6bdee', '#f8dcc0'],
    Motif: BalloonCluster,
  },
  {
    name: 'Jungle Safari',
    copy: 'Palm leaves, animal friends and earthy green tones.',
    gradient: 'linear-gradient(150deg, #d6e4c8 0%, #9db58f 55%, #e7d8b6 100%)',
    dots: ['#bcd1a9', '#8ca87c', '#e3d2ae'],
    Motif: LeafMotif,
  },
  {
    name: 'Princess Rose',
    copy: 'Soft drapes, rose garlands and a tiny gold throne.',
    gradient: 'linear-gradient(150deg, #fadedc 0%, #e6b0b6 55%, #f7e7d6 100%)',
    dots: ['#f4cbc8', '#dfa1a9', '#f3e2cd'],
    Motif: CrownMotif,
  },
  {
    name: 'Space & Stars',
    copy: 'Deep midnight blues, moons and constellations overhead.',
    gradient: 'linear-gradient(150deg, #3c3a5e 0%, #6a5b96 55%, #c3b3d8 100%)',
    dots: ['#4a4670', '#7568a3', '#c9bade'],
    dark: true,
    Motif: MoonMotif,
  },
  {
    name: 'Mermaid Cove',
    copy: 'Seafoam, pearls and shimmering ocean ribbons.',
    gradient: 'linear-gradient(150deg, #c6e7e3 0%, #8cc4c0 55%, #e6d8ca 100%)',
    dots: ['#b3ded9', '#7bb6b1', '#e0d0c0'],
    Motif: ShellMotif,
  },
  {
    name: 'Vintage Boho',
    copy: 'Pampas, dried florals and warm terracotta linen.',
    gradient: 'linear-gradient(150deg, #ecd9c7 0%, #c8a586 55%, #d9c4ad 100%)',
    dots: ['#e5cdb6', '#bd9a7d', '#d2bba2'],
    Motif: PampasMotif,
  },
]

export function Themes() {
  return (
    <section className="themes section-pad" id="themes">
      <div className="themes-head">
        <div>
          <Reveal className="section-kicker">02 &nbsp; Themes we love</Reveal>
          <h2>
            <SplitHeading>Pick a world.</SplitHeading>
            <br />
            <em>
              <SplitHeading delay={0.1}>We&apos;ll build it.</SplitHeading>
            </em>
          </h2>
        </div>
        <Reveal delay={0.15}>
          <p>
            These are just starting points — every palette gets tailored to your child, your space and the little
            things they love this year.
          </p>
        </Reveal>
      </div>

      <RevealGroup className="theme-grid" stagger={0.08}>
        {themes.map((theme) => (
          <RevealItem key={theme.name}>
            <a className={`theme-card${theme.dark ? ' is-dark' : ''}`} href="#contact">
              <span className="theme-art" style={{ background: theme.gradient }}>
                <theme.Motif className="theme-balloons" />
                <Sparkle className="theme-sparkle theme-sparkle-a" />
                <Sparkle className="theme-sparkle theme-sparkle-b" />
              </span>
              <span className="theme-meta">
                <span className="theme-row">
                  <span className="theme-name">{theme.name}</span>
                  <ArrowUpRight size={17} />
                </span>
                <span className="theme-copy">{theme.copy}</span>
                <span className="theme-dots">
                  {theme.dots.map((dot) => (
                    <i key={dot} style={{ background: dot }} />
                  ))}
                </span>
              </span>
            </a>
          </RevealItem>
        ))}
      </RevealGroup>
    </section>
  )
}
