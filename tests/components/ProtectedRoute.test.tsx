import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { ProtectedRoute } from '../../src/components/ProtectedRoute'
import type { Role } from '../../src/types'

let mockUser: unknown = null
let mockRole: Role | null = null
let mockLoading = false

vi.mock('../../src/hooks/useAuth', () => ({
  useAuth: () => ({
    user: mockUser,
    role: mockRole,
    loading: mockLoading,
    signIn: vi.fn(),
    signOut: vi.fn(),
  }),
}))

describe('ProtectedRoute Component (T-US7-2, T-PERM-1a, T-PERM-1b)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockUser = null
    mockRole = null
    mockLoading = false
  })

  it('T-US7-2 / T-PERM-1a: unauthenticated user redirects to /sign-in', () => {
    mockUser = null

    render(
      <MemoryRouter initialEntries={['/records/new']}>
        <Routes>
          <Route
            path="/records/new"
            element={
              <ProtectedRoute allowedRoles={['admin', 'data_submitter']}>
                <div data-testid="protected-content">Secret Form</div>
              </ProtectedRoute>
            }
          />
          <Route path="/sign-in" element={<div data-testid="sign-in-page">Sign In Page</div>} />
        </Routes>
      </MemoryRouter>
    )

    expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument()
    expect(screen.getByTestId('sign-in-page')).toBeInTheDocument()
  })

  it('T-PERM-1b: signed-in user with incorrect role redirects to /access-denied', () => {
    mockUser = { id: 'u2', email: 'analyst@straina.org' }
    mockRole = 'analyst'

    render(
      <MemoryRouter initialEntries={['/admin/users']}>
        <Routes>
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <div data-testid="admin-panel">Admin Only Panel</div>
              </ProtectedRoute>
            }
          />
          <Route path="/access-denied" element={<div data-testid="denied-page">Access Denied</div>} />
        </Routes>
      </MemoryRouter>
    )

    expect(screen.queryByTestId('admin-panel')).not.toBeInTheDocument()
    expect(screen.getByTestId('denied-page')).toBeInTheDocument()
  })

  it('signed-in user with allowed role renders child content', () => {
    mockUser = { id: 'u1', email: 'admin@straina.org' }
    mockRole = 'admin'

    render(
      <MemoryRouter initialEntries={['/admin/users']}>
        <Routes>
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <div data-testid="admin-panel">Admin Only Panel</div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    )

    expect(screen.getByTestId('admin-panel')).toBeInTheDocument()
  })
})

