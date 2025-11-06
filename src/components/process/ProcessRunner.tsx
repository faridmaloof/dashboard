/**
 * Componente para ejecutar procesos especiales
 */

import { useState } from 'react'
import { PlayIcon } from '@heroicons/react/24/solid'
import { Button } from '../ui/Button'
import { Card, CardHeader } from '../ui/Card'
import { Input } from '../ui/Input'
// import { Select } from '../ui/Select'
import type { Process } from '@/types'
import { useProcess } from '@/hooks/useProcess'
import { notify } from '@/store/notificationStore'
import clsx from 'clsx'

interface ProcessRunnerProps {
  process: Process
  onComplete?: (result: any) => void
}

export function ProcessRunner({ process }: ProcessRunnerProps) {
  const { executeProcess, currentExecution, isExecuting } = useProcess()
  
  const [params, setParams] = useState<Record<string, any>>(process.params || {})

  const handleExecute = async () => {
    try {
      executeProcess({
        processId: String(process.id),
        parameters: params,
      })

      notify.success('Proceso iniciado', 'El proceso se está ejecutando')
    } catch (err: any) {
      notify.error('Error', err.message || 'No se pudo ejecutar el proceso')
    }
  }

  const handleParamChange = (key: string, value: any) => {
    setParams((prev) => ({ ...prev, [key]: value }))
  }

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'running':
        return 'text-blue-600 dark:text-blue-400'
      case 'completed':
        return 'text-green-600 dark:text-green-400'
      case 'failed':
        return 'text-red-600 dark:text-red-400'
      default:
        return 'text-gray-600 dark:text-gray-400'
    }
  }

  return (
    <Card>
      <div className="space-y-4">
        {/* Header */}
        <CardHeader
          title={process.name}
          subtitle={process.description}
          action={
            <div className="flex items-center gap-2">
              {currentExecution && (
                <span className={clsx('text-sm font-medium', getStatusColor(currentExecution.status))}>
                  {currentExecution.status === 'running' && 'Ejecutando...'}
                  {currentExecution.status === 'completed' && 'Completado'}
                  {currentExecution.status === 'failed' && 'Error'}
                </span>
              )}
              
              <Button
                size="sm"
                icon={<PlayIcon className="h-4 w-4" />}
                onClick={handleExecute}
                loading={isExecuting}
                disabled={isExecuting}
              >
                Ejecutar
              </Button>
            </div>
          }
        />

        {/* Parameters */}
        {Object.keys(process.params || {}).length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Parámetros
            </h4>
            {Object.entries(process.params || {}).map(([key, defaultValue]) => (
              <Input
                key={key}
                label={key}
                value={params[key] || defaultValue}
                onChange={(e) => handleParamChange(key, e.target.value)}
                disabled={isExecuting}
              />
            ))}
          </div>
        )}

        {/* Progress indicator */}
        {isExecuting && currentExecution?.status === 'running' && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Progreso</span>
              <span className="text-gray-900 dark:text-white font-medium">
                En proceso...
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div className="bg-primary-600 h-2 rounded-full animate-pulse w-full" />
            </div>
          </div>
        )}

        {/* Result */}
        {currentExecution?.result && currentExecution.status === 'completed' && (
          <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <h4 className="text-sm font-medium text-green-900 dark:text-green-100 mb-2">
              Resultado
            </h4>
            <pre className="text-xs text-green-800 dark:text-green-200 overflow-x-auto">
              {JSON.stringify(currentExecution.result, null, 2)}
            </pre>
          </div>
        )}

        {/* Error */}
        {currentExecution?.error && (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <h4 className="text-sm font-medium text-red-900 dark:text-red-100 mb-2">
              Error
            </h4>
            <p className="text-sm text-red-800 dark:text-red-200">
              {currentExecution.error}
            </p>
          </div>
        )}
      </div>
    </Card>
  )
}
