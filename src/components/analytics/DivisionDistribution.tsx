import React from 'react';
import { DivisionData } from '../../data/sampleAnalyticsData';
import { formatBDT } from '../../utils/formatters';
import { MapPin, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

export interface DivisionDistributionProps {
  data: DivisionData[];
  onViewMap?: () => void;
  locale?: 'en' | 'bn';
}

export function DivisionDistribution({
  data,
  onViewMap,
  locale = 'en',
}: DivisionDistributionProps) {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <span>🗺️</span>
            <span>{locale === 'bn' ? 'বিভাগভিত্তিক কাজের বিস্তার' : 'Jobs by Division & Region'}</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {locale === 'bn' ? 'ঢাকা, চট্টগ্রাম, সিলেট ও রাজশাহী জোন' : 'Operational regional distribution across Bangladesh'}
          </p>
        </div>

        {onViewMap && (
          <button
            onClick={onViewMap}
            className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 inline-flex items-center gap-1 hover:underline shrink-0"
          >
            <span>{locale === 'bn' ? 'লাইভ ম্যাপ' : 'Live Map'}</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        )}
      </div>

      <div className="space-y-3">
        {data.map((div, idx) => (
          <div key={div.division} className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 font-medium text-slate-800 dark:text-slate-200">
                <MapPin className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                <span className="truncate">{locale === 'bn' ? div.divisionBn : div.division}</span>
              </div>
              <div className="flex items-center gap-2 font-mono">
                <span className="text-[11px] text-slate-400">
                  {div.jobs} {locale === 'bn' ? 'কাজ' : 'jobs'}
                </span>
                <span className="font-bold text-slate-900 dark:text-slate-100">
                  {div.percentage}%
                </span>
              </div>
            </div>

            <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-linear-to-r from-indigo-500 to-indigo-600 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${div.percentage}%` }}
                transition={{ duration: 0.6, delay: idx * 0.08 }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <span>{locale === 'bn' ? 'মোট ফিল্ড ইউনিট সক্রিয়' : 'Active Field Fleet Units'}:</span>
        <span className="font-mono font-bold text-slate-900 dark:text-slate-100">
          25 {locale === 'bn' ? 'টি গাড়ি' : 'vans / bikes'}
        </span>
      </div>
    </div>
  );
}
