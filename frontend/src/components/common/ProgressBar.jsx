/**
 * ProgressBar – horizontal progress indicator.
 */
export function ProgressBar({ value = 0, max = 100 }) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className="w-full bg-dark-200 rounded-full h-1.5 overflow-hidden" role="progressbar" aria-valuenow={value} aria-valuemax={max}>
      <div
        className="bg-dark-900 h-full rounded-full transition-all duration-500 ease-out"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
