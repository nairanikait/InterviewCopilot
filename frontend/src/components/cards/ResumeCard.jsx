/**
 * ResumeCard – shows the active resume filename and update action.
 */
export function ResumeCard({ fileName, status = 'OPTIMIZED', onUpdate }) {
  return (
    <div className="card flex flex-col gap-3 p-5 h-full">
      <div className="flex items-start justify-between gap-2">
        <div className="h-10 w-10 rounded-xl bg-dark-100 flex items-center justify-center flex-shrink-0">
          <svg className="h-5 w-5 text-dark-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        {status && (
          <span className="text-xs font-semibold px-2 py-1 rounded-full bg-green-100 text-green-700 uppercase tracking-wide">
            {status}
          </span>
        )}
      </div>
      <div className="flex-1">
        <p className="text-xs text-dark-400 font-medium">Active Resume</p>
        <p className="text-sm font-bold text-dark-900 mt-1 break-all">{fileName || 'No resume uploaded'}</p>
      </div>
      <button
        id="resume-card-update"
        onClick={onUpdate}
        className="btn-secondary w-full text-xs py-2"
      >
        Update Resume
      </button>
    </div>
  );
}
