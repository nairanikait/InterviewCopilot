/**
 * DashboardSkeleton – matches the Dashboard loading state shown in the UI screenshots.
 */
export function DashboardSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Hero + Resume row */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-4">
        <div className="skeleton h-48 rounded-2xl" />
        <div className="skeleton h-48 rounded-2xl" />
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[0, 1, 2].map((i) => (
          <div key={i} className="skeleton h-24 rounded-2xl" />
        ))}
      </div>

      {/* Sessions list */}
      <div className="space-y-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="card flex items-center gap-4 px-5 py-4">
            <div className="skeleton h-10 w-10 rounded-xl flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="skeleton h-3.5 w-48 rounded" />
              <div className="skeleton h-3 w-32 rounded" />
            </div>
            <div className="skeleton h-8 w-20 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
