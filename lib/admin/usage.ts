import type { ContentKey, SiteContent } from '@/lib/content/types'
import { PARTS } from './schema'

function contains(value: unknown, src: string): boolean {
  if (Array.isArray(value)) return value.some((item) => contains(item, src))
  if (value && typeof value === 'object') {
    const record = value as Record<string, unknown>
    if (record.src === src || record.video === src) return true
    return Object.values(record).some((child) => contains(child, src))
  }
  return false
}

/** The names of the parts of the site that show this photo or film. */
export function findUsages(content: SiteContent, src: string): string[] {
  return (Object.keys(content) as ContentKey[])
    .filter((key) => contains(content[key], src))
    .map((key) => PARTS.find((part) => part.key === key)?.label ?? key)
}
