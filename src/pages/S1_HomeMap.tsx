import { useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { DemoNotice } from '../components/DemoNotice'
import { MapLegend } from '../components/MapLegend'
import { MapStatusPanel } from '../components/MapStatusPanel'
import { OfflineBanner } from '../components/OfflineBanner'
import { StrainaMap } from '../components/StrainaMap'
import { Button } from '../components/UI/Button'
import { computeHotspots } from '../lib/hotspot'
import { buildAreas, hasDemoData, sourcesFor, useMapData } from '../lib/mapData'
import { MESSAGES } from '../lib/messages'

/** S1 Home / Map at "/" (US1, US4, US5, US13). */
export function S1_HomeMap() {
  const navigate = useNavigate()
  const { status, data, reload } = useMapData()

  const areas = useMemo(
    () =>
      data ? buildAreas(data.observations, data.observations, computeHotspots(data.observations), true) : [],
    [data],
  )

  const isEmpty = status === 'ready' && data !== undefined && data.observations.length === 0
  const shownSources = data ? sourcesFor(data.observations, data.sources) : []

  return (
    <>
      <OfflineBanner />
      <DemoNotice show={data ? hasDemoData(data.observations, data.sources) : false} />

      <section className="flex flex-col gap-4 bg-surface px-4 py-6 md:flex-row md:items-center md:justify-between md:px-8">
        <div className="max-w-3xl">
          <p className="text-base text-text">
            Explore antimicrobial-resistance information geographically and over time.
          </p>
          <p className="mt-2 text-sm font-medium text-secondary">{MESSAGES.NON_DIAGNOSTIC}</p>
        </div>
        <Button onClick={() => navigate('/explore')}>Explore</Button>
      </section>

      {status === 'loading' && <MapStatusPanel kind="loading" />}
      {status === 'error' && <MapStatusPanel kind="error" onRetry={reload} />}
      {isEmpty && <MapStatusPanel kind="empty" />}

      {status === 'ready' && !isEmpty && (
        <div className="relative">
          <StrainaMap areas={areas} onSelectArea={(code) => navigate(`/areas/${code}`)} />
          <div className="absolute bottom-6 left-4 z-map">
            <MapLegend />
          </div>
        </div>
      )}

      <footer className="flex flex-wrap items-center justify-between gap-2 border-t border-border bg-surface px-4 py-4 text-sm text-secondary md:px-8">
        <p className="flex flex-wrap items-center gap-2">
          <span>Data source:</span>
          {shownSources.length === 0 && <span className="text-text-muted">None loaded</span>}
          {shownSources.map((s) => (
            <span key={s.id}>{s.name}</span>
        ))}
        </p>
        <Link to="/about" className="font-semibold text-accent underline">
          About / Data sources
        </Link>
      </footer>
    </>
  )
}