import React from 'react';
import { ReportFilter } from '../../types/reports';
import { Calendar, Filter, RotateCcw } from 'lucide-react';

export interface ReportFiltersProps {
  filters: ReportFilter[];
  activeFilters: Record<string, any>;
  onFilterChange: (field: string, value: any) => void;
  onReset?: () => void;
  locale?: 'en' | 'bn';
}

const DATE_RANGE_OPTIONS = [
  { value: 'today', label: 'Today', labelBn: 'আজ' },
  { value: 'yesterday', label: 'Yesterday', labelBn: 'গতকাল' },
  { value: 'last_7_days', label: 'Last 7 Days', labelBn: 'গত ৭ দিন' },
  { value: 'last_30_days', label: 'Last 30 Days', labelBn: 'গত ৩০ দিন' },
  { value: 'this_month', label: 'This Month', labelBn: 'চলতি মাস' },
  { value: 'last_month', label: 'Last Month', labelBn: 'পূর্ববর্তী মাস' },
  { value: 'this_quarter', label: 'This Quarter', labelBn: 'চলতি ত্রৈমাসিক' },
  { value: 'this_year', label: 'This Year', labelBn: 'চলতি বছর' },
];

export const ReportFilters: React.FC<ReportFiltersProps> = ({
  filters,
  activeFilters,
  onFilterChange,
  onReset,
  locale = 'en',
}) => {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300">
          <Filter className="w-3.5 h-3.5 text-emerald-500" />
          <span>{locale === 'bn' ? 'ফিল্টার ও প্যারামিটার' : 'Report Filters & Parameters'}</span>
        </div>

        {onReset && (
          <button
            onClick={onReset}
            className="flex items-center gap-1 text-[11px] text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            {locale === 'bn' ? 'রিসেট' : 'Reset All'}
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
        {filters.map((filter) => {
          if (filter.type === 'date_range') {
            return (
              <div key={filter.field} className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-slate-400" />
                  {locale === 'bn' && filter.labelBangla ? filter.labelBangla : filter.label}
                </label>
                <select
                  value={activeFilters[filter.field] || 'this_month'}
                  onChange={(e) => onFilterChange(filter.field, e.target.value)}
                  className="w-full text-xs py-2 px-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                >
                  {DATE_RANGE_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {locale === 'bn' ? opt.labelBn : opt.label}
                    </option>
                  ))}
                </select>
              </div>
            );
          }

          if (filter.type === 'select' && filter.options) {
            return (
              <div key={filter.field} className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                  {locale === 'bn' && filter.labelBangla ? filter.labelBangla : filter.label}
                </label>
                <select
                  value={activeFilters[filter.field] || filter.defaultValue || 'ALL'}
                  onChange={(e) => onFilterChange(filter.field, e.target.value)}
                  className="w-full text-xs py-2 px-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                >
                  {filter.options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {locale === 'bn' && opt.labelBangla ? opt.labelBangla : opt.label}
                    </option>
                  ))}
                </select>
              </div>
            );
          }

          return null;
        })}
      </div>
    </div>
  );
};
