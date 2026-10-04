import React from 'react';
import { CalendarEvent, CalendarTechnician } from '../../types/calendar';
import { isSameDay, formatTime12H } from '../../utils/calendarHelpers';
import { formatBDT } from '../../utils/formatters';
import { CalendarEventCard } from './CalendarEventCard';
import { Star, Phone, MapPin } from 'lucide-react';

export interface DayViewProps {
  currentDate: Date;
  events: CalendarEvent[];
  technicians: CalendarTechnician[];
  locale?: 'en' | 'bn';
  onSelectEvent: (event: CalendarEvent) => void;
  onSlotClick: (techId: string, hour: number) => void;
  onEventDrop?: (eventId: string, targetTechId: string, targetHour: number) => void;
}

const HOURS = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18];

export const DayView: React.FC<DayViewProps> = ({
  currentDate,
  events,
  technicians,
  locale = 'en',
  onSelectEvent,
  onSlotClick,
  onEventDrop,
}) => {
  // Events for the selected day
  const dayEvents = events.filter((e) => isSameDay(new Date(e.start), currentDate));

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 overflow-y-auto">
      {/* Technician Roster Columns Header */}
      <div className="grid grid-cols-[80px_repeat(auto-fit,minmax(180px,1fr))] border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/70 sticky top-0 z-20">
        <div className="p-3 text-center text-xs font-mono text-slate-400 border-r border-slate-200 dark:border-slate-800 flex items-center justify-center">
          Hours
        </div>

        {technicians.map((tech) => {
          const techDayEvents = dayEvents.filter((e) => e.technicianId === tech.id);
          const totalRev = techDayEvents.reduce((acc, curr) => acc + (curr.estimatedCostBDT || 0), 0);

          return (
            <div
              key={tech.id}
              className="p-2.5 sm:p-3 border-r border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2"
            >
              <div className="flex items-center gap-2 min-w-0">
                <div className="relative shrink-0">
                  <img
                    src={tech.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&fit=crop&q=80'}
                    alt={tech.name}
                    className="w-8 h-8 sm:w-9 sm:h-9 rounded-full object-cover border-2 border-white dark:border-slate-800 shadow-xs"
                  />
                  <span
                    className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full ring-2 ring-white dark:ring-slate-900 ${
                      tech.status === 'available'
                        ? 'bg-emerald-500'
                        : tech.status === 'busy'
                        ? 'bg-amber-500'
                        : 'bg-slate-400'
                    }`}
                  />
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    {locale === 'bn' && tech.nameBangla ? tech.nameBangla : tech.name}
                  </h4>
                  <div className="flex items-center gap-1 text-[10px] text-slate-500 truncate">
                    <MapPin className="w-2.5 h-2.5 text-rose-500 shrink-0" />
                    <span className="truncate">{tech.currentZone}</span>
                  </div>
                </div>
              </div>

              {/* Day workload badge */}
              <div className="text-right shrink-0">
                <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-900">
                  {techDayEvents.length} {locale === 'bn' ? 'কাজ' : 'jobs'}
                </span>
                <div className="text-[10px] font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                  {formatBDT(totalRev, locale)}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Hourly Timeline Matrix */}
      <div className="flex-1 divide-y divide-slate-100 dark:divide-slate-800/60">
        {HOURS.map((hour) => {
          const isLunch = hour === 12 || hour === 13;
          const timeLabelDate = new Date();
          timeLabelDate.setHours(hour, 0, 0, 0);

          return (
            <div
              key={hour}
              className="grid grid-cols-[80px_repeat(auto-fit,minmax(180px,1fr))] min-h-[90px] relative group"
            >
              {/* Left Hour Label */}
              <div className="p-2 text-right text-xs font-mono text-slate-400 dark:text-slate-500 border-r border-slate-200 dark:border-slate-800 select-none bg-slate-50/50 dark:bg-slate-950/20">
                {formatTime12H(timeLabelDate, locale)}
              </div>

              {/* Columns for each tech */}
              {technicians.map((tech) => {
                const matchingEvents = dayEvents.filter((evt) => {
                  const evtStart = new Date(evt.start);
                  return evt.technicianId === tech.id && evtStart.getHours() === hour;
                });

                const isTechBreak =
                  hour >= tech.workingHours.breakStartHour && hour < tech.workingHours.breakEndHour;

                return (
                  <div
                    key={tech.id}
                    onClick={() => onSlotClick(tech.id, hour)}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      const eventId = e.dataTransfer.getData('text/plain');
                      if (eventId && onEventDrop) {
                        onEventDrop(eventId, tech.id, hour);
                      }
                    }}
                    className={`border-r border-slate-200 dark:border-slate-800 p-1 relative transition-colors cursor-pointer ${
                      isTechBreak
                        ? 'bg-amber-50/20 dark:bg-amber-950/10'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
                    }`}
                  >
                    {isTechBreak && matchingEvents.length === 0 && (
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-30 text-[10px] font-mono text-amber-600 dark:text-amber-400 font-semibold select-none">
                        {locale === 'bn' ? '🍽️ লাঞ্চ বিরতি' : '🍽️ Lunch Break'}
                      </div>
                    )}

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
