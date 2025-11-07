import type { ComponentType } from 'react'
import {
  UsersIcon,
  Cog6ToothIcon,
  CommandLineIcon,
  ShieldCheckIcon,
  UserCircleIcon,
  Squares2X2Icon,
  ChartPieIcon,
  DocumentChartBarIcon,
  FolderIcon,
  ClipboardDocumentListIcon,
  ShieldExclamationIcon,
  WrenchScrewdriverIcon,
  ServerIcon,
  SwatchIcon,
  PaintBrushIcon,
  CodeBracketIcon,
  HomeIcon,
  UserGroupIcon,
  ShoppingCartIcon,
  CubeIcon,
  PhoneIcon,
  EnvelopeIcon,
  CalendarIcon,
  BriefcaseIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  ReceiptPercentIcon,
  BanknotesIcon,
  ArchiveBoxIcon,
  TagIcon,
  TruckIcon,
  BuildingStorefrontIcon,
  PresentationChartLineIcon,
  DocumentTextIcon,
  FunnelIcon,
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

// ============================================
// CONFIGURACIÓN DE MENÚS POR MÓDULO
// ============================================
// Cada módulo tiene su propio menú. Es simple y fácil de editar.
// Solo agrega/modifica los items para cada módulo según necesites.

/**
 * Menú del módulo DASHBOARD
 * Panel principal con vistas generales del sistema
 */
export const DASHBOARD_MENU: MenuEntry[] = [
  { name: 'Inicio', href: '/dashboard', icon: HomeIcon },
  { name: 'Analíticas', href: '/dashboard/analytics', icon: ChartPieIcon },
  { name: 'Actividad Reciente', href: '/dashboard/activity', icon: ClipboardDocumentListIcon, badge: 5 },
  {
    name: 'Reportes Rápidos',
    icon: DocumentChartBarIcon,
    items: [
      { name: 'Ventas del Día', href: '/dashboard/reports/daily-sales', icon: ChartBarIcon },
      { name: 'Clientes Nuevos', href: '/dashboard/reports/new-clients', icon: UserGroupIcon },
      { name: 'Inventario Bajo', href: '/dashboard/reports/low-stock', icon: ArchiveBoxIcon, badge: 3 },
    ],
  },
  {
    name: 'Design System',
    icon: SwatchIcon,
    items: [
      { name: 'Tokens', href: '/design-system/tokens', icon: PaintBrushIcon },
      { name: 'Colores', href: '/design-system/colors', icon: SwatchIcon },
      { name: 'Tipografía', href: '/design-system/typography', icon: CodeBracketIcon },
      { name: 'Componentes', href: '/design-system/components', icon: Squares2X2Icon },
      { name: 'Charts', href: '/design-system/charts', icon: ChartPieIcon },
    ],
  },
  {
    name: 'Ejemplos',
    icon: Squares2X2Icon,
    items: [
      { name: 'UI Components', href: '/components', icon: Squares2X2Icon },
      { name: 'Charts', href: '/charts', icon: ChartPieIcon },
    ],
  },
]

/**
 * Menú del módulo CRM
 * Gestión de relaciones con clientes
 */
export const CRM_MENU: MenuEntry[] = [
  { name: 'Dashboard CRM', href: '/crm/dashboard', icon: ChartPieIcon },
  {
    name: 'Clientes',
    icon: UserGroupIcon,
    items: [
      { name: 'Todos los Clientes', href: '/crm/clients', icon: UsersIcon },
      { name: 'Clientes Potenciales', href: '/crm/leads', icon: UserCircleIcon, badge: 12 },
      { name: 'Segmentos', href: '/crm/segments', icon: FunnelIcon },
    ],
  },
  {
    name: 'Interacciones',
    icon: PhoneIcon,
    items: [
      { name: 'Llamadas', href: '/crm/calls', icon: PhoneIcon },
      { name: 'Correos', href: '/crm/emails', icon: EnvelopeIcon, badge: 8 },
      { name: 'Reuniones', href: '/crm/meetings', icon: CalendarIcon },
    ],
  },
  {
    name: 'Ventas',
    icon: BriefcaseIcon,
    items: [
      { name: 'Oportunidades', href: '/crm/opportunities', icon: ChartBarIcon },
      { name: 'Cotizaciones', href: '/crm/quotes', icon: DocumentTextIcon },
      { name: 'Pipeline', href: '/crm/pipeline', icon: FunnelIcon },
    ],
  },
  { name: 'Reportes CRM', href: '/crm/reports', icon: DocumentChartBarIcon },
]

/**
 * Menú del módulo VENTAS
 * Gestión de ventas, facturas y pagos
 */
export const VENTAS_MENU: MenuEntry[] = [
  { name: 'Dashboard Ventas', href: '/ventas/dashboard', icon: ChartPieIcon },
  {
    name: 'Órdenes',
    icon: ShoppingCartIcon,
    items: [
      { name: 'Nueva Orden', href: '/ventas/orders/new', icon: ShoppingCartIcon },
      { name: 'Órdenes Activas', href: '/ventas/orders/active', icon: ClipboardDocumentListIcon, badge: 7 },
      { name: 'Historial', href: '/ventas/orders/history', icon: ArchiveBoxIcon },
    ],
  },
  {
    name: 'Facturación',
    icon: ReceiptPercentIcon,
    items: [
      { name: 'Facturas', href: '/ventas/invoices', icon: DocumentTextIcon },
      { name: 'Pagos', href: '/ventas/payments', icon: BanknotesIcon },
      { name: 'Pendientes', href: '/ventas/pending', icon: CurrencyDollarIcon, badge: 5 },
    ],
  },
  {
    name: 'Clientes',
    icon: UsersIcon,
    items: [
      { name: 'Lista de Clientes', href: '/ventas/customers', icon: UserGroupIcon },
      { name: 'Historial de Compras', href: '/ventas/customer-history', icon: ChartBarIcon },
    ],
  },
  { name: 'Reportes Ventas', href: '/ventas/reports', icon: DocumentChartBarIcon },
]

/**
 * Menú del módulo INVENTARIO
 * Control de stock y productos
 */
export const INVENTARIO_MENU: MenuEntry[] = [
  { name: 'Dashboard Inventario', href: '/inventario/dashboard', icon: ChartPieIcon },
  {
    name: 'Productos',
    icon: CubeIcon,
    items: [
      { name: 'Todos los Productos', href: '/inventario/products', icon: ArchiveBoxIcon },
      { name: 'Categorías', href: '/inventario/categories', icon: TagIcon },
      { name: 'Stock Bajo', href: '/inventario/low-stock', icon: ShieldExclamationIcon, badge: 3 },
    ],
  },
  {
    name: 'Movimientos',
    icon: TruckIcon,
    items: [
      { name: 'Entradas', href: '/inventario/inbound', icon: TruckIcon },
      { name: 'Salidas', href: '/inventario/outbound', icon: ShoppingCartIcon },
      { name: 'Transferencias', href: '/inventario/transfers', icon: CommandLineIcon },
    ],
  },
  {
    name: 'Almacenes',
    icon: BuildingStorefrontIcon,
    items: [
      { name: 'Ubicaciones', href: '/inventario/warehouses', icon: BuildingStorefrontIcon },
      { name: 'Zonas', href: '/inventario/zones', icon: FolderIcon },
    ],
  },
  { name: 'Reportes Inventario', href: '/inventario/reports', icon: DocumentChartBarIcon },
]

/**
 * Menú del módulo REPORTES
 * Analíticas y reportes avanzados
 */
export const REPORTES_MENU: MenuEntry[] = [
  { name: 'Centro de Reportes', href: '/reportes/dashboard', icon: ChartPieIcon },
  {
    name: 'Reportes Financieros',
    icon: CurrencyDollarIcon,
    items: [
      { name: 'Balance General', href: '/reportes/financial/balance', icon: BanknotesIcon },
      { name: 'Estado de Resultados', href: '/reportes/financial/income', icon: ChartBarIcon },
      { name: 'Flujo de Caja', href: '/reportes/financial/cashflow', icon: CurrencyDollarIcon },
    ],
  },
  {
    name: 'Reportes Operativos',
    icon: ChartBarIcon,
    items: [
      { name: 'Ventas por Período', href: '/reportes/sales/period', icon: PresentationChartLineIcon },
      { name: 'Productos Más Vendidos', href: '/reportes/sales/top-products', icon: ChartPieIcon },
      { name: 'Rendimiento por Cliente', href: '/reportes/sales/customer-performance', icon: UserGroupIcon },
    ],
  },
  {
    name: 'Reportes de Inventario',
    icon: ArchiveBoxIcon,
    items: [
      { name: 'Valoración de Stock', href: '/reportes/inventory/valuation', icon: CurrencyDollarIcon },
      { name: 'Rotación de Inventario', href: '/reportes/inventory/turnover', icon: ChartBarIcon },
      { name: 'Productos Sin Movimiento', href: '/reportes/inventory/dead-stock', icon: ShieldExclamationIcon },
    ],
  },
  { name: 'Reportes Personalizados', href: '/reportes/custom', icon: WrenchScrewdriverIcon },
]

// ============================================
// CONFIGURACIÓN GLOBAL (Accesible desde todos los módulos)
// ============================================
export const GLOBAL_MENU: MenuEntry[] = [
  {
    name: 'Gestión',
    icon: FolderIcon,
    items: [
      { name: 'Usuarios', href: '/users', icon: UsersIcon, permission: 'users.view' },
      { name: 'Procesos', href: '/processes', icon: CommandLineIcon, permission: 'processes.view' },
    ],
  },
  {
    name: 'Seguridad',
    icon: ShieldCheckIcon,
    items: [
      { name: 'Roles y Permisos', href: '/security/roles', icon: ShieldExclamationIcon, permission: 'roles.view' },
      { name: 'Auditoría', href: '/security/audit', icon: ClipboardDocumentListIcon, permission: 'audit.view' },
    ],
  },
  {
    name: 'Configuración',
    icon: Cog6ToothIcon,
    items: [
      { name: 'Perfil', href: '/settings/profile', icon: UserCircleIcon },
      { name: 'General', href: '/settings/general', icon: WrenchScrewdriverIcon, permission: 'settings.manage' },
      { name: 'Sistema', href: '/settings/system', icon: ServerIcon, permission: 'system.manage' },
    ],
  },
]

// ============================================
// MAPA DE CONFIGURACIÓN DE MENÚS
// ============================================
// Aquí defines qué menú se muestra para cada módulo
export const MODULE_MENU_MAP: Record<string, MenuEntry[]> = {
  dashboard: DASHBOARD_MENU,
  crm: CRM_MENU,
  ventas: VENTAS_MENU,
  inventario: INVENTARIO_MENU,
  reportes: REPORTES_MENU,
}

/**
 * Obtiene el menú correspondiente al módulo activo
 * @param moduleId - ID del módulo actual
 * @returns Array de entries del menú
 */
export function getMenuForModule(moduleId: string): MenuEntry[] {
  const moduleMenu = MODULE_MENU_MAP[moduleId] || DASHBOARD_MENU
  return [...moduleMenu, ...GLOBAL_MENU]
}

// Compatibilidad con código existente
export const MENU_CONFIG: MenuEntry[] = DASHBOARD_MENU
