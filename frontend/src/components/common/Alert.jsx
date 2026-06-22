/**
 * Alert – inline error/info/success banner.
 */
export function Alert({ variant = 'error', children }) {
  const variants = {
    error:   'bg-red-50 border-red-200 text-red-700',
    success: 'bg-green-50 border-green-200 text-green-700',
    info:    'bg-brand-50 border-brand-200 text-brand-700',
    warning: 'bg-amber-50 border-amber-200 text-amber-700',
  };

  return (
    <div
      role="alert"
      className={`rounded-xl border px-4 py-3 text-sm font-medium animate-fade-in ${variants[variant]}`}
    >
      {children}
    </div>
  );
}
