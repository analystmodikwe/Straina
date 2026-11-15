import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { DemoNotice } from '../components/DemoNotice'
import { MapLegend } from '../components/MapLegend'
import { MapStatusPanel } from '../components/MapStatusPanel'
import { OfflineBanner } from '../components/OfflineBanner'
import { PatternCard } from '../components/PatternCard'
import { StrainaMap } from '../components/StrainaMap'
import { Button } from '../components/UI/Button'
import { computeHotspots } from '../lib/hotspot'
import { buildAreas, hasDemoData, quarterLabel, quarterOf, useMapData } from '../lib/mapData'
import type { AmrObservation } from '../types'

interface Pattern {
  key: string
  pathogen: string
  antimicrobial: string
  tested: number
  resistant: number
  rows: AmrObservation[]
}

function groupPatterns(observations: AmrObservation[]): Pattern[] {
  const groups = new Map<string, Pattern>()
  for (const o of observations) {
    const key = `${o.pathogen}|${o.antimicrobial}`
    const g = groups.get(key) ?? {
      key,
      pathogen: o.pathogen,
      antimicrobial: o.antimicrobial,
      tested: 0,
      resistant: 0,
      rows: [],
    }
    g.tested += o.isolates_tested
    g.resistant += o.isolates_resistant
    g.rows.push(o)
    groups.set(key, g)
  }
  return [...groups.values()]
}

const REPLAY_MS = 1500

/** S2 Map Exploration at "/explore" (US2, US3, US4). */
export function S2_Explore() {
  const navigate = useNavigate()
  const { status, data, reload } = useMapData()
  const [picked, setPicked] = useState<string | null>(null)
  const [showHotspots, setShowHotspots] = useState(true)
  const [playing, setPlaying] = useState(false)

  const periods = useMemo(
    () => (data ? [...new Set(data.observations.map((o) => quarterOf(o.period_start)))].sort() : []),
    [data],
  )
  const period = picked && periods.includes(picked) ? picked : periods[periods.length - 1]

  const visible = useMemo(
    () => (data ? data.observations.filter((o) => quarterOf(o.period_start) === period) : []),
    [data, period],
  )

  const areas = useMemo(
    () => (data ? buildAreas(data.observations, visible, computeHotspots(visible), showHotspots) : []),
    [data, visible, showHotspots],
  )

  const patterns = useMemo(
    () =>
      groupPatterns(visible).map((g) => ({
        ...g,
        hot: showHotspots && computeHotspots(g.rows).some((r) => r.status === 'potential_hotspot'),
      })),
    [visible, showHotspots],
  )

  // Map replay: step through the periods oldest to newest.
  useEffect(() => {
    if (!playing) return
    const id = window.setInterval(() => {
      const i = periods.indexOf(period)
      if (i >= periods.length - 1) setPlaying(false)
      else setPicked(periods[i + 1])
    }, REPLAY_MS)
    return () => window.clearInterval(id)
  }, [playing, periods, period])

  const togglePlay = () => {
    if (!playing && period === periods[periods.length - 1]) setPicked(periods[0])
    setPlaying((p) => !p)
  }

  const ready = status === 'ready'
  const isEmpty = ready && data !== undefined && data.observations.length === 0

  return (
    <>
      <OfflineBanner />
      <DemoNotice show={data ? hasDemoData(visible, data.sources) : false} />

      <div className="mx-auto w-full max-w-content px-4 py-6 md:px-8">
        <h1 className="text-3xl font-semibold text-text">Explore over time</h1>

        <div className="mt-4 flex flex-wrap items-end gap-4">
          <div className="flex flex-col gap-1">
            <label htmlFor="period" className="text-sm font-medium text-text">
              Time period
            </label>
            <select
              id="period"
              value={period ?? ''}
              disabled={!ready || isEmpty}
              onChange={(e) => {
                setPlaying(false)
                setPicked(e.target.value)
              }}
              className="min-h-control-touch rounded-control border border-border-control bg-surface px-3 text-sm font-medium text-text disabled:cursor-not-allowed disabled:bg-disabled disabled:text-disabled-text md:min-h-control"
            >
              {periods.map((p) => (
                <option key={p} value={p}>
                  {quarterLabel(p)}
                </option>
              ))}
            </select>
          </div>

          <Button variant="secondary" disabled={!ready || isEmpty} onClick={togglePlay}>
            {playing ? 'Pause' : 'Play'}
          </Button>

          <label className="flex min-h-control-touch items-center gap-2 text-sm font-medium text-text md:min-h-control">
            <input
              type="checkbox"
              checked={showHotspots}
              onChange={(e) => setShowHotspots(e.target.checked)}
              className="h-4 w-4 accent-primary"
            />
            Potential hotspot layer
          </label>
        </div>
      </div>

      {status === 'loading' && <MapStatusPanel kind="loading" />}
      {status === 'error' && <MapStatusPanel kind="error" onRetry={reload} />}
      {isEmpty && <MapStatusPanel kind="empty" />}

      {ready && !isEmpty && (
        <>
          <div className="relative">
            <StrainaMap areas={areas} onSelectArea={(code) => navigate(`/areas/${code}`)} />
            <div className="absolute bottom-6 left-4 z-map">
              <MapLegend />
            </div>
          </div>

          <section className="mx-auto w-full max-w-content px-4 py-6 md:px-8">
            <h2 className="text-xl font-semibold text-text">Resistance patterns</h2>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {patterns.map((p) => (
                <PatternCard
                  key={p.key}
                  pathogen={p.pathogen}
                  antimicrobial={p.antimicrobial}
                  isolatesTested={p.tested}
                  isolatesResistant={p.resistant}
                  isPotentialHotspot={p.hot}
                />
              ))}
            </div>
          </section>
        </>
      )}
    </>
  )
}