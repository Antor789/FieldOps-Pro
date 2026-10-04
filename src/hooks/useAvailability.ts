import { useMemo } from 'react';
import { CalendarEvent, CalendarTechnician, TimeSlot } from '../types/calendar';
import { isSameDay } from '../utils/calendarHelpers';

export function useAvailability(
  technicians: CalendarTechnician[],
  events: CalendarEvent[],
  selectedDate: Date
) {
  // Compute available slots for a specific technician on the selected date
  const getTechnicianSlots = useMemo(() => {
    return (techId: string): TimeSlot[] => {
      const tech = technicians.find((t) => t.id === techId);
      if (!tech) return [];

      const dayEvents = events.filter(
        (e) => e.technicianId === techId && isSameDay(new Date(e.start), selectedDate)
      );

      const slots: TimeSlot[] = [];
      const startHour = tech.workingHours.startHour;
      const endHour = tech.workingHours.endHour;

      for (let h = startHour; h < endHour; h++) {
        const slotStart = new Date(selectedDate);
        slotStart.setHours(h, 0, 0, 0);

        const slotEnd = new Date(selectedDate);
        slotEnd.setHours(h + 1, 0, 0, 0);

        // Check if lunch break
        const isBreak = h >= tech.workingHours.breakStartHour && h < tech.workingHours.breakEndHour;

        // Check if occupied by an event
        const matchedEvent = dayEvents.find((evt) => {
          const eStart = new Date(evt.start).getTime();
          const eEnd = new Date(evt.end).getTime();
          const sStart = slotStart.getTime();
          const sEnd = slotEnd.getTime();
          return sStart < eEnd && sEnd > eStart;
        });

        slots.push({
          start: slotStart,
          end: slotEnd,
          isAvailable: !isBreak && !matchedEvent,
          isBreak,
          technicianId: techId,
          event: matchedEvent,
        });
      }

      return slots;
    };
  }, [technicians, events, selectedDate]);

  // Compute summary metrics for today
  const availabilitySummary = useMemo(() => {
    let availableTechsCount = 0;
    let busyTechsCount = 0;
    let offlineTechsCount = 0;

    technicians.forEach((t) => {
      if (t.status === 'available') availableTechsCount++;
      else if (t.status === 'busy') busyTechsCount++;
      else offlineTechsCount++;
    });

    return {
      availableCount: availableTechsCount,
      busyCount: busyTechsCount,
      offlineCount: offlineTechsCount,
      totalCount: technicians.length,
    };
  }, [technicians]);

  return {
    getTechnicianSlots,
    availabilitySummary,
  };
}
