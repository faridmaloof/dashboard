/**
 * Página de gestión de Tipos de Documento
 */

import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import type { ColumnDef } from '@tanstack/react-table'
import { CrudTable } from '@/components/crud/CrudTable'
import { CrudActions } from '@/components/crud/CrudActions'
import { ENDPOINTS } from '@/config/api.config'
import { apiService } from '@/services/api.service'
import { notify } from '@/store/notificationStore'
import type { DocumentType, LaravelPaginatedResponse } from '@/types'

export function DocumentTypesPage() {
  // Fetch document types
  const { data: response, isLoading } = useQuery({
    queryKey: ['document-types'],
    queryFn: async () => {
      const res = await apiService.get<LaravelPaginatedResponse<DocumentType>>(
        `${ENDPOINTS.documentTypes.list}?per_page=15`
      )
      return res.data
    },
  })

  const documentTypes = response?.data || []

  const columns: ColumnDef<DocumentType>[] = useMemo(
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
        accessorKey: 'category',
        header: 'Categoría',
        enableSorting: true,
      },
      {
        accessorKey: 'prefix',
        header: 'Prefijo',
        enableSorting: true,
      },
      {
        accessorKey: 'current_number',
        header: 'Consecutivo Actual',
        enableSorting: true,
      },
      {
        accessorKey: 'requires_approval',
        header: 'Requiere Aprobación',
        enableSorting: true,
        cell: ({ row }) => (
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            row.original.requires_approval ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300' : 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300'
          }`}>
            {row.original.requires_approval ? 'Sí' : 'No'}
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

  const handleView = (docType: DocumentType) => {
    notify.info('Ver tipo de documento', `Viendo detalles de ${docType.name}`)
  }

  const handleEdit = (docType: DocumentType) => {
    notify.info('Editar tipo de documento', `Editando ${docType.name}`)
  }

  const handleDelete = (_id: string | number) => {
    if (confirm('¿Estás seguro de eliminar este tipo de documento?')) {
      notify.success('Tipo de documento eliminado', 'El tipo de documento ha sido eliminado correctamente')
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Tipos de Documento
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Gestión de tipos de documento del sistema
          </p>
        </div>
      </div>

      <CrudTable<DocumentType>
        data={documentTypes}
        columns={columns}
        isLoading={isLoading}
        emptyMessage="No hay tipos de documento registrados"
      />
    </div>
  )
}
