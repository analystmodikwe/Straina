import { describe, it, expect } from 'vitest'
import { tokens } from '../../src/theme/tokens'

describe('T-SETUP-1: Design tokens', () => {
  it('defines the correct brand and semantic colors from style-guide.md', () => {
    expect(tokens.color.primary).toBe('#0F4C5C')
    expect(tokens.color.primaryHover).toBe('#0B3A47')
    expect(tokens.color.secondary).toBe('#334155')
    expect(tokens.color.accent).toBe('#0369A1')
    expect(tokens.color.background).toBe('#F8FAFC')
    expect(tokens.color.surface).toBe('#FFFFFF')
    expect(tokens.color.text).toBe('#0F172A')
    expect(tokens.color.textMuted).toBe('#475569')
    expect(tokens.color.border).toBe('#CBD5E1')
    expect(tokens.color.borderControl).toBe('#64748B')
    expect(tokens.color.error).toBe('#B42318')
    expect(tokens.color.offline).toBe('#7A2E0E')
    expect(tokens.color.demo).toBe('#4C1D95')
    expect(tokens.color.success).toBe('#085D3A')
    expect(tokens.color.hotspot).toBe('#C2410C')
  })

  it('defines typography, border radii and spacing scale', () => {
    expect(tokens.font.family).toContain('Inter')
    expect(tokens.radius.control).toBe('6px')
    expect(tokens.radius.card).toBe('12px')
    expect(tokens.spacing.base).toBe(4)
  })
})
