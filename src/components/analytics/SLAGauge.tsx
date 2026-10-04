import React from 'react';
import { SLAPerformanceData } from '../../data/sampleAnalyticsData';
import { motion } from 'motion/react';
import { ShieldAlert, CheckCircle2, TrendingUp, AlertTriangle } from 'lucide-react';
import { formatNumber } from '../../utils/formatters';

export interface SLAGaugeProps {
  data: SLAPerformanceData;
  locale?: 'en' | 'bn';
}

export function SLAGauge({ data, locale = 'en' }: SLAGaugeProps) {
  const isHealthy = data.currentRate >= data.targetRate;
  const radius = 68;
  const circumference = Math.PI * radius; // Semi-circle
  const strokeDashoffset = circumference - (data.currentRate / 100) * circumference;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <span>🎯</span>
            <span>{locale === 'bn' ? 'এসএলএ কর্মক্ষমতা ও মান' : 'SLA Performance & Target'}</span>
          </h3>
          <span
            className={`text-xs font-semibold px-2 py-0.5 rounded-full inline-flex items-center gap-1 ${
              isHealthy
                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                : 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-200 dark:border-amber-800'
            }`}
          >
            {isHealthy ? <CheckCircle2 className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
            {isHealthy ? (locale === 'bn' ? 'টার্গেট পূরণ' : 'On Target') : (locale === 'bn' ? 'সতর্কতা' : 'Attention')}
          </span>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          {locale === 'bn' ? 'জরুরী ও অন্যান্য কাজের নির্ধারিত সময়ে সমাপ্তির হার' : 'Timely completion rate across all priority tiers'}
        </p>
      </div>

      {/* SVG Semi-Circle Gauge */}
      <div className="relative flex flex-col items-center justify-center my-3">
        <svg width="180" height="100" viewBox="0 0 180 100" className="overflow-visible">
          {/* Background Track */}
          <path
            d="M 15 90 A 75 75 0 0 1 165 90"
            fill="none"
            stroke="currentColor"
            className="text-slate-100 dark:text-slate-800"
            strokeWidth="14"
            strokeLinecap="round"
          />
          {/* Animated Value Arc */}
          <motion.path
            d="M 15 90 A 75 75 0 0 1 165 90"
            fill="none"
            stroke={isHealthy ? '#10B981' : '#F59E0B'}
            strokeWidth="14"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.1, ease: 'easeOut' }}
          />
        </svg>

        {/* Center Rate Text */}
        <div className="absolute bottom-1 flex flex-col items-center">
          <span className="text-3xl font-extrabold text-slate-900 dark:text-slate-50 font-mono">
            {data.currentRate}%
          </span>
          <span className="text-[11px] font-semibold text-slate-400">
            {locale === 'bn' ? 'লক্ষ্যমাত্রা: ' : 'Target: '} {data.targetRate}%
          </span>
        </div>
      </div>

      {/* Priority Tier Breakdown Mini Grid */}
      <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
        {data.byPriority.slice(0, 3).map((item) => (
          <div key={item.priority} className="flex items-center justify-between text-[11px]">
            <span className="text-slate-500 dark:text-slate-400">
              {locale === 'bn' ? item.priorityBn : item.priority}
            </span>
            <div className="flex items-center gap-1.5 font-mono font-bold">
              <span className={item.rate >= item.target ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-500'}>
                {item.rate}%
              </span>
              <span className="text-slate-300 dark:text-slate-600">/ {item.target}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
