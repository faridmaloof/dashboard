/**
 * Componente Modal
 * Modal reutilizable con overlay y animaciones usando Headless UI
 */

import { Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import clsx from 'clsx'

export interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'
  showCloseButton?: boolean
  footer?: React.ReactNode
}

const sizeClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
  full: 'max-w-full mx-4',
}

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  showCloseButton = true,
  footer,
}: ModalProps) {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel
                className={clsx(
                  'w-full transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 text-left align-middle shadow-xl transition-all',
                  sizeClasses[size]
                )}
              >
                {/* Header */}
                {(title || showCloseButton) && (
                  <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                    {title && (
                      <Dialog.Title
                        as="h3"
                        className="text-lg font-semibold text-gray-900 dark:text-white"
                      >
                        {title}
                      </Dialog.Title>
                    )}
                    {showCloseButton && (
                      <button
                        type="button"
                        className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 transition-colors"
                        onClick={onClose}
                      >
                        <XMarkIcon className="h-6 w-6" />
                      </button>
                    )}
                  </div>
                )}

                {/* Content */}
                <div className="px-6 py-4">
                  {children}
                </div>

                {/* Footer */}
                {footer && (
                  <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
                    {footer}
                  </div>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}
