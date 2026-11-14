import React from 'react'
import { Link } from 'react-router-dom'

export const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-[#CBD5E1] h-14 md:h-16 px-4 md:px-8 flex items-center justify-between">
      <div className="flex items-center gap-6 md:gap-8">
        <Link
          to="/"
          className="text-xl font-bold text-[#0F4C5C] tracking-tight hover:opacity-90 transition-opacity"
        >
          Straina
        </Link>
        <nav className="flex items-center gap-4 md:gap-6">
          <Link
            to="/explore"
            className="text-sm font-medium text-[#334155] hover:text-[#0F4C5C] transition-colors"
          >
            Explore
          </Link>
          <Link
            to="/about"
            className="text-sm font-medium text-[#334155] hover:text-[#0F4C5C] transition-colors"
          >
            About / Data sources
          </Link>
        </nav>
      </div>
      <div>
        <Link
          to="/sign-in"
          className="inline-flex items-center justify-center px-3.5 py-1.5 md:py-2 text-sm font-semibold text-[#0F4C5C] border border-[#0F4C5C] rounded-md hover:bg-[#F8FAFC] transition-colors"
        >
          Sign in
        </Link>
      </div>
    </header>
  )
}
