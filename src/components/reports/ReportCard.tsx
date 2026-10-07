import React from 'react';
import { ReportTemplate } from '../../types/reports';
import {
  ClipboardList,
  BarChart3,
  Timer,
  MapPin,
  DollarSign,
  FileCheck,
  CreditCard,
  Trophy,
  Clock,
  Users,
  Boxes,
  Play,
  Calendar,
  Sparkles,
} from 'lucide-react';
import { motion } from 'motion/react';

export interface ReportCardProps {
  template: ReportTemplate;
  locale?: 'en' | 'bn';
  onGenerate: (template: ReportTemplate) => void;
  onSchedule?: (template: ReportTemplate) => void;
}

const ICON_MAP: Record<string, any> = {
  ClipboardList,
  BarChart3,
  Timer,
  MapPin,
  DollarSign,
  FileCheck,
  CreditCard,
  Trophy,
  Clock,
  Users,
  Boxes,
};

const CATEGORY_TAGS: Record<string, { label: string; labelBn: string; color: string }> = {
  operations: { label: 'Operations', labelBn: 'অপারেশন', color: 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-800' },
  financial: { label: 'Financial', labelBn: 'ফাইন্যান্সিয়াল', color: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800' },
  technician: { label: 'Technician', labelBn: 'টেকনিশিয়ান', color: 'bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 border-purple-200 dark:border-purple-800' },
  customer: { label: 'Customer CRM', labelBn: 'গ্রাহক সিআরএম', color: 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300 border-amber-200 dark:border-amber-800' },
  inventory: { label: 'Inventory', labelBn: 'ইনভেন্টরি', color: 'bg-cyan-50 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800' },
  compliance: { label: 'NBR Compliance', labelBn: 'এনবিআর কমপ্লায়েন্স', color: 'bg-rose-50 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300 border-rose-200 dark:border-rose-800' },
};

export const ReportCard: React.FC<ReportCardProps> = ({
  template,
  locale = 'en',
  onGenerate,
  onSchedule,
}) => {
  const IconComponent = ICON_MAP[template.icon] || ClipboardList;
  const tag = CATEGORY_TAGS[template.category] || CATEGORY_TAGS.operations;

  return (
    <motion.div
      whileHover={{ y: -3, transition: { duration: 0.15 } }}
      className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
    >
      <div>
        {/* Top Badges & Category */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${tag.color}`}>
            {locale === 'bn' ? tag.labelBn : tag.label}
          </span>
          {template.isSystem && (
            <span className="flex items-center gap-1 text-[10px] font-medium text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
              <Sparkles className="w-2.5 h-2.5 text-amber-500" />
              Built-in
            </span>
          )}
        </div>

        {/* Title & Icon */}
        <div className="flex items-start gap-3.5 mb-2.5">
          <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 shrink-0">
            <IconComponent className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
              {locale === 'bn' && template.nameBangla ? template.nameBangla : template.name}
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
              {locale === 'bn' && template.descriptionBangla ? template.descriptionBangla : template.description}
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="pt-4 mt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
        <button
          onClick={() => onGenerate(template)}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs hover:shadow-sm transition-all"
        >
          <Play className="w-3.5 h-3.5 fill-white" />
          {locale === 'bn' ? 'রিপোর্ট দেখুন' : 'Generate'}
        </button>

        {template.canSchedule && onSchedule && (
          <button
            onClick={() => onSchedule(template)}
            title="Schedule automatic email dispatch"
            className="flex items-center justify-center gap-1 py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium transition-colors"
          >
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">{locale === 'bn' ? 'শিডিউল' : 'Schedule'}</span>
          </button>
        )}
      </div>
    </motion.div>
  );
};
