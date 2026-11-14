
import { beforeEach, describe, expect, it, vi } from 'vitest'

const { mockFrom } = vi.hoisted(() => ({
  mockFrom: vi.fn(),
}))

vi.mock('../../src/lib/supabase', () => ({
  supabaseClient: {
    from: mockFrom,
  },
}))

import {
  getObservations,
  getAreaDetail,
} from '../../src/api/observations'

type QueryResponse = {
  data: unknown
  error: unknown
}

type MockQuery = Promise<QueryResponse> & {
  select: ReturnType<typeof vi.fn>
  eq: ReturnType<typeof vi.fn>
  gte: ReturnType<typeof vi.fn>
  lte: ReturnType<typeof vi.fn>
  order: ReturnType<typeof vi.fn>
}

function createQuery(result: QueryResponse): MockQuery {
  const query = Promise.resolve(result) as unknown as MockQuery

  query.select = vi.fn(() => query)
  query.eq = vi.fn(() => query)
  query.gte = vi.fn(() => query)
  query.lte = vi.fn(() => query)
  query.order = vi.fn(() => query)

  return query
}

describe('Observation API', () => {
  beforeEach(() => {
    mockFrom.mockReset()
  })

  it('retrieves observations using the selected filters', async () => {
    const observations = [
      { id: '1', area_code: 'GP' },
    ]

    const query = createQuery({
      data: observations,
      error: null,
    })

    mockFrom.mockReturnValue(query)

    const result = await getObservations({
      periodStart: '2025-01-01',
      periodEnd: '2025-12-31',
      pathogen: 'Klebsiella pneumoniae',
      antimicrobial: 'Ciprofloxacin',
    })

    expect(mockFrom).toHaveBeenCalledWith('amr_observations')
    expect(query.select).toHaveBeenCalledWith('*')
    expect(query.gte).toHaveBeenCalledWith(
      'period_end',
      '2025-01-01',
    )
    expect(query.lte).toHaveBeenCalledWith(
      'period_start',
      '2025-12-31',
    )
    expect(result).toEqual(observations)
  })

  it('retrieves observations for a selected area with its data source', async () => {
    const observations = [
      {
        id: '1',
        area_code: 'GP',
        data_source: {
          id: 'source-1',
          name: 'Straina demo dataset (synthetic)',
        },
      },
    ]

    const query = createQuery({
      data: observations,
      error: null,
    })

    mockFrom.mockReturnValue(query)

    const result = await getAreaDetail('GP')

    expect(mockFrom).toHaveBeenCalledWith('amr_observations')
    expect(query.select).toHaveBeenCalledWith(
      '*, data_source:data_sources(*)',
    )
    expect(query.eq).toHaveBeenCalledWith('area_code', 'GP')
    expect(result).toEqual(observations)
  })

  it('throws an error when observations cannot be retrieved', async () => {
    const error = new Error('Database connection failed')

    mockFrom.mockReturnValue(
      createQuery({
        data: null,
        error,
      }),
    )

    await expect(getObservations()).rejects.toThrow(
      'Database connection failed',
    )
  })
})
