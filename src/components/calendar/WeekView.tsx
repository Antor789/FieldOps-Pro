import React from 'react';
import { CalendarEvent } from '../../types/calendar';
import {
  getWeekDays,
  isSameDay,
  isToday,
  DAYS_OF_WEEK_EN,
  DAYS_OF_WEEK_BN,
  formatTime12H,
} from '../../utils/calendarHelpers';
import { CalendarEventCard } from './CalendarEventCard';

export interface WeekViewProps {
  currentDate: Date;
  events: CalendarEvent[];
  locale?: 'en' | 'bn';
  onSelectEvent: (event: CalendarEvent) => void;
  onSlotClick: (date: Date, hour: number) => void;
  onEventDrop?: (eventId: string, targetDate: Date, targetHour: number) => void;
}

const HOURS = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18]; // 8 AM to 6 PM

export const WeekView: React.FC<WeekViewProps> = ({
  currentDate,
  events,
  locale = 'en',
  onSelectEvent,
  onSlotClick,
  onEventDrop,
}) => {
  const weekDays = getWeekDays(currentDate);
  const daysHeader = locale === 'bn' ? DAYS_OF_WEEK_BN : DAYS_OF_WEEK_EN;

  const toBnDigits = (n: number) =>
    String(n).replace(/\d/g, (d) => '০১২৩৪৫৬৭৮৯'[parseInt(d, 10)]);

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 overflow-y-auto">
      {/* Week Header Row */}
      <div className="grid grid-cols-8 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 sticky top-0 z-20">
        <div className="p-2.5 text-center text-[11px] font-mono text-slate-400 border-r border-slate-200 dark:border-slate-800">
          BST (Dhaka)
        </div>
        {weekDays.map((day, idx) => {
          const isCurrentToday = isToday(day);
          const isFriday = day.getDay() === 5;
          return (
            <div
              key={idx}
              className={`p-2 text-center border-r border-slate-200 dark:border-slate-800 ${
                isCurrentToday ? 'bg-indigo-50/50 dark:bg-indigo-950/30' : ''
              }`}
            >
              <div
                className={`text-xs font-semibold ${
                  isFriday ? 'text-rose-500 font-bold' : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                {daysHeader[day.getDay()]} {isFriday && (locale === 'bn' ? '(ছুটি)' : '(Off)')}
              </div>
              <div
                className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold font-mono mt-0.5 ${
                  isCurrentToday
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-800 dark:text-slate-200'
                }`}
              >
                {locale === 'bn' ? toBnDigits(day.getDate()) : day.getDate()}
              </div>
            </div>
          );
        })}
      </div>

      {/* Hourly Time Rows */}
      <div className="flex-1 divide-y divide-slate-100 dark:divide-slate-800/60">
        {HOURS.map((hour) => {
          const isLunchHour = hour === 12 || hour === 13;
          const timeLabelDate = new Date();
          timeLabelDate.setHours(hour, 0, 0, 0);

          return (
            <div key={hour} className="grid grid-cols-8 min-h-[90px] relative group">
              {/* Hour Label */}
              <div className="p-2 text-right text-xs font-mono text-slate-400 dark:text-slate-500 border-r border-slate-200 dark:border-slate-800 select-none bg-slate-50/50 dark:bg-slate-950/20">
                {formatTime12H(timeLabelDate, locale)}
              </div>

              {/* 7 Days Columns for this hour */}
              {weekDays.map((day, dIdx) => {
                const isFriday = day.getDay() === 5;
                // Find events matching this day and starting in this hour bucket
                const matchingEvents = events.filter((evt) => {
                  const evtStart = new Date(evt.start);
                  return isSameDay(evtStart, day) && evtStart.getHours() === hour;
                });

                return (
                  <div
                    key={dIdx}
                    onClick={() => onSlotClick(day, hour)}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      const eventId = e.dataTransfer.getData('text/plain');
                      if (eventId && onEventDrop) {
                        onEventDrop(eventId, day, hour);
                      }
                    }}
                    className={`border-r border-slate-200 dark:border-slate-800 p-1 relative transition-colors cursor-pointer ${
                      isFriday
                        ? 'bg-rose-50/20 dark:bg-rose-950/10'
                        : isLunchHour
                        ? 'bg-amber-50/20 dark:bg-amber-950/10'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
                    }`}
                  >
                    {/* Lunch Break Watermark */}
                    {isLunchHour && matchingEvents.length === 0 && (
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-30 text-[10px] font-mono text-amber-600 dark:text-amber-400 font-semibold select-none">
                        {locale === 'bn' ? '🍽️ লাঞ্চ বিরতি' : '🍽️ Lunch Break'}
                      </div>
                    )}

                    {/* Events rendered inside slot */}
                    <div className="space-y-1">
                      {matchingEvents.map((evt) => (
                        <CalendarEventCard
                          key={evt.id}
                          event={evt}
                          locale={locale}
                          onClick={() => onSelectEvent(evt)}
                          onDragStart={(e) => {
                            e.dataTransfer.setData('text/plain', evt.id);
                          }}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
};
