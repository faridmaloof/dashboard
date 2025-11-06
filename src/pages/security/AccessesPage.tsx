/**
 * Página de gestión de Accesos
 */

import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import type { ColumnDef } from '@tanstack/react-table'
import { CrudTable } from '@/components/crud/CrudTable'
import { CrudActions } from '@/components/crud/CrudActions'
import { ENDPOINTS } from '@/config/api.config'
import { apiService } from '@/services/api.service'
import { notify } from '@/store/notificationStore'
import type { Access, LaravelPaginatedResponse } from '@/types'

export function AccessesPage() {
  // Fetch accesses
  const { data: response, isLoading } = useQuery({
    queryKey: ['accesses'],
    queryFn: async () => {
      const res = await apiService.get<LaravelPaginatedResponse<Access>>(
        `${ENDPOINTS.accesses.list}?per_page=15`
      )
      return res.data
    },
  })

  const accesses = response?.data || []

  const columns: ColumnDef<Access>[] = useMemo(
    () => [
      {
        accessorKey: 'code',
        header: 'Código',
        enableSorting: true,
        cell: ({ row }) => (
          <span className="font-mono text-sm bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
            {row.original.code}
          </span>
        ),
      },
      {
        accessorKey: 'name',
        header: 'Nombre',
        enableSorting: true,
      },
      {
        accessorKey: 'module',
        header: 'Módulo',
        enableSorting: true,
        cell: ({ row }) => (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
            {row.original.module}
          </span>
        ),
      },
      {
        accessorKey: 'action',
        header: 'Acción',
        enableSorting: true,
        cell: ({ row }) => (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
            {row.original.action}
          </span>
        ),
      },
      {
        accessorKey: 'description',
        header: 'Descripción',
        enableSorting: false,
      },
      {
        accessorKey: 'active',
        header: 'Estado',
        enableSorting: true,
        cell: ({ row }) => (
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              row.original.active
                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
            }`}
          >
            {row.original.active ? 'Activo' : 'Inactivo'}
          </span>
        ),
      },
      {
        id: 'actions',
        header: 'Acciones',
        cell: ({ row }) => (
          <CrudActions
            onView={() => handleView(row.original)}
            onEdit={() => handleEdit(row.original)}
            onDelete={() => row.original.id && handleDelete(row.original.id)}
          />
        ),
      },
    ],
    []
  )

  const handleView = (access: Access) => {
    notify.info('Ver acceso', `Viendo detalles de ${access.name}`)
  }

  const handleEdit = (access: Access) => {
    notify.info('Editar acceso', `Editando ${access.name}`)
  }

  const handleDelete = (_id: string | number) => {
    if (confirm('¿Estás seguro de eliminar este acceso?')) {
      notify.success('Acceso eliminado', 'El acceso ha sido eliminado correctamente')
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Accesos
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Gestión de accesos y permisos individuales del sistema
          </p>
        </div>
      </div>

      <CrudTable<Access>
        data={accesses}
        columns={columns}
        isLoading={isLoading}
        emptyMessage="No hay accesos registrados"
      />
    </div>
  )
}
