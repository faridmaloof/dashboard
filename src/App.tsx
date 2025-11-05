/**
 * Componente principal de la aplicación
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import RequireAuth from '@/components/layout/RequireAuth'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MainLayout } from './components/layout/MainLayout'
import { ToastContainer } from './components/ui/Toast'
import { LoginPage } from './pages/auth/LoginPage'
import { DashboardPage } from './pages/dashboard/DashboardPage'
import { UsersPage } from './pages/users/UsersPage'
import { ProcessesPage } from './pages/processes/ProcessesPage'
import { ProfilePage } from './pages/settings/ProfilePage'
import ComponentsPage from './pages/components/ComponentsPage'
import ChartsPage from './pages/charts/ChartsPage'

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
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
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
          <Route path="/settings/profile" element={<RequireAuth><MainLayout><ProfilePage /></MainLayout></RequireAuth>} />
          <Route path="/settings/general" element={<RequireAuth><MainLayout><div className="text-center py-12 text-gray-500">Configuración General - En construcción</div></MainLayout></RequireAuth>} />
          <Route path="/settings/system" element={<RequireAuth><MainLayout><div className="text-center py-12 text-gray-500">Configuración del Sistema - En construcción</div></MainLayout></RequireAuth>} />
          <Route path="/security/roles" element={<RequireAuth><MainLayout><div className="text-center py-12 text-gray-500">Roles y Permisos - En construcción</div></MainLayout></RequireAuth>} />
          <Route path="/security/audit" element={<RequireAuth><MainLayout><div className="text-center py-12 text-gray-500">Auditoría - En construcción</div></MainLayout></RequireAuth>} />
          <Route path="*" element={<MainLayout><div className="text-center py-12 text-gray-500">Página no encontrada</div></MainLayout>} />
        </Routes>
        <ToastContainer />
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App
