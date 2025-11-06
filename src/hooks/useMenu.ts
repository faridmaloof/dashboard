import { useMemo } from 'react'
import { MENU_CONFIG, type MenuEntry, type MenuCategory, type MenuItemBase } from '@/config/menu.config'
import { useAuth } from './useAuth'
import { useQuery } from '@tanstack/react-query'
import { apiService } from '@/services/api.service'
import { ENDPOINTS } from '@/config/api.config'

export function useMenu() {
  const { user, hasPermission } = useAuth()

  // Try to fetch server-provided menu (override) using react-query
  const { data: serverMenu } = useQuery<MenuEntry[]>({
    queryKey: ['menu', user?.id],
    queryFn: async () => {
      try {
        const res = await apiService.get<MenuEntry[]>(ENDPOINTS.auth.menu)
        return res.data
      } catch {
        return []
      }
    },
    enabled: !!user, // only try when user is available
    staleTime: 1000 * 60 * 10,
    retry: false,
  })

  const menu = useMemo(() => {
    const source = (serverMenu && serverMenu.length > 0) ? serverMenu : MENU_CONFIG
    const result: MenuEntry[] = []

    for (const entry of source) {
      if ('items' in entry && Array.isArray((entry as MenuCategory).items)) {
        // Es una categoría con items
        const category = entry as MenuCategory
        const items = category.items.filter((item) => {
          const permission = (item as any).permission
          // Si no tiene permiso requerido, mostrar siempre
          if (!permission) return true
          // Si tiene permiso requerido, verificar si el usuario lo tiene
          return hasPermission(permission)
        })
        
        // Solo agregar la categoría si tiene items visibles
        if (items.length > 0) {
          result.push({ ...category, items })
        }
      } else {
        // Es un item individual
        const item = entry as MenuItemBase
        const permission = (item as any).permission
        // Si no tiene permiso requerido, mostrar siempre
        if (!permission) {
          result.push(item)
        } else if (hasPermission(permission)) {
          result.push(item)
        }
      }
    }

    return result
  }, [serverMenu, user, hasPermission])

  return { menu, user }
}
