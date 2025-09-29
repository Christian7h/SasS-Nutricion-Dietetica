import React, { createContext, useCallback, useReducer, useEffect } from 'react';
import { NOTIFICATION_TYPES, UI_CONFIG } from '../config';

// Tipos de acciones para el reducer
const NOTIFICATION_ACTIONS = {
  ADD_NOTIFICATION: 'ADD_NOTIFICATION',
  REMOVE_NOTIFICATION: 'REMOVE_NOTIFICATION',
  CLEAR_ALL: 'CLEAR_ALL',
  UPDATE_NOTIFICATION: 'UPDATE_NOTIFICATION'
};

// Estado inicial
const initialState = {
  notifications: []
};

// Reducer para manejar las notificaciones
const notificationReducer = (state, action) => {
  switch (action.type) {
    case NOTIFICATION_ACTIONS.ADD_NOTIFICATION: {
      const newNotifications = [action.payload, ...state.notifications];
      // Limitar el número máximo de notificaciones
      return {
        ...state,
        notifications: newNotifications.slice(0, UI_CONFIG.NOTIFICATIONS.MAX_NOTIFICATIONS)
      };
    }

    case NOTIFICATION_ACTIONS.REMOVE_NOTIFICATION: {
      return {
        ...state,
        notifications: state.notifications.filter(
          notification => notification.id !== action.payload
        )
      };
    }

    case NOTIFICATION_ACTIONS.UPDATE_NOTIFICATION: {
      return {
        ...state,
        notifications: state.notifications.map(notification =>
          notification.id === action.payload.id
            ? { ...notification, ...action.payload.updates }
            : notification
        )
      };
    }

    case NOTIFICATION_ACTIONS.CLEAR_ALL: {
      return {
        ...state,
        notifications: []
      };
    }

    default:
      return state;
  }
};

// Context
const NotificationContext = createContext();

// Provider del contexto
export const NotificationProvider = React.memo(({ children }) => {
  const [state, dispatch] = useReducer(notificationReducer, initialState);

  // Función para generar ID único
  const generateId = useCallback(() => {
    return `notification_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }, []);

  // Función para añadir notificación
  const addNotification = useCallback((notification) => {
    const id = generateId();
    const defaultDuration = UI_CONFIG.NOTIFICATIONS.DEFAULT_DURATION;
    
    const newNotification = {
      id,
      type: NOTIFICATION_TYPES.INFO,
      duration: defaultDuration,
      persistent: false,
      autoClose: true,
      position: 'top-right',
      ...notification,
      timestamp: Date.now()
    };

    dispatch({
      type: NOTIFICATION_ACTIONS.ADD_NOTIFICATION,
      payload: newNotification
    });

    // Auto-remove si no es persistente
    if (newNotification.autoClose && !newNotification.persistent) {
      setTimeout(() => {
        dispatch({
          type: NOTIFICATION_ACTIONS.REMOVE_NOTIFICATION,
          payload: id
        });
      }, newNotification.duration);
    }

    return id;
  }, [generateId]);

  // Función para remover notificación
  const removeNotification = useCallback((id) => {
    dispatch({
      type: NOTIFICATION_ACTIONS.REMOVE_NOTIFICATION,
      payload: id
    });
  }, []);

  // Función para actualizar notificación
  const updateNotification = useCallback((id, updates) => {
    dispatch({
      type: NOTIFICATION_ACTIONS.UPDATE_NOTIFICATION,
      payload: { id, updates }
    });
  }, []);

  // Función para limpiar todas las notificaciones
  const clearAll = useCallback(() => {
    dispatch({ type: NOTIFICATION_ACTIONS.CLEAR_ALL });
  }, []);

  // Funciones de conveniencia para diferentes tipos
  const success = useCallback((message, options = {}) => {
    return addNotification({
      type: NOTIFICATION_TYPES.SUCCESS,
      message,
      duration: UI_CONFIG.NOTIFICATIONS.SUCCESS_DURATION,
      ...options
    });
  }, [addNotification]);

  const error = useCallback((message, options = {}) => {
    return addNotification({
      type: NOTIFICATION_TYPES.ERROR,
      message,
      duration: UI_CONFIG.NOTIFICATIONS.ERROR_DURATION,
      persistent: true, // Los errores son persistentes por defecto
      autoClose: false,
      ...options
    });
  }, [addNotification]);

  const warning = useCallback((message, options = {}) => {
    return addNotification({
      type: NOTIFICATION_TYPES.WARNING,
      message,
      duration: UI_CONFIG.NOTIFICATIONS.DEFAULT_DURATION,
      ...options
    });
  }, [addNotification]);

  const info = useCallback((message, options = {}) => {
    return addNotification({
      type: NOTIFICATION_TYPES.INFO,
      message,
      ...options
    });
  }, [addNotification]);

  // Funciones para casos específicos de la aplicación
  const notifyApiError = useCallback((error, customMessage = null) => {
    const message = customMessage || error.userMessage || error.message || 'Ha ocurrido un error inesperado';
    
    return addNotification({
      type: NOTIFICATION_TYPES.ERROR,
      message,
      persistent: true,
      autoClose: false,
      actions: [
        {
          label: 'Reintentar',
          onClick: () => window.location.reload()
        }
      ]
    });
  }, [addNotification]);

  const notifySuccess = useCallback((action, entity = '') => {
    const messages = {
      create: `${entity} creado exitosamente`,
      update: `${entity} actualizado exitosamente`,
      delete: `${entity} eliminado exitosamente`,
      save: `${entity} guardado exitosamente`
    };

    return success(messages[action] || `${action} completado exitosamente`);
  }, [success]);

  // Limpiar notificaciones al desmontar el componente
  useEffect(() => {
    return () => {
      clearAll();
    };
  }, [clearAll]);

  // Valor del contexto memoizado
  const contextValue = React.useMemo(() => ({
    notifications: state.notifications,
    addNotification,
    removeNotification,
    updateNotification,
    clearAll,
    success,
    error,
    warning,
    info,
    notifyApiError,
    notifySuccess
  }), [
    state.notifications,
    addNotification,
    removeNotification,
    updateNotification,
    clearAll,
    success,
    error,
    warning,
    info,
    notifyApiError,
    notifySuccess
  ]);

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
    </NotificationContext.Provider>
  );
});

NotificationProvider.displayName = 'NotificationProvider';

export default NotificationContext;
