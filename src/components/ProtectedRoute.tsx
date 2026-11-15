import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import type { Role } from '../types'

interface ProtectedRouteProps {
  children?: React.ReactNode
  allowedRoles?: Role[]
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
}) => {
  const { user, role, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="min-h-[200px] flex items-center justify-center text-sm text-[#475569]">
        Checking authentication...
      </div>
    )
  }

  // Unauthenticated visitors redirect to sign-in (S5)
  if (!user) {
    return <Navigate to="/sign-in" state={{ from: location }} replace />
  }

  // Authenticated user with wrong role redirects to Access Denied (S10)
  if (allowedRoles && role && !allowedRoles.includes(role)) {
    return <Navigate to="/access-denied" replace />
  }

  return <>{children}</>
}

