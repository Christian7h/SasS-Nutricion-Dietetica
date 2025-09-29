import { useState, useCallback } from 'react';

/**
 * Hook personalizado para manejo de modales
 * Proporciona estado y funciones para controlar la visibilidad de modales
 * 
 * @param {boolean} initialState - Estado inicial del modal (abierto/cerrado)
 * @returns {Object} Objeto con estado y funciones de control
 */
export const useModal = (initialState = false) => {
  const [isOpen, setIsOpen] = useState(initialState);

  const openModal = useCallback(() => setIsOpen(true), []);
  const closeModal = useCallback(() => setIsOpen(false), []);
  const toggleModal = useCallback(() => setIsOpen(prev => !prev), []);

  return {
    isOpen,
    openModal,
    closeModal,
    toggleModal,
    setIsOpen
  };
};

/**
 * Hook para manejo de múltiples modales
 * Útil cuando necesitas controlar varios modales en un componente
 * 
 * @param {Object} initialStates - Objeto con estados iniciales de cada modal
 * @returns {Object} Objeto con estados y funciones para cada modal
 */
export const useMultipleModals = (initialStates = {}) => {
  const [modals, setModals] = useState(initialStates);

  const openModal = useCallback((modalName) => {
    setModals(prev => ({ ...prev, [modalName]: true }));
  }, []);

  const closeModal = useCallback((modalName) => {
    setModals(prev => ({ ...prev, [modalName]: false }));
  }, []);

  const toggleModal = useCallback((modalName) => {
    setModals(prev => ({ ...prev, [modalName]: !prev[modalName] }));
  }, []);

  const closeAllModals = useCallback(() => {
    setModals(prev => 
      Object.keys(prev).reduce((acc, key) => ({ ...acc, [key]: false }), {})
    );
  }, []);

  return {
    modals,
    openModal,
    closeModal,
    toggleModal,
    closeAllModals,
    setModals
  };
};

/**
 * Hook para modales con confirmación
 * Proporciona funcionalidad adicional para modales de confirmación
 * 
 * @param {Function} onConfirm - Función a ejecutar cuando se confirma
 * @param {Object} options - Opciones adicionales
 * @returns {Object} Objeto con estado y funciones de control
 */
export const useConfirmModal = (onConfirm, options = {}) => {
  const { isOpen, openModal, closeModal } = useModal();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);

  const confirm = useCallback(async (confirmData = null) => {
    if (loading) return;
    
    setLoading(true);
    try {
      await onConfirm(confirmData || data);
      closeModal();
      setData(null);
    } catch (error) {
      console.error('Error en confirmación:', error);
      if (options.onError) {
        options.onError(error);
      }
    } finally {
      setLoading(false);
    }
  }, [onConfirm, data, loading, closeModal, options]);

  const openConfirmModal = useCallback((confirmData = null) => {
    setData(confirmData);
    openModal();
  }, [openModal]);

  const cancel = useCallback(() => {
    if (loading) return;
    closeModal();
    setData(null);
    if (options.onCancel) {
      options.onCancel();
    }
  }, [loading, closeModal, options]);

  return {
    isOpen,
    loading,
    data,
    openConfirmModal,
    confirm,
    cancel,
    setData
  };
};

export default useModal;
