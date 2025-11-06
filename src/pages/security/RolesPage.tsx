/**
 * Página de gestión de Roles
 */

import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import type { ColumnDef } from '@tanstack/react-table'
import { CrudTable } from '@/components/crud/CrudTable'
import { CrudActions } from '@/components/crud/CrudActions'
import { ENDPOINTS } from '@/config/api.config'
import { apiService } from '@/services/api.service'
import { notify } from '@/store/notificationStore'
import type { Role, LaravelPaginatedResponse } from '@/types'

export function RolesPage() {
  // Fetch roles
  const { data: response, isLoading } = useQuery({
    queryKey: ['roles'],
    queryFn: async () => {
      const res = await apiService.get<LaravelPaginatedResponse<Role>>(
        `${ENDPOINTS.roles.list}?per_page=15`
      )
      return res.data
    },
  })

  const roles = response?.data || []

  const columns: ColumnDef<Role>[] = useMemo(
    () => [
      {
        accessorKey: 'code',
        header: 'Código',
        enableSorting: true,
      },
      {
        accessorKey: 'name',
        header: 'Nombre',
        enableSorting: true,
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
        id: 'accesses',
        header: 'Accesos',
        cell: ({ row }) => {
          const accessCount = row.original.accesses?.length || 0
          return (
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {accessCount} {accessCount === 1 ? 'acceso' : 'accesos'}
            </span>
          )
        },
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

  const handleView = (role: Role) => {
    notify.info('Ver rol', `Viendo detalles de ${role.name}`)
  }

  const handleEdit = (role: Role) => {
    notify.info('Editar rol', `Editando ${role.name}`)
  }

  const handleDelete = (_id: string | number) => {
    if (confirm('¿Estás seguro de eliminar este rol?')) {
      notify.success('Rol eliminado', 'El rol ha sido eliminado correctamente')
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Roles
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Gestión de roles y permisos del sistema
          </p>
        </div>
      </div>

      <CrudTable<Role>
        data={roles}
        columns={columns}
        isLoading={isLoading}
        emptyMessage="No hay roles registrados"
      />
    </div>
  )
}
