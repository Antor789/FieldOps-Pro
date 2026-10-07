import { useState, useCallback, useMemo } from 'react';
import {
  EmailRecord,
  EmailStats,
  EmailTemplateType,
  SmtpConfig,
  NotificationPreferences,
  EmailStatus,
} from '../types/email';
import { injectVariables, getSampleDataMap } from '../utils/emailRenderer';
import { useToast } from '../context/ToastContext';

export const INITIAL_SMTP_CONFIG: SmtpConfig = {
  host: 'smtp.gmail.com',
  port: 587,
  secureTls: true,
  username: 'info@fieldops.bd',
  password: '••••••••••••••••',
  fromName: 'FieldOps Pro Bangladesh',
  fromEmail: 'no-reply@fieldops.bd',
  replyTo: 'support@fieldops.bd',
  status: 'connected',
  lastTestedAt: new Date(Date.now() - 3600 * 1000 * 4),
};

export const INITIAL_NOTIFICATION_PREFERENCES: NotificationPreferences = {
  woAssigned: true,
  woCompleted: true,
  paymentReceipt: true,
  invoiceDelivery: true,
  slaBreach: true,
  dailyReport: true,
  userInvitation: true,
  passwordReset: true,
  feedbackRequests: true,
  inventoryAlerts: true,
  scheduledReports: true,
  customerSmsFallback: true,
};

