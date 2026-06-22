/**
 * AnalyticsSummaryCard – reusable metric tile for the analytics summary row.
 *
 * Props:
 *   icon       ReactNode   – SVG icon element
 *   value      string      – primary display value
 *   label      string      – card title (bold)
 *   sublabel   string      – muted subtitle below label
 */
export function AnalyticsSummaryCard({ icon, value, label, sublabel }) {
  return (
    <div className="card flex flex-col gap-3 px-5 py-5 hover:shadow-md transition-shadow duration-200">
      {/* Icon badge */}
      <div className="h-10 w-10 rounded-xl bg-dark-100 flex items-center justify-center flex-shrink-0">
        {icon}
      </div>

      {/* Metric */}
      <div className="min-w-0">
        <p className="text-2xl font-bold text-dark-900 leading-tight">{value ?? '—'}</p>
        <p className="text-sm font-semibold text-dark-900 mt-1">{label}</p>
        <p className="text-xs text-dark-400 mt-0.5">{sublabel}</p>
      </div>
    </div>
  );
}
