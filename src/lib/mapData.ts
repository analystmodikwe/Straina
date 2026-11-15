import { useEffect, useState } from 'react'
import { getObservations } from '../api/observations'
import { getDataSources } from '../api/sources'
import type { AmrObservation, DataSource, HotspotResult, HotspotStatus } from '../types'
import type { PinStatus } from './mapPins'

export interface MapData {
  observations: AmrObservation[]
  sources: DataSource[]
}

export interface MapArea {
  area_code: string
  area_name: string
  latitude: number
  longitude: number
  status: PinStatus
  observation_count: number
  resistance_pct: number | null
}

type Result = { attempt: number; data?: MapData; failed?: boolean }

/** Loads observations + data sources. Observations with no known source are dropped (US5, T-US5-4). */
export function useMapData() {
  const [attempt, setAttempt] = useState(0)
  const [result, setResult] = useState<Result | null>(null)

  useEffect(() => {
    let cancelled = false
    Promise.all([getObservations(), getDataSources()])
      .then(([observations, sources]) => {
        if (cancelled) return
        const known = new Set(sources.map((s) => s.id))
        setResult({
          attempt,
          data: { observations: observations.filter((o) => known.has(o.data_source_id)), sources },
        })
      })
      .catch(() => {
        if (!cancelled) setResult({ attempt, failed: true })
      })
    return () => {
      cancelled = true
    }
  }, [attempt])

  const current = result?.attempt === attempt ? result : null
  const status: 'loading' | 'error' | 'ready' = !current ? 'loading' : current.failed ? 'error' : 'ready'

  return { status, data: current?.data, reload: () => setAttempt((a) => a + 1) }
}

const PRIORITY: HotspotStatus[] = ['potential_hotspot', 'not_potential_hotspot', 'insufficient_data']

/**
 * One pin per known area. `all` decides which areas exist; `visible` decides which have data now.
 * An area with no visible records is 'no_data' (hollow) and never shown as 0 (BR5).
 */
export function buildAreas(
  all: AmrObservation[],
  visible: AmrObservation[],
  results: HotspotResult[],
  showHotspots: boolean,
): MapArea[] {
  const first = new Map<string, AmrObservation>()
  for (const o of all) if (!first.has(o.area_code)) first.set(o.area_code, o)

  return [...first.values()].map((o) => {
    const count = visible.filter((v) => v.area_code === o.area_code).length
    const mine = results.filter((r) => r.area_code === o.area_code)
    const best = PRIORITY.map((s) => mine.find((r) => r.status === s)).find(Boolean)

    let status: PinStatus = 'has_data'
    if (count === 0) status = 'no_data'
    else if (showHotspots && best) status = best.status

    return {
      area_code: o.area_code,
      area_name: o.area_name,
      latitude: o.latitude,
      longitude: o.longitude,
      status,
      observation_count: count,
      resistance_pct: count === 0 ? null : (best?.resistance_pct ?? null),
    }
  })
}

export function sourcesFor(observations: AmrObservation[], sources: DataSource[]): DataSource[] {
  const ids = new Set(observations.map((o) => o.data_source_id))
  return sources.filter((s) => ids.has(s.id))
}

/** BR13: true when any displayed record comes from a demo source. */
export function hasDemoData(observations: AmrObservation[], sources: DataSource[]): boolean {
  return sourcesFor(observations, sources).some((s) => s.is_demo)
}

export function quarterOf(iso: string): string {
  const d = new Date(iso)
  return `${d.getUTCFullYear()}-Q${Math.floor(d.getUTCMonth() / 3) + 1}`
}

export function quarterLabel(key: string): string {
  return key.replace('-', ' ')
}