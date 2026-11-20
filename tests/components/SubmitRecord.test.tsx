
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { S6_SubmitRecord } from '../../src/pages/S6_SubmitRecord'
import { createObservation } from '../../src/api/observations'
import { getDataSources } from '../../src/api/sources'
import { useToast } from '../../src/components/Toast'

const mockNavigate = vi.fn()
const mockShowToast = vi.fn()

vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}))

vi.mock('../../src/api/observations', () => ({
  createObservation: vi.fn(),
}))

vi.mock('../../src/api/sources', () => ({
  getDataSources: vi.fn(),
}))

vi.mock('../../src/components/Toast', () => ({
  useToast: vi.fn(),
}))

const validForm = {
  data_source_id: 'source-1',
  area_name: 'Gauteng',
  area_code: 'GT',
  area_level: 'province',
  pathogen: 'E. coli',
  antimicrobial: 'Ciprofloxacin',
  period_start: '2025-01-01',
  period_end: '2025-12-31',
  isolates_tested: '100',
  isolates_resistant: '25',
  latitude: '-26.2041',
  longitude: '28.0473',
}

function renderForm() {
  return render(<S6_SubmitRecord />)
}

function fillForm() {
  fireEvent.change(screen.getByLabelText(/data source/i), {
    target: { value: 'source-1' },
  })

  Object.entries(validForm).forEach(([name, value]) => {
    if (name === 'data_source_id') return

    fireEvent.change(document.getElementById(name)!, {
      target: { value },
    })
  })
}

describe('S6 Submit Record', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    vi.mocked(useToast).mockReturnValue({
      showToast: mockShowToast,
    })

    vi.mocked(getDataSources).mockResolvedValue([
      {
        id: 'source-1',
        name: 'Demo Source',
        url: null,
        description: null,
        geographic_coverage: 'South Africa',
        temporal_coverage_start: '2025-01-01',
        temporal_coverage_end: '2025-12-31',
        last_updated: '2025-12-31',
        is_demo: true,
        created_at: '2025-01-01',
      },
    ])
  })

  it('renders the submission form', async () => {
    renderForm()

    expect(
      screen.getByRole('heading', { name: /submit a new record/i }),
    ).toBeTruthy()

    expect(screen.getByLabelText(/pathogen/i)).toBeTruthy()
    expect(screen.getByLabelText(/antimicrobial/i)).toBeTruthy()
    expect(screen.getByLabelText(/isolates tested/i)).toBeTruthy()
    expect(screen.getByLabelText(/isolates resistant/i)).toBeTruthy()

    await waitFor(() => {
      expect(getDataSources).toHaveBeenCalled()
    })
  })

  it('does not submit when required fields are missing', async () => {
    renderForm()

    await waitFor(() => {
      expect(getDataSources).toHaveBeenCalled()
    })

    fireEvent.click(screen.getByRole('button', { name: /submit record/i }))

    expect(createObservation).not.toHaveBeenCalled()
  })

  it('rejects negative isolate values', async () => {
    renderForm()

    await waitFor(() => {
      expect(screen.getByRole('option', { name: 'Demo Source' })).toBeTruthy()
    })

    fillForm()

    fireEvent.change(screen.getByLabelText(/isolates tested/i), {
      target: { value: '-1' },
    })

    const form = screen.getByRole('button', {
      name: /submit record/i,
    }).closest('form')

    fireEvent.submit(form!)

    expect(mockShowToast).toHaveBeenCalledWith(
      'Isolate values cannot be negative.',
      'error',
    )
    expect(createObservation).not.toHaveBeenCalled()
  })

  it('rejects resistant isolates greater than isolates tested', async () => {
    renderForm()

    await waitFor(() => {
      expect(screen.getByRole('option', { name: 'Demo Source' })).toBeTruthy()
    })

    fillForm()

    fireEvent.change(screen.getByLabelText(/isolates resistant/i), {
      target: { value: '101' },
    })

    fireEvent.click(screen.getByRole('button', { name: /submit record/i }))

    expect(mockShowToast).toHaveBeenCalledWith(
      'Resistant isolates cannot exceed isolates tested.',
      'error',
    )
    expect(createObservation).not.toHaveBeenCalled()
  })

  it('submits a valid record and redirects to records', async () => {
    vi.mocked(createObservation).mockResolvedValue({
      id: 'record-1',
      data_source_id: 'source-1',
      area_code: 'GT',
      area_name: 'Gauteng',
      area_level: 'province',
      latitude: -26.2041,
      longitude: 28.0473,
      period_start: '2025-01-01',
      period_end: '2025-12-31',
      pathogen: 'E. coli',
      antimicrobial: 'Ciprofloxacin',
      isolates_tested: 100,
      isolates_resistant: 25,
      created_by: 'user-1',
      created_at: '2025-01-01',
      updated_at: '2025-01-01',
    })

    renderForm()

    await waitFor(() => {
      expect(screen.getByRole('option', { name: 'Demo Source' })).toBeTruthy()
    })

    fillForm()

    fireEvent.click(screen.getByRole('button', { name: /submit record/i }))

    await waitFor(() => {
      expect(createObservation).toHaveBeenCalled()
      expect(mockNavigate).toHaveBeenCalledWith('/records')
      expect(mockShowToast).toHaveBeenCalledWith(
        'Record submitted successfully.',
        'success',
      )
    })
  })
})
