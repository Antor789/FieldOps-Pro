import React, { useState } from 'react';
import { RefreshCw, Download, FileText, FileSpreadsheet, Check } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export interface DashboardControlsProps {
  onRefresh: () => void;
  isLoading?: boolean;
  lastUpdated: Date;
  locale?: 'en' | 'bn';
}

export function DashboardControls({
  onRefresh,
  isLoading = false,
  lastUpdated,
  locale = 'en',
}: DashboardControlsProps) {
  const { addToast } = useToast();
  const [isExportOpen, setIsExportOpen] = useState(false);

  const handleExport = (format: 'pdf' | 'excel' | 'csv') => {
    setIsExportOpen(false);
    addToast({
      type: 'success',
      title: locale === 'bn' ? 'রিপোর্ট ডাউনলোড প্রস্তুত' : `${format.toUpperCase()} Report Generated`,
      message:
        locale === 'bn'
          ? `বিআইএস এবং এনবিআর মূসক ডেটা এক্সপোর্ট সম্পন্ন হয়েছে।`
          : `Analytical export file has been formatted and saved.`,
      duration: 3500,
    });
  };

  const formattedTime = lastUpdated.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  return (
    <div className="flex items-center gap-2">
      {/* Refresh Button */}
      <button
        onClick={onRefresh}
        disabled={isLoading}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 shadow-2xs transition-all disabled:opacity-50"
        title="Refresh Analytics Data"
      >
        <RefreshCw className={`w-3.5 h-3.5 text-slate-500 ${isLoading ? 'animate-spin text-indigo-600' : ''}`} />
        <span className="hidden sm:inline">
          {locale === 'bn' ? 'রিফ্রেশ' : 'Refresh'}
        </span>
      </button>

      {/* Export Dropdown */}
      <div className="relative">
        <button
          onClick={() => setIsExportOpen(!isExportOpen)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition-all"
        >
          <Download className="w-3.5 h-3.5" />
          <span>{locale === 'bn' ? 'এক্সপোর্ট' : 'Export'}</span>
        </button>

        {isExportOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsExportOpen(false)} />
            <div className="absolute right-0 top-full mt-1.5 w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl p-1 z-50 animate-in fade-in zoom-in-95 duration-100">
              <button
                onClick={() => handleExport('pdf')}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              >
                <FileText className="w-4 h-4 text-rose-500" />
                <span>PDF Executive Summary</span>
              </button>
              <button
                onClick={() => handleExport('excel')}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              >
                <FileSpreadsheet className="w-4 h-4 text-emerald-500" />
                <span>Excel Spreadsheet (.xlsx)</span>
              </button>
              <button
                onClick={() => handleExport('csv')}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              >
                <FileSpreadsheet className="w-4 h-4 text-blue-500" />
                <span>CSV Raw Telemetry</span>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
