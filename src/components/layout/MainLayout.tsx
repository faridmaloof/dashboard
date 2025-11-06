/**
 * Layout principal de la aplicación
 */

import { useEffect } from 'react'
import type { ReactNode } from 'react'
import { Sidebar } from './Sidebar'
import { Navbar } from './Navbar'
import { useSidebarStore } from '@/store/sidebarStore'

interface MainLayoutProps {
  children: ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
  const { isOpen, isMobile, sidebarWidth, setMobile } = useSidebarStore()

  useEffect(() => {
    const checkMobile = () => {
      setMobile(window.innerWidth < 1024)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [setMobile])

  const getMarginLeft = () => {
    if (isMobile) return 0
    if (!isOpen) return 63 // Colapsado: 63px
    return sidebarWidth // Expandido: ancho dinámico
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      
      <div
        style={{ marginLeft: `${getMarginLeft()}px` }}
        className="transition-all duration-500 ease-out"
      >
        <Navbar />
        
        <main className="p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
