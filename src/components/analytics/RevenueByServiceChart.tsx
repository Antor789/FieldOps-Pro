import React from 'react';
import { RevenueByServiceData } from '../../data/sampleAnalyticsData';
import { formatBDT } from '../../utils/formatters';
import { motion } from 'motion/react';

export interface RevenueByServiceChartProps {
  data: RevenueByServiceData[];
  locale?: 'en' | 'bn';
}

export function RevenueByServiceChart({
  data,
  locale = 'en',
}: RevenueByServiceChartProps) {
  const maxRevenue = Math.max(...data.map((d) => d.revenue));

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
      <div className="mb-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <span>💰</span>
          <span>{locale === 'bn' ? 'সার্ভিস ক্যাটাগরি অনুযায়ী রাজস্ব' : 'Revenue by Service Type'}</span>
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          {locale === 'bn' ? 'টেলিকম, এইচভিএসি ও ইলেকট্রিক্যাল কালেকশন' : 'Total collected fees breakdown in BDT (৳)'}
        </p>
      </div>

      <div className="space-y-3.5">
        {data.map((item, idx) => {
          const percentage = (item.revenue / maxRevenue) * 100;

          return (
            <div key={item.service} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-slate-700 dark:text-slate-200 truncate pr-2">
                  {locale === 'bn' ? item.serviceBn : item.service}
                </span>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[11px] text-slate-400">
                    {item.jobs} {locale === 'bn' ? 'টি কাজ' : 'jobs'}
                  </span>
                  <span className="font-mono font-bold text-slate-900 dark:text-slate-100">
                    {formatBDT(item.revenue, locale)}
                  </span>
                </div>
              </div>

              {/* Progress Track */}
              <div className="h-2.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: item.color }}
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 0.6, delay: idx * 0.08, ease: 'easeOut' }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <span>{locale === 'bn' ? 'শীর্ষ আয়কারী খাত' : 'Top Performing Category'}:</span>
        <span className="font-semibold text-indigo-600 dark:text-indigo-400">
          {locale === 'bn' ? data[0]?.serviceBn : data[0]?.service}
        </span>
      </div>
    </div>
  );
}
