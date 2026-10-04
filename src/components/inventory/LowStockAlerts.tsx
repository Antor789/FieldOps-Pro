import React from 'react';
import { Part } from '../../types/inventory';
import { formatBDT } from '../../utils/formatters';
import { AlertTriangle, XCircle, FileSpreadsheet, ArrowRight, Package } from 'lucide-react';
import { motion } from 'motion/react';

export interface LowStockAlertsProps {
  parts: Part[];
  locale?: 'en' | 'bn';
  onSelectPart: (part: Part) => void;
  onCreatePOForPart: (part: Part) => void;
  onCreatePOForAll: () => void;
}

export const LowStockAlerts: React.FC<LowStockAlertsProps> = ({
  parts,
  locale = 'en',
  onSelectPart,
  onCreatePOForPart,
  onCreatePOForAll,
}) => {
  const lowOrOutParts = parts.filter(
    (p) => p.stockStatus === 'low_stock' || p.stockStatus === 'out_of_stock'
  );

  if (lowOrOutParts.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 text-center shadow-xs">
        <Package className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
        <h4 className="font-bold text-sm text-slate-900 dark:text-white">
          {locale === 'bn' ? 'সব স্টক পর্যাপ্ত অবস্থায় আছে' : 'All Stock Levels Healthy'}
        </h4>
        <p className="text-xs text-slate-500 mt-1">
          {locale === 'bn' ? 'কোনো যন্ত্রাংশ রিঅর্ডার লেভেলের নিচে নেই।' : 'No hardware spares are currently below minimum reorder thresholds.'}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-rose-200 dark:border-rose-900/60 shadow-xs overflow-hidden">
      {/* Header */}
      <div className="p-4 bg-rose-50/70 dark:bg-rose-950/40 border-b border-rose-200 dark:border-rose-900/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-rose-100 dark:bg-rose-900/60 text-rose-600 dark:text-rose-300 animate-pulse">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-rose-900 dark:text-rose-200">
              {locale === 'bn' ? '⚠️ স্বল্প স্টক অ্যালার্ট সেন্টার' : '⚠️ Low Stock & Depleted Spares Alert Center'}
            </h3>
            <p className="text-xs text-rose-600 dark:text-rose-400">
              {lowOrOutParts.length} {locale === 'bn' ? 'টি আইটেম অবিলম্বে রিঅর্ডার প্রয়োজন' : 'critical items require replenishment'}
            </p>
          </div>
        </div>

        <button
          onClick={onCreatePOForAll}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 shadow-sm transition-colors"
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>{locale === 'bn' ? 'এক ক্লিকে রিকুইজিশন তৈরি' : 'Generate Bulk Reorder PO'}</span>
        </button>
      </div>

      {/* Item List */}
      <div className="divide-y divide-rose-100 dark:divide-rose-950/40 max-h-[380px] overflow-y-auto">
        {lowOrOutParts.map((part) => {
          const isOut = part.stockStatus === 'out_of_stock';
          const deficit = Math.max(0, part.minimumStock - part.totalStock);

          return (
            <div
              key={part.id}
              className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-rose-50/40 dark:hover:bg-rose-950/20 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span
                  className={`p-2 rounded-lg text-xs font-bold font-mono ${
                    isOut
                      ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/60 dark:text-rose-300'
                      : 'bg-amber-100 text-amber-700 dark:bg-amber-900/60 dark:text-amber-300'
                  }`}
                >
                  {part.sku}
                </span>

                <div>
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white">
                    {locale === 'bn' && part.nameBangla ? part.nameBangla : part.name}
                  </h4>
                  <div className="flex items-center gap-2 text-[11px] text-slate-500 font-mono mt-0.5">
                    <span>
                      {locale === 'bn' ? 'বর্তমান স্টক:' : 'Current:'} <strong className="text-rose-600">{part.totalStock}</strong>
                    </span>
                    <span>•</span>
                    <span>
                      {locale === 'bn' ? 'নূন্যতম:' : 'Min:'} <strong>{part.minimumStock}</strong>
                    </span>
                    <span>•</span>
                    <span className="text-amber-600 dark:text-amber-400 font-semibold">
                      +{deficit} {locale === 'bn' ? 'টি ঘাটতি' : 'deficit'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center">
                <button
                  onClick={() => onSelectPart(part)}
                  className="px-2.5 py-1 rounded text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  {locale === 'bn' ? 'বিবরণ' : 'Inspect'}
                </button>
                <button
                  onClick={() => onCreatePOForPart(part)}
                  className="px-3 py-1 rounded text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-900 hover:bg-indigo-100 transition-colors flex items-center gap-1"
                >
                  <span>{locale === 'bn' ? 'PO তৈরি করুন' : 'Create PO'}</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
