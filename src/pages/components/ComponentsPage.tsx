/**
 * Página de Componentes UI
 */

import { Card } from '@/components/ui/Card'

export default function ComponentsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Componentes UI
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Catálogo de componentes UI del sistema
        </p>
      </div>

      <Card>
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">
            Página en construcción
          </p>
        </div>
      </Card>
    </div>
  )
}
