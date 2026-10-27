/** A wa.me link to a ten-digit Indian number, optionally with a message typed in for them. */
export function whatsappLink(number: string, message?: string) {
  const digits = number.replace(/\D/g, '').slice(-10)
  return `https://wa.me/91${digits}${message ? `?text=${encodeURIComponent(message)}` : ''}`
}

/** "9559507878" → "+91 95595 07878" */
export function displayPhone(number: string) {
  const digits = number.replace(/\D/g, '').slice(-10)
  return `+91 ${digits.slice(0, 5)} ${digits.slice(5)}`
}

export function telLink(number: string) {
  return `tel:+91${number.replace(/\D/g, '').slice(-10)}`
}

export function instagramUrl(handle: string) {
  return `https://www.instagram.com/${handle.replace(/^@/, '').trim()}/`
}
