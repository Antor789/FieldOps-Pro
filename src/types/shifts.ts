/**
 * FieldOps Pro - Technician Availability & Shift Management Types
 * Context: Bangladesh work context (Friday/Saturday weekends, Ramadan timing, Eid & National Holidays)
 */

export type ShiftType = 'morning' | 'afternoon' | 'night' | 'full_day' | 'custom' | 'off';

export type AvailabilityStatus =
  | 'available'
  | 'on_job'
  | 'on_break'
  | 'on_leave'
  | 'off'
  | 'overtime';

export type LeaveType = 'casual' | 'sick' | 'annual' | 'emergency' | 'unpaid' | 'ramadan_special';

export type LeaveStatus = 'pending' | 'approved' | 'rejected';

export interface Shift {
  id: string;
  technicianId: string;
  technicianName: string;
  technicianRole?: string;
  technicianAvatar?: string;
  date: string; // ISO format "YYYY-MM-DD"
  shiftType: ShiftType;
  startTime: string; // e.g., "08:00"
  endTime: string; // e.g., "16:00"
  zone?: string; // e.g., "Dhaka North", "Gulshan-Banani", "Chittagong Port"
  isOvertime: boolean;
  notes?: string;
  createdBy: string;
  isRamadanSchedule?: boolean;
}

export interface TechnicianAvailability {
  technicianId: string;
  technicianName: string;
  technicianAvatar?: string;
  date: string; // "YYYY-MM-DD"
  status: AvailabilityStatus;
  shift?: Shift;
  currentJobId?: string;
  currentJobTitle?: string;
  locationName?: string;
  zone?: string;
  phone?: string;
}

export interface Leave {
  id: string;
  technicianId: string;
  technicianName: string;
  technicianAvatar?: string;
  startDate: string; // "YYYY-MM-DD"
  endDate: string; // "YYYY-MM-DD"
  type: LeaveType;
  reason: string;
  status: LeaveStatus;
  requestedAt: string;
  approvedBy?: string;
  rejectionReason?: string;
}

export interface LeaveBalance {
  technicianId: string;
  casualRemaining: number;
  casualTotal: number;
  sickRemaining: number;
  sickTotal: number;
  annualRemaining: number;
  annualTotal: number;
}

export interface BangladeshHoliday {
  id: string;
  name: string;
  nameBn: string;
  date: string; // "YYYY-MM-DD"
  dayName: string;
  type: 'national' | 'religious' | 'cultural';
  isOfficialOffDay: boolean;
  description: string;
}

export interface ShiftTemplateItem {
  id: string;
  name: string;
  nameBn?: string;
  description: string;
  shifts: {
    technicianId: string;
    dayOfWeek: number; // 0=Sunday, 5=Friday, 6=Saturday
    shiftType: ShiftType;
    startTime: string;
    endTime: string;
    zone?: string;
  }[];
}
