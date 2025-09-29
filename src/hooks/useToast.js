import React, { useCallback, useState } from 'react';
import { NOTIFICATION_TYPES } from '../constants';

// Hook para mostrar toasts rápidos
export const useToast = () => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((type, message, options = {}) => {
    const id = Date.now() + Math.random();
    const toast = {
      id,
      type,
      message,
      ...options
    };

    setToasts(prev => [...prev, toast]);

    if (options.autoClose !== false) {
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id));
      }, options.duration || 3000);
    }

    return id;
  }, []);

  const hideToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const success = useCallback((message, options) => 
    showToast(NOTIFICATION_TYPES.SUCCESS, message, options), [showToast]);
  
  const error = useCallback((message, options) => 
    showToast(NOTIFICATION_TYPES.ERROR, message, options), [showToast]);
  
  const warning = useCallback((message, options) => 
    showToast(NOTIFICATION_TYPES.WARNING, message, options), [showToast]);
  
  const info = useCallback((message, options) => 
    showToast(NOTIFICATION_TYPES.INFO, message, options), [showToast]);

  return {
    toasts,
    showToast,
    hideToast,
    success,
    error,
    warning,
    info
  };
};

export default useToast;
