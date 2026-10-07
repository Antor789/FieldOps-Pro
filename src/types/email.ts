/**
 * FieldOps Pro - Email Notification System Types
 * Enterprise multi-lingual (English & Bengali) notifications, SMTP configuration,
 * template variables, delivery tracking, and NBR tax compliance invoices.
 */

export type EmailStatus = 'queued' | 'sent' | 'delivered' | 'failed' | 'bounced';

export type EmailTemplateType =
  | 'wo_assigned'
  | 'wo_completed'
  | 'payment_receipt'
  | 'invoice'
  | 'sla_breach'
  | 'daily_report'
  | 'invitation'
  | 'password_reset'
  | 'reminder'
  | 'feedback_request'
  | 'inventory_alert'
  | 'scheduled_report';

export type EmailLanguage = 'en' | 'bn' | 'both';

export interface EmailTemplate {
  id: EmailTemplateType;
  name: string;
  nameBangla: string;
  description: string;
  category: 'operations' | 'finance' | 'customer' | 'system';
  subject: string;
  subjectBangla?: string;
  bodyHtml: string;
  bodyText: string;
  bodyHtmlBangla?: string;
  bodyTextBangla?: string;
  variables: string[];
  isEnabled: boolean;
  language: EmailLanguage;
  lastModified: Date;
  triggerEvent: string;
  recipientRoles: string[];
}

export interface EmailRecord {
  id: string;
  templateId: EmailTemplateType;
  to: string;
  toName: string;
  subject: string;
  sentAt: Date;
  status: EmailStatus;
  openedAt?: Date;
  clickedAt?: Date;
  errorMessage?: string;
  workOrderId?: string;
  amountBDT?: number;
  previewSnippet?: string;
  retryCount?: number;
}

export interface EmailStats {
  totalSent: number;
  delivered: number;
  opened: number;
  failed: number;
  bounced: number;
  deliveryRate: number;
  openRate: number;
  todayCount: number;
}

export interface SmtpConfig {
  host: string;
  port: number;
  secureTls: boolean;
  username: string;
  password: string;
  fromName: string;
  fromEmail: string;
  replyTo?: string;
  status: 'connected' | 'disconnected' | 'error';
  lastTestedAt?: Date;
}

export interface NotificationPreferences {
  woAssigned: boolean;
  woCompleted: boolean;
  paymentReceipt: boolean;
  invoiceDelivery: boolean;
  slaBreach: boolean;
  dailyReport: boolean;
  userInvitation: boolean;
  passwordReset: boolean;
  feedbackRequests: boolean;
  inventoryAlerts: boolean;
  scheduledReports: boolean;
  customerSmsFallback: boolean;
}

export interface TemplateVariableDefinition {
  key: string;
  name: string;
  nameBangla: string;
  category: 'order' | 'customer' | 'technician' | 'financial' | 'company' | 'system';
  sampleValue: string;
  description: string;
}
