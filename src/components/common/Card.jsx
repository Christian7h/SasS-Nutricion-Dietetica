import React, { forwardRef, useMemo, useCallback } from 'react';

const Card = React.memo(forwardRef(({ 
  children, 
  className = '', 
  shadow = true,
  compact = false,
  hover = false,
  clickable = false,
  loading = false,
  error = false,
  success = false,
  variant = 'default',
  onClick,
  onKeyDown,
  role,
  tabIndex,
  'aria-label': ariaLabel,
  'aria-describedby': ariaDescribedby,
  ...props 
}, ref) => {
  // Memoizar las clases calculadas para optimización
  const cardClasses = useMemo(() => {
    const baseClasses = 'card bg-base-100';
    const classes = [baseClasses];
    
    // Shadow configuration
    if (shadow) {
      classes.push('shadow-xl');
    }
    
    // Compact mode
    if (compact) {
      classes.push('card-compact');
    }
    
    // Hover effects
    if (hover) {
      classes.push('hover:shadow-2xl hover:-translate-y-1 transition-all duration-300');
    }
    
    // Clickable state
    if (clickable) {
      classes.push('cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2');
    }
    
    // Loading state
    if (loading) {
      classes.push('opacity-70 pointer-events-none');
    }
    
    // Error state
    if (error) {
      classes.push('border-2 border-error bg-error/10');
    }
    
    // Success state
    if (success) {
      classes.push('border-2 border-success bg-success/10');
    }
    
    // Variant styles
    switch (variant) {
      case 'glass':
        classes.push('glass');
        break;
      case 'outlined':
        classes.push('card-bordered');
        break;
      case 'filled':
        classes.push('bg-base-200');
        break;
      default:
        break;
    }
    
    // Custom className
    if (className) {
      classes.push(className);
    }
    
    return classes.join(' ');
  }, [shadow, compact, hover, clickable, loading, error, success, variant, className]);

  // Manejo de eventos de teclado para accesibilidad
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick?.(e);
    }
    onKeyDown?.(e);
  }, [onClick, onKeyDown]);

  // Memoizar las props del elemento
  const elementProps = useMemo(() => {
    const baseProps = {
      ref,
      className: cardClasses,
      onClick: clickable ? onClick : undefined,
      onKeyDown: clickable ? handleKeyDown : undefined,
      role: clickable ? (role || 'button') : role,
      tabIndex: clickable ? (tabIndex !== undefined ? tabIndex : 0) : tabIndex,
      'aria-label': ariaLabel,
      'aria-describedby': ariaDescribedby,
      'aria-disabled': loading
    };

    // Remover props undefined para limpiar el DOM
    return Object.fromEntries(
      Object.entries(baseProps).filter(([, value]) => value !== undefined)
    );
  }, [ref, cardClasses, clickable, onClick, handleKeyDown, role, tabIndex, ariaLabel, ariaDescribedby, loading]);

  return (
    <div {...elementProps} {...props}>
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-base-100/50 rounded-2xl z-10">
          <span className="loading loading-spinner loading-md text-primary"></span>
        </div>
      )}
      {children}
    </div>
  );
}));

Card.displayName = 'Card';

// Card Body Component optimizado
export const CardBody = React.memo(({ 
  children, 
  className = '', 
  padding = 'normal',
  ...props 
}) => {
  const bodyClasses = useMemo(() => {
    const classes = ['card-body'];
    
    // Padding variants
    switch (padding) {
      case 'none':
        classes.push('p-0');
        break;
      case 'sm':
        classes.push('p-3');
        break;
      case 'lg':
        classes.push('p-8');
        break;
      default:
        // Usar padding por defecto de DaisyUI
        break;
    }
    
    if (className) {
      classes.push(className);
    }
    
    return classes.join(' ');
  }, [padding, className]);

  return (
    <div className={bodyClasses} {...props}>
      {children}
    </div>
  );
});

CardBody.displayName = 'CardBody';

