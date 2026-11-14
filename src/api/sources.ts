import { supabaseClient } from '../lib/supabase'
import type { DataSource } from '../types'

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