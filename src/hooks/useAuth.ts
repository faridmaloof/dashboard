/**
 * Hook de autenticación
 * Maneja login, logout, registro y estado del usuario
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiService } from '@/services/api.service'
import { AUTH_CONFIG, ENDPOINTS } from '../config/api.config'
import type { AuthResponse, LoginCredentials, RegisterData, User } from '@/types'
import { useNavigate } from 'react-router-dom'

export function useAuth() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  // Obtener usuario actual
  const { data: user, isLoading } = useQuery<User | null>({
    queryKey: ['auth', 'user'],
    queryFn: async () => {
      const token = localStorage.getItem(AUTH_CONFIG.tokenKey)
      if (!token) return null

      try {
        const response = await apiService.get<User>(ENDPOINTS.auth.me)
        return response.data
      } catch {
        // Si falla, limpiar token inválido
        localStorage.removeItem(AUTH_CONFIG.tokenKey)
        return null
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutos
    retry: false,
  })

  // Login
  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      const response = await apiService.post<AuthResponse>(ENDPOINTS.auth.login, credentials)
      return response.data
    },
    onSuccess: (data) => {
      localStorage.setItem(AUTH_CONFIG.tokenKey, data.token)
      if (data.refreshToken) {
        localStorage.setItem(AUTH_CONFIG.refreshTokenKey, data.refreshToken)
      }
      localStorage.setItem(AUTH_CONFIG.userKey, JSON.stringify(data.user))
      queryClient.setQueryData(['auth', 'user'], data.user)
      navigate('/dashboard')
    },
  })

  // Registro
  const registerMutation = useMutation({
    mutationFn: async (data: RegisterData) => {
      const response = await apiService.post<AuthResponse>(ENDPOINTS.auth.register, data)
      return response.data
    },
    onSuccess: (data) => {
      localStorage.setItem(AUTH_CONFIG.tokenKey, data.token)
      if (data.refreshToken) {
        localStorage.setItem(AUTH_CONFIG.refreshTokenKey, data.refreshToken)
      }
      localStorage.setItem(AUTH_CONFIG.userKey, JSON.stringify(data.user))
      queryClient.setQueryData(['auth', 'user'], data.user)
      navigate('/dashboard')
    },
  })

  // Logout
  const logoutMutation = useMutation({
    mutationFn: async () => {
      try {
        await apiService.post(ENDPOINTS.auth.logout)
      } catch {
        // Continuar con logout local aunque falle la API
      }
    },
    onSuccess: () => {
      localStorage.removeItem(AUTH_CONFIG.tokenKey)
      localStorage.removeItem(AUTH_CONFIG.refreshTokenKey)
      localStorage.removeItem(AUTH_CONFIG.userKey)
      queryClient.setQueryData(['auth', 'user'], null)
      queryClient.clear()
      navigate('/login')
    },
  })

  return {
    user,
    isAuthenticated: !!user,
    isLoading,
    login: loginMutation.mutate,
    loginAsync: loginMutation.mutateAsync,
    isLoggingIn: loginMutation.isPending,
    loginError: loginMutation.error,
    register: registerMutation.mutate,
    registerAsync: registerMutation.mutateAsync,
    isRegistering: registerMutation.isPending,
    registerError: registerMutation.error,
    logout: logoutMutation.mutate,
    isLoggingOut: logoutMutation.isPending,
  }
}
