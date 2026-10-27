import type {
  ContentKey,
  Faq,
  GalleryItem,
  Media,
  Review,
  Service,
  Shot,
  SiteContent,
  Theme,
  Tier,
} from '@/lib/content/types'
import { SECTION_IDS, SERVICE_ICONS } from '@/lib/content/types'

/**
 * Describes every editable part of the site as form fields. One generic editor renders all of
 * them, so each part gets the same controls (media picker, focal point, reordering, undo).
 */

type Base = { key: string; label: string; help?: string }

export type Field =
  | (Base & { kind: 'text'; placeholder?: string; max?: number })
  | (Base & { kind: 'textarea'; rows?: number; max?: number })
  | (Base & { kind: 'heading' })
  | (Base & { kind: 'media'; optional?: boolean; films?: boolean })
  | (Base & { kind: 'select'; options: { value: string; label: string }[] })
  | (Base & { kind: 'toggle' })
  | (Base & { kind: 'number'; min: number; max: number })
  | (Base & { kind: 'phone' })
  | (Base & { kind: 'color' })
  | (Base & { kind: 'colors' })
  | (Base & { kind: 'strings'; itemLabel: string; placeholder?: string })
  | (Base & {
      kind: 'list'
      itemLabel: string
      fields: Field[]
      create: () => unknown
      /** What the collapsed row shows. */
      summary: (item: never) => { title: string; sub?: string; media?: Media }
      min?: number
      max?: number
      /** Lets owners drop many photos at once, making one item per photo. */
      bulk?: (media: Media, name: string) => unknown
      /** Show items as a photo grid rather than rows. */
      grid?: boolean
    })
  | { kind: 'group'; key?: undefined; label: string; help?: string; fields: Field[] }

export type PartGroup = 'Homepage' | 'Business'

export type Part = {
  key: ContentKey
  label: string
  blurb: string
  group: PartGroup
  /** Where on the homepage this part appears, for the preview pane. */
  anchor?: string
  fields: Field[]
}

const blankMedia: Media = { src: '', width: 0, height: 0 }

const sectionHead: Field[] = [
  { kind: 'text', key: 'kicker', label: 'Small label above the heading', max: 60 },
  {
    kind: 'heading',
    key: 'heading',
    label: 'Heading',
    help: 'The second line is set in italic plum.',
  },
  { kind: 'textarea', key: 'intro', label: 'Introduction', rows: 3, max: 400 },
]

const mediaSummary = (title: string, sub?: string, media?: Media) => ({ title: title || 'Untitled', sub, media })

