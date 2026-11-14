
import { supabaseClient } from '../lib/supabase'
import type { AmrObservation, DataSource } from '../types'

export interface ObservationFilters {
  periodStart?: string
  periodEnd?: string
  pathogen?: string
  antimicrobial?: string
}

export type AreaObservation = AmrObservation & {
  data_source: DataSource
}

export async function getObservations(
  filters: ObservationFilters = {},
): Promise<AmrObservation[]> {
  let query = supabaseClient
    .from('amr_observations')
    .select('*')

  if (filters.periodStart) {
    query = query.gte('period_end', filters.periodStart)
  }

  if (filters.periodEnd) {
    query = query.lte('period_start', filters.periodEnd)
  }

  if (filters.pathogen) {
    query = query.eq('pathogen', filters.pathogen)
  }

  if (filters.antimicrobial) {
    query = query.eq('antimicrobial', filters.antimicrobial)
  }

  const { data, error } = await query.order('period_start', {
    ascending: false,
  })

  if (error) {
    throw error
  }

  return (data ?? []) as AmrObservation[]
}

export async function getAreaDetail(
  areaCode: string,
): Promise<AreaObservation[]> {
  const { data, error } = await supabaseClient
    .from('amr_observations')
    .select('*, data_source:data_sources(*)')
    .eq('area_code', areaCode)
    .order('period_start', { ascending: false })

  if (error) {
    throw error
  }

  if (!data || data.length === 0) {
    throw new Error('No data are available for this selection.')
  }

  return data as AreaObservation[]
}
