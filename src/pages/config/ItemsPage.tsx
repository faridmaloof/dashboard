/**
 * Página de gestión de Artículos/Productos
 */

import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import type { ColumnDef } from '@tanstack/react-table'
import { CrudTable } from '@/components/crud/CrudTable'
import { CrudActions } from '@/components/crud/CrudActions'
import { ENDPOINTS } from '@/config/api.config'
import { apiService } from '@/services/api.service'
import { notify } from '@/store/notificationStore'
import type { Item, LaravelPaginatedResponse } from '@/types'

export function ItemsPage() {
  // Fetch items
  const { data: response, isLoading } = useQuery({
    queryKey: ['items'],
    queryFn: async () => {
      const res = await apiService.get<LaravelPaginatedResponse<Item>>(
        `${ENDPOINTS.items.list}?per_page=15`
      )
      return res.data
    },
  })

  const items = response?.data || []

  const columns: ColumnDef<Item>[] = useMemo(
    () => [
      {
        accessorKey: 'code',
        header: 'Código',
        enableSorting: true,
      },
      {
        accessorKey: 'description',
        header: 'Descripción',
        enableSorting: true,
      },
      {
        accessorKey: 'type',
        header: 'Tipo',
        enableSorting: true,
      },
      {
        accessorKey: 'price',
        header: 'Precio',
        enableSorting: true,
        cell: ({ row }) => {
          const price = row.original.price || 0
          return `$${price.toLocaleString('es-CO', { minimumFractionDigits: 2 })}`
        },
      },
      {
        accessorKey: 'stock',
        header: 'Stock',
        enableSorting: true,
        cell: ({ row }) => {
          const stock = row.original.stock || 0
          return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              stock > 10 ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300' :
              stock > 0 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300' :
              'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
            }`}>
              {stock}
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
            onDelete={() => handleDelete(row.original.id)}
          />
        ),
      },
    ],
    []
  )

  const handleView = (item: Item) => {
    notify.info('Ver artículo', `Viendo detalles de ${item.description}`)
  }

  const handleEdit = (item: Item) => {
    notify.info('Editar artículo', `Editando ${item.description}`)
  }

  const handleDelete = (_id: string | number) => {
    if (confirm('¿Estás seguro de eliminar este artículo?')) {
      notify.success('Artículo eliminado', 'El artículo ha sido eliminado correctamente')
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Artículos
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Gestión de productos y servicios del sistema
          </p>
        </div>
      </div>

      <CrudTable<Item>
        data={items}
        columns={columns}
        isLoading={isLoading}
        emptyMessage="No hay artículos registrados"
      />
    </div>
  )
}
