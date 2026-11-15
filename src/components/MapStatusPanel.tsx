import { MESSAGES } from '../lib/messages'
import { Button } from './UI/Button'

interface MapStatusPanelProps {
  kind: 'loading' | 'error' | 'empty'
  onRetry?: () => void
}

/** Loading, ERR3 and ERR2 states shared by S1 and S2. */
export function MapStatusPanel({ kind, onRetry }: MapStatusPanelProps) {
  if (kind === 'loading') {
    return (
      <div role="status" className="flex h-map w-full items-center justify-center bg-background">
        <p className="animate-pulse text-base text-text-muted">Loading…</p>
      </div>
    )
  }

  if (kind === 'error') {
    return (
      <div
        role="alert"
        className="mx-auto my-8 max-w-xl rounded-card border border-error bg-error-bg p-6 text-center shadow-card"
      >
        <p className="text-base text-error">{MESSAGES.ERR3}</p>
        <Button className="mt-4" onClick={onRetry}>
          Try again
        </Button>
      </div>
    )
  }

  return (
    <div
      role="status"
      data-testid="no-data"
      className="mx-auto my-8 max-w-xl rounded-card border border-border bg-surface p-6 text-center shadow-card"
    >
      <p className="text-base text-text">{MESSAGES.ERR2}</p>
    </div>
  )
}