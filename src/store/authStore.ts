import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AuthState {
  accessToken: string | null
  refreshToken: string | null
  rememberMe: boolean
  setTokens: (accessToken: string, refreshToken: string, remember?: boolean) => void
  setAccessToken: (token: string | null) => void
  clearAuth: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      rememberMe: false,
      
      setTokens: (accessToken: string, refreshToken: string, remember = false) => 
        set({ accessToken, refreshToken, rememberMe: remember }),
      
      setAccessToken: (token: string | null) => 
        set({ accessToken: token }),
      
      clearAuth: () => 
        set({ accessToken: null, refreshToken: null, rememberMe: false }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        accessToken: state.rememberMe ? state.accessToken : null,
        refreshToken: state.rememberMe ? state.refreshToken : null,
        rememberMe: state.rememberMe,
      }),
    }
  )
)
