import { beforeEach, describe, expect, it, vi } from 'vitest'
import { MESSAGES } from '../../src/lib/messages'

const { mockFrom, mockGetUser } = vi.hoisted(() => ({
  mockFrom: vi.fn(),
  mockGetUser: vi.fn(),
}))

vi.mock('../../src/lib/supabase', () => ({
  supabaseClient: {
    from: mockFrom,
    auth: { getUser: mockGetUser },
  },
}))

import {
  getObservations,
  getAreaDetail,
  createObservation,
  updateObservation,
} from '../../src/api/observations'
import type { NewAmrObservation } from '../../src/types'

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
  insert: ReturnType<typeof vi.fn>
  update: ReturnType<typeof vi.fn>
  single: ReturnType<typeof vi.fn>
  maybeSingle: ReturnType<typeof vi.fn>
}

function createQuery(result: QueryResponse): MockQuery {
  const query = Promise.resolve(result) as unknown as MockQuery

  query.select = vi.fn(() => query)
  query.eq = vi.fn(() => query)
  query.gte = vi.fn(() => query)
  query.lte = vi.fn(() => query)
  query.order = vi.fn(() => query)
  query.insert = vi.fn(() => query)
  query.update = vi.fn(() => query)
  query.single = vi.fn(() => query)
  query.maybeSingle = vi.fn(() => query)

  return query
}

const newRecord: NewAmrObservation = {
  data_source_id: 'source-1',
  area_code: 'GP',
  area_name: 'Gauteng',
  area_level: 'province',
  latitude: -26.2,
  longitude: 28.0,
  period_start: '2026-01-01',
  period_end: '2026-03-31',
  pathogen: 'Escherichia coli',
  antimicrobial: 'Ciprofloxacin',
  isolates_tested: 20,
  isolates_resistant: 8,
}

describe('Observation API', () => {
  beforeEach(() => {
    mockFrom.mockReset()
    mockGetUser.mockReset()
    mockGetUser.mockResolvedValue({ data: { user: { id: 'user-1' } } })
  })

  it('retrieves observations using the selected filters', async () => {
    const observations = [{ id: '1', area_code: 'GP' }]

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
    expect(query.gte).toHaveBeenCalledWith('period_end', '2025-01-01')
    expect(query.lte).toHaveBeenCalledWith('period_start', '2025-12-31')
    expect(query.eq).toHaveBeenCalledWith('pathogen', 'Klebsiella pneumoniae')
    expect(query.eq).toHaveBeenCalledWith('antimicrobial', 'Ciprofloxacin')
    expect(result).toEqual(observations)
  })

  it('retrieves area observations with their linked data source', async () => {
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

  it('uses the standard error message when observations cannot load', async () => {
    mockFrom.mockReturnValue(
      createQuery({
        data: null,
        error: new Error('Database connection failed'),
      }),
    )

    await expect(getObservations()).rejects.toThrow(MESSAGES.ERR3)
  })

  it('uses the standard error message when area observations cannot load', async () => {
    mockFrom.mockReturnValue(
      createQuery({
        data: null,
        error: new Error('Database connection failed'),
      }),
    )

    await expect(getAreaDetail('GP')).rejects.toThrow(MESSAGES.ERR3)
  })

  it('returns the standard empty-area message when no observations exist', async () => {
    mockFrom.mockReturnValue(
      createQuery({
        data: [],
        error: null,
      }),
    )

    await expect(getAreaDetail('GP')).rejects.toThrow(MESSAGES.ERR2)
  })

  describe('createObservation (OP7)', () => {
    it('inserts the record with the signed-in user as created_by and returns it', async () => {
      const saved = { id: 'obs-1', ...newRecord, created_by: 'user-1' }
      const query = createQuery({ data: saved, error: null })
      mockFrom.mockReturnValue(query)

      const result = await createObservation(newRecord)

      expect(mockFrom).toHaveBeenCalledWith('amr_observations')
      expect(query.insert).toHaveBeenCalledWith({ ...newRecord, created_by: 'user-1' })
      expect(query.select).toHaveBeenCalled()
      expect(query.single).toHaveBeenCalled()
      expect(result).toEqual(saved)
    })

    it('rejects resistant isolates above tested isolates with ERR14 and does not call the database', async () => {
      await expect(
        createObservation({ ...newRecord, isolates_tested: 5, isolates_resistant: 6 }),
      ).rejects.toThrow(MESSAGES.ERR14)
      expect(mockFrom).not.toHaveBeenCalled()
    })

    it('rejects with ERR10 when nobody is signed in', async () => {
      mockGetUser.mockResolvedValue({ data: { user: null } })

      await expect(createObservation(newRecord)).rejects.toThrow(MESSAGES.ERR10)
      expect(mockFrom).not.toHaveBeenCalled()
    })

    it('rejects with ERR11 when row-level security refuses the insert', async () => {
      mockFrom.mockReturnValue(
        createQuery({ data: null, error: { code: '42501', message: 'RLS' } }),
      )

      await expect(createObservation(newRecord)).rejects.toThrow(MESSAGES.ERR11)
    })

    it('rejects with ERR12 when the save fails for any other reason', async () => {
      mockFrom.mockReturnValue(
        createQuery({ data: null, error: { code: '08006', message: 'down' } }),
      )

      await expect(createObservation(newRecord)).rejects.toThrow(MESSAGES.ERR12)
    })
  })

  describe('updateObservation (OP8)', () => {
    it('updates the record by id and returns it', async () => {
      const saved = { id: 'obs-1', ...newRecord, isolates_resistant: 10 }
      const query = createQuery({ data: saved, error: null })
      mockFrom.mockReturnValue(query)

      const result = await updateObservation('obs-1', { isolates_resistant: 10 })

      expect(mockFrom).toHaveBeenCalledWith('amr_observations')
      expect(query.update).toHaveBeenCalledWith({ isolates_resistant: 10 })
      expect(query.eq).toHaveBeenCalledWith('id', 'obs-1')
      expect(result).toEqual(saved)
    })

    it('rejects resistant above tested with ERR14 when both are supplied', async () => {
      await expect(
        updateObservation('obs-1', { isolates_tested: 5, isolates_resistant: 6 }),
      ).rejects.toThrow(MESSAGES.ERR14)
      expect(mockFrom).not.toHaveBeenCalled()
    })

    it("rejects with ERR11 when no row is updated (another person's record)", async () => {
      mockFrom.mockReturnValue(createQuery({ data: null, error: null }))

      await expect(
        updateObservation('someone-elses', { pathogen: 'Klebsiella pneumoniae' }),
      ).rejects.toThrow(MESSAGES.ERR11)
    })

    it('rejects with ERR11 when row-level security returns a permission error', async () => {
      mockFrom.mockReturnValue(
        createQuery({ data: null, error: { code: '42501', message: 'RLS' } }),
      )

      await expect(updateObservation('obs-1', { pathogen: 'x' })).rejects.toThrow(MESSAGES.ERR11)
    })

    it('rejects with ERR12 when the save fails for any other reason', async () => {
      mockFrom.mockReturnValue(
        createQuery({ data: null, error: { code: '08006', message: 'down' } }),
      )

      await expect(updateObservation('obs-1', { pathogen: 'x' })).rejects.toThrow(MESSAGES.ERR12)
    })
  })
})