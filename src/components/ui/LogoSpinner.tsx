/**
 * LogoSpinner - Spinners creativos usando el logo de FaruTech
 * 
 * Variantes:
 * - spin: Rotación 2D clásica como un círculo
 * - flip: Rotación 3D como una moneda girando verticalmente
 * - flipHorizontal: Rotación 3D horizontal como una moneda girando de lado a lado
 * 
 * @example
 * <LogoSpinner variant="spin" speed="normal" size="md" />
 * <LogoSpinner variant="flip" speed="fast" size="lg" />
 * <LogoSpinner variant="flipHorizontal" speed="slow" size="xl" />
 */

import type { HTMLAttributes } from 'react'
import clsx from 'clsx'

type SpinnerVariant = 'spin' | 'flip' | 'flipHorizontal'
type SpinnerSpeed = 'slow' | 'normal' | 'fast'
type SpinnerSize = 'sm' | 'md' | 'lg' | 'xl'

interface LogoSpinnerProps extends Omit<HTMLAttributes<HTMLDivElement>, 'className'> {
  /** Variante del spinner: spin (2D), flip (3D vertical) o flipHorizontal (3D horizontal) */
  variant?: SpinnerVariant
  /** Velocidad de animación */
  speed?: SpinnerSpeed
  /** Tamaño del spinner */
  size?: SpinnerSize
  /** Clase CSS adicional */
  className?: string
}

// Mapeo de velocidades a duración en segundos
const speedMap: Record<SpinnerSpeed, number> = {
  slow: 2,
  normal: 1.5,
  fast: 1,
}

// Mapeo de tamaños
const sizeMap: Record<SpinnerSize, string> = {
  sm: 'w-8 h-8',
  md: 'w-12 h-12',
  lg: 'w-16 h-16',
  xl: 'w-24 h-24',
}

export function LogoSpinner({
  variant = 'spin',
  speed = 'normal',
  size = 'md',
  className,
  ...props
}: LogoSpinnerProps) {
  const duration = speedMap[speed]
  const sizeClass = sizeMap[size]

  if (variant === 'spin') {
    return (
      <div
        className={clsx('inline-flex items-center justify-center', className)}
        {...props}
      >
        <img
          src="/Logo.png"
          alt="Loading..."
          className={clsx(
            sizeClass,
            'animate-spin object-contain'
          )}
          style={{
            animationDuration: `${duration}s`,
          }}
        />
      </div>
    )
  }

  if (variant === 'flipHorizontal') {
    // 3D horizontal flip (moneda girando de lado a lado)
    return (
      <div
        className={clsx('inline-flex items-center justify-center perspective-1000', className)}
        {...props}
      >
        <div
          className={clsx(
            sizeClass,
            'relative animate-flip-horizontal'
          )}
          style={{
            animationDuration: `${duration}s`,
            transformStyle: 'preserve-3d',
          }}
        >
          <img
            src="/Logo.png"
            alt="Loading..."
            className={clsx(
              sizeClass,
              'absolute inset-0 object-contain backface-hidden'
            )}
            style={{
              backfaceVisibility: 'hidden',
            }}
          />
          <img
            src="/Logo.png"
            alt="Loading..."
            className={clsx(
              sizeClass,
              'absolute inset-0 object-contain backface-hidden'
            )}
            style={{
              transform: 'rotateX(180deg)',
              backfaceVisibility: 'hidden',
            }}
          />
        </div>
      </div>
    )
  }

  // Variant: flip (3D vertical coin flip)
  return (
    <div
      className={clsx('inline-flex items-center justify-center perspective-1000', className)}
      {...props}
    >
      <div
        className={clsx(
          sizeClass,
          'relative animate-flip-3d'
        )}
        style={{
          animationDuration: `${duration}s`,
          transformStyle: 'preserve-3d',
        }}
      >
        <img
          src="/Logo.png"
          alt="Loading..."
          className={clsx(
            sizeClass,
            'absolute inset-0 object-contain backface-hidden'
          )}
          style={{
            backfaceVisibility: 'hidden',
          }}
        />
        <img
          src="/Logo.png"
          alt="Loading..."
          className={clsx(
            sizeClass,
            'absolute inset-0 object-contain backface-hidden'
          )}
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
        />
      </div>
    </div>
  )
}

/**
 * LogoSpinnerOverlay - Spinner con overlay para pantalla completa
 */
interface LogoSpinnerOverlayProps {
  variant?: SpinnerVariant
  speed?: SpinnerSpeed
  size?: SpinnerSize
  message?: string
}

export function LogoSpinnerOverlay({
  variant = 'flip',
  speed = 'normal',
  size = 'xl',
  message = 'Cargando...',
}: LogoSpinnerOverlayProps) {
  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4">
        <LogoSpinner variant={variant} speed={speed} size={size} />
        {message && (
          <p className="text-white text-lg font-medium animate-pulse">
            {message}
          </p>
        )}
      </div>
    </div>
  )
}
