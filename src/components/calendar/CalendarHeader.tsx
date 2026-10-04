import React from 'react';
import { CalendarView, CalendarTechnician, EventPriority } from '../../types/calendar';
import { formatCalendarDate } from '../../utils/calendarHelpers';
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Plus,
  Filter,
  AlertTriangle,
  Clock,
  Sparkles,
  Repeat,
} from 'lucide-react';
import { motion } from 'motion/react';

export interface CalendarHeaderProps {
  view: CalendarView;
  currentDate: Date;
  locale?: 'en' | 'bn';
  technicians: CalendarTechnician[];
  selectedTechId: string | 'all';
  selectedPriority: EventPriority | 'all';
  conflictCount: number;
  onViewChange: (view: CalendarView) => void;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
  onTechChange: (techId: string | 'all') => void;
  onPriorityChange: (priority: EventPriority | 'all') => void;
  onOpenScheduleModal: () => void;
  onOpenConflictModal: () => void;
  onOpenRecurrenceModal: () => void;
}

export const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  view,
  currentDate,
  locale = 'en',
  technicians,
  selectedTechId,
  selectedPriority,
  conflictCount,
  onViewChange,
  onPrev,
  onNext,
  onToday,
  onTechChange,
  onPriorityChange,
  onOpenScheduleModal,
  onOpenConflictModal,
  onOpenRecurrenceModal,
}) => {
  return (
    <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-3 sm:p-4 transition-colors">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 sm:gap-4">
        {/* Left: Date Navigation & Title */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg border border-slate-200 dark:border-slate-700">
            <button
              onClick={onPrev}
              title={locale === 'bn' ? 'পূর্ববর্তী' : 'Previous'}
              className="p-1.5 rounded-md hover:bg-white dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={onToday}
              className="px-2.5 py-1 text-xs font-semibold rounded-md hover:bg-white dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 transition-colors"
            >
              {locale === 'bn' ? 'আজ' : 'Today'}
            </button>
            <button
              onClick={onNext}
              title={locale === 'bn' ? 'পরবর্তী' : 'Next'}
              className="p-1.5 rounded-md hover:bg-white dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Formatted Date Title */}
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-indigo-600 dark:text-indigo-400 hidden sm:block" />
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight">
              {formatCalendarDate(currentDate, locale)}
            </h2>
            <span className="hidden md:inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
              <Clock className="w-3 h-3 text-emerald-500" />
              BST (UTC+6)
            </span>
          </div>

          {/* Conflict Warning Pill if any */}
          {conflictCount > 0 && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onOpenConflictModal}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 dark:bg-rose-950/70 border border-rose-300 dark:border-rose-800 text-rose-700 dark:text-rose-300 animate-pulse cursor-pointer shadow-xs"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
              <span>
                {conflictCount} {locale === 'bn' ? 'সংঘর্ষ সনাক্ত' : 'Conflicts'}
              </span>
            </motion.button>
          )}
        </div>

        {/* Right: View Switcher, Filters & Action CTAs */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {/* View Mode Buttons */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-medium">
            <button
              onClick={() => onViewChange('day')}
              className={`px-2.5 py-1.5 rounded-md transition-all ${
                view === 'day'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 font-bold shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {locale === 'bn' ? 'দিন' : 'Day'}
            </button>
            <button
              onClick={() => onViewChange('week')}
              className={`px-2.5 py-1.5 rounded-md transition-all ${
                view === 'week'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 font-bold shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {locale === 'bn' ? 'সপ্তাহ' : 'Week'}
            </button>
            <button
              onClick={() => onViewChange('month')}
              className={`px-2.5 py-1.5 rounded-md transition-all ${
                view === 'month'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 font-bold shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {locale === 'bn' ? 'মাস' : 'Month'}
            </button>
            <button
              onClick={() => onViewChange('timeline')}
              className={`px-2.5 py-1.5 rounded-md transition-all ${
                view === 'timeline'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 font-bold shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {locale === 'bn' ? 'টাইমলাইন' : 'Timeline'}
            </button>
          </div>

          {/* Technician Filter */}
          <div className="relative">
            <select
              value={selectedTechId}
              onChange={(e) => onTechChange(e.target.value)}
              className="text-xs font-medium pl-2.5 pr-7 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none appearance-none cursor-pointer"
            >
              <option value="all">{locale === 'bn' ? 'সকল টেকনিশিয়ান' : 'All Technicians'}</option>
              {technicians.map((t) => (
                <option key={t.id} value={t.id}>
                  {locale === 'bn' && t.nameBangla ? t.nameBangla : t.name} ({t.currentZone})
                </option>
              ))}
            </select>
          </div>

          {/* Priority Filter */}
          <div className="relative">
            <select
              value={selectedPriority}
              onChange={(e) => onPriorityChange(e.target.value as EventPriority | 'all')}
              className="text-xs font-medium pl-2.5 pr-7 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none appearance-none cursor-pointer"
            >
              <option value="all">{locale === 'bn' ? 'সকল প্রায়োরিটি' : 'All Priorities'}</option>
              <option value="emergency">🚨 Emergency (জরুরী)</option>
              <option value="critical">🔴 Critical (জটিল)</option>
              <option value="high">🟠 High (উচ্চ)</option>
              <option value="medium">🔵 Medium (মাঝারি)</option>
              <option value="low">⚪ Low (নিম্ন)</option>
            </select>
          </div>

          {/* Recurrence Setup button */}
          <button
            onClick={onOpenRecurrenceModal}
            title={locale === 'bn' ? 'পুনরাবৃত্তিমূলক শিডিউল' : 'Recurring Schedule'}
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
          >
            <Repeat className="w-4 h-4" />
          </button>

          {/* Create / Dispatch CTAs */}
          <button
            onClick={onOpenScheduleModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>{locale === 'bn' ? '+ নতুন কাজ শিডিউল' : '+ Schedule Job'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
