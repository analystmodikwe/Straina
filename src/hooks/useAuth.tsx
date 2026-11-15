/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react'
import type { User, Session } from '@supabase/supabase-js'
import type { Role, Profile } from '../types'
import { supabaseClient } from '../lib/supabase'
import { getSession, signIn as apiSignIn, signOut as apiSignOut, type AuthSession } from '../api/auth'

export interface AuthContextValue {
  user: User | null
  session: Session | null
  role: Role | null
  profile: Profile | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<AuthSession>
  signOut: () => Promise<void>
  refresh: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [role, setRole] = useState<Role | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  const loadCurrentSession = useCallback(async () => {
    try {
      const current = await getSession()
      if (current) {
        setUser(current.user)
        setSession(current.session)
        setRole(current.role)
        setProfile(current.profile)
      } else {
        setUser(null)
        setSession(null)
        setRole(null)
        setProfile(null)
      }
    } catch {
      setUser(null)
      setSession(null)
      setRole(null)
      setProfile(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const run = async () => {
      await loadCurrentSession()
    }
    void run()

    const { data: authListener } = supabaseClient.auth.onAuthStateChange(
      async (event, newSession) => {
        if (event === 'SIGNED_OUT' || !newSession) {
          setUser(null)
          setSession(null)
          setRole(null)
          setProfile(null)
          setLoading(false)
        } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          await loadCurrentSession()
        }
      }
    )

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [loadCurrentSession])

  const handleSignIn = async (email: string, password: string): Promise<AuthSession> => {
    const authSession = await apiSignIn(email, password)
    setUser(authSession.user)
    setSession(authSession.session)
    setRole(authSession.role)
    setProfile(authSession.profile)
    return authSession
  }

  const handleSignOut = async (): Promise<void> => {
    await apiSignOut()
    setUser(null)
    setSession(null)
    setRole(null)
    setProfile(null)
  }

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      session,
      role,
      profile,
      loading,
      signIn: handleSignIn,
      signOut: handleSignOut,
      refresh: loadCurrentSession,
    }),
    [user, session, role, profile, loading, loadCurrentSession]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
