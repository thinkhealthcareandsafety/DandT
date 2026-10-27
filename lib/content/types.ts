/**
 * Everything on the site that the owners can change from /admin. The site renders straight from
 * this document; content/defaults.ts holds the version that ships with the code.
 */

/** A photo, or a looping film when `video` is set (`src` is then its poster frame). */
export type Media = {
  src: string
  width: number
  height: number
  /** A tiny data-URL preview the photo fades in from. */
  blur?: string
  video?: string
  /** CSS object-position — the point of the photo that stays in frame when it's cropped. */
  focus?: string
}

/** An item in the admin's media library. Uploaded items can be deleted; ones shipped in /public can't. */
export type Asset = Media & {
  id: string
  name: string
  uploadedAt?: string
  /** Storage key for uploads, used to delete the file (and its poster) when the asset is removed. */
  keys?: string[]
  size?: number
}

/** A two-line section heading; the second line is set in italic plum. */
export type Heading = { line1: string; line2: string }

export type SectionHead = { kicker: string; heading: Heading; intro: string }

export type Contact = { name: string; number: string; role: string }

export type HeroPin = { media: Media; alt: string; caption: string }

export type Theme = { name: string; note: string; media: Media; alt: string; palette: string[] }

export const SERVICE_ICONS = [
  'cake',
  'party',
  'droplets',
  'baby',
  'gift',
  'brush',
  'plane',
  'palette',
  'scissors',
  'flower',
  'utensils',
  'sparkles',
  'camera',
  'music',
  'heart',
  'star',
] as const
export type ServiceIcon = (typeof SERVICE_ICONS)[number]

/** A photo (or film) with its description, for screen readers and the full-screen viewer. */
export type Shot = { media: Media; alt: string }

export type Service = {
  title: string
  copy: string
  icon: ServiceIcon
  /** The card's cover photo. */
  media?: Media
  tint: 'rose' | 'gold' | 'plum'
  /** Real photos of this service, shown when a family taps the card. */
  photos: Shot[]
}

export type GalleryCategory = { id: string; label: string }

export type GalleryItem = { media: Media; title: string; alt: string; category: string }

export type Review = {
  quote: string
  name: string
  meta: string
  rating: number
  /** Where the words came from, so the owners can always point to the original. */
  source: 'google' | 'whatsapp' | 'instagram' | 'email' | 'in-person'
}

export type Tier = {
  name: string
  price: string
  note: string
  copy: string
  includes: string[]
  featured: boolean
}

export type Faq = { q: string; a: string }

export const SECTION_IDS = [
  'ticker',
  'process',
  'themes',
  'services',
  'gallery',
  'showcase',
  'reviews',
  'packages',
  'faq',
  'instagram',
] as const
export type SectionId = (typeof SECTION_IDS)[number]

export type SiteContent = {
  business: {
    name: string
    email: string
    instagram: string
    /** The WhatsApp number every "Chat"/"Send on WhatsApp" button opens, ten digits. */
    whatsapp: string
    cities: string[]
    contacts: Contact[]
    announcement: string
    footerLine: string
  }
  seo: { title: string; description: string; image?: Media }
  hero: {
    eyebrow: string
    titleLine1: string
    titleAccent: string
    lede: string
    primaryCta: string
    secondaryCta: string
    trust: { title: string; copy: string }[]
    /** Exactly four: the moodboard's layout is fixed, the photos and captions are not. */
    pins: HeroPin[]
    boardNote: string
    stamp: string
  }
  ticker: string[]
  process: { kicker: string; heading: Heading; steps: { title: string; copy: string }[] }
  themes: SectionHead & { items: Theme[] }
  services: SectionHead & { items: Service[] }
  gallery: SectionHead & { categories: GalleryCategory[]; items: GalleryItem[]; initial: number }
  showcase: { heading: Heading; attribution: string; media: Media }
  reviews: SectionHead & { items: Review[] }
  packages: SectionHead & { tiers: Tier[] }
  faq: SectionHead & { items: Faq[] }
  contact: {
    kicker: string
    heading: Heading
    lede: string
    signoff: string
    occasions: string[]
    note: string
  }
  sections: Record<SectionId, boolean>
}

export type ContentKey = keyof SiteContent

/** The stored document: the content plus when (and by whom) each part was last saved. */
export type StoredContent = {
  content: Partial<SiteContent>
  edits: Partial<Record<ContentKey, { at: string; by: string }>>
  /** Photos and films the owners uploaded. */
  library: Asset[]
}
