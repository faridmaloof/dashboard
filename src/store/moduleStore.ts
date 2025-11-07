/**
 * Store de Zustand para gestión de módulos del sistema
 * 
 * Permite cambiar entre diferentes módulos (CRM, Inventario, Ventas, etc.)
 * y personalizar el menú/funcionalidades según el módulo activo.
 */

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Module } from '@/components/ui' // ✅ Usar tipo del Design System
import { 
  HomeIcon,
  UserGroupIcon,
  ShoppingCartIcon,
  CubeIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline'
import { createElement } from 'react'

interface ModuleStore {
  /** Módulo actualmente activo */
  currentModule: string
  /** Lista de módulos disponibles */
  modules: Module[]
  /** Cambiar módulo activo */
  setCurrentModule: (moduleId: string) => void
  /** Agregar módulo */
  addModule: (module: Module) => void
  /** Remover módulo */
  removeModule: (moduleId: string) => void
  /** Obtener módulo actual */
  getCurrentModule: () => Module | undefined
}

// Módulos por defecto del sistema
const DEFAULT_MODULES: Module[] = [
  {
    id: 'dashboard',
    name: 'Dashboard',
    description: 'Panel principal del sistema',
    icon: createElement(HomeIcon, { className: 'h-4 w-4' }),
  },
  {
    id: 'crm',
    name: 'CRM',
    description: 'Gestión de clientes y relaciones',
    icon: createElement(UserGroupIcon, { className: 'h-4 w-4' }),
    badge: '12',
    badgeVariant: 'primary',
  },
  {
    id: 'ventas',
    name: 'Ventas',
    description: 'Módulo de ventas y facturación',
    icon: createElement(ShoppingCartIcon, { className: 'h-4 w-4' }),
  },
  {
    id: 'inventario',
    name: 'Inventario',
    description: 'Control de stock y productos',
    icon: createElement(CubeIcon, { className: 'h-4 w-4' }),
  },
  {
    id: 'reportes',
    name: 'Reportes',
    description: 'Analíticas y reportes del sistema',
    icon: createElement(ChartBarIcon, { className: 'h-4 w-4' }),
  },
]

export const useModuleStore = create<ModuleStore>()(
  persist(
    (set, get) => ({
      currentModule: 'dashboard',
      modules: DEFAULT_MODULES,

      setCurrentModule: (moduleId: string) => {
        const module = get().modules.find((m) => m.id === moduleId)
        if (module) {
          set({ currentModule: moduleId })
          console.log(`📦 Módulo cambiado a: ${module.name}`)
        }
      },

      addModule: (module: Module) => {
        set((state) => ({
          modules: [...state.modules, module],
        }))
      },

      removeModule: (moduleId: string) => {
        set((state) => ({
          modules: state.modules.filter((m) => m.id !== moduleId),
          currentModule: state.currentModule === moduleId ? 'dashboard' : state.currentModule,
        }))
      },

      getCurrentModule: () => {
        const state = get()
        return state.modules.find((m) => m.id === state.currentModule)
      },
    }),
    {
      name: 'module-storage', // Nombre para localStorage
      partialize: (state) => ({
        currentModule: state.currentModule,
        // No persistimos modules para que siempre use los defaults
      }),
    }
  )
)
