export default function Badge({ 
  children, 
  variant = 'neutral', 
  size = 'md', 
  outline = false,
  className = '',
  ...props 
}) {
  const baseClasses = 'badge';
  
  const variantClasses = {
    primary: outline ? 'badge-outline badge-primary' : 'badge-primary',
    secondary: outline ? 'badge-outline badge-secondary' : 'badge-secondary',
    accent: outline ? 'badge-outline badge-accent' : 'badge-accent',
    neutral: outline ? 'badge-outline badge-neutral' : 'badge-neutral',
    success: outline ? 'badge-outline badge-success' : 'badge-success',
    warning: outline ? 'badge-outline badge-warning' : 'badge-warning',
    error: outline ? 'badge-outline badge-error' : 'badge-error',
    info: outline ? 'badge-outline badge-info' : 'badge-info',
    ghost: 'badge-ghost'
  };
  
  const sizeClasses = {
    xs: 'badge-xs',
    sm: 'badge-sm',
    md: '',
    lg: 'badge-lg'
  };
  
  const classes = [
    baseClasses,
    variantClasses[variant] || variantClasses.neutral,
    sizeClasses[size],
    className
  ].filter(Boolean).join(' ');

  return (
    <span className={classes} {...props}>
      {children}
    </span>
  );
}
