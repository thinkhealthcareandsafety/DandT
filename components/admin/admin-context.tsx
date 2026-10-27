'use client'

import { Check, CircleAlert, Loader2, X } from 'lucide-react'
import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react'
import { addAssets } from '@/app/admin/actions'
import { isAcceptedFile, prepareAndUpload } from '@/lib/admin/upload-client'
import type { StoreMode } from '@/lib/content/store'
import type { Asset } from '@/lib/content/types'

type Toast = { id: number; tone: 'ok' | 'error'; text: string }
type Job = { id: number; name: string; progress: number; state: 'working' | 'done' | 'error'; error?: string }

type AdminContextValue = {
  mode: StoreMode
  library: Asset[]
  /** Uploads files, adds them to the library and resolves with the ones that made it. */
  uploadFiles: (files: File[]) => Promise<Asset[]>
  removeFromLibrary: (id: string) => void
  renameInLibrary: (id: string, name: string) => void
  toast: (text: string, tone?: Toast['tone']) => void
}

const AdminContext = createContext<AdminContextValue | null>(null)

export function useAdmin() {
  const value = useContext(AdminContext)
  if (!value) throw new Error('useAdmin must be used inside <AdminProvider>')
  return value
}

const PARALLEL = 3

export function AdminProvider({
  mode,
  initialLibrary,
  children,
}: {
  mode: StoreMode
  initialLibrary: Asset[]
  children: React.ReactNode
}) {
  const [library, setLibrary] = useState(initialLibrary)
  const [toasts, setToasts] = useState<Toast[]>([])
  const [jobs, setJobs] = useState<Job[]>([])
  const nextId = useRef(1)

  const toast = useCallback((text: string, tone: Toast['tone'] = 'ok') => {
    const id = nextId.current++
    setToasts((all) => [...all, { id, tone, text }])
    setTimeout(() => setToasts((all) => all.filter((t) => t.id !== id)), tone === 'error' ? 9000 : 3800)
  }, [])

  const uploadFiles = useCallback(
    async (files: File[]) => {
      const accepted = files.filter(isAcceptedFile)
      if (accepted.length < files.length) toast('Some files were skipped — only photos and videos can be added.', 'error')
      if (!accepted.length) return []

      const queue = accepted.map((file) => ({ file, id: nextId.current++ }))
      setJobs((all) => [...all, ...queue.map(({ file, id }) => ({ id, name: file.name, progress: 0, state: 'working' as const }))])
      const update = (id: number, patch: Partial<Job>) =>
        setJobs((all) => all.map((job) => (job.id === id ? { ...job, ...patch } : job)))

      const done: Asset[] = []
      let cursor = 0
      // A few at a time: quick on Wi-Fi, without choking a phone on mobile data.
      await Promise.all(
        Array.from({ length: Math.min(PARALLEL, queue.length) }, async () => {
          while (cursor < queue.length) {
            const { file, id } = queue[cursor++]
            try {
              const asset = await prepareAndUpload(file, mode, (progress) => update(id, { progress }))
              done.push(asset)
              update(id, { progress: 1, state: 'done' })
            } catch (error) {
              update(id, { state: 'error', error: (error as Error).message })
            }
          }
        }),
      )

      if (done.length) {
        const result = await addAssets(done)
        if (!result.ok) {
          toast(result.error, 'error')
          return []
        }
        setLibrary((all) => [...done, ...all])
        toast(done.length === 1 ? 'Uploaded — it’s in your media library.' : `${done.length} files uploaded.`)
      }
      // Clear finished rows after a moment; failed ones stay until dismissed.
      setTimeout(() => setJobs((all) => all.filter((job) => job.state === 'error' || !queue.some((q) => q.id === job.id))), 2500)
      return done
    },
    [mode, toast],
  )

  const value = useMemo<AdminContextValue>(
    () => ({
      mode,
      library,
      uploadFiles,
      removeFromLibrary: (id) => setLibrary((all) => all.filter((a) => a.id !== id)),
      renameInLibrary: (id, name) => setLibrary((all) => all.map((a) => (a.id === id ? { ...a, name } : a))),
      toast,
    }),
    [mode, library, uploadFiles, toast],
  )

  return (
    <AdminContext.Provider value={value}>
      {children}

      {jobs.length > 0 && (
        <div className="ad-uploads" role="status" aria-live="polite">
          <strong>Uploading</strong>
          {jobs.map((job) => (
            <div className={`ad-upload is-${job.state}`} key={job.id}>
              <span className="ad-upload-icon">
                {job.state === 'working' && <Loader2 size={14} className="ad-spin" />}
                {job.state === 'done' && <Check size={14} />}
                {job.state === 'error' && <CircleAlert size={14} />}
              </span>
              <span className="ad-upload-text">
                <span>{job.name}</span>
                {job.error ? <small>{job.error}</small> : <i style={{ width: `${Math.round(job.progress * 100)}%` }} />}
              </span>
              {job.state === 'error' && (
                <button
                  type="button"
                  aria-label="Dismiss"
                  onClick={() => setJobs((all) => all.filter((j) => j.id !== job.id))}
                >
                  <X size={14} />
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="ad-toasts" aria-live="polite">
        {toasts.map((t) => (
          <div className={`ad-toast is-${t.tone}`} key={t.id}>
            {t.tone === 'ok' ? <Check size={15} /> : <CircleAlert size={15} />}
            {t.text}
          </div>
        ))}
      </div>
    </AdminContext.Provider>
  )
}
