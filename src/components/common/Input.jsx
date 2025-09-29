import React, { forwardRef, useMemo, useCallback, useId } from 'react';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

const Input = React.memo(forwardRef(({
  type = 'text',
  label,
  placeholder,
  error,
  success,
  warning,
  helperText,
  required = false,
  disabled = false,
  readOnly = false,
  size = 'md',
  variant = 'bordered',
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  leftElement,
  rightElement,
  onTogglePassword,
  showPasswordToggle = false,
  loading = false,
  autoComplete,
  maxLength,
  minLength,
  pattern,
  className = '',
  labelClassName = '',
  inputClassName = '',
  containerClassName = '',
  'aria-label': ariaLabel,
  'aria-describedby': ariaDescribedBy,
  onFocus,
  onBlur,
  onChange,
  ...props
}, ref) => {
  const inputId = useId();
  const errorId = useId();
  const helperTextId = useId();

  // Estado para mostrar/ocultar contraseña
  const [showPassword, setShowPassword] = React.useState(false);

  // Tipo de input dinámico para contraseñas
  const inputType = useMemo(() => {
    if (type === 'password' && showPassword) {
      return 'text';
    }
    return type;
  }, [type, showPassword]);

  // Memoizar clases del contenedor
  const containerClasses = useMemo(() => {
    const classes = ['form-control w-full'];
    
    if (containerClassName) {
      classes.push(containerClassName);
    }
    
    return classes.join(' ');
  }, [containerClassName]);

  // Memoizar clases del label
  const labelClasses = useMemo(() => {
    const classes = ['label'];
    
    if (required) {
      classes.push('label-required');
    }
    
    if (labelClassName) {
      classes.push(labelClassName);
    }
    
    return classes.join(' ');
  }, [required, labelClassName]);

  // Memoizar clases del input
  const inputClasses = useMemo(() => {
    const baseClasses = ['input w-full'];
    
    // Variantes
    const variantClasses = {
      bordered: 'input-bordered',
      ghost: 'input-ghost',
      primary: 'input-primary',
      secondary: 'input-secondary',
      accent: 'input-accent'
    };
    
    // Tamaños
    const sizeClasses = {
      xs: 'input-xs',
      sm: 'input-sm',
      md: '', // tamaño por defecto
      lg: 'input-lg',
      xl: 'input-xl'
    };
    
    // Estados
    if (error) {
      baseClasses.push('input-error');
    } else if (success) {
      baseClasses.push('input-success');
    } else if (warning) {
      baseClasses.push('input-warning');
    }
    
    // Variante y tamaño
    if (variantClasses[variant]) {
      baseClasses.push(variantClasses[variant]);
    }
    
    if (sizeClasses[size]) {
      baseClasses.push(sizeClasses[size]);
    }
    
    // Estados especiales
    if (disabled) {
      baseClasses.push('input-disabled');
    }
    
    if (loading) {
      baseClasses.push('loading');
    }
    
    // Iconos o elementos
    if (LeftIcon || leftElement) {
      baseClasses.push('pl-10');
    }
    
    if (RightIcon || rightElement || (type === 'password' && showPasswordToggle)) {
      baseClasses.push('pr-10');
    }
    
    // Clases personalizadas
    if (inputClassName) {
      baseClasses.push(inputClassName);
    }
    
    if (className) {
      baseClasses.push(className);
    }
    
    return baseClasses.join(' ');
  }, [variant, size, error, success, warning, disabled, loading, LeftIcon, leftElement, RightIcon, rightElement, type, showPasswordToggle, inputClassName, className]);

  // Manejar toggle de contraseña
  const handlePasswordToggle = useCallback(() => {
    const newShowPassword = !showPassword;
    setShowPassword(newShowPassword);
    onTogglePassword?.(newShowPassword);
  }, [showPassword, onTogglePassword]);

  // Manejar eventos con validación
  const handleFocus = useCallback((e) => {
    onFocus?.(e);
  }, [onFocus]);

  const handleBlur = useCallback((e) => {
    onBlur?.(e);
  }, [onBlur]);

  const handleChange = useCallback((e) => {
    onChange?.(e);
  }, [onChange]);

  // Construir aria-describedby
  const ariaDescribedByValue = useMemo(() => {
    const ids = [];
    
    if (error && errorId) {
      ids.push(errorId);
    }
    
    if (helperText && helperTextId) {
      ids.push(helperTextId);
    }
    
    if (ariaDescribedBy) {
      ids.push(ariaDescribedBy);
    }
    
    return ids.length > 0 ? ids.join(' ') : undefined;
  }, [error, errorId, helperText, helperTextId, ariaDescribedBy]);

  return (
    <div className={containerClasses}>
      {/* Label */}
      {label && (
        <label htmlFor={inputId} className={labelClasses}>
          <span className="label-text">
            {label}
            {required && <span className="text-error ml-1" aria-label="requerido">*</span>}
          </span>
        </label>
      )}
      
      {/* Input Container */}
      <div className="relative">
        {/* Left Icon/Element */}
        {LeftIcon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
            <LeftIcon className="h-5 w-5 text-base-content/60" aria-hidden="true" />
          </div>
        )}
        
        {leftElement && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
            {leftElement}
          </div>
        )}
        
        {/* Input */}
        <input
          ref={ref}
          id={inputId}
          type={inputType}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          readOnly={readOnly}
          autoComplete={autoComplete}
          maxLength={maxLength}
          minLength={minLength}
          pattern={pattern}
          className={inputClasses}
          aria-label={ariaLabel || label}
          aria-describedby={ariaDescribedByValue}
          aria-invalid={error ? 'true' : 'false'}
          aria-required={required}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={handleChange}
          {...props}
        />
        
        {/* Right Icon/Element */}
        {RightIcon && !showPasswordToggle && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
            <RightIcon className="h-5 w-5 text-base-content/60" aria-hidden="true" />
          </div>
        )}
        
        {rightElement && !showPasswordToggle && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            {rightElement}
          </div>
        )}
        
        {/* Password Toggle */}
        {type === 'password' && showPasswordToggle && (
          <button
            type="button"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 btn btn-ghost btn-sm btn-circle"
            onClick={handlePasswordToggle}
            disabled={disabled}
            aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            tabIndex={disabled ? -1 : 0}
          >
            {showPassword ? (
              <EyeSlashIcon className="h-4 w-4" aria-hidden="true" />
            ) : (
              <EyeIcon className="h-4 w-4" aria-hidden="true" />
            )}
          </button>
        )}
        
        {/* Loading Spinner */}
        {loading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <span className="loading loading-spinner loading-sm"></span>
          </div>
        )}
      </div>
      
      {/* Helper Text */}
      {(error || success || warning || helperText) && (
        <label className="label">
          <span className="label-text-alt">
            {error && (
              <span id={errorId} className="text-error" role="alert">
                {error}
              </span>
            )}
            {success && !error && (
              <span className="text-success">
                {success}
              </span>
            )}
            {warning && !error && !success && (
              <span className="text-warning">
                {warning}
              </span>
            )}
            {helperText && !error && !success && !warning && (
              <span id={helperTextId} className="text-base-content/60">
                {helperText}
              </span>
            )}
          </span>
        </label>
      )}
    </div>
  );
}));

Input.displayName = 'Input';

export default Input;