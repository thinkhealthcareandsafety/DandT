import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { PartEditor } from '@/components/admin/part-editor'
import { partFor } from '@/lib/admin/schema'
import { loadStored, resolve } from '@/lib/content'

type Props = { params: Promise<{ part: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return { title: partFor((await params).part)?.label ?? 'Edit' }
}

export default async function EditPartPage({ params }: Props) {
  const part = partFor((await params).part)
  if (!part) notFound()

  // Read fresh, never from the site's cache: editing stale content would undo someone's changes.
  const { doc } = await loadStored()
  const content = resolve(doc.content)
  const edit = doc.edits[part.key] ?? null

  return (
    <PartEditor
      partKey={part.key}
      initialValue={content[part.key]}
      initialBaseAt={edit?.at ?? null}
      lastEdit={edit}
      customised={doc.content[part.key] !== undefined}
    />
  )
}
