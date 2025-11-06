/**
 * Pagina de gestion de Cajas Registradoras
 */

import { useState, useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { ColumnDef } from '@tanstack/react-table'
import { PlusIcon, MagnifyingGlassIcon, FunnelIcon, TrashIcon } from '@heroicons/react/24/outline'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { CrudTable } from '@/components/crud/CrudTable'
import { CrudActions } from '@/components/crud/CrudActions'
import { CrudPagination } from '@/components/crud/CrudPagination'
import { ENDPOINTS } from '@/config/api.config'
import { apiService } from '@/services/api.service'
import { notify } from '@/store/notificationStore'
import type { CashRegister, LaravelPaginatedResponse } from '@/types'

export function CashRegistersPage() {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(15)
  const [selectedRows, setSelectedRows] = useState<Set<string | number>>(new Set())
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [currentItem, setCurrentItem] = useState<CashRegister | null>(null)
  const [formData, setFormData] = useState<Partial<CashRegister>>({})

  const queryClient = useQueryClient()

  // React Query para obtener la lista
  const { data: response, isLoading } = useQuery({
    queryKey: ['cash-registers', page, perPage, search],
    queryFn: async () => {
      // Usar getInstance para obtener el axios directo
      const axiosInstance = apiService.getInstance()
      const res = await axiosInstance.get<LaravelPaginatedResponse<CashRegister>>(
        `${ENDPOINTS.cashRegisters.list}?page=${page}&per_page=${perPage}${search ? `&search=${search}` : ''}`
      )
      
      // Devolver res.data directamente que es la paginación de Laravel
      return res.data
    },
  })

  const cashRegisters = response?.data || []
  const total = response?.total || 0
  const totalPages = response?.last_page || 1

  // Create mutation
  const createMutation = useMutation({
    mutationFn: async (data: Partial<CashRegister>) => {
      const res = await apiService.post(ENDPOINTS.cashRegisters.create, data)
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cash-registers'] })
      notify.success('Caja creada', 'La caja registradora ha sido creada correctamente')
      setIsCreateModalOpen(false)
      setFormData({})
    },
    onError: (error: any) => {
      notify.error('Error', error.response?.data?.message || 'Error al crear la caja registradora')
    },
  })

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string | number; data: Partial<CashRegister> }) => {
      const res = await apiService.put(`${ENDPOINTS.cashRegisters.update}/${id}`, data)
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cash-registers'] })
      notify.success('Caja actualizada', 'Los cambios se han guardado correctamente')
      setIsEditModalOpen(false)
      setCurrentItem(null)
      setFormData({})
    },
    onError: (error: any) => {
      notify.error('Error', error.response?.data?.message || 'Error al actualizar la caja registradora')
    },
  })

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string | number) => {
      await apiService.delete(`${ENDPOINTS.cashRegisters.delete}/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cash-registers'] })
      notify.success('Caja eliminada', 'La caja registradora ha sido eliminada')
    },
    onError: (error: any) => {
      notify.error('Error', error.response?.data?.message || 'Error al eliminar la caja registradora')
    },
  })

  // Toggle active mutation
  const toggleActiveMutation = useMutation({
    mutationFn: async (id: string | number) => {
      const res = await apiService.patch(`${ENDPOINTS.cashRegisters.toggleActive}/${id}`)
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cash-registers'] })
      notify.success('Estado actualizado', 'El estado de la caja ha sido actualizado')
    },
    onError: (error: any) => {
      notify.error('Error', error.response?.data?.message || 'Error al actualizar el estado')
    },
  })

  const columns: ColumnDef<CashRegister>[] = useMemo(
    () => [
      {
        accessorKey: 'code',
        header: 'Codigo',
        enableSorting: true,
      },
      {
        accessorKey: 'name',
        header: 'Nombre',
        enableSorting: true,
      },
      {
        accessorKey: 'location',
        header: 'Ubicacion',
        enableSorting: true,
      },
      {
        accessorKey: 'opening_balance',
        header: 'Saldo Inicial',
        enableSorting: true,
        cell: ({ row }) => {
          const amount = row.original.opening_balance || 0
          return `$${amount.toLocaleString('es-CO', { minimumFractionDigits: 2 })}`
        },
      },
      {
        accessorKey: 'is_active',
        header: 'Estado',
        enableSorting: true,
        cell: ({ row }) => (
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            row.original.is_active ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
          }`}>
            {row.original.is_active ? 'Activa' : 'Inactiva'}
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
            onDelete={row.original.id ? () => handleDelete(row.original.id!) : undefined}
            onToggleActive={row.original.id ? () => handleToggleActive(row.original.id!) : undefined}
          />
        ),
      },
    ],
    []
  )

  const handleView = (item: CashRegister) => {
    setCurrentItem(item)
    setIsViewModalOpen(true)
  }

  const handleEdit = (item: CashRegister) => {
    setCurrentItem(item)
    setFormData(item)
    setIsEditModalOpen(true)
  }

  const handleDelete = (id: string | number) => {
    if (confirm('Estas seguro de eliminar esta caja registradora?')) {
      deleteMutation.mutate(id)
    }
  }

  const handleToggleActive = (id: string | number) => {
    toggleActiveMutation.mutate(id)
  }

  const handleCreate = () => {
    createMutation.mutate(formData)
  }

  const handleUpdate = () => {
    if (currentItem?.id) {
      updateMutation.mutate({ id: currentItem.id, data: formData })
    }
  }

  const handleBulkDelete = () => {
    if (selectedRows.size === 0) return
    
    if (confirm(`Estas seguro de eliminar ${selectedRows.size} cajas registradoras?`)) {
      notify.success('Cajas eliminadas', `${selectedRows.size} cajas registradoras eliminadas`)
      setSelectedRows(new Set())
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Cajas Registradoras
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Gestiona las cajas registradoras del sistema
          </p>
        </div>
        <Button icon={<PlusIcon className="h-5 w-5" />} onClick={() => setIsCreateModalOpen(true)}>
          Crear Caja
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Buscar cajas registradoras..."
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
          data={cashRegisters}
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

      {/* Create Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false)
          setFormData({})
        }}
        title="Crear Caja Registradora"
        size="lg"
      >
        <div className="space-y-4">
          <Input
            label="Codigo"
            placeholder="CAJA01"
            value={formData.code || ''}
            onChange={(e) => setFormData({ ...formData, code: e.target.value })}
            required
          />
          <Input
            label="Nombre"
            placeholder="Caja Principal"
            value={formData.name || ''}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <Input
            label="Ubicacion"
            placeholder="Mostrador Principal"
            value={formData.location || ''}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          />
          <Input
            label="Saldo Inicial"
            type="number"
            step="0.01"
            placeholder="0.00"
            value={formData.opening_balance || ''}
            onChange={(e) => setFormData({ ...formData, opening_balance: parseFloat(e.target.value) })}
          />
          <Input
            label="Descripcion"
            placeholder="Descripcion de la caja"
            value={formData.description || ''}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </div>
        <div className="flex justify-end gap-2 mt-6">
          <Button variant="secondary" onClick={() => setIsCreateModalOpen(false)}>
            Cancelar
          </Button>
          <Button 
            onClick={handleCreate}
            disabled={createMutation.isPending}
          >
            {createMutation.isPending ? 'Creando...' : 'Crear'}
          </Button>
        </div>
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false)
          setCurrentItem(null)
          setFormData({})
        }}
        title="Editar Caja Registradora"
        size="lg"
      >
        <div className="space-y-4">
          <Input
            label="Codigo"
            placeholder="CAJA01"
            value={formData.code || ''}
            onChange={(e) => setFormData({ ...formData, code: e.target.value })}
            required
          />
          <Input
            label="Nombre"
            placeholder="Caja Principal"
            value={formData.name || ''}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <Input
            label="Ubicacion"
            placeholder="Mostrador Principal"
            value={formData.location || ''}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          />
          <Input
            label="Saldo Inicial"
            type="number"
            step="0.01"
            placeholder="0.00"
            value={formData.opening_balance || ''}
            onChange={(e) => setFormData({ ...formData, opening_balance: parseFloat(e.target.value) })}
          />
          <Input
            label="Descripcion"
            placeholder="Descripcion de la caja"
            value={formData.description || ''}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </div>
        <div className="flex justify-end gap-2 mt-6">
          <Button variant="secondary" onClick={() => setIsEditModalOpen(false)}>
            Cancelar
          </Button>
          <Button 
            onClick={handleUpdate}
            disabled={updateMutation.isPending}
          >
            {updateMutation.isPending ? 'Guardando...' : 'Guardar'}
          </Button>
        </div>
      </Modal>

      {/* View Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false)
          setCurrentItem(null)
        }}
        title="Detalle de Caja Registradora"
        size="lg"
      >
        {currentItem && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Codigo
                </label>
                <p className="text-gray-900 dark:text-white">{currentItem.code}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Nombre
                </label>
                <p className="text-gray-900 dark:text-white">{currentItem.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Ubicacion
                </label>
                <p className="text-gray-900 dark:text-white">{currentItem.location || 'N/A'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Saldo Inicial
                </label>
                <p className="text-gray-900 dark:text-white">
                  ${(currentItem.opening_balance || 0).toLocaleString('es-CO', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Estado
                </label>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  currentItem.is_active ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
                }`}>
                  {currentItem.is_active ? 'Activa' : 'Inactiva'}
                </span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Fecha de Creacion
                </label>
                <p className="text-gray-900 dark:text-white">
                  {currentItem.created_at ? new Date(currentItem.created_at).toLocaleDateString('es-CO') : 'N/A'}
                </p>
              </div>
            </div>
            {currentItem.description && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Descripcion
                </label>
                <p className="text-gray-900 dark:text-white">{currentItem.description}</p>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  )
}
