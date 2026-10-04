import React from 'react';
import {
  ClipboardList,
  AlertTriangle,
  Navigation,
  CheckCircle2,
  Banknote,
  TrendingUp,
  TrendingDown,
  Flame,
  Clock,
  Sparkles,
} from 'lucide-react';
import { Language, formatBDT } from '../../../lib/i18n';
import { WorkOrderStatus, WorkOrderPriority } from '../../../types/fsm';

export type StatsFilterType = 'ALL' | 'CRITICAL' | 'EN_ROUTE' | 'COMPLETED' | 'REVENUE';

interface FSMStatsBarProps {
  totalJobs: number;
  criticalJobs: number;
  enRouteJobs: number;
  completedJobs: number;
  totalRevenueBDT: number;
  activeFilter: StatsFilterType;
  onSelectFilter: (filter: StatsFilterType) => void;
  lang: Language;
}

export const FSMStatsBar: React.FC<FSMStatsBarProps> = ({
  totalJobs,
  criticalJobs,
  enRouteJobs,
  completedJobs,
  totalRevenueBDT,
  activeFilter,
  onSelectFilter,
  lang,
}) => {
  const stats = [
    {
      id: 'ALL' as StatsFilterType,
      labelEn: 'Total Jobs',
      labelBn: 'মোট কাজ',
      value: totalJobs,
      trend: '+5 today',
      trendPositive: true,
      icon: <ClipboardList className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />,
      bgGradient: 'from-indigo-500/10 to-indigo-600/5',
      borderColor: 'border-indigo-200 dark:border-indigo-800/80',
      activeRing: 'ring-2 ring-indigo-500 shadow-indigo-500/10',
    },
    {
      id: 'CRITICAL' as StatsFilterType,
      labelEn: 'Critical / Emergency',
      labelBn: 'জরুরী / সংকটাপন্ন',
      value: criticalJobs,
      trend: '⚠️ SLA Alert!',
      trendPositive: false,
      isAlert: criticalJobs > 0,
      icon: <Flame className="w-4 h-4 text-red-600 dark:text-red-400 animate-pulse" />,
      bgGradient: 'from-red-500/10 to-red-600/5',
      borderColor: 'border-red-200 dark:border-red-800/80',
      activeRing: 'ring-2 ring-red-500 shadow-red-500/10',
    },
    {
      id: 'EN_ROUTE' as StatsFilterType,
      labelEn: 'En Route (GPS)',
      labelBn: 'চলমান (জিপিএস)',
      value: enRouteJobs,
      trend: 'On track (Dhaka)',
      trendPositive: true,
      icon: <Navigation className="w-4 h-4 text-blue-600 dark:text-blue-400" />,
      bgGradient: 'from-blue-500/10 to-blue-600/5',
      borderColor: 'border-blue-200 dark:border-blue-800/80',
      activeRing: 'ring-2 ring-blue-500 shadow-blue-500/10',
    },
    {
      id: 'COMPLETED' as StatsFilterType,
      labelEn: 'Completed Today',
      labelBn: 'আজ সম্পন্ন',
      value: completedJobs,
      trend: '↑ 15% vs yesterday',
      trendPositive: true,
      icon: <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />,
      bgGradient: 'from-emerald-500/10 to-emerald-600/5',
      borderColor: 'border-emerald-200 dark:border-emerald-800/80',
      activeRing: 'ring-2 ring-emerald-500 shadow-emerald-500/10',
    },
    {
      id: 'REVENUE' as StatsFilterType,
      labelEn: 'Revenue Collected',
      labelBn: 'সংগৃহীত রাজস্ব',
      value: formatBDT(totalRevenueBDT, lang),
      trend: '↑ 8% NBR Standard',
      trendPositive: true,
      icon: <Banknote className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />,
      bgGradient: 'from-emerald-500/10 to-teal-500/5',
      borderColor: 'border-emerald-200 dark:border-emerald-800/80',
      activeRing: 'ring-2 ring-emerald-500 shadow-emerald-500/10',
      isCurrency: true,
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 font-sans">
      {stats.map((item) => {
        const isActive = activeFilter === item.id;
        const label = lang === 'bn' ? item.labelBn : item.labelEn;

        return (
          <button
            key={item.id}
            onClick={() => onSelectFilter(item.id)}
            className={`text-left relative p-3.5 rounded-2xl border transition-all duration-200 cursor-pointer overflow-hidden group bg-white dark:bg-slate-900 shadow-2xs hover:-translate-y-0.5 hover:shadow-md ${
              item.borderColor
            } ${isActive ? `${item.activeRing} bg-slate-50/50 dark:bg-slate-800/50 font-semibold` : ''}`}
          >
            {/* Subtle Gradient Backdrop */}
            <div
              className={`absolute inset-0 bg-gradient-to-br ${item.bgGradient} opacity-60 group-hover:opacity-100 transition-opacity pointer-events-none`}
            />

            <div className="relative z-10 flex flex-col justify-between h-full space-y-2">
              {/* Header: Label & Icon */}
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400 tracking-tight truncate max-w-[110px]">
                  {label}
                </span>
                <div className="w-7 h-7 rounded-xl bg-white/80 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-center shadow-2xs">
                  {item.icon}
                </div>
              </div>

              {/* Value Number */}
              <div className="flex items-baseline justify-between">
                <span className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-slate-100 font-mono tracking-tight tabular-nums">
                  {item.value}
                </span>
              </div>

              {/* Trend Footer */}
              <div className="flex items-center space-x-1 text-[10px] font-mono font-bold">
                {item.trendPositive ? (
                  <TrendingUp className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                ) : item.isAlert ? (
                  <AlertTriangle className="w-3 h-3 text-red-500" />
                ) : (
                  <TrendingDown className="w-3 h-3 text-slate-400" />
                )}
                <span
                  className={
                    item.isAlert
                      ? 'text-red-600 dark:text-red-400'
                      : item.trendPositive
                      ? 'text-emerald-700 dark:text-emerald-400'
                      : 'text-slate-500'
                  }
                >
                  {item.trend}
                </span>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
};
