import React, { useCallback } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { 
  CheckCircleIcon, 
  ExclamationTriangleIcon, 
  InformationCircleIcon, 
  XCircleIcon 
} from '@heroicons/react/24/solid';
import { useNotifications } from '../../hooks/useNotifications';
import { NOTIFICATION_TYPES } from '../../constants';

// Configuración de iconos y estilos por tipo
const notificationConfig = {
  [NOTIFICATION_TYPES.SUCCESS]: {
    icon: CheckCircleIcon,
    iconClass: 'text-success',
    bgClass: 'alert-success',
    borderClass: 'border-success/20'
  },
  [NOTIFICATION_TYPES.ERROR]: {
    icon: XCircleIcon,
    iconClass: 'text-error',
    bgClass: 'alert-error',
    borderClass: 'border-error/20'
  },
  [NOTIFICATION_TYPES.WARNING]: {
    icon: ExclamationTriangleIcon,
    iconClass: 'text-warning',
    bgClass: 'alert-warning',
    borderClass: 'border-warning/20'
  },
  [NOTIFICATION_TYPES.INFO]: {
    icon: InformationCircleIcon,
    iconClass: 'text-info',
    bgClass: 'alert-info',
    borderClass: 'border-info/20'
  }
};

// Componente individual de notificación
const NotificationItem = React.memo(({ notification }) => {
  const { removeNotification } = useNotifications();
  
  const config = notificationConfig[notification.type] || notificationConfig[NOTIFICATION_TYPES.INFO];
  const Icon = config.icon;

  const handleClose = useCallback(() => {
    removeNotification(notification.id);
  }, [notification.id, removeNotification]);

  const handleActionClick = useCallback((action) => {
    action.onClick?.();
    if (action.closeOnClick !== false) {
      handleClose();
    }
  }, [handleClose]);

  return (
    <div 
      className={`
        alert shadow-lg mb-3 animate-in slide-in-from-right-full duration-300
        ${config.bgClass} border ${config.borderClass}
        relative overflow-hidden
      `}
      role="alert"
      aria-live={notification.type === NOTIFICATION_TYPES.ERROR ? 'assertive' : 'polite'}
    >
      {/* Barra de progreso para auto-close */}
      {notification.autoClose && !notification.persistent && (
        <div 
          className="absolute bottom-0 left-0 h-1 bg-current opacity-30 animate-pulse"
          style={{
            width: '100%',
            animationDuration: `${notification.duration}ms`,
            animationTimingFunction: 'linear',
            animationFillMode: 'forwards'
          }}
        />
      )}

      <div className="flex items-start space-x-3 w-full">
        {/* Icono */}
        <Icon className={`h-6 w-6 ${config.iconClass} flex-shrink-0 mt-0.5`} />
        
        {/* Contenido */}
        <div className="flex-1 min-w-0">
          {/* Título si existe */}
          {notification.title && (
            <h4 className="font-semibold text-sm mb-1">
              {notification.title}
            </h4>
          )}
          
          {/* Mensaje */}
          <p className="text-sm text-current/90">
            {notification.message}
          </p>
          
          {/* Descripción adicional */}
          {notification.description && (
            <p className="text-xs text-current/70 mt-1">
              {notification.description}
            </p>
          )}
          
          {/* Acciones */}
          {notification.actions && notification.actions.length > 0 && (
            <div className="flex space-x-2 mt-3">
              {notification.actions.map((action, index) => (
                <button
                  key={index}
                  className="btn btn-sm btn-outline"
                  onClick={() => handleActionClick(action)}
                >
                  {action.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Botón de cerrar */}
        <button
          className="btn btn-ghost btn-sm btn-circle flex-shrink-0"
          onClick={handleClose}
          aria-label="Cerrar notificación"
        >
          <XMarkIcon className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
});

NotificationItem.displayName = 'NotificationItem';

// Componente contenedor de notificaciones
const NotificationContainer = React.memo(({ position = 'top-right' }) => {
  const { notifications } = useNotifications();

  // Posicionamiento
  const positionClasses = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'top-center': 'top-4 left-1/2 transform -translate-x-1/2',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-center': 'bottom-4 left-1/2 transform -translate-x-1/2'
  };

  if (notifications.length === 0) {
    return null;
  }

  return (
    <div 
      className={`
        fixed z-[9999] w-full max-w-sm pointer-events-none
        ${positionClasses[position] || positionClasses['top-right']}
      `}
    >
      <div className="space-y-2 pointer-events-auto">
        {notifications.map((notification) => (
          <NotificationItem 
            key={notification.id} 
            notification={notification} 
          />
        ))}
      </div>
    </div>
  );
});

NotificationContainer.displayName = 'NotificationContainer';

// Componente toast simple para notificaciones rápidas
export const Toast = React.memo(({ 
  type = NOTIFICATION_TYPES.INFO, 
  message, 
  onClose,
  autoClose = true,
  duration = 3000
}) => {
  const config = notificationConfig[type] || notificationConfig[NOTIFICATION_TYPES.INFO];
  const Icon = config.icon;

  React.useEffect(() => {
    if (autoClose && onClose) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [autoClose, duration, onClose]);

  return (
    <div className={`toast toast-top toast-end z-[9999]`}>
      <div className={`alert ${config.bgClass}`}>
        <Icon className={`h-6 w-6 ${config.iconClass}`} />
        <span>{message}</span>
        {onClose && (
          <button
            className="btn btn-ghost btn-sm btn-circle"
            onClick={onClose}
            aria-label="Cerrar"
          >
            <XMarkIcon className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
});

Toast.displayName = 'Toast';

export default NotificationContainer;
