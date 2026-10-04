import React from 'react';
import { formatBDT } from '../../utils/formatters';
import { Users, Building2, CheckCircle2, DollarSign, TrendingUp } from 'lucide-react';

export interface CustomerStatsProps {
  total: number;
  active: number;
  enterprise: number;
  totalRevenue: number;
  locale?: 'en' | 'bn';
}

export const CustomerStats: React.FC<CustomerStatsProps> = ({
  total,
  active,
  enterprise,
  totalRevenue,
  locale = 'en',
}) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
        <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
          <span>{locale === 'bn' ? 'মোট গ্রাহক' : 'Total Customers'}</span>
          <Users className="w-4 h-4 text-indigo-500" />
        </div>
        <div className="text-xl sm:text-2xl font-mono font-extrabold text-slate-900 dark:text-white">
          {total}
        </div>
        <div className="text-[11px] text-slate-400 font-mono">
          {locale === 'bn' ? '+৮ এই মাসে যোগ হয়েছে' : '+8 acquired this month'}
        </div>
      </div>

      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
        <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
          <span>{locale === 'bn' ? 'সক্রিয় গ্রাহক' : 'Active Accounts'}</span>
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
        </div>
        <div className="text-xl sm:text-2xl font-mono font-extrabold text-emerald-600 dark:text-emerald-400">
          {active}
        </div>
        <div className="text-[11px] text-emerald-600/80 font-mono">
          {Math.round((active / (total || 1)) * 100)}% {locale === 'bn' ? 'সক্রিয় রিটেনশন' : 'active retention rate'}
        </div>
      </div>

      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
        <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
          <span>{locale === 'bn' ? 'এন্টারপ্রাইজ ক্লায়েন্ট' : 'Enterprise Tier'}</span>
          <Building2 className="w-4 h-4 text-purple-500" />
        </div>
        <div className="text-xl sm:text-2xl font-mono font-extrabold text-purple-600 dark:text-purple-400">
          {enterprise}
        </div>
        <div className="text-[11px] text-purple-600/80 font-mono">
          {locale === 'bn' ? 'বার্ষিক SLA চুক্তিভুক্ত' : 'Annual AMC contracts'}
        </div>
      </div>

      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
        <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
          <span>{locale === 'bn' ? 'মোট সংগৃহীত রাজস্ব' : 'Lifetime Revenue'}</span>
          <TrendingUp className="w-4 h-4 text-emerald-500" />
        </div>
        <div className="text-xl sm:text-2xl font-mono font-extrabold text-emerald-600 dark:text-emerald-400">
          {formatBDT(totalRevenue, locale)}
        </div>
        <div className="text-[11px] text-slate-400 font-mono">
          {locale === 'bn' ? '১৫% এনবিআর ভ্যাট অন্তর্ভুক্ত' : 'NBR 15% VAT compliant'}
        </div>
      </div>
    </div>
  );
};
