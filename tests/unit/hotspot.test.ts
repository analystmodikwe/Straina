import { describe, expect, it } from 'vitest'
import { computeHotspots } from '../../src/lib/hotspot'
import type { AmrObservation } from '../../src/types'

const ANCHOR = '2026-06-30'

function makeObservation(overrides: Partial<AmrObservation> = {}): AmrObservation {
  return {
    id: 'obs-1',
    data_source_id: 'source-1',
    area_code: 'GP',
    area_name: 'Gauteng',
    area_level: 'province',
    latitude: -26.2041,
    longitude: 28.0473,
    period_start: '2026-01-01',
    period_end: ANCHOR,
    pathogen: 'Klebsiella pneumoniae',
    antimicrobial: 'Meropenem',
    isolates_tested: 10,
    isolates_resistant: 3,
    created_by: null,
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
    ...overrides,
  }
}

function repeat(count: number, overrides: Partial<AmrObservation> = {}): AmrObservation[] {
  return Array.from({ length: count }, (_, i) => makeObservation({ id: `obs-${i + 1}`, ...overrides }))
}

describe('computeHotspots (BR12, QR6-QR12)', () => {
  it('returns [] for empty input', () => {
    expect(computeHotspots([])).toEqual([])
  })

  it('flags a pair when rate >= 25% and count >= 3', () => {
    const results = computeHotspots(repeat(3, { isolates_tested: 4, isolates_resistant: 1 }))

    expect(results).toHaveLength(1)
    expect(results[0]).toMatchObject({
      area_code: 'GP',
      area_name: 'Gauteng',
      status: 'potential_hotspot',
      observation_count: 3,
    })
    expect(results[0].resistance_pct).toBeCloseTo(25.0)
  })

  it('does not flag a pair when rate < 25%', () => {
    const results = computeHotspots(repeat(3, { isolates_tested: 10, isolates_resistant: 1 }))

    expect(results[0].status).toBe('not_potential_hotspot')
    expect(results[0].resistance_pct).toBeCloseTo(10.0)
  })

  it('reports insufficient_data when count < 3 regardless of rate', () => {
    const results = computeHotspots(repeat(2, { isolates_tested: 10, isolates_resistant: 9 }))

    expect(results[0].status).toBe('insufficient_data')
    expect(results[0].observation_count).toBe(2)
    expect(results[0].resistance_pct).toBeCloseTo(90.0)
  })

  it('excludes observations older than 6 months relative to the anchor', () => {
    const recent = repeat(2, { isolates_tested: 1, isolates_resistant: 1 })
    const stale = makeObservation({
      id: 'obs-stale',
      period_start: '2025-09-01',
      period_end: '2025-12-01',
      isolates_tested: 1,
      isolates_resistant: 1,
    })

    const results = computeHotspots([...recent, stale])

    expect(results[0].observation_count).toBe(2)
    expect(results[0].status).toBe('insufficient_data')
  })

  it('includes an observation exactly 6 months before the anchor', () => {
    const recent = repeat(2, { isolates_tested: 1, isolates_resistant: 1 })
    const boundary = makeObservation({
      id: 'obs-boundary',
      period_start: '2025-12-30',
      period_end: '2025-12-30',
      isolates_tested: 1,
      isolates_resistant: 1,
    })

    const results = computeHotspots([...recent, boundary])

    expect(results[0].observation_count).toBe(3)
    expect(results[0].status).toBe('potential_hotspot')
  })

  it('flags at the exact boundary: 25.0% and exactly 3 observations', () => {
    const results = computeHotspots(
      repeat(3, { isolates_tested: 100, isolates_resistant: 25 }),
    )

    expect(results[0].status).toBe('potential_hotspot')
  })

  it('does not flag when isolates_tested is 0 (no division by zero)', () => {
    const results = computeHotspots(repeat(3, { isolates_tested: 0, isolates_resistant: 0 }))

    expect(results[0].status).toBe('not_potential_hotspot')
    expect(results[0].resistance_pct).toBeNull()
  })

  it('groups by area + pathogen + antimicrobial before collapsing to area', () => {
    const pairA = repeat(2, { isolates_tested: 10, isolates_resistant: 0 })
    const pairB = repeat(2, {
      antimicrobial: 'Ciprofloxacin',
      isolates_tested: 1,
      isolates_resistant: 1,
    })

    const results = computeHotspots([...pairA, ...pairB])

    // Merged into one pair this would be 2/21 = 9.5% over 4 observations; kept apart
    // both pairs have count 2, so the area is insufficient_data.
    expect(results).toHaveLength(1)
    expect(results[0].status).toBe('insufficient_data')
    expect(results[0].observation_count).toBe(4)
  })

  it('collapses an area to the highest-priority pair status', () => {
    const hotspot = repeat(3, { isolates_tested: 1, isolates_resistant: 1 })
    const insufficient = repeat(1, {
      antimicrobial: 'Ciprofloxacin',
      isolates_tested: 10,
      isolates_resistant: 0,
    })

    const results = computeHotspots([...hotspot, ...insufficient])

    expect(results).toHaveLength(1)
    expect(results[0].status).toBe('potential_hotspot')
    expect(results[0].observation_count).toBe(4)
    // area-level rate: 3 resistant / 13 tested
    expect(results[0].resistance_pct).toBeCloseTo((3 / 13) * 100)
  })

  it('prefers not_potential_hotspot over insufficient_data', () => {
    const notPotential = repeat(3, { isolates_tested: 10, isolates_resistant: 1 })
    const insufficient = repeat(1, {
      antimicrobial: 'Ciprofloxacin',
      isolates_tested: 10,
      isolates_resistant: 0,
    })

    const results = computeHotspots([...notPotential, ...insufficient])

    expect(results[0].status).toBe('not_potential_hotspot')
  })

  it('returns one result per area', () => {
    const gauteng = repeat(3, { isolates_tested: 1, isolates_resistant: 1 })
    const westernCape = repeat(3, {
      area_code: 'WC',
      area_name: 'Western Cape',
      isolates_tested: 10,
      isolates_resistant: 1,
    })

    const results = computeHotspots([...gauteng, ...westernCape])

    expect(results.map((r) => r.area_code)).toEqual(['GP', 'WC'])
    expect(results[0].status).toBe('potential_hotspot')
    expect(results[1].status).toBe('not_potential_hotspot')
  })
})