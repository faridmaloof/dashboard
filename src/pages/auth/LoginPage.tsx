/**
 * Página de Login con diseño mejorado
 */

import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { 
  UserIcon, 
  LockClosedIcon, 
  EyeIcon, 
  EyeSlashIcon,
  ArrowRightIcon,
  SparklesIcon
} from '@heroicons/react/24/outline'
import clsx from 'clsx'

export function LoginPage() {
  // useAuth.navigate performs navigation on success
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    remember: false
  })
  const { loginAsync, isLoggingIn, loginError } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const credentials = { email: formData.email, password: formData.password }
    try {
      // login puede ser síncrono o async
      await loginAsync(credentials as any)
    } catch (err) {
      // el hook maneja el error en loginError
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  return (
    <div className="min-h-screen flex">
      {/* Left side - Login form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
        <div className="max-w-md w-full space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          {/* Logo and branding */}
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div>
                <div className="relative w-20 h-20 bg-gradient-to-br from-primary-600 via-primary-600 to-primary-700 rounded-2xl flex items-center justify-center shadow-2xl shadow-primary-600/30 ring-4 ring-primary-200 dark:ring-primary-900/50 transform group-hover:scale-105 transition-all duration-300">
                  <span className="text-white font-black text-4xl">F</span>
                </div>
              </div>
            </div>
            
            <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-2 tracking-tight">
              FaruTech
            </h1>
            <p className="text-lg font-semibold text-primary-600 dark:text-primary-400 mb-1 flex items-center justify-center gap-2">
              <SparklesIcon className="h-5 w-5" />
              Admin Panel
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
              Gestiona tu negocio de manera eficiente con nuestra plataforma integral de administración
            </p>
          </div>

          {/* Login form */}
          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div className="space-y-4">
              {/* Email input */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Correo electrónico
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <UserIcon className="h-5 w-5 text-gray-400 group-focus-within:text-primary-600 transition-colors duration-200" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-all duration-200 group"
                    placeholder="tu@email.com"
                  />
                </div>
              </div>

              {/* Password input */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Contraseña
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <LockClosedIcon className="h-5 w-5 text-gray-400 group-focus-within:text-primary-600 transition-colors duration-200" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-12 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-all duration-200"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="h-5 w-5" />
                    ) : (
                      <EyeIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Remember me & Forgot password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember"
                  name="remember"
                  type="checkbox"
                  checked={formData.remember}
                  onChange={handleChange}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded cursor-pointer"
                />
                <label htmlFor="remember" className="ml-2 block text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
                  Recordarme
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-primary-600 dark:text-primary-400 hover:text-primary-500 dark:hover:text-primary-300 transition-colors duration-200">
                  ¿Olvidaste tu contraseña?
                </a>
              </div>
            </div>

            {/* Submit button */}
            <div>
              <button
                type="submit"
                disabled={isLoggingIn}
                className={clsx(
                  'group relative w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent text-base font-semibold rounded-xl text-white transition-all duration-300',
                  isLoggingIn
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 shadow-lg hover:shadow-xl hover:shadow-primary-600/30 transform hover:-translate-y-0.5'
                )}
              >
                {isLoggingIn ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Iniciando sesión...
                  </>
                ) : (
                  <>
                    Iniciar sesión
                    <ArrowRightIcon className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
                  </>
                )}
              </button>
            </div>

            {/* Mostrar errores del login */}
            {loginError && (
              <div className="mt-4 p-3 bg-red-50 text-red-700 border border-red-200 rounded">
                { (loginError as any)?.message || 'Error al iniciar sesión' }
              </div>
            )}

            {/* Demo credentials */}
            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
              <p className="text-sm text-blue-800 dark:text-blue-300 font-medium mb-2">
                🔐 Credenciales de prueba:
              </p>
              <p className="text-xs text-blue-700 dark:text-blue-400 font-mono">
                Email: demo@farutech.com<br />
                Password: demo123
              </p>
            </div>
          </form>

          {/* Footer */}
          <div className="text-center text-sm text-gray-500 dark:text-gray-400 mt-8">
            <p>© 2025 FaruTech. Todos los derechos reservados.</p>
          </div>
        </div>
      </div>

      {/* Right side - Visual */}
      <div className="hidden lg:flex lg:flex-1 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 relative overflow-hidden">
        {/* Animated background patterns */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-96 h-96 bg-primary-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-primary-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center p-12 text-white">
          <div className="max-w-md space-y-8 text-center">
            <div className="space-y-4">
              <h2 className="text-5xl font-black tracking-tight">
                Bienvenido de vuelta
              </h2>
              <p className="text-xl text-primary-100">
                Accede a tu panel de administración y gestiona tu negocio de manera inteligente
              </p>
            </div>

            <div className="grid grid-cols-2 gap-6 mt-12">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
                <div className="text-4xl font-bold mb-2">500+</div>
                <div className="text-sm text-primary-100">Empresas confían en nosotros</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
                <div className="text-4xl font-bold mb-2">99.9%</div>
                <div className="text-sm text-primary-100">Uptime garantizado</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
                <div className="text-4xl font-bold mb-2">24/7</div>
                <div className="text-sm text-primary-100">Soporte técnico</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
                <div className="text-4xl font-bold mb-2">⚡</div>
                <div className="text-sm text-primary-100">Super rápido</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
