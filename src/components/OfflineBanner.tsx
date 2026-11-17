import React from 'react'
import { AlertCircle } from 'lucide-react'
import { MESSAGES } from '../lib/messages'
import { useOnline } from '../hooks/useOnline'

interface OfflineBannerProps {
  isOffline?: boolean
}

export const OfflineBanner: React.FC<OfflineBannerProps> = ({ isOffline }) => {
  const browserOnline = useOnline()

  const offline = isOffline !== undefined ? isOffline : !browserOnline

  if (!offline) {
    return null
  }

  return (
    <div
      role="alert"
      className="bg-[#FEF0C7] text-[#7A2E0E] text-xs md:text-sm font-medium px-4 py-2.5 flex items-center justify-center gap-2 border-b border-[#CBD5E1]"
    >
      <AlertCircle className="w-4 h-4 shrink-0" strokeWidth={1.5} />
      <span>{MESSAGES.ERR1}</span>
    </div>
  )
}