// Card Title Component optimizado
export const CardTitle = React.memo(({ 
  children, 
  className = '', 
  level = 2,
  truncate = false,
  ...props 
}) => {
  const titleClasses = useMemo(() => {
    const classes = ['card-title'];
    
    if (truncate) {
      classes.push('truncate');
    }
    
    if (className) {
      classes.push(className);
    }
    
    return classes.join(' ');
  }, [truncate, className]);

  const Tag = `h${level}`;
  
  return (
    <Tag className={titleClasses} {...props}>
      {children}
    </Tag>
  );
});

CardTitle.displayName = 'CardTitle';

// Card Actions Component optimizado
export const CardActions = React.memo(({ 
  children, 
  className = '', 
  justify = 'end',
  stack = false,
  ...props 
}) => {
  const actionsClasses = useMemo(() => {
    const classes = ['card-actions'];
    
    // Justification
    switch (justify) {
      case 'start':
        classes.push('justify-start');
        break;
      case 'center':
        classes.push('justify-center');
        break;
      case 'between':
        classes.push('justify-between');
        break;
      default:
        classes.push('justify-end');
    }
    
    // Stack on mobile
    if (stack) {
      classes.push('flex-col sm:flex-row');
    }
    
    if (className) {
      classes.push(className);
    }
    
    return classes.join(' ');
  }, [justify, stack, className]);

  return (
    <div className={actionsClasses} {...props}>
      {children}
    </div>
  );
});

CardActions.displayName = 'CardActions';

// Card Figure Component para imágenes
export const CardFigure = React.memo(({ 
  children, 
  className = '',
  position = 'top',
  ...props 
}) => {
  const figureClasses = useMemo(() => {
    const classes = [];
    
    if (position === 'side') {
      classes.push('card-side');
    }
    
    if (className) {
      classes.push(className);
    }
    
    return classes.length > 0 ? classes.join(' ') : undefined;
  }, [position, className]);

  return (
    <figure className={figureClasses} {...props}>
      {children}
    </figure>
  );
});

CardFigure.displayName = 'CardFigure';

// Componente especializado para estadísticas con DaisyUI
export const StatCard = React.memo(({ 
  title, 
  value, 
  description,
  figure,
  trend,
  trendValue,
  color = 'primary',
  loading = false,
  className = ''
}) => {
  const colorClasses = useMemo(() => {
    const colors = {
      primary: 'text-primary',
      secondary: 'text-secondary',
      accent: 'text-accent',
      success: 'text-success',
      warning: 'text-warning',
      error: 'text-error',
      info: 'text-info'
    };
    
    return colors[color] || colors.primary;
  }, [color]);

  const trendIcon = useMemo(() => {
    if (!trend) return null;
    return trend === 'up' ? '↗' : trend === 'down' ? '↘' : '→';
  }, [trend]);

  if (loading) {
    return (
      <div className={`stat ${className}`}>
        <div className="stat-figure animate-pulse">
          <div className="w-8 h-8 bg-base-300 rounded"></div>
        </div>
        <div className="stat-title">
          <div className="h-4 bg-base-300 rounded w-3/4 animate-pulse"></div>
        </div>
        <div className="stat-value">
          <div className="h-8 bg-base-300 rounded w-1/2 animate-pulse"></div>
        </div>
        <div className="stat-desc">
          <div className="h-3 bg-base-300 rounded w-2/3 animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`stat ${className}`}>
      {figure && (
        <div className={`stat-figure ${colorClasses}`}>
          {figure}
        </div>
      )}
      <div className="stat-title">{title}</div>
      <div className={`stat-value ${colorClasses}`}>{value}</div>
      <div className="stat-desc">
        {description}
        {trendValue && (
          <span className={`ml-2 ${colorClasses} font-medium`}>
            {trendIcon} {trendValue}
          </span>
        )}
      </div>
    </div>
  );
});

StatCard.displayName = 'StatCard';

export default Card;
