/**
 * Hook de autenticación
 * Maneja login, logout, registro y estado del usuario
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiService } from '@/services/api.service'
import { AUTH_CONFIG, ENDPOINTS } from '../config/api.config'
import type { AuthResponse, LoginCredentials, RegisterData, User } from '@/types'
import { getAccessToken, setTokens, clearTokens } from '@/utils/auth'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'

export function useAuth() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  // Obtener usuario actual
  const { data: user, isLoading } = useQuery<User | null>({
    queryKey: ['auth', 'user'],
    queryFn: async () => {
      const token = getAccessToken()
      if (!token) return null

      try {
        const response = await apiService.get<User>(ENDPOINTS.auth.me)
        // asegurar que si la API devuelve permisos, se reflejen en cache
        return response.data
      } catch {
        // Si falla, limpiar token inválido
        clearTokens()
        return null
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutos
    retry: false,
  })

  // On app boot, attempt silent refresh if no token (cookie-based flow)
  useEffect(() => {
    const trySilentRefresh = async () => {
      const token = getAccessToken()
      if (token) return

      try {
        // Attempt refresh (api.service will call /auth/refresh)
        const response = await apiService.post<AuthResponse>(ENDPOINTS.auth.refresh)
        if (response && response.data) {
          setTokens(response.data.token, response.data.refreshToken)
          queryClient.setQueryData(['auth', 'user'], response.data.user)
        }
      } catch {
        // ignore — user remains unauthenticated
      }
    }

    trySilentRefresh()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Login
  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      try {
        const response = await apiService.post<AuthResponse>(ENDPOINTS.auth.login, credentials)
        return response.data
      } catch (err) {
        // Demo fallback for development if enabled
        // Set VITE_ENABLE_DEMO_AUTH=true in env to enable
        const demoEnabled = import.meta.env.VITE_ENABLE_DEMO_AUTH === 'true'
        const demoEmail = import.meta.env.VITE_DEMO_EMAIL || 'demo@farutech.com'
        const demoPassword = import.meta.env.VITE_DEMO_PASSWORD || 'demo123'

        if (demoEnabled && credentials.email === demoEmail && credentials.password === demoPassword) {
          // Return a mocked AuthResponse
          return {
            token: 'demo-access-token',
            refreshToken: demoEnabled ? 'demo-refresh-token' : undefined,
            user: {
              id: 'demo',
              email: demoEmail,
              name: 'Usuario Demo',
              role: 'admin',
              permissions: ['users.view', 'processes.view', 'reports.view', 'settings.manage'],
              createdAt: new Date().toISOString(),
            } as any,
          } as AuthResponse
        }

        throw err
      }
    },
    onSuccess: (data) => {
      setTokens(data.token, data.refreshToken)
      if (data.user) {
        try {
          localStorage.setItem(AUTH_CONFIG.userKey, JSON.stringify(data.user))
        } catch {}
        queryClient.setQueryData(['auth', 'user'], data.user)
      }
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
      setTokens(data.token, data.refreshToken)
      if (data.user) {
        try {
          localStorage.setItem(AUTH_CONFIG.userKey, JSON.stringify(data.user))
        } catch {}
        queryClient.setQueryData(['auth', 'user'], data.user)
      }
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
      clearTokens()
      queryClient.setQueryData(['auth', 'user'], null)
      queryClient.clear()
      navigate('/login')
      // broadcast logout to other tabs
      try {
        if ('BroadcastChannel' in window) {
          const bc = new BroadcastChannel('auth')
          bc.postMessage({ type: 'logout' })
          bc.close()
        } else {
          localStorage.setItem('auth_event', JSON.stringify({ type: 'logout', ts: Date.now() }))
        }
      } catch {}
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
