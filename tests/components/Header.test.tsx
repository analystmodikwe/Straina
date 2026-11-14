import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { Header } from '../../src/components/Header'

describe('T-C-1: Header component', () => {
  it('renders the wordmark Straina, navigation links, and visitor Sign in button', () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    )

    // Wordmark
    expect(screen.getByText('Straina')).toBeInTheDocument()

    // Nav links
    expect(screen.getByRole('link', { name: /explore/i })).toHaveAttribute('href', '/explore')
    expect(screen.getByRole('link', { name: /about/i })).toHaveAttribute('href', '/about')

    // Visitor sign-in
    expect(screen.getByRole('link', { name: /sign in/i })).toHaveAttribute('href', '/sign-in')
  })
})
