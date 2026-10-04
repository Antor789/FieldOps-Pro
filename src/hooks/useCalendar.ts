import { useState, useCallback, useMemo } from 'react';
import {
  CalendarEvent,
  CalendarTechnician,
  CalendarView,
  EventPriority,
  SchedulingConflict,
} from '../types/calendar';
import {
  INITIAL_CALENDAR_EVENTS,
  INITIAL_CALENDAR_TECHS,
} from '../data/sampleCalendarData';
import { detectSchedulingConflicts } from '../utils/conflictDetection';

export function useCalendar() {
  const [view, setView] = useState<CalendarView>('week');
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>(INITIAL_CALENDAR_EVENTS);
  const [technicians, setTechnicians] = useState<CalendarTechnician[]>(INITIAL_CALENDAR_TECHS);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

  // Filters
  const [selectedTechId, setSelectedTechId] = useState<string | 'all'>('all');
  const [selectedPriority, setSelectedPriority] = useState<EventPriority | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [isConflictModalOpen, setIsConflictModalOpen] = useState(false);
  const [isRecurrenceModalOpen, setIsRecurrenceModalOpen] = useState(false);

  // Navigation handlers
  const goToToday = useCallback(() => {
    setCurrentDate(new Date());
  }, []);

  const goToPrevious = useCallback(() => {
    setCurrentDate((prev) => {
      const d = new Date(prev);
      if (view === 'day') d.setDate(d.getDate() - 1);
      else if (view === 'week' || view === 'timeline') d.setDate(d.getDate() - 7);
      else if (view === 'month') d.setMonth(d.getMonth() - 1);
      return d;
    });
  }, [view]);

  const goToNext = useCallback(() => {
    setCurrentDate((prev) => {
      const d = new Date(prev);
      if (view === 'day') d.setDate(d.getDate() + 1);
      else if (view === 'week' || view === 'timeline') d.setDate(d.getDate() + 7);
      else if (view === 'month') d.setMonth(d.getMonth() + 1);
      return d;
    });
  }, [view]);

  const goToDate = useCallback((date: Date) => {
    setCurrentDate(new Date(date));
  }, []);

  // Events CRUD
  const addEvent = useCallback((newEvent: Omit<CalendarEvent, 'id'>) => {
    const id = `evt-${Date.now()}`;
    const eventWithId: CalendarEvent = { ...newEvent, id };
    setEvents((prev) => [eventWithId, ...prev]);
    return eventWithId;
  }, []);

  const updateEvent = useCallback((id: string, updates: Partial<CalendarEvent>) => {
    setEvents((prev) =>
      prev.map((evt) => (evt.id === id ? { ...evt, ...updates } : evt))
    );
    setSelectedEvent((prev) => (prev?.id === id ? { ...prev, ...updates } : prev));
  }, []);

  const deleteEvent = useCallback((id: string) => {
    setEvents((prev) => prev.filter((evt) => evt.id !== id));
    if (selectedEvent?.id === id) {
      setSelectedEvent(null);
    }
  }, [selectedEvent]);

  const moveEvent = useCallback(
    (id: string, newStart: Date, newTechId?: string) => {
      setEvents((prev) =>
        prev.map((evt) => {
          if (evt.id !== id) return evt;
          const duration = evt.durationMins || 60;
          const newEnd = new Date(newStart.getTime() + duration * 60 * 1000);

          let updatedTechName = evt.technicianName;
          let updatedTechRole = evt.technicianRole;

          if (newTechId && newTechId !== evt.technicianId) {
            const matchedTech = technicians.find((t) => t.id === newTechId);
            if (matchedTech) {
              updatedTechName = matchedTech.name;
              updatedTechRole = matchedTech.role;
            }
          }

          return {
            ...evt,
            start: newStart,
            end: newEnd,
            technicianId: newTechId || evt.technicianId,
            technicianName: updatedTechName,
            technicianRole: updatedTechRole,
          };
        })
      );
    },
    [technicians]
  );

  // Filtered Events
  const filteredEvents = useMemo(() => {
    return events.filter((evt) => {
      // Tech filter
      if (selectedTechId !== 'all' && evt.technicianId !== selectedTechId) {
        return false;
      }
      // Priority filter
      if (selectedPriority !== 'all' && evt.priority !== selectedPriority) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = evt.title.toLowerCase().includes(q) || (evt.titleBangla && evt.titleBangla.includes(q));
        const matchesWo = evt.workOrderNumber.toLowerCase().includes(q);
        const matchesTech = evt.technicianName.toLowerCase().includes(q);
        const matchesLoc = evt.location.toLowerCase().includes(q);
        if (!matchesTitle && !matchesWo && !matchesTech && !matchesLoc) {
          return false;
        }
      }
      return true;
    });
  }, [events, selectedTechId, selectedPriority, searchQuery]);

  // Detected Conflicts
  const detectedConflicts: SchedulingConflict[] = useMemo(() => {
    return detectSchedulingConflicts(events, technicians, 30);
  }, [events, technicians]);

  return {
    view,
    setView,
    currentDate,
    setCurrentDate,
    goToToday,
    goToPrevious,
    goToNext,
    goToDate,
    events: filteredEvents,
    allEvents: events,
    technicians,
    setTechnicians,
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
    searchQuery,
    setSearchQuery,
    detectedConflicts,
    isScheduleModalOpen,
    setIsScheduleModalOpen,
    isConflictModalOpen,
    setIsConflictModalOpen,
    isRecurrenceModalOpen,
    setIsRecurrenceModalOpen,
  };
}
