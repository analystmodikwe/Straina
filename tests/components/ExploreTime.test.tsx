import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { S2_Explore } from '../../src/pages/S2_Explore'
import { getObservations } from '../../src/api/observations'
import { getDataSources } from '../../src/api/sources'
import { computeHotspots } from '../../src/lib/hotspot'
import { MESSAGES } from '../../src/lib/messages'
import type { AmrObservation, DataSource } from '../../src/types'

vi.mock('react-leaflet', () => ({
  MapContainer: ({ children }: { children?: React.ReactNode }) => <div data-testid="map">{children}</div>,
  TileLayer: () => null,
  Marker: ({ children }: { children?: React.ReactNode }) => <div>{children}</div>,
  Tooltip: ({ children }: { children?: React.ReactNode }) => <div>{children}</div>,
}))
vi.mock('../../src/api/observations', () => ({ getObservations: vi.fn() }))
vi.mock('../../src/api/sources', () => ({ getDataSources: vi.fn() }))
vi.mock('../../src/lib/hotspot', () => ({ computeHotspots: vi.fn() }))

const demoSource: DataSource = {
  id: 'src1',
  name: 'Straina demo dataset (synthetic)',
  url: null,
  description: null,
  geographic_coverage: 'South Africa',
  temporal_coverage_start: '2026-01-01',
  temporal_coverage_end: '2026-06-30',
  last_updated: '2026-06-30',
  is_demo: true,
  created_at: '2026-01-01T00:00:00Z',
}

const obs = (id: string, area_code: string, period_start: string, extra: Partial<AmrObservation> = {}): AmrObservation => ({
  id,
  data_source_id: 'src1',
  area_code,
  area_name: area_code,
  area_level: 'province',
  latitude: -26.2,
  longitude: 28.0,
  period_start,
  period_end: period_start,
  pathogen: 'Escherichia coli',
  antimicrobial: 'Ciprofloxacin',
  isolates_tested: 20,
  isolates_resistant: 8,
  created_by: null,
  created_at: '2026-07-01T00:00:00Z',
  updated_at: '2026-07-01T00:00:00Z',
  ...extra,
})

// Q1: JHB (E. coli) + CPT (K. pneumoniae). Q2: JHB only, so CPT has no data in Q2.
const DATA = [
  obs('1', 'JHB', '2026-01-10'),
  obs('2', 'CPT', '2026-02-10', { pathogen: 'Klebsiella pneumoniae', antimicrobial: 'Meropenem' }),
  obs('3', 'JHB', '2026-04-10'),
]

function renderS2() {
  return render(
    <MemoryRouter>
      <S2_Explore />
    </MemoryRouter>,
  )
}

beforeEach(() => {
  vi.mocked(getObservations).mockResolvedValue(DATA)
  vi.mocked(getDataSources).mockResolvedValue([demoSource])
  vi.mocked(computeHotspots).mockImplementation((rows) =>
    rows.map((o) => ({
      area_code: o.area_code,
      area_name: o.area_name,
      status: 'not_potential_hotspot' as const,
      observation_count: 1,
      resistance_pct: 40,
    })),
  )
})

describe('S2 Explore over time', () => {
  it('renders the map and the period selector, defaulting to the latest period', async () => {
    renderS2()
    expect(await screen.findByTestId('map')).toBeInTheDocument()
    const select = screen.getByLabelText('Time period') as HTMLSelectElement
    expect(select.value).toBe('2026-Q2')
    expect(screen.getByTestId('map-legend')).toBeInTheDocument()
  })

  it('T-US2-1 / T-US2-2: changing the period updates the visible data', async () => {
    renderS2()
    await screen.findByTestId('map')
    expect(screen.getAllByRole('article')).toHaveLength(1) // Q2: one pattern
    expect(screen.getByTestId('pin-CPT')).toHaveAttribute('data-status', 'no_data')

    await userEvent.selectOptions(screen.getByLabelText('Time period'), '2026-Q1')

    expect(screen.getAllByRole('article')).toHaveLength(2) // Q1: two patterns
    expect(screen.getByTestId('pin-CPT')).toHaveAttribute('data-status', 'not_potential_hotspot')
  })

  it('T-US2-2: renders a PatternCard for each result', async () => {
    renderS2()
    await screen.findByTestId('map')
    await userEvent.selectOptions(screen.getByLabelText('Time period'), '2026-Q1')
    expect(screen.getByText('Escherichia coli')).toBeInTheDocument()
    expect(screen.getByText('Klebsiella pneumoniae')).toBeInTheDocument()
  })

  it('shows a loading state', () => {
    vi.mocked(getObservations).mockReturnValue(new Promise(() => {}))
    renderS2()
    expect(screen.getByText('Loading…')).toBeInTheDocument()
    expect(screen.getByLabelText('Time period')).toBeDisabled()
  })

  it('T-US2-3: shows ERR2 when there is no data', async () => {
    vi.mocked(getObservations).mockResolvedValue([])
    renderS2()
    expect(await screen.findByText(MESSAGES.ERR2)).toBeInTheDocument()
  })

  it('T-US2-4: an area with no data in the period is not drawn as 0%', async () => {
    renderS2()
    const pin = await screen.findByTestId('pin-CPT')
    expect(pin).toHaveAttribute('data-status', 'no_data')
    expect(pin).toHaveTextContent(MESSAGES.ERR2)
    expect(pin).not.toHaveTextContent('0%')
  })

  it('shows ERR3 when the data cannot load', async () => {
    vi.mocked(getObservations).mockRejectedValue(new Error('network'))
    renderS2()
    expect(await screen.findByText(MESSAGES.ERR3)).toBeInTheDocument()
  })

  it('shows the demo notice for demo data (BR13)', async () => {
    renderS2()
    expect(await screen.findByTestId('demo-notice')).toHaveTextContent(MESSAGES.DEMO_NOTICE)
  })
})