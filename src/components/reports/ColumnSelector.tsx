import React from 'react';
import { ReportColumn } from '../../types/reports';
import { ChevronUp, ChevronDown, Check, X, GripVertical } from 'lucide-react';

export interface ColumnSelectorProps {
  availableColumns: ReportColumn[];
  selectedColumns: ReportColumn[];
  onAddColumn: (col: ReportColumn) => void;
  onRemoveColumn: (field: string) => void;
  onReorderColumns: (fromIndex: number, toIndex: number) => void;
  locale?: 'en' | 'bn';
}

export const ColumnSelector: React.FC<ColumnSelectorProps> = ({
  availableColumns,
  selectedColumns,
  onAddColumn,
  onRemoveColumn,
  onReorderColumns,
  locale = 'en',
}) => {
  const isSelected = (field: string) => selectedColumns.some((c) => c.field === field);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Available Columns Pool */}
      <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-2xl p-4">
        <h5 className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-3 flex items-center justify-between">
          <span>{locale === 'bn' ? 'উপলব্ধ কলামসমূহ' : 'Available Fields'}</span>
          <span className="text-[11px] font-normal text-slate-400">
            {availableColumns.length} fields
          </span>
        </h5>

        <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
          {availableColumns.map((col) => {
            const selected = isSelected(col.field);
            return (
              <button
                key={col.field}
                type="button"
                onClick={() => {
                  if (selected) {
                    onRemoveColumn(col.field);
                  } else {
                    onAddColumn(col);
                  }
                }}
                className={`w-full text-left p-2.5 rounded-xl border text-xs flex items-center justify-between transition-colors ${
                  selected
                    ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-300'
                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`w-4 h-4 rounded-md border flex items-center justify-center text-[10px] ${
                      selected
                        ? 'bg-emerald-500 border-emerald-500 text-white'
                        : 'border-slate-300 dark:border-slate-600'
                    }`}
                  >
                    {selected && <Check className="w-3 h-3" />}
                  </span>
                  <span className="font-medium">
                    {locale === 'bn' && col.headerBangla ? col.headerBangla : col.header}
                  </span>
                </div>
                <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-500">
                  {col.type}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Columns & Ordering */}
      <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-2xl p-4">
        <h5 className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-3 flex items-center justify-between">
          <span>{locale === 'bn' ? 'নির্বাচিত কলাম (ক্রম পরিবর্তনযোগ্য)' : 'Active Columns in Report'}</span>
          <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
            {selectedColumns.length} selected
          </span>
        </h5>

        <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
          {selectedColumns.map((col, idx) => (
            <div
              key={col.field}
              className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2 flex items-center justify-between shadow-2xs text-xs"
            >
              <div className="flex items-center gap-2">
                <GripVertical className="w-3.5 h-3.5 text-slate-400 cursor-grab" />
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {locale === 'bn' && col.headerBangla ? col.headerBangla : col.header}
                </span>
                <span className="text-[10px] font-mono text-slate-400">({col.type})</span>
              </div>

              <div className="flex items-center gap-1">
                {/* Move Up */}
                <button
                  type="button"
                  disabled={idx === 0}
                  onClick={() => onReorderColumns(idx, idx - 1)}
                  className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 disabled:opacity-20"
                >
                  <ChevronUp className="w-3.5 h-3.5" />
                </button>

                {/* Move Down */}
                <button
                  type="button"
                  disabled={idx === selectedColumns.length - 1}
                  onClick={() => onReorderColumns(idx, idx + 1)}
                  className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 disabled:opacity-20"
                >
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>

                {/* Remove */}
                <button
                  type="button"
                  onClick={() => onRemoveColumn(col.field)}
                  className="p-1 text-rose-500 hover:text-rose-700"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}

          {selectedColumns.length === 0 && (
            <div className="py-8 text-center text-xs text-slate-400">
              {locale === 'bn' ? 'অন্তত একটি কলাম নির্বাচন করুন' : 'Select at least one column from the left panel.'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
