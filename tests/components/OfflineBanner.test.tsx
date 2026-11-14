import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { OfflineBanner } from '../../src/components/OfflineBanner'
import { MESSAGES } from '../../src/lib/messages'

describe('T-C-3: OfflineBanner component', () => {
  it('displays the ERR1 copy when offline', () => {
    render(<OfflineBanner isOffline={true} />)

    expect(screen.getByText(MESSAGES.ERR1)).toBeInTheDocument()
    expect(screen.getByRole('alert')).toBeInTheDocument()
  })

  it('is not rendered or visible when online', () => {
    const { container } = render(<OfflineBanner isOffline={false} />)

    expect(screen.queryByText(MESSAGES.ERR1)).not.toBeInTheDocument()
    expect(container.firstChild).toBeNull()
  })
})
