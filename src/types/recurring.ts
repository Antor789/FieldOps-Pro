/**
 * FieldOps Pro - Recurring Jobs & Maintenance Schedule System Types
 * Automated preventive maintenance (PPM) for field service operations in Bangladesh.
 */

export type RecurrencePattern =
  | 'daily'
  | 'weekly'
  | 'monthly'
  | 'quarterly'
  | 'semi_annual'
  | 'annual'
  | 'custom';

export interface RecurrenceConfig {
  pattern: RecurrencePattern;
  every: number; // every N days / weeks / months / years
  daysOfWeek?: number[]; // [1, 3, 5] = Mon, Wed, Fri (1 = Mon, 7 = Sun)
  dayOfMonth?: number; // e.g. 15 = 15th of the month
  weekOfMonth?: number; // 1 = 1st week, 2 = 2nd week, etc.
  dayOfWeekOrdinal?: number; // 1 = Mon, 2 = Tue, etc. for "2nd Monday"
  endType: 'never' | 'count' | 'date';
  endCount?: number;
  endDate?: Date | string;
}

export interface RecurringOccurrence {
  id: string;
  recurringJobId: string;
  scheduledDate: Date | string;
  status: 'pending' | 'generated' | 'skipped' | 'completed' | 'cancelled';
  workOrderId?: string;
  skippedReason?: string;
  generatedAt?: Date | string;
  completedAt?: Date | string;
}

export interface RecurringJob {
  id: string;
  templateName: string;
  customerId: string;
  customerName: string;
  customerPhone?: string;
  customerEmail?: string;
  serviceType: string; // e.g. 'HVAC Maintenance', 'Generator Overhaul', 'Transformer Test'
  description: string;
  estimatedDuration: number; // in minutes
  priority: 'EMERGENCY' | 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  assignedTechnicianId?: string;
  assignedTechnicianName?: string;
  location: string;

  recurrence: RecurrenceConfig;

  startDate: Date | string;
  nextDueDate: Date | string;
  lastGeneratedDate?: Date | string;

  autoInvoice: boolean;
  amount?: number; // Amount in BDT
  contractId?: string; // Optional link to SLA/AMC contract

  status: 'active' | 'paused' | 'completed' | 'cancelled';

  occurrences: RecurringOccurrence[];

  createdBy: string;
  createdAt: Date | string;
  updatedAt?: Date | string;
}

export interface RecurringStats {
  activeCount: number;
  pausedCount: number;
  completedCount: number;
  dueTodayCount: number;
  dueWeekCount: number;
  overdueCount: number;
  totalWorkOrdersGenerated: number;
  totalMonthlyPipelineBDT: number;
}
