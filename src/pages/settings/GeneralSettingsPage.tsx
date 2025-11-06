/**
 * Pagina de Configuracion General
 */

import { Card } from '@/components/ui/Card'

function GeneralSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Configuracion General
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Configuracion del sistema
        </p>
      </div>

      <Card>
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">
            Pagina en construccion
          </p>
        </div>
      </Card>
    </div>
  )
}

export default GeneralSettingsPage
