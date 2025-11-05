/**
 * Componente ListBox - Lista seleccionable con imágenes, selección múltiple y deselección
 */

import { Listbox } from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon, XMarkIcon } from '@heroicons/react/24/outline'
import clsx from 'clsx'
import { Fragment } from 'react'
import React from 'react'

export interface ListBoxOption {
  id: string
  label: string
  description?: string
  image?: string
  icon?: React.ComponentType<{ className?: string }>
  disabled?: boolean
}

interface ListBoxProps {
  options: ListBoxOption[]
  value?: string | string[]
  onChange?: (value: string | string[]) => void
  label?: string
  placeholder?: string
  className?: string
  error?: string
  /** Permitir selección múltiple */
  multiple?: boolean
  /** Permitir deseleccionar la opción actual */
  allowDeselect?: boolean
}

export function ListBox({
  options,
  value,
  onChange,
  label,
  placeholder = 'Seleccionar opción',
  className,
  error,
  multiple = false,
  allowDeselect = false,
}: ListBoxProps) {
  const selectedValues = multiple 
    ? (Array.isArray(value) ? value : [])
    : (value ? [value] : [])
  
  const selectedOptions = options.filter(opt => selectedValues.includes(opt.id))

  const handleChange = (newValue: string) => {
    if (multiple) {
      const currentValues = Array.isArray(value) ? value : []
      const isSelected = currentValues.includes(newValue)
      
      if (isSelected && allowDeselect) {
        // Deseleccionar
        onChange?.(currentValues.filter(v => v !== newValue))
      } else if (isSelected) {
        // Ya está seleccionado y no se permite deseleccionar
        return
      } else {
        // Agregar a la selección
        onChange?.([...currentValues, newValue])
      }
    } else {
      // Selección simple
      if (value === newValue && allowDeselect) {
        onChange?.('')
      } else {
        onChange?.(newValue)
      }
    }
  }

  const removeOption = (optionId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (multiple && Array.isArray(value)) {
      onChange?.(value.filter(v => v !== optionId))
    }
  }

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {label}
        </label>
      )}
      
      <Listbox 
        value={typeof value === 'string' ? value : (value?.[0] || '')} 
        onChange={(newValue: string) => {
          if (multiple) {
            handleChange(newValue)
          } else if (value === newValue && allowDeselect) {
            onChange?.('')
          } else {
            onChange?.(newValue)
          }
        }}
      >
        <div className="relative">
          <Listbox.Button
            className={clsx(
              'relative w-full cursor-pointer rounded-xl border py-3 pl-3 pr-10 text-left',
              'focus:outline-none focus:ring-2 focus:ring-primary-500',
              'bg-white dark:bg-gray-800',
              error
                ? 'border-red-300 dark:border-red-700'
                : 'border-gray-300 dark:border-gray-600',
              multiple && selectedOptions.length > 0 && 'py-2'
            )}
          >
            {multiple && selectedOptions.length > 0 ? (
              <div className="flex flex-wrap gap-1">
                {selectedOptions.map((opt) => (
                  <span
                    key={opt.id}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-lg text-sm"
                  >
                    {opt.image && (
                      <img
                        src={opt.image}
                        alt={opt.label}
                        className="h-4 w-4 rounded object-cover"
                      />
                    )}
                    {opt.icon && React.createElement(opt.icon, { className: "h-4 w-4" })}
                    <span className="font-medium">{opt.label}</span>
                    <button
                      onClick={(e) => removeOption(opt.id, e)}
                      className="hover:text-primary-900 dark:hover:text-primary-100"
                    >
                      <XMarkIcon className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            ) : selectedOptions.length === 1 && !multiple ? (
              <span className="flex items-center gap-3">
                {selectedOptions[0].image && (
                  <img
                    src={selectedOptions[0].image}
                    alt={selectedOptions[0].label}
                    className="h-8 w-8 rounded-lg object-cover"
                  />
                )}
                {selectedOptions[0].icon && 
                  React.createElement(selectedOptions[0].icon, { className: "h-6 w-6 text-gray-500" })
                }
                <span className="block truncate">
                  <span className="font-medium text-gray-900 dark:text-white">
                    {selectedOptions[0].label}
                  </span>
                  {selectedOptions[0].description && (
                    <span className="block text-xs text-gray-500 dark:text-gray-400">
                      {selectedOptions[0].description}
                    </span>
                  )}
                </span>
              </span>
            ) : (
              <span className="text-gray-500 dark:text-gray-400">
                {placeholder}
                {multiple && selectedOptions.length > 0 && ` (${selectedOptions.length})`}
              </span>
            )}
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronUpDownIcon className="h-5 w-5 text-gray-400" />
            </span>
          </Listbox.Button>

          <Listbox.Options className="absolute z-50 mt-2 max-h-60 w-full overflow-auto rounded-xl bg-white dark:bg-gray-800 py-1 shadow-2xl ring-1 ring-black/5 dark:ring-white/5 focus:outline-none">
            {options.map((option) => {
              const isSelected = selectedValues.includes(option.id)
              
              return (
                <Listbox.Option
                  key={option.id}
                  value={option.id}
                  disabled={option.disabled}
                  as={Fragment}
                >
                  {({ active }) => (
                    <li
                      className={clsx(
                        'relative cursor-pointer select-none py-3 pl-3 pr-9 mx-1 rounded-lg transition-colors',
                        active && 'bg-primary-50 dark:bg-primary-900/20',
                        option.disabled && 'opacity-50 cursor-not-allowed'
                      )}
                    >
                      <div className="flex items-center gap-3">
                        {multiple && (
                          <div
                            className={clsx(
                              'flex items-center justify-center w-5 h-5 rounded border-2 transition-colors',
                              isSelected
                                ? 'bg-primary-600 border-primary-600'
                                : 'border-gray-300 dark:border-gray-600'
                            )}
                          >
                            {isSelected && (
                              <CheckIcon className="h-3 w-3 text-white" />
                            )}
                          </div>
                        )}
                        {option.image && (
                          <img
                            src={option.image}
                            alt={option.label}
                            className="h-8 w-8 rounded-lg object-cover"
                          />
                        )}
                        {option.icon && 
                          React.createElement(option.icon, { 
                            className: clsx('h-6 w-6', isSelected ? 'text-primary-600' : 'text-gray-500')
                          })
                        }
                        <span className="block truncate">
                          <span
                            className={clsx(
                              'font-medium',
                              isSelected
                                ? 'text-primary-600 dark:text-primary-400'
                                : 'text-gray-900 dark:text-white'
                            )}
                          >
                            {option.label}
                          </span>
                          {option.description && (
                            <span className="block text-xs text-gray-500 dark:text-gray-400">
                              {option.description}
                            </span>
                          )}
                        </span>
                      </div>
                      {!multiple && isSelected && (
                        <span className="absolute inset-y-0 right-0 flex items-center pr-3">
                          <CheckIcon className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                        </span>
                      )}
                    </li>
                  )}
                </Listbox.Option>
              )
            })}
          </Listbox.Options>
        </div>
      </Listbox>

      {error && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  )
}
