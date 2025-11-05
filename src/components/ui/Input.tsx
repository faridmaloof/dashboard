/**
 * Componente Input reutilizable con soporte para formularios y validación regex
 */

import { forwardRef, useState } from 'react'
import type { InputHTMLAttributes, ReactNode, ChangeEvent } from 'react'
import clsx from 'clsx'

type ValidationMode = 'block' | 'error'

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'pattern'> {
  label?: string
  error?: string
  helperText?: string
  icon?: ReactNode
  iconPosition?: 'left' | 'right'
  fullWidth?: boolean
  /** Regex pattern para validación de entrada */
  pattern?: RegExp
  /** Modo de validación: 'block' bloquea caracteres inválidos, 'error' muestra error */
  validationMode?: ValidationMode
  /** Callback cuando el valor cambia (solo se llama con valores válidos si pattern está definido) */
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      icon,
      iconPosition = 'left',
      fullWidth = true,
      className,
      id,
      pattern,
      validationMode = 'block',
      onChange,
      ...props
    },
    ref
  ) => {
    const inputId = id || `input-${Math.random().toString(36).substring(7)}`
    const [validationError, setValidationError] = useState<string>('')

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value

      if (pattern) {
        if (validationMode === 'block') {
          // Modo block: solo permitir caracteres válidos
          if (value === '' || pattern.test(value)) {
            setValidationError('')
            onChange?.(e)
          } else {
            // No actualizar el valor si no cumple el patrón
            e.preventDefault()
          }
        } else {
          // Modo error: permitir entrada pero mostrar error
          if (value === '' || pattern.test(value)) {
            setValidationError('')
            onChange?.(e)
          } else {
            setValidationError('El formato ingresado no es válido')
            onChange?.(e)
          }
        }
      } else {
        // Sin patrón: comportamiento normal
        onChange?.(e)
      }
    }

    const displayError = error || validationError

    return (
      <div className={clsx('flex flex-col', fullWidth && 'w-full')}>
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            {label}
          </label>
        )}

        <div className="relative">
          {icon && iconPosition === 'left' && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              {icon}
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            onChange={handleChange}
            className={clsx(
              'input',
              icon && iconPosition === 'left' && 'pl-10',
              icon && iconPosition === 'right' && 'pr-10',
              displayError && 'border-red-500 focus:ring-red-500',
              className
            )}
            {...props}
          />

          {icon && iconPosition === 'right' && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400">
              {icon}
            </div>
          )}
        </div>

        {displayError && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{displayError}</p>
        )}

        {helperText && !displayError && (
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{helperText}</p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'
