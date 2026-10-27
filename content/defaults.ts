import type { GalleryItem, Media, Shot, SiteContent } from '@/lib/content/types'
import staticMedia from './static-media.json'

/**
 * The content that ships with the code. The site shows this until the owners save a change in
 * /admin, and any part they have never touched keeps following this file.
 *
 * Every photo is from a real Dreams & Themes event. Privacy: no photo may show a child's name
 * (party signage, name letters, backdrops) or a guest's face in a framed print — crop or blur it,
 * or leave the photo out. Alt text never names a child either.
 */

const library = new Map(staticMedia.map((entry) => [entry.src, entry]))

/** A shipped photo by its path under public/, with its size and blur placeholder from the manifest. */
function photo(file: string, focus?: string): Media {
  const entry = library.get(`/${file}`)
  if (!entry) throw new Error(`content/defaults.ts: ${file} is not in content/static-media.json — run node scripts/media-manifest.mjs`)
  const { src, width, height, blur, video } = entry as Media
  return { src, width, height, blur, ...(video ? { video } : {}), ...(focus ? { focus } : {}) }
}

/** The lookbook, in display order. Services reuse these photos (and their descriptions) below. */
const GALLERY_ITEMS: GalleryItem[] = [
    { media: photo('gallery/frozen-elsa-stage.jpg'), title: 'Frozen stage', alt: 'A Frozen stage with Elsa and Anna cut-outs, a lit number five and a snow-white floor', category: 'decor' },
    { media: photo('gallery/video/arch-reveal.jpg'), title: 'Ballroom entrance arch', alt: 'A white and ice-blue balloon arch at a hotel ballroom door, lit by glowing butterfly lamps', category: 'decor' },
    { media: photo('gallery/lakeside-centrepiece.jpg', '62% 60%'), title: 'Roses & candlelight', alt: 'A rose and baby’s breath centrepiece around a pillar candle, with pink disco baubles', category: 'tables' },
    { media: photo('gallery/magician-silks.jpg'), title: 'Magic show', alt: 'A magician in a top hat pulling rainbow silks from a newspaper as the birthday girl watches', category: 'entertainment' },
    { media: photo('gallery/01-pastel-balloon-tunnel.jpg'), title: 'Pastel balloon tunnel', alt: 'A pastel and gold balloon tunnel leading to a Happy Birthday backdrop', category: 'decor' },
    { media: photo('gallery/rooftop-soft-play.jpg'), title: 'Rooftop soft play', alt: 'A rooftop soft play zone with slides, see-saws and colourful fencing under festoon lights', category: 'play' },
    { media: photo('gallery/kpop-arch-entrance.jpg'), title: 'K-pop arch entrance', alt: 'A pink, purple and silver balloon arch at a ballroom entrance, flanked by life-size K-pop cut-outs', category: 'decor' },
    { media: photo('gallery/video/lakeside-centrepiece.jpg'), title: 'Lakeside table, in motion', alt: 'A slow push-in towards a rose and candle centrepiece, with long tables and the lake behind', category: 'tables' },
    { media: photo('gallery/kpop-birthday-backdrop.jpg'), title: 'K-pop backdrop', alt: 'A K-pop backdrop framed by pink, purple and gold balloons with a gold number nine', category: 'decor' },
    { media: photo('gallery/nail-art.jpg'), title: 'Nail-art bar', alt: 'A nail artist painting a young guest’s nails at a party table', category: 'entertainment' },
    { media: photo('gallery/white-arch-entrance.jpg'), title: 'Ice-blue arch', alt: 'A silver, white and blue balloon arch framing a ballroom entrance', category: 'decor' },
    { media: photo('gallery/ball-pit.jpg'), title: 'Ball pit', alt: 'A ball pit filled with bright balls inside a red and yellow play fence', category: 'play' },
    { media: photo('gallery/lakeside-table-wide.jpg', '50% 58%'), title: 'The head table', alt: 'A dressed table by floor-to-ceiling windows, with a peach satin runner, roses and candles', category: 'tables' },
    { media: photo('gallery/kpop-dance-performance.jpg'), title: 'Stage performance', alt: 'Four young performers dancing on stage in front of a glittering K-pop backdrop', category: 'entertainment' },
    { media: photo('gallery/video/frozen-stage.jpg'), title: 'Frozen stage, in motion', alt: 'A slow pan across a Frozen stage with balloon arches and a Happy Birthday arch', category: 'decor' },
    { media: photo('gallery/caricature-artists.jpg'), title: 'Caricature artists', alt: 'Two caricature artists sketching guests under a striped canopy on the lawn', category: 'entertainment' },
    { media: photo('gallery/light-ring-arch.jpg'), title: 'Ring-light arch', alt: 'A glowing ring-light arch with Frozen characters at a marble hotel foyer', category: 'decor' },
    { media: photo('gallery/garden-soft-play.jpg'), title: 'Garden soft play', alt: 'A garden soft play area with play fencing, ride-on toys and a trampoline', category: 'play' },
    { media: photo('gallery/lakeside-peach-runner.jpg', '50% 62%'), title: 'Satin, pearls & baubles', alt: 'A peach satin runner scattered with pearls and disco baubles between two rose centrepieces', category: 'tables' },
    { media: photo('gallery/led-photo-wall.jpg'), title: 'LED photo wall', alt: 'A glittering LED sequin photo wall flanked by a balloon column and character cut-outs', category: 'decor' },
    { media: photo('gallery/02-neon-first-birthday.jpg'), title: 'Neon first birthday', alt: 'A lilac and yellow balloon ring with a neon Happy Birthday sign for a first birthday', category: 'decor' },
    { media: photo('gallery/giant-dartboard.jpg'), title: 'Giant dartboard', alt: 'A giant inflatable dartboard game set up on a lawn', category: 'entertainment' },
    { media: photo('gallery/character-centrepiece.jpg'), title: 'Table centrepiece', alt: 'A honeycomb table centrepiece with a character topper, scattered with paper hearts', category: 'decor' },
    { media: photo('gallery/block-tower.jpg'), title: 'Giant building blocks', alt: 'A child standing beside a tower of giant building blocks taller than them', category: 'play' },
    { media: photo('gallery/lakeside-table-florals.jpg', '50% 70%'), title: 'Lake views, all lunch', alt: 'A long table by a lake window with a rose centrepiece, candles and bud vases of baby’s breath', category: 'tables' },
    { media: photo('gallery/magic-wand-trick.jpg'), title: 'Magic wand trick', alt: 'A magician guiding a young guest through a wand trick on a sparkling star-lit stage', category: 'entertainment' },
    { media: photo('gallery/canvas-painting.jpg'), title: 'Canvas painting', alt: 'Pre-sketched penguin canvases ready for a painting activity', category: 'entertainment' },
    { media: photo('gallery/balloon-ceiling-home.jpg'), title: 'Balloon ceiling at home', alt: 'A living room ceiling covered in pink balloons with ribbon streamers', category: 'decor' },
    { media: photo('gallery/mascot-visit.jpg'), title: 'Mascot visit', alt: 'A Minnie Mouse mascot visiting children at an indoor soft play area', category: 'play' },
    { media: photo('gallery/03-flower-cart-entrance.jpg'), title: 'Flower cart entrance', alt: 'A white flower cart with pink blossoms at a venue entrance', category: 'decor' },
    { media: photo('gallery/bead-and-nail-bar.jpg'), title: 'Beads and nail paint', alt: 'Children at a bead jewellery and nail paint station', category: 'entertainment' },
    { media: photo('gallery/floral-table-detail.jpg'), title: 'Floral table detail', alt: 'A single gladiolus stem in a glass vase, with a balloon arch soft-focused behind', category: 'tables' },
    { media: photo('gallery/05-pink-bubble-house.jpg'), title: 'Balloon bubble house', alt: 'A clear bubble house filled with pink and silver balloons', category: 'play' },
    { media: photo('gallery/07-barbie-table-styling.jpg'), title: 'Barbie table', alt: 'A hot pink Barbie table with a silhouette centrepiece', category: 'decor' },
    { media: photo('gallery/12-tattoo-artist-corner.jpg'), title: 'Tattoo artist', alt: 'A temporary tattoo artist’s corner with a hand-lettered sign', category: 'entertainment' },
    { media: photo('gallery/birthday-girl-nail-art.jpg'), title: 'Nail art, up close', alt: 'A young guest in a tiara having her nails painted at a table set with polish bottles', category: 'entertainment' },
    { media: photo('gallery/06-pastel-bouncy-castle.jpg'), title: 'Pastel bouncy castle', alt: 'A pastel bouncy castle with a slide, set up indoors', category: 'play' },
    { media: photo('gallery/08-happy-birthday-backdrop.jpg'), title: 'Neon backdrop', alt: 'A peach and gold balloon garland around a neon Happy Birthday backdrop', category: 'decor' },
    { media: photo('gallery/09-soft-play-zone.jpg'), title: 'Indoor soft play', alt: 'An indoor soft play zone with a slide, rocker and ball pit', category: 'play' },
    { media: photo('gallery/10-bubble-house-balloons.jpg'), title: 'Bubble house play', alt: 'Children playing with balloons inside a clear bubble house', category: 'play' },
    { media: photo('gallery/11-outdoor-soft-play.jpg'), title: 'Outdoor soft play', alt: 'An outdoor soft play set-up with foam mats, tunnels and a trampoline', category: 'play' },
]

