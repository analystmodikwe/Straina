import { useEffect, useState } from 'react'
import { AboutSection } from '../components/AboutSection'
import { getDataSources } from '../api/sources'
import type { DataSource } from '../types'

const DEMO_NOTICE =
  'Demo data — simulated (synthetic) for demonstration. Not real surveillance data.'

const INSUFFICIENT_DATA_MESSAGE =
  'There is not enough data to identify a potential hotspot here.'

export function S4_About() {
  const [sources, setSources] = useState<DataSource[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    async function loadSources() {
      try {
        const data = await getDataSources()

        if (isMounted) {
          setSources(data)
        }
      } catch {
        if (isMounted) {
          setError("We couldn't load the latest data. Please try again.")
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    void loadSources()

    return () => {
      isMounted = false
    }
  }, [])

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 md:px-6 md:py-10">
      <div className="mx-auto max-w-4xl">
        <header className="mb-8">
          <h1 className="text-3xl font-semibold leading-9 text-slate-900">
            Data Sources & About
          </h1>

          <p className="mt-3 max-w-3xl text-base leading-6 text-slate-600">
            Learn where Straina&apos;s antimicrobial-resistance information
            comes from and how potential hotspots are identified.
          </p>
        </header>

        <div className="space-y-6">
          <AboutSection title="Data sources">
            {loading && (
              <p data-testid="sources-loading" className="text-slate-600">
                Loading data sources...
              </p>
            )}

            {error && (
              <p
                data-testid="sources-error"
                role="alert"
                className="text-[#B42318]"
              >
                {error}
              </p>
            )}

            {!loading && !error && sources.length === 0 && (
              <p className="text-slate-600">
                No data sources are available.
              </p>
            )}

            {!loading && !error && sources.length > 0 && (
              <ul
                data-testid="source-list"
                className="space-y-4"
              >
                {sources.map((source) => (
                  <li
                    key={source.id}
                    data-testid="source-item"
                    className="rounded-xl border border-slate-300 bg-slate-50 p-4"
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-base font-semibold text-slate-900">
                        {source.name}
                      </h3>

                      {source.is_demo && (
                        <span
                          data-testid="demo-source-label"
                          className="rounded-full bg-[#EDE9FE] px-2.5 py-1 text-xs font-medium text-[#4C1D95]"
                        >
                          Demo (synthetic)
                        </span>
                      )}
                    </div>

                    {source.url && (
                      <a
                        href={source.url}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-2 inline-block text-sm font-medium text-[#0369A1] underline"
                      >
                        View source
                      </a>
                    )}

                    {source.description && (
                      <p className="mt-2 text-sm leading-5 text-slate-600">
                        {source.description}
                      </p>
                    )}

                    <p className="mt-3 text-sm text-slate-600">
                      Geographic coverage: {source.geographic_coverage}
                    </p>

                    <p className="mt-1 text-sm text-slate-600">
                      Coverage: {source.temporal_coverage_start} to{' '}
                      {source.temporal_coverage_end}
                    </p>

                    <p className="mt-1 text-sm text-slate-600">
                      Last updated: {source.last_updated}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </AboutSection>

          <AboutSection title="Potential hotspot methodology">
            <p>
              Straina identifies a potential hotspot when the available
              observations meet the approved minimum observation count and the
              resistance percentage reaches the approved threshold.
            </p>

            <p className="mt-3">
              The current approved baseline requires at least{' '}
              <strong>3 observations</strong> and a resistance percentage of at
              least <strong>25%</strong> within the defined six-month window.
            </p>

            <p className="mt-3">
              When fewer than 3 observations are available, Straina does not
              treat the area as having zero resistance. Instead, it reports
              insufficient data.
            </p>

            <p className="mt-3">
              {INSUFFICIENT_DATA_MESSAGE}
            </p>
          </AboutSection>

          <AboutSection title="About Straina">
            <p>
              Straina is an antimicrobial-resistance surveillance and
              information tool that helps users explore resistance patterns
              across locations and over time.
            </p>

            <p className="mt-3">
              Straina is a surveillance and information tool, not a diagnostic
              or treatment tool.
            </p>
          </AboutSection>

          {sources.some((source) => source.is_demo) && (
            <aside
              data-testid="demo-notice"
              className="rounded-xl border border-[#C4B5FD] bg-[#EDE9FE] p-4 text-sm leading-5 text-[#4C1D95]"
            >
              {DEMO_NOTICE}
            </aside>
          )}
        </div>
      </div>
    </main>
  )
}