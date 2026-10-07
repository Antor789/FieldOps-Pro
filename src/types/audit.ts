/**
 * FieldOps Pro - Audit Log & Activity Tracking Types
 * Enterprise compliance, NBR tax invoice audit trails, security incident logging, and diff tracking.
 */

export type AuditSeverity = 'info' | 'warning' | 'critical';

export type AuditCategory =
  | 'auth'
  | 'work_orders'
  | 'users'
  | 'payments'
  | 'reports'
  | 'system'
  | 'data';

export interface AuditMetadata {
  ip: string;
  userAgent: string;
  device: string;
  location?: string;
  tenantId?: string;
  tenantName?: string;
  sessionId?: string;
}

export interface DiffEntry {
  field: string;
  label?: string;
  before: any;
  after: any;
}

export interface AuditEntry {
  id: string;
  timestamp: Date | string;
  userId: string;
  userName: string;
  userRole: string;
  action: string;
  category: AuditCategory;
  severity: AuditSeverity;
  resourceType: string;
  resourceId: string;
  description: string;
  descriptionBangla?: string;
  before?: Record<string, any>;
  after?: Record<string, any>;
  metadata: AuditMetadata;
  flaggedSuspicious?: boolean;
  suspiciousReason?: string;
}

export interface AuditFilterParams {
  searchQuery?: string;
  startDate?: string;
  endDate?: string;
  dateRangePreset?: 'today' | 'yesterday' | '7days' | '30days' | 'all';
  userIds?: string[];
  categories?: AuditCategory[];
  severities?: AuditSeverity[];
  actions?: string[];
}

export interface AuditStatsSummary {
  totalLogs: number;
  warningsCount: number;
  criticalCount: number;
  todayCount: number;
  securityScore: number; // e.g. 98/100
  topActions: { action: string; count: number; category: AuditCategory }[];
  mostActiveUsers: { userId: string; userName: string; role: string; count: number }[];
  dailyActivityTrend: { date: string; info: number; warning: number; critical: number }[];
}

export interface SecurityAlert {
  id: string;
  title: string;
  titleBangla?: string;
  type: 'brute_force' | 'after_hours' | 'unusual_ip' | 'bulk_export' | 'privilege_escalation';
  severity: AuditSeverity;
  timestamp: Date | string;
  userId?: string;
  userName?: string;
  ip: string;
  location: string;
  details: string;
  relatedAuditId?: string;
  status: 'active' | 'investigating' | 'resolved' | 'dismissed';
}
