/**
 * Hook genérico para llamadas a API con React Query
 * Wrapper conveniente sobre useQuery y useMutation
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { UseQueryOptions, UseMutationOptions, UseQueryResult, UseMutationResult } from '@tanstack/react-query'
import { apiService } from '@/services/api.service'
import type { ApiResponse } from '@/types'

export interface UseApiQueryOptions<TData = any> extends Omit<UseQueryOptions<TData>, 'queryKey' | 'queryFn'> {
  url: string | ((params: any) => string)
  params?: Record<string, any>
  method?: 'get' | 'post'
}

export interface UseApiMutationOptions<TData = any, TVariables = any> 
  extends Omit<UseMutationOptions<TData, Error, TVariables>, 'mutationFn'> {
  url: string | ((data: TVariables) => string)
  method?: 'post' | 'put' | 'patch' | 'delete'
  invalidateQueries?: any[] // Query keys to invalidate after mutation
}

/**
 * Hook para queries (GET) con React Query
 */
export function useApiQuery<TData = any>(
  queryKey: any[],
  options: UseApiQueryOptions<TData>
): UseQueryResult<TData> {
  const { url, params, method = 'get', ...queryOptions } = options

  return useQuery({
    queryKey,
    queryFn: async (): Promise<TData> => {
      const endpoint = typeof url === 'function' ? url(params) : url
      
      if (method === 'get') {
        const response = await apiService.get<TData>(endpoint, { params })
        return response.data as TData
      } else {
        const response = await apiService.post<TData>(endpoint, params)
        return response.data as TData
      }
    },
    ...queryOptions,
  }) as UseQueryResult<TData>
}

/**
 * Hook para mutations (POST, PUT, PATCH, DELETE) con React Query
 */
export function useApiMutation<TData = any, TVariables = any>(
  options: UseApiMutationOptions<TData, TVariables>
): UseMutationResult<TData, Error, TVariables> {
  const { url, method = 'post', invalidateQueries, ...mutationOptions } = options
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (variables: TVariables) => {
      const endpoint = typeof url === 'function' ? url(variables) : url
      
      let response: ApiResponse<TData>
      
      switch (method) {
        case 'post':
          response = await apiService.post<TData>(endpoint, variables)
          break
        case 'put':
          response = await apiService.put<TData>(endpoint, variables)
          break
        case 'patch':
          response = await apiService.patch<TData>(endpoint, variables)
          break
        case 'delete':
          response = await apiService.delete<TData>(endpoint)
          break
        default:
          throw new Error(`Método HTTP no soportado: ${method}`)
      }
      
      return response.data
    },
    ...mutationOptions,
    onSettled: async () => {
      // Invalidate queries after mutation settles (success or error)
      if (invalidateQueries) {
        for (const queryKey of invalidateQueries) {
          await queryClient.invalidateQueries({ queryKey: Array.isArray(queryKey) ? queryKey : [queryKey] })
        }
      }
    },
  } as any)
}
