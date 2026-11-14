export type Role = 'admin' | 'data_submitter' | 'analyst'

export type AreaLevel = 'province' | 'district' | 'national'

export interface DataSource {
  id: string
  name: string
  url: string | null
  description: string | null
  geographic_coverage: string
  temporal_coverage_start: string
  temporal_coverage_end: string
  last_updated: string
  is_demo: boolean
  created_at: string
}

export interface Profile {
  id: string
  email: string
  role: Role
  created_at: string
}

export interface AmrObservation {
  id: string
  data_source_id: string
  area_code: string
  area_name: string
  area_level: AreaLevel
  latitude: number
  longitude: number
  period_start: string
  period_end: string
  pathogen: string
  antimicrobial: string
  isolates_tested: number
  isolates_resistant: number
  created_by: string | null
  created_at: string
  updated_at: string
}

export type NewAmrObservation = Omit<
  AmrObservation,
  'id' | 'created_by' | 'created_at' | 'updated_at'
>

export type HotspotStatus =
  | 'potential_hotspot'
  | 'not_potential_hotspot'
  | 'insufficient_data'
  | 'no_data'

export interface HotspotResult {
  area_code: string
  area_name: string
  status: HotspotStatus
  observation_count: number
  resistance_pct: number | null
}
