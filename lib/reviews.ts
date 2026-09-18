export type Review = {
  quote: string
  name: string
  meta: string
  rating: number
}

export type ReviewData = {
  reviews: Review[]
  average: number | null
  total: number | null
  source: 'google' | 'placeholder'
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
      }))
      .filter((review) => review.quote.length > 0)

    if (!reviews.length) return null

    return {
      reviews,
      average: data.rating ?? null,
      total: data.userRatingCount ?? null,
      source: 'google',
    }
  } catch {
    return null
  }
}

export async function getReviews(): Promise<ReviewData> {
  const google = await fetchGoogleReviews()
  if (google) return google

  const { PLACEHOLDER_REVIEWS } = await import('@/content/reviews')

  if (process.env.NODE_ENV === 'production') {
    console.warn(
      '[reviews] Serving placeholder reviews. Replace content/reviews.ts with real customer words, ' +
        'or set GOOGLE_PLACES_API_KEY and GOOGLE_PLACE_ID, before this site goes live.',
    )
  }

  return { reviews: PLACEHOLDER_REVIEWS, average: null, total: null, source: 'placeholder' }
}
