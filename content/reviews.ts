import type { Review } from '@/lib/reviews'

/**
 * PLACEHOLDER CONTENT — NOT REAL REVIEWS. DO NOT LAUNCH WITH THESE.
 *
 * These entries exist only so the layout can be designed and reviewed. Publishing invented
 * customer reviews as genuine is deceptive and is prohibited in India under the CCPA
 * Guidelines for Prevention of Misleading Advertisements (2022) and BIS IS 19000:2022.
 *
 * Replace every entry below with words a real customer actually wrote — from WhatsApp,
 * Instagram DMs or Google — with their permission. Or better: set GOOGLE_PLACES_API_KEY and
 * GOOGLE_PLACE_ID in .env and the section will pull live Google reviews instead of this file,
 * and this file stops being used at all.
 */
export const PLACEHOLDER_REVIEWS: Review[] = [
  {
    quote: 'Sample review text. Replace with a real customer’s own words about the set-up and the day.',
    name: 'Customer name',
    meta: 'Occasion · Area',
    rating: 5,
  },
  {
    quote: 'Sample review text. Replace with a real customer’s own words about the team on the day.',
    name: 'Customer name',
    meta: 'Occasion · Area',
    rating: 5,
  },
  {
    quote: 'Sample review text. Replace with a real customer’s own words about the soft play setup.',
    name: 'Customer name',
    meta: 'Occasion · Area',
    rating: 5,
  },
]
