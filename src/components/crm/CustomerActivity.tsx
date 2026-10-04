import React, { useState } from 'react';
import { CustomerInteraction } from '../../types/customer';
import { formatCalendarDate, formatTime12H } from '../../utils/calendarHelpers';
import { formatBDT } from '../../utils/formatters';
import {
  Phone,
  Mail,
  Users,
  MessageSquare,
  AlertCircle,
  Star,
  CheckCircle2,
  DollarSign,
  Plus,
  Calendar,
} from 'lucide-react';
import { motion } from 'motion/react';

export interface CustomerActivityProps {
  interactions: CustomerInteraction[];
  locale?: 'en' | 'bn';
  onAddInteraction: () => void;
}

const TYPE_ICONS = {
  call: { icon: Phone, color: 'text-emerald-500 bg-emerald-100 dark:bg-emerald-950/60' },
  email: { icon: Mail, color: 'text-indigo-500 bg-indigo-100 dark:bg-indigo-950/60' },
  meeting: { icon: Users, color: 'text-purple-500 bg-purple-100 dark:bg-purple-950/60' },
  site_visit: { icon: Calendar, color: 'text-blue-500 bg-blue-100 dark:bg-blue-950/60' },
  complaint: { icon: AlertCircle, color: 'text-rose-500 bg-rose-100 dark:bg-rose-950/60' },
  feedback: { icon: Star, color: 'text-amber-500 bg-amber-100 dark:bg-amber-950/60' },
  payment: { icon: DollarSign, color: 'text-emerald-600 bg-emerald-100 dark:bg-emerald-950/60' },
  note: { icon: MessageSquare, color: 'text-slate-500 bg-slate-100 dark:bg-slate-800' },
};

export const CustomerActivity: React.FC<CustomerActivityProps> = ({
  interactions,
  locale = 'en',
  onAddInteraction,
}) => {
  return (
    <div className="space-y-4 text-xs">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-bold text-sm text-slate-900 dark:text-white">
            {locale === 'bn' ? 'যোগাযোগ ও অ্যাক্টিভিটি টাইমলাইন' : 'Communication & Activity Timeline'}
          </h4>
          <p className="text-slate-500 font-mono text-[11px]">
            {interactions.length} calls, visits, reviews & notes logged.
          </p>
        </div>

        <button
          onClick={onAddInteraction}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>{locale === 'bn' ? '+ নোট / অ্যাক্টিভিটি যোগ' : '+ Log Activity / Note'}</span>
        </button>
      </div>

      {/* Activity Timeline List */}
      <div className="relative pl-6 space-y-6 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
        {interactions.map((act) => {
          const conf = TYPE_ICONS[act.type] || TYPE_ICONS.note;
          const Icon = conf.icon;

          return (
            <motion.div
              key={act.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="relative group"
            >
              {/* Bullet Icon */}
              <div
                className={`absolute -left-6 top-0 w-6 h-6 rounded-full flex items-center justify-center -translate-x-1/2 ring-4 ring-white dark:ring-slate-950 ${conf.color}`}
              >
                <Icon className="w-3.5 h-3.5" />
              </div>

              {/* Event Card */}
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1.5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 dark:text-white">{act.subject}</span>
                    <span className="text-[10px] font-bold uppercase px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                      {act.type.replace('_', ' ')}
                    </span>
                  </div>

                  <span className="text-[10px] font-mono text-slate-400">
                    {formatCalendarDate(act.createdAt, locale)} • {formatTime12H(act.createdAt, locale)}
                  </span>
                </div>

                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  {act.description}
                </p>

                {act.outcome && (
                  <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-50/60 dark:bg-emerald-950/30 p-2 rounded-lg border border-emerald-100 dark:border-emerald-900/60">
                    Outcome: {act.outcome}
                  </p>
                )}

                <div className="flex items-center justify-between pt-1 text-[10px] text-slate-400 font-mono">
                  <span>Logged by: <strong className="text-slate-700 dark:text-slate-300">{act.createdByName}</strong></span>
                  {act.amountBDT && (
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                      +{formatBDT(act.amountBDT, locale)}
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
