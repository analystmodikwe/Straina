import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { MESSAGES } from '../lib/messages'

export const S5_SignIn: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, signIn, loading } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [emailError, setEmailError] = useState<string | null>(null)
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const [formError, setFormError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  // Redirect to home if already authenticated
  useEffect(() => {
    if (!loading && user) {
      const from = (location.state as { from?: { pathname?: string } })?.from?.pathname || '/'
      navigate(from, { replace: true })
    }
  }, [user, loading, navigate, location.state])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)

    let hasError = false
    if (!email.trim()) {
      setEmailError(MESSAGES.ERR13)
      hasError = true
    } else {
      setEmailError(null)
    }

    if (!password) {
      setPasswordError(MESSAGES.ERR13)
      hasError = true
    } else {
      setPasswordError(null)
    }

    if (hasError) {
      return
    }

    setSubmitting(true)
    try {
      await signIn(email.trim(), password)
      const from = (location.state as { from?: { pathname?: string } })?.from?.pathname || '/'
      navigate(from, { replace: true })
    } catch {
      setFormError(MESSAGES.ERR7)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-[#F8FAFC] px-4 py-12">
      <div className="w-full max-w-md bg-white border border-[#CBD5E1] rounded-lg shadow-sm p-6 sm:p-8">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-[#0F4C5C] tracking-tight">Sign in to Straina</h1>
          <p className="text-sm text-[#475569] mt-1.5">
            Enter your credentials to access protected surveillance features.
          </p>
        </div>

        {formError && (
          <div
            role="alert"
            className="mb-5 p-3.5 bg-red-50 border border-red-200 text-red-700 text-sm rounded-md"
          >
            {formError}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-semibold text-[#1E293B] mb-1"
            >
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              data-testid="email-input"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                if (emailError) setEmailError(null)
              }}
              className={`w-full px-3.5 py-2 text-sm border rounded-md outline-none transition-colors ${
                emailError
                  ? 'border-red-500 focus:ring-1 focus:ring-red-500'
                  : 'border-[#CBD5E1] focus:border-[#0F4C5C] focus:ring-1 focus:ring-[#0F4C5C]'
              }`}
              placeholder="you@domain.org"
              autoComplete="email"
            />
            {emailError && (
              <p data-testid="email-error" className="mt-1 text-xs text-red-600 font-medium">
                {emailError}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-semibold text-[#1E293B] mb-1"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              data-testid="password-input"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                if (passwordError) setPasswordError(null)
              }}
              className={`w-full px-3.5 py-2 text-sm border rounded-md outline-none transition-colors ${
                passwordError
                  ? 'border-red-500 focus:ring-1 focus:ring-red-500'
                  : 'border-[#CBD5E1] focus:border-[#0F4C5C] focus:ring-1 focus:ring-[#0F4C5C]'
              }`}
              placeholder="••••••••"
              autoComplete="current-password"
            />
            {passwordError && (
              <p data-testid="password-error" className="mt-1 text-xs text-red-600 font-medium">
                {passwordError}
              </p>
            )}
          </div>

          <button
            type="submit"
            data-testid="signin-submit"
            disabled={submitting}
            className="w-full mt-2 py-2.5 px-4 bg-[#0F4C5C] text-white text-sm font-semibold rounded-md shadow hover:bg-[#0c3c49] focus:outline-none focus:ring-2 focus:ring-[#0F4C5C] focus:ring-offset-1 transition-colors disabled:opacity-60"
          >
            {submitting ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  )
}

