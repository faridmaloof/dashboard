/**
 * Servicio centralizado para hacer llamadas a la API
 */

import axios, { AxiosError } from 'axios'
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { API_CONFIG, AUTH_CONFIG } from '../config/api.config'
import type { ApiError, ApiResponse } from '@/types'

class ApiService {
  private api: AxiosInstance

  constructor() {
    this.api = axios.create({
      baseURL: API_CONFIG.baseURL,
      timeout: API_CONFIG.timeout,
      headers: API_CONFIG.headers,
    })

    this.setupInterceptors()
  }

  private setupInterceptors() {
    // Request interceptor - añadir token
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem(AUTH_CONFIG.tokenKey)
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
        return config
      },
      (error) => Promise.reject(error)
    )

    // Response interceptor - manejar errores
    this.api.interceptors.response.use(
      (response) => response,
      async (error: AxiosError<ApiError>) => {
        const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean }

        // Si es 401 y no es retry, intentar refresh token
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true

          try {
            const refreshToken = localStorage.getItem(AUTH_CONFIG.refreshTokenKey)
            if (refreshToken) {
              const response = await axios.post(`${API_CONFIG.baseURL}/auth/refresh`, {
                refreshToken,
              })

              const { token } = response.data
              localStorage.setItem(AUTH_CONFIG.tokenKey, token)

              if (originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${token}`
              }

              return this.api(originalRequest)
            }
          } catch (refreshError) {
            // Si falla el refresh, limpiar tokens y redirigir al login
            this.clearAuth()
            window.location.href = '/login'
            return Promise.reject(refreshError)
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

  private clearAuth() {
    localStorage.removeItem(AUTH_CONFIG.tokenKey)
    localStorage.removeItem(AUTH_CONFIG.refreshTokenKey)
    localStorage.removeItem(AUTH_CONFIG.userKey)
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
