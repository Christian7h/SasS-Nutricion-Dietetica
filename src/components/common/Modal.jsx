import React, { Fragment, useCallback, useMemo, useRef, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import Button from './Button';

const Modal = React.memo(function Modal({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  size = 'md',
  showCloseButton = true,
  footer,
  loading = false,
  closeOnOverlayClick = true,
  preventScroll = true,
  initialFocus,
  className = '',
  'aria-labelledby': ariaLabelledby,
  'aria-describedby': ariaDescribedby,
  ...props 
}) {
  const initialFocusRef = useRef(null);
  const cancelButtonRef = useRef(null);

  // Memoizar las clases de tamaño
  const sizeClasses = useMemo(() => {
    const sizes = {
      xs: 'max-w-xs',
      sm: 'max-w-md',
      md: 'max-w-lg',
      lg: 'max-w-2xl',
      xl: 'max-w-4xl',
      '2xl': 'max-w-2xl',
      '3xl': 'max-w-3xl',
      '4xl': 'max-w-4xl',
      '5xl': 'max-w-5xl',
      '6xl': 'max-w-6xl',
      '7xl': 'max-w-7xl',
      full: 'max-w-7xl'
    };
    
    return sizes[size] || sizes.md;
  }, [size]);

  // Memoizar las clases del panel
  const panelClasses = useMemo(() => {
    const classes = [
      'relative transform rounded-lg bg-base-100 px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:p-6',
      sizeClasses
    ];

    if (className) {
      classes.push(className);
    }

    return classes.join(' ');
  }, [sizeClasses, className]);

  // Manejo optimizado del cierre
  const handleClose = useCallback(() => {
    if (loading) return;
    onClose();
  }, [onClose, loading]);

  // Configurar el foco inicial
  useEffect(() => {
    if (isOpen && initialFocus) {
      initialFocusRef.current = initialFocus;
    }
  }, [isOpen, initialFocus]);

  // Configurar scroll prevention
  useEffect(() => {
    if (isOpen && preventScroll) {
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = 'hidden';
      
      return () => {
        document.body.style.overflow = originalStyle;
      };
    }
  }, [isOpen, preventScroll]);

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog 
        as="div" 
        className="relative z-50" 
        onClose={closeOnOverlayClick ? handleClose : () => {}}
        initialFocus={initialFocusRef.current || cancelButtonRef}
        {...props}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/25 backdrop-blur-sm transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className={panelClasses}>
                {/* Loading Overlay */}
                {loading && (
                  <div className="absolute inset-0 bg-base-100/80 backdrop-blur-sm flex items-center justify-center z-50 rounded-lg">
                    <span className="loading loading-spinner loading-lg text-primary"></span>
                  </div>
                )}

                {/* Close Button */}
                <div className="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
                  {showCloseButton && (
                    <Button
                      ref={cancelButtonRef}
                      variant="ghost"
                      size="sm"
                      className="btn-circle hover:bg-base-200 focus:ring-2 focus:ring-primary focus:ring-offset-2"
                      onClick={handleClose}
                      disabled={loading}
                      aria-label="Cerrar modal"
                    >
                      <XMarkIcon className="h-5 w-5" aria-hidden="true" />
                    </Button>
                  )}
                </div>

                {/* Title */}
                {title && (
                  <div className="mb-4 pr-10">
                    <Dialog.Title 
                      as="h3" 
                      className="text-lg font-semibold leading-6 text-base-content"
                      id={ariaLabelledby}
                    >
                      {title}
                    </Dialog.Title>
                  </div>
                )}

                {/* Content */}
                <div 
                  className="mt-3 text-center sm:mt-0 sm:text-left"
                  id={ariaDescribedby}
                >
                  {children}
                </div>

                {/* Footer */}
                {footer && (
                  <div className="mt-5 sm:mt-6 sm:flex sm:flex-row-reverse sm:gap-3">
                    {footer}
                  </div>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
});

Modal.displayName = 'Modal';

// Componentes de Modal optimizados
export const ModalHeader = React.memo(({ children, className = '', divided = true }) => {
  const headerClasses = useMemo(() => {
    const classes = [];
    
    if (divided) {
      classes.push('border-b border-base-300 pb-4 mb-4');
    } else {
      classes.push('mb-4');
    }
    
    if (className) {
      classes.push(className);
    }
    
    return classes.join(' ');
  }, [divided, className]);

  return (
    <div className={headerClasses}>
      {children}
    </div>
  );
});

ModalHeader.displayName = 'ModalHeader';

export const ModalBody = React.memo(({ children, className = '', padding = true }) => {
  const bodyClasses = useMemo(() => {
    const classes = [];
    
    if (!padding) {
      classes.push('-mx-6 -mb-6');
    }
    
    if (className) {
      classes.push(className);
    }
    
    return classes.length > 0 ? classes.join(' ') : undefined;
  }, [padding, className]);

  return (
    <div className={bodyClasses}>
      {children}
    </div>
  );
});

ModalBody.displayName = 'ModalBody';

export const ModalFooter = React.memo(({ 
  children, 
  className = '', 
  divided = true,
  align = 'end',
  stack = false
}) => {
  const footerClasses = useMemo(() => {
    const classes = [];
    
    if (divided) {
      classes.push('border-t border-base-300 pt-4 mt-6');
    } else {
      classes.push('mt-6');
    }
    
    // Alignment
    const alignClasses = {
      start: 'justify-start',
      center: 'justify-center',
      end: 'justify-end',
      between: 'justify-between'
    };
    
    if (stack) {
      classes.push('flex flex-col-reverse sm:flex-row space-y-2 space-y-reverse sm:space-y-0 sm:space-x-3');
      classes.push(alignClasses[align] || alignClasses.end);
    } else {
      classes.push('flex space-x-3');
      classes.push(alignClasses[align] || alignClasses.end);
    }
    
    if (className) {
      classes.push(className);
    }
    
    return classes.join(' ');
  }, [divided, align, stack, className]);

  return (
    <div className={footerClasses}>
      {children}
    </div>
  );
});

ModalFooter.displayName = 'ModalFooter';

// Modal de confirmación optimizado
export const ConfirmModal = React.memo(({
  isOpen,
  onClose,
  onConfirm,
  title = '¿Estás seguro?',
  message = 'Esta acción no se puede deshacer.',
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  type = 'warning',
  loading = false,
  ...props
}) => {
  const typeConfig = useMemo(() => {
    const configs = {
      warning: {
        icon: '⚠️',
        confirmClass: 'btn-warning',
        iconColor: 'text-warning'
      },
      danger: {
        icon: '🗑️',
        confirmClass: 'btn-error',
        iconColor: 'text-error'
      },
      info: {
        icon: 'ℹ️',
        confirmClass: 'btn-info',
        iconColor: 'text-info'
      },
      success: {
        icon: '✅',
        confirmClass: 'btn-success',
        iconColor: 'text-success'
      }
    };
    
    return configs[type] || configs.warning;
  }, [type]);

  const handleConfirm = useCallback(async () => {
    if (loading) return;
    
    try {
      await onConfirm();
      onClose();
    } catch (error) {
      console.error('Error en confirmación:', error);
    }
  }, [onConfirm, onClose, loading]);

  const footer = (
    <>
      <Button
        variant="ghost"
        onClick={onClose}
        disabled={loading}
      >
        {cancelText}
      </Button>
      <Button
        className={typeConfig.confirmClass}
        onClick={handleConfirm}
        loading={loading}
        disabled={loading}
      >
        {confirmText}
      </Button>
    </>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="sm"
      loading={loading}
      footer={footer}
      {...props}
    >
      <div className="text-center py-4">
        <div className={`text-4xl mb-4 ${typeConfig.iconColor}`}>
          {typeConfig.icon}
        </div>
        <p className="text-base-content/80">
          {message}
        </p>
      </div>
    </Modal>
  );
});

ConfirmModal.displayName = 'ConfirmModal';

// Modal de formulario optimizado
export const FormModal = React.memo(({
  isOpen,
  onClose,
  onSubmit,
  title,
  children,
  submitText = 'Guardar',
  cancelText = 'Cancelar',
  loading = false,
  disabled = false,
  showFooter = true,
  ...props
}) => {
  const formRef = useRef(null);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (loading || disabled) return;
    
    try {
      await onSubmit(e);
    } catch (error) {
      console.error('Error en envío de formulario:', error);
    }
  }, [onSubmit, loading, disabled]);

  const footer = showFooter ? (
    <>
      <Button
        type="button"
        variant="ghost"
        onClick={onClose}
        disabled={loading}
      >
        {cancelText}
      </Button>
      <Button
        type="submit"
        variant="primary"
        loading={loading}
        disabled={loading || disabled}
        onClick={() => formRef.current?.requestSubmit()}
      >
        {submitText}
      </Button>
    </>
  ) : null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      footer={footer}
      loading={loading}
      {...props}
    >
      <form ref={formRef} onSubmit={handleSubmit}>
        {children}
      </form>
    </Modal>
  );
});

FormModal.displayName = 'FormModal';

export default Modal;
