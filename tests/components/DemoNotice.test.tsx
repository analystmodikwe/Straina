import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { DemoNotice } from '../../src/components/DemoNotice'
import { MESSAGES } from '../../src/lib/messages'

describe('T-C-2: DemoNotice component', () => {
  it('renders the exact BR13 demo notice wording', () => {
    render(<DemoNotice />)

    expect(screen.getByText(MESSAGES.DEMO_NOTICE)).toBeInTheDocument()
    expect(screen.getByRole('status')).toBeInTheDocument()
  })
})
