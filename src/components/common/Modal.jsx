import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import Button from './Button';

export default function Modal({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  size = 'md',
  showCloseButton = true,
  footer,
  ...props 
}) {
  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    '4xl': 'max-w-4xl',
    '6xl': 'max-w-6xl',
    full: 'max-w-7xl'
  };

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose} {...props}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25 transition-opacity" />
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
              <Dialog.Panel className={`relative transform rounded-lg bg-base-100 px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full ${sizeClasses[size]} sm:p-6`}>
                <div className="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
                  {showCloseButton && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="btn-circle"
                      onClick={onClose}
                    >
                      <span className="sr-only">Cerrar</span>
                      <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                    </Button>
                  )}
                </div>

                {title && (
                  <div className="mb-4">
                    <Dialog.Title as="h3" className="text-lg font-semibold leading-6 text-base-content">
                      {title}
                    </Dialog.Title>
                  </div>
                )}

                <div className="mt-3 text-center sm:mt-0 sm:text-left">
                  {children}
                </div>

                {footer && (
                  <div className="mt-5 sm:mt-6 sm:flex sm:flex-row-reverse">
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
}

// Componentes de Modal específicos
export const ModalHeader = ({ children, className = '' }) => (
  <div className={`border-b border-base-300 pb-4 mb-4 ${className}`}>
    {children}
  </div>
);

export const ModalBody = ({ children, className = '' }) => (
  <div className={`${className}`}>
    {children}
  </div>
);

export const ModalFooter = ({ children, className = '' }) => (
  <div className={`flex justify-end space-x-3 pt-4 border-t border-base-300 mt-6 ${className}`}>
    {children}
  </div>
);
