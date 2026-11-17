import { beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { S9_ManageSources } from '../../src/pages/S9_ManageSources'
import { ProtectedRoute } from '../../src/components/ProtectedRoute'
import { ToastProvider } from '../../src/components/Toast'
import { MESSAGES } from '../../src/lib/messages'
import type { DataSource, Role } from '../../src/types'

const { mockGetSources, mockAddSource, mockUpdateSource } = vi.hoisted(() => ({
  mockGetSources: vi.fn(),
  mockAddSource: vi.fn(),
  mockUpdateSource: vi.fn(),
}))

vi.mock('../../src/api/sources', () => ({
  getDataSources: mockGetSources,
  addDataSource: mockAddSource,
  updateDataSource: mockUpdateSource,
}))

let mockUser: unknown = null
let mockRole: Role | null = null

vi.mock('../../src/hooks/useAuth', () => ({
  useAuth: () => ({
    user: mockUser,
    role: mockRole,
    loading: false,
    signIn: vi.fn(),
    signOut: vi.fn(),
  }),
}))

const existing: DataSource = {
  id: 'src-1',
  name: 'Straina demo dataset (synthetic)',
  url: 'https://example.org/data',
  description: 'Synthetic demonstration data.',
  geographic_coverage: 'South Africa',
  temporal_coverage_start: '2026-01-01',
  temporal_coverage_end: '2026-06-30',
  last_updated: '2026-06-30',
  is_demo: true,
  created_at: '2026-01-01T00:00:00Z',
}

function renderManageSources() {
  return render(
    <ToastProvider>
      <S9_ManageSources />
    </ToastProvider>,
  )
}

function renderProtectedRoute() {
  return render(
    <MemoryRouter initialEntries={['/admin/sources']}>
      <ToastProvider>
        <Routes>
          <Route
            path="/admin/sources"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <S9_ManageSources />
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

/** Labels are not wired to inputs with htmlFor, so read the sibling input of the label. */
function field(labelText: string): HTMLInputElement {
  const label = screen.getByText(labelText)
  const input = label.parentElement?.querySelector('input')
  if (!input) throw new Error(`No input found for label: ${labelText}`)
  return input
}

async function fillRequiredFields() {
  const user = userEvent.setup()
  await user.type(field('Name *'), 'National surveillance')
  await user.type(field('Geographic Coverage *'), 'South Africa')
  fireEvent.change(field('Temporal Coverage Start *'), { target: { value: '2026-01-01' } })
  fireEvent.change(field('Temporal Coverage End *'), { target: { value: '2026-06-30' } })
  fireEvent.change(field('Last Updated *'), { target: { value: '2026-06-30' } })
}

describe('S9 Manage Data Sources (T-US12-1, T-US12-2, T-US12-3)', () => {
  beforeEach(() => {
    mockGetSources.mockReset()
    mockAddSource.mockReset()
    mockUpdateSource.mockReset()
    mockUser = null
    mockRole = null
  })

  it('T-US12-1: renders every data source', async () => {
    mockGetSources.mockResolvedValue([existing])

    renderManageSources()

    expect(await screen.findByText(existing.name)).toBeInTheDocument()
    expect(screen.getByText('South Africa')).toBeInTheDocument()
    expect(screen.getByText('2026-01-01 – 2026-06-30')).toBeInTheDocument()
    expect(screen.getByText('Yes')).toBeInTheDocument()
  })

  it('T-US12-2: an admin can add a source with all required fields', async () => {
    const user = userEvent.setup()
    mockGetSources.mockResolvedValue([existing])
    mockAddSource.mockResolvedValue({ ...existing, id: 'src-2', name: 'National surveillance' })

    renderManageSources()

    await screen.findByText(existing.name)
    await fillRequiredFields()
    await user.click(screen.getByRole('button', { name: 'Add' }))

    await waitFor(() =>
      expect(mockAddSource).toHaveBeenCalledWith({
        name: 'National surveillance',
        url: null,
        description: null,
        geographic_coverage: 'South Africa',
        temporal_coverage_start: '2026-01-01',
        temporal_coverage_end: '2026-06-30',
        last_updated: '2026-06-30',
        is_demo: false,
      }),
    )
    expect(await screen.findByText(MESSAGES.TOAST_DATA_SOURCE_SAVED)).toBeInTheDocument()
    expect(field('Name *')).toHaveValue('')
  })

  it('T-US12-2: submitting with a missing required field shows ERR13 and sends nothing', async () => {
    const user = userEvent.setup()
    mockGetSources.mockResolvedValue([existing])

    const { container } = renderManageSources()

    await screen.findByText(existing.name)
    await user.type(field('Name *'), 'Incomplete source')
    fireEvent.submit(container.querySelector('form') as HTMLFormElement)

    expect(await screen.findByText(MESSAGES.ERR13)).toBeInTheDocument()
    expect(mockAddSource).not.toHaveBeenCalled()
  })

  it('shows an error toast when the database rejects the insert (T-US12-3)', async () => {
    const user = userEvent.setup()
    mockGetSources.mockResolvedValue([existing])
    mockAddSource.mockRejectedValue(new Error('RLS denied'))

    renderManageSources()

    await screen.findByText(existing.name)
    await fillRequiredFields()
    await user.click(screen.getByRole('button', { name: 'Add' }))

    await waitFor(() => expect(mockAddSource).toHaveBeenCalled())
    expect(await screen.findByText(MESSAGES.ERR11)).toBeInTheDocument()
  })

  it('edits an existing source through updateDataSource', async () => {
    const user = userEvent.setup()
    mockGetSources.mockResolvedValue([existing])
    mockUpdateSource.mockResolvedValue({ ...existing, name: 'Renamed source' })

    renderManageSources()

    await screen.findByText(existing.name)
    await user.click(screen.getAllByRole('button', { name: 'Edit' })[0])

    await user.clear(field('Name *'))
    await user.type(field('Name *'), 'Renamed source')
    await user.click(screen.getByRole('button', { name: 'Update' }))

    await waitFor(() => expect(mockUpdateSource).toHaveBeenCalled())
    expect(mockUpdateSource.mock.calls[0][0]).toBe('src-1')
    expect(mockUpdateSource.mock.calls[0][1]).toMatchObject({ name: 'Renamed source' })
  })

  it('shows ERR11 when the source list cannot load', async () => {
    mockGetSources.mockRejectedValue(new Error('network'))

    renderManageSources()

    expect(await screen.findByText(MESSAGES.ERR11)).toBeInTheDocument()
  })

  it('redirects an unauthenticated visitor to sign-in (T-US12-3)', async () => {
    mockUser = null

    renderProtectedRoute()

    expect(await screen.findByTestId('sign-in-page')).toBeInTheDocument()
    expect(screen.queryByText('Manage Data Sources')).not.toBeInTheDocument()
    expect(mockGetSources).not.toHaveBeenCalled()
  })

  it('redirects a non-admin to access-denied (T-US12-3)', async () => {
    mockUser = { id: 'u2', email: 'submitter@straina.org' }
    mockRole = 'data_submitter'

    renderProtectedRoute()

    expect(await screen.findByTestId('denied-page')).toBeInTheDocument()
    expect(screen.queryByText('Manage Data Sources')).not.toBeInTheDocument()
    expect(mockGetSources).not.toHaveBeenCalled()
  })
})