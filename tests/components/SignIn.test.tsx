import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { S5_SignIn } from '../../src/pages/S5_SignIn'
import { MESSAGES } from '../../src/lib/messages'

const mockSignIn = vi.fn()
let mockUser: unknown = null
let mockLoading = false

vi.mock('../../src/hooks/useAuth', () => ({
  useAuth: () => ({
    user: mockUser,
    role: null,
    loading: mockLoading,
    signIn: mockSignIn,
    signOut: vi.fn(),
  }),
}))

describe('S5_SignIn Component (T-US6-1, T-US6-2, T-US6-3)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockUser = null
    mockLoading = false
  })

  it('renders email and password inputs and submit button', () => {
    render(
      <MemoryRouter>
        <S5_SignIn />
      </MemoryRouter>
    )

    expect(screen.getByTestId('email-input')).toBeInTheDocument()
    expect(screen.getByTestId('password-input')).toBeInTheDocument()
    expect(screen.getByTestId('signin-submit')).toBeInTheDocument()
  })

  it('T-US6-1: empty fields show ERR13 and send no request', async () => {
    const user = userEvent.setup()

    render(
      <MemoryRouter>
        <S5_SignIn />
      </MemoryRouter>
    )

    await user.click(screen.getByTestId('signin-submit'))

    expect(screen.getByTestId('email-error')).toHaveTextContent(MESSAGES.ERR13)
    expect(screen.getByTestId('password-error')).toHaveTextContent(MESSAGES.ERR13)
    expect(mockSignIn).not.toHaveBeenCalled()
  })

  it('T-US6-2: wrong credentials display ERR7', async () => {
    const user = userEvent.setup()
    mockSignIn.mockRejectedValue(new Error(MESSAGES.ERR7))

    render(
      <MemoryRouter>
        <S5_SignIn />
      </MemoryRouter>
    )

    await user.type(screen.getByTestId('email-input'), 'wrong@straina.org')
    await user.type(screen.getByTestId('password-input'), 'badpassword')
    await user.click(screen.getByTestId('signin-submit'))

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(MESSAGES.ERR7)
    })
  })

  it('T-US6-3: successful sign in calls signIn and redirects', async () => {
    const user = userEvent.setup()
    mockSignIn.mockResolvedValue({
      user: { id: 'u1', email: 'admin@straina.org' },
      role: 'admin',
    })

    render(
      <MemoryRouter initialEntries={['/sign-in']}>
        <Routes>
          <Route path="/sign-in" element={<S5_SignIn />} />
          <Route path="/" element={<div data-testid="home-page">Home Map</div>} />
        </Routes>
      </MemoryRouter>
    )

    await user.type(screen.getByTestId('email-input'), 'admin@straina.org')
    await user.type(screen.getByTestId('password-input'), 'validpassword123')
    await user.click(screen.getByTestId('signin-submit'))

    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith('admin@straina.org', 'validpassword123')
      expect(screen.getByTestId('home-page')).toBeInTheDocument()
    })
  })
})

