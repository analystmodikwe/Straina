import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { S1_HomeMap } from '../../src/pages/S1_HomeMap'
import { getObservations } from '../../src/api/observations'
import { getDataSources } from '../../src/api/sources'
import { computeHotspots } from '../../src/lib/hotspot'
import { MESSAGES } from '../../src/lib/messages'
import type { AmrObservation, DataSource, HotspotResult } from '../../src/types'

// RTL cannot render a Leaflet canvas: replace react-leaflet with plain elements.
vi.mock('react-leaflet', () => ({
  MapContainer: ({ children }: { children?: React.ReactNode }) => <div data-testid="map">{children}</div>,
  TileLayer: () => null,
  Marker: ({
    children,
    eventHandlers,
  }: {
    children?: React.ReactNode
    eventHandlers?: { click?: () => void }
  }) => (
    <div role="button" onClick={() => eventHandlers?.click?.()}>
      {children}
    </div>
  ),
  Tooltip: ({ children }: { children?: React.ReactNode }) => <div>{children}</div>,
}))
vi.mock('../../src/api/observations', () => ({ getObservations: vi.fn() }))
vi.mock('../../src/api/sources', () => ({ getDataSources: vi.fn() }))
vi.mock('../../src/lib/hotspot', () => ({ computeHotspots: vi.fn() }))

const source = (is_demo: boolean): DataSource => ({
  id: 'src1',
  name: 'Straina demo dataset (synthetic)',
  url: null,
  description: null,
  geographic_coverage: 'South Africa',
  temporal_coverage_start: '2026-01-01',
  temporal_coverage_end: '2026-06-30',
  last_updated: '2026-06-30',
  is_demo,
  created_at: '2026-01-01T00:00:00Z',
})

const obs = (area_code: string, area_name: string, extra: Partial<AmrObservation> = {}): AmrObservation => ({
  id: `${area_code}-1`,
  data_source_id: 'src1',
  area_code,
  area_name,
  area_level: 'province',
  latitude: -26.2,
  longitude: 28.0,
  period_start: '2026-01-01',
  period_end: '2026-03-31',
  pathogen: 'Escherichia coli',
  antimicrobial: 'Ciprofloxacin',
  isolates_tested: 20,
  isolates_resistant: 8,
  created_by: null,
  created_at: '2026-04-01T00:00:00Z',
  updated_at: '2026-04-01T00:00:00Z',
  ...extra,
})

const result = (area_code: string, status: HotspotResult['status']): HotspotResult => ({
  area_code,
  area_name: area_code,
  status,
  observation_count: 3,
  resistance_pct: 40,
})

function renderS1() {
  return render(
    <MemoryRouter initialEntries={['/']}>
      <Routes>
        <Route path="/" element={<S1_HomeMap />} />
        <Route path="/areas/:areaCode" element={<p>Area detail page</p>} />
        <Route path="/explore" element={<p>Explore page</p>} />
      </Routes>
    </MemoryRouter>,
  )
}

beforeEach(() => {
  vi.mocked(getObservations).mockResolvedValue([obs('JHB', 'Gauteng'), obs('CPT', 'Western Cape')])
  vi.mocked(getDataSources).mockResolvedValue([source(true)])
  vi.mocked(computeHotspots).mockReturnValue([
    result('JHB', 'potential_hotspot'),
    result('CPT', 'not_potential_hotspot'),
  ])
})

describe('S1 Home / Map', () => {
  it('T-US1-1: renders the map', async () => {
    renderS1()
    expect(await screen.findByTestId('map')).toBeInTheDocument()
  })

  it('T-US1-2: shows a potential-hotspot pin above the BR12 threshold', async () => {
    renderS1()
    const pin = await screen.findByTestId('pin-JHB')
    expect(pin).toHaveAttribute('data-status', 'potential_hotspot')
    expect(pin).toHaveTextContent('Potential hotspot')
  })

  it('T-US1-2: shows a normal pin, not a hotspot, below the threshold', async () => {
    renderS1()
    const pin = await screen.findByTestId('pin-CPT')
    expect(pin).toHaveAttribute('data-status', 'not_potential_hotspot')
    expect(pin).toHaveTextContent('Not a potential hotspot')
  })

  it('T-US1-2: an area with too few observations shows ERR5, not a hotspot', async () => {
    vi.mocked(computeHotspots).mockReturnValue([result('JHB', 'insufficient_data')])
    renderS1()
    const pin = await screen.findByTestId('pin-JHB')
    expect(pin).toHaveAttribute('data-status', 'insufficient_data')
    expect(pin).toHaveTextContent(MESSAGES.ERR5)
  })

  it('T-US1-3: shows the map legend with the BR12 values', async () => {
    renderS1()
    const legend = await screen.findByTestId('map-legend')
    expect(legend).toHaveTextContent('25%')
    expect(legend).toHaveTextContent('at least 3 observations')
    expect(legend).toHaveTextContent('6-month window')
  })

  it('T-US1-4: shows ERR3 with a retry when the data cannot load', async () => {
    vi.mocked(getObservations).mockRejectedValue(new Error('network'))
    renderS1()
    expect(await screen.findByText(MESSAGES.ERR3)).toBeInTheDocument()

    vi.mocked(getObservations).mockResolvedValue([obs('JHB', 'Gauteng')])
    await userEvent.click(screen.getByRole('button', { name: 'Try again' }))
    expect(await screen.findByTestId('map')).toBeInTheDocument()
  })

  it('shows ERR2 when there are no records', async () => {
    vi.mocked(getObservations).mockResolvedValue([])
    renderS1()
    expect(await screen.findByText(MESSAGES.ERR2)).toBeInTheDocument()
  })

  it('T-US1-5 / T-US13-1: shows the demo notice when a record comes from a demo source', async () => {
    renderS1()
    expect(await screen.findByTestId('demo-notice')).toHaveTextContent(MESSAGES.DEMO_NOTICE)
  })

  it('T-US13-1: hides the demo notice when no displayed record is demo data', async () => {
    vi.mocked(getDataSources).mockResolvedValue([source(false)])
    renderS1()
    await screen.findByTestId('map')
    expect(screen.queryByTestId('demo-notice')).not.toBeInTheDocument()
  })

  it('T-US5-4: does not display a record with no linked data source', async () => {
    vi.mocked(getObservations).mockResolvedValue([
      obs('JHB', 'Gauteng'),
      obs('DBN', 'KwaZulu-Natal', { data_source_id: 'unknown' }),
    ])
    renderS1()
    await screen.findByTestId('pin-JHB')
    expect(screen.queryByTestId('pin-DBN')).not.toBeInTheDocument()
  })

  it('T-US1-2: clicking a pin goes to /areas/:areaCode', async () => {
    renderS1()
    await userEvent.click(await screen.findByTestId('pin-JHB'))
    expect(await screen.findByText('Area detail page')).toBeInTheDocument()
  })
})