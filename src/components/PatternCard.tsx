type PatternCardProps = {
  pathogen: string
  antimicrobial: string
  isolatesTested: number
  isolatesResistant: number
  isPotentialHotspot: boolean
}

export function PatternCard({
  pathogen,
  antimicrobial,
  isolatesTested,
  isolatesResistant,
  isPotentialHotspot,
}: PatternCardProps) {
  const hasData = isolatesTested > 0

  const resistancePercentage = hasData
    ? (isolatesResistant / isolatesTested) * 100
    : null

  return (
    <article className="rounded-xl border border-slate-300 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-600">Pathogen</p>
          <h3 className="text-lg font-semibold text-slate-900">
            {pathogen}
          </h3>
        </div>

        {isPotentialHotspot && (
          <span
            data-testid="hotspot-badge"
            className="rounded-full border border-[#9A3412] bg-[#FFEDD5] px-3 py-1 text-xs font-medium text-[#9A3412]"
          >
            Potential hotspot
          </span>
        )}
      </div>

      <div className="mt-4">
        <p className="text-sm font-medium text-slate-600">Antimicrobial</p>
        <p className="text-base text-slate-900">{antimicrobial}</p>
      </div>

      <div className="mt-4">
        <p className="text-sm font-medium text-slate-600">
          Resistance percentage
        </p>

        {resistancePercentage === null ? (
          <p className="text-base text-slate-600">
            No data are available for this selection.
          </p>
        ) : (
          <p className="text-2xl font-semibold tabular-nums text-slate-900">
            {resistancePercentage.toFixed(1)}%
          </p>
        )}
      </div>

      <p className="mt-2 text-sm text-slate-600">
        {isolatesResistant} resistant of {isolatesTested} tested
      </p>
    </article>
  )
}