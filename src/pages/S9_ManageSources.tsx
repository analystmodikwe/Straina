import { useEffect, useState } from 'react'
import { Button } from '../components/UI/Button'
import { useToast } from '../components/Toast'
import { getDataSources, addDataSource, updateDataSource, type NewDataSource } from '../api/sources'
import { supabaseClient } from '../lib/supabase'
import { MESSAGES } from '../lib/messages'
import type { DataSource } from '../types'

interface ManageSourcesState {
  sources: DataSource[]
  loading: boolean
  error: string | null
}

interface FormState {
  name: string
  url: string
  description: string
  geographic_coverage: string
  temporal_coverage_start: string
  temporal_coverage_end: string
  last_updated: string
  is_demo: boolean
}

const emptyForm: FormState = {
  name: '',
  url: '',
  description: '',
  geographic_coverage: '',
  temporal_coverage_start: '',
  temporal_coverage_end: '',
  last_updated: '',
  is_demo: false,
}

export function S9_ManageSources() {
  const { showToast } = useToast()
  const [state, setState] = useState<ManageSourcesState>({
    sources: [],
    loading: true,
    error: null,
  })
  const [form, setForm] = useState<FormState>(emptyForm)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formError, setFormError] = useState<string | null>(null)

  const loadSources = async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }))
    try {
      const sources = await getDataSources()
      setState({ sources, loading: false, error: null })
    } catch {
      setState({ sources: [], loading: false, error: MESSAGES.ERR11 })
    }
  }

  useEffect(() => {
    loadSources()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)

    const requiredFields: (keyof FormState)[] = [
      'name',
      'geographic_coverage',
      'temporal_coverage_start',
      'temporal_coverage_end',
      'last_updated',
    ]

    for (const field of requiredFields) {
      if (!form[field]) {
        setFormError(MESSAGES.ERR13)
        return
      }
    }

    const sourceData: NewDataSource = {
      name: form.name,
      url: form.url || null,
      description: form.description || null,
      geographic_coverage: form.geographic_coverage,
      temporal_coverage_start: form.temporal_coverage_start,
      temporal_coverage_end: form.temporal_coverage_end,
      last_updated: form.last_updated,
      is_demo: form.is_demo,
    }

    try {
      if (editingId) {
        await updateDataSource(editingId, sourceData)
      } else {
        await addDataSource(sourceData)
      }
      showToast(MESSAGES.TOAST_DATA_SOURCE_SAVED, 'success')
      resetForm()
      await loadSources()
    } catch {
      showToast(MESSAGES.ERR11, 'error')
    }
  }

  const handleEdit = (source: DataSource) => {
    setForm({
      name: source.name,
      url: source.url || '',
      description: source.description || '',
      geographic_coverage: source.geographic_coverage,
      temporal_coverage_start: source.temporal_coverage_start,
      temporal_coverage_end: source.temporal_coverage_end,
      last_updated: source.last_updated,
      is_demo: source.is_demo,
    })
    setEditingId(source.id)
    setFormError(null)
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this data source?')) return
    try {
      const { error } = await supabaseClient
        .from('data_sources')
        .delete()
        .eq('id', id)
      if (error) throw error
      showToast(MESSAGES.TOAST_RECORD_DELETED, 'success')
      await loadSources()
    } catch {
      showToast(MESSAGES.ERR11, 'error')
    }
  }

  const resetForm = () => {
    setForm(emptyForm)
    setEditingId(null)
    setFormError(null)
  }

  if (state.loading) {
    return (
      <div className="min-h-[200px] flex items-center justify-center text-sm text-[#475569]">
        Loading data sources...
      </div>
    )
  }

  if (state.error) {
    return (
      <div className="p-8 text-center text-error">
        {state.error}
      </div>
    )
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-[#0F172A] mb-6">Manage Data Sources</h1>

      <div className="bg-surface border border-border rounded-lg p-6 mb-6">
        <h2 className="text-lg font-semibold text-[#0F172A] mb-4">
          {editingId ? 'Edit Data Source' : 'Add Data Source'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-[#0F172A] mb-1">Name *</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full min-h-control-touch px-3 py-2 text-sm border border-border rounded bg-surface text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-accent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#0F172A] mb-1">URL</label>
              <input
                type="url"
                value={form.url}
                onChange={(e) => setForm({ ...form, url: e.target.value })}
                className="w-full min-h-control-touch px-3 py-2 text-sm border border-border rounded bg-surface text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-[#0F172A] mb-1">Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full min-h-[80px] px-3 py-2 text-sm border border-border rounded bg-surface text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-accent"
                rows={3}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#0F172A] mb-1">Geographic Coverage *</label>
              <input
                type="text"
                value={form.geographic_coverage}
                onChange={(e) => setForm({ ...form, geographic_coverage: e.target.value })}
                className="w-full min-h-control-touch px-3 py-2 text-sm border border-border rounded bg-surface text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-accent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#0F172A] mb-1">Temporal Coverage Start *</label>
              <input
                type="date"
                value={form.temporal_coverage_start}
                onChange={(e) => setForm({ ...form, temporal_coverage_start: e.target.value })}
                className="w-full min-h-control-touch px-3 py-2 text-sm border border-border rounded bg-surface text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-accent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#0F172A] mb-1">Temporal Coverage End *</label>
              <input
                type="date"
                value={form.temporal_coverage_end}
                onChange={(e) => setForm({ ...form, temporal_coverage_end: e.target.value })}
                className="w-full min-h-control-touch px-3 py-2 text-sm border border-border rounded bg-surface text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-accent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#0F172A] mb-1">Last Updated *</label>
              <input
                type="date"
                value={form.last_updated}
                onChange={(e) => setForm({ ...form, last_updated: e.target.value })}
                className="w-full min-h-control-touch px-3 py-2 text-sm border border-border rounded bg-surface text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-accent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#0F172A] mb-1">
                <input
                  type="checkbox"
                  checked={form.is_demo}
                  onChange={(e) => setForm({ ...form, is_demo: e.target.checked })}
                  className="mr-2"
                />
                Demo Data
              </label>
            </div>
          </div>
          {formError && <p className="text-sm text-error">{formError}</p>}
          <div className="flex gap-2">
            <Button type="submit">{editingId ? 'Update' : 'Add'}</Button>
            {editingId && (
              <Button type="button" variant="secondary" onClick={resetForm}>
                Cancel
              </Button>
            )}
          </div>
        </form>
      </div>

      {state.sources.length === 0 ? (
        <div className="p-8 text-center text-[#475569]">No data sources found.</div>
      ) : (
        <div className="bg-surface border border-border rounded-lg overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-background border-b border-border">
                <th className="px-4 py-3 text-left text-sm font-semibold text-[#0F172A]">Name</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-[#0F172A]">Coverage</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-[#0F172A]">Period</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-[#0F172A]">Demo</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-[#0F172A]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {state.sources.map((source) => (
                <tr key={source.id} className="border-b border-border last:border-0 hover:bg-background">
                  <td className="px-4 py-3 text-sm text-[#0F172A]">{source.name}</td>
                  <td className="px-4 py-3 text-sm text-[#475569]">{source.geographic_coverage}</td>
                  <td className="px-4 py-3 text-sm text-[#475569]">
                    {source.temporal_coverage_start} – {source.temporal_coverage_end}
                  </td>
                  <td className="px-4 py-3 text-sm text-[#475569]">
                    {source.is_demo ? 'Yes' : 'No'}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <Button variant="secondary" onClick={() => handleEdit(source)}>
                        Edit
                      </Button>
                      <Button variant="danger" onClick={() => handleDelete(source.id)}>
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}