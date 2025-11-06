import type { ComponentType } from 'react'
import {
  UsersIcon,
  UserCircleIcon,
  ChartPieIcon,
  WrenchScrewdriverIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  CubeIcon,
  DocumentTextIcon,
  ShieldCheckIcon,
  KeyIcon,
} from '@heroicons/react/24/outline'

export interface MenuItemBase {
  name: string
  href?: string
  icon?: ComponentType<{ className?: string }>
  badge?: number
  // permiso requerido para ver este item (opcional)
  permission?: string
}

export interface MenuCategory extends MenuItemBase {
  items: MenuItemBase[]
}

export type MenuEntry = MenuItemBase | MenuCategory

// Configuración inicial del menú. Es simple y fácil de editar.
// Los `permission` son strings que deben coincidir con los proporcionados
// en `user.permissions` desde el backend.
export const MENU_CONFIG: MenuEntry[] = [
  { name: 'Dashboard', href: '/dashboard', icon: ChartPieIcon },
  {
    name: 'Seguridad',
    icon: ShieldCheckIcon,
    items: [
      { name: 'Usuarios', href: '/users', icon: UsersIcon, permission: 'usr.lst' },
      { name: 'Roles', href: '/security/roles', icon: ShieldCheckIcon, permission: 'rls.lst' },
      { name: 'Accesos', href: '/security/accesses', icon: KeyIcon, permission: 'acc.lst' },
    ],
  },
  {
    name: 'Parámetros',
    icon: WrenchScrewdriverIcon,
    items: [
      { name: 'Cajas Registradoras', href: '/config/cash-registers', icon: CurrencyDollarIcon, permission: 'csr.lst' },
      { name: 'Clientes', href: '/config/customers', icon: UserGroupIcon, permission: 'cli.lst' },
      { name: 'Artículos', href: '/config/items', icon: CubeIcon, permission: 'itm.lst' },
      { name: 'Tipos de Documento', href: '/config/document-types', icon: DocumentTextIcon, permission: 'dct.lst' },
      { name: 'Perfil', href: '/settings/profile', icon: UserCircleIcon },
    ],
  },
]