export const INITIAL_EMAIL_HISTORY: EmailRecord[] = [
  {
    id: 'em-101',
    templateId: 'wo_assigned',
    to: 'rahim.tech@fieldops.bd',
    toName: 'Md. Rahim Uddin',
    subject: 'New Job Assigned: #WO-9045 - Emergency Transformer Board',
    sentAt: new Date(Date.now() - 1000 * 60 * 15),
    status: 'delivered',
    openedAt: new Date(Date.now() - 1000 * 60 * 12),
    workOrderId: 'WO-9045',
    previewSnippet: 'A new service job #WO-9045 has been assigned to you by Dhaka dispatch...',
  },
  {
    id: 'em-102',
    templateId: 'payment_receipt',
    to: 'finance@squarepharma.com.bd',
    toName: 'Square Pharmaceuticals Ltd.',
    subject: 'Payment Receipt ৳8,500 BDT - Receipt #REC-2026-1044',
    sentAt: new Date(Date.now() - 1000 * 60 * 45),
    status: 'delivered',
    openedAt: new Date(Date.now() - 1000 * 60 * 30),
    amountBDT: 8500,
    workOrderId: 'WO-9045',
    previewSnippet: 'We have successfully received and processed your bKash payment of ৳8,500...',
  },
  {
    id: 'em-103',
    templateId: 'sla_breach',
    to: 'ops.manager@fieldops.bd',
    toName: 'Farhana Yasmin (Chief Dispatcher)',
    subject: '⚠️ CRITICAL SLA BREACH: WO #WO-9022 (Mirpur DOHS)',
    sentAt: new Date(Date.now() - 1000 * 60 * 90),
    status: 'delivered',
    openedAt: new Date(Date.now() - 1000 * 60 * 85),
    workOrderId: 'WO-9022',
    previewSnippet: 'Contract commitment for Summit Communications has breached 120-min window...',
  },
  {
    id: 'em-104',
    templateId: 'invoice',
    to: 'billing@grameenphone.com',
    toName: 'Grameenphone NOC Hub',
    subject: 'Tax Invoice INV-2026-0891 - FieldOps Pro (৳15,400 BDT)',
    sentAt: new Date(Date.now() - 1000 * 60 * 180),
    status: 'delivered',
    openedAt: new Date(Date.now() - 1000 * 60 * 140),
    amountBDT: 15400,
    workOrderId: 'WO-9048',
    previewSnippet: 'NBR Mushak 6.3 Tax Invoice has been generated for Bashundhara site overhaul...',
  },
  {
    id: 'em-105',
    templateId: 'invitation',
    to: 'tanvir.eng@gmail.com',
    toName: 'Tanvir Hossain',
    subject: 'Invitation to join FieldOps Pro as Operations Dispatcher',
    sentAt: new Date(Date.now() - 1000 * 60 * 300),
    status: 'delivered',
    openedAt: new Date(Date.now() - 1000 * 60 * 220),
    previewSnippet: 'You have been invited by Md. Shafiqul Islam to join the operations workspace...',
  },
  {
    id: 'em-106',
    templateId: 'wo_assigned',
    to: 'alamin.tech@fieldops.bd',
    toName: 'Al-Amin Hossain',
    subject: 'New Job Assigned: #WO-9039 - SC-UPC Optical Splicing',
    sentAt: new Date(Date.now() - 1000 * 60 * 420),
    status: 'failed',
    errorMessage: 'SMTP 550 5.1.1 Recipient mailbox full or temporarily quota exceeded',
    workOrderId: 'WO-9039',
    retryCount: 2,
    previewSnippet: 'A new service job #WO-9039 has been assigned in Uttara Sector 7...',
  },
  {
    id: 'em-107',
    templateId: 'feedback_request',
    to: 'procurement@jamuna-group.com',
    toName: 'Jamuna Group Facilities',
    subject: 'How was your service with FieldOps Pro? (WO #WO-9018)',
    sentAt: new Date(Date.now() - 1000 * 3600 * 14),
    status: 'delivered',
    openedAt: new Date(Date.now() - 1000 * 3600 * 11),
    workOrderId: 'WO-9018',
    previewSnippet: 'Dear Customer, please take 30 seconds to rate your recent generator service...',
  },
  {
    id: 'em-108',
    templateId: 'daily_report',
    to: 'director@fieldops.bd',
    toName: 'Managing Director & Board',
    subject: 'Daily Operations Digest: 14 Jobs Completed (৳142,500 Revenue)',
    sentAt: new Date(Date.now() - 1000 * 3600 * 24),
    status: 'delivered',
    openedAt: new Date(Date.now() - 1000 * 3600 * 23),
    amountBDT: 142500,
    previewSnippet: 'Automated 24-hour executive summary: 14 jobs completed with 96.8% SLA rate...',
  },
  {
    id: 'em-109',
    templateId: 'reminder',
    to: 'shakil.tech@fieldops.bd',
    toName: 'Shakil Mahmud',
    subject: 'Departure Reminder: WO #WO-9041 in Gulshan 2 (Starts in 30 mins)',
    sentAt: new Date(Date.now() - 1000 * 3600 * 28),
    status: 'delivered',
    workOrderId: 'WO-9041',
    previewSnippet: 'Hi Shakil, you are scheduled to arrive at Gulshan 2 North Ave in 30 minutes...',
  },
  {
    id: 'em-110',
    templateId: 'inventory_alert',
    to: 'inventory.mgr@fieldops.bd',
    toName: 'Warehouse Logistics Lead',
    subject: '⚠️ Low Stock Alert: 3 Parts Reached Reorder Threshold',
    sentAt: new Date(Date.now() - 1000 * 3600 * 36),
    status: 'delivered',
    openedAt: new Date(Date.now() - 1000 * 3600 * 35),
    previewSnippet: 'Central Warehouse (Tejgaon) reported low stock on critical response parts...',
  },
  {
    id: 'em-111',
    templateId: 'password_reset',
    to: 'biplob.tech@fieldops.bd',
    toName: 'Biplob Karmakar',
    subject: 'Password Reset Request for FieldOps Pro (OTP: 882910)',
    sentAt: new Date(Date.now() - 1000 * 3600 * 42),
    status: 'delivered',
    openedAt: new Date(Date.now() - 1000 * 3600 * 41),
    previewSnippet: 'We received a request to reset your FieldOps Pro account password...',
  },
];

