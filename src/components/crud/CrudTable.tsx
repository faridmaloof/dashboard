/**
 * Componente CrudTable - Tabla reutilizable con TanStack Table
 */

import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
} from '@tanstack/react-table'
import { useState } from 'react'
import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/24/outline'
import clsx from 'clsx'
import { TableSkeleton } from '../ui/Loading'

interface CrudTableProps<TData> {
  data: TData[]
  columns: ColumnDef<TData, any>[]
  isLoading?: boolean
  emptyMessage?: string
  selectable?: boolean
  selectedRows?: Set<string | number>
  onSelectionChange?: (selected: Set<string | number>) => void
}

export function CrudTable<TData extends { id?: string | number }>({
  data,
  columns,
  isLoading = false,
  emptyMessage = 'No hay datos disponibles',
  selectable = false,
  selectedRows = new Set(),
  onSelectionChange,
}: CrudTableProps<TData>) {
  const [sorting, setSorting] = useState<SortingState>([])

  // Agregar columna de selección si es necesario
  const finalColumns = selectable
    ? [
        {
          id: 'select',
          header: ({ table }: any) => (
            <input
              type="checkbox"
              className="rounded border-gray-300 dark:border-gray-600 text-primary-600 focus:ring-primary-500"
              checked={table.getIsAllRowsSelected()}
              onChange={table.getToggleAllRowsSelectedHandler()}
            />
          ),
          cell: ({ row }: any) => (
            <input
              type="checkbox"
              className="rounded border-gray-300 dark:border-gray-600 text-primary-600 focus:ring-primary-500"
              checked={selectedRows.has(row.original.id)}
              onChange={() => {
                const newSelected = new Set(selectedRows)
                if (newSelected.has(row.original.id)) {
                  newSelected.delete(row.original.id)
                } else {
                  newSelected.add(row.original.id)
                }
                onSelectionChange?.(newSelected)
              }}
            />
          ),
          size: 50,
        },
        ...columns,
      ]
    : columns

  const table = useReactTable({
    data,
    columns: finalColumns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  if (isLoading) {
    return (
      <div className="p-4">
        <TableSkeleton rows={5} columns={finalColumns.length} />
      </div>
    )
  }

  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4">
        <p className="text-gray-500 dark:text-gray-400 text-sm">{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-800/50">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className={clsx(
                    'px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider',
                    header.column.getCanSort() && 'cursor-pointer select-none hover:bg-gray-100 dark:hover:bg-gray-700/50'
                  )}
                  onClick={header.column.getToggleSortingHandler()}
                >
                  <div className="flex items-center gap-2">
                    {flexRender(header.column.columnDef.header, header.getContext())}
                    {header.column.getCanSort() && (
                      <span className="flex flex-col">
                        {header.column.getIsSorted() === 'asc' ? (
                          <ChevronUpIcon className="h-4 w-4" />
                        ) : header.column.getIsSorted() === 'desc' ? (
                          <ChevronDownIcon className="h-4 w-4" />
                        ) : (
                          <span className="text-gray-300 dark:text-gray-600">
                            <ChevronUpIcon className="h-3 w-3" />
                          </span>
                        )}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          {table.getRowModel().rows.map((row) => (
            <tr
              key={row.id}
              className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
            >
              {row.getVisibleCells().map((cell) => (
                <td
                  key={cell.id}
                  className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100"
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
