'use client'

import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { startTransition, useActionState, useRef, useState } from 'react'
import { login } from '@/app/admin/actions'

export function LoginForm({ next }: { next: string }) {
  const [error, action, pending] = useActionState(login, null)
  const [show, setShow] = useState(false)
  const password = useRef<HTMLInputElement>(null)

  return (
    // Submitted by hand rather than through `action`, so a mistyped password only clears the
    // password field instead of React resetting the whole form.
    <form
      className="ad-login-form"
      onSubmit={(e) => {
        e.preventDefault()
        const data = new FormData(e.currentTarget)
        if (password.current) password.current.value = ''
        startTransition(() => action(data))
      }}
    >
      <label className="ad-field">
        <span className="ad-label">
          <span>Password</span>
        </span>
        <span className="ad-password">
          <input
            ref={password}
            className="ad-input"
            name="password"
            type={show ? 'text' : 'password'}
            autoComplete="current-password"
            autoFocus
            required
          />
          <button type="button" onClick={() => setShow((s) => !s)} aria-label={show ? 'Hide password' : 'Show password'}>
            {show ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </span>
      </label>

      <input type="hidden" name="next" value={next} />
      {error && (
        <p className="ad-error" role="alert">
          {error}
        </p>
      )}
      <button className="ad-button ad-primary ad-wide" disabled={pending}>
        {pending && <Loader2 size={15} className="ad-spin" />} Sign in
      </button>
    </form>
  )
}
