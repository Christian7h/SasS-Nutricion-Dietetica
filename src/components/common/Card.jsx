import { forwardRef } from 'react';

const Card = forwardRef(({ 
  children, 
  className = '', 
  shadow = true,
  compact = false,
  ...props 
}, ref) => {
  const baseClasses = 'card bg-base-100';
  const shadowClass = shadow ? 'shadow-xl' : '';
  const compactClass = compact ? 'card-compact' : '';
  
  const classes = [
    baseClasses,
    shadowClass,
    compactClass,
    className
  ].filter(Boolean).join(' ');

  return (
    <div ref={ref} className={classes} {...props}>
      {children}
    </div>
  );
});

Card.displayName = 'Card';

// Card Body Component
export const CardBody = ({ children, className = '', ...props }) => {
  return (
    <div className={`card-body ${className}`} {...props}>
      {children}
    </div>
  );
};

// Card Title Component
export const CardTitle = ({ children, className = '', ...props }) => {
  return (
    <h2 className={`card-title ${className}`} {...props}>
      {children}
    </h2>
  );
};

// Card Actions Component
export const CardActions = ({ children, className = '', justify = 'end', ...props }) => {
  const justifyClass = justify === 'start' ? 'justify-start' : 
                      justify === 'center' ? 'justify-center' : 'justify-end';
  
  return (
    <div className={`card-actions ${justifyClass} ${className}`} {...props}>
      {children}
    </div>
  );
};

export default Card;
