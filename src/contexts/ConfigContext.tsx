/**
 * Context para configuración de marca (SaaS)
 */

import { createContext, useContext, useState, type ReactNode } from 'react'
import type { BrandConfig } from '@/types'

// Configuración por defecto
const DEFAULT_CONFIG: BrandConfig = {
  brandName: 'FaruTech',
  pageTitle: 'FaruTech - Admin Panel',
  logoUrl: '/Logo.png',
  logoFullUrl: '/Logo_Full.png',
  description: 'Panel de administración profesional',
  version: '1.0.0',
  copyright: '© 2024 FaruTech. Todos los derechos reservados.',
  primaryColor: '#3B82F6',
}

interface ConfigContextType {
  config: BrandConfig
  defaultConfig: BrandConfig
  updateConfig: (newConfig: Partial<BrandConfig>) => Promise<void>
  resetConfig: () => void
  resetToDefault: () => void 
  setAsDefault: () => void
  isLoading: boolean
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined)

export function useConfig() {
  const context = useContext(ConfigContext)
  if (!context) {
    throw new Error('useConfig debe ser usado dentro de ConfigProvider')
  }
  return context
}

interface ConfigProviderProps {
  children: ReactNode
}

export function ConfigProvider({ children }: ConfigProviderProps) {
  const [config, setConfig] = useState<BrandConfig>(DEFAULT_CONFIG)
  const [isLoading] = useState(false)

  const updateConfig = async (newConfig: Partial<BrandConfig>) => {
    setConfig((prev) => ({ ...prev, ...newConfig }))
  }

  const resetConfig = () => {
    setConfig(DEFAULT_CONFIG)
  }

  const resetToDefault = () => {
    setConfig(DEFAULT_CONFIG)
  }

  const setAsDefault = () => {
    // Guardar configuración actual como predeterminada
  }

  return (
    <ConfigContext.Provider
      value={{
        config,
        defaultConfig: DEFAULT_CONFIG,
        updateConfig,
        resetConfig,
        resetToDefault,
        setAsDefault,
        isLoading,
      }}
    >
      {children}
    </ConfigContext.Provider>
  )
}
