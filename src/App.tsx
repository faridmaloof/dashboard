/**
 * Componente principal de la aplicación
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MainLayout } from './components/layout/MainLayout'
import { ToastContainer } from './components/ui/Toast'
import { LoginPage } from './pages/auth/LoginPage'
import { DashboardPage } from './pages/dashboard/DashboardPage'
import { UsersPage } from './pages/users/UsersPage'
import { ProcessesPage } from './pages/processes/ProcessesPage'
import { ProfilePage } from './pages/settings/ProfilePage'
import ComponentsPage from './pages/components/ComponentsPage'

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
          <Route path="/dashboard" element={<MainLayout><DashboardPage /></MainLayout>} />
          <Route path="/components" element={<MainLayout><ComponentsPage /></MainLayout>} />
          <Route path="/users" element={<MainLayout><UsersPage /></MainLayout>} />
          <Route path="/processes" element={<MainLayout><ProcessesPage /></MainLayout>} />
          <Route path="/reports" element={<MainLayout><div className="text-center py-12 text-gray-500">Página de Reportes - En construcción</div></MainLayout>} />
          <Route path="/settings/profile" element={<MainLayout><ProfilePage /></MainLayout>} />
          <Route path="/settings/general" element={<MainLayout><div className="text-center py-12 text-gray-500">Configuración General - En construcción</div></MainLayout>} />
          <Route path="/settings/system" element={<MainLayout><div className="text-center py-12 text-gray-500">Configuración del Sistema - En construcción</div></MainLayout>} />
          <Route path="/security/roles" element={<MainLayout><div className="text-center py-12 text-gray-500">Roles y Permisos - En construcción</div></MainLayout>} />
          <Route path="/security/audit" element={<MainLayout><div className="text-center py-12 text-gray-500">Auditoría - En construcción</div></MainLayout>} />
          <Route path="*" element={<MainLayout><div className="text-center py-12 text-gray-500">Página no encontrada</div></MainLayout>} />
        </Routes>
        <ToastContainer />
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App
