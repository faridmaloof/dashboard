/**
 * Página de gestión de Clientes
 */

import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import type { ColumnDef } from '@tanstack/react-table'
import { CrudTable } from '@/components/crud/CrudTable'
import { CrudActions } from '@/components/crud/CrudActions'
import { ENDPOINTS } from '@/config/api.config'
import { apiService } from '@/services/api.service'
import { notify } from '@/store/notificationStore'
import type { Customer, LaravelPaginatedResponse } from '@/types'

export function CustomersPage() {
  // Fetch customers
  const { data: response, isLoading } = useQuery({
    queryKey: ['customers'],
    queryFn: async () => {
      const res = await apiService.get<LaravelPaginatedResponse<Customer>>(
        `${ENDPOINTS.customers.list}?per_page=100`
      )
      return res.data
    },
  })

  const customers = response?.data || []

  const columns: ColumnDef<Customer>[] = useMemo(
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
        accessorKey: 'document_number',
        header: 'Documento',
        enableSorting: true,
      },
      {
        accessorKey: 'email',
        header: 'Email',
        enableSorting: true,
      },
      {
        accessorKey: 'phone',
        header: 'Teléfono',
        enableSorting: true,
      },
      {
        accessorKey: 'is_active',
        header: 'Estado',
        enableSorting: true,
        cell: ({ row }) => (
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            row.original.is_active ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
          }`}>
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
            onDelete={() => handleDelete(row.original.id)}
          />
        ),
      },
    ],
    []
  )

  const handleView = (customer: Customer) => {
    notify.info('Ver cliente', `Viendo detalles de ${customer.name}`)
  }

  const handleEdit = (customer: Customer) => {
    notify.info('Editar cliente', `Editando ${customer.name}`)
  }

  const handleDelete = (_id: string | number) => {
    if (confirm('¿Estás seguro de eliminar este cliente?')) {
      notify.success('Cliente eliminado', 'El cliente ha sido eliminado correctamente')
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Clientes
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Gestión de clientes del sistema
          </p>
        </div>
      </div>

      <CrudTable<Customer>
        data={customers}
        columns={columns}
        isLoading={isLoading}
        emptyMessage="No hay clientes registrados"
      />
    </div>
  )
}
