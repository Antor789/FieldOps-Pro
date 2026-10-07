import { AuditEntry, AuditCategory, AuditSeverity, SecurityAlert } from '../types/audit';

const USERS = [
  { id: 'usr-1', name: 'Md. Shafiqul Islam', role: 'super_admin', ip: '103.108.144.12', loc: 'Gulshan 2, Dhaka' },
  { id: 'usr-2', name: 'Farhana Akhter', role: 'admin', ip: '103.108.144.45', loc: 'Banani, Dhaka' },
  { id: 'usr-3', name: 'Tanvir Hossain', role: 'dispatcher', ip: '118.179.224.89', loc: 'Agrabad, Chittagong' },
  { id: 'usr-4', name: 'Rahim Ahmed', role: 'technician', ip: '103.108.145.18', loc: 'Mirpur 10, Dhaka' },
  { id: 'usr-5', name: 'Nasrin Sultana', role: 'manager', ip: '119.30.38.102', loc: 'Zindabazar, Sylhet' },
  { id: 'usr-6', name: 'Kazi Mahbub Alam', role: 'accountant', ip: '103.108.144.90', loc: 'Motijheel, Dhaka' },
  { id: 'usr-sys', name: 'System Daemon', role: 'system', ip: '127.0.0.1', loc: 'Dhaka NOC Server Rack 4' },
  { id: 'usr-unknown', name: 'Unauthenticated Actor', role: 'unknown', ip: '45.134.22.189', loc: 'Bucharest, Romania' },
];

