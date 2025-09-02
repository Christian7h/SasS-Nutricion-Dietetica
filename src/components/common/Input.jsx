import { forwardRef } from 'react';

const Input = forwardRef(({ 
  label, 
  error, 
  type = 'text', 
  placeholder = '', 
  size = 'md',
  className = '', 
  required = false,
  icon,
  ...props 
}, ref) => {
  const baseClasses = 'input input-bordered w-full';
  
  const sizeClasses = {
    xs: 'input-xs',
    sm: 'input-sm',
    md: '',
    lg: 'input-lg'
  };
  
  const errorClass = error ? 'input-error' : '';
  
  const classes = [
    baseClasses,
    sizeClasses[size],
    errorClass,
    className
  ].filter(Boolean).join(' ');

  return (
    <div className="form-control w-full">
      {label && (
        <label className="label">
          <span className="label-text text-base-content">
            {label}
            {required && <span className="text-error ml-1">*</span>}
          </span>
        </label>
      )}
      
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {icon}
          </div>
        )}
        <input
          ref={ref}
          type={type}
          placeholder={placeholder}
          className={`${classes} ${icon ? 'pl-10' : ''}`}
          {...props}
        />
      </div>
      
      {error && (
        <label className="label">
          <span className="label-text-alt text-error">{error}</span>
        </label>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;