/** Gallery photos by file, for a service's own set. */
function shots(...files: string[]): Shot[] {
  return files.map((file) => {
    const item = GALLERY_ITEMS.find((g) => g.media.src === `/${file}`)
    if (!item) throw new Error(`content/defaults.ts: ${file} is not in the gallery`)
    return { media: item.media, alt: item.alt }
  })
}

export const DEFAULT_CONTENT: SiteContent = {
  business: {
    name: 'Dreams & Themes',
    email: 'dreamsandthemespune@gmail.com',
    instagram: 'dreamsandthemespune',
    whatsapp: '9559507878',
    cities: ['Pune', 'Dehradun', 'Lucknow'],
    // Nikita is always listed first — she holds the largest stake in the business.
    contacts: [
      { name: 'Nikita', number: '8007000606', role: 'Celebration curator' },
      { name: 'Pakhi', number: '9559507878', role: 'Celebration curator' },
      { name: 'Neeta', number: '9623614682', role: 'Celebration curator' },
    ],
    announcement: 'Thoughtfully planned celebrations, wherever you are.',
    footerLine: 'Curating joy, one celebration at a time.',
  },

  seo: {
    title: 'Dreams & Themes | Birthday Decor & Soft Play in Pune',
    description:
      'Birthday decorations, theme parties, soft play rentals and return gifts — thoughtfully styled celebrations across Pune, Dehradun and Lucknow.',
  },

  hero: {
    eyebrow: 'Pune · Dehradun · Lucknow',
    titleLine1: 'Make room for',
    titleAccent: 'magic.',
    lede: 'Frozen stages, K-pop arches, fairy gardens and soft-play kingdoms — dreamt up with you, built by hand, and styled down to the last balloon.',
    primaryCta: 'Start planning',
    secondaryCta: 'See our parties',
    trust: [
      { title: 'Set-ups from ₹7,000', copy: 'Transparent, itemised quotes' },
      { title: 'One team, start to finish', copy: 'We design, build and clean up' },
      { title: 'Soft play specialists', copy: 'Sanitised before every party' },
    ],
    pins: [
      {
        media: photo('gallery/frozen-elsa-stage.jpg'),
        alt: 'A Frozen stage with Elsa and Anna cut-outs and a lit number five',
        caption: 'Frozen, turning five',
      },
      {
        media: photo('gallery/01-pastel-balloon-tunnel.jpg', '50% 40%'),
        alt: 'A pastel and gold balloon tunnel leading to a Happy Birthday backdrop',
        caption: 'pastel & gold',
      },
      {
        media: photo('gallery/magician-silks.jpg'),
        alt: 'A magician pulling rainbow silks from a newspaper as the birthday girl watches',
        caption: 'the magic show',
      },
      {
        media: photo('themes/fairy-garden.jpg'),
        alt: 'A lilac balloon arch with a fairy cut-out and a lit number one',
        caption: 'fairy first birthday',
      },
    ],
    boardNote: 'every photo here is a real party of ours',
    stamp: 'For the little big days',
  },

  ticker: [
    'Birthday Decorations',
    'Soft Play Rentals',
    'Theme Parties',
    'Table & Floral Styling',
    'Bubble House',
    'Return Gifts',
    'DIY Activities',
    'Canvas Painting',
    'Outstation Celebrations',
  ],

  process: {
    kicker: 'How it works',
    heading: { line1: 'From one WhatsApp message', line2: 'to the last balloon.' },
    steps: [
      { title: 'Tell us the dream', copy: 'A message, a screenshot, “she’s obsessed with Frozen” — anything is enough to begin.' },
      { title: 'We design it', copy: 'Palette, props, play zones and the little surprises, planned to the last detail.' },
      { title: 'We build it', copy: 'Our team arrives, styles the space and handles everything on the day.' },
      { title: 'You celebrate', copy: 'You stay present with your people. We quietly take care of the rest.' },
    ],
  },

  themes: {
    kicker: 'Themes we love',
    heading: { line1: 'Pick a world.', line2: 'We’ll build it.' },
    intro:
      'A few of the worlds we build most often. Every one gets tailored to your child, your space and whatever they love this year.',
    items: [
      {
        name: 'Pastel & Gold',
        note: 'Balloon tunnels and arches in blush, mint and gold',
        media: photo('themes/pastel-gold.jpg'),
        alt: 'A pastel and gold balloon arch leading to a Happy Birthday backdrop',
        palette: ['#f4c2c0', '#e98b86', '#9fd3d6', '#f3e19a', '#c9a45c'],
      },
      {
        name: 'Neon Glow',
        note: 'Lit balloon pillars and neon signs for evening parties',
        media: photo('themes/neon-glow.jpg'),
        alt: 'A hotel corridor lined with glowing balloon pillars',
        palette: ['#e96bc4', '#8f86dc', '#e8aa90', '#f6f0ec', '#e2bd78'],
      },
      {
        name: 'Barbie Glam',
        note: 'Hot pink tables, silhouettes and confetti',
        media: photo('themes/barbie-glam.jpg'),
        alt: 'A pink Barbie-themed table with a silhouette centrepiece',
        palette: ['#d6246e', '#e48fb0', '#b8e0e6', '#f5f2ef', '#8e3fa0'],
      },
      {
        name: 'Character Worlds',
        note: 'Life-size cut-outs of the characters they love',
        media: photo('themes/kpop-stars.jpg'),
        alt: 'A balloon arch entrance flanked by life-size K-pop character cut-outs',
        palette: ['#d9b62c', '#e86fa0', '#9b7fd6', '#c7b9ec', '#f0dbe9'],
      },
      {
        name: 'Frozen Wonderland',
        note: 'Icy blues, snowflakes and a Frozen-favourite entrance',
        media: photo('gallery/light-ring-arch.jpg', '50% 62%'),
        alt: 'A glowing ring-light arch flanked by Olaf, Elsa and Anna cut-outs in a marble hotel foyer',
        palette: ['#e1dfd8', '#b4cce8', '#8aa2cc', '#54688f', '#2d3a59'],
      },
      {
        name: 'Florals & Candlelight',
        note: 'Rose centrepieces, satin runners and candlelight for grown-up tables',
        media: photo('gallery/lakeside-table-florals.jpg', '50% 70%'),
        alt: 'A long table by a lake window with a peach satin runner, rose centrepieces and candles',
        palette: ['#f2a36e', '#f3b9ae', '#e0668c', '#f3ece0', '#f0c64a'],
      },
      {
        name: 'Fairy Garden',
        note: 'Blush and lilac blooms with a fairy of their own',
        media: photo('themes/fairy-garden.jpg'),
        alt: 'A blush and lilac balloon arch with a fairy cut-out and floral accents',
        palette: ['#d8c7ec', '#7b5aa6', '#f1c9d4', '#e2f1a3', '#ad7eb3'],
      },
      {
        name: 'Soft Play Wonderland',
        note: 'Ball pits, slides and padded play for the little ones',
        media: photo('themes/soft-play.jpg'),
        alt: 'A garden soft play area with a slide, see-saw and colourful play fencing',
        palette: ['#b2e1eb', '#a6cd79', '#e2bb24', '#658f45', '#d52a3c'],
      },
      {
        name: 'Floral Entrances',
        note: 'Flower carts and blooms that greet guests at the door',
        media: photo('themes/floral-entrances.jpg'),
        alt: 'A white flower cart with pink blossoms and balloons at a venue entrance',
        palette: ['#e8a0b4', '#b99ac2', '#f4eee6', '#9fb58a', '#c4a36a'],
      },
      {
        name: 'Pastel Inflatables',
        note: 'Bouncy castles and bubble houses in soft colours',
        media: photo('themes/inflatables.jpg'),
        alt: 'A pastel bouncy castle set up indoors',
        palette: ['#e9cfe6', '#f4e7a8', '#b9d6ec', '#f5c6cf', '#f6f3ee'],
      },
      {
        name: 'Match Day',
        note: 'Football goals and team colours for the sports-mad',
        media: photo('themes/football.jpg'),
        alt: 'A football-themed balloon display with a giant football and goal props',
        palette: ['#f3f2ee', '#9dbc64', '#13956d', '#336819', '#26282a'],
      },
    ],
  },

  services: {
    kicker: 'Our specialties',
    heading: { line1: 'Everything for a', line2: 'day worth remembering.' },
    intro: 'From intimate home set-ups to destination birthdays, we bring the imagination, the polish, and the calm.',
    items: [
      {
        title: 'Birthday Decorations',
        copy: 'Balloon installations, floral styling and photo-ready backdrops.',
        icon: 'cake',
        media: photo('gallery/white-arch-entrance.jpg'),
        tint: 'rose',
        photos: shots(
          'gallery/white-arch-entrance.jpg',
          'gallery/01-pastel-balloon-tunnel.jpg',
          'gallery/video/arch-reveal.jpg',
          'gallery/08-happy-birthday-backdrop.jpg',
          'gallery/02-neon-first-birthday.jpg',
          'gallery/led-photo-wall.jpg',
          'gallery/balloon-ceiling-home.jpg',
          'gallery/03-flower-cart-entrance.jpg',
        ),
      },
      {
        title: 'Theme Parties',
        copy: 'Fully art-directed worlds, built around what your child loves most.',
        icon: 'party',
        media: photo('gallery/kpop-arch-entrance.jpg'),
        tint: 'plum',
        photos: shots(
          'gallery/kpop-arch-entrance.jpg',
          'gallery/frozen-elsa-stage.jpg',
          'gallery/kpop-birthday-backdrop.jpg',
          'gallery/video/frozen-stage.jpg',
          'gallery/light-ring-arch.jpg',
          'gallery/07-barbie-table-styling.jpg',
          'gallery/character-centrepiece.jpg',
        ),
      },
      {
        title: 'Bubble House',
        copy: 'A giant balloon-filled dome the little ones can bounce and play inside.',
        icon: 'droplets',
        media: photo('gallery/10-bubble-house-balloons.jpg'),
        tint: 'rose',
        photos: shots('gallery/10-bubble-house-balloons.jpg', 'gallery/05-pink-bubble-house.jpg'),
      },
      {
        title: 'Soft Play Area',
        copy: 'Clean, cushioned play zones designed for your littlest guests.',
        icon: 'baby',
        media: photo('gallery/ball-pit.jpg'),
        tint: 'gold',
        photos: shots(
          'gallery/ball-pit.jpg',
          'gallery/rooftop-soft-play.jpg',
          'gallery/garden-soft-play.jpg',
          'gallery/09-soft-play-zone.jpg',
          'gallery/11-outdoor-soft-play.jpg',
          'gallery/06-pastel-bouncy-castle.jpg',
          'gallery/block-tower.jpg',
          'gallery/mascot-visit.jpg',
        ),
      },
      {
        title: 'Table & Floral Styling',
        copy: 'Fresh-rose centrepieces, satin runners and candlelight for lunches and grown-up birthdays.',
        icon: 'flower',
        media: photo('gallery/lakeside-centrepiece.jpg', '62% 60%'),
        tint: 'rose',
        photos: shots(
          'gallery/lakeside-centrepiece.jpg',
          'gallery/video/lakeside-centrepiece.jpg',
          'gallery/lakeside-table-wide.jpg',
          'gallery/lakeside-peach-runner.jpg',
          'gallery/lakeside-table-florals.jpg',
          'gallery/floral-table-detail.jpg',
        ),
      },
      {
        title: 'Return Gifts',
        copy: 'Curated and beautifully wrapped — never an afterthought.',
        icon: 'gift',
        media: photo('gallery/butterfly-centrepiece.jpg'),
        tint: 'gold',
        photos: [{ media: photo('gallery/butterfly-centrepiece.jpg'), alt: 'A pink balloon centrepiece wrapped in tulle with a gold butterfly' }],
      },
      {
        title: 'Tattoo Artist',
        copy: 'Temporary art for tiny arms, on-site through the celebration.',
        icon: 'brush',
        media: photo('gallery/12-tattoo-artist-corner.jpg'),
        tint: 'gold',
        photos: shots('gallery/12-tattoo-artist-corner.jpg'),
      },
      {
        title: 'Outstation Birthdays',
        copy: 'We travel, we build, you simply arrive and celebrate.',
        icon: 'plane',
        media: photo('themes/neon-glow.jpg'),
        tint: 'plum',
        photos: [{ media: photo('themes/neon-glow.jpg'), alt: 'A hotel corridor lined with glowing balloon pillars' }],
      },
      {
        title: 'Canvas Paintings',
        copy: 'Guided painting corners that double as take-home keepsakes.',
        icon: 'palette',
        media: photo('gallery/canvas-painting.jpg'),
        tint: 'plum',
        photos: shots('gallery/canvas-painting.jpg'),
      },
      {
        title: 'DIY Activities',
        copy: 'Hands-on craft stations that keep every age happily busy.',
        icon: 'scissors',
        media: photo('gallery/bead-and-nail-bar.jpg'),
        tint: 'rose',
        photos: shots('gallery/bead-and-nail-bar.jpg', 'gallery/nail-art.jpg', 'gallery/birthday-girl-nail-art.jpg'),
      },
    ],
  },

  gallery: {
    kicker: 'The lookbook',
    heading: { line1: 'Moments we', line2: 'have made.' },
    intro: 'Real set-ups from real celebrations — the decor, the play zones and the entertainment that fills the room.',
    initial: 9,
    categories: [
      { id: 'decor', label: 'Decor' },
      { id: 'tables', label: 'Tables & florals' },
      { id: 'play', label: 'Soft play' },
      { id: 'entertainment', label: 'Entertainment' },
    ],
    items: GALLERY_ITEMS,
  },

  showcase: {
    heading: { line1: 'The smallest details often make', line2: 'the biggest memories.' },
    attribution: '— The Dreams & Themes philosophy',
    media: photo('dreams-hero.jpg'),
  },

  reviews: {
    kicker: 'Kind words',
    heading: { line1: 'What families', line2: 'say afterwards.' },
    intro: 'The part we care about most — what parents tell us once the balloons come down.',
    // Real customer words only, added from /admin with the source they came from.
    items: [],
  },

  packages: {
    kicker: 'Ways to celebrate',
    heading: { line1: 'Simple packages.', line2: 'Everything included.' },
    intro: 'Every celebration is quoted to your space and guest list — these are the shapes we usually start from.',
    tiers: [
      {
        name: 'Essentials',
        price: '₹7,000',
        note: 'starting from',
        copy: 'A beautiful set-up for an intimate celebration at home.',
        includes: ['Balloon backdrop & garland', 'Name banner and signage', 'Cake table styling', 'Setup and clean-up'],
        featured: false,
      },
      {
        name: 'Signature',
        price: 'On request',
        note: 'tailored quote',
        copy: 'The full themed world, props and play — our most booked format.',
        includes: [
          'Custom theme design & palette',
          'Themed props and backdrop build',
          'Soft play corner for little ones',
          'Return gifts, styled and wrapped',
          'On-site team through the party',
        ],
        featured: true,
      },
      {
        name: 'Grand',
        price: 'On request',
        note: 'venues & outstation',
        copy: 'Large venue builds, activities and entertainment, start to finish.',
        includes: [
          'Full venue design & installation',
          'Soft play zone and activity stations',
          'Bubble show, tattoo artist, DIY corners',
          'Outstation travel and logistics',
        ],
        featured: false,
      },
    ],
  },

  faq: {
    kicker: 'Good to know',
    heading: { line1: 'Questions,', line2: 'answered.' },
    intro: 'Still wondering about something? Message us — we would rather answer a small question than have you guess.',
    items: [
      {
        q: 'How far in advance should we book?',
        a: 'Two to three weeks gives us room to design properly, source props and lock your date. Last-minute celebrations are often possible too — message us and we will tell you honestly what we can do.',
      },
      {
        q: 'Do you travel outside Pune?',
        a: 'Yes. We regularly style celebrations in Dehradun and Lucknow, and we take on outstation birthdays where we travel with the full set-up and team.',
      },
      {
        q: 'What is included in the soft play rental?',
        a: 'Clean, cushioned play zones sized for toddlers and young children — ball pits, soft blocks and play equipment, set up and sanitised before your guests arrive.',
      },
      {
        q: 'Do you style grown-up celebrations too?',
        a: 'Yes — birthday lunches, anniversaries and family dinners. Fresh-flower centrepieces, runners, candlelight and personal touches, at home or at your restaurant.',
      },
      {
        q: 'Can you work in our home, society hall or a venue?',
        a: 'All three. We have styled compact apartment set-ups, society clubhouses and full venue builds. Share photos of the space and we will design around it.',
      },
      {
        q: 'How does the process start?',
        a: 'Send us a message on WhatsApp with the date, the age and anything your child is loving right now. We come back with ideas and an estimate, then take it from there.',
      },
    ],
  },

  contact: {
    kicker: 'Let’s make it memorable',
    heading: { line1: 'Have a dream', line2: 'in mind?' },
    lede: 'Tell us a little about it. We’ll take it from there — thoughtfully, creatively, and with a little bit of magic.',
    signoff: 'Nikita, Pakhi & Neeta',
    occasions: ['Birthday', 'Theme party', 'Soft play rental', 'Table & floral styling', 'Corporate / school', 'Something else'],
    note: 'Opens WhatsApp with your details filled in. No forms, no waiting.',
  },

  sections: {
    ticker: true,
    process: true,
    themes: true,
    services: true,
    gallery: true,
    showcase: true,
    reviews: true,
    packages: true,
    faq: true,
    instagram: true,
  },
}
