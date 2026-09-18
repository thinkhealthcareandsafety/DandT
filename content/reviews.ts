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
 *
 * Each entry needs: quote (their words), name (how they want to be credited),
 * meta (occasion and area, e.g. "1st birthday · Kothrud"), rating (1-5).
 */
export const PLACEHOLDER_REVIEWS: Review[] = [
  {
    quote: 'Placeholder — paste a real customer’s words here about the decor and how the set-up looked on the day.',
    name: 'Customer name',
    meta: 'Occasion · Area',
    rating: 5,
  },
  {
    quote: 'Placeholder — paste a real customer’s words here about working with the team in the run-up.',
    name: 'Customer name',
    meta: 'Occasion · Area',
    rating: 5,
  },
  {
    quote: 'Placeholder — paste a real customer’s words here about the soft play area and the younger guests.',
    name: 'Customer name',
    meta: 'Occasion · Area',
    rating: 5,
  },
  {
    quote: 'Placeholder — paste a real customer’s words here about the theme and how it came together.',
    name: 'Customer name',
    meta: 'Occasion · Area',
    rating: 5,
  },
  {
    quote: 'Placeholder — paste a real customer’s words here about setup, clean-up and how the day ran.',
    name: 'Customer name',
    meta: 'Occasion · Area',
    rating: 5,
  },
  {
    quote: 'Placeholder — paste a real customer’s words here about the return gifts or activity corners.',
    name: 'Customer name',
    meta: 'Occasion · Area',
    rating: 5,
  },
]
