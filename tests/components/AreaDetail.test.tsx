import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { S3_AreaDetail } from '../../src/pages/S3_AreaDetail'
import { getAreaDetail } from '../../src/api/observations'

vi.mock('../../src/api/observations', () => ({
  getAreaDetail: vi.fn(),
}))

const mockedGetAreaDetail = vi.mocked(getAreaDetail)

function renderAreaDetail(areaCode = 'GP') {
  return render(
    <MemoryRouter initialEntries={[`/areas/${areaCode}`]}>
      <Routes>
        <Route path="/areas/:areaCode" element={<S3_AreaDetail />} />
      </Routes>
    </MemoryRouter>,
  )
}

const demoSource = {
  id: 'demo-source',
  name: 'Straina demo dataset (synthetic)',
  url: null,
  description: 'Synthetic demonstration data.',
  geographic_coverage: 'South Africa',
  temporal_coverage_start: '2026-01-01',
  temporal_coverage_end: '2026-06-30',
  last_updated: '2026-06-30',
  is_demo: true,
  created_at: '2026-01-01T00:00:00Z',
}

const observation = {
  id: 'obs-1',
  data_source_id: 'demo-source',
  area_code: 'GP',
  area_name: 'Gauteng',
  area_level: 'province' as const,
  latitude: -26.2041,
  longitude: 28.0473,
  period_start: '2026-01-01',
  period_end: '2026-03-31',
  pathogen: 'E. coli',
  antimicrobial: 'Ciprofloxacin',
  isolates_tested: 10,
  isolates_resistant: 3,
  created_by: null,
  created_at: '2026-01-01T00:00:00Z',
  updated_at: '2026-01-01T00:00:00Z',
  data_source: demoSource,
}

describe('T-S3: Area Detail page', () => {
  it('renders area resistance data and the BR13 demo notice', async () => {
    mockedGetAreaDetail.mockResolvedValue([observation])

    renderAreaDetail()

    expect(await screen.findByRole('heading', { name: 'Gauteng' })).toBeInTheDocument()
    expect(screen.getByText('E. coli')).toBeInTheDocument()
    expect(screen.getByText('Ciprofloxacin')).toBeInTheDocument()
    expect(screen.getByText('30.0%')).toBeInTheDocument()
    expect(screen.getByTestId('demo-notice')).toBeInTheDocument()
  })

  it('shows ERR2 when the area has no observations', async () => {
    mockedGetAreaDetail.mockResolvedValue([])

    renderAreaDetail()

    expect(await screen.findByTestId('area-detail-empty')).toBeInTheDocument()
  })
})