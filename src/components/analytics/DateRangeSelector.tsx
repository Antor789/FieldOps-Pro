import React, { useState } from 'react';
import { Calendar, ChevronDown, Check } from 'lucide-react';

export type PresetPeriod =
  | 'today'
  | 'yesterday'
  | 'last7days'
  | 'last30days'
  | 'thisMonth'
  | 'lastMonth';

export interface DateRangeSelectorProps {
  selectedPeriod: PresetPeriod;
  onPeriodChange: (p: PresetPeriod) => void;
  locale?: 'en' | 'bn';
}

export function DateRangeSelector({
  selectedPeriod,
  onPeriodChange,
  locale = 'en',
}: DateRangeSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  const presets: { value: PresetPeriod; labelEn: string; labelBn: string }[] = [
    { value: 'today', labelEn: 'Today', labelBn: 'আজকের দিন' },
    { value: 'yesterday', labelEn: 'Yesterday', labelBn: 'গতকাল' },
    { value: 'last7days', labelEn: 'Last 7 Days', labelBn: 'গত ৭ দিন' },
    { value: 'last30days', labelEn: 'Last 30 Days', labelBn: 'গত ৩০ দিন' },
    { value: 'thisMonth', labelEn: 'This Month', labelBn: 'এই মাস' },
    { value: 'lastMonth', labelEn: 'Last Month', labelBn: 'গত মাস' },
  ];

  const currentPreset = presets.find((p) => p.value === selectedPeriod);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 shadow-2xs transition-all"
      >
        <Calendar className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
        <span>{locale === 'bn' ? currentPreset?.labelBn : currentPreset?.labelEn}</span>
        <ChevronDown className="w-3 h-3 text-slate-400" />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 top-full mt-1.5 w-44 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl p-1 z-50 animate-in fade-in zoom-in-95 duration-100">
            {presets.map((preset) => (
              <button
                key={preset.value}
                onClick={() => {
                  onPeriodChange(preset.value);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 text-xs rounded-lg transition-colors ${
                  selectedPeriod === preset.value
                    ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 font-semibold'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <span>{locale === 'bn' ? preset.labelBn : preset.labelEn}</span>
                {selectedPeriod === preset.value && <Check className="w-3.5 h-3.5" />}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
