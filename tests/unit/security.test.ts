import { describe, it, expect, vi, beforeEach } from 'vitest'
import { MESSAGES } from '../../src/lib/messages'

const { mockSignInWithPassword, mockSignOut, mockGetSession, mockFrom } = vi.hoisted(() => ({
  mockSignInWithPassword: vi.fn(),
  mockSignOut: vi.fn(),
  mockGetSession: vi.fn(),
  mockFrom: vi.fn(),
}))

vi.mock('../../src/lib/supabase', () => ({
  supabaseClient: {
    auth: {
      signInWithPassword: mockSignInWithPassword,
      signOut: mockSignOut,
      getSession: mockGetSession,
    },
    from: mockFrom,
  },
}))

import { signIn, signOut, getSession } from '../../src/api/auth'

describe('Security & Auth Unit Tests (T-US6-4, T-PERM-2a, T-PERM-2b)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getSession() (T-US6-4, T-PERM-2b)', () => {
    it('returns null when no active session exists or error occurs', async () => {
      mockGetSession.mockResolvedValue({
        data: { session: null },
        error: null,
      })

      const session = await getSession()
      expect(session).toBeNull()
    })

    it('returns user, session, and role from profiles table when authenticated', async () => {
      const mockUser = { id: 'user-123', email: 'admin@straina.org' }
      const mockSessionObj = { user: mockUser, access_token: 'fake-jwt-token' }

      mockGetSession.mockResolvedValue({
        data: { session: mockSessionObj },
        error: null,
      })

      const mockSelect = vi.fn().mockReturnThis()
      const mockEq = vi.fn().mockReturnThis()
      const mockMaybeSingle = vi.fn().mockResolvedValue({
        data: { id: 'user-123', email: 'admin@straina.org', role: 'admin' },
        error: null,
      })

      mockFrom.mockReturnValue({
        select: mockSelect,
        eq: mockEq,
        maybeSingle: mockMaybeSingle,
      })

      const result = await getSession()

      expect(result).not.toBeNull()
      expect(result?.user.id).toBe('user-123')
      expect(result?.role).toBe('admin')
      expect(mockFrom).toHaveBeenCalledWith('profiles')
    })

    it('defaults to analyst role if profile lookup has no role', async () => {
      const mockUser = { id: 'user-456', email: 'guest@straina.org' }
      mockGetSession.mockResolvedValue({
        data: { session: { user: mockUser } },
        error: null,
      })

      mockFrom.mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
      })

      const result = await getSession()
      expect(result?.role).toBe('analyst')
    })
  })

  describe('signOut() (T-PERM-2a)', () => {
    it('successfully calls supabase auth.signOut()', async () => {
      mockSignOut.mockResolvedValue({ error: null })

      await expect(signOut()).resolves.toBeUndefined()
      expect(mockSignOut).toHaveBeenCalledTimes(1)
    })

    it('throws ERR4 when Supabase sign-out fails', async () => {
      mockSignOut.mockResolvedValue({ error: new Error('Network timeout') })

      await expect(signOut()).rejects.toThrow(MESSAGES.ERR4)
    })
  })

  describe('signIn() credential validation', () => {
    it('throws ERR7 when credentials are invalid', async () => {
      mockSignInWithPassword.mockResolvedValue({
        data: { user: null, session: null },
        error: new Error('Invalid login credentials'),
      })

      await expect(signIn('invalid@straina.org', 'wrongpass')).rejects.toThrow(MESSAGES.ERR7)
    })
  })
})
