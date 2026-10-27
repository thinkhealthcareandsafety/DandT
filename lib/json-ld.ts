/**
 * JSON for a <script type="application/ld+json"> tag. Escapes "<" so text the owners type in the
 * admin (an FAQ answer containing "</script>", say) can never end the tag early.
 */
export function jsonLd(value: unknown) {
  return JSON.stringify(value).replace(/</g, '\u003c')
}
