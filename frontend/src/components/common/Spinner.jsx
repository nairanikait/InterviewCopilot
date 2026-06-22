/**
 * Spinner – accessible loading indicator.
 * @param {string} size  - Tailwind size class e.g. 'h-5 w-5'
 * @param {string} color - Tailwind text-color class
 */
export function Spinner({ size = 'h-5 w-5', color = 'text-white' }) {
  return (
    <svg
      className={`animate-spin ${size} ${color}`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}
