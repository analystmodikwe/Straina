import { supabaseClient } from '../lib/supabase'
import type { Profile, Role } from '../types'
import { MESSAGES } from '../lib/messages'

export async function getUsers(): Promise<Profile[]> {
  const { data, error } = await supabaseClient
    .from('profiles')
    .select('*')
    .order('created_at')

  if (error) {
    throw new Error(MESSAGES.ERR11)
  }

  return data as Profile[]
}

export async function updateRole(userId: string, role: Role): Promise<void> {
  const { error } = await supabaseClient
    .from('profiles')
    .update({ role })
    .eq('id', userId)

  if (error) {
    throw new Error(MESSAGES.ERR11)
  }
}