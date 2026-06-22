import { useAnalytics } from '../hooks/useAnalytics';
import { AnalyticsSummaryCard } from '../components/analytics/AnalyticsSummaryCard';
import { RecentImprovement } from '../components/analytics/RecentImprovement';
import { InterviewHistoryTable } from '../components/analytics/InterviewHistoryTable';
import { AnalyticsSkeleton } from '../components/analytics/AnalyticsSkeleton';
import { Alert } from '../components/common/Alert';

// ─── Icon definitions (inline SVG, no external deps) ─────────────────────────

const IconInterviews = (
  <svg className="h-5 w-5 text-dark-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
  </svg>
);

const IconAvgScore = (
  <svg className="h-5 w-5 text-dark-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>
);

const IconStrongest = (
  <svg className="h-5 w-5 text-dark-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
  </svg>
);

const IconNeedsPractice = (
  <svg className="h-5 w-5 text-dark-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
  </svg>
);

// ─── Current month label ──────────────────────────────────────────────────────
const MONTH_LABEL = new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' });

// ─── Page ─────────────────────────────────────────────────────────────────────

/**
 * Analytics – page-level component.
 * All data logic is delegated to useAnalytics → analyticsService.
 * No business logic lives here.
 */
export default function Analytics() {
  const { data, loading, error } = useAnalytics();

  if (loading) return <AnalyticsSkeleton />;

  const {
    totalInterviews,
    averageScore,
    strongestTopic,
    weakestTopic,
    lastSessionScore,
    prevSessionScore,
    lastDelta,
    recent,
  } = data || {};

  return (
    <div className="space-y-6 animate-fade-in">

      {/* ── Section 1: Header ─────────────────────────────────────────── */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold text-dark-900">Analytics</h1>
          <p className="text-sm text-dark-500 mt-1">
            Track interview progress and improve over time.
          </p>
        </div>

        {/* Date indicator */}
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl border border-dark-200 bg-white text-sm text-dark-600 font-medium flex-shrink-0">
          <svg className="h-4 w-4 text-dark-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          {MONTH_LABEL}
        </div>
      </div>

      {error && <Alert variant="error">{error}</Alert>}

      {/* ── Section 2: Summary Cards ──────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <AnalyticsSummaryCard
          icon={IconInterviews}
          value={totalInterviews ?? 0}
          label="Total Interviews"
          sublabel="Completed"
        />
        <AnalyticsSummaryCard
          icon={IconAvgScore}
          value={averageScore != null ? `${averageScore}%` : '—'}
          label="Average Score"
          sublabel="Across all interviews"
        />
        <AnalyticsSummaryCard
          icon={IconStrongest}
          value={strongestTopic ?? '—'}
          label="Strongest Topic"
          sublabel="Highest average"
        />
        <AnalyticsSummaryCard
          icon={IconNeedsPractice}
          value={weakestTopic ?? '—'}
          label="Needs Practice"
          sublabel="Lowest average"
        />
      </div>

      {/* ── Section 3: Recent Improvement ────────────────────────────── */}
      <RecentImprovement
        lastSessionScore={lastSessionScore}
        prevSessionScore={prevSessionScore}
        lastDelta={lastDelta}
      />

      {/* ── Section 4: Interview History ──────────────────────────────── */}
      <InterviewHistoryTable rows={recent ?? []} />
    </div>
  );
}
