/**
 * Servicio centralizado para hacer llamadas a la API
 */

import axios, { AxiosError } from 'axios'
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { API_CONFIG, AUTH_CONFIG, ENDPOINTS } from '../config/api.config'
import type { ApiError, ApiResponse } from '@/types'
import { getAccessToken, getRefreshToken, setTokens, clearTokens, isTokenExpired } from '@/utils/auth'

class ApiService {
  private api: AxiosInstance

  constructor() {
    this.api = axios.create({
      baseURL: API_CONFIG.baseURL,
      timeout: API_CONFIG.timeout,
      headers: {
        ...API_CONFIG.headers,
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest', // Importante para Laravel
      },
      withCredentials: false, // Para tokens de API, usar false
    })

    this.setupInterceptors()
  }

  private setupInterceptors() {
    // Request interceptor - añadir token
    this.api.interceptors.request.use(
      (config) => {
        const token = getAccessToken()
        console.log('🔑 Request interceptor - Token:', token ? `${token.substring(0, 20)}...` : 'NO TOKEN')
        console.log('📍 Request URL:', config.url)
        console.log('📍 Request headers antes:', config.headers)
        
        // Evitar enviar token expirado si podemos detectarlo
        if (token && !isTokenExpired(token)) {
          config.headers.Authorization = `Bearer ${token}`
          console.log('✅ Authorization header agregado:', config.url)
        } else if (!token) {
          console.log('⚠️ No hay token disponible para:', config.url)
        } else if (isTokenExpired(token)) {
          console.log('⚠️ Token expirado, no se agrega a:', config.url)
        }
        
        console.log('📍 Request headers después:', config.headers)
        return config
      },
      (error) => Promise.reject(error)
    )

    // Response interceptor - manejar errores
    // Implementamos un queue para refresh para evitar multiple refresh calls
    let isRefreshing = false
    let failedQueue: Array<{
      resolve: (value?: any) => void
      reject: (error: any) => void
    }> = []

    const processQueue = (error: any, token: string | null = null) => {
      failedQueue.forEach((p) => {
        if (error) {
          p.reject(error)
        } else {
          p.resolve(token)
        }
      })
      failedQueue = []
    }

    this.api.interceptors.response.use(
      (response) => response,
      async (error: AxiosError<ApiError>) => {
        const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean }

        if (error.response?.status === 401 && !originalRequest._retry) {
          // marcar para no reintentar infinitamente
          originalRequest._retry = true

          // IMPORTANTE: Si no hay refresh token, no intentar refresh
          const refreshToken = getRefreshToken()
          if (!refreshToken && !AUTH_CONFIG.useHttpOnlyCookie) {
            console.log('⚠️ 401 sin refresh token - redirigiendo a login')
            clearTokens()
            // Solo redirigir si no estamos ya en login
            if (!window.location.pathname.includes('/login')) {
              window.location.href = '/login'
            }
            return Promise.reject(error)
          }

          if (isRefreshing) {
            // Si ya hay un refresh en curso, encolar la petición
            return new Promise((resolve, reject) => {
              failedQueue.push({ resolve, reject })
            })
              .then((token) => {
                if (originalRequest.headers && token) {
                  originalRequest.headers.Authorization = `Bearer ${token}`
                }
                return this.api(originalRequest)
              })
              .catch((err) => Promise.reject(err))
          }

          isRefreshing = true

          try {
            console.log('🔄 Intentando refrescar token...')

            let refreshResponse

            if (AUTH_CONFIG.useHttpOnlyCookie) {
              // Si el backend usa cookie, sólo llamar al endpoint y confiar en cookie
              refreshResponse = await axios.post(`${API_CONFIG.baseURL}${ENDPOINTS.auth.refresh}`, null, {
                withCredentials: true,
                headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json',
                }
              })
            } else {
              // Enviar refresh token en body con el campo correcto para Ordinex
              refreshResponse = await axios.post(`${API_CONFIG.baseURL}${ENDPOINTS.auth.refresh}`, {
                refresh_token: refreshToken, // Ordinex espera 'refresh_token' no 'refreshToken'
              }, {
                headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json',
                  'X-Requested-With': 'XMLHttpRequest',
                }
              })
            }

            // Ordinex devuelve la respuesta envuelta en { success, data: { access_token, refresh_token } }
            const responseData = refreshResponse?.data?.data || refreshResponse?.data
            const newToken = responseData?.access_token || responseData?.token
            const newRefresh = responseData?.refresh_token || responseData?.refreshToken

            if (newToken) {
              console.log('✅ Token refrescado exitosamente')
              setTokens(newToken, newRefresh)
              processQueue(null, newToken)

              if (originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${newToken}`
              }

              return this.api(originalRequest)
            }

            // Si no vino token, forzar logout
            console.log('❌ No se recibió token en refresh')
            clearTokens()
            processQueue(new Error('No hay token en refresh'))
            if (!window.location.pathname.includes('/login')) {
              window.location.href = '/login'
            }
            return Promise.reject(error)
          } catch (refreshError) {
            console.log('❌ Error al refrescar token:', refreshError)
            clearTokens()
            processQueue(refreshError, null)
            if (!window.location.pathname.includes('/login')) {
              window.location.href = '/login'
            }
            return Promise.reject(refreshError)
          } finally {
            isRefreshing = false
          }
        }

        return Promise.reject(this.normalizeError(error))
      }
    )
  }

  private normalizeError(error: AxiosError<ApiError>): ApiError {
    if (error.response) {
      return {
        message: error.response.data?.message || 'Error en la solicitud',
        errors: error.response.data?.errors,
        statusCode: error.response.status,
      }
    }

    if (error.request) {
      return {
        message: 'No se pudo conectar con el servidor',
        statusCode: 0,
      }
    }

    return {
      message: error.message || 'Error desconocido',
    }
  }

  // Métodos HTTP
  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response: AxiosResponse<ApiResponse<T>> = await this.api.get(url, config)
    return response.data
  }

  async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response: AxiosResponse<ApiResponse<T>> = await this.api.post(url, data, config)
    return response.data
  }

  async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response: AxiosResponse<ApiResponse<T>> = await this.api.put(url, data, config)
    return response.data
  }

  async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response: AxiosResponse<ApiResponse<T>> = await this.api.delete(url, config)
    return response.data
  }

  async patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response: AxiosResponse<ApiResponse<T>> = await this.api.patch(url, data, config)
    return response.data
  }

  // Método para subir archivos
  async upload<T = any>(url: string, formData: FormData, onProgress?: (progress: number) => void): Promise<ApiResponse<T>> {
    const response: AxiosResponse<ApiResponse<T>> = await this.api.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          onProgress(progress)
        }
      },
    })
    return response.data
  }

  // Obtener instancia de axios para casos especiales
  getInstance(): AxiosInstance {
    return this.api
  }
}

export const apiService = new ApiService()
