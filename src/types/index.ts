/**
 * Tipos globales de la aplicación
 */

// ============================================
// Respuestas de API
// ============================================

// Interfaz para la respuesta de paginación directa de Laravel
export interface LaravelPaginatedResponse<T> {
  current_page: number
  data: T[]
  first_page_url: string
  from: number
  last_page: number
  last_page_url: string
  links?: Array<{
    url: string | null
    label: string
    page: number | null
    active: boolean
  }>
  next_page_url: string | null
  path: string
  per_page: number
  prev_page_url: string | null
  to: number
  total: number
}

// ============================================
// Modelos Ordinex
// ============================================

// Access (Permisos/Accesos) - Ordinex
export interface Access {
  id?: string | number
  module: string // 3 caracteres (ej: "usr", "rls")
  action: string // 3 caracteres (ej: "lst", "crt")
  code: string // Combinación module.action (ej: "usr.lst")
  name: string // Nombre descriptivo
  description?: string
  active?: boolean
  createdAt?: string
  updatedAt?: string
}

// Role - Ordinex
export interface Role {
  id?: string | number
  code: string // 3 caracteres (ej: "adm", "jmo")
  name: string // Nombre descriptivo
  description?: string
  accesses?: Access[] // Array de accesos/permisos
  active?: boolean
  createdAt?: string
  updatedAt?: string
}

// Usuario - Compatible con Ordinex
export interface User {
  id: string | number // ID es requerido
  email: string
  name: string
  avatar?: string
  // Roles del usuario (Ordinex)
  roles?: Role[] // Array de roles con sus accesos
  // Accesos directos del usuario (Ordinex - para permisos granulares)
  accesses?: Access[] // Array de accesos/permisos directos
  // Permisos procesados (códigos/strings) - calculados del frontend
  permissions?: string[]
  // Estado y verificación
  active?: boolean
  is_active?: boolean
  account_confirmed?: boolean
  emailVerifiedAt?: string | null
  email_verified_at?: string | null
  // Timestamps
  createdAt?: string
  created_at?: string
  updatedAt?: string
  updated_at?: string
}

// Auth
export interface AuthResponse {
  token: string
  refreshToken?: string
  user: User
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData extends LoginCredentials {
  name: string
}

// API Response
export interface ApiResponse<T = any> {
  data: T
  message?: string
  success: boolean
}

export interface PaginatedResponse<T = any> {
  data: T[]
  total: number
  page: number
  perPage: number
  totalPages: number
}

export interface ApiError {
  message: string
  errors?: Record<string, string[]>
  statusCode?: number
}

// CRUD
export interface CrudColumn<T = any> {
  key: string
  label: string
  sortable?: boolean
  filterable?: boolean
  render?: (value: any, row: T) => React.ReactNode
}

export interface CrudAction<T = any> {
  label: string
  icon?: React.ReactNode
  onClick: (row: T) => void
  variant?: 'primary' | 'secondary' | 'danger' | 'success'
  show?: (row: T) => boolean
}

export interface CrudFilter {
  key: string
  label: string
  type: 'text' | 'select' | 'date' | 'daterange'
  options?: { label: string; value: any }[]
}

// Proceso
export interface Process {
  id: string | number
  name: string
  description?: string
  endpoint: string
  method: 'GET' | 'POST' | 'PUT' | 'DELETE'
  params?: Record<string, any>
  status?: 'idle' | 'running' | 'success' | 'error'
  lastRun?: string
}

export interface ProcessExecution {
  id: string | number
  processId: string | number
  status: 'running' | 'success' | 'error'
  startedAt: string
  finishedAt?: string
  result?: any
  error?: string
}

// Brand Configuration (SaaS)
export interface BrandConfig {
  // Nombre de la marca (reemplaza "FaruTech")
  brandName: string
  // Título del tab del navegador
  pageTitle: string
  // URL del logo corto (para sidebar, favicon, etc.)
  logoUrl: string
  // URL del logo completo (para login, navbar, etc.)
  logoFullUrl: string
  // Versión de la aplicación (solo lectura, viene del backend)
  version?: string
  // Copyright (solo lectura, viene del backend)
  copyright?: string
  // Color primario (hex)
  primaryColor?: string
  // Descripción breve
  description?: string
}

// App Configuration
export interface AppConfig extends BrandConfig {
  // Configuraciones adicionales del sistema
  maintenanceMode?: boolean
  maxUploadSize?: number
  supportEmail?: string
  supportPhone?: string
}

// Dashboard
export interface DashboardStats {
  users: number
  revenue: number
  orders: number
  growth: number
}

export interface ChartData {
  name: string
  value: number
}

// Theme
export type Theme = 'light' | 'dark' | 'system'

// Notificación
export interface Notification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message?: string
  duration?: number
}

// Cash Register - Ordinex
export interface CashRegister {
  id: string | number
  code: string
  name: string
  description?: string
  location?: string
  opening_balance: number
  current_balance?: number
  is_active: boolean
  users?: User[] // Array de usuarios asociados
  created_at?: string
  updated_at?: string
}

// Customer - Ordinex
export interface Customer {
  id: string | number
  code: string
  name: string
  document_type?: string
  document_number?: string
  email?: string
  phone?: string
  address?: string
  city?: string
  country?: string
  is_active: boolean
  created_at?: string
  updated_at?: string
}

// Item (Product/Article) - Ordinex
export interface Item {
  id: string | number
  code: string
  description: string
  type?: string // 'product', 'service', etc.
  unit?: string
  price: number
  cost?: number
  stock?: number
  barcode?: string
  brand?: string
  model?: string
  taxable: boolean
  tax_rate?: number
  is_active?: boolean
  created_at?: string
  updated_at?: string
}

// Document Type - Ordinex
export interface DocumentType {
  id: string | number
  code: string
  name: string
  description?: string
  category?: string
  prefix?: string
  current_number?: number
  consecutive_length?: number
  requires_approval: boolean
  is_active?: boolean
  created_at?: string
  updated_at?: string
}
