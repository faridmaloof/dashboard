import { create } from 'zustand'

interface SidebarState {
  isOpen: boolean
  isMobile: boolean
  sidebarWidth: number
  open: () => void
  close: () => void
  toggle: () => void
  setMobile: (isMobile: boolean) => void
  setSidebarWidth: (width: number) => void
}

export const useSidebarStore = create<SidebarState>((set) => ({
  isOpen: true,
  isMobile: false,
  sidebarWidth: 240,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
  toggle: () => set((state) => ({ isOpen: !state.isOpen })),
  setMobile: (isMobile) => set({ isMobile, isOpen: !isMobile }),
  setSidebarWidth: (width) => set({ sidebarWidth: width }),
}))
