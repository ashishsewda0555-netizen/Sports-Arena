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
      <div className="w-full h-64 flex items-center justify-center bg-surface rounded-lg border border-border">
        <div className="animate-spin w-8 h-8 border-4 border-secondary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="w-full py-12 flex flex-col items-center justify-center bg-surface rounded-lg border border-border">
        <p className="text-text-secondary text-lg">No records found.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto bg-surface rounded-lg border border-border">
      <table className="w-full text-left text-sm text-text-primary">
        <thead className="bg-surface-alt border-b border-border uppercase text-xs text-text-secondary">
          <tr>
            {columns.map((col) => (
              <th 
                key={col.key} 
                className={`px-6 py-4 font-medium ${col.sortable !== false ? 'cursor-pointer hover:bg-black/5' : ''}`}
                onClick={() => col.sortable !== false && handleSort(col.key)}
              >
                <div className="flex items-center gap-1">
                  {col.label}
                  {sortConfig?.key === col.key && (
                    sortConfig.direction === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
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
            <tr key={row[keyField]} className="hover:bg-bg/50 transition-colors">
              {columns.map((col) => (
                <td key={col.key} className="px-6 py-4 whitespace-nowrap">
                  {col.render ? col.render(row[col.key], row) : row[col.key]}
                </td>
              ))}
              {(onEdit || onDelete) && (
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <div className="flex items-center justify-end gap-3">
                    {onEdit && (
                      <button 
                        onClick={() => onEdit(row)}
                        className="text-text-secondary hover:text-primary transition-colors"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    )}
                    {onDelete && (
                      <button 
                        onClick={() => onDelete(row)}
                        className="text-text-secondary hover:text-error transition-colors"
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
