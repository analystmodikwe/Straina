import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import { OfflineBanner } from '../../src/components/OfflineBanner'
import { MESSAGES } from '../../src/lib/messages'

describe('T-C-3: OfflineBanner component (useOnline integration)', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    Object.defineProperty(navigator, 'onLine', {
      writable: true,
      value: true,
    })
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  it('displays the ERR1 copy when offline via isOffline prop', () => {
    render(<OfflineBanner isOffline={true} />)

    expect(screen.getByText(MESSAGES.ERR1)).toBeInTheDocument()
    expect(screen.getByRole('alert')).toBeInTheDocument()
  })

  it('is not rendered when online via isOffline prop', () => {
    const { container } = render(<OfflineBanner isOffline={false} />)

    expect(screen.queryByText(MESSAGES.ERR1)).not.toBeInTheDocument()
    expect(container.firstChild).toBeNull()
  })

  it('responds to window offline event when isOffline prop not provided', () => {
    render(<OfflineBanner />)

    expect(screen.queryByText(MESSAGES.ERR1)).not.toBeInTheDocument()

    act(() => {
      window.dispatchEvent(new Event('offline'))
    })

    expect(screen.getByText(MESSAGES.ERR1)).toBeInTheDocument()
    expect(screen.getByRole('alert')).toBeInTheDocument()
  })

  it('responds to window online event when isOffline prop not provided', () => {
    render(<OfflineBanner />)

    act(() => {
      window.dispatchEvent(new Event('offline'))
    })

    expect(screen.getByText(MESSAGES.ERR1)).toBeInTheDocument()

    act(() => {
      window.dispatchEvent(new Event('online'))
    })

    expect(screen.queryByText(MESSAGES.ERR1)).not.toBeInTheDocument()
  })
})