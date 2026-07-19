import { useState } from 'react';
import { MoreHorizontal, Edit, Trash2, ChevronUp, ChevronDown } from 'lucide-react';

export function DataTable({ 
  columns, 
  data, 
  onEdit, 
  onDelete, 
  keyField = '_id',
  isLoading = false 
}) {
  const [sortConfig, setSortConfig] = useState(null);

  const sortedData = [...data].sort((a, b) => {
    if (!sortConfig) return 0;
    const { key, direction } = sortConfig;
    if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
    if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
    return 0;
  });

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  if (isLoading) {
    return (
      <div className="w-full bg-surface rounded-2xl border border-border overflow-hidden">
        <div className="p-4 space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex gap-4 animate-pulse">
              <div className="h-10 bg-surface-alt rounded-lg flex-1" />
              <div className="h-10 bg-surface-alt rounded-lg flex-1" />
              <div className="h-10 bg-surface-alt rounded-lg w-24" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="w-full py-16 flex flex-col items-center justify-center bg-surface rounded-2xl border border-border">
        <div className="w-14 h-14 rounded-2xl bg-surface-alt flex items-center justify-center mb-4">
          <MoreHorizontal className="w-6 h-6 text-text-disabled" />
        </div>
        <p className="text-text-secondary text-lg font-medium">No records found.</p>
        <p className="text-text-disabled text-sm mt-1">Create your first entry to get started.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto bg-surface rounded-2xl border border-border">
      <table className="w-full text-left text-sm text-text-primary">
        <thead className="bg-surface-alt/70 border-b border-border uppercase text-xs text-text-secondary">
          <tr>
            {columns.map((col) => (
              <th 
                key={col.key} 
                className={`px-6 py-4 font-medium ${col.sortable !== false ? 'cursor-pointer hover:bg-surface-alt transition-colors' : ''}`}
                onClick={() => col.sortable !== false && handleSort(col.key)}
              >
                <div className="flex items-center gap-1.5">
                  {col.label}
                  {sortConfig?.key === col.key && (
                    sortConfig.direction === 'asc' ? <ChevronUp className="w-3.5 h-3.5 text-primary" /> : <ChevronDown className="w-3.5 h-3.5 text-primary" />
                  )}
                </div>
              </th>
            ))}
            {(onEdit || onDelete) && (
              <th className="px-6 py-4 text-right">Actions</th>
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {sortedData.map((row) => (
            <tr key={row[keyField]} className="hover:bg-surface-alt/50 transition-colors">
              {columns.map((col) => (
                <td key={col.key} className="px-6 py-4 whitespace-nowrap">
                  {col.render ? col.render(row[col.key], row) : row[col.key]}
                </td>
              ))}
              {(onEdit || onDelete) && (
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <div className="flex items-center justify-end gap-2">
                    {onEdit && (
                      <button 
                        onClick={() => onEdit(row)}
                        className="w-8 h-8 flex items-center justify-center rounded-lg text-text-secondary hover:text-primary hover:bg-primary/10 transition-all"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    )}
                    {onDelete && (
                      <button 
                        onClick={() => onDelete(row)}
                        className="w-8 h-8 flex items-center justify-center rounded-lg text-text-secondary hover:text-error hover:bg-error/10 transition-all"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
