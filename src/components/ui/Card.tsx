/**
 * Componente Card reutilizable
 */

import type { HTMLAttributes, ReactNode } from 'react'
import clsx from 'clsx'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  header?: ReactNode
  footer?: ReactNode
  padding?: 'none' | 'sm' | 'md' | 'lg'
  hover?: boolean
}

export function Card({
  children,
  header,
  footer,
  padding = 'md',
  hover = false,
  className,
  ...props
}: CardProps) {
  const paddings = {
    none: '',
    sm: 'p-3',
    md: 'p-6',
    lg: 'p-8',
  }

  return (
    <div
      className={clsx(
        'card',
        hover && 'hover:shadow-md transition-shadow cursor-pointer',
        className
      )}
      {...props}
    >
      {header && (
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          {header}
        </div>
      )}
      
      <div className={paddings[padding]}>
        {children}
      </div>
      
      {footer && (
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
          {footer}
        </div>
      )}
    </div>
  )
}

// CardHeader como componente separado
interface CardHeaderProps {
  title?: string
  subtitle?: string
  action?: React.ReactNode
  children?: ReactNode
  className?: string
}

export function CardHeader({ title, subtitle, action, children, className }: CardHeaderProps) {
  if (children) {
    return (
      <div className={clsx('px-6 py-4 border-b border-gray-200 dark:border-gray-700', className)}>
        {children}
      </div>
    )
  }

  return (
    <div className={clsx('px-6 py-4 border-b border-gray-200 dark:border-gray-700', className)}>
      <div className="flex items-center justify-between">
        <div>
          {title && (
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {title}
            </h3>
          )}
          {subtitle && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {subtitle}
            </p>
          )}
        </div>
        {action && <div>{action}</div>}
      </div>
    </div>
  )
}
