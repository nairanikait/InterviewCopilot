/**
 * AIInsightBanner – full-width AI insight card shown at bottom of Dashboard.
 */
export function AIInsightBanner({ message }) {
  return (
    <div className="flex items-start gap-4 rounded-2xl border-l-4 border-brand-600 bg-white px-5 py-4 shadow-sm border border-dark-200">
      <div className="h-9 w-9 rounded-full bg-dark-900 flex items-center justify-center flex-shrink-0 mt-0.5">
        <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      </div>
      <div>
        <p className="text-sm font-semibold text-dark-900">AI Insights: Area for Improvement</p>
        <p className="text-sm text-dark-500 mt-1 leading-relaxed">{message}</p>
      </div>
    </div>
  );
}
