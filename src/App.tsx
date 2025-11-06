/**
 * Componente principal de la aplicación
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import { RequireAuth } from '@/components/layout/RequireAuth'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ConfigProvider } from '@/contexts/ConfigContext'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { MainLayout } from './components/layout/MainLayout'
import { ToastContainer } from './components/ui/Toast'
import { Loading } from './components/ui/Loading'

// Lazy load de todas las páginas para reducir el bundle inicial
// Solo LoginPage se carga inmediatamente por ser la página de entrada
const LoginPage = lazy(() => import('./pages/auth/LoginPage').then(m => ({ default: m.LoginPage })))
const DashboardPage = lazy(() => import('./pages/dashboard/DashboardPage').then(m => ({ default: m.DashboardPage })))
const UsersPage = lazy(() => import('./pages/users/UsersPage').then(m => ({ default: m.UsersPage })))
const ProfilePage = lazy(() => import('./pages/settings/ProfilePage').then(m => ({ default: m.ProfilePage })))
const ChartsPage = lazy(() => import('./pages/charts/ChartsPage'))
const ComponentsPage = lazy(() => import('./pages/components/ComponentsPage'))
const ProcessesPage = lazy(() => import('./pages/processes/ProcessesPage'))
const GeneralSettingsPage = lazy(() => import('./pages/settings/GeneralSettingsPage'))
const NotFoundPage = lazy(() => import('./pages/errors/NotFoundPage'))

// Config pages
const CashRegistersPage = lazy(() => import('./pages/config/CashRegistersPage').then(m => ({ default: m.CashRegistersPage })))
const CustomersPage = lazy(() => import('./pages/config/CustomersPage').then(m => ({ default: m.CustomersPage })))
const ItemsPage = lazy(() => import('./pages/config/ItemsPage').then(m => ({ default: m.ItemsPage })))
const DocumentTypesPage = lazy(() => import('./pages/config/DocumentTypesPage').then(m => ({ default: m.DocumentTypesPage })))

// Security pages
const RolesPage = lazy(() => import('./pages/security/RolesPage').then(m => ({ default: m.RolesPage })))
const AccessesPage = lazy(() => import('./pages/security/AccessesPage').then(m => ({ default: m.AccessesPage })))

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
                
                {/* Protected routes */}
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={<RequireAuth><MainLayout><DashboardPage /></MainLayout></RequireAuth>} />
                <Route path="/components" element={<RequireAuth><MainLayout><ComponentsPage /></MainLayout></RequireAuth>} />
                <Route path="/charts" element={<RequireAuth><MainLayout><ChartsPage /></MainLayout></RequireAuth>} />
                <Route path="/users" element={<RequireAuth><MainLayout><UsersPage /></MainLayout></RequireAuth>} />
                <Route path="/processes" element={<RequireAuth><MainLayout><ProcessesPage /></MainLayout></RequireAuth>} />
                <Route path="/reports" element={<RequireAuth><MainLayout><div className="text-center py-12 text-gray-500">Página de Reportes - En construcción</div></MainLayout></RequireAuth>} />
                <Route path="/config/cash-registers" element={<RequireAuth><MainLayout><CashRegistersPage /></MainLayout></RequireAuth>} />
                <Route path="/config/customers" element={<RequireAuth><MainLayout><CustomersPage /></MainLayout></RequireAuth>} />
                <Route path="/config/items" element={<RequireAuth><MainLayout><ItemsPage /></MainLayout></RequireAuth>} />
                <Route path="/config/document-types" element={<RequireAuth><MainLayout><DocumentTypesPage /></MainLayout></RequireAuth>} />
                <Route path="/settings/profile" element={<RequireAuth><MainLayout><ProfilePage /></MainLayout></RequireAuth>} />
                <Route path="/settings/general" element={<RequireAuth><MainLayout><GeneralSettingsPage /></MainLayout></RequireAuth>} />
                <Route path="/settings/system" element={<RequireAuth><MainLayout><div className="text-center py-12 text-gray-500">Configuración del Sistema - En construcción</div></MainLayout></RequireAuth>} />
                <Route path="/security/roles" element={<RequireAuth><MainLayout><RolesPage /></MainLayout></RequireAuth>} />
                <Route path="/security/accesses" element={<RequireAuth><MainLayout><AccessesPage /></MainLayout></RequireAuth>} />
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
