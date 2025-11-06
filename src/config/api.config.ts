/**
 * Configuración de API
 * Aquí defines la URL base de tu backend existente
 */

export const API_CONFIG = {
  // Cambiar esta URL por la de tu backend real
  baseURL: import.meta.env.VITE_API_URL || 'https://api.ordinex.farutech.com',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
}

export const AUTH_CONFIG = {
  tokenKey: 'auth_token',
  refreshTokenKey: 'refresh_token',
  userKey: 'user_data',
  // Si el backend usa cookies httpOnly para auth (recomendado), activar esto.
  // Cuando true, las llamadas deben enviarse con `withCredentials: true` y
  // el refresh puede no requerir enviar el refresh token en el body.
  useHttpOnlyCookie: false,
}

export const ENDPOINTS = {
  // Auth - Ordinex API
  auth: {
    login: '/api/auth/login',
    register: '/api/auth/register',
    logout: '/api/auth/logout',
    refresh: '/api/auth/refresh',
    me: '/api/profile',
    menu: '/api/auth/menu',
    updateProfile: '/api/profile',
    changePassword: '/api/profile/change-password',
  },
  // Users
  users: {
    list: '/api/users',
    create: '/api/users',
    update: (id: string | number) => `/api/users/${id}`,
    delete: (id: string | number) => `/api/users/${id}`,
    show: (id: string | number) => `/api/users/${id}`,
    bulkDelete: '/api/users/bulk-delete',
    toggleActive: (id: string | number) => `/api/users/${id}/toggle-active`,
  },
  // Roles
  roles: {
    list: '/api/roles',
    create: '/api/roles',
    update: (id: string | number) => `/api/roles/${id}`,
    delete: (id: string | number) => `/api/roles/${id}`,
    show: (id: string | number) => `/api/roles/${id}`,
    toggleActive: (id: string | number) => `/api/roles/${id}/toggle-active`,
  },
  // Accesses
  accesses: {
    list: '/api/accesses',
    create: '/api/accesses',
    update: (id: string | number) => `/api/accesses/${id}`,
    delete: (id: string | number) => `/api/accesses/${id}`,
    show: (id: string | number) => `/api/accesses/${id}`,
    toggleActive: (id: string | number) => `/api/accesses/${id}/toggle-active`,
  },
  // Customers - Ordinex
  customers: {
    list: '/api/customers',
    create: '/api/customers',
    update: (id: string | number) => `/api/customers/${id}`,
    delete: (id: string | number) => `/api/customers/${id}`,
    show: (id: string | number) => `/api/customers/${id}`,
  },
  // Deliveries - Ordinex
  deliveries: {
    list: '/api/deliveries',
    create: '/api/deliveries',
    show: (id: string) => `/api/deliveries/${id}`,
    delete: (id: string) => `/api/deliveries/${id}`,
  },
  // Items - Ordinex
  items: {
    list: '/api/items',
    create: '/api/items',
    update: (id: string | number) => `/api/items/${id}`,
    delete: (id: string | number) => `/api/items/${id}`,
    show: (id: string | number) => `/api/items/${id}`,
  },
  // Cash Registers - Ordinex
  cashRegisters: {
    list: '/api/cash-registers',
    create: '/api/cash-registers',
    update: (id: string | number) => `/api/cash-registers/${id}`,
    delete: (id: string | number) => `/api/cash-registers/${id}`,
    show: (id: string | number) => `/api/cash-registers/${id}`,
    toggleActive: (id: string | number) => `/api/cash-registers/${id}/toggle-active`,
  },
  // Document Types - Ordinex
  documentTypes: {
    list: '/api/document-types',
    create: '/api/document-types',
    update: (id: string | number) => `/api/document-types/${id}`,
    delete: (id: string | number) => `/api/document-types/${id}`,
    show: (id: string | number) => `/api/document-types/${id}`,
  },
  // Procesos especiales (para funcionalidad futura)
  processes: {
    list: '/api/processes',
    execute: '/api/processes/execute',
    status: (id: string | number) => `/api/processes/${id}/status`,
    history: '/api/processes/history',
  },
  // Dashboard
  dashboard: {
    stats: '/api/dashboard/stats',
    charts: '/api/dashboard/charts',
    activity: '/api/dashboard/activity',
  },
}
