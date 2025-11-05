import { create } from 'zustand'

interface AuthState {
  accessToken: string | null
  setAccessToken: (token: string | null) => void
  clearAccessToken: () => void
}

export const useAuthStore = create<AuthState>((set: any) => ({
  accessToken: null,
  setAccessToken: (token: string | null) => set({ accessToken: token }),
  clearAccessToken: () => set({ accessToken: null }),
}))
