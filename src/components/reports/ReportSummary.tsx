import React from 'react';
import { ReportSummary as ReportSummaryType } from '../../types/reports';
import { formatBDT } from '../../utils/formatters';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export interface ReportSummaryProps {
  summary: ReportSummaryType;
  locale?: 'en' | 'bn';
}

export const ReportSummary: React.FC<ReportSummaryProps> = ({ summary, locale = 'en' }) => {
  if (!summary?.metrics || summary.metrics.length === 0) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {summary.metrics.map((metric, idx) => {
        let displayValue = String(metric.value);
        if (metric.format === 'currency' && typeof metric.value === 'number') {
          displayValue = formatBDT(metric.value, locale);
        } else if (metric.format === 'number' && typeof metric.value === 'number') {
          displayValue = metric.value.toLocaleString();
        }

        return (
          <div
            key={idx}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs"
          >
            <div className="text-xs font-medium text-slate-500 dark:text-slate-400">
              {locale === 'bn' && metric.labelBangla ? metric.labelBangla : metric.label}
            </div>

            <div className="mt-2 flex items-baseline justify-between gap-2">
              <span className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-mono tracking-tight">
                {displayValue}
              </span>

              {metric.trend && (
                <div
                  className={`flex items-center gap-0.5 text-xs font-semibold px-1.5 py-0.5 rounded-md ${
                    metric.trend.direction === 'up'
                      ? 'text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-400'
                      : metric.trend.direction === 'down'
                      ? 'text-rose-700 bg-rose-50 dark:bg-rose-950/40 dark:text-rose-400'
                      : 'text-slate-600 bg-slate-100 dark:bg-slate-800 dark:text-slate-300'
                  }`}
                >
                  {metric.trend.direction === 'up' && <TrendingUp className="w-3 h-3" />}
                  {metric.trend.direction === 'down' && <TrendingDown className="w-3 h-3" />}
                  {metric.trend.direction === 'neutral' && <Minus className="w-3 h-3" />}
                  <span>{metric.trend.value}%</span>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
