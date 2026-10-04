import { CalendarEvent, CalendarTechnician, SchedulingConflict } from '../types/calendar';

/**
 * Detect scheduling overlaps, outside working hours, and travel time conflicts
 */
export function detectSchedulingConflicts(
  events: CalendarEvent[],
  technicians: CalendarTechnician[],
  travelBufferMins: number = 30
): SchedulingConflict[] {
  const conflicts: SchedulingConflict[] = [];

  // Group events by technician
  const eventsByTech: { [techId: string]: CalendarEvent[] } = {};
  events.forEach((evt) => {
    if (!eventsByTech[evt.technicianId]) {
      eventsByTech[evt.technicianId] = [];
    }
    eventsByTech[evt.technicianId].push(evt);
  });

  technicians.forEach((tech) => {
    const techEvents = eventsByTech[tech.id] || [];

    // Sort by start time
    techEvents.sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());

    // 1. Check Working Hours and Days Off
    techEvents.forEach((evt) => {
      const start = new Date(evt.start);
      const end = new Date(evt.end);
      const dayOfWeek = start.getDay();

      if (tech.daysOff.includes(dayOfWeek)) {
        conflicts.push({
          type: 'outside_hours',
          severity: 'error',
          title: `Scheduled on Day Off (${tech.name})`,
          titleBangla: `${tech.nameBangla || tech.name}-এর ছুটির দিনে শিডিউল করা হয়েছে`,
          message: `${evt.workOrderNumber} is scheduled on Friday / weekly day off for ${tech.name}.`,
          messageBangla: `${tech.nameBangla || tech.name}-এর সাপ্তাহিক ছুটির দিনে ${evt.workOrderNumber} নির্ধারিত হয়েছে।`,
          eventIds: [evt.id],
        });
      }

      const startHour = start.getHours() + start.getMinutes() / 60;
      const endHour = end.getHours() + end.getMinutes() / 60;

      if (startHour < tech.workingHours.startHour || endHour > tech.workingHours.endHour) {
        conflicts.push({
          type: 'outside_hours',
          severity: 'warning',
          title: `Outside Shift Hours (${tech.name})`,
          titleBangla: `শিফটের বাইরে শিডিউল (${tech.nameBangla || tech.name})`,
          message: `${evt.workOrderNumber} exceeds regular shift hours (${tech.workingHours.startHour}:00 - ${tech.workingHours.endHour}:00).`,
          messageBangla: `${evt.workOrderNumber} নির্ধারিত কাজের সময় অতিক্রম করেছে।`,
          eventIds: [evt.id],
        });
      }
    });

    // 2. Check Overlaps & Travel Time Buffer between consecutive events
    for (let i = 0; i < techEvents.length - 1; i++) {
      const current = techEvents[i];
      const next = techEvents[i + 1];

      const currentStart = new Date(current.start).getTime();
      const currentEnd = new Date(current.end).getTime();
      const nextStart = new Date(next.start).getTime();
      const nextEnd = new Date(next.end).getTime();

      // Overlap / Double booking
      if (currentEnd > nextStart) {
        conflicts.push({
          type: 'overlap',
          severity: 'error',
          title: `Time Overlap (${tech.name})`,
          titleBangla: `কাজের সময় সংঘর্ষ (${tech.nameBangla || tech.name})`,
          message: `${current.workOrderNumber} (${current.title}) overlaps directly with ${next.workOrderNumber} (${next.title}).`,
          messageBangla: `${current.workOrderNumber} এবং ${next.workOrderNumber} একই সময়ে নির্ধারিত হয়েছে।`,
          eventIds: [current.id, next.id],
        });
      }
      // Insufficient travel time buffer between different Dhaka zones
      else if (
        current.zone &&
        next.zone &&
        current.zone !== next.zone &&
        nextStart - currentEnd < travelBufferMins * 60 * 1000
      ) {
        const gapMins = Math.round((nextStart - currentEnd) / (60 * 1000));
        conflicts.push({
          type: 'travel_time',
          severity: 'warning',
          title: `Dhaka Traffic Travel Warning`,
          titleBangla: `ঢাকা ট্রাফিক ট্রাভেল সতর্কতা`,
          message: `Only ${gapMins} mins buffer between ${current.zone} and ${next.zone}. Recommended Dhaka traffic allowance is ${travelBufferMins} mins.`,
          messageBangla: `${current.zone} থেকে ${next.zone} যেতে মাত্র ${gapMins} মিনিট সময় আছে। ন্যূনতম ${travelBufferMins} মিনিট প্রয়োজন।`,
          eventIds: [current.id, next.id],
        });
      }
    }
  });

  return conflicts;
}
