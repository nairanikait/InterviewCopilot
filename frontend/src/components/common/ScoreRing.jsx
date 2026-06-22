/**
 * ScoreRing – SVG circular score display used on Results page.
 */
export function ScoreRing({ score = 0, max = 100, size = 160 }) {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const pct = Math.min(1, score / max);
  const offset = circumference * (1 - pct);

  const getColor = (s) => {
    if (s >= 80) return '#22c55e'; // green
    if (s >= 60) return '#f59e0b'; // amber
    return '#ef4444'; // red
  };

  const getLabel = (s) => {
    if (s >= 85) return 'EXCELLENT';
    if (s >= 70) return 'GOOD';
    if (s >= 50) return 'FAIR';
    return 'NEEDS WORK';
  };

  const color = getColor(score);

  return (
    <div className="flex flex-col items-center gap-3">
      <p className="text-xs font-semibold tracking-widest text-dark-500 uppercase">Overall Score</p>
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox="0 0 120 120">
          {/* Track */}
          <circle cx="60" cy="60" r={radius} fill="none" stroke="#e2e8f0" strokeWidth="8" />
          {/* Progress */}
          <circle
            className="score-ring"
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: 'stroke-dashoffset 1s ease-out' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-bold text-dark-900">{score}</span>
          <span className="text-xs text-dark-400">/ {max}</span>
        </div>
      </div>
      <span
        className="px-3 py-1 rounded-full text-xs font-semibold"
        style={{ backgroundColor: `${color}22`, color }}
      >
        {getLabel(score)}
      </span>
    </div>
  );
}
