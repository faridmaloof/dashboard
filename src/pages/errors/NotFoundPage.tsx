/**
 * Pagina 404 - No encontrado
 */

import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import {
  HomeIcon,
  ArrowLeftIcon,
} from '@heroicons/react/24/outline'

export function NotFoundPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        {/* Animated 404 */}
        <div className="relative mb-8">
          <div className="text-[180px] font-black text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-primary-400 leading-none select-none">
            404
          </div>
        </div>

        {/* Title */}
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Pagina no encontrada
        </h1>
        
        {/* Description */}
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
          Lo sentimos, la pagina que buscas no existe o ha sido movida.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            icon={<ArrowLeftIcon className="h-5 w-5" />}
            onClick={() => navigate(-1)}
            variant="secondary"
          >
            Volver atras
          </Button>
          
          <Button
            icon={<HomeIcon className="h-5 w-5" />}
            onClick={() => navigate('/')}
          >
            Ir al inicio
          </Button>
        </div>
      </div>
    </div>
  )
}

export default NotFoundPage
