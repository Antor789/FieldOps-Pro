import React from 'react';
import { Percent, DollarSign, Calculator, HelpCircle, ShieldCheck } from 'lucide-react';
import { formatBDT } from '../../data/mockQuotationData';

interface DiscountVATCalculatorProps {
  subtotal: number;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  includeVat: boolean;
  vatRate?: number; // default 0.15 (15%)
  onDiscountTypeChange: (type: 'percentage' | 'fixed') => void;
  onDiscountValueChange: (value: number) => void;
  onIncludeVatChange: (include: boolean) => void;
  readOnly?: boolean;
}

export const DiscountVATCalculator: React.FC<DiscountVATCalculatorProps> = ({
  subtotal,
  discountType,
  discountValue,
  includeVat,
  vatRate = 0.15,
  onDiscountTypeChange,
  onDiscountValueChange,
  onIncludeVatChange,
  readOnly = false,
}) => {
  // Calculations
  const discountAmount =
    discountType === 'percentage'
      ? Math.round((subtotal * Math.min(Math.max(discountValue, 0), 100)) / 100)
      : Math.min(Math.max(discountValue, 0), subtotal);

  const taxableAmount = Math.max(0, subtotal - discountAmount);
  const vatAmount = includeVat ? Math.round(taxableAmount * vatRate) : 0;
  const grandTotal = taxableAmount + vatAmount;

  return (
    <div className="bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4 shadow-xs">
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
        <div className="flex items-center space-x-2">
          <Calculator className="w-4 h-4 text-amber-500" />
          <h4 className="font-extrabold text-xs uppercase tracking-wider text-slate-900 dark:text-slate-100">
            Financial Summary & NBR VAT (৳ BDT)
          </h4>
        </div>
        <span className="text-[10px] font-mono font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 px-2 py-0.5 rounded-full">
          Bangladesh Standard
        </span>
      </div>

      <div className="space-y-3 text-xs">
        {/* Subtotal */}
        <div className="flex justify-between items-center text-slate-600 dark:text-slate-400">
          <span>Items Subtotal</span>
          <span className="font-mono font-bold text-slate-900 dark:text-slate-100">
            {formatBDT(subtotal)}
          </span>
        </div>

        {/* Discount Controls */}
        <div className="pt-2 border-t border-dashed border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <label className="text-slate-700 dark:text-slate-300 font-semibold">
              Commercial Discount
            </label>
            {!readOnly && (
              <div className="flex items-center bg-slate-200 dark:bg-slate-800 p-0.5 rounded-lg">
                <button
                  type="button"
                  onClick={() => onDiscountTypeChange('percentage')}
                  className={`px-2 py-0.5 text-[10px] font-bold rounded-md transition ${
                    discountType === 'percentage'
                      ? 'bg-amber-500 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                  }`}
                >
                  <Percent className="w-3 h-3 inline mr-1" />
                  %
                </button>
                <button
                  type="button"
                  onClick={() => onDiscountTypeChange('fixed')}
                  className={`px-2 py-0.5 text-[10px] font-bold rounded-md transition ${
                    discountType === 'fixed'
                      ? 'bg-amber-500 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                  }`}
                >
                  ৳ BDT
                </button>
              </div>
            )}
          </div>

          {!readOnly ? (
            <div className="flex items-center space-x-2">
              <input
                type="number"
                min="0"
                max={discountType === 'percentage' ? 100 : subtotal}
                value={discountValue}
                onChange={(e) => onDiscountValueChange(parseFloat(e.target.value) || 0)}
                className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-1.5 font-mono text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder={discountType === 'percentage' ? 'e.g. 10%' : 'e.g. 5000'}
              />
              <span className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400 shrink-0">
                -{formatBDT(discountAmount)}
              </span>
            </div>
          ) : (
            <div className="flex justify-between items-center text-slate-600 dark:text-slate-400">
              <span>
                Discount ({discountType === 'percentage' ? `${discountValue}%` : 'Fixed'})
              </span>
              <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                -{formatBDT(discountAmount)}
              </span>
            </div>
          )}
        </div>

        {/* NBR 15% VAT Toggle */}
        <div className="pt-2 border-t border-dashed border-slate-200 dark:border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {!readOnly ? (
                <input
                  type="checkbox"
                  id="includeVatCheck"
                  checked={includeVat}
                  onChange={(e) => onIncludeVatChange(e.target.checked)}
                  className="rounded border-slate-300 dark:border-slate-700 text-amber-500 focus:ring-amber-500 w-4 h-4"
                />
              ) : (
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
              )}
              <label
                htmlFor="includeVatCheck"
                className="text-slate-700 dark:text-slate-300 font-semibold cursor-pointer flex items-center gap-1"
              >
                Apply NBR 15% VAT
                <span
                  title="NBR Standard 15% Value Added Tax on Service Subtotal in Bangladesh"
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 cursor-help"
                >
                  <HelpCircle className="w-3 h-3 inline" />
                </span>
              </label>
            </div>
            <span className="font-mono font-bold text-slate-900 dark:text-slate-100">
              +{formatBDT(vatAmount)}
            </span>
          </div>

          {includeVat && (
            <p className="text-[10px] text-slate-500 dark:text-slate-400 bg-emerald-50 dark:bg-emerald-950/40 p-2 rounded-xl border border-emerald-200/60 dark:border-emerald-800/60">
              VAT calculated as 15% on net taxable value {formatBDT(taxableAmount)} as mandated by
              NBR Bangladesh rules.
            </p>
          )}
        </div>

        {/* Grand Total */}
        <div className="pt-3 border-t-2 border-slate-900 dark:border-slate-700 flex justify-between items-center text-sm font-extrabold text-slate-900 dark:text-slate-100">
          <span>ESTIMATED TOTAL</span>
          <span className="text-base text-amber-600 dark:text-amber-400 font-mono">
            {formatBDT(grandTotal)}
          </span>
        </div>
      </div>
    </div>
  );
};
