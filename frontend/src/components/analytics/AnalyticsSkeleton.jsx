/**
 * AnalyticsSkeleton – loading placeholder for the Analytics page.
 * Mirrors the layout of the real page using the existing .skeleton utility class.
 */
export function AnalyticsSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <div className="skeleton h-8 w-32 rounded-lg" />
          <div className="skeleton h-4 w-64 rounded" />
        </div>
        <div className="skeleton h-9 w-28 rounded-xl" />
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="skeleton h-32 rounded-2xl" />
        ))}
      </div>

      {/* Recent improvement */}
      <div className="skeleton h-16 rounded-2xl" />

      {/* History table */}
      <div className="card overflow-hidden">
        <div className="skeleton h-12 w-full" />
        {[0, 1, 2].map((i) => (
          <div key={i} className="flex gap-4 px-5 py-3.5 border-b border-dark-100">
            <div className="skeleton h-4 w-24 rounded" />
            <div className="skeleton h-4 w-20 rounded" />
            <div className="skeleton h-4 w-16 rounded" />
            <div className="skeleton h-4 w-20 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
