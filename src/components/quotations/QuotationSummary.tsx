import React from 'react';
import { formatBDT, numberToWordsBDT } from '../../data/mockQuotationData';
import { Percent, DollarSign, Calculator, Receipt, ShieldCheck } from 'lucide-react';

interface QuotationSummaryProps {
  subtotal: number;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  includeVat: boolean;
  vatRate?: number;
  onDiscountTypeChange: (type: 'percentage' | 'fixed') => void;
  onDiscountValueChange: (val: number) => void;
  onIncludeVatChange: (include: boolean) => void;
  className?: string;
  readOnly?: boolean;
}

export const QuotationSummary: React.FC<QuotationSummaryProps> = ({
  subtotal,
  discountType,
  discountValue,
  includeVat,
  vatRate = 0.15,
  onDiscountTypeChange,
  onDiscountValueChange,
  onIncludeVatChange,
  className = '',
  readOnly = false,
}) => {
  // Calculations
  const discountAmount =
    discountType === 'percentage'
      ? Math.round((subtotal * Math.min(100, Math.max(0, discountValue))) / 100)
      : Math.min(subtotal, Math.max(0, discountValue));

  const afterDiscount = Math.max(0, subtotal - discountAmount);
  const vatAmount = includeVat ? Math.round(afterDiscount * vatRate) : 0;
  const grandTotal = afterDiscount + vatAmount;

  return (
    <div
      className={`rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs space-y-4 ${className}`}
    >
      <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
        <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Calculator className="w-4 h-4 text-blue-600" />
          Financial Summary (মূল্য হিসাব)
        </h4>
        <span className="text-[11px] font-mono text-slate-400">Currency: BDT (৳)</span>
      </div>

      <div className="space-y-3 text-xs">
        {/* Subtotal */}
        <div className="flex items-center justify-between">
          <span className="text-slate-600 dark:text-slate-400 font-medium">
            Subtotal (মোট দর)
          </span>
          <span className="font-bold text-slate-900 dark:text-white text-sm">
            {formatBDT(subtotal)}
          </span>
        </div>

        {/* Discount Controls */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800/60">
          <div className="flex items-center justify-between gap-2 flex-wrap mb-1.5">
            <span className="text-slate-600 dark:text-slate-400 font-medium">
              Commercial Discount (ছাড়)
            </span>

            {!readOnly && (
              <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-0.5 rounded-md text-[11px]">
                <button
                  type="button"
                  onClick={() => onDiscountTypeChange('percentage')}
                  className={`px-2 py-0.5 rounded font-bold transition-colors ${
                    discountType === 'percentage'
                      ? 'bg-white dark:bg-slate-700 text-blue-600 shadow-xs'
                      : 'text-slate-500'
                  }`}
                >
                  % Percent
                </button>
                <button
                  type="button"
                  onClick={() => onDiscountTypeChange('fixed')}
                  className={`px-2 py-0.5 rounded font-bold transition-colors ${
                    discountType === 'fixed'
                      ? 'bg-white dark:bg-slate-700 text-blue-600 shadow-xs'
                      : 'text-slate-500'
                  }`}
                >
                  ৳ Fixed
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between">
            {!readOnly ? (
              <div className="flex items-center gap-1.5">
                <input
                  type="number"
                  min="0"
                  max={discountType === 'percentage' ? 100 : subtotal}
                  value={discountValue}
                  onChange={(e) => onDiscountValueChange(parseFloat(e.target.value) || 0)}
                  className="w-20 px-2 py-1 text-xs text-right font-bold rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <span className="text-slate-500 text-xs">
                  {discountType === 'percentage' ? '%' : 'BDT'}
                </span>
              </div>
            ) : (
              <span className="text-slate-500 text-[11px]">
                {discountType === 'percentage' ? `${discountValue}%` : 'Fixed deduction'}
              </span>
            )}

            <span className="font-bold text-rose-600 dark:text-rose-400">
              -{formatBDT(discountAmount)}
            </span>
          </div>
        </div>

        {/* VAT (15% NBR) */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800/60">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {!readOnly ? (
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeVat}
                    onChange={(e) => onIncludeVatChange(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <span className="text-slate-700 dark:text-slate-300 font-medium">
                    NBR VAT (ভ্যাট ১৫%)
                  </span>
                </label>
              ) : (
                <span className="text-slate-700 dark:text-slate-300 font-medium">
                  NBR VAT ({includeVat ? '15% Included' : 'Zero-Rated / Exempt'})
                </span>
              )}
            </div>

            <span className="font-bold text-slate-900 dark:text-white">
              {includeVat ? `+${formatBDT(vatAmount)}` : '৳0'}
            </span>
          </div>
          {includeVat && (
            <p className="text-[10px] text-slate-400 mt-0.5">
              Standard 15% VAT pursuant to Bangladesh Value Added Tax and Supplementary Duty Act 2012 (Mushak-6.3).
            </p>
          )}
        </div>

        {/* Grand Total */}
        <div className="pt-3 border-t-2 border-slate-200 dark:border-slate-700 flex items-center justify-between">
          <div>
            <span className="font-black text-sm text-slate-900 dark:text-white uppercase tracking-wider block">
              Grand Total (সর্বমোট)
            </span>
            <span className="text-[10px] text-slate-500">Includes all levies & charges</span>
          </div>
          <span className="text-xl sm:text-2xl font-black text-blue-600 dark:text-blue-400">
            {formatBDT(grandTotal)}
          </span>
        </div>

        {/* Total in words */}
        <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-300 italic">
          <strong className="not-italic text-slate-800 dark:text-slate-200 mr-1">In Words:</strong>
          {numberToWordsBDT(grandTotal)}
        </div>
      </div>
    </div>
  );
};
