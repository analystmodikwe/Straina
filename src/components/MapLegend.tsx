import { PIN_LABELS, PIN_ORDER, pinStyle } from '../lib/mapPins'

interface MapLegendProps {
  /** BR12 values. Defaults match src/lib/hotspot.ts (25%, 3 observations, 6 months). */
  thresholdPct?: number
  minObservations?: number
  windowMonths?: number
}

export function MapLegend({ thresholdPct = 25, minObservations = 3, windowMonths = 6 }: MapLegendProps) {
  return (
    <aside
      data-testid="map-legend"
      aria-label="Map legend"
      className="max-w-xs rounded-card border border-border bg-surface p-4 shadow-card"
    >
      <h2 className="text-sm font-semibold text-secondary">Legend</h2>
      <ul className="mt-2 space-y-2">
        {PIN_ORDER.map((status) => (
          <li key={status} data-testid={`legend-${status}`} className="flex items-center gap-2">
            <span aria-hidden="true" style={pinStyle(status)} />
            <span className="text-sm font-medium text-text">{PIN_LABELS[status]}</span>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-xs font-medium text-text-muted">
        Potential hotspot: resistance of {thresholdPct}% or more, with at least {minObservations} observations in a{' '}
        {windowMonths}-month window. It is a flag, not a confirmed outbreak.
      </p>
    </aside>
  )
}