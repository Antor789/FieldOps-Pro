import React from 'react';
import { Calendar } from '../components/calendar/Calendar';
import { Calendar as CalIcon, Clock, Users, ShieldAlert, Sparkles, MapPin } from 'lucide-react';

export interface ScheduleCalendarPageProps {
  locale?: 'en' | 'bn';
  onNavigateToWorkOrder?: (workOrderId: string) => void;
}

export const ScheduleCalendarPage: React.FC<ScheduleCalendarPageProps> = ({
  locale = 'en',
  onNavigateToWorkOrder,
}) => {
  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-4">
      {/* Page Title & Breadcrumb Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-slate-500 mb-1">
            <span>FieldOps Pro</span>
            <span>/</span>
            <span>Dhaka Division</span>
            <span>/</span>
            <span className="text-indigo-600 dark:text-indigo-400 font-bold">
              {locale === 'bn' ? 'শিডিউলিং ক্যালেন্ডার' : 'Scheduling Calendar'}
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <CalIcon className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            <span>{locale === 'bn' ? 'ফিল্ড সার্ভিস শিডিউলিং ও রোস্টার' : 'Field Service Dispatch Calendar'}</span>
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900">
            <Clock className="w-3.5 h-3.5" />
            {locale === 'bn' ? 'ঢাকা স্ট্যান্ডার্ড টাইম (BST)' : 'Dhaka Standard Time (BST UTC+6)'}
          </span>
        </div>
      </div>

      {/* Main Calendar Component */}
      <Calendar locale={locale} onNavigateToWorkOrder={onNavigateToWorkOrder} />
    </div>
  );
};
