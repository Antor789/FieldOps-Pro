import React, { useState, useMemo } from 'react';
import { ReportColumn } from '../../types/reports';
import { formatBDT } from '../../utils/formatters';
import { ArrowUpDown, ChevronLeft, ChevronRight, Star, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';

export interface ReportTableProps {
  columns: ReportColumn[];
  data: any[];
  pageSize?: number;
  locale?: 'en' | 'bn';
}

export const ReportTable: React.FC<ReportTableProps> = ({
  columns,
  data,
  pageSize = 15,
  locale = 'en',
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Handle sorting
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const sortedData = useMemo(() => {
    if (!sortField) return data;
    return [...data].sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      if (aVal === bVal) return 0;
      if (aVal === null || aVal === undefined) return 1;
      if (bVal === null || bVal === undefined) return -1;
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
      }
      return sortOrder === 'asc'
        ? String(aVal).localeCompare(String(bVal))
        : String(bVal).localeCompare(String(aVal));
    });
  }, [data, sortField, sortOrder]);

  const totalPages = Math.ceil((sortedData.length || 1) / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const currentRows = sortedData.slice(startIndex, startIndex + pageSize);

  const visibleColumns = columns.filter((c) => c.visible !== false);

  const renderCellContent = (col: ReportColumn, val: any) => {
    if (val === null || val === undefined) return '-';

    if (col.type === 'currency' && typeof val === 'number') {
      return (
        <span className="font-mono font-bold text-slate-900 dark:text-emerald-400">
          {formatBDT(val, locale)}
        </span>
      );
    }

    if (col.type === 'rating' && typeof val === 'number') {
      return (
        <div className="inline-flex items-center gap-1 font-semibold text-amber-500">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
          <span>{val.toFixed(1)}</span>
        </div>
      );
    }

    if (col.type === 'status') {
      const str = String(val).toUpperCase();
      if (str === 'COMPLETED' || str === 'PAID' || str === 'MET' || str === 'ACTIVE') {
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
            <CheckCircle2 className="w-3 h-3" />
            {str}
          </span>
        );
      }
      if (str === 'IN_PROGRESS' || str === 'PARTIAL' || str === 'HIGH') {
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
            <Clock className="w-3 h-3" />
            {str}
          </span>
        );
      }
      if (str === 'BREACHED' || str === 'UNPAID' || str === 'CRITICAL' || str === 'EMERGENCY') {
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 border border-rose-200 dark:border-rose-800">
            <AlertTriangle className="w-3 h-3" />
            {str}
          </span>
        );
      }
      return (
        <span className="inline-block text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
          {str}
        </span>
      );
    }

    if (col.type === 'date') {
      return <span className="font-mono text-xs text-slate-600 dark:text-slate-400">{String(val)}</span>;
    }

    return String(val);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800">
              {visibleColumns.map((col) => (
                <th
                  key={col.field}
                  style={{ width: col.width }}
                  onClick={() => col.sortable !== false && handleSort(col.field)}
                  className={`py-3 px-4 text-[11px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider ${
                    col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'
                  } ${col.sortable !== false ? 'cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors' : ''}`}
                >
                  <div className={`inline-flex items-center gap-1 ${col.align === 'right' ? 'justify-end' : ''}`}>
                    <span>{locale === 'bn' && col.headerBangla ? col.headerBangla : col.header}</span>
                    {col.sortable !== false && (
                      <ArrowUpDown className="w-3 h-3 text-slate-400 opacity-60" />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {currentRows.length === 0 ? (
              <tr>
                <td colSpan={visibleColumns.length} className="text-center py-10 text-slate-400">
                  {locale === 'bn' ? 'কোন রেকর্ড পাওয়া যায়নি' : 'No records found for current criteria.'}
                </td>
              </tr>
            ) : (
              currentRows.map((row, idx) => (
                <tr
                  key={idx}
                  className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                >
                  {visibleColumns.map((col) => (
                    <td
                      key={col.field}
                      className={`py-3 px-4 text-slate-700 dark:text-slate-300 ${
                        col.align === 'right'
                          ? 'text-right'
                          : col.align === 'center'
                          ? 'text-center'
                          : 'text-left'
                      }`}
                    >
                      {renderCellContent(col, row[col.field])}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="py-3 px-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <div>
          {locale === 'bn'
            ? `মোট ${sortedData.length} টির মধ্যে ${startIndex + 1}-${Math.min(startIndex + pageSize, sortedData.length)} টি দেখানো হচ্ছে`
            : `Showing ${startIndex + 1} to ${Math.min(startIndex + pageSize, sortedData.length)} of ${sortedData.length} records`}
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-30 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <span className="px-2 font-mono text-[11px]">
            {currentPage} / {totalPages || 1}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-30 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