const ACTIONS_CATALOG: {
  action: string;
  category: AuditCategory;
  severity: AuditSeverity;
  template: (u: string, id: string) => { desc: string; descBn: string; resType: string; before?: any; after?: any };
}[] = [
  // Auth
  {
    action: 'LOGIN_SUCCESS',
    category: 'auth',
    severity: 'info',
    template: (u) => ({
      desc: `${u} signed in via Two-Factor Authentication (TOTP).`,
      descBn: `${u} সফলভাবে ২-ফ্যাক্টর অথেন্টিকেশনের মাধ্যমে সাইন ইন করেছেন।`,
      resType: 'Session',
    }),
  },
  {
    action: 'LOGIN_FAILED',
    category: 'auth',
    severity: 'critical',
    template: () => ({
      desc: `Failed login attempt with invalid password credentials (3 failed consecutive attempts).`,
      descBn: `ভুল পাসওয়ার্ড দিয়ে লগইন ব্যর্থ হয়েছে (একটানা ৩ বার)।`,
      resType: 'AuthCredential',
    }),
  },
  {
    action: 'LOGOUT',
    category: 'auth',
    severity: 'info',
    template: (u) => ({
      desc: `${u} securely signed out of enterprise dashboard.`,
      descBn: `${u} ড্যাশবোর্ড থেকে নিরাপদে লগআউট করেছেন।`,
      resType: 'Session',
    }),
  },
  {
    action: '2FA_ENABLED',
    category: 'auth',
    severity: 'info',
    template: (u) => ({
      desc: `${u} activated TOTP Two-Factor Authentication with authenticator application.`,
      descBn: `${u} গুগল অথেনটিকেটরের মাধ্যমে ২-ফ্যাক্টর নিরাপত্তা সক্রিয় করেছেন।`,
      resType: 'UserSecurity',
      before: { twoFactor: false },
      after: { twoFactor: true, method: 'totp' },
    }),
  },
  {
    action: 'PASSWORD_CHANGED',
    category: 'auth',
    severity: 'warning',
    template: (u) => ({
      desc: `${u} updated account login password credentials.`,
      descBn: `${u} অ্যাকাউন্টের পাসওয়ার্ড পরিবর্তন করেছেন।`,
      resType: 'UserSecurity',
    }),
  },

  // Work Orders
  {
    action: 'WO_CREATED',
    category: 'work_orders',
    severity: 'info',
    template: (u, id) => ({
      desc: `${u} created work order #${id} for Fiber Splicing & Restoration.`,
      descBn: `${u} নতুন কাজের আদেশ #${id} তৈরি করেছেন।`,
      resType: 'WorkOrder',
      after: { id, title: 'Fiber Splicing Task', priority: 'HIGH', status: 'PENDING' },
    }),
  },
  {
    action: 'WO_ASSIGNED',
    category: 'work_orders',
    severity: 'info',
    template: (u, id) => ({
      desc: `${u} dispatched #${id} to lead field technician Rahim Ahmed.`,
      descBn: `${u} কাজের আদেশ #${id} টেকনিশিয়ান রহিম আহমেদকে বরাদ্দ করেছেন।`,
      resType: 'WorkOrder',
      before: { assignedTechnician: null, status: 'PENDING' },
      after: { assignedTechnician: 'usr-4 (Rahim Ahmed)', status: 'ASSIGNED' },
    }),
  },
  {
    action: 'WO_STATUS_CHANGED',
    category: 'work_orders',
    severity: 'info',
    template: (u, id) => ({
      desc: `Status for work order #${id} updated to IN_PROGRESS.`,
      descBn: `কাজের আদেশ #${id}-এর স্ট্যাটাস 'চলমান' করা হয়েছে।`,
      resType: 'WorkOrder',
      before: { status: 'ASSIGNED' },
      after: { status: 'IN_PROGRESS', startedAt: new Date().toISOString() },
    }),
  },
  {
    action: 'WO_COMPLETED',
    category: 'work_orders',
    severity: 'info',
    template: (u, id) => ({
      desc: `Work order #${id} completed with customer signature verification.`,
      descBn: `গ্রাহকের স্বাক্ষর সহ কাজের আদেশ #${id} সফলভাবে সম্পন্ন হয়েছে।`,
      resType: 'WorkOrder',
      before: { status: 'IN_PROGRESS' },
      after: { status: 'COMPLETED', customerSigned: true },
    }),
  },
  {
    action: 'WO_DELETED',
    category: 'work_orders',
    severity: 'critical',
    template: (u, id) => ({
      desc: `${u} deleted ticket record #${id} from the active database.`,
      descBn: `${u} কাজের আদেশ রেকর্ড #${id} স্থায়ীভাবে মুছে ফেলেছেন।`,
      resType: 'WorkOrder',
      before: { id, status: 'CANCELLED' },
      after: null,
    }),
  },

  // Users & RBAC
  {
    action: 'USER_ROLE_CHANGED',
    category: 'users',
    severity: 'warning',
    template: (u, id) => ({
      desc: `Role for ${u} escalated from Dispatcher to Operations Manager.`,
      descBn: `${u}-এর পদবি ডিসপ্যাচার থেকে অপারেশনস ম্যানেজারে উন্নীত করা হয়েছে।`,
      resType: 'UserRole',
      before: { role: 'dispatcher', permissionsCount: 6 },
      after: { role: 'manager', permissionsCount: 8 },
    }),
  },
  {
    action: 'USER_INVITED',
    category: 'users',
    severity: 'info',
    template: (u) => ({
      desc: `${u} sent enterprise onboarding invitation email + Greenweb SMS OTP.`,
      descBn: `${u} নতুন কর্মীকে অনবোর্ডিং আমন্ত্রণ ও এসএমএস ওটিপি পাঠিয়েছেন।`,
      resType: 'UserInvite',
      after: { status: 'pending', role: 'technician' },
    }),
  },
  {
    action: 'USER_DEACTIVATED',
    category: 'users',
    severity: 'warning',
    template: (u) => ({
      desc: `Account access suspended for user due to offboarding protocol.`,
      descBn: `অফবোর্ডিং প্রটোকলের কারণে ব্যবহারকারীর অ্যাকাউন্ট সাময়িক স্থগিত করা হয়েছে।`,
      resType: 'UserAccount',
      before: { status: 'active' },
      after: { status: 'inactive' },
    }),
  },

  // Payments & NBR Invoicing
  {
    action: 'PAYMENT_RECEIVED',
    category: 'payments',
    severity: 'info',
    template: (u, id) => ({
      desc: `Received ৳ 8,500 via bKash Merchant Gateway for invoice #${id}.`,
      descBn: `ইনভয়েস #${id}-এর জন্য বিকাশ মার্চেন্ট গেটওয়েতে ৳ ৮,৫০০ গ্রহণ করা হয়েছে।`,
      resType: 'PaymentReceipt',
      after: { amountBDT: 8500, gateway: 'bKash Merchant', trxId: 'BKASH-98214309' },
    }),
  },
  {
    action: 'REFUND_ISSUED',
    category: 'payments',
    severity: 'warning',
    template: (u, id) => ({
      desc: `Approved refund of ৳ 2,400 for cancelled spare parts order #${id}.`,
      descBn: `বাতিলকৃত যন্ত্রাংশ অর্ডার #${id}-এর জন্য ৳ ২,৪০০ রিফান্ড অনুমোদন দেওয়া হয়েছে।`,
      resType: 'Refund',
      before: { paidBDT: 2400 },
      after: { refundedBDT: 2400, reason: 'Duplicate stock billing' },
    }),
  },

  // Reports
  {
    action: 'VAT_REPORT_GENERATED',
    category: 'reports',
    severity: 'info',
    template: (u) => ({
      desc: `${u} generated NBR Mushak 6.3 VAT Tax Compliance Report for Grameenphone contract.`,
      descBn: `${u} জাতীয় রাজস্ব বোর্ড (এনবিআর) মূসক ৬.৩ ভ্যাট চালান রিপোর্ট তৈরি করেছেন।`,
      resType: 'NBRVATReport',
      after: { vatRate: '15%', binNumber: '002938102-0101', totalTaxBDT: 234500 },
    }),
  },
  {
    action: 'REPORT_EXPORTED_PDF',
    category: 'reports',
    severity: 'info',
    template: (u) => ({
      desc: `${u} downloaded high-resolution executive SLA Performance Report as PDF.`,
      descBn: `${u} এসএলএ পারফরম্যান্স রিপোর্ট পিডিএফ ফরম্যাটে ডাউনলোড করেছেন।`,
      resType: 'ReportExport',
      after: { format: 'PDF', pages: 8 },
    }),
  },

  // System
  {
    action: 'BACKUP_CREATED',
    category: 'system',
    severity: 'info',
    template: () => ({
      desc: `Automated hourly database snapshot & encrypted backup successfully archived.`,
      descBn: `স্বয়ংক্রিয় ডাটাবেস স্ন্যাপশট ও এনক্রিপ্ট করা ব্যাকআপ সম্পন্ন হয়েছে।`,
      resType: 'SystemBackup',
      after: { sizeMB: 485.4, storage: 'GCP Cloud Storage (asia-southeast1)' },
    }),
  },
  {
    action: 'SETTINGS_CHANGED',
    category: 'system',
    severity: 'warning',
    template: (u) => ({
      desc: `${u} modified Greenweb SMS Gateway retry threshold from 3 to 5 attempts.`,
      descBn: `${u} গ্রিনওয়েব এসএমএস গেটওয়ে রিট্রাই সীমা ৩ থেকে ৫ এ পরিবর্তন করেছেন।`,
      resType: 'GatewayConfig',
      before: { maxRetries: 3, timeoutSec: 15 },
      after: { maxRetries: 5, timeoutSec: 30 },
    }),
  },

  // Data
  {
    action: 'BULK_DATA_EXPORT',
    category: 'data',
    severity: 'warning',
    template: (u) => ({
      desc: `${u} performed bulk export of 1,240 customer accounts and billing history to CSV.`,
      descBn: `${u} ১,২৪০টি গ্রাহক অ্যাকাউন্ট ও বিলিং হিস্ট্রি সিএসভি ফাইলে এক্সপোর্ট করেছেন।`,
      resType: 'DataExport',
      after: { recordsCount: 1240, exportType: 'CSV' },
    }),
  },
  {
    action: 'BULK_DATA_IMPORT',
    category: 'data',
    severity: 'info',
    template: (u) => ({
      desc: `${u} imported 85 new optical fiber splice joint inventory parts via Excel.`,
      descBn: `${u} এক্সেল ফাইলের মাধ্যমে ৮৫টি অপটিক্যাল ফাইবার স্প্লাইস পার্টস ইনভেন্টরিতে যুক্ত করেছেন।`,
      resType: 'DataImport',
      after: { importedCount: 85, sheetName: 'Dhaka_Depot_Parts' },
    }),
  },
];

