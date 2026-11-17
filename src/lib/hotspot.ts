import type { AmrObservation, HotspotResult, HotspotStatus } from '../types'

export const HOTSPOT_WINDOW_MONTHS = 6
export const HOTSPOT_THRESHOLD_PCT = 25.0
export const HOTSPOT_MIN_OBSERVATIONS = 3

/** Highest-priority status wins when several pairs collapse into one area (BR12). */
const PRIORITY: HotspotStatus[] = ['potential_hotspot', 'not_potential_hotspot', 'insufficient_data']

interface PairAccumulator {
  area_code: string
  area_name: string
  tested: number
  resistant: number
  count: number
}

interface AreaAccumulator {
  area_name: string
  tested: number
  resistant: number
  count: number
  best: HotspotStatus | null
}

function pairKey(o: AmrObservation): string {
  return `${o.area_code}|${o.pathogen}|${o.antimicrobial}`
}

/** Inclusive start of the window: `HOTSPOT_WINDOW_MONTHS` before the anchor date. */
function windowStart(anchor: string): number {
  const date = new Date(anchor)
  date.setUTCMonth(date.getUTCMonth() - HOTSPOT_WINDOW_MONTHS)
  return date.getTime()
}

function pairStatus(tested: number, resistant: number, count: number): HotspotStatus {
  if (count < HOTSPOT_MIN_OBSERVATIONS) return 'insufficient_data'
  if (tested <= 0) return 'not_potential_hotspot'
  const rate = (resistant / tested) * 100
  return rate >= HOTSPOT_THRESHOLD_PCT ? 'potential_hotspot' : 'not_potential_hotspot'
}

/**
 * BR12 potential-hotspot calculation. Pure function: no Supabase calls, no side effects.
 *
 * The window is anchored on the newest `period_end` in `observations` (not wall-clock
 * today) so results are deterministic for a given input. Results are collapsed to one
 * entry per `area_code`, keeping the highest-priority pair status.
 */
export function computeHotspots(observations: AmrObservation[]): HotspotResult[] {
  if (observations.length === 0) return []

  let anchor = observations[0].period_end
  for (const o of observations) if (o.period_end > anchor) anchor = o.period_end

  const cutoff = windowStart(anchor)
  const inWindow = observations.filter((o) => {
    const end = new Date(o.period_end).getTime()
    return !Number.isNaN(end) && end >= cutoff
  })
  if (inWindow.length === 0) return []

  const pairs = new Map<string, PairAccumulator>()
  const areas = new Map<string, AreaAccumulator>()

  for (const o of inWindow) {
    const key = pairKey(o)
    const pair: PairAccumulator = pairs.get(key) ?? {
      area_code: o.area_code,
      area_name: o.area_name,
      tested: 0,
      resistant: 0,
      count: 0,
    }
    pair.tested += o.isolates_tested
    pair.resistant += o.isolates_resistant
    pair.count += 1
    pairs.set(key, pair)

    const area: AreaAccumulator = areas.get(o.area_code) ?? {
      area_name: o.area_name,
      tested: 0,
      resistant: 0,
      count: 0,
      best: null,
    }
    area.tested += o.isolates_tested
    area.resistant += o.isolates_resistant
    area.count += 1
    areas.set(o.area_code, area)
  }

  for (const pair of pairs.values()) {
    const area = areas.get(pair.area_code)
    if (!area) continue
    const status = pairStatus(pair.tested, pair.resistant, pair.count)
    if (area.best === null || PRIORITY.indexOf(status) < PRIORITY.indexOf(area.best)) {
      area.best = status
    }
  }

  return [...areas.entries()].map(([area_code, area]) => ({
    area_code,
    area_name: area.area_name,
    status: area.best ?? 'insufficient_data',
    observation_count: area.count,
    resistance_pct: area.tested > 0 ? (area.resistant / area.tested) * 100 : null,
  }))
}