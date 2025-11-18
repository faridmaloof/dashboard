/**
 * Componente principal de la aplicación
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import RequireAuth from '@/components/layout/RequireAuth'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ConfigProvider } from '@/contexts/ConfigContext'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { MainLayout } from './components/layout/MainLayout'
import { ToastContainer } from './components/ui/Toast'
import { LoginPage } from './pages/auth/LoginPage'
import { ForgotPasswordPage } from './pages/auth/ForgotPasswordPage'
import { DashboardPage } from './pages/dashboard/DashboardPage'
import { UsersPage } from './pages/users/UsersPage'
import { ProfilePage } from './pages/settings/ProfilePage'
import { Loading } from './components/ui/Loading'

// Lazy load de páginas pesadas
const ChartsPage = lazy(() => import('./pages/charts/ChartsPage'))
const ComponentsPage = lazy(() => import('./pages/components/ComponentsPage'))
const ProcessesPage = lazy(() => import('./pages/processes/ProcessesPage'))
const GeneralSettingsPage = lazy(() => import('./pages/settings/GeneralSettingsPage'))
const NotFoundPage = lazy(() => import('./pages/errors/NotFoundPage'))

// Design System Pages
const TokensPage = lazy(() => import('./pages/design-system/TokensPage'))
const ColorsPage = lazy(() => import('./pages/design-system/ColorsPage'))
const TypographyPage = lazy(() => import('./pages/design-system/TypographyPage'))
const ComponentsLibraryPage = lazy(() => import('./pages/design-system/ComponentsLibraryPage'))
const ChartsLibraryPage = lazy(() => import('./pages/design-system/ChartsLibraryPage'))

// Module Pages - CRM
const CrmDashboardPage = lazy(() => import('./pages/crm/CrmDashboardPage'))
const ClientsPage = lazy(() => import('./pages/crm/ClientsPage'))
const LeadsPage = lazy(() => import('./pages/crm/LeadsPage'))

// Module Pages - Ventas
const VentasDashboardPage = lazy(() => import('./pages/ventas/VentasDashboardPage'))
const OrdersPage = lazy(() => import('./pages/ventas/OrdersPage'))

// Module Pages - Inventario
const InventarioDashboardPage = lazy(() => import('./pages/inventario/InventarioDashboardPage'))
const ProductsPage = lazy(() => import('./pages/inventario/ProductsPage'))

// Module Pages - Reportes
const ReportesDashboardPage = lazy(() => import('./pages/reportes/ReportesDashboardPage'))

// Configurar React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 1000 * 60 * 5, // 5 minutos
    },
  },
})

function App() {
  return (
    <ErrorBoundary>
      <ConfigProvider>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <Suspense fallback={<Loading />}>
              <Routes>
                {/* Public routes */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                
                {/* Protected routes */}
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={<RequireAuth><MainLayout><DashboardPage /></MainLayout></RequireAuth>} />
                
                {/* Design System */}
                <Route path="/design-system/tokens" element={<RequireAuth><MainLayout><TokensPage /></MainLayout></RequireAuth>} />
                <Route path="/design-system/colors" element={<RequireAuth><MainLayout><ColorsPage /></MainLayout></RequireAuth>} />
                <Route path="/design-system/typography" element={<RequireAuth><MainLayout><TypographyPage /></MainLayout></RequireAuth>} />
                <Route path="/design-system/components" element={<RequireAuth><MainLayout><ComponentsLibraryPage /></MainLayout></RequireAuth>} />
                <Route path="/design-system/charts" element={<RequireAuth><MainLayout><ChartsLibraryPage /></MainLayout></RequireAuth>} />
                
                {/* Examples */}
                <Route path="/components" element={<RequireAuth><MainLayout><ComponentsPage /></MainLayout></RequireAuth>} />
                <Route path="/charts" element={<RequireAuth><MainLayout><ChartsPage /></MainLayout></RequireAuth>} />
                
                {/* CRM Module */}
                <Route path="/crm/dashboard" element={<RequireAuth><MainLayout><CrmDashboardPage /></MainLayout></RequireAuth>} />
                <Route path="/crm/clientes" element={<RequireAuth><MainLayout><ClientsPage /></MainLayout></RequireAuth>} />
                <Route path="/crm/leads" element={<RequireAuth><MainLayout><LeadsPage /></MainLayout></RequireAuth>} />
                <Route path="/crm/*" element={<RequireAuth><MainLayout><div className="text-center py-12 text-gray-500">Módulo CRM - Sección en construcción</div></MainLayout></RequireAuth>} />
                
                {/* Ventas Module */}
                <Route path="/ventas/dashboard" element={<RequireAuth><MainLayout><VentasDashboardPage /></MainLayout></RequireAuth>} />
                <Route path="/ventas/ordenes" element={<RequireAuth><MainLayout><OrdersPage /></MainLayout></RequireAuth>} />
                <Route path="/ventas/*" element={<RequireAuth><MainLayout><div className="text-center py-12 text-gray-500">Módulo Ventas - Sección en construcción</div></MainLayout></RequireAuth>} />
                
                {/* Inventario Module */}
                <Route path="/inventario/dashboard" element={<RequireAuth><MainLayout><InventarioDashboardPage /></MainLayout></RequireAuth>} />
                <Route path="/inventario/productos" element={<RequireAuth><MainLayout><ProductsPage /></MainLayout></RequireAuth>} />
                <Route path="/inventario/*" element={<RequireAuth><MainLayout><div className="text-center py-12 text-gray-500">Módulo Inventario - Sección en construcción</div></MainLayout></RequireAuth>} />
                
                {/* Reportes Module */}
                <Route path="/reportes/dashboard" element={<RequireAuth><MainLayout><ReportesDashboardPage /></MainLayout></RequireAuth>} />
                <Route path="/reportes/*" element={<RequireAuth><MainLayout><div className="text-center py-12 text-gray-500">Módulo Reportes - Sección en construcción</div></MainLayout></RequireAuth>} />
                
                {/* App Pages */}
                <Route path="/users" element={<RequireAuth><MainLayout><UsersPage /></MainLayout></RequireAuth>} />
                <Route path="/processes" element={<RequireAuth><MainLayout><ProcessesPage /></MainLayout></RequireAuth>} />
                <Route path="/reports" element={<RequireAuth><MainLayout><div className="text-center py-12 text-gray-500">Página de Reportes - En construcción</div></MainLayout></RequireAuth>} />
                <Route path="/settings/profile" element={<RequireAuth><MainLayout><ProfilePage /></MainLayout></RequireAuth>} />
                <Route path="/settings/general" element={<RequireAuth><MainLayout><GeneralSettingsPage /></MainLayout></RequireAuth>} />
                <Route path="/settings/system" element={<RequireAuth><MainLayout><div className="text-center py-12 text-gray-500">Configuración del Sistema - En construcción</div></MainLayout></RequireAuth>} />
                <Route path="/security/roles" element={<RequireAuth><MainLayout><div className="text-center py-12 text-gray-500">Roles y Permisos - En construcción</div></MainLayout></RequireAuth>} />
                <Route path="/security/audit" element={<RequireAuth><MainLayout><div className="text-center py-12 text-gray-500">Auditoría - En construcción</div></MainLayout></RequireAuth>} />
                
                {/* 404 - Debe ser la última ruta */}
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </Suspense>
            <ToastContainer />
          </BrowserRouter>
        </QueryClientProvider>
      </ConfigProvider>
    </ErrorBoundary>
  )
}

export default App