/**
 * Generate 500+ realistic audit entries
 */
export function generateMockAuditEntries(count = 520): AuditEntry[] {
  const entries: AuditEntry[] = [];
  const now = Date.now();

  for (let i = 0; i < count; i++) {
    // Generate timestamps distributed over the last 30 days
    // Weight recent timestamps more heavily
    const daysAgo = Math.pow(Math.random(), 1.8) * 30;
    const timestampMs = now - daysAgo * 86400 * 1000 - Math.random() * 3600 * 1000;
    const dateObj = new Date(timestampMs);

    const user = USERS[Math.floor(Math.random() * USERS.length)];
    const actionDef = ACTIONS_CATALOG[Math.floor(Math.random() * ACTIONS_CATALOG.length)];
    const targetId = `WO-90${10 + (i % 80)}`;

    const { desc, descBn, resType, before, after } = actionDef.template(user.name, targetId);

    // Occasional suspicious flagging (e.g. unknown foreign IP or midnight logins)
    const isForeign = user.ip.startsWith('45.134');
    const isMidnight = dateObj.getHours() < 5;
    const flaggedSuspicious = isForeign || (actionDef.severity === 'critical' && isMidnight);

    entries.push({
      id: `audit-${(1000 + i).toString()}`,
      timestamp: dateObj.toISOString(),
      userId: user.id,
      userName: user.name,
      userRole: user.role,
      action: actionDef.action,
      category: actionDef.category,
      severity: isForeign ? 'critical' : actionDef.severity,
      resourceType: resType,
      resourceId: targetId,
      description: desc,
      descriptionBangla: descBn,
      before,
      after,
      metadata: {
        ip: user.ip,
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/122.0',
        device: user.role === 'technician' ? 'Samsung Galaxy A54 (Android 14)' : 'MacBook Pro 16" (macOS Sonoma)',
        location: user.loc,
        tenantId: 'tenant-dhaka-hq',
        tenantName: 'Grameen Infrastructure NOC',
        sessionId: `sess-${(20000 + i).toString(36)}`,
      },
      flaggedSuspicious,
      suspiciousReason: isForeign
        ? 'Access originated from foreign IP address outside Bangladesh ASN boundaries'
        : isMidnight
        ? 'High-privilege system mutation outside regular business hours (BST)'
        : undefined,
    });
  }

  // Sort descending by timestamp
  return entries.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

export const INITIAL_AUDIT_ENTRIES: AuditEntry[] = generateMockAuditEntries(520);

export const INITIAL_SECURITY_ALERTS: SecurityAlert[] = [
  {
    id: 'alt-01',
    title: 'Multiple Failed Logins from Foreign IP',
    titleBangla: 'বিদেশি আইপি থেকে একাধিক ব্যর্থ লগইন চেষ্টা',
    type: 'brute_force',
    severity: 'critical',
    timestamp: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
    userId: 'usr-unknown',
    userName: 'Unauthenticated Actor',
    ip: '45.134.22.189',
    location: 'Bucharest, Romania',
    details: '5 failed login attempts in 90 seconds targeting admin accounts. IP was auto-blocked by rate limiter.',
    status: 'active',
  },
  {
    id: 'alt-02',
    title: 'After-Hours High-Volume Data Export',
    titleBangla: 'অফিস সময়ের বাইরে বিপুল পরিমাণ ডাটা এক্সপোর্ট',
    type: 'after_hours',
    severity: 'warning',
    timestamp: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
    userId: 'usr-6',
    userName: 'Kazi Mahbub Alam',
    ip: '103.108.144.90',
    location: 'Motijheel, Dhaka',
    details: 'Customer financial ledger and NBR tax records exported at 03:14 AM BST outside normal shifts.',
    status: 'investigating',
  },
  {
    id: 'alt-03',
    title: 'Work Order Mass Deletion Triggered',
    titleBangla: 'একসাথে একাধিক ওয়ার্ক অর্ডার ডিলিট',
    type: 'privilege_escalation',
    severity: 'critical',
    timestamp: new Date(Date.now() - 18 * 3600 * 1000).toISOString(),
    userId: 'usr-2',
    userName: 'Farhana Akhter',
    ip: '103.108.144.45',
    location: 'Banani, Dhaka',
    details: 'Admin user deleted 4 cancelled enterprise tickets simultaneously. Compliance review pending.',
    status: 'resolved',
  },
  {
    id: 'alt-04',
    title: 'Simultaneous Logins from Distinct Locations',
    titleBangla: 'ভিন্ন ভিন্ন শহর থেকে একযোগে লগইন',
    type: 'unusual_ip',
    severity: 'warning',
    timestamp: new Date(Date.now() - 28 * 3600 * 1000).toISOString(),
    userId: 'usr-3',
    userName: 'Tanvir Hossain',
    ip: '118.179.224.89',
    location: 'Agrabad, Chittagong & Dhaka NOC',
    details: 'Concurrent active sessions detected in Dhaka and Chittagong within 5 minutes.',
    status: 'dismissed',
  },
];
