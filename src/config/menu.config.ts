import type { ComponentType } from 'react'
import {
  HomeIcon,
  UsersIcon,
  Cog6ToothIcon,
  ChartBarIcon,
  CommandLineIcon,
  ShieldCheckIcon,
  DocumentTextIcon,
  UserCircleIcon,
  Squares2X2Icon,
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
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  { name: 'Componentes', href: '/components', icon: Squares2X2Icon },
  {
    name: 'Gestión',
    icon: DocumentTextIcon,
    items: [
      { name: 'Usuarios', href: '/users', icon: UsersIcon, permission: 'users.view' },
      { name: 'Procesos', href: '/processes', icon: CommandLineIcon, permission: 'processes.view' },
      { name: 'Reportes', href: '/reports', icon: ChartBarIcon, permission: 'reports.view' },
    ],
  },
  {
    name: 'Seguridad',
    icon: ShieldCheckIcon,
    items: [
      { name: 'Roles y Permisos', href: '/security/roles', icon: ShieldCheckIcon, permission: 'roles.view' },
      { name: 'Auditoría', href: '/security/audit', icon: DocumentTextIcon, permission: 'audit.view' },
    ],
  },
  {
    name: 'Configuración',
    icon: Cog6ToothIcon,
    items: [
      { name: 'Perfil', href: '/settings/profile', icon: UserCircleIcon },
      { name: 'General', href: '/settings/general', icon: Cog6ToothIcon, permission: 'settings.manage' },
      { name: 'Sistema', href: '/settings/system', icon: Cog6ToothIcon, permission: 'system.manage' },
    ],
  },
]
