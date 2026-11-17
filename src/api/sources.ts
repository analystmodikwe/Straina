import { supabaseClient } from '../lib/supabase'
import type { DataSource } from '../types'
import { MESSAGES } from '../lib/messages'

export async function getDataSources(): Promise<DataSource[]> {
  const { data, error } = await supabaseClient
    .from('data_sources')
    .select('*')
    .order('name')

  if (error) {
    throw error
  }

  return data as DataSource[]
}

export type NewDataSource = Omit<DataSource, 'id' | 'created_at'>

export async function addDataSource(source: NewDataSource): Promise<DataSource> {
  const { data, error } = await supabaseClient
    .from('data_sources')
    .insert(source)
    .select()
    .single()

  if (error) {
    throw new Error(MESSAGES.ERR11)
  }

  return data as DataSource
}

export async function updateDataSource(id: string, updates: Partial<NewDataSource>): Promise<DataSource> {
  const { data, error } = await supabaseClient
    .from('data_sources')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    throw new Error(MESSAGES.ERR11)
  }

  return data as DataSource
}