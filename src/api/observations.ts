import { supabaseClient } from '../lib/supabase'
import { MESSAGES } from '../lib/messages'
import type { AmrObservation, DataSource, NewAmrObservation } from '../types'

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
    throw new Error(MESSAGES.ERR3)
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
    throw new Error(MESSAGES.ERR3)
  }

  if (!data || data.length === 0) {
    throw new Error(MESSAGES.ERR2)
  }

  return data as AreaObservation[]
}

/** Postgres "insufficient_privilege": row-level security refused the write. */
const RLS_REFUSED = '42501'

function writeError(error: { code?: string }): Error {
  return new Error(error.code === RLS_REFUSED ? MESSAGES.ERR11 : MESSAGES.ERR12)
}

/** OP7: Admin or Data Submitter. created_by is always the signed-in user (RLS requires it). */
export async function createObservation(
  data: NewAmrObservation,
): Promise<AmrObservation> {
  if (data.isolates_resistant > data.isolates_tested) {
    throw new Error(MESSAGES.ERR14)
  }

  const { data: auth } = await supabaseClient.auth.getUser()
  if (!auth.user) {
    throw new Error(MESSAGES.ERR10)
  }

  const { data: created, error } = await supabaseClient
    .from('amr_observations')
    .insert({ ...data, created_by: auth.user.id })
    .select()
    .single()

  if (error || !created) {
    throw writeError(error ?? {})
  }

  return created as AmrObservation
}

/**
 * OP8: Admin (any record) or Data Submitter (own records only, enforced by RLS).
 * RLS hides records the user may not edit, so "no row updated" means ERR11.
 */
export async function updateObservation(
  id: string,
  updates: Partial<NewAmrObservation>,
): Promise<AmrObservation> {
  if (
    updates.isolates_tested !== undefined &&
    updates.isolates_resistant !== undefined &&
    updates.isolates_resistant > updates.isolates_tested
  ) {
    throw new Error(MESSAGES.ERR14)
  }

  const { data: updated, error } = await supabaseClient
    .from('amr_observations')
    .update(updates)
    .eq('id', id)
    .select()
    .maybeSingle()

  if (error) {
    throw writeError(error)
  }

  if (!updated) {
    throw new Error(MESSAGES.ERR11)
  }

  return updated as AmrObservation
}