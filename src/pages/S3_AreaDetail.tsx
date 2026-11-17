import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { DemoNotice } from '../components/DemoNotice'
import { PatternCard } from '../components/PatternCard'
import { getAreaDetail } from '../api/observations'
import { MESSAGES } from '../lib/messages'
import type { AreaObservation } from '../api/observations'

const HOTSPOT_THRESHOLD_PCT = 25
const HOTSPOT_MIN_OBSERVATIONS = 3

interface Pattern {
  key: string
  pathogen: string
  antimicrobial: string
  tested: number
  resistant: number
  observations: AreaObservation[]
}

function groupPatterns(observations: AreaObservation[]): Pattern[] {
  const groups = new Map<string, Pattern>()

  for (const observation of observations) {
    const key = `${observation.pathogen}|${observation.antimicrobial}`

    const group = groups.get(key) ?? {
      key,
      pathogen: observation.pathogen,
      antimicrobial: observation.antimicrobial,
      tested: 0,
      resistant: 0,
      observations: [],
    }

    group.tested += observation.isolates_tested
    group.resistant += observation.isolates_resistant
    group.observations.push(observation)

    groups.set(key, group)
  }

  return [...groups.values()]
}

function isPotentialHotspot(pattern: Pattern): boolean {
  if (pattern.observations.length < HOTSPOT_MIN_OBSERVATIONS) {
    return false
  }

  if (pattern.tested <= 0) {
    return false
  }

  const resistancePct = (pattern.resistant / pattern.tested) * 100

  return resistancePct >= HOTSPOT_THRESHOLD_PCT
}

function getHotspotStatus(
  pattern: Pattern,
): 'potential' | 'not-potential' | 'insufficient' {
  if (pattern.observations.length < HOTSPOT_MIN_OBSERVATIONS) {
    return 'insufficient'
  }

  return isPotentialHotspot(pattern) ? 'potential' : 'not-potential'
}

/** S3 Area Detail at "/areas/:areaCode" (US3, US4, US5). */
export function S3_AreaDetail() {
  const { areaCode } = useParams<{ areaCode: string }>()

  const [observations, setObservations] = useState<AreaObservation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    async function loadArea() {
      if (!areaCode) {
        if (isMounted) {
          setError(MESSAGES.ERR2)
          setLoading(false)
        }
        return
      }

      setLoading(true)
      setError(null)

      try {
        const data = await getAreaDetail(areaCode)

        if (isMounted) {
          setObservations(data)
        }
      } catch (err) {
        if (isMounted) {
          setError(
            err instanceof Error && err.message
              ? err.message
              : MESSAGES.ERR4,
          )
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    void loadArea()

    return () => {
      isMounted = false
    }
  }, [areaCode])

  const areaName = observations[0]?.area_name ?? areaCode ?? 'Area'

  const patterns = useMemo(
    () => groupPatterns(observations),
    [observations],
  )

  const sources = useMemo(() => {
    const sourceMap = new Map<string, AreaObservation['data_source']>()

    for (const observation of observations) {
      sourceMap.set(observation.data_source.id, observation.data_source)
    }

    return [...sourceMap.values()]
  }, [observations])

  const hasDemoData = observations.some(
    (observation) => observation.data_source.is_demo,
  )

  if (loading) {
    return (
      <main className="mx-auto w-full max-w-content px-4 py-8 md:px-8">
        <p
          data-testid="area-detail-loading"
          className="text-base text-muted"
        >
          Loading area data...
        </p>
      </main>
    )
  }

  if (error) {
    return (
      <main className="mx-auto w-full max-w-content px-4 py-8 md:px-8">
        <div
          data-testid="area-detail-error"
          role="alert"
          className="rounded-xl border border-[#FECACA] bg-[#FEF2F2] p-4 text-[#B42318]"
        >
          {error}
        </div>
      </main>
    )
  }

  if (observations.length === 0) {
    return (
      <main className="mx-auto w-full max-w-content px-4 py-8 md:px-8">
        <div
          data-testid="area-detail-empty"
          className="rounded-xl border border-border bg-surface p-6"
        >
          <h1 className="text-3xl font-semibold text-text">{areaName}</h1>
          <p className="mt-3 text-base text-muted">{MESSAGES.ERR2}</p>
        </div>
      </main>
    )
  }

  return (
    <main className="mx-auto w-full max-w-content px-4 py-8 md:px-8">
      <DemoNotice show={hasDemoData} />

      <header>
        <p className="text-sm font-medium text-muted">Area detail</p>
        <h1 className="mt-1 text-3xl font-semibold text-text">{areaName}</h1>

        <p className="mt-3 text-base text-muted">
          Resistance patterns and potential hotspot status for this area.
        </p>
      </header>

      <section className="mt-8">
        <h2 className="text-xl font-semibold text-text">
          Resistance patterns
        </h2>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {patterns.map((pattern) => {
            const status = getHotspotStatus(pattern)
            const potential = status === 'potential'

            return (
              <div key={pattern.key}>
                <PatternCard
                  pathogen={pattern.pathogen}
                  antimicrobial={pattern.antimicrobial}
                  isolatesTested={pattern.tested}
                  isolatesResistant={pattern.resistant}
                  isPotentialHotspot={potential}
                />

                <div className="mt-2">
                  {status === 'insufficient' && (
                    <p
                      data-testid="hotspot-insufficient"
                      className="text-sm font-medium text-slate-600"
                    >
                      {MESSAGES.ERR5}
                    </p>
                  )}

                  {status === 'not-potential' && (
                    <p
                      data-testid="hotspot-not-potential"
                      className="text-sm font-medium text-[#2F7F9E]"
                    >
                      Not a potential hotspot
                    </p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-semibold text-text">
          Data source attribution
        </h2>

        <div
          data-testid="area-data-sources"
          className="mt-4 space-y-3"
        >
          {sources.map((source) => (
            <article
              key={source.id}
              className="rounded-xl border border-border bg-surface p-4 shadow-sm"
            >
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-base font-semibold text-text">
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
                <p className="mt-2 text-sm leading-5 text-muted">
                  {source.description}
                </p>
              )}
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}