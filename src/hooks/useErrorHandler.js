import React from 'react';
import ErrorBoundary from '../components/common/ErrorBoundary';

// Hook para manejar errores de forma programática
export const useErrorHandler = () => {
  const [error, setError] = React.useState(null);

  const handleError = React.useCallback((error, errorInfo = null) => {
    console.error('Error handled by useErrorHandler:', error);
    
    // En desarrollo, mostrar el error inmediatamente
    if (import.meta.env.DEV) {
      throw error;
    }
    
    setError({ error, errorInfo });
  }, []);

  const clearError = React.useCallback(() => {
    setError(null);
  }, []);

  // Efecto para lanzar errores al ErrorBoundary
  React.useEffect(() => {
    if (error) {
      throw error.error;
    }
  }, [error]);

  return { handleError, clearError, hasError: !!error };
};

// HOC para envolver componentes con ErrorBoundary
export const withErrorBoundary = (Component, errorBoundaryProps = {}) => {
  const WrappedComponent = React.forwardRef((props, ref) => {
    return (
      <ErrorBoundary {...errorBoundaryProps}>
        <Component {...props} ref={ref} />
      </ErrorBoundary>
    );
  });

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;
  
  return WrappedComponent;
};

// Hook para manejo de errores async
export const useAsyncError = () => {
  const { handleError } = useErrorHandler();

  const throwAsyncError = React.useCallback((error) => {
    // Para errores asíncronos, necesitamos usar un mecanismo diferente
    React.startTransition(() => {
      handleError(error);
    });
  }, [handleError]);

  return throwAsyncError;
};

// Hook para retry con exponential backoff
export const useRetry = (asyncFunction, maxRetries = 3, baseDelay = 1000) => {
  const [state, setState] = React.useState({
    loading: false,
    error: null,
    data: null,
    retryCount: 0
  });

  const { handleError } = useErrorHandler();

  const execute = React.useCallback(async (...args) => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const result = await asyncFunction(...args);
        setState({
          loading: false,
          error: null,
          data: result,
          retryCount: attempt
        });
        return result;
      } catch (error) {
        if (attempt === maxRetries) {
          setState(prev => ({
            ...prev,
            loading: false,
            error,
            retryCount: attempt
          }));
          handleError(error);
          throw error;
        }

        // Exponential backoff
        const delay = baseDelay * Math.pow(2, attempt);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }, [asyncFunction, maxRetries, baseDelay, handleError]);

  const reset = React.useCallback(() => {
    setState({
      loading: false,
      error: null,
      data: null,
      retryCount: 0
    });
  }, []);

  return {
    ...state,
    execute,
    reset
  };
};

// Hook para manejo de errores de formularios
export const useFormErrorHandler = () => {
  const [errors, setErrors] = React.useState({});

  const setFieldError = React.useCallback((field, error) => {
    setErrors(prev => ({ ...prev, [field]: error }));
  }, []);

  const clearFieldError = React.useCallback((field) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  }, []);

  const clearAllErrors = React.useCallback(() => {
    setErrors({});
  }, []);

  const hasErrors = React.useMemo(() => Object.keys(errors).length > 0, [errors]);

  return {
    errors,
    setFieldError,
    clearFieldError,
    clearAllErrors,
    hasErrors
  };
};

// Hook para manejo de errores de red
export const useNetworkErrorHandler = () => {
  const [isOnline, setIsOnline] = React.useState(navigator.onLine);
  const { handleError } = useErrorHandler();

  React.useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleNetworkError = React.useCallback((error) => {
    if (!isOnline) {
      const networkError = new Error('No hay conexión a internet. Verifica tu conexión y vuelve a intentar.');
      networkError.name = 'NetworkError';
      networkError.originalError = error;
      handleError(networkError);
    } else {
      handleError(error);
    }
  }, [isOnline, handleError]);

  return {
    isOnline,
    handleNetworkError
  };
};

export default useErrorHandler;
