/**
 * Stepper - Componente de pasos para wizards y formularios multi-paso
 * 
 * Características:
 * - ✅ Horizontal y vertical
 * - ✅ Estados: pending, active, completed, error
 * - ✅ Números o íconos personalizados
 * - ✅ Navegación entre pasos
 * - ✅ Validación por paso
 * - ✅ Responsive
 * 
 * @example
 * ```tsx
 * const steps = [
 *   { label: 'Información', description: 'Datos básicos' },
 *   { label: 'Verificación', description: 'Confirmar datos' },
 *   { label: 'Finalizar', description: 'Completar registro' }
 * ]
 * 
 * <Stepper steps={steps} currentStep={1} onStepClick={setStep} />
 * ```
 */

import type { ReactNode } from 'react'
import { CheckIcon } from '@heroicons/react/24/solid'
import clsx from 'clsx'

export interface Step {
  /** Etiqueta del paso */
  label: string
  /** Descripción opcional */
  description?: string
  /** Ícono custom (si no, muestra número) */
  icon?: ReactNode
  /** Paso opcional/skippable */
  optional?: boolean
}

export interface StepperProps {
  /** Lista de pasos */
  steps: Step[]
  /** Paso actual (0-indexed) */
  currentStep: number
  /** Callback al hacer clic en un paso */
  onStepClick?: (stepIndex: number) => void
  /** Orientación */
  orientation?: 'horizontal' | 'vertical'
  /** Permitir navegación libre (default: solo hacia atrás) */
  allowClickAhead?: boolean
  /** Pasos con error */
  errorSteps?: number[]
  /** Clase CSS adicional */
  className?: string
}

/**
 * Componente Stepper
 */
export function Stepper({
  steps,
  currentStep,
  onStepClick,
  orientation = 'horizontal',
  allowClickAhead = false,
  errorSteps = [],
  className,
}: StepperProps) {
  const isVertical = orientation === 'vertical'

  const getStepStatus = (index: number): 'pending' | 'active' | 'completed' | 'error' => {
    if (errorSteps.includes(index)) return 'error'
    if (index < currentStep) return 'completed'
    if (index === currentStep) return 'active'
    return 'pending'
  }

  const canClickStep = (index: number) => {
    if (!onStepClick) return false
    if (index === currentStep) return false
    if (allowClickAhead) return true
    return index < currentStep
  }

  const statusStyles = {
    pending: {
      circle: 'bg-gray-100 dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400',
      label: 'text-gray-500 dark:text-gray-400',
      line: 'bg-gray-300 dark:bg-gray-600',
    },
    active: {
      circle: 'bg-primary-600 dark:bg-primary-500 border-2 border-primary-600 dark:border-primary-500 text-white',
      label: 'text-primary-600 dark:text-primary-400 font-semibold',
      line: 'bg-gray-300 dark:bg-gray-600',
    },
    completed: {
      circle: 'bg-primary-600 dark:bg-primary-500 border-2 border-primary-600 dark:border-primary-500 text-white',
      label: 'text-gray-700 dark:text-gray-300',
      line: 'bg-primary-600 dark:bg-primary-500',
    },
    error: {
      circle: 'bg-red-100 dark:bg-red-900/30 border-2 border-red-600 dark:border-red-500 text-red-600 dark:text-red-400',
      label: 'text-red-600 dark:text-red-400',
      line: 'bg-gray-300 dark:bg-gray-600',
    },
  }

  return (
    <nav aria-label="Progress" className={className}>
      <ol className={clsx('flex', isVertical ? 'flex-col gap-4' : 'flex-row items-center')}>
        {steps.map((step, index) => {
          const status = getStepStatus(index)
          const styles = statusStyles[status]
          const clickable = canClickStep(index)
          const isLast = index === steps.length - 1

          return (
            <li
              key={index}
              className={clsx(
                'relative flex',
                isVertical ? 'flex-col' : 'flex-1 flex-row items-center',
                !isLast && (isVertical ? 'pb-4' : '')
              )}
            >
              <button
                type="button"
                className={clsx(
                  'flex items-center group',
                  isVertical ? 'flex-row gap-3' : 'flex-col gap-2',
                  clickable && 'cursor-pointer hover:opacity-80',
                  !clickable && 'cursor-default'
                )}
                onClick={() => clickable && onStepClick?.(index)}
                disabled={!clickable}
              >
                {/* Circle */}
                <div
                  className={clsx(
                    'flex items-center justify-center w-10 h-10 rounded-full transition-all duration-200',
                    styles.circle,
                    clickable && 'group-hover:scale-110'
                  )}
                >
                  {status === 'completed' ? (
                    <CheckIcon className="w-5 h-5" />
                  ) : step.icon ? (
                    <div className="w-5 h-5">{step.icon}</div>
                  ) : (
                    <span className="font-semibold">{index + 1}</span>
                  )}
                </div>

                {/* Label */}
                <div className={clsx('flex flex-col', isVertical ? 'text-left' : 'text-center')}>
                  <span className={clsx('text-sm font-medium transition-colors', styles.label)}>
                    {step.label}
                    {step.optional && (
                      <span className="ml-1 text-xs text-gray-400">(Opcional)</span>
                    )}
                  </span>
                  {step.description && (
                    <span className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      {step.description}
                    </span>
                  )}
                </div>
              </button>

              {/* Connector Line */}
              {!isLast && (
                <div
                  className={clsx(
                    'transition-colors duration-200',
                    isVertical
                      ? 'absolute left-5 top-10 w-0.5 h-full -translate-x-1/2'
                      : 'flex-1 h-0.5 mx-4',
                    statusStyles[getStepStatus(index)].line
                  )}
                />
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

/**
 * Hook helper para manejar navegación de stepper
 */
export function useStepper(totalSteps: number, initialStep = 0) {
  const [currentStep, setCurrentStep] = useState(initialStep)

  const next = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const goTo = (step: number) => {
    if (step >= 0 && step < totalSteps) {
      setCurrentStep(step)
    }
  }

  const reset = () => {
    setCurrentStep(0)
  }

  return {
    currentStep,
    next,
    prev,
    goTo,
    reset,
    isFirst: currentStep === 0,
    isLast: currentStep === totalSteps - 1,
    progress: ((currentStep + 1) / totalSteps) * 100,
  }
}

// Necesario importar useState
import { useState } from 'react'
