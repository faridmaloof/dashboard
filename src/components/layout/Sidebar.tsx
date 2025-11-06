/**
 * Componente Sidebar - Menú lateral de navegación
 */

import { NavLink } from 'react-router-dom'
import { ChevronDownIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import { useSidebarStore } from '@/store/sidebarStore'
import { useMenu } from '@/hooks/useMenu'
import { useState, useEffect, useCallback, useRef } from 'react'
import clsx from 'clsx'
import { useConfig } from '@/contexts/ConfigContext'
import type { MenuCategory, MenuItemBase, MenuEntry } from '@/config/menu.config'

export function Sidebar() {
  const { isOpen, isMobile, close, sidebarWidth, setSidebarWidth } = useSidebarStore()
  const { menu } = useMenu()
  const { config } = useConfig()
  const [openCategories, setOpenCategories] = useState<Set<string>>(new Set())
  const [isResizing, setIsResizing] = useState(false)
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null)
  const hoverTimeoutRef = useRef<number | null>(null)

  const toggleCategory = (name: string) => {
    setOpenCategories((prev) => {
      const newSet = new Set<string>()
      // Si la categoría ya estaba abierta, la cerramos (set vacío)
      // Si no, abrimos solo esta (accordion - una a la vez)
      if (!prev.has(name)) {
        newSet.add(name)
      }
      return newSet
    })
  }

  const startResizing = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    setIsResizing(true)
  }, [])

  const stopResizing = useCallback(() => {
    setIsResizing(false)
  }, [])

  const resize = useCallback((e: MouseEvent) => {
    if (isResizing) {
      const newWidth = e.clientX
      if (newWidth >= 200 && newWidth <= 400) {
        setSidebarWidth(newWidth)
      }
    }
  }, [isResizing, setSidebarWidth])

  useEffect(() => {
    window.addEventListener('mousemove', resize)
    window.addEventListener('mouseup', stopResizing)

    return () => {
      window.removeEventListener('mousemove', resize)
      window.removeEventListener('mouseup', stopResizing)
    }
  }, [resize, stopResizing])

  // Cleanup hover timeout on unmount
  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        window.clearTimeout(hoverTimeoutRef.current)
      }
    }
  }, [])

  const handleCategoryMouseEnter = (categoryName: string) => {
    if (!isOpen && !isMobile) {
      if (hoverTimeoutRef.current) {
        window.clearTimeout(hoverTimeoutRef.current)
      }
      hoverTimeoutRef.current = window.setTimeout(() => {
        setHoveredCategory(categoryName)
      }, 200)
    }
  }

  const handleCategoryMouseLeave = () => {
    if (!isOpen && !isMobile) {
      if (hoverTimeoutRef.current) {
        window.clearTimeout(hoverTimeoutRef.current)
      }
      hoverTimeoutRef.current = window.setTimeout(() => {
        setHoveredCategory(null)
      }, 300)
    }
  }

  const renderMenuItem = (item: MenuItemBase) => {
    const Icon = item.icon

    return (
      <NavLink
        key={item.name}
        to={item.href || '#'}
        onClick={() => isMobile && close()}
        className={({ isActive }) =>
          clsx(
            'flex items-center rounded-lg transition-all duration-200 group relative',
            isOpen ? 'gap-3 px-3 py-2.5' : 'justify-center py-2.5',
            isActive
              ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
              : 'text-gray-700 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-gray-200'
          )
        }
      >
        {Icon && (
          <Icon className={clsx('h-5 w-5 flex-shrink-0 transition-transform group-hover:scale-110')} />
        )}
        {isOpen && <span className="text-sm font-medium truncate">{item.name}</span>}
        {isOpen && item.badge !== undefined && (
          <span className="ml-auto bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
            {item.badge}
          </span>
        )}
        
        {/* Tooltip when collapsed */}
        {!isOpen && !isMobile && (
          <div className="fixed left-20 px-2 py-1 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 pointer-events-none">
            {item.name}
          </div>
        )}
      </NavLink>
    )
  }

  const renderCategory = (category: MenuCategory) => {
    const Icon = category.icon
    const isExpanded = openCategories.has(category.name)
    const isHovered = hoveredCategory === category.name

    return (
      <div 
        key={category.name}
        className="relative"
        data-category={category.name}
        onMouseEnter={() => handleCategoryMouseEnter(category.name)}
        onMouseLeave={handleCategoryMouseLeave}
      >
        <button
          onClick={() => isOpen && toggleCategory(category.name)}
          className={clsx(
            'w-full flex items-center text-sm font-medium rounded-lg transition-all duration-200 group',
            isOpen ? 'gap-3 px-3 py-2.5' : 'justify-center py-2.5',
            'text-gray-700 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/50'
          )}
        >
          {Icon && <Icon className="h-5 w-5 flex-shrink-0" />}
          {isOpen && <span className="flex-1 text-left truncate">{category.name}</span>}
          {isOpen && (
            <ChevronDownIcon
              className={clsx('h-4 w-4 transition-transform duration-200', isExpanded && 'rotate-180')}
            />
          )}
          {!isOpen && !isMobile && (
            <ChevronRightIcon className="h-4 w-4 absolute right-1 opacity-0 group-hover:opacity-100 transition-opacity" 
              style={{ marginLeft: '16px' }} 
            />
          )}
        </button>

        {/* Expanded submenu (when sidebar is open) */}
        {isOpen && (
          <div 
            className={clsx(
              'ml-8 overflow-hidden transition-all duration-300 ease-in-out',
              isExpanded ? 'max-h-[500px] opacity-100 mt-1' : 'max-h-0 opacity-0'
            )}
          >
            <div className="space-y-1">
              {category.items.map((item) => renderMenuItem(item))}
            </div>
          </div>
        )}

        {/* Floating submenu (when sidebar is collapsed) */}
        {!isOpen && !isMobile && isHovered && (
          <div
            className="fixed left-20 bg-white dark:bg-gray-800 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 py-2 px-3 min-w-[200px] z-50"
            style={{
              top: `${document.querySelector(`[data-category="${category.name}"]`)?.getBoundingClientRect().top || 0}px`,
            }}
            onMouseEnter={() => {
              if (hoverTimeoutRef.current) {
                window.clearTimeout(hoverTimeoutRef.current)
              }
              setHoveredCategory(category.name)
            }}
            onMouseLeave={handleCategoryMouseLeave}
          >
            <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 px-2">
              {category.name}
            </div>
            <div className="space-y-1">
              {category.items.map((item) => {
                const ItemIcon = item.icon
                return (
                  <NavLink
                    key={item.name}
                    to={item.href || '#'}
                    onClick={() => isMobile && close()}
                    className={({ isActive }) =>
                      clsx(
                        'flex items-center gap-3 px-2 py-2 rounded-md transition-all duration-200 text-sm',
                        isActive
                          ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50'
                      )
                    }
                  >
                    {ItemIcon && <ItemIcon className="h-4 w-4 flex-shrink-0" />}
                    <span className="truncate">{item.name}</span>
                    {item.badge !== undefined && (
                      <span className="ml-auto bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </NavLink>
                )
              })}
            </div>
          </div>
        )}
      </div>
    )
  }

  const renderEntry = (entry: MenuEntry, _index: number) => {
    if ('items' in entry && Array.isArray(entry.items)) {
      const category = entry as MenuCategory
      return (
        <div key={category.name} data-category={category.name}>
          {renderCategory(category)}
        </div>
      )
    }
    return renderMenuItem(entry as MenuItemBase)
  }

  return (
    <>
      {/* Overlay para móvil */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={close}
        />
      )}

      {/* Sidebar */}
      <aside
        className={clsx(
          'fixed top-0 left-0 z-40 h-screen bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col overflow-x-hidden',
          isMobile && !isOpen && '-translate-x-full'
        )}
        style={{ 
          width: isOpen && !isMobile ? `${sidebarWidth}px` : (!isOpen && !isMobile ? '69px' : undefined),
          maxWidth: !isOpen && !isMobile ? '69px' : undefined
        }}
      >
        {/* Logo */}
        <div className="flex items-center justify-center h-14 border-b border-gray-200 dark:border-gray-700 px-2 flex-shrink-0">
          {!isOpen ? (
            // Logo centrado cuando está colapsado
            <img
              src={config.logoUrl}
              alt={config.brandName}
              className="h-8 w-8 flex-shrink-0"
            />
          ) : (
            // Logo con texto cuando está expandido
            <div className="flex items-center gap-3 w-full justify-center">
              <img
                src={config.logoUrl}
                alt={config.brandName}
                className="h-8 w-8 flex-shrink-0"
              />
              <div className="flex flex-col -space-y-0.5">
                <span className="text-sm font-bold text-gray-900 dark:text-white whitespace-nowrap leading-tight">
                  {config.brandName}
                </span>
                <span className="text-[10px] text-gray-500 dark:text-gray-400 whitespace-nowrap">
                  Admin Panel
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className={clsx(
          'flex-1 overflow-y-auto space-y-2 custom-scrollbar',
          isOpen ? 'p-4' : 'px-2 py-4'
        )}>
          {menu.map((entry, index) => renderEntry(entry, index))}
        </nav>

        {/* Footer */}
        {isOpen && (
          <div className="border-t border-gray-200 dark:border-gray-700 p-4 flex-shrink-0">
            <div className="text-center space-y-1">
              <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                Admin Panel v1.0.0
              </p>
              <p className="text-[10px] text-gray-500 dark:text-gray-400 flex items-center justify-center gap-1">
                <span>©</span>
                <span>2025 FaruTech</span>
              </p>
            </div>
          </div>
        )}

        {/* Resizer */}
        {isOpen && !isMobile && (
          <div
            onMouseDown={startResizing}
            className="absolute top-0 right-0 h-full w-1.5 cursor-col-resize bg-gray-200/50 dark:bg-gray-700/50 hover:bg-primary-200 dark:hover:bg-primary-800 transition-colors duration-200"
          />
        )}
      </aside>
    </>
  )
}
