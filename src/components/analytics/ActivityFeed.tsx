import React from 'react';
import { ActivityItem } from '../../data/sampleAnalyticsData';
import { CheckCircle2, CreditCard, AlertTriangle, Sparkles, PlusCircle } from 'lucide-react';
import { motion } from 'motion/react';

export interface ActivityFeedProps {
  activities: ActivityItem[];
  onLoadMore?: () => void;
  locale?: 'en' | 'bn';
}

export function ActivityFeed({
  activities,
  onLoadMore,
  locale = 'en',
}: ActivityFeedProps) {
  const getIcon = (type: ActivityItem['type']) => {
    switch (type) {
      case 'job_completed':
        return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
      case 'payment_received':
        return <CreditCard className="w-4 h-4 text-blue-500" />;
      case 'sla_warning':
        return <AlertTriangle className="w-4 h-4 text-amber-500" />;
      case 'tech_assigned':
        return <Sparkles className="w-4 h-4 text-indigo-500" />;
      default:
        return <PlusCircle className="w-4 h-4 text-purple-500" />;
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
      <div className="mb-3">
        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <span>🕐</span>
          <span>{locale === 'bn' ? 'সাম্প্রতিক লাইভ কার্যকলাপ' : 'Live Activity Stream'}</span>
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          {locale === 'bn' ? 'মাঠ পর্যায়ের রিয়েল-টাইম ইভেন্ট লগ' : 'Real-time telemetry and dispatch feed'}
        </p>
      </div>

      <div className="space-y-3 relative before:absolute before:left-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100 dark:before:bg-slate-800">
        {activities.map((act, idx) => (
          <motion.div
            key={act.id}
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.25, delay: idx * 0.04 }}
            className="flex items-start gap-3 relative z-1"
          >
            <div className="w-7 h-7 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center shrink-0 shadow-xs">
              {getIcon(act.type)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-900 dark:text-slate-100 truncate">
                  {locale === 'bn' && act.titleBn ? act.titleBn : act.title}
                </span>
                <span className="text-[10px] text-slate-400 font-mono shrink-0 pl-2">
                  {act.timestamp}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                {locale === 'bn' && act.descriptionBn ? act.descriptionBn : act.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {onLoadMore && (
        <button
          onClick={onLoadMore}
          className="mt-4 pt-2.5 border-t border-slate-100 dark:border-slate-800 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline text-center w-full"
        >
          {locale === 'bn' ? 'আরো কার্যকলাপ দেখুন...' : 'Load older events...'}
        </button>
      )}
    </div>
  );
}
