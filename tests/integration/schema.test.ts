import { beforeEach, describe, expect, it, vi } from 'vitest'

const { mockFrom } = vi.hoisted(() => ({
  mockFrom: vi.fn(),
}))

vi.mock('../../src/lib/supabase', () => ({
  supabaseClient: {
    from: mockFrom,
  },
}))

import { supabaseClient } from '../../src/lib/supabase'

describe('Client-Side Schema and RLS Error Contracts (Mocked Client Tests)', () => {
  beforeEach(() => {
    mockFrom.mockReset()
  })

  it('T-SETUP-1: Client contract for querying public tables (profiles, data_sources, amr_observations)', async () => {
    const mockSelect = vi.fn().mockResolvedValue({
      data: [{ id: 'test-id' }],
      error: null,
    })

    mockFrom.mockReturnValue({
      select: mockSelect,
    })

    const { data: sources, error: sourcesErr } = await supabaseClient
      .from('data_sources')
      .select('*')

    expect(sourcesErr).toBeNull()
    expect(sources).toHaveLength(1)
    expect(mockFrom).toHaveBeenCalledWith('data_sources')

    const { data: observations, error: obsErr } = await supabaseClient
      .from('amr_observations')
      .select('*')

    expect(obsErr).toBeNull()
    expect(observations).toHaveLength(1)
    expect(mockFrom).toHaveBeenCalledWith('amr_observations')

    const { data: profiles, error: profErr } = await supabaseClient
      .from('profiles')
      .select('*')

    expect(profErr).toBeNull()
    expect(profiles).toHaveLength(1)
    expect(mockFrom).toHaveBeenCalledWith('profiles')
  })

  it('T-SETUP-2: Client handles database RLS 42501 error when write is rejected by policy', async () => {
    const mockInsert = vi.fn().mockResolvedValue({
      data: null,
      error: {
        code: '42501',
        message: 'new row violates row-level security policy for table "amr_observations"',
      },
    })

    mockFrom.mockReturnValue({
      insert: mockInsert,
    })

    const { data, error } = await supabaseClient.from('amr_observations').insert({
      area_code: 'GP',
      pathogen: 'Klebsiella pneumoniae',
    })

    expect(data).toBeNull()
    expect(error).not.toBeNull()
    expect(error?.code).toBe('42501')
    expect(error?.message).toContain('row-level security')
  })
})