export const PARTS: Part[] = [
  {
    key: 'hero',
    label: 'Hero & moodboard',
    blurb: 'The first screen: headline, buttons and the four pinned photos.',
    group: 'Homepage',
    anchor: 'top',
    fields: [
      { kind: 'text', key: 'eyebrow', label: 'Line above the headline', max: 60 },
      { kind: 'text', key: 'titleLine1', label: 'Headline', max: 40 },
      { kind: 'text', key: 'titleAccent', label: 'Headline, handwritten-underlined word', max: 24 },
      { kind: 'textarea', key: 'lede', label: 'Introduction', rows: 3, max: 260 },
      {
        kind: 'group',
        label: 'Buttons',
        fields: [
          { kind: 'text', key: 'primaryCta', label: 'Main button', max: 28 },
          { kind: 'text', key: 'secondaryCta', label: 'Link to the gallery', max: 32 },
        ],
      },
      {
        kind: 'list',
        key: 'trust',
        label: 'Promises under the buttons',
        itemLabel: 'promise',
        max: 4,
        create: () => ({ title: '', copy: '' }),
        summary: (item: { title: string; copy: string }) => ({ title: item.title || 'New promise', sub: item.copy }),
        fields: [
          { kind: 'text', key: 'title', label: 'Promise', max: 40 },
          { kind: 'text', key: 'copy', label: 'Detail', max: 50 },
        ],
      },
      {
        kind: 'list',
        key: 'pins',
        label: 'Moodboard photos',
        help: 'Always four — the board’s layout is designed for four. Use the focal point to keep faces and centrepieces in frame.',
        itemLabel: 'photo',
        min: 4,
        max: 4,
        grid: true,
        create: () => ({ media: blankMedia, alt: '', caption: '' }),
        summary: (item: { media: Media; caption: string }) => mediaSummary(item.caption, undefined, item.media),
        fields: [
          { kind: 'media', key: 'media', label: 'Photo' },
          { kind: 'text', key: 'caption', label: 'Handwritten caption', max: 32 },
          { kind: 'text', key: 'alt', label: 'Description for screen readers', max: 160 },
        ],
      },
      { kind: 'text', key: 'boardNote', label: 'Handwritten note on the board', max: 60 },
      { kind: 'text', key: 'stamp', label: 'Round stamp text', help: 'The last two words are set in italic.', max: 32 },
    ],
  },
  {
    key: 'gallery',
    label: 'Gallery',
    blurb: 'The lookbook of real set-ups, with its filters.',
    group: 'Homepage',
    anchor: 'gallery',
    fields: [
      ...sectionHead,
      {
        kind: 'number',
        key: 'initial',
        label: 'Photos shown before “Show all”',
        help: 'A multiple of three keeps the rows even.',
        min: 3,
        max: 60,
      },
      {
        kind: 'list',
        key: 'categories',
        label: 'Filters',
        itemLabel: 'filter',
        create: () => ({ id: `filter-${Date.now().toString(36)}`, label: '' }),
        summary: (item: { label: string }) => ({ title: item.label || 'New filter' }),
        fields: [{ kind: 'text', key: 'label', label: 'Name', max: 24 }],
      },
      {
        kind: 'list',
        key: 'items',
        label: 'Photos & films',
        help: 'Drag to reorder — the first one is shown large. Add many at once with “Upload photos”.',
        itemLabel: 'photo',
        grid: true,
        create: () => ({ media: blankMedia, title: '', alt: '', category: 'decor' }),
        bulk: (media, name) => ({ media, title: name, alt: name, category: 'decor' }) satisfies GalleryItem,
        summary: (item: GalleryItem) => mediaSummary(item.title, item.category, item.media),
        fields: [
          { kind: 'media', key: 'media', label: 'Photo or film', films: true },
          { kind: 'text', key: 'title', label: 'Title on the tile', max: 40 },
          { kind: 'select', key: 'category', label: 'Filter', options: [] },
          { kind: 'text', key: 'alt', label: 'Description (shown in the full-screen view)', max: 180 },
        ],
      },
    ],
  },
  {
    key: 'themes',
    label: 'Themes',
    blurb: 'The list of worlds you build, each with a photo and palette.',
    group: 'Homepage',
    anchor: 'themes',
    fields: [
      ...sectionHead,
      {
        kind: 'list',
        key: 'items',
        label: 'Themes',
        itemLabel: 'theme',
        create: () => ({ name: '', note: '', media: blankMedia, alt: '', palette: ['#f4c2c0', '#c9a45c'] }),
        bulk: (media, name) => ({ name, note: '', media, alt: name, palette: [] }) satisfies Theme,
        summary: (item: Theme) => mediaSummary(item.name, item.note, item.media),
        fields: [
          { kind: 'text', key: 'name', label: 'Name', max: 32 },
          { kind: 'text', key: 'note', label: 'One-line description', max: 80 },
          { kind: 'media', key: 'media', label: 'Photo' },
          { kind: 'colors', key: 'palette', label: 'Palette', help: 'Pick colours from the balloons and fabrics in the photo.' },
          { kind: 'text', key: 'alt', label: 'Description for screen readers', max: 160 },
        ],
      },
    ],
  },
  {
    key: 'services',
    label: 'Services',
    blurb: 'Everything you offer, as photo cards — each opens its own photos.',
    group: 'Homepage',
    anchor: 'services',
    fields: [
      ...sectionHead,
      {
        kind: 'list',
        key: 'items',
        label: 'Services',
        itemLabel: 'service',
        create: () => ({ title: '', copy: '', icon: 'sparkles', tint: 'rose', photos: [] }),
        summary: (item: Service) => mediaSummary(item.title, item.copy, item.media),
        fields: [
          { kind: 'text', key: 'title', label: 'Name', max: 32 },
          { kind: 'textarea', key: 'copy', label: 'Description', rows: 2, max: 110 },
          {
            kind: 'media',
            key: 'media',
            label: 'Photo',
            optional: true,
            help: 'The card’s cover. Leave empty to show a tinted card with the icon instead.',
          },
          {
            kind: 'list',
            key: 'photos',
            label: 'Photos that open when the card is tapped',
            help: 'Real photos of this service. With none, the card goes straight to the enquiry form.',
            itemLabel: 'photo',
            grid: true,
            create: () => ({ media: blankMedia, alt: '' }),
            bulk: (media, name) => ({ media, alt: name }) satisfies Shot,
            summary: (item: Shot) => mediaSummary(item.alt, undefined, item.media),
            fields: [
              { kind: 'media', key: 'media', label: 'Photo or film', films: true },
              { kind: 'text', key: 'alt', label: 'Description (shown under the photo)', max: 180 },
            ],
          },
          {
            kind: 'select',
            key: 'icon',
            label: 'Icon',
            options: SERVICE_ICONS.map((icon) => ({ value: icon, label: icon[0].toUpperCase() + icon.slice(1) })),
          },
          {
            kind: 'select',
            key: 'tint',
            label: 'Card colour without a photo',
            options: [
              { value: 'rose', label: 'Rose' },
              { value: 'gold', label: 'Gold' },
              { value: 'plum', label: 'Plum' },
            ],
          },
        ],
      },
    ],
  },
  {
    key: 'packages',
    label: 'Packages',
    blurb: 'Your starting packages and what each includes.',
    group: 'Homepage',
    anchor: 'packages',
    fields: [
      ...sectionHead,
      {
        kind: 'list',
        key: 'tiers',
        label: 'Packages',
        itemLabel: 'package',
        max: 4,
        create: () => ({ name: '', price: 'On request', note: '', copy: '', includes: [], featured: false }),
        summary: (item: Tier) => ({ title: item.name || 'New package', sub: `${item.note} ${item.price}`.trim() }),
        fields: [
          { kind: 'text', key: 'name', label: 'Name', max: 24 },
          { kind: 'text', key: 'price', label: 'Price', placeholder: '₹7,000 or On request', max: 24 },
          { kind: 'text', key: 'note', label: 'Small line above the price', placeholder: 'starting from', max: 32 },
          { kind: 'textarea', key: 'copy', label: 'Description', rows: 2, max: 140 },
          { kind: 'strings', key: 'includes', label: 'What’s included', itemLabel: 'item' },
          { kind: 'toggle', key: 'featured', label: 'Highlight as “Most loved”' },
        ],
      },
    ],
  },
  {
    key: 'reviews',
    label: 'Reviews',
    blurb: 'Real words from real families.',
    group: 'Homepage',
    anchor: 'reviews',
    fields: [
      ...sectionHead,
      {
        kind: 'list',
        key: 'items',
        label: 'Reviews',
        help: 'Only a customer’s own words, shared with their permission — copy them from Google, WhatsApp or Instagram. Inventing or rewriting reviews is illegal in India (CCPA 2022 guidelines). If Google reviews are connected, they appear first.',
        itemLabel: 'review',
        create: () => ({ quote: '', name: '', meta: '', rating: 5, source: 'whatsapp' }),
        summary: (item: Review) => ({ title: item.name || 'New review', sub: item.quote }),
        fields: [
          { kind: 'textarea', key: 'quote', label: 'Their words, exactly', rows: 4, max: 600 },
          { kind: 'text', key: 'name', label: 'Name, as they want to be credited', max: 40 },
          { kind: 'text', key: 'meta', label: 'Occasion · area', placeholder: '1st birthday · Kothrud', max: 50 },
          { kind: 'number', key: 'rating', label: 'Stars', min: 1, max: 5 },
          {
            kind: 'select',
            key: 'source',
            label: 'Where they said it',
            options: [
              { value: 'google', label: 'Google' },
              { value: 'whatsapp', label: 'WhatsApp' },
              { value: 'instagram', label: 'Instagram' },
              { value: 'email', label: 'Email' },
              { value: 'in-person', label: 'In person (written down with permission)' },
            ],
          },
        ],
      },
    ],
  },
  {
    key: 'faq',
    label: 'Questions',
    blurb: 'Answers to what families ask most. Also shown to Google.',
    group: 'Homepage',
    anchor: 'faq',
    fields: [
      ...sectionHead,
      {
        kind: 'list',
        key: 'items',
        label: 'Questions',
        itemLabel: 'question',
        create: () => ({ q: '', a: '' }),
        summary: (item: Faq) => ({ title: item.q || 'New question', sub: item.a }),
        fields: [
          { kind: 'text', key: 'q', label: 'Question', max: 120 },
          { kind: 'textarea', key: 'a', label: 'Answer', rows: 4, max: 700 },
        ],
      },
    ],
  },
  {
    key: 'process',
    label: 'How it works',
    blurb: 'The four steps from first message to party day.',
    group: 'Homepage',
    anchor: 'process',
    fields: [
      { kind: 'text', key: 'kicker', label: 'Small label above the heading', max: 60 },
      { kind: 'heading', key: 'heading', label: 'Heading' },
      {
        kind: 'list',
        key: 'steps',
        label: 'Steps',
        itemLabel: 'step',
        min: 2,
        max: 6,
        create: () => ({ title: '', copy: '' }),
        summary: (item: { title: string; copy: string }) => ({ title: item.title || 'New step', sub: item.copy }),
        fields: [
          { kind: 'text', key: 'title', label: 'Step', max: 32 },
          { kind: 'textarea', key: 'copy', label: 'Description', rows: 2, max: 140 },
        ],
      },
    ],
  },
  {
    key: 'showcase',
    label: 'Quote band',
    blurb: 'The full-width quote over a photo.',
    group: 'Homepage',
    fields: [
      { kind: 'heading', key: 'heading', label: 'Quote' },
      { kind: 'text', key: 'attribution', label: 'Signed', max: 60 },
      { kind: 'media', key: 'media', label: 'Background photo', help: 'Shown in black and white behind a dark veil.' },
    ],
  },
  {
    key: 'ticker',
    label: 'Scrolling ticker',
    blurb: 'The line of services that scrolls under the hero.',
    group: 'Homepage',
    fields: [{ kind: 'strings', key: '', label: 'Words', itemLabel: 'word' }],
  },
  {
    key: 'contact',
    label: 'Enquiry form',
    blurb: 'The WhatsApp enquiry form and your sign-off.',
    group: 'Homepage',
    anchor: 'contact',
    fields: [
      { kind: 'text', key: 'kicker', label: 'Small label above the heading', max: 60 },
      { kind: 'heading', key: 'heading', label: 'Heading' },
      { kind: 'textarea', key: 'lede', label: 'Introduction', rows: 3, max: 240 },
      { kind: 'text', key: 'signoff', label: 'Handwritten sign-off', max: 60 },
      { kind: 'strings', key: 'occasions', label: 'Occasions in the dropdown', itemLabel: 'occasion' },
      { kind: 'text', key: 'note', label: 'Small print under the button', max: 100 },
    ],
  },
  {
    key: 'sections',
    label: 'Show & hide sections',
    blurb: 'Turn whole sections of the homepage on or off.',
    group: 'Homepage',
    fields: SECTION_IDS.map((id) => ({ kind: 'toggle' as const, key: id, label: SECTION_LABELS()[id] })),
  },
  {
    key: 'business',
    label: 'Business & contacts',
    blurb: 'Phone numbers, WhatsApp, email, cities and the announcement bar.',
    group: 'Business',
    fields: [
      {
        kind: 'phone',
        key: 'whatsapp',
        label: 'WhatsApp number for enquiries',
        help: 'Every “Chat on WhatsApp” and “Send on WhatsApp” button opens this number.',
      },
      {
        kind: 'list',
        key: 'contacts',
        label: 'Team on the contact card',
        itemLabel: 'person',
        create: () => ({ name: '', number: '', role: 'Celebration curator' }),
        summary: (item: { name: string; number: string }) => ({ title: item.name || 'New person', sub: item.number }),
        fields: [
          { kind: 'text', key: 'name', label: 'Name', max: 30 },
          { kind: 'phone', key: 'number', label: 'Phone' },
          { kind: 'text', key: 'role', label: 'Role', max: 40 },
        ],
      },
      { kind: 'text', key: 'email', label: 'Email', max: 80 },
      { kind: 'text', key: 'instagram', label: 'Instagram username', placeholder: 'dreamsandthemespune', max: 40 },
      { kind: 'strings', key: 'cities', label: 'Cities you serve', itemLabel: 'city' },
      { kind: 'text', key: 'announcement', label: 'Announcement bar', max: 90 },
      { kind: 'text', key: 'footerLine', label: 'Footer line', max: 80 },
    ],
  },
  {
    key: 'seo',
    label: 'Google & sharing',
    blurb: 'How the site appears in Google and when a link is shared on WhatsApp.',
    group: 'Business',
    fields: [
      { kind: 'text', key: 'title', label: 'Page title', help: 'Shown as the headline in Google results.', max: 70 },
      { kind: 'textarea', key: 'description', label: 'Description', rows: 3, help: 'The grey text under it. Aim for 150 characters.', max: 200 },
      {
        kind: 'media',
        key: 'image',
        label: 'Image shown when the link is shared',
        optional: true,
        help: 'Leave empty to keep the current one. A wide photo works best.',
      },
    ],
  },
]

/** Names for the homepage's sections, in page order. A function so it can be used above. */
function SECTION_LABELS(): Record<(typeof SECTION_IDS)[number], string> {
  return {
    ticker: 'Scrolling ticker',
    process: 'How it works',
    themes: 'Themes',
    services: 'Services',
    gallery: 'Gallery',
    showcase: 'Quote band',
    reviews: 'Reviews (hidden anyway until there are some)',
    packages: 'Packages',
    faq: 'Questions',
    instagram: 'Instagram band',
  }
}

export function partFor(key: string): Part | undefined {
  return PARTS.find((part) => part.key === key)
}

/** Fields whose options come from the content itself, e.g. the gallery's filters. */
export function withLiveOptions(part: Part, value: SiteContent[ContentKey]): Field[] {
  if (part.key !== 'gallery') return part.fields
  const categories = (value as SiteContent['gallery']).categories ?? []
  return part.fields.map((field) =>
    field.kind === 'list' && field.key === 'items'
      ? {
          ...field,
          fields: field.fields.map((f) =>
            f.kind === 'select' && f.key === 'category'
              ? { ...f, options: categories.map((c) => ({ value: c.id, label: c.label || c.id })) }
              : f,
          ),
        }
      : field,
  )
}
