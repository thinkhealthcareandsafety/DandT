import type { Review } from '@/lib/reviews'

/**
 * PLACEHOLDER CONTENT — NOT REAL REVIEWS. Shown in development only, so the reviews layout can be
 * designed before real ones exist; production never renders these.
 *
 * Real reviews are added by the owners in /admin → Reviews, each with where the customer said it,
 * or pulled live from Google by setting GOOGLE_PLACES_API_KEY and GOOGLE_PLACE_ID. Publishing
 * invented reviews as genuine is prohibited in India under the CCPA Guidelines for Prevention of
 * Misleading Advertisements (2022) and BIS IS 19000:2022.
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
