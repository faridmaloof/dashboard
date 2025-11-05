import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'

export function RequireAuth({ children }: { children: React.ReactElement }) {
  const { user, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) {
    // Puedes mostrar un spinner o placeholder mientras cargamos estado
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center text-gray-500">Cargando...</div>
      </div>
    )
  }

  if (!user) {
    // No autenticado -> redirigir al login
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return children
}

export default RequireAuth
