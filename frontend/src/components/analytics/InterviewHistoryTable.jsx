import { useNavigate } from 'react-router-dom';

/**
 * InterviewHistoryTable – simple responsive table for recent interview sessions.
 * Columns: Date | Type | Score | Status
 *
 * Props:
 *   rows  Array<{ id, date, type, score, status }>
 */
export function InterviewHistoryTable({ rows = [] }) {
  const navigate = useNavigate();

  const statusClasses = (status) => {
    switch (status) {
      case 'completed':
        return 'text-brand-600';
      case 'in_progress':
        return 'text-amber-600';
      default:
        return 'text-dark-400';
    }
  };

  const statusLabel = (status) => {
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'in_progress':
        return 'In Progress';
      default:
        return 'Pending';
    }
  };

  return (
    <div className="card overflow-hidden">
      {/* Table header row */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-dark-100">
        <h3 className="text-sm font-bold text-dark-900">Recent Interviews</h3>
        <button
          id="analytics-view-history"
          onClick={() => navigate('/sessions')}
          className="text-sm text-dark-500 hover:text-dark-900 font-medium transition-colors"
        >
          View History
        </button>
      </div>

      {rows.length === 0 ? (
        <div className="px-5 py-10 text-center">
          <p className="text-sm text-dark-400">No interview sessions yet.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-dark-100">
                <th className="text-left px-5 py-3 text-xs font-semibold text-dark-600 uppercase tracking-wide w-1/4">
                  Date
                </th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-brand-600 uppercase tracking-wide w-1/4">
                  Type
                </th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-dark-600 uppercase tracking-wide w-1/4">
                  Score
                </th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-brand-600 uppercase tracking-wide w-1/4">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, idx) => (
                <tr
                  key={row.id || idx}
                  className="border-b border-dark-100 last:border-0 hover:bg-dark-50 transition-colors"
                >
                  <td className="px-5 py-3.5 text-dark-700">{row.date}</td>
                  <td className="px-5 py-3.5 text-dark-700">{row.type}</td>
                  <td className="px-5 py-3.5 font-semibold text-dark-900">
                    {row.score != null ? `${row.score}/100` : '—'}
                  </td>
                  <td className={`px-5 py-3.5 font-medium ${statusClasses(row.status)}`}>
                    {statusLabel(row.status)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