export function useEmailNotifications() {
  const { addToast } = useToast();
  const [smtpConfig, setSmtpConfig] = useState<SmtpConfig>(INITIAL_SMTP_CONFIG);
  const [preferences, setPreferences] = useState<NotificationPreferences>(INITIAL_NOTIFICATION_PREFERENCES);
  const [emailHistory, setEmailHistory] = useState<EmailRecord[]>(INITIAL_EMAIL_HISTORY);
  const [isSendingTest, setIsSendingTest] = useState(false);
  const [isTestingSmtp, setIsTestingSmtp] = useState(false);

  // Statistics calculation
  const emailStats = useMemo<EmailStats>(() => {
    const totalSent = emailHistory.length;
    const delivered = emailHistory.filter((e) => e.status === 'delivered').length;
    const opened = emailHistory.filter((e) => !!e.openedAt).length;
    const failed = emailHistory.filter((e) => e.status === 'failed' || e.status === 'bounced').length;
    const bounced = emailHistory.filter((e) => e.status === 'bounced').length;

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayCount = emailHistory.filter((e) => new Date(e.sentAt) >= todayStart).length;

    return {
      totalSent,
      delivered,
      opened,
      failed,
      bounced,
      deliveryRate: totalSent > 0 ? Math.round((delivered / totalSent) * 100) : 100,
      openRate: delivered > 0 ? Math.round((opened / delivered) * 100) : 0,
      todayCount,
    };
  }, [emailHistory]);

  // Send an email (mocked network call with realistic delay)
  const sendEmail = useCallback(
    async (
      templateId: EmailTemplateType,
      to: string,
      data: Record<string, any> = {},
      toName?: string
    ): Promise<EmailRecord> => {
      // Simulate SMTP network roundtrip
      await new Promise((resolve) => setTimeout(resolve, 800));

      const sampleData = { ...getSampleDataMap(), ...data };
      const subject = sampleData.subject || `Notification from FieldOps Pro: #${sampleData.work_order_id || 'Alert'}`;

      const newRecord: EmailRecord = {
        id: `em-${Date.now()}`,
        templateId,
        to,
        toName: toName || to.split('@')[0],
        subject,
        sentAt: new Date(),
        status: 'delivered',
        workOrderId: data.work_order_id,
        amountBDT: data.total_amount ? Number(String(data.total_amount).replace(/,/g, '')) : undefined,
        previewSnippet: injectVariables(
          'Automated professional message dispatched via FieldOps Pro Bangladesh SMTP gateway...',
          sampleData
        ),
      };

      setEmailHistory((prev) => [newRecord, ...prev]);
      addToast({
        title: 'Email Sent Successfully',
        description: `Delivered to ${to} (${newRecord.subject.slice(0, 32)}...)`,
        type: 'success',
      });

      return newRecord;
    },
    [addToast]
  );

  // Resend existing failed or delivered email
  const resendEmail = useCallback(
    async (id: string): Promise<boolean> => {
      await new Promise((resolve) => setTimeout(resolve, 600));

      setEmailHistory((prev) =>
        prev.map((item) => {
          if (item.id === id) {
            return {
              ...item,
              status: 'delivered',
              sentAt: new Date(),
              errorMessage: undefined,
              retryCount: (item.retryCount || 0) + 1,
            };
          }
          return item;
        })
      );

      addToast({
        title: 'Email Re-dispatched',
        description: `Retry triggered for message #${id}`,
        type: 'success',
      });
      return true;
    },
    [addToast]
  );

  // Test SMTP connection
  const testSmtpConnection = useCallback(async (): Promise<boolean> => {
    setIsTestingSmtp(true);
    await new Promise((resolve) => setTimeout(resolve, 1200));
    setIsTestingSmtp(false);

    setSmtpConfig((prev) => ({
      ...prev,
      status: 'connected',
      lastTestedAt: new Date(),
    }));

    addToast({
      title: 'SMTP Connection Verified',
      description: `Connected successfully to ${smtpConfig.host}:${smtpConfig.port} (TLS Handshake OK)`,
      type: 'success',
    });
    return true;
  }, [smtpConfig.host, smtpConfig.port, addToast]);

  // Save SMTP settings
  const saveSmtpConfig = useCallback(
    (newConfig: Partial<SmtpConfig>) => {
      setSmtpConfig((prev) => ({ ...prev, ...newConfig }));
      addToast({
        title: 'Email Settings Saved',
        description: 'SMTP credentials and sender profile updated.',
        type: 'success',
      });
    },
    [addToast]
  );

  // Save Preferences
  const savePreferences = useCallback(
    (newPrefs: Partial<NotificationPreferences>) => {
      setPreferences((prev) => ({ ...prev, ...newPrefs }));
      addToast({
        title: 'Preferences Updated',
        description: 'Email automation trigger rules saved.',
        type: 'success',
      });
    },
    [addToast]
  );

  return {
    smtpConfig,
    preferences,
    emailHistory,
    emailStats,
    isTestingSmtp,
    isSendingTest,
    sendEmail,
    resendEmail,
    testSmtpConnection,
    saveSmtpConfig,
    savePreferences,
  };
}
