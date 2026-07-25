import React from 'react';
import { Typography } from '../foundations/Typography';
import { Icon } from '../foundations/Icon';

export const DataTable = ({
  columns = [],
  data = [],
  loading = false,
  emptyState,
  className = ''
}) => {
  if (loading) {
    return <div className="p-8 text-center"><Icon name="Loader2" className="animate-spin inline mr-2" /> Loading data...</div>;
  }

  if (!data || data.length === 0) {
    return emptyState || <div className="p-8 text-center text-[var(--ds-color-text-muted)]">No records found.</div>;
  }

  return (
    <div className={`overflow-x-auto border border-[var(--ds-color-border-default)] rounded-[var(--ds-radius-lg)] ${className}`}>
      <table className="w-full text-left border-collapse min-w-max">
        <thead>
          <tr className="bg-[var(--ds-color-surface-muted)] border-b border-[var(--ds-color-border-default)]">
            {columns.map((col, i) => (
              <th key={i} className="px-4 py-3 text-[var(--ds-text-sm)] font-semibold text-[var(--ds-color-text-secondary)] whitespace-nowrap">
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-[var(--ds-color-surface-default)] divide-y divide-[var(--ds-color-border-default)]">
          {data.map((row, rowIndex) => (
            <tr key={rowIndex} className="hover:bg-[var(--ds-color-surface-muted)] transition-colors">
              {columns.map((col, colIndex) => (
                <td key={colIndex} className="px-4 py-3 text-[var(--ds-text-sm)] text-[var(--ds-color-text-primary)]">
                  {col.cell ? col.cell(row) : row[col.accessorKey]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
