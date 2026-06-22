import { Spinner } from './Spinner';

/**
 * Button – design system button.
 * @param {'primary'|'secondary'|'ghost'} variant
 */
export function Button({
  children,
  variant = 'primary',
  loading = false,
  className = '',
  ...props
}) {
  const base = {
    primary:   'btn-primary',
    secondary: 'btn-secondary',
    ghost:     'btn-ghost',
  }[variant];

  return (
    <button className={`${base} ${className}`} disabled={loading || props.disabled} {...props}>
      {loading && <Spinner size="h-4 w-4" color={variant === 'primary' ? 'text-white' : 'text-dark-500'} />}
      {children}
    </button>
  );
}
