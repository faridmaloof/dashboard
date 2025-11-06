/**
 * Hook de autenticación completo para Ordinex API
 * - Gestión de sesión con tokens
 * - Cache inteligente con React Query
 * - Sincronización entre pestañas
 * - Manejo de permisos basado en roles y accesos
 * - Refresh token automático
 * - Soporte para modo demo (desarrollo)
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiService } from '@/services/api.service'
import { API_CONFIG, AUTH_CONFIG, ENDPOINTS } from '../config/api.config'
import type { AuthResponse, LoginCredentials, RegisterData, User } from '@/types'
import { getAccessToken, setTokens, clearTokens } from '@/utils/auth'
import { useNavigate } from 'react-router-dom'
import { useEffect, useCallback } from 'react'

export function useAuth() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  // ============================================
  // OBTENER USUARIO ACTUAL (con cache)
  // ============================================
  const { data: user, isLoading, refetch: refetchUser } = useQuery<User | null>({
    queryKey: ['auth', 'user'],
    queryFn: async () => {
      const token = getAccessToken()
      console.log('🔍 userQuery - Obteniendo usuario, token:', token ? 'presente' : 'ausente')
      
      if (!token) {
        console.log('⚠️ userQuery - No hay token, retornando null')
        return null
      }

      try {
        const response = await apiService.get<any>(ENDPOINTS.auth.me)
        console.log('✅ userQuery - Respuesta recibida:', response)
        
        // Ordinex devuelve: { success: true, data: { user: { ... } } }
        const ordinexData = response.data?.data || response.data
        console.log('📦 userQuery - Datos extraídos:', ordinexData)
        
        // Si ordinexData tiene una propiedad 'user', extraerla
        const userData = ordinexData.user || ordinexData
        console.log('👤 userQuery - Usuario final:', userData)
        
        // Guardar en localStorage como backup
        try {
          localStorage.setItem(AUTH_CONFIG.userKey, JSON.stringify(userData))
        } catch {}
        
        return userData
      } catch (error: any) {
        console.error('❌ userQuery - Error obteniendo usuario:', error)
        // Si el token es inválido o expiró
        if (error?.response?.status === 401) {
          console.log('🔒 userQuery - Token inválido (401), limpiando tokens')
          clearTokens()
        }
        return null
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutos - cache válido
    gcTime: 1000 * 60 * 30, // 30 minutos - mantener en cache
    retry: false,
    refetchOnWindowFocus: false, // DESACTIVAR para evitar loop
    refetchOnReconnect: false, // DESACTIVAR para evitar loop
    enabled: !!getAccessToken(), // Solo ejecutar si hay token
  })

  // ============================================
  // EXTRAER PERMISOS DEL USUARIO
  // ============================================
  const permissions = useCallback((): string[] => {
    if (!user) return []

    const perms: string[] = []

    // 1. Si el usuario tiene permisos directos pre-calculados, usarlos
    if (user.permissions && Array.isArray(user.permissions)) {
      return user.permissions
    }

    // 2. Ordinex: Extraer de accesos directos del usuario
    if (user.accesses && Array.isArray(user.accesses)) {
      user.accesses.forEach((access: any) => {
        if (access.code && !perms.includes(access.code)) {
          perms.push(access.code)
        }
      })
    }

    // 3. Ordinex: También extraer de roles -> accesses
    if (user.roles && Array.isArray(user.roles)) {
      user.roles.forEach((role: any) => {
        if (role.accesses && Array.isArray(role.accesses)) {
          role.accesses.forEach((access: any) => {
            if (access.code && !perms.includes(access.code)) {
              perms.push(access.code)
            }
          })
        }
      })
    }

    console.log('🔑 Permisos extraídos del usuario:', perms)
    return perms
  }, [user])

  // ============================================
  // HELPERS DE PERMISOS
  // ============================================
  const hasPermission = useCallback(
    (permission: string): boolean => {
      const userPerms = permissions()
      return userPerms.includes('*') || userPerms.includes(permission)
    },
    [permissions]
  )

  const hasAnyPermission = useCallback(
    (perms: string[]): boolean => {
      const userPerms = permissions()
      if (userPerms.includes('*')) return true
      return perms.some((p) => userPerms.includes(p))
    },
    [permissions]
  )

  const hasAllPermissions = useCallback(
    (perms: string[]): boolean => {
      const userPerms = permissions()
      if (userPerms.includes('*')) return true
      return perms.every((p) => userPerms.includes(p))
    },
    [permissions]
  )

  const isAdmin = useCallback((): boolean => {
    if (!user) return false
    
    // Verificar si tiene rol de administrador (Ordinex: código 'adm' o 'sad')
    const isAdminRole = user.roles?.some(role => 
      role.code === 'adm' || role.code === 'sad'
    )
    
    // O si tiene permiso wildcard
    return isAdminRole || hasPermission('*')
  }, [user, hasPermission])

  // ============================================
  // SINCRONIZACIÓN ENTRE PESTAÑAS
  // ============================================
  useEffect(() => {
    // Escuchar eventos de otras pestañas
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'auth_event') {
        try {
          const event = JSON.parse(e.newValue || '{}')
          
          if (event.type === 'logout') {
            // Otra pestaña hizo logout, limpiar esta también
            clearTokens()
            queryClient.setQueryData(['auth', 'user'], null)
            queryClient.clear()
            navigate('/login', { replace: true })
          } else if (event.type === 'login') {
            // Otra pestaña hizo login, recargar usuario
            refetchUser()
          }
        } catch {}
      }
    }

    // Soporte moderno con BroadcastChannel
    let broadcastChannel: BroadcastChannel | null = null
    const hasBroadcastChannel = typeof window !== 'undefined' && 'BroadcastChannel' in window
    
    if (hasBroadcastChannel) {
      broadcastChannel = new BroadcastChannel('auth')
      broadcastChannel.onmessage = (event) => {
        if (event.data.type === 'logout') {
          clearTokens()
          queryClient.setQueryData(['auth', 'user'], null)
          queryClient.clear()
          navigate('/login', { replace: true })
        } else if (event.data.type === 'login') {
          refetchUser()
        }
      }
    } else if (typeof window !== 'undefined') {
      // Fallback para navegadores antiguos
      window.addEventListener('storage', handleStorageChange)
    }

    return () => {
      if (broadcastChannel) {
        broadcastChannel.close()
      } else if (typeof window !== 'undefined') {
        window.removeEventListener('storage', handleStorageChange)
      }
    }
  }, [navigate, queryClient, refetchUser])

  // ============================================
  // INTENTAR REFRESH SILENCIOSO AL INICIAR
  // ============================================
  useEffect(() => {
    const trySilentRefresh = async () => {
      const token = getAccessToken()
      if (token) return // Ya hay token válido

      try {
        // Intentar refresh con httpOnly cookie o refreshToken de localStorage
        const response = await apiService.post<AuthResponse>(ENDPOINTS.auth.refresh)
        if (response && response.data) {
          setTokens(response.data.token, response.data.refreshToken)
          queryClient.setQueryData(['auth', 'user'], response.data.user)
        }
      } catch {
        // Ignorar - usuario no autenticado
      }
    }

    trySilentRefresh()
  }, [queryClient])

  // ============================================
  // LOGIN
  // ============================================
  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      // Login con API de Ordinex únicamente
      try {
        console.log('🔐 Intentando login con Ordinex API...', {
          url: `${API_CONFIG.baseURL}${ENDPOINTS.auth.login}`,
          email: credentials.email
        })
        
        const response = await apiService.post<any>(ENDPOINTS.auth.login, credentials)
        console.log('✅ Login exitoso con Ordinex API - Respuesta completa:', response)
        
        // Ordinex devuelve: { success: true, message: "...", data: { user, access_token, refresh_token } }
        const ordinexData = response.data?.data || response.data
        console.log('📦 Datos extraídos de Ordinex:', ordinexData)
        
        // Transformar a la estructura que espera el código
        const authData: AuthResponse = {
          token: ordinexData.access_token,
          refreshToken: ordinexData.refresh_token,
          user: ordinexData.user
        }
        console.log('� Datos transformados para useAuth:', authData)
        
        return authData
      } catch (apiError: any) {
        console.error('❌ Error en Ordinex API:', {
          message: apiError.message,
          status: apiError.response?.status,
          data: apiError.response?.data,
          config: {
            url: apiError.config?.url,
            method: apiError.config?.method,
          }
        })
        
        // Mostrar error detallado
        const errorMessage = apiError.response?.data?.message 
          || apiError.response?.data?.error 
          || apiError.message 
          || 'Error de conexión con el servidor'
        
        throw new Error(errorMessage)
      }
    },
    onSuccess: (data) => {
      console.log('✅ onSuccess - Datos recibidos:', data)
      
      // Verificar que tenemos los datos necesarios
      if (!data.token) {
        console.error('❌ No se encontró token en la respuesta:', data)
        throw new Error('Respuesta de login inválida: falta el token')
      }
      
      console.log('🔍 Token recibido:', data.token)
      console.log('🔍 Refresh token recibido:', data.refreshToken ? 'Sí' : 'No')
      
      // Guardar tokens
      setTokens(data.token, data.refreshToken)
      console.log('💾 Tokens guardados')
      
      // IMPORTANTE: Esperar un momento antes de hacer requests
      // para asegurar que localStorage esté completamente actualizado
      setTimeout(() => {
        const storedToken = localStorage.getItem(AUTH_CONFIG.tokenKey)
        console.log('✅ Verificación: Token en localStorage:', storedToken ? `${storedToken.substring(0, 20)}...` : 'NO ENCONTRADO')
      }, 100)
      
      // Guardar usuario en cache
      if (data.user) {
        try {
          localStorage.setItem(AUTH_CONFIG.userKey, JSON.stringify(data.user))
          console.log('👤 Usuario guardado en localStorage:', data.user.email)
        } catch {}
        queryClient.setQueryData(['auth', 'user'], data.user)
        console.log('👤 Usuario guardado en cache de React Query')
      }

      // Notificar a otras pestañas
      try {
        if ('BroadcastChannel' in window) {
          const bc = new BroadcastChannel('auth')
          bc.postMessage({ type: 'login' })
          bc.close()
        } else {
          localStorage.setItem('auth_event', JSON.stringify({ type: 'login', ts: Date.now() }))
        }
      } catch {}

      // Redirigir al dashboard
      console.log('🚀 Navegando a /dashboard')
      navigate('/dashboard', { replace: true })
    },
    onError: () => {
      // Limpiar cualquier estado corrupto
      clearTokens()
      queryClient.setQueryData(['auth', 'user'], null)
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

  // ============================================
  // LOGOUT
  // ============================================
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
      
      // Broadcast logout to other tabs
      try {
        if ('BroadcastChannel' in window) {
          const bc = new BroadcastChannel('auth')
          bc.postMessage({ type: 'logout' })
          bc.close()
        } else {
          localStorage.setItem('auth_event', JSON.stringify({ type: 'logout', ts: Date.now() }))
        }
      } catch {}
      
      navigate('/login', { replace: true })
    },
  })

  // ============================================
  // RETURN - API PÚBLICA DEL HOOK
  // ============================================
  return {
    // Usuario y estado
    user,
    isAuthenticated: !!user,
    isLoading,
    refetchUser,

    // Permisos
    permissions: permissions(),
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    isAdmin: isAdmin(),

    // Login
    login: loginMutation.mutate,
    loginAsync: loginMutation.mutateAsync,
    isLoggingIn: loginMutation.isPending,
    loginError: loginMutation.error,

    // Registro
    register: registerMutation.mutate,
    registerAsync: registerMutation.mutateAsync,
    isRegistering: registerMutation.isPending,
    registerError: registerMutation.error,

    // Logout
    logout: logoutMutation.mutate,
    logoutAsync: logoutMutation.mutateAsync,
    isLoggingOut: logoutMutation.isPending,
  }
}
