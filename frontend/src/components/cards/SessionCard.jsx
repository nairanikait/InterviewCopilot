import { useNavigate } from 'react-router-dom';

/**
 * SessionCard – single row in the recent sessions list.
 */
export function SessionCard({ session }) {
  const navigate = useNavigate();

  const iconMap = {
    'Technical Assessment': (
      <svg className="h-5 w-5 text-dark-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    ),
    'Behavioral Interview': (
      <svg className="h-5 w-5 text-dark-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    'System Design': (
      <svg className="h-5 w-5 text-dark-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
      </svg>
    ),
  };

  const defaultIcon = (
    <svg className="h-5 w-5 text-dark-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  );

  const formattedDate = session.createdAt
    ? new Date(session.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : '—';

  // Backend field is overallScore (0–10), not score
  const score = session.overallScore;
  const scoreColor =
    score >= 8 ? 'text-green-600' :
    score >= 6 ? 'text-amber-600' :
    'text-red-500';

  return (
    <button
      id={`session-card-${session._id || session.id}`}
      onClick={() => navigate(`/results/${session._id || session.id}`)}
      className="card w-full flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 px-4 sm:px-5 py-4 hover:shadow-md hover:border-dark-300 transition-all duration-200 text-left group"
    >
      <div className="flex items-center gap-3 w-full sm:w-auto flex-1 min-w-0">
        <div className="h-10 w-10 rounded-xl bg-dark-100 flex items-center justify-center flex-shrink-0">
          {iconMap[session.type] || defaultIcon}
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-dark-900 truncate">{session.role || 'Interview Session'}</p>
          <p className="text-xs text-dark-400 mt-0.5 truncate">
            {formattedDate}
            {session.type ? ` · ${session.type}` : ''}
          </p>
        </div>
      </div>
      <div className="flex items-center justify-between w-full sm:w-auto sm:ml-auto flex-shrink-0">
        <div className="text-left sm:text-right">
          <p className="text-xs font-medium text-dark-400 uppercase tracking-wide">Final Score</p>
          <p className={`text-lg font-bold ${scoreColor}`}>
            {score != null ? `${score} / 10` : '—'}
          </p>
        </div>
        <svg className="h-5 w-5 text-dark-400 group-hover:text-dark-700 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </button>
  );
}
