import { forwardRef, memo, useMemo } from 'react';

const Button = memo(forwardRef(({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  loading = false, 
  disabled = false, 
  className = '', 
  loadingText = 'Cargando...',
  type = 'button',
  'aria-label': ariaLabel,
  ...props 
}, ref) => {
  // Memoizar clases para evitar recálculos
  const classes = useMemo(() => {
    const baseClasses = 'btn transition-all duration-200 focus:ring-2 focus:ring-offset-2';
    
    const variantClasses = {
      primary: 'btn-primary focus:ring-primary',
      secondary: 'btn-secondary focus:ring-secondary',
      accent: 'btn-accent focus:ring-accent',
      neutral: 'btn-neutral focus:ring-neutral',
      ghost: 'btn-ghost hover:bg-base-200',
      outline: 'btn-outline focus:ring-primary',
      error: 'btn-error focus:ring-error',
      warning: 'btn-warning focus:ring-warning',
      success: 'btn-success focus:ring-success',
      info: 'btn-info focus:ring-info',
      link: 'btn-link focus:ring-primary',
    };
    
    const sizeClasses = {
      xs: 'btn-xs',
      sm: 'btn-sm',
      md: '',
      lg: 'btn-lg'
    };
    
    return [
      baseClasses,
      variantClasses[variant] || variantClasses.primary,
      sizeClasses[size],
      loading && 'cursor-wait',
      disabled && 'cursor-not-allowed',
      className
    ].filter(Boolean).join(' ');
  }, [variant, size, loading, disabled, className]);

  return (
    <button
      ref={ref}
      type={type}
      className={classes}
      disabled={disabled || loading}
      aria-label={ariaLabel || (loading ? loadingText : undefined)}
      aria-disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <span 
            className="loading loading-spinner loading-sm" 
            aria-hidden="true"
          />
          <span className="sr-only">Cargando</span>
          {loadingText}
        </span>
      ) : (
        children
      )}
    </button>
  );
}));

Button.displayName = 'Button';

export default Button;