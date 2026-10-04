import React from 'react';
import { CalendarEvent } from '../../types/calendar';
import {
  getMonthGridDays,
  isSameDay,
  isToday,
  DAYS_OF_WEEK_EN,
  DAYS_OF_WEEK_BN,
} from '../../utils/calendarHelpers';
import { CalendarEventCard } from './CalendarEventCard';
import { Plus } from 'lucide-react';

export interface MonthViewProps {
  currentDate: Date;
  events: CalendarEvent[];
  locale?: 'en' | 'bn';
  onSelectEvent: (event: CalendarEvent) => void;
  onSelectDate: (date: Date) => void;
  onQuickAdd: (date: Date) => void;
}

export const MonthView: React.FC<MonthViewProps> = ({
  currentDate,
  events,
  locale = 'en',
  onSelectEvent,
  onSelectDate,
  onQuickAdd,
}) => {
  const days = getMonthGridDays(currentDate);
  const daysHeader = locale === 'bn' ? DAYS_OF_WEEK_BN : DAYS_OF_WEEK_EN;
  const currentMonth = currentDate.getMonth();

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 overflow-hidden">
      {/* 7-column weekday headers */}
      <div className="grid grid-cols-7 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 text-center py-2 font-semibold text-xs text-slate-600 dark:text-slate-400">
        {daysHeader.map((name, i) => (
          <div key={i} className={i === 5 ? 'text-rose-500 dark:text-rose-400 font-bold' : ''}>
            {name} {i === 5 && (locale === 'bn' ? '(ছুটি)' : '(Off)')}
          </div>
        ))}
      </div>

      {/* Month Days Grid */}
      <div className="grid grid-cols-7 flex-1 auto-rows-fr divide-x divide-y divide-slate-200 dark:divide-slate-800 border-b border-slate-200 dark:border-slate-800 overflow-y-auto">
        {days.map((day, idx) => {
          const isCurrMonth = day.getMonth() === currentMonth;
          const dayEvents = events.filter((e) => isSameDay(new Date(e.start), day));
          const isCurrentToday = isToday(day);
          const isFriday = day.getDay() === 5;

          const toBnDigits = (n: number) =>
            String(n).replace(/\d/g, (d) => '০১২৩৪৫৬৭৮৯'[parseInt(d, 10)]);

          return (
            <div
              key={idx}
              onClick={() => onSelectDate(day)}
              className={`min-h-[100px] sm:min-h-[120px] p-1.5 sm:p-2 flex flex-col justify-between transition-colors group cursor-pointer ${
                isCurrMonth
                  ? isFriday
                    ? 'bg-rose-50/30 dark:bg-rose-950/10'
                    : 'bg-white dark:bg-slate-900'
                  : 'bg-slate-50/50 dark:bg-slate-950/40 opacity-50'
              } hover:bg-indigo-50/40 dark:hover:bg-slate-800/60`}
            >
              {/* Day Number Header */}
              <div className="flex items-center justify-between mb-1">
                <span
                  className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold font-mono transition-transform group-hover:scale-110 ${
                    isCurrentToday
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : isFriday
                      ? 'text-rose-600 dark:text-rose-400 font-extrabold'
                      : isCurrMonth
                      ? 'text-slate-800 dark:text-slate-200'
                      : 'text-slate-400 dark:text-slate-600'
                  }`}
                >
                  {locale === 'bn' ? toBnDigits(day.getDate()) : day.getDate()}
                </span>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onQuickAdd(day);
                  }}
                  title={locale === 'bn' ? 'কাজ যোগ করুন' : 'Add work order'}
                  className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-indigo-100 dark:hover:bg-slate-700 text-indigo-600 dark:text-indigo-400 transition-opacity"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Day Event Chips */}
              <div className="flex-1 space-y-1 overflow-hidden">
                {dayEvents.slice(0, 3).map((evt) => (
                  <CalendarEventCard
                    key={evt.id}
                    event={evt}
                    isCompact
                    locale={locale}
                    onClick={() => onSelectEvent(evt)}
                  />
                ))}

                {dayEvents.length > 3 && (
                  <div className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 font-mono px-1">
                    +{dayEvents.length - 3} {locale === 'bn' ? 'টি আরো' : 'more'}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
