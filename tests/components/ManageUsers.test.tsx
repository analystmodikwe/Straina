import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { S8_ManageUsers } from '../../src/pages/S8_ManageUsers'
import { ProtectedRoute } from '../../src/components/ProtectedRoute'
import { ToastProvider } from '../../src/components/Toast'
import { MESSAGES } from '../../src/lib/messages'
import type { Profile, Role } from '../../src/types'

const { mockGetUsers, mockUpdateRole } = vi.hoisted(() => ({
  mockGetUsers: vi.fn(),
  mockUpdateRole: vi.fn(),
}))

vi.mock('../../src/api/users', () => ({
  getUsers: mockGetUsers,
  updateRole: mockUpdateRole,
}))

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

const admin: Profile = {
  id: 'u1',
  email: 'admin@straina.org',
  role: 'admin',
  created_at: '2026-01-01T00:00:00Z',
}

const submitter: Profile = {
  id: 'u2',
  email: 'submitter@straina.org',
  role: 'data_submitter',
  created_at: '2026-02-01T00:00:00Z',
}

const analyst: Profile = {
  id: 'u3',
  email: 'analyst@straina.org',
  role: 'analyst',
  created_at: '2026-03-01T00:00:00Z',
}

function renderManageUsers() {
  return render(
    <ToastProvider>
      <S8_ManageUsers />
    </ToastProvider>,
  )
}

function renderProtectedRoute() {
  return render(
    <MemoryRouter initialEntries={['/admin/users']}>
      <ToastProvider>
        <Routes>
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <S8_ManageUsers />
              </ProtectedRoute>
            }
          />
          <Route path="/sign-in" element={<div data-testid="sign-in-page">Sign In</div>} />
          <Route path="/access-denied" element={<div data-testid="denied-page">Access Denied</div>} />
        </Routes>
      </ToastProvider>
    </MemoryRouter>,
  )
}

describe('S8 Manage Users (T-US11-1, T-US11-2, T-US11-3)', () => {
  beforeEach(() => {
    mockGetUsers.mockReset()
    mockUpdateRole.mockReset()
    mockUser = null
    mockRole = null
    mockLoading = false
  })

  it('T-US11-1: renders every profile with its current role selected', async () => {
    mockGetUsers.mockResolvedValue([admin, submitter, analyst])

    renderManageUsers()

    expect(await screen.findByText('admin@straina.org')).toBeInTheDocument()
    expect(screen.getByText('submitter@straina.org')).toBeInTheDocument()
    expect(screen.getByText('analyst@straina.org')).toBeInTheDocument()

    const selects = screen.getAllByRole('combobox')
    expect(selects).toHaveLength(3)
    expect(selects[0]).toHaveValue('admin')
    expect(selects[1]).toHaveValue('data_submitter')
    expect(selects[2]).toHaveValue('analyst')
  })

  it('T-US11-2: changing a role calls updateRole and shows a success toast', async () => {
    const user = userEvent.setup()
    mockGetUsers.mockResolvedValue([admin, submitter])
    mockUpdateRole.mockResolvedValue(undefined)

    renderManageUsers()

    await screen.findByText('submitter@straina.org')
    await user.selectOptions(screen.getAllByRole('combobox')[1], 'analyst')

    await waitFor(() => expect(mockUpdateRole).toHaveBeenCalledWith('u2', 'analyst'))
    expect(await screen.findByText(MESSAGES.TOAST_ROLE_UPDATED)).toBeInTheDocument()
  })

  it('shows an error toast when updateRole is rejected', async () => {
    const user = userEvent.setup()
    mockGetUsers.mockResolvedValue([admin, submitter])
    mockUpdateRole.mockRejectedValue(new Error('RLS denied'))

    renderManageUsers()

    await screen.findByText('submitter@straina.org')
    await user.selectOptions(screen.getAllByRole('combobox')[1], 'analyst')

    await waitFor(() => expect(mockUpdateRole).toHaveBeenCalled())
    expect(await screen.findByText(MESSAGES.ERR11)).toBeInTheDocument()
  })

  it('T-US11-3: the sole admin cannot be demoted', async () => {
    mockGetUsers.mockResolvedValue([admin])

    renderManageUsers()

    await screen.findByText('admin@straina.org')
    expect(screen.getByRole('combobox')).toBeDisabled()
    expect(screen.getByText('Cannot demote sole admin')).toBeInTheDocument()
    expect(mockUpdateRole).not.toHaveBeenCalled()
  })

  it('shows ERR11 when the user list cannot load', async () => {
    mockGetUsers.mockRejectedValue(new Error('network'))

    renderManageUsers()

    expect(await screen.findByText(MESSAGES.ERR11)).toBeInTheDocument()
  })

  it('redirects an unauthenticated visitor to sign-in (T-US11-3)', async () => {
    mockUser = null

    renderProtectedRoute()

    expect(await screen.findByTestId('sign-in-page')).toBeInTheDocument()
    expect(screen.queryByText('Manage Users')).not.toBeInTheDocument()
    expect(mockGetUsers).not.toHaveBeenCalled()
  })

  it('redirects a non-admin to access-denied (T-US11-3)', async () => {
    mockUser = { id: 'u3', email: 'analyst@straina.org' }
    mockRole = 'analyst'

    renderProtectedRoute()

    expect(await screen.findByTestId('denied-page')).toBeInTheDocument()
    expect(screen.queryByText('Manage Users')).not.toBeInTheDocument()
    expect(mockGetUsers).not.toHaveBeenCalled()
  })
})