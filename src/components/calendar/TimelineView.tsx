import React from 'react';
import { CalendarEvent, CalendarTechnician } from '../../types/calendar';
import { isSameDay, formatTime12H } from '../../utils/calendarHelpers';
import { formatBDT } from '../../utils/formatters';
import { Clock, MapPin, AlertTriangle, User } from 'lucide-react';
import { motion } from 'motion/react';

export interface TimelineViewProps {
  currentDate: Date;
  events: CalendarEvent[];
  technicians: CalendarTechnician[];
  locale?: 'en' | 'bn';
  onSelectEvent: (event: CalendarEvent) => void;
  onSlotClick?: (techId: string, hour: number) => void;
}

const START_HOUR = 8;
const END_HOUR = 19;
const TOTAL_HOURS = END_HOUR - START_HOUR; // 11 hours (8 AM - 7 PM)

const PRIORITY_BG: { [key: string]: string } = {
  emergency: 'bg-rose-500 border-rose-600 text-white',
  critical: 'bg-orange-500 border-orange-600 text-white',
  high: 'bg-amber-500 border-amber-600 text-white',
  medium: 'bg-indigo-600 border-indigo-700 text-white',
  low: 'bg-slate-500 border-slate-600 text-white',
};

export const TimelineView: React.FC<TimelineViewProps> = ({
  currentDate,
  events,
  technicians,
  locale = 'en',
  onSelectEvent,
  onSlotClick,
}) => {
  const dayEvents = events.filter((e) => isSameDay(new Date(e.start), currentDate));
  const hours = Array.from({ length: TOTAL_HOURS }, (_, i) => START_HOUR + i);

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 overflow-x-auto overflow-y-auto">
      {/* Timeline Header (Hour markers) */}
      <div className="flex min-w-[900px] border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/70 sticky top-0 z-20">
        <div className="w-56 p-3 text-xs font-bold text-slate-700 dark:text-slate-300 border-r border-slate-200 dark:border-slate-800 shrink-0">
          {locale === 'bn' ? 'টেকনিশিয়ান রোস্টার' : 'Technician Roster'}
        </div>

        <div className="flex-1 grid grid-cols-11 text-center text-xs font-mono text-slate-500 dark:text-slate-400">
          {hours.map((h) => {
            const d = new Date();
            d.setHours(h, 0, 0, 0);
            return (
              <div key={h} className="py-2.5 border-r border-slate-200/60 dark:border-slate-800/60">
                {formatTime12H(d, locale)}
              </div>
            );
          })}
        </div>
      </div>

      {/* Technician Timeline Gantt Rows */}
      <div className="divide-y divide-slate-200 dark:divide-slate-800 min-w-[900px]">
        {technicians.map((tech) => {
          const techEvents = dayEvents.filter((e) => e.technicianId === tech.id);

          return (
            <div key={tech.id} className="flex min-h-[95px] relative group hover:bg-slate-50/50 dark:hover:bg-slate-800/20">
              {/* Left Tech Profile Card */}
              <div className="w-56 p-3 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shrink-0 flex items-center justify-between gap-2 select-none">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="relative shrink-0">
                    <img
                      src={tech.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&fit=crop&q=80'}
                      alt={tech.name}
                      className="w-8 h-8 rounded-full object-cover border border-slate-200 dark:border-slate-700 shadow-xs"
                    />
                    <span
                      className={`absolute bottom-0 right-0 w-2 h-2 rounded-full ring-1 ring-white dark:ring-slate-900 ${
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
                    <p className="text-[10px] text-slate-500 truncate">{tech.currentZone}</p>
                  </div>
                </div>

                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold shrink-0">
                  {techEvents.length} {locale === 'bn' ? 'কাজ' : 'jobs'}
                </span>
              </div>

              {/* Gantt Timeline Area (11 Hour columns background) */}
              <div className="flex-1 relative">
                {/* Background Grid Columns */}
                <div className="absolute inset-0 grid grid-cols-11 pointer-events-none">
                  {hours.map((h) => {
                    const isBreak =
                      h >= tech.workingHours.breakStartHour && h < tech.workingHours.breakEndHour;
                    return (
                      <div
                        key={h}
                        className={`border-r border-slate-100 dark:border-slate-800/40 ${
                          isBreak ? 'bg-amber-500/5 dark:bg-amber-500/10' : ''
                        }`}
                      />
                    );
                  })}
                </div>

                {/* Scheduled Events Blocks */}
                <div className="relative h-full py-2.5 px-1">
                  {techEvents.map((evt) => {
                    const start = new Date(evt.start);
                    const end = new Date(evt.end);

                    const startHours = start.getHours() + start.getMinutes() / 60;
                    const endHours = end.getHours() + end.getMinutes() / 60;

                    // Calculate left offset & width percentage relative to 8 AM - 7 PM
                    const leftPct = Math.max(0, ((startHours - START_HOUR) / TOTAL_HOURS) * 100);
                    const widthPct = Math.min(
                      100 - leftPct,
                      ((endHours - startHours) / TOTAL_HOURS) * 100
                    );

                    const bgClass = PRIORITY_BG[evt.priority] || PRIORITY_BG.medium;

                    return (
                      <motion.div
                        key={evt.id}
                        whileHover={{ y: -2, zIndex: 30 }}
                        whileTap={{ scale: 0.99 }}
                        onClick={() => onSelectEvent(evt)}
                        style={{
                          left: `${leftPct}%`,
                          width: `${Math.max(widthPct, 6)}%`,
                        }}
                        className={`absolute top-2.5 bottom-2.5 rounded-lg border p-2 shadow-md cursor-pointer overflow-hidden transition-all select-none ${bgClass}`}
                        title={`${evt.workOrderNumber}: ${evt.title} (${formatTime12H(start, locale)} - ${formatTime12H(end, locale)})`}
                      >
                        <div className="flex items-center justify-between gap-1 mb-0.5">
                          <span className="font-mono font-extrabold text-[10px] bg-black/20 px-1 py-0.2 rounded">
                            {evt.workOrderNumber}
                          </span>
                          <span className="text-[10px] font-mono font-bold">
                            {formatBDT(evt.estimatedCostBDT, locale)}
                          </span>
                        </div>

                        <p className="text-[11px] font-bold truncate leading-tight">
                          {locale === 'bn' && evt.titleBangla ? evt.titleBangla : evt.title}
                        </p>

                        <div className="flex items-center gap-2 text-[10px] opacity-90 truncate mt-0.5">
                          <span className="flex items-center gap-0.5 truncate">
                            <MapPin className="w-2.5 h-2.5 shrink-0" />
                            {evt.zone || evt.location}
                          </span>
                          <span>•</span>
                          <span className="font-mono">
                            {formatTime12H(start, locale)}
                          </span>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
