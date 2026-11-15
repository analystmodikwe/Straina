import React, { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { MESSAGES } from '../lib/messages'

export const S10_AccessDenied: React.FC = () => {
  const navigate = useNavigate()
  const { user, loading } = useAuth()

  useEffect(() => {
    // Visitor who hits this route without being signed in redirects to S5
    if (!loading && !user) {
      navigate('/sign-in', { replace: true })
    }
  }, [user, loading, navigate])

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-[#F8FAFC] px-4 py-12">
      <div className="w-full max-w-md bg-white border border-[#CBD5E1] rounded-lg shadow-sm p-6 sm:p-8 text-center">
        <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-xl">
          !
        </div>
        <h1 className="text-xl font-bold text-[#1E293B] mb-2">Access Denied</h1>
        <p className="text-sm text-[#475569] mb-6" data-testid="access-denied-message">
          {MESSAGES.ERR9}
        </p>
        <Link
          to="/"
          data-testid="back-to-map-link"
          className="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-white bg-[#0F4C5C] hover:bg-[#0c3c49] rounded-md transition-colors shadow-sm"
        >
          Back to map
        </Link>
      </div>
    </div>
  )
}

