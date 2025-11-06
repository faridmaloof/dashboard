// Helpers para almacenamiento de tokens y utilidades de token
import { AUTH_CONFIG } from '@/config/api.config'
import { useAuthStore } from '@/store/authStore'

// Access token stored in memory (zustand). For backward compatibility we
// may still read localStorage if present (e.g., dev/demo), but production
// should keep accessToken only in memory.
export function getAccessToken(): string | null {
  try {
    const token = useAuthStore.getState().accessToken
    if (token) return token
    // fallback for older/demo setups
    return localStorage.getItem(AUTH_CONFIG.tokenKey)
  } catch {
    return null
  }
}

export function getRefreshToken(): string | null {
  try {
    return localStorage.getItem(AUTH_CONFIG.refreshTokenKey)
  } catch {
    return null
  }
}

export function setTokens(token?: string | null, refreshToken?: string | null) {
  try {
    if (token) {
      // Store in Zustand (memory)
      useAuthStore.getState().setAccessToken(token)
      // ALSO persist to localStorage for immediate availability (Sanctum tokens are safe to persist)
      localStorage.setItem(AUTH_CONFIG.tokenKey, token)
      console.log('💾 Access token guardado en memoria y localStorage')
    }
    // Only persist refresh token in localStorage when not using HttpOnly cookie mode.
    if (refreshToken && !AUTH_CONFIG.useHttpOnlyCookie) {
      localStorage.setItem(AUTH_CONFIG.refreshTokenKey, refreshToken)
      console.log('💾 Refresh token guardado en localStorage')
    }
  } catch (error) {
    console.error('❌ Error guardando tokens:', error)
  }
}

export function clearTokens() {
  try {
    useAuthStore.getState().clearAccessToken()
    localStorage.removeItem(AUTH_CONFIG.tokenKey)
    localStorage.removeItem(AUTH_CONFIG.refreshTokenKey)
    localStorage.removeItem(AUTH_CONFIG.userKey)
    console.log('🗑️ Tokens limpiados de memoria y localStorage')
  } catch (error) {
    console.error('❌ Error limpiando tokens:', error)
  }
}

// Intento de verificación de expiración si el token es JWT
export function isTokenExpired(token?: string | null): boolean {
  if (!token) return true
  try {
    const parts = token.split('.')
    if (parts.length < 2) return false
    const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')))
    if (!payload.exp) return false
    const exp = payload.exp * 1000
    return Date.now() > exp
  } catch {
    return false
  }
}
