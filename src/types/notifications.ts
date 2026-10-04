/**
 * FieldOps Pro - Enterprise Notification & Push Alert Types
 */

export type NotificationType = 
  | 'sla_breach'        // 🚨 SLA Breached
  | 'sla_warning'       // ⚠️ SLA Warning (< 30 min left)
  | 'job_assigned'      // 📋 New Job Assigned
  | 'job_updated'       // 🔄 Job Status Changed
  | 'job_completed'     // ✅ Job Completed & Signed
  | 'payment_received'  // 💰 bKash/Nagad Payment Confirmed
  | 'payment_pending'   // 💳 Payment Collection Due
  | 'tech_arrived'      // 📍 Technician Entered Geofence
  | 'tech_en_route'     // 🚗 Technician Dispatched En Route
  | 'new_message'       // 💬 SMS / WhatsApp Customer Reply
  | 'system_alert'      // ⚙️ NBR VAT / Gateway Alert
  | 'daily_summary';    // 📊 Daily Executive KPI Digest

export type NotificationPriority = 'critical' | 'high' | 'normal' | 'low';

export interface NotificationItemData {
  id: string;
  type: NotificationType;
  priority: NotificationPriority;
  title: string;
  titleBn?: string;
  message: string;
  messageBn?: string;
  timestamp: Date;
  isRead: boolean;
  isArchived?: boolean;
  
  // Action Affordance
  actionUrl?: string;
  actionLabel?: string;
  actionLabelBn?: string;
  
  // Related References
  workOrderId?: string;
  technicianId?: string;
  customerId?: string;
  amountBDT?: number;
  
  // Metadata & Custom Payload
  metadata?: Record<string, any>;
  soundType?: 'default' | 'urgent' | 'success' | 'warning';
}

export interface NotificationPreferences {
  channels: {
    push: boolean;
    inApp: boolean;
    email: boolean;
    sms: boolean;
  };
  types: {
    slaAlerts: boolean;
    jobUpdates: boolean;
    paymentNotifications: boolean;
    technicianUpdates: boolean;
    reportsSummaries: boolean;
  };
  sound: {
    enabled: boolean;
    volume: number; // 0-100
  };
  quietHours: {
    enabled: boolean;
    start: string; // "22:00"
    end: string;   // "07:00"
    allowCritical: boolean;
  };
}

export const defaultNotificationPreferences: NotificationPreferences = {
  channels: {
    push: true,
    inApp: true,
    email: false,
    sms: true,
  },
  types: {
    slaAlerts: true,
    jobUpdates: true,
    paymentNotifications: true,
    technicianUpdates: true,
    reportsSummaries: false,
  },
  sound: {
    enabled: true,
    volume: 75,
  },
  quietHours: {
    enabled: false,
    start: '22:00',
    end: '07:00',
    allowCritical: true,
  },
};

export const notificationTypeConfigs: Record<NotificationType, {
  icon: string;
  badgeColor: string;
  borderAccent: string;
  sound: 'default' | 'urgent' | 'success' | 'warning';
  priority: NotificationPriority;
  autoDismiss: boolean;
  dismissAfterMs?: number;
}> = {
  sla_breach: {
    icon: '🚨',
    badgeColor: 'bg-rose-500 text-white',
    borderAccent: 'border-l-rose-600',
    sound: 'urgent',
    priority: 'critical',
    autoDismiss: false,
  },
  sla_warning: {
    icon: '⚠️',
    badgeColor: 'bg-amber-500 text-white',
    borderAccent: 'border-l-amber-500',
    sound: 'warning',
    priority: 'high',
    autoDismiss: true,
    dismissAfterMs: 8000,
  },
  job_assigned: {
    icon: '📋',
    badgeColor: 'bg-indigo-600 text-white',
    borderAccent: 'border-l-indigo-600',
    sound: 'default',
    priority: 'high',
    autoDismiss: true,
    dismissAfterMs: 6000,
  },
  job_updated: {
    icon: '🔄',
    badgeColor: 'bg-sky-500 text-white',
    borderAccent: 'border-l-sky-500',
    sound: 'default',
    priority: 'normal',
    autoDismiss: true,
    dismissAfterMs: 5000,
  },
  job_completed: {
    icon: '✅',
    badgeColor: 'bg-emerald-600 text-white',
    borderAccent: 'border-l-emerald-600',
    sound: 'success',
    priority: 'normal',
    autoDismiss: true,
    dismissAfterMs: 5000,
  },
  payment_received: {
    icon: '💰',
    badgeColor: 'bg-emerald-600 text-white',
    borderAccent: 'border-l-emerald-600',
    sound: 'success',
    priority: 'normal',
    autoDismiss: true,
    dismissAfterMs: 6000,
  },
  payment_pending: {
    icon: '💳',
    badgeColor: 'bg-amber-500 text-white',
    borderAccent: 'border-l-amber-500',
    sound: 'warning',
    priority: 'normal',
    autoDismiss: true,
    dismissAfterMs: 6000,
  },
  tech_arrived: {
    icon: '📍',
    badgeColor: 'bg-teal-600 text-white',
    borderAccent: 'border-l-teal-600',
    sound: 'default',
    priority: 'normal',
    autoDismiss: true,
    dismissAfterMs: 5000,
  },
  tech_en_route: {
    icon: '🚗',
    badgeColor: 'bg-blue-600 text-white',
    borderAccent: 'border-l-blue-600',
    sound: 'default',
    priority: 'normal',
    autoDismiss: true,
    dismissAfterMs: 5000,
  },
  new_message: {
    icon: '💬',
    badgeColor: 'bg-purple-600 text-white',
    borderAccent: 'border-l-purple-600',
    sound: 'default',
    priority: 'normal',
    autoDismiss: true,
    dismissAfterMs: 5000,
  },
  system_alert: {
    icon: '⚙️',
    badgeColor: 'bg-slate-700 text-white',
    borderAccent: 'border-l-slate-700',
    sound: 'warning',
    priority: 'low',
    autoDismiss: true,
    dismissAfterMs: 4000,
  },
  daily_summary: {
    icon: '📊',
    badgeColor: 'bg-indigo-700 text-white',
    borderAccent: 'border-l-indigo-700',
    sound: 'default',
    priority: 'low',
    autoDismiss: true,
    dismissAfterMs: 5000,
  },
};
