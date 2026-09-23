/**
 * The lookbook, in display order. Files live in public/gallery/. Every photo here is from a
 * real Dreams & Themes event.
 *
 * Privacy: no photo may show a child's name (party signage, name letters, backdrops). Crop the
 * name out or leave the photo out. The alt text never names a child either.
 */
export type GalleryCategory = 'decor' | 'play' | 'entertainment'

export type GalleryEntry = {
  file: string
  /** Short label shown on the tile; the full `alt` appears in the lightbox. */
  title: string
  alt: string
  category: GalleryCategory
  /** A looping muted clip; `file` is then the poster frame and this is the video. */
  video?: string
}

export const GALLERY_CATEGORIES: { id: GalleryCategory; label: string }[] = [
  { id: 'decor', label: 'Decor' },
  { id: 'play', label: 'Soft play' },
  { id: 'entertainment', label: 'Entertainment' },
]

export const GALLERY: GalleryEntry[] = [
  { file: 'frozen-elsa-stage.jpg', title: 'Frozen stage', alt: 'A Frozen stage with Elsa and Anna cut-outs, a lit number five and a snow-white floor', category: 'decor' },
  { file: 'video/arch-reveal.jpg', title: 'Ballroom entrance arch', video: 'video/arch-reveal.mp4', alt: 'A white and ice-blue balloon arch at a hotel ballroom door, lit by glowing butterfly lamps', category: 'decor' },
  { file: 'magician-silks.jpg', title: 'Magic show', alt: 'A magician in a top hat pulling rainbow silks from a newspaper as the birthday girl watches', category: 'entertainment' },
  { file: '01-pastel-balloon-tunnel.jpg', title: 'Pastel balloon tunnel', alt: 'A pastel and gold balloon tunnel leading to a Happy Birthday backdrop', category: 'decor' },
  { file: 'rooftop-soft-play.jpg', title: 'Rooftop soft play', alt: 'A rooftop soft play zone with slides, see-saws and colourful fencing under festoon lights', category: 'play' },
  { file: 'kpop-arch-entrance.jpg', title: 'K-pop arch entrance', alt: 'A pink, purple and silver balloon arch at a ballroom entrance, flanked by life-size K-pop cut-outs', category: 'decor' },
  { file: 'kpop-birthday-backdrop.jpg', title: 'K-pop backdrop', alt: 'A K-pop backdrop framed by pink, purple and gold balloons with a gold number nine', category: 'decor' },
  { file: 'nail-art.jpg', title: 'Nail-art bar', alt: 'A nail artist painting a young guest’s nails at a party table', category: 'entertainment' },
  { file: 'white-arch-entrance.jpg', title: 'Ice-blue arch', alt: 'A silver, white and blue balloon arch framing a ballroom entrance', category: 'decor' },
  { file: 'ball-pit.jpg', title: 'Ball pit', alt: 'A ball pit filled with bright balls inside a red and yellow play fence', category: 'play' },
  { file: 'kpop-dance-performance.jpg', title: 'Stage performance', alt: 'Four young performers dancing on stage in front of a glittering K-pop backdrop', category: 'entertainment' },
  { file: 'video/frozen-stage.jpg', title: 'Frozen stage, in motion', video: 'video/frozen-stage.mp4', alt: 'A slow pan across a Frozen stage with balloon arches and a Happy Birthday arch', category: 'decor' },
  { file: 'caricature-artists.jpg', title: 'Caricature artists', alt: 'Two caricature artists sketching guests under a striped canopy on the lawn', category: 'entertainment' },
  { file: 'light-ring-arch.jpg', title: 'Ring-light arch', alt: 'A glowing ring-light arch with Frozen characters at a marble hotel foyer', category: 'decor' },
  { file: 'garden-soft-play.jpg', title: 'Garden soft play', alt: 'A garden soft play area with play fencing, ride-on toys and a trampoline', category: 'play' },
  { file: 'led-photo-wall.jpg', title: 'LED photo wall', alt: 'A glittering LED sequin photo wall flanked by a balloon column and character cut-outs', category: 'decor' },
  { file: '02-neon-first-birthday.jpg', title: 'Neon first birthday', alt: 'A lilac and yellow balloon ring with a neon Happy Birthday sign for a first birthday', category: 'decor' },
  { file: 'giant-dartboard.jpg', title: 'Giant dartboard', alt: 'A giant inflatable dartboard game set up on a lawn', category: 'entertainment' },
  { file: 'character-centrepiece.jpg', title: 'Table centrepiece', alt: 'A honeycomb table centrepiece with a character topper, scattered with paper hearts', category: 'decor' },
  { file: 'block-tower.jpg', title: 'Giant building blocks', alt: 'A child standing beside a tower of giant building blocks taller than them', category: 'play' },
  { file: 'magic-wand-trick.jpg', title: 'Magic wand trick', alt: 'A magician guiding a young guest through a wand trick on a sparkling star-lit stage', category: 'entertainment' },
  { file: 'canvas-painting.jpg', title: 'Canvas painting', alt: 'Pre-sketched penguin canvases ready for a painting activity', category: 'entertainment' },
  { file: 'balloon-ceiling-home.jpg', title: 'Balloon ceiling at home', alt: 'A living room ceiling covered in pink balloons with ribbon streamers', category: 'decor' },
  { file: 'mascot-visit.jpg', title: 'Mascot visit', alt: 'A Minnie Mouse mascot visiting children at an indoor soft play area', category: 'play' },
  { file: '03-flower-cart-entrance.jpg', title: 'Flower cart entrance', alt: 'A white flower cart with pink blossoms at a venue entrance', category: 'decor' },
  { file: 'bead-and-nail-bar.jpg', title: 'Beads and nail paint', alt: 'Children at a bead jewellery and nail paint station', category: 'entertainment' },
  { file: 'floral-table-detail.jpg', title: 'Floral table detail', alt: 'A single gladiolus stem in a glass vase, with a balloon arch soft-focused behind', category: 'decor' },
  { file: '05-pink-bubble-house.jpg', title: 'Balloon bubble house', alt: 'A clear bubble house filled with pink and silver balloons', category: 'play' },
  { file: '07-barbie-table-styling.jpg', title: 'Barbie table', alt: 'A hot pink Barbie table with a silhouette centrepiece', category: 'decor' },
  { file: '12-tattoo-artist-corner.jpg', title: 'Tattoo artist', alt: 'A temporary tattoo artist’s corner with a hand-lettered sign', category: 'entertainment' },
  { file: 'birthday-girl-nail-art.jpg', title: 'Nail art, up close', alt: 'A young guest in a tiara having her nails painted at a table set with polish bottles', category: 'entertainment' },
  { file: '06-pastel-bouncy-castle.jpg', title: 'Pastel bouncy castle', alt: 'A pastel bouncy castle with a slide, set up indoors', category: 'play' },
  { file: '08-happy-birthday-backdrop.jpg', title: 'Neon backdrop', alt: 'A peach and gold balloon garland around a neon Happy Birthday backdrop', category: 'decor' },
  { file: '09-soft-play-zone.jpg', title: 'Indoor soft play', alt: 'An indoor soft play zone with a slide, rocker and ball pit', category: 'play' },
  { file: '10-bubble-house-balloons.jpg', title: 'Bubble house play', alt: 'Children playing with balloons inside a clear bubble house', category: 'play' },
  { file: '11-outdoor-soft-play.jpg', title: 'Outdoor soft play', alt: 'An outdoor soft play set-up with foam mats, tunnels and a trampoline', category: 'play' },
]
