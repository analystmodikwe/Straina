import { MESSAGES } from '../lib/messages'

interface DemoNoticeProps {
  /** BR13: pass true only when a displayed record comes from a demo source. Defaults to true. */
  show?: boolean
}

export function DemoNotice({ show = true }: DemoNoticeProps) {
  if (!show) return null

  return (
    <div
      role="status"
      data-testid="demo-notice"
      className="border-b border-border bg-demo-bg px-4 py-2 text-center text-xs font-medium text-demo"
    >
      {MESSAGES.DEMO_NOTICE}
    </div>
  )
}