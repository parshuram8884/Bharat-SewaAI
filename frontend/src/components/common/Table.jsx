import React, { useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  flexRender
} from '@tanstack/react-table';
import { ArrowUpDown, ChevronLeft, ChevronRight, Search, Inbox } from 'lucide-react';
import { Input } from './Input';
import { Select } from './Select';

export function Table({
  data = [],
  columns = [],
  searchable = true,
  searchPlaceholder = 'Search records...',
  pageSize = 10,
  onRowClick,
  emptyMessage = 'No records found matching your criteria.'
}) {
  const [sorting, setSorting] = useState([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      globalFilter,
      rowSelection
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: pageSize
      }
    }
  });

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Search & Filter Bar */}
      {searchable && (
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="max-w-sm w-full">
            <Input
              icon={Search}
              placeholder={searchPlaceholder}
              value={globalFilter ?? ''}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="bg-surface-container-lowest"
            />
          </div>
          <div className="text-sm text-on-surface-variant font-medium">
            Showing <span className="text-on-surface font-bold">{table.getRowModel().rows.length}</span> of{' '}
            <span className="text-on-surface font-bold">{data.length}</span> entries
          </div>
        </div>
      )}

      {/* Table Container */}
      <div className="w-full overflow-x-auto rounded-xl border border-outline-variant/60 bg-surface-container-lowest shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="border-b border-outline-variant/60 bg-surface-container-low/60 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                {headerGroup.headers.map((header) => {
                  const canSort = header.column.getCanSort();
                  return (
                    <th
                      key={header.id}
                      onClick={canSort ? header.column.getToggleSortingHandler() : undefined}
                      className={`px-6 py-3.5 select-none ${canSort ? 'cursor-pointer hover:bg-surface-container/60 transition-colors' : ''}`}
                    >
                      <div className="flex items-center gap-1.5">
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {canSort && (
                          <ArrowUpDown className={`w-3.5 h-3.5 transition-transform ${header.column.getIsSorted() ? 'text-primary font-bold' : 'opacity-40'}`} />
                        )}
                      </div>
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-outline-variant/30 text-sm text-on-surface">
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  onClick={onRowClick ? () => onRowClick(row.original) : undefined}
                  className={`hover:bg-surface-container-low/80 transition-colors ${onRowClick ? 'cursor-pointer' : ''} ${row.getIsSelected() ? 'bg-primary-fixed/30' : ''}`}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-6 py-4 whitespace-nowrap">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="px-6 py-12 text-center text-on-surface-variant">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Inbox className="w-10 h-10 text-outline opacity-50" />
                    <p className="font-medium text-base text-on-surface">{emptyMessage}</p>
                    <p className="text-xs">Try adjusting your search query or filters.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {table.getPageCount() > 1 && (
        <div className="flex items-center justify-between gap-4 flex-wrap pt-2">
          <div className="flex items-center gap-2 text-sm text-on-surface-variant">
            <span>Rows per page:</span>
            <select
              value={table.getState().pagination.pageSize}
              onChange={(e) => table.setPageSize(Number(e.target.value))}
              className="rounded border border-outline-variant bg-surface px-2 py-1 text-xs font-semibold text-on-surface cursor-pointer focus:outline-none"
            >
              {[5, 10, 20, 50].map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm text-on-surface font-medium">
              Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                className="p-1.5 rounded-lg border border-outline-variant bg-surface-container-lowest hover:bg-surface-container disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer"
                aria-label="Previous page"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                className="p-1.5 rounded-lg border border-outline-variant bg-surface-container-lowest hover:bg-surface-container disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer"
                aria-label="Next page"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Table;
