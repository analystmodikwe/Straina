import { supabaseClient } from '../lib/supabase'
import { MESSAGES } from '../lib/messages'
import type { Role, Profile } from '../types'
import type { Session, User } from '@supabase/supabase-js'

export interface AuthSession {
  user: User
  session: Session
  role: Role
  profile: Profile | null
}

/**
 * OP1: Sign in with email and password via Supabase Auth (no OAuth).
 * Validates credentials and retrieves user role from public.profiles.
 */
export async function signIn(email: string, password: string): Promise<AuthSession> {
  const { data, error } = await supabaseClient.auth.signInWithPassword({
    email,
    password,
  })

  if (error || !data.user || !data.session) {
    throw new Error(MESSAGES.ERR7)
  }

  // Retrieve user role from profiles table
  const { data: profile } = await supabaseClient
    .from('profiles')
    .select('*')
    .eq('id', data.user.id)
    .maybeSingle()

  const role: Role = (profile?.role as Role) || 'analyst'

  return {
    user: data.user,
    session: data.session,
    role,
    profile: profile || null,
  }
}

/**
 * OP2: Sign out the active user session.
 */
export async function signOut(): Promise<void> {
  const { error } = await supabaseClient.auth.signOut()
  if (error) {
    throw new Error(MESSAGES.ERR4)
  }
}

/**
 * OP3: Get the current active session and user role.
 */
export async function getSession(): Promise<AuthSession | null> {
  const { data, error } = await supabaseClient.auth.getSession()

  if (error || !data.session) {
    return null
  }

  const user = data.session.user

  const { data: profile } = await supabaseClient
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle()

  const role: Role = (profile?.role as Role) || 'analyst'

  return {
    user,
    session: data.session,
    role,
    profile: profile || null,
  }
}

