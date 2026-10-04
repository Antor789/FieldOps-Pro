import React, { useState } from 'react';
import { useCalendar } from '../../hooks/useCalendar';
import { CalendarHeader } from './CalendarHeader';
import { MonthView } from './MonthView';
import { WeekView } from './WeekView';
import { DayView } from './DayView';
import { TimelineView } from './TimelineView';
import { TechnicianSidebar } from './TechnicianSidebar';
import { ScheduleJobModal } from './ScheduleJobModal';
import { ConflictModal } from './ConflictModal';
import { RecurrenceModal } from './RecurrenceModal';
import { CalendarEvent } from '../../types/calendar';
import { formatCalendarDate, formatTime12H } from '../../utils/calendarHelpers';
import { formatBDT } from '../../utils/formatters';
import {
  X,
  Clock,
  MapPin,
  User,
  Phone,
  CheckCircle2,
  Trash2,
  AlertTriangle,
  ExternalLink,
  MessageSquare,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export interface CalendarProps {
  locale?: 'en' | 'bn';
  onNavigateToWorkOrder?: (workOrderId: string) => void;
}

export const Calendar: React.FC<CalendarProps> = ({
  locale = 'en',
  onNavigateToWorkOrder,
}) => {
  const {
    view,
    setView,
    currentDate,
    goToToday,
    goToPrevious,
    goToNext,
    goToDate,
    events,
    technicians,
    selectedEvent,
    setSelectedEvent,
    addEvent,
    updateEvent,
    deleteEvent,
    moveEvent,
    selectedTechId,
    setSelectedTechId,
    selectedPriority,
    setSelectedPriority,
    detectedConflicts,
    isScheduleModalOpen,
    setIsScheduleModalOpen,
    isConflictModalOpen,
    setIsConflictModalOpen,
    isRecurrenceModalOpen,
    setIsRecurrenceModalOpen,
  } = useCalendar();

  // Quick Add slot modal helper
  const handleQuickAdd = (date: Date, hour: number = 9) => {
    goToDate(date);
    setIsScheduleModalOpen(true);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] min-h-[680px] bg-slate-100 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
      {/* Top Controls Header */}
      <CalendarHeader
        view={view}
        currentDate={currentDate}
        locale={locale}
        technicians={technicians}
        selectedTechId={selectedTechId}
        selectedPriority={selectedPriority}
        conflictCount={detectedConflicts.length}
        onViewChange={setView}
        onPrev={goToPrevious}
        onNext={goToNext}
        onToday={goToToday}
        onTechChange={setSelectedTechId}
        onPriorityChange={setSelectedPriority}
        onOpenScheduleModal={() => setIsScheduleModalOpen(true)}
        onOpenConflictModal={() => setIsConflictModalOpen(true)}
        onOpenRecurrenceModal={() => setIsRecurrenceModalOpen(true)}
      />

      {/* Main Workspace: Technician Roster + Dynamic Calendar View */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left Tech Roster Sidebar */}
        <TechnicianSidebar
          technicians={technicians}
          selectedTechId={selectedTechId}
          locale={locale}
          onSelectTech={setSelectedTechId}
        />

        {/* Dynamic View Canvas */}
        <div className="flex-1 flex flex-col overflow-hidden relative">
          {view === 'month' && (
            <MonthView
              currentDate={currentDate}
              events={events}
              locale={locale}
              onSelectEvent={setSelectedEvent}
              onSelectDate={(date) => {
                goToDate(date);
                setView('day');
              }}
              onQuickAdd={(date) => handleQuickAdd(date, 9)}
            />
          )}

          {view === 'week' && (
            <WeekView
              currentDate={currentDate}
              events={events}
              locale={locale}
              onSelectEvent={setSelectedEvent}
              onSlotClick={(date, hour) => handleQuickAdd(date, hour)}
              onEventDrop={(eventId, targetDate, targetHour) => {
                const target = new Date(targetDate);
                target.setHours(targetHour, 0, 0, 0);
                moveEvent(eventId, target);
              }}
            />
          )}

          {view === 'day' && (
            <DayView
              currentDate={currentDate}
              events={events}
              technicians={
                selectedTechId === 'all'
                  ? technicians
                  : technicians.filter((t) => t.id === selectedTechId)
              }
              locale={locale}
              onSelectEvent={setSelectedEvent}
              onSlotClick={(techId, hour) => {
                setSelectedTechId(techId);
                handleQuickAdd(currentDate, hour);
              }}
              onEventDrop={(eventId, targetTechId, targetHour) => {
                const target = new Date(currentDate);
                target.setHours(targetHour, 0, 0, 0);
                moveEvent(eventId, target, targetTechId);
              }}
            />
          )}

          {view === 'timeline' && (
            <TimelineView
              currentDate={currentDate}
              events={events}
              technicians={
                selectedTechId === 'all'
                  ? technicians
                  : technicians.filter((t) => t.id === selectedTechId)
              }
              locale={locale}
              onSelectEvent={setSelectedEvent}
            />
          )}
        </div>
      </div>

      {/* Event Details Slide-Over Drawer */}
      <AnimatePresence>
        {selectedEvent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex justify-end"
            onClick={() => setSelectedEvent(null)}
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 250 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md bg-white dark:bg-slate-900 h-full shadow-2xl border-l border-slate-200 dark:border-slate-800 p-6 flex flex-col justify-between overflow-y-auto"
            >
              <div className="space-y-5">
                {/* Header */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-sm px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
                      {selectedEvent.workOrderNumber}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-xs font-bold uppercase bg-indigo-100 text-indigo-700 dark:bg-indigo-900/60 dark:text-indigo-300">
                      {selectedEvent.priority}
                    </span>
                  </div>
                  <button
                    onClick={() => setSelectedEvent(null)}
                    className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Title */}
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">
                    {locale === 'bn' && selectedEvent.titleBangla
                      ? selectedEvent.titleBangla
                      : selectedEvent.title}
                  </h3>
                  {selectedEvent.description && (
                    <p className="text-xs text-slate-500 mt-1">{selectedEvent.description}</p>
                  )}
                </div>

                {/* Meta details grid */}
                <div className="bg-slate-50 dark:bg-slate-800/60 rounded-xl p-4 space-y-3 border border-slate-200/80 dark:border-slate-700/60 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-indigo-500" />
                      {locale === 'bn' ? 'নির্ধারিত সময়:' : 'Time Slot:'}
                    </span>
                    <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                      {formatTime12H(selectedEvent.start, locale)} -{' '}
                      {formatTime12H(selectedEvent.end, locale)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 flex items-center gap-1.5">
                      <User className="w-4 h-4 text-emerald-500" />
                      {locale === 'bn' ? 'অ্যাসাইন টেকনিশিয়ান:' : 'Technician:'}
                    </span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      {selectedEvent.technicianName}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-rose-500" />
                      {locale === 'bn' ? 'সাইট / অবস্থান:' : 'Location:'}
                    </span>
                    <span className="font-medium text-slate-700 dark:text-slate-300 text-right truncate max-w-[200px]">
                      {selectedEvent.location}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-700">
                    <span className="text-slate-500">
                      {locale === 'bn' ? 'মোট ইনভয়েস মূল্য:' : 'Estimated Fee:'}
                    </span>
                    <span className="font-mono font-extrabold text-sm text-emerald-600 dark:text-emerald-400">
                      {formatBDT(selectedEvent.estimatedCostBDT, locale)}
                    </span>
                  </div>
                </div>

                {/* Quick Dispatch Actions */}
                <div className="space-y-2">
                  {onNavigateToWorkOrder && (
                    <button
                      onClick={() => {
                        onNavigateToWorkOrder(selectedEvent.workOrderId);
                        setSelectedEvent(null);
                      }}
                      className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 shadow-xs"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>{locale === 'bn' ? 'ওয়ার্ক অর্ডার ফাইলে যান' : 'Open Work Order in Kanban'}</span>
                    </button>
                  )}

                  <button
                    onClick={() => {
                      updateEvent(selectedEvent.id, { status: 'completed' });
                      setSelectedEvent(null);
                    }}
                    className="w-full py-2 px-4 rounded-xl text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-900 hover:bg-emerald-100 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{locale === 'bn' ? 'সম্পন্ন হিসেবে চিহ্নিত করুন' : 'Mark as Completed & Signed'}</span>
                  </button>
                </div>
              </div>

              {/* Delete trigger */}
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center">
                <button
                  onClick={() => deleteEvent(selectedEvent.id)}
                  className="text-xs font-semibold text-rose-600 hover:text-rose-700 dark:text-rose-400 flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>{locale === 'bn' ? 'শিডিউল থেকে মুছুন' : 'Remove Schedule'}</span>
                </button>
                <span className="text-[11px] text-slate-400 font-mono">ID: {selectedEvent.id}</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modals */}
      <ScheduleJobModal
        isOpen={isScheduleModalOpen}
        technicians={technicians}
        locale={locale}
        onClose={() => setIsScheduleModalOpen(false)}
        onSchedule={addEvent}
      />

      <ConflictModal
        isOpen={isConflictModalOpen}
        conflicts={detectedConflicts}
        locale={locale}
        onClose={() => setIsConflictModalOpen(false)}
      />

      <RecurrenceModal
        isOpen={isRecurrenceModalOpen}
        locale={locale}
        onClose={() => setIsRecurrenceModalOpen(false)}
      />
    </div>
  );
};
