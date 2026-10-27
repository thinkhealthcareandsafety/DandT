import type { Review as OwnerReview } from '@/lib/content/types'

export type Review = Pick<OwnerReview, 'quote' | 'name' | 'meta' | 'rating'> & { source?: OwnerReview['source'] }

export type ReviewData = {
  reviews: Review[]
  /** Only ever from Google — the site never shows a star average it can't source. */
  average: number | null
  total: number | null
}

type PlacesReview = {
  text?: { text?: string }
  originalText?: { text?: string }
  authorAttribution?: { displayName?: string }
  rating?: number
  relativePublishTimeDescription?: string
}

type PlacesResponse = {
  rating?: number
  userRatingCount?: number
  reviews?: PlacesReview[]
}

async function fetchGoogleReviews(): Promise<ReviewData | null> {
  const key = process.env.GOOGLE_PLACES_API_KEY
  const placeId = process.env.GOOGLE_PLACE_ID
  if (!key || !placeId) return null

  try {
    const res = await fetch(`https://places.googleapis.com/v1/places/${placeId}`, {
      headers: {
        'X-Goog-Api-Key': key,
        'X-Goog-FieldMask': 'rating,userRatingCount,reviews',
      },
      next: { revalidate: 21600 },
    })
    if (!res.ok) return null

    const data = (await res.json()) as PlacesResponse
    const reviews = (data.reviews ?? [])
      .map((review) => ({
        quote: review.text?.text ?? review.originalText?.text ?? '',
        name: review.authorAttribution?.displayName ?? 'Google reviewer',
        meta: review.relativePublishTimeDescription ?? 'Google review',
        rating: review.rating ?? 5,
        source: 'google' as const,
      }))
      .filter((review) => review.quote.length > 0)

    if (!reviews.length) return null

    return {
      reviews,
      average: data.rating ?? null,
      total: data.userRatingCount ?? null,
    }
  } catch {
    return null
  }
}

/**
 * Live Google reviews (when connected) followed by the real customer words the owners added in
 * the admin. Development shows labelled placeholders when there are none, to design the layout;
 * production never does — the section simply hides.
 */
export async function getReviews(ownerReviews: OwnerReview[]): Promise<ReviewData> {
  const google = await fetchGoogleReviews()
  const owners = ownerReviews.filter((review) => review.quote.trim() && review.name.trim())
  const reviews = [...(google?.reviews ?? []), ...owners]

  if (!reviews.length && process.env.NODE_ENV !== 'production') {
    const { PLACEHOLDER_REVIEWS } = await import('@/content/reviews')
    return { reviews: PLACEHOLDER_REVIEWS.filter(isPlaceholder), average: null, total: null }
  }

  return { reviews, average: google?.average ?? null, total: google?.total ?? null }
}

function isPlaceholder(review: Review) {
  return review.quote.startsWith('Placeholder') || review.name === 'Customer name'
}
