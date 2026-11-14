type AboutSectionProps = {
  title: string
  children: React.ReactNode
  icon?: React.ReactNode
}

export function AboutSection({
  title,
  children,
  icon,
}: AboutSectionProps) {
  return (
    <section className="rounded-xl border border-slate-300 bg-white p-4 shadow-sm md:p-6">
      <div className="flex items-start gap-3">
        {icon && (
          <div
            aria-hidden="true"
            className="mt-0.5 text-slate-600"
          >
            {icon}
          </div>
        )}

        <div className="min-w-0">
          <h2 className="text-xl font-semibold leading-7 text-slate-900">
            {title}
          </h2>

          <div className="mt-3 text-base leading-6 text-slate-700">
            {children}
          </div>
        </div>
      </div>
    </section>
  )
}