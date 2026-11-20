
import { useEffect, useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { createObservation } from '../api/observations'
import { getDataSources } from '../api/sources'
import { useToast } from '../components/Toast'
import type { DataSource, NewAmrObservation } from '../types'

const initialForm = {
  data_source_id: '',
  area_code: '',
  area_name: '',
  area_level: 'province' as NewAmrObservation['area_level'],
  latitude: '',
  longitude: '',
  period_start: '',
  period_end: '',
  pathogen: '',
  antimicrobial: '',
  isolates_tested: '',
  isolates_resistant: '',
}

export function S6_SubmitRecord() {
  const navigate = useNavigate()
  const { showToast } = useToast()

  const [form, setForm] = useState(initialForm)
  const [sources, setSources] = useState<DataSource[]>([])
  const [loading, setLoading] = useState(false)
  const [loadingSources, setLoadingSources] = useState(true)

  useEffect(() => {
    async function loadSources() {
      try {
        const data = await getDataSources()
        setSources(data)
      } catch {
        showToast('Could not load data sources.', 'error')
      } finally {
        setLoadingSources(false)
      }
    }

    loadSources()
  }, [showToast])

  function handleChange(
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) {
    const { name, value } = event.target
    setForm((previous) => ({ ...previous, [name]: value }))
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const tested = Number(form.isolates_tested)
    const resistant = Number(form.isolates_resistant)
    const latitude = Number(form.latitude)
    const longitude = Number(form.longitude)

    if (
      !form.data_source_id ||
      !form.area_code.trim() ||
      !form.area_name.trim() ||
      !form.period_start ||
      !form.period_end ||
      !form.pathogen.trim() ||
      !form.antimicrobial.trim() ||
      form.isolates_tested === '' ||
      form.isolates_resistant === '' ||
      form.latitude === '' ||
      form.longitude === ''
    ) {
      showToast('Please complete all required fields.', 'error')
      return
    }

    if (tested < 0 || resistant < 0) {
      showToast('Isolate values cannot be negative.', 'error')
      return
    }

    if (resistant > tested) {
      showToast('Resistant isolates cannot exceed isolates tested.', 'error')
      return
    }

    if (
      !Number.isFinite(latitude) ||
      !Number.isFinite(longitude) ||
      latitude < -90 ||
      latitude > 90 ||
      longitude < -180 ||
      longitude > 180
    ) {
      showToast('Please enter valid latitude and longitude values.', 'error')
      return
    }

    if (form.period_end < form.period_start) {
      showToast('The period end date cannot be before the start date.', 'error')
      return
    }

    const observation: NewAmrObservation = {
      data_source_id: form.data_source_id,
      area_code: form.area_code.trim(),
      area_name: form.area_name.trim(),
      area_level: form.area_level,
      latitude,
      longitude,
      period_start: form.period_start,
      period_end: form.period_end,
      pathogen: form.pathogen.trim(),
      antimicrobial: form.antimicrobial.trim(),
      isolates_tested: tested,
      isolates_resistant: resistant,
    }

    setLoading(true)

    try {
      await createObservation(observation)
      showToast('Record submitted successfully.', 'success')
      navigate('/records')
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : 'Could not submit the record.',
        'error',
      )
    } finally {
      setLoading(false)
    }
  }

  const inputClass =
    'w-full rounded-lg border border-[#CBD5E1] bg-white px-3 py-2.5 text-sm text-[#0F172A] outline-none focus:border-[#0F4C5C] focus:ring-2 focus:ring-[#0F4C5C]/10'

  const labelClass = 'mb-1.5 block text-sm font-medium text-[#334155]'

  return (
    <div className="mx-auto w-full max-w-4xl px-5 py-8">
      <div className="mb-7">
        <p className="mb-2 text-sm font-medium text-[#0F4C5C]">
          DATA MANAGEMENT
        </p>
        <h1 className="text-2xl font-semibold text-[#0F172A]">
          Submit a new record
        </h1>
        <p className="mt-2 text-sm text-[#64748B]">
          Enter the observation details below to add a new AMR record.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-7 rounded-xl border border-[#E2E8F0] bg-white p-6 shadow-sm"
      >
        <section>
          <h2 className="mb-4 text-lg font-semibold text-[#0F172A]">
            Record information
          </h2>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className={labelClass} htmlFor="data_source_id">
                Data source *
              </label>
              <select
                id="data_source_id"
                name="data_source_id"
                value={form.data_source_id}
                onChange={handleChange}
                className={inputClass}
                required
                disabled={loadingSources}
              >
                <option value="">
                  {loadingSources ? 'Loading sources...' : 'Select a data source'}
                </option>
                {sources.map((source) => (
                  <option key={source.id} value={source.id}>
                    {source.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={labelClass} htmlFor="area_name">
                Area name *
              </label>
              <input
                id="area_name"
                name="area_name"
                value={form.area_name}
                onChange={handleChange}
                className={inputClass}
                placeholder="e.g. Gauteng"
                required
              />
            </div>

            <div>
              <label className={labelClass} htmlFor="area_code">
                Area code *
              </label>
              <input
                id="area_code"
                name="area_code"
                value={form.area_code}
                onChange={handleChange}
                className={inputClass}
                placeholder="e.g. GT"
                required
              />
            </div>

            <div>
              <label className={labelClass} htmlFor="area_level">
                Area level *
              </label>
              <select
                id="area_level"
                name="area_level"
                value={form.area_level}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="province">Province</option>
                <option value="district">District</option>
                <option value="national">National</option>
              </select>
            </div>

            <div>
              <label className={labelClass} htmlFor="pathogen">
                Pathogen *
              </label>
              <input
                id="pathogen"
                name="pathogen"
                value={form.pathogen}
                onChange={handleChange}
                className={inputClass}
                placeholder="Enter pathogen"
                required
              />
            </div>

            <div>
              <label className={labelClass} htmlFor="antimicrobial">
                Antimicrobial *
              </label>
              <input
                id="antimicrobial"
                name="antimicrobial"
                value={form.antimicrobial}
                onChange={handleChange}
                className={inputClass}
                placeholder="Enter antimicrobial"
                required
              />
            </div>
          </div>
        </section>

        <section className="border-t border-[#E2E8F0] pt-6">
          <h2 className="mb-4 text-lg font-semibold text-[#0F172A]">
            Observation period
          </h2>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className={labelClass} htmlFor="period_start">
                Start date *
              </label>
              <input
                id="period_start"
                name="period_start"
                type="date"
                value={form.period_start}
                onChange={handleChange}
                className={inputClass}
                required
              />
            </div>

            <div>
              <label className={labelClass} htmlFor="period_end">
                End date *
              </label>
              <input
                id="period_end"
                name="period_end"
                type="date"
                value={form.period_end}
                onChange={handleChange}
                className={inputClass}
                required
              />
            </div>
          </div>
        </section>

        <section className="border-t border-[#E2E8F0] pt-6">
          <h2 className="mb-4 text-lg font-semibold text-[#0F172A]">
            Isolate results
          </h2>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className={labelClass} htmlFor="isolates_tested">
                Isolates tested *
              </label>
              <input
                id="isolates_tested"
                name="isolates_tested"
                type="number"
                min="0"
                step="1"
                value={form.isolates_tested}
                onChange={handleChange}
                className={inputClass}
                placeholder="0"
                required
              />
            </div>

            <div>
              <label className={labelClass} htmlFor="isolates_resistant">
                Isolates resistant *
              </label>
              <input
                id="isolates_resistant"
                name="isolates_resistant"
                type="number"
                min="0"
                step="1"
                value={form.isolates_resistant}
                onChange={handleChange}
                className={inputClass}
                placeholder="0"
                required
              />
            </div>
          </div>
        </section>

        <section className="border-t border-[#E2E8F0] pt-6">
          <h2 className="mb-4 text-lg font-semibold text-[#0F172A]">
            Location coordinates
          </h2>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className={labelClass} htmlFor="latitude">
                Latitude *
              </label>
              <input
                id="latitude"
                name="latitude"
                type="number"
                step="any"
                value={form.latitude}
                onChange={handleChange}
                className={inputClass}
                placeholder="e.g. -26.2041"
                required
              />
            </div>

            <div>
              <label className={labelClass} htmlFor="longitude">
                Longitude *
              </label>
              <input
                id="longitude"
                name="longitude"
                type="number"
                step="any"
                value={form.longitude}
                onChange={handleChange}
                className={inputClass}
                placeholder="e.g. 28.0473"
                required
              />
            </div>
          </div>
        </section>

        <div className="flex flex-col-reverse justify-end gap-3 border-t border-[#E2E8F0] pt-6 sm:flex-row">
          <button
            type="button"
            onClick={() => navigate('/records')}
            className="rounded-lg border border-[#CBD5E1] px-5 py-2.5 text-sm font-medium text-[#334155] hover:bg-[#F8FAFC]"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading || loadingSources}
            className="rounded-lg bg-[#0F4C5C] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#0B3B48] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? 'Submitting...' : 'Submit record'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default S6_SubmitRecord
