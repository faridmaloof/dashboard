/**
 * Página de perfil del usuario
 */

import { useState, useEffect } from 'react'
import { useMutation } from '@tanstack/react-query'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { 
  UserCircleIcon, 
  EnvelopeIcon, 
  CameraIcon,
  KeyIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline'
import { notify } from '@/store/notificationStore'
import { useAuth } from '@/hooks/useAuth'
import { apiService } from '@/services/api.service'
import { ENDPOINTS } from '@/config/api.config'

export function ProfilePage() {
  const { user, isLoading, refetchUser } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [profileName, setProfileName] = useState('')
  
  const [passwords, setPasswords] = useState({
    current_password: '',
    new_password: '',
    new_password_confirmation: '',
  })

  // Update profile state when user data loads
  useEffect(() => {
    if (user) {
      setProfileName(user.name || '')
    }
  }, [user])

  // Mutation for updating profile
  const updateProfileMutation = useMutation({
    mutationFn: async (data: { name: string }) => {
      const res = await apiService.put(ENDPOINTS.auth.updateProfile, data)
      return res.data
    },
    onSuccess: () => {
      notify.success('Perfil actualizado', 'Los cambios se han guardado correctamente')
      setIsEditing(false)
      refetchUser()
    },
    onError: () => {
      notify.error('Error', 'No se pudo actualizar el perfil')
    },
  })

  // Mutation for changing password
  const changePasswordMutation = useMutation({
    mutationFn: async (data: typeof passwords) => {
      const res = await apiService.post(ENDPOINTS.auth.changePassword, data)
      return res.data
    },
    onSuccess: () => {
      notify.success('Contraseña actualizada', 'Tu contraseña ha sido cambiada correctamente')
      setIsChangingPassword(false)
      setPasswords({
        current_password: '',
        new_password: '',
        new_password_confirmation: '',
      })
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'No se pudo cambiar la contraseña'
      notify.error('Error', message)
    },
  })

  const handleSaveProfile = () => {
    if (!profileName.trim()) {
      notify.error('Error', 'El nombre no puede estar vacío')
      return
    }
    updateProfileMutation.mutate({ name: profileName })
  }

  const handleChangePassword = () => {
    if (!passwords.current_password || !passwords.new_password || !passwords.new_password_confirmation) {
      notify.error('Error', 'Todos los campos son requeridos')
      return
    }
    if (passwords.new_password !== passwords.new_password_confirmation) {
      notify.error('Error', 'Las contraseñas no coinciden')
      return
    }
    if (passwords.new_password.length < 8) {
      notify.error('Error', 'La contraseña debe tener al menos 8 caracteres')
      return
    }
    changePasswordMutation.mutate(passwords)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Mi Perfil
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Columna izquierda - Avatar y estado */}
        <div className="space-y-4">
          <Card>
            <div className="text-center">
              <div className="relative inline-block">
                <div className="w-32 h-32 mx-auto bg-gradient-to-br from-primary-600 to-primary-700 rounded-full flex items-center justify-center">
                  <UserCircleIcon className="h-20 w-20 text-white" />
                </div>
                <button className="absolute bottom-0 right-0 p-2 bg-white dark:bg-gray-700 rounded-full shadow-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600">
                  <CameraIcon className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                </button>
              </div>
              <h2 className="mt-4 text-xl font-bold text-gray-900 dark:text-white">
                {user?.name || 'Usuario'}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {user?.email || ''}
              </p>
              {user?.roles && user.roles.length > 0 && (
                <div className="mt-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900/20 dark:text-primary-300">
                    {user.roles[0].name}
                  </span>
                </div>
              )}
            </div>
          </Card>

          <Card>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
              Estado de la cuenta
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Estado</span>
                <span className={`text-sm font-semibold ${user?.is_active ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                  {user?.is_active ? 'Activo' : 'Inactivo'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Cuenta confirmada</span>
                <span className={`text-sm font-semibold ${user?.account_confirmed ? 'text-green-600 dark:text-green-400' : 'text-yellow-600 dark:text-yellow-400'}`}>
                  {user?.account_confirmed ? 'Sí' : 'Pendiente'}
                </span>
              </div>
              {user?.roles && user.roles.length > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Roles</span>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">{user.roles.length}</span>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Columna central y derecha - Información */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                Información Personal
              </h3>
              <Button
                variant={isEditing ? 'secondary' : 'primary'}
                size="sm"
                onClick={() => isEditing ? setIsEditing(false) : setIsEditing(true)}
                disabled={updateProfileMutation.isPending}
              >
                {isEditing ? 'Cancelar' : 'Editar'}
              </Button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Nombre completo
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <UserCircleIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    disabled={!isEditing}
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    type="email"
                    value={user?.email || ''}
                    disabled
                    className="pl-10 bg-gray-50 dark:bg-gray-800 cursor-not-allowed"
                  />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  El email no puede ser modificado
                </p>
              </div>

              {isEditing && (
                <div className="flex gap-2 pt-2">
                  <Button 
                    onClick={handleSaveProfile} 
                    variant="primary"
                    disabled={updateProfileMutation.isPending}
                  >
                    {updateProfileMutation.isPending ? 'Guardando...' : 'Guardar cambios'}
                  </Button>
                  <Button 
                    onClick={() => {
                      setIsEditing(false)
                      setProfileName(user?.name || '')
                    }} 
                    variant="secondary"
                    disabled={updateProfileMutation.isPending}
                  >
                    Cancelar
                  </Button>
                </div>
              )}
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                Cambiar Contraseña
              </h3>
              {!isChangingPassword && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setIsChangingPassword(true)}
                >
                  Cambiar
                </Button>
              )}
            </div>
            
            {isChangingPassword ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Contraseña actual
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <KeyIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input
                      type="password"
                      value={passwords.current_password}
                      onChange={(e) => setPasswords({ ...passwords, current_password: e.target.value })}
                      className="pl-10"
                      placeholder="Ingresa tu contraseña actual"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Nueva contraseña
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <KeyIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input
                      type="password"
                      value={passwords.new_password}
                      onChange={(e) => setPasswords({ ...passwords, new_password: e.target.value })}
                      className="pl-10"
                      placeholder="Ingresa tu nueva contraseña"
                    />
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Mínimo 8 caracteres
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Confirmar nueva contraseña
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <KeyIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input
                      type="password"
                      value={passwords.new_password_confirmation}
                      onChange={(e) => setPasswords({ ...passwords, new_password_confirmation: e.target.value })}
                      className="pl-10"
                      placeholder="Confirma tu nueva contraseña"
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button 
                    onClick={handleChangePassword} 
                    variant="primary"
                    disabled={changePasswordMutation.isPending}
                  >
                    {changePasswordMutation.isPending ? 'Cambiando...' : 'Cambiar contraseña'}
                  </Button>
                  <Button 
                    onClick={() => {
                      setIsChangingPassword(false)
                      setPasswords({
                        current_password: '',
                        new_password: '',
                        new_password_confirmation: '',
                      })
                    }} 
                    variant="secondary"
                    disabled={changePasswordMutation.isPending}
                  >
                    Cancelar
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <button className="w-full flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg transition-colors text-left">
                  <div className="flex items-center gap-3">
                    <KeyIcon className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Contraseña</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">••••••••</p>
                    </div>
                  </div>
                </button>
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* Sección de Permisos - Ancho completo con 3 columnas */}
      {user?.accesses && user.accesses.length > 0 && (
        <Card>
          <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <ShieldCheckIcon className="h-5 w-5 text-primary-600 dark:text-primary-400" />
            Permisos de acceso ({user.accesses.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {(() => {
              // Agrupar permisos por módulo
              const groupedByModule = user.accesses.reduce((acc, access) => {
                const module = access.module || 'General'
                if (!acc[module]) acc[module] = []
                acc[module].push(access)
                return acc
              }, {} as Record<string, typeof user.accesses>)

              return Object.entries(groupedByModule).map(([module, accesses]) => (
                <div key={module} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                    <ShieldCheckIcon className="h-4 w-4 text-primary-600 dark:text-primary-400" />
                    {module}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {accesses.map((access) => (
                      <span
                        key={access.id}
                        className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border border-blue-200 dark:border-blue-800"
                        title={access.description || access.name}
                      >
                        {access.name || access.code}
                      </span>
                    ))}
                  </div>
                </div>
              ))
            })()}
          </div>
        </Card>
      )}
    </div>
  )
}
