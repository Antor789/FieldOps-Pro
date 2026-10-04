/**
 * FieldOps Pro - Scheduling Calendar Types & Definitions
 */

export type CalendarView = 'day' | 'week' | 'month' | 'timeline';

export type EventPriority = 'emergency' | 'critical' | 'high' | 'medium' | 'low';
export type EventStatus = 'scheduled' | 'in_progress' | 'completed' | 'cancelled';

export interface CalendarEvent {
  id: string;
  workOrderId: string;
  workOrderNumber: string;
  title: string;
  titleBangla?: string;
  description?: string;

  // Time
  start: Date;
  end: Date;
  durationMins: number;
  isAllDay?: boolean;

  // Assignment
  technicianId: string;
  technicianName: string;
  technicianAvatar?: string;
  technicianRole?: string;

  // Location
  location: string;
  locationBangla?: string;
  zone?: string;
  coordinates?: { lat: number; lng: number };

  // Status & Priority
  priority: EventPriority;
  status: EventStatus;

  // Financials
  estimatedCostBDT: number;

  // Recurrence
  isRecurring?: boolean;
  recurrencePattern?: 'daily' | 'weekly' | 'monthly' | 'custom';
  recurrenceDays?: number[]; // 0 = Sun, 1 = Mon ...
  recurrenceCount?: number;
}

export interface CalendarTechnician {
  id: string;
  name: string;
  nameBangla?: string;
  avatar?: string;
  role: string;
  status: 'available' | 'busy' | 'offline' | 'on_break';
  rating: number;
  phone: string;
  currentZone: string;
  workingHours: {
    startHour: number; // e.g. 8 (8:00 AM)
    endHour: number;   // e.g. 18 (6:00 PM)
    breakStartHour: number; // e.g. 12 (12:00 PM)
    breakEndHour: number;   // e.g. 13 (1:00 PM)
  };
  daysOff: number[]; // e.g. [5] for Friday in BD
}

export interface TimeSlot {
  start: Date;
  end: Date;
  isAvailable: boolean;
  isBreak?: boolean;
  technicianId?: string;
  event?: CalendarEvent;
}

export interface SchedulingConflict {
  type: 'overlap' | 'double_booking' | 'outside_hours' | 'break_time' | 'travel_time';
  severity: 'error' | 'warning';
  title: string;
  titleBangla: string;
  message: string;
  messageBangla: string;
  eventIds: string[];
  suggestedSlot?: {
    start: Date;
    end: Date;
    technicianId: string;
  };
}
