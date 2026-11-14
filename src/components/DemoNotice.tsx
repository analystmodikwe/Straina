import React from 'react'
import { MESSAGES } from '../lib/messages'

export const DemoNotice: React.FC = () => {
  return (
    <div
      role="status"
      className="bg-[#EDE9FE] text-[#4C1D95] text-xs font-medium px-4 py-2 text-center border-b border-[#CBD5E1]"
    >
      {MESSAGES.DEMO_NOTICE}
    </div>
  )
}
