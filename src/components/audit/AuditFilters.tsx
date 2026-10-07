import React from 'react';
import { AuditFilterParams, AuditCategory, AuditSeverity } from '../../types/audit';
import { Search, Calendar, Filter, RotateCcw, X, ShieldAlert } from 'lucide-react';

export interface AuditFiltersProps {
  filters: AuditFilterParams;
  onChange: (filters: Partial<AuditFilterParams>) => void;
  onClear: () => void;
  locale?: 'en' | 'bn';
}

const CATEGORIES: { id: AuditCategory; label: string; labelBn: string }[] = [
  { id: 'auth', label: 'Auth & 2FA', labelBn: 'লগইন ও নিরাপত্তা' },
  { id: 'work_orders', label: 'Work Orders', labelBn: 'কাজের আদেশ' },
  { id: 'users', label: 'Users & Roles', labelBn: 'ইউজার ও পদবি' },
  { id: 'payments', label: 'Payments', labelBn: 'পেমেন্ট ও বিকাশ' },
  { id: 'reports', label: 'Reports & VAT', labelBn: 'রিপোর্ট ও ভ্যাট' },
  { id: 'system', label: 'System & Infra', labelBn: 'সিস্টেম সেটিংস' },
  { id: 'data', label: 'Data Export/Import', labelBn: 'ডাটা এক্সপোর্ট' },
];

export const AuditFilters: React.FC<AuditFiltersProps> = ({
  filters,
  onChange,
  onClear,
  locale = 'en',
}) => {
  const hasActiveFilters =
    !!filters.searchQuery ||
    filters.dateRangePreset !== 'all' ||
    (filters.categories && filters.categories.length > 0) ||
    (filters.severities && filters.severities.length > 0);

  const toggleCategory = (cat: AuditCategory) => {
    const existing = filters.categories || [];
    if (existing.includes(cat)) {
      onChange({ categories: existing.filter((c) => c !== cat) });
    } else {
      onChange({ categories: [...existing, cat] });
    }
  };

  const toggleSeverity = (sev: AuditSeverity) => {
    const existing = filters.severities || [];
    if (existing.includes(sev)) {
      onChange({ severities: existing.filter((s) => s !== sev) });
    } else {
      onChange({ severities: [...existing, sev] });
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 sm:p-5 shadow-xs space-y-4 text-xs font-sans">
      {/* Top Search & Primary Selectors */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
        {/* Search */}
        <div className="sm:col-span-6 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={
              locale === 'bn'
                ? 'আইপি, ব্যবহারকারী, অ্যাকশন বা বিবরণ অনুসন্ধান করুন...'
                : 'Search by user, action, ticket #, IP address, or keyword...'
            }
            value={filters.searchQuery || ''}
            onChange={(e) => onChange({ searchQuery: e.target.value })}
            className="w-full py-2.5 pl-9 pr-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
          />
        </div>

        {/* Date Range Preset */}
        <div className="sm:col-span-3">
          <div className="relative">
            <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <select
              value={filters.dateRangePreset || 'all'}
              onChange={(e) => onChange({ dateRangePreset: e.target.value as any })}
              className="w-full py-2.5 pl-9 pr-8 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-medium"
            >
              <option value="all">All Timelines (30 Days)</option>
              <option value="today">Today Only (BST)</option>
              <option value="yesterday">Yesterday</option>
              <option value="7days">Last 7 Days</option>
              <option value="30days">Last 30 Days</option>
            </select>
          </div>
        </div>

        {/* Clear Filters Button */}
        <div className="sm:col-span-3 flex justify-end">
          {hasActiveFilters && (
            <button
              type="button"
              onClick={onClear}
              className="py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter Row 2: Category Chips */}
      <div className="space-y-1.5 pt-1 border-t border-slate-100 dark:border-slate-800">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
          Event Categories:
        </span>
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={() => onChange({ categories: [] })}
            className={`py-1 px-2.5 rounded-full text-xs font-semibold transition cursor-pointer ${
              !filters.categories || filters.categories.length === 0
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
            }`}
          >
            All Categories
          </button>

          {CATEGORIES.map((cat) => {
            const isSelected = (filters.categories || []).includes(cat.id);
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => toggleCategory(cat.id)}
                className={`py-1 px-2.5 rounded-full text-xs font-semibold transition cursor-pointer border ${
                  isSelected
                    ? 'bg-emerald-500 text-white border-emerald-600 shadow-xs'
                    : 'bg-white dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                }`}
              >
                {locale === 'bn' ? cat.labelBn : cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Filter Row 3: Severity Toggles */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Severity Filter:
          </span>
          <div className="flex items-center gap-1.5">
            {(['critical', 'warning', 'info'] as AuditSeverity[]).map((sev) => {
              const isSelected = (filters.severities || []).includes(sev);
              const label = sev === 'critical' ? '🔴 Critical' : sev === 'warning' ? '🟡 Warning' : '🟢 Info';
              return (
                <button
                  key={sev}
                  type="button"
                  onClick={() => toggleSeverity(sev)}
                  className={`py-1 px-2 rounded-lg text-[11px] font-mono font-bold transition cursor-pointer border ${
                    isSelected
                      ? sev === 'critical'
                        ? 'bg-rose-600 text-white border-rose-700'
                        : sev === 'warning'
                        ? 'bg-amber-600 text-white border-amber-700'
                        : 'bg-blue-600 text-white border-blue-700'
                      : 'bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        <span className="text-[11px] font-mono text-slate-400">
          Showing filtered events in BST (UTC+6)
        </span>
      </div>
    </div>
  );
};
