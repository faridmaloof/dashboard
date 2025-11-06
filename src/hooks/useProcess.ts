/**
 * Hook para ejecutar y gestionar procesos del sistema
 * Placeholder para funcionalidad futura
 */

import { useState } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { apiService } from '@/services/api.service'
import { ENDPOINTS } from '@/config/api.config'

export interface ProcessConfig {
  id: string
  name: string
  description?: string
  parameters?: Record<string, any>
}

export interface ProcessExecution {
  processId: string
  executionId: string
  status: 'pending' | 'running' | 'completed' | 'failed'
  progress?: number
  result?: any
  error?: string
  startedAt?: string
  completedAt?: string
}

/**
 * Hook principal para gestionar procesos
 */
export function useProcess(processId?: string) {
  const [currentExecution, setCurrentExecution] = useState<ProcessExecution | null>(null)

  // Query para obtener lista de procesos disponibles
  const processesQuery = useQuery({
    queryKey: ['processes'],
    queryFn: async () => {
      const response = await apiService.get<ProcessConfig[]>(ENDPOINTS.processes.list)
      return response.data
    },
    enabled: !processId, // Solo cargar lista si no se especifica un proceso
  })

  // Query para obtener estado de un proceso específico
  const processStatusQuery = useQuery({
    queryKey: ['process', 'status', processId, currentExecution?.executionId],
    queryFn: async () => {
      if (!currentExecution?.executionId) return null
      const response = await apiService.get<ProcessExecution>(
        ENDPOINTS.processes.status(currentExecution.executionId)
      )
      return response.data
    },
    enabled: !!currentExecution?.executionId,
    refetchInterval: (query) => {
      // Refetch mientras el proceso esté en ejecución
      const data = query.state.data
      if (data?.status === 'running' || data?.status === 'pending') {
        return 2000 // 2 segundos
      }
      return false
    },
  })

  // Mutation para ejecutar un proceso
  const executeProcessMutation = useMutation({
    mutationFn: async (params: { processId: string; parameters?: Record<string, any> }) => {
      const response = await apiService.post<ProcessExecution>(ENDPOINTS.processes.execute, params)
      return response.data
    },
    onSuccess: (data) => {
      setCurrentExecution(data)
    },
  })

  // Query para historial de ejecuciones
  const historyQuery = useQuery({
    queryKey: ['processes', 'history', processId],
    queryFn: async () => {
      const response = await apiService.get<ProcessExecution[]>(ENDPOINTS.processes.history, {
        params: processId ? { processId } : undefined,
      })
      return response.data
    },
  })

  return {
    // Datos
    processes: processesQuery.data || [],
    currentExecution: processStatusQuery.data || currentExecution,
    history: historyQuery.data || [],

    // Estado de carga
    isLoadingProcesses: processesQuery.isLoading,
    isExecuting: executeProcessMutation.isPending,
    isLoadingStatus: processStatusQuery.isLoading,

    // Acciones
    executeProcess: executeProcessMutation.mutate,
    executeProcessAsync: executeProcessMutation.mutateAsync,
    refetchStatus: processStatusQuery.refetch,
    refetchHistory: historyQuery.refetch,

    // Errores
    processesError: processesQuery.error,
    executeError: executeProcessMutation.error,
    statusError: processStatusQuery.error,
  }
}
