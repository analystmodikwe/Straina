import React, { useEffect, useState } from 'react'
import { AlertCircle } from 'lucide-react'
import { MESSAGES } from '../lib/messages'

interface OfflineBannerProps {
  isOffline?: boolean
}

export const OfflineBanner: React.FC<OfflineBannerProps> = ({ isOffline }) => {
  const [browserOffline, setBrowserOffline] = useState(() =>
    typeof navigator !== 'undefined' ? !navigator.onLine : false
  )

  useEffect(() => {
    if (isOffline !== undefined) return

    const handleOnline = () => setBrowserOffline(false)
    const handleOffline = () => setBrowserOffline(true)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [isOffline])

  const offline = isOffline !== undefined ? isOffline : browserOffline

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
