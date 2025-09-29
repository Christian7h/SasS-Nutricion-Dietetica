import React from 'react';
import { ExclamationTriangleIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import Button from './Button';
import Card from './Card';

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null,
      errorInfo: null,
      retryCount: 0
    };
  }

  static getDerivedStateFromError() {
    // Actualiza el estado para que la próxima renderización muestre la UI de error
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Registrar el error
    this.setState({
      error,
      errorInfo,
      hasError: true
    });

    // Log del error para debugging
    console.error('ErrorBoundary caught an error:', error, errorInfo);

    // Enviar error a servicio de logging (opcional)
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Log a servicio externo en producción
    if (import.meta.env.PROD) {
      this.logErrorToService(error, errorInfo);
    }
  }

  logErrorToService = (error, errorInfo) => {
    try {
      // Implementar logging service aquí
      // Por ejemplo, Sentry, LogRocket, etc.
      const errorData = {
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href,
        userId: this.props.userId || 'anonymous'
      };

      // Simular envío a servicio de logging
      console.log('Sending error to logging service:', errorData);
    } catch (loggingError) {
      console.error('Failed to log error to service:', loggingError);
    }
  };

  handleRetry = () => {
    this.setState(prevState => ({
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: prevState.retryCount + 1
    }));
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      // UI personalizada de error
      if (this.props.fallback) {
        return this.props.fallback(
          this.state.error,
          this.state.errorInfo,
          this.handleRetry
        );
      }

      // UI por defecto de error
      return (
        <ErrorFallback
          error={this.state.error}
          errorInfo={this.state.errorInfo}
          retryCount={this.state.retryCount}
          onRetry={this.handleRetry}
          onReload={this.handleReload}
          level={this.props.level || 'component'}
        />
      );
    }

    return this.props.children;
  }
}

// Componente de UI de error por defecto
const ErrorFallback = React.memo(({ 
  error, 
  retryCount, 
  onRetry, 
  onReload,
  level = 'component'
}) => {
  const isDevelopment = import.meta.env.DEV;
  
  // Diferentes niveles de error
  const errorLevels = {
    app: {
      title: 'Error de Aplicación',
      description: 'La aplicación ha encontrado un error inesperado.',
      icon: '🚨',
      severity: 'critical'
    },
    page: {
      title: 'Error de Página',
      description: 'Esta página ha encontrado un error.',
      icon: '⚠️',
      severity: 'high'
    },
    component: {
      title: 'Error de Componente',
      description: 'Un componente ha encontrado un error.',
      icon: '🔧',
      severity: 'medium'
    },
    feature: {
      title: 'Error de Funcionalidad',
      description: 'Esta funcionalidad no está disponible temporalmente.',
      icon: '⚡',
      severity: 'low'
    }
  };

  const errorLevel = errorLevels[level] || errorLevels.component;

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center p-4">
      <Card className="max-w-lg w-full text-center" variant="outlined">
        <div className="card-body">
          {/* Icon */}
          <div className="text-6xl mb-4">
            {errorLevel.icon}
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-error mb-2">
            {errorLevel.title}
          </h1>

          {/* Description */}
          <p className="text-base-content/70 mb-6">
            {errorLevel.description}
          </p>

          {/* Error Message (Development) */}
          {isDevelopment && error && (
            <div className="bg-base-300 rounded-lg p-4 mb-6 text-left">
              <h3 className="font-semibold text-sm mb-2 text-error">
                Error Details (Development Only):
              </h3>
              <pre className="text-xs overflow-auto max-h-32 text-base-content/80">
                {error.message}
              </pre>
              {error.stack && (
                <details className="mt-2">
                  <summary className="cursor-pointer text-xs text-primary">
                    Stack Trace
                  </summary>
                  <pre className="text-xs mt-2 overflow-auto max-h-40 text-base-content/60">
                    {error.stack}
                  </pre>
                </details>
              )}
            </div>
          )}

          {/* Retry Count */}
          {retryCount > 0 && (
            <div className="alert alert-warning mb-4">
              <ExclamationTriangleIcon className="h-5 w-5" />
              <span className="text-sm">
                Intentos de recuperación: {retryCount}
              </span>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              onClick={onRetry}
              variant="primary"
              size="md"
              className="flex items-center gap-2"
            >
              <ArrowPathIcon className="h-4 w-4" />
              Reintentar
            </Button>

            {level === 'app' || retryCount >= 3 ? (
              <Button
                onClick={onReload}
                variant="outline"
                size="md"
              >
                Recargar Página
              </Button>
            ) : (
              <Button
                onClick={() => window.history.back()}
                variant="ghost"
                size="md"
              >
                Volver Atrás
              </Button>
            )}
          </div>

          {/* Help Text */}
          <p className="text-xs text-base-content/50 mt-6">
            Si el problema persiste, contacta al soporte técnico.
          </p>
        </div>
      </Card>
    </div>
  );
});

ErrorFallback.displayName = 'ErrorFallback';



// Componente para errores específicos de async
export const AsyncErrorBoundary = React.memo(({ children, onError, fallback }) => {
  return (
    <ErrorBoundary 
      onError={onError}
      fallback={fallback}
      level="feature"
    >
      {children}
    </ErrorBoundary>
  );
});

AsyncErrorBoundary.displayName = 'AsyncErrorBoundary';

// Componente para errores de rutas
export const RouteErrorBoundary = React.memo(({ children, onError }) => {
  return (
    <ErrorBoundary 
      onError={onError}
      level="page"
    >
      {children}
    </ErrorBoundary>
  );
});

RouteErrorBoundary.displayName = 'RouteErrorBoundary';

// Componente para errores de aplicación completa
export const AppErrorBoundary = React.memo(({ children, onError, userId }) => {
  return (
    <ErrorBoundary 
      onError={onError}
      userId={userId}
      level="app"
    >
      {children}
    </ErrorBoundary>
  );
});

AppErrorBoundary.displayName = 'AppErrorBoundary';

export default ErrorBoundary;
