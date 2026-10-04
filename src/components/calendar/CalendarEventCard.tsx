import React from 'react';
import { CalendarEvent } from '../../types/calendar';
import { formatTime12H, formatDuration } from '../../utils/calendarHelpers';
import { formatBDT } from '../../utils/formatters';
import { Clock, MapPin, AlertTriangle, Sparkles, User, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';

export interface CalendarEventCardProps {
  event: CalendarEvent;
  isCompact?: boolean;
  locale?: 'en' | 'bn';
  onClick?: () => void;
  onDragStart?: (e: React.DragEvent) => void;
}

const PRIORITY_STYLES = {
  emergency: {
    border: 'border-l-rose-500',
    bg: 'bg-rose-50/90 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900/60',
    text: 'text-rose-900 dark:text-rose-200',
    badge: 'bg-rose-500 text-white',
  },
  critical: {
    border: 'border-l-orange-500',
    bg: 'bg-orange-50/90 dark:bg-orange-950/40 border-orange-200 dark:border-orange-900/60',
    text: 'text-orange-900 dark:text-orange-200',
    badge: 'bg-orange-500 text-white',
  },
  high: {
    border: 'border-l-amber-500',
    bg: 'bg-amber-50/90 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900/60',
    text: 'text-amber-900 dark:text-amber-200',
    badge: 'bg-amber-500 text-white',
  },
  medium: {
    border: 'border-l-indigo-500',
    bg: 'bg-indigo-50/90 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-900/60',
    text: 'text-indigo-900 dark:text-indigo-200',
    badge: 'bg-indigo-600 text-white',
  },
  low: {
    border: 'border-l-slate-400',
    bg: 'bg-slate-50/90 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700',
    text: 'text-slate-900 dark:text-slate-200',
    badge: 'bg-slate-500 text-white',
  },
};

export const CalendarEventCard: React.FC<CalendarEventCardProps> = ({
  event,
  isCompact = false,
  locale = 'en',
  onClick,
  onDragStart,
}) => {
  const style = PRIORITY_STYLES[event.priority] || PRIORITY_STYLES.medium;
  const timeStr = `${formatTime12H(event.start, locale)} - ${formatTime12H(event.end, locale)}`;

  // Compact month or mini preview
  if (isCompact) {
    return (
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onClick}
        draggable
        onDragStart={onDragStart}
        className={`px-2 py-1 rounded text-xs border-l-2 ${style.border} ${style.bg} cursor-pointer shadow-xs truncate select-none transition-all`}
        title={`${event.workOrderNumber}: ${event.title} (${timeStr})`}
      >
        <div className="flex items-center gap-1">
          <span className="font-mono font-bold text-[10px] text-slate-600 dark:text-slate-300">
            {event.workOrderNumber}
          </span>
          <span className={`font-medium truncate ${style.text}`}>
            {locale === 'bn' && event.titleBangla ? event.titleBangla : event.title}
          </span>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      whileHover={{ y: -2, boxShadow: '0 8px 20px -4px rgba(0,0,0,0.12)' }}
      whileTap={{ scale: 0.99 }}
      onClick={onClick}
      draggable
      onDragStart={onDragStart}
      className={`relative p-2.5 rounded-lg border border-l-4 ${style.border} ${style.bg} cursor-grab active:cursor-grabbing select-none transition-all`}
    >
      {/* Top Bar: Work Order number & Priority Badge */}
      <div className="flex items-center justify-between gap-1 mb-1">
        <div className="flex items-center gap-1.5">
          <span className="font-mono font-bold text-xs bg-white/80 dark:bg-slate-900/80 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200">
            {event.workOrderNumber}
          </span>
          {event.priority === 'emergency' && (
            <span className="flex items-center gap-0.5 text-[10px] font-extrabold uppercase px-1.5 py-0.2 rounded-full bg-rose-500 text-white animate-pulse">
              <AlertTriangle className="w-2.5 h-2.5" />
              SLA!
            </span>
          )}
        </div>
        <span className="text-[11px] font-mono font-bold text-emerald-600 dark:text-emerald-400">
          {formatBDT(event.estimatedCostBDT, locale)}
        </span>
      </div>

      {/* Title */}
      <h4 className={`text-xs font-semibold leading-tight line-clamp-2 mb-1.5 ${style.text}`}>
        {locale === 'bn' && event.titleBangla ? event.titleBangla : event.title}
      </h4>

      {/* Metadata Footnote */}
      <div className="space-y-1 text-[11px] text-slate-600 dark:text-slate-400 font-sans">
        <div className="flex items-center gap-1 text-[10px] font-mono text-slate-500 dark:text-slate-400">
          <Clock className="w-3 h-3 text-slate-400 shrink-0" />
          <span>{timeStr}</span>
          <span className="text-slate-300 dark:text-slate-600">•</span>
          <span>{formatDuration(event.durationMins, locale)}</span>
        </div>

        <div className="flex items-center gap-1 truncate">
          <User className="w-3 h-3 text-indigo-500 shrink-0" />
          <span className="font-medium text-slate-700 dark:text-slate-200 truncate">
            {event.technicianName}
          </span>
        </div>

        {event.location && (
          <div className="flex items-center gap-1 truncate text-slate-500">
            <MapPin className="w-3 h-3 text-rose-500 shrink-0" />
            <span className="truncate">
              {locale === 'bn' && event.locationBangla ? event.locationBangla : event.location}
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
};
