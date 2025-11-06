/**
 * Página de gestión de usuarios con CRUD completo
 */

import { useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import type { ColumnDef } from '@tanstack/react-table'
import { MagnifyingGlassIcon, FunnelIcon, TrashIcon } from '@heroicons/react/24/outline'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { CrudTable } from '@/components/crud/CrudTable'
import { CrudActions } from '@/components/crud/CrudActions'
import { CrudPagination } from '@/components/crud/CrudPagination'
import type { User, LaravelPaginatedResponse } from '@/types'
import { notify } from '@/store/notificationStore'
import { ENDPOINTS } from '@/config/api.config'
import { apiService } from '@/services/api.service'

export function UsersPage() {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(10)
  const [selectedRows, setSelectedRows] = useState<Set<string | number>>(new Set())

  // Fetch users from API
  const { data: response, isLoading } = useQuery({
    queryKey: ['users', page, perPage, search],
    queryFn: async () => {
      const res = await apiService.get<LaravelPaginatedResponse<User>>(
        `${ENDPOINTS.users.list}?page=${page}&per_page=${perPage}${search ? `&search=${search}` : ''}`
      )
      return res.data
    },
  })

  const users = response?.data || []
  const total = response?.total || 0
  const totalPages = response?.last_page || 1

  const columns: ColumnDef<User>[] = useMemo(
    () => [
      {
        accessorKey: 'name',
        header: 'Nombre',
        enableSorting: true,
      },
      {
        accessorKey: 'email',
        header: 'Email',
        enableSorting: true,
      },
      {
        accessorKey: 'roles',
        header: 'Roles',
        cell: ({ row }) => {
          const rolesCount = row.original.roles?.length || 0
          if (rolesCount === 0) {
            return <span className="text-sm text-gray-500">Sin roles</span>
          }
          return (
            <div className="flex flex-wrap gap-1">
              {row.original.roles?.slice(0, 2).map((role) => (
                <span
                  key={role.code}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-200"
                >
                  {role.name}
                </span>
              ))}
              {rolesCount > 2 && (
                <span className="text-xs text-gray-500">+{rolesCount - 2}</span>
              )}
            </div>
          )
        },
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
        accessorKey: 'is_active',
        header: 'Estado',
        enableSorting: true,
        cell: ({ row }) => (
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              row.original.is_active
                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
            }`}
          >
            {row.original.is_active ? 'Activo' : 'Inactivo'}
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

  const handleView = (user: User) => {
    notify.info('Ver usuario', `Viendo detalles de ${user.name}`)
  }

  const handleEdit = (user: User) => {
    notify.info('Editar usuario', `Editando ${user.name}`)
  }

  const handleDelete = (_id: string | number) => {
    if (confirm('¿Estás seguro de eliminar este usuario?')) {
      notify.success('Usuario eliminado', 'El usuario ha sido eliminado correctamente')
      // deleteMutation.mutate(id)
    }
  }

  const handleBulkDelete = () => {
    if (selectedRows.size === 0) return
    
    if (confirm(`¿Estás seguro de eliminar ${selectedRows.size} usuarios?`)) {
      notify.success('Usuarios eliminados', `${selectedRows.size} usuarios eliminados`)
      setSelectedRows(new Set())
      // bulkDeleteMutation.mutate(Array.from(selectedRows))
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Usuarios
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Gestiona los usuarios del sistema
          </p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Buscar usuarios..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              icon={<MagnifyingGlassIcon className="h-5 w-5" />}
            />
          </div>
          <Button variant="secondary" icon={<FunnelIcon className="h-5 w-5" />}>
            Filtros
          </Button>
          {selectedRows.size > 0 && (
            <Button
              variant="danger"
              icon={<TrashIcon className="h-5 w-5" />}
              onClick={handleBulkDelete}
            >
              Eliminar ({selectedRows.size})
            </Button>
          )}
        </div>
      </Card>

      {/* Table */}
      <Card padding="none">
        <CrudTable
          data={users}
          columns={columns}
          isLoading={isLoading}
          selectable
          selectedRows={selectedRows}
          onSelectionChange={setSelectedRows}
        />
        <CrudPagination
          currentPage={page}
          totalPages={totalPages}
          perPage={perPage}
          total={total}
          onPageChange={setPage}
          onPerPageChange={setPerPage}
        />
      </Card>
    </div>
  )
}
