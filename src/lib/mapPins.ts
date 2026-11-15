import type { CSSProperties } from 'react'
import type { HotspotStatus } from '../types'
import { tokens } from '../theme/tokens'

/** 'has_data' = area with data when the hotspot layer is off. */
export type PinStatus = 'has_data' | HotspotStatus

export const PIN_ORDER: PinStatus[] = [
  'has_data',
  'potential_hotspot',
  'not_potential_hotspot',
  'insufficient_data',
  'no_data',
]

export const PIN_LABELS: Record<PinStatus, string> = {
  has_data: 'Area with data',
  potential_hotspot: 'Potential hotspot',
  not_potential_hotspot: 'Not a potential hotspot',
  insufficient_data: 'Insufficient data',
  no_data: 'No data',
}

const c = tokens.color
const SIZE = 20

/** Marker styles from style-guide section 6. Hotspot = colour + hatch + label (never colour alone). */
export function pinStyle(status: PinStatus): CSSProperties {
  const base: CSSProperties = {
    display: 'inline-block',
    boxSizing: 'border-box',
    width: SIZE,
    height: SIZE,
    borderRadius: '50%',
  }
  switch (status) {
    case 'potential_hotspot':
      return {
        ...base,
        background: `repeating-linear-gradient(45deg, ${c.hotspot} 0 5px, ${c.surface} 5px 7px)`,
        border: `2px solid ${c.surface}`,
      }
    case 'not_potential_hotspot':
      return { ...base, background: c.notHotspot, border: `2px solid ${c.surface}` }
    case 'insufficient_data':
      return { ...base, background: c.insufficientDataBg, border: `2px dashed ${c.insufficientData}` }
    case 'no_data':
      return { ...base, background: 'transparent', border: `2px solid ${c.noData}` }
    default:
      return { ...base, background: c.primary, border: `2px solid ${c.surface}` }
  }
}

/** HTML string for Leaflet's divIcon. */
export function pinHtml(status: PinStatus): string {
  const css = Object.entries(pinStyle(status))
    .map(([key, value]) => {
      const prop = key.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`)
      return `${prop}:${typeof value === 'number' ? `${value}px` : value}`
    })
    .join(';')
  return `<span style="${css}"></span>`
}

export const PIN_SIZE = SIZE