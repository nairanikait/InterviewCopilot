/**
 * RecentImprovement – compact progress card.
 * Shows Last Session score, Previous Session score, and improvement delta.
 * No charts, no animations — purely text-based per spec.
 *
 * Props:
 *   lastSessionScore   number | null
 *   prevSessionScore   number | null
 *   lastDelta          number | null  (positive = improved, negative = declined)
 */
export function RecentImprovement({ lastSessionScore, prevSessionScore, lastDelta }) {
  const hasDelta = lastDelta !== null && lastDelta !== undefined;
  const isPositive = hasDelta && lastDelta > 0;
  const isNeutral  = hasDelta && lastDelta === 0;

  const deltaLabel = hasDelta
    ? `${isPositive ? '+' : ''}${lastDelta}%`
    : '—';

  const deltaClasses = isPositive
    ? 'bg-brand-100 text-brand-700'
    : isNeutral
    ? 'bg-dark-100 text-dark-500'
    : 'bg-red-50 text-red-600';

  const arrowIcon = isPositive ? (
    // Up arrow
    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
    </svg>
  ) : !isPositive && hasDelta && lastDelta < 0 ? (
    // Down arrow
    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  ) : null;

  return (
    <div className="card flex items-center gap-0 overflow-hidden">
      {/* Left accent bar */}
      <div className="w-1 self-stretch bg-dark-200 flex-shrink-0" />

      {/* Label */}
      <div className="px-5 py-4 border-r border-dark-200 flex-shrink-0">
        <p className="text-[10px] font-bold tracking-widest text-dark-400 uppercase whitespace-nowrap">
          Recent Improvement
        </p>
      </div>

      {/* Last Session */}
      <div className="px-6 py-4 flex-shrink-0">
        <p className="text-[11px] text-dark-400 mb-0.5">Last Session</p>
        <p className="text-lg font-bold text-dark-900">
          {lastSessionScore != null ? `${lastSessionScore}%` : '—'}
        </p>
      </div>

      {/* Previous Session */}
      <div className="px-6 py-4 flex-shrink-0">
        <p className="text-[11px] text-dark-400 mb-0.5">Previous</p>
        <p className="text-lg font-bold text-dark-900">
          {prevSessionScore != null ? `${prevSessionScore}%` : '—'}
        </p>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Delta badge */}
      <div className="px-5 py-4 flex-shrink-0">
        {hasDelta ? (
          <span className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-semibold ${deltaClasses}`}>
            {arrowIcon}
            {deltaLabel}
          </span>
        ) : (
          <span className="text-sm text-dark-400">No data</span>
        )}
      </div>
    </div>
  );
}
