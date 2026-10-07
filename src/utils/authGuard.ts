import { AuthUser, LoginHistoryEntry, UserRole } from '../types/auth';

/**
 * Bangladesh mobile phone validator
 * Valid format: 01[3-9]XXXXXXXX (11 digits, standard BD telecom format)
 * Allowed prefixes: 013, 014, 015, 016, 017, 018, 019
 */
export function validateBDPhone(phone: string): { isValid: boolean; normalized: string; error?: string } {
  // Strip non-digits and leading +88 or 88
  let clean = phone.replace(/\D/g, '');
  if (clean.startsWith('8801')) {
    clean = clean.substring(2);
  } else if (clean.startsWith('88') && clean.length === 13) {
    clean = clean.substring(2);
  }

  if (clean.length === 0) {
    return { isValid: false, normalized: '', error: 'Phone number is required' };
  }

  // Must be 11 digits starting with 01
  const bdRegex = /^01[3-9]\d{8}$/;
  if (!bdRegex.test(clean)) {
    return {
      isValid: false,
      normalized: clean,
      error: 'Invalid Bangladesh mobile number. Format must be 01XXXXXXXXX (11 digits)',
    };
  }

  return { isValid: true, normalized: clean };
}

/**
 * Greenweb SMS Gateway Simulator (Bangladesh Enterprise SMS Gateway)
 */
export async function sendGreenwebSMS(
  phone: string,
  message: string
): Promise<{ success: boolean; status: string; trxId: string }> {
  // Simulate network delay to Greenweb API gateway in Dhaka
  await new Promise((resolve) => setTimeout(resolve, 600));

  console.log(`[Greenweb SMS Gateway BD] Dispatched to +88${phone}: "${message}"`);

  return {
    success: true,
    status: 'DELIVERED',
    trxId: `GW-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
  };
}

/**
 * Role-Based Access Control matrix
 */
export const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  super_admin: ['*'], // Full access across all systems
  admin: ['*'], // Full company access
  manager: [
    'dashboard',
    'work-orders',
    'technicians',
    'customers',
    'live-map',
    'schedule',
    'inventory',
    'reports',
  ],
  dispatcher: [
    'dashboard',
    'work-orders',
    'technicians',
    'customers',
    'live-map',
    'schedule',
  ],
  technician: ['field-pwa', 'work-orders', 'inventory'],
  accountant: ['dashboard', 'reports', 'customers'],
  customer: ['customer-portal'],
};

export function canAccessSection(role: UserRole, section: string): boolean {
  const permissions = ROLE_PERMISSIONS[role] || [];
  if (permissions.includes('*')) return true;
  return permissions.includes(section);
}

/**
 * Initial Default Enterprise Admin & Technician User Profiles
 */
export const DEFAULT_USERS: AuthUser[] = [
  {
    id: 'usr-admin-01',
    email: 'admin@fieldops.com.bd',
    phone: '01712345678',
    firstName: 'Md. Shafiqul',
    lastName: 'Islam',
    name: 'Md. Shafiqul Islam',
    role: 'admin',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    tenantId: 'tenant-dhaka-hq',
    tenantName: 'Grameen Infrastructure NOC',
    isTwoFactorEnabled: false,
    twoFactorMethod: 'authenticator',
    lastLoginAt: new Date().toISOString(),
  },
  {
    id: 'usr-dispatch-02',
    email: 'dispatcher@fieldops.com.bd',
    phone: '01812345678',
    firstName: 'Tanvir',
    lastName: 'Hossain',
    name: 'Tanvir Hossain',
    role: 'dispatcher',
    tenantId: 'tenant-dhaka-hq',
    tenantName: 'Dhaka Command Desk',
    isTwoFactorEnabled: true,
    twoFactorMethod: 'sms',
    lastLoginAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: 'usr-tech-03',
    email: 'tech.rahim@fieldops.com.bd',
    phone: '01912345678',
    firstName: 'Rahim',
    lastName: 'Ahmed',
    name: 'Rahim Ahmed (Lead Tech)',
    role: 'technician',
    tenantId: 'tenant-dhaka-hq',
    tenantName: 'FieldOps Mobile Fleet',
    isTwoFactorEnabled: false,
    lastLoginAt: new Date(Date.now() - 7200000).toISOString(),
  },
];

/**
 * Initial 5 login activity entries with IP & anomaly flags
 */
export const INITIAL_LOGIN_HISTORY: LoginHistoryEntry[] = [
  {
    id: 'log-1',
    userId: 'usr-admin-01',
    timestamp: 'Just now',
    device: 'MacBook Pro 16"',
    browser: 'Chrome 122.0',
    os: 'macOS Sonoma',
    ip: '103.108.144.12',
    location: 'Gulshan 2, Dhaka, Bangladesh',
    status: 'success',
    isCurrent: true,
  },
  {
    id: 'log-2',
    userId: 'usr-admin-01',
    timestamp: 'Yesterday at 04:15 PM BST',
    device: 'iPhone 15 Pro',
    browser: 'Mobile Safari 17.2',
    os: 'iOS 17.2',
    ip: '103.108.144.45',
    location: 'Banani, Dhaka, Bangladesh',
    status: 'success',
    isCurrent: false,
  },
  {
    id: 'log-3',
    userId: 'usr-admin-01',
    timestamp: 'Jan 13, 2025 09:30 AM BST',
    device: 'Windows 11 Workstation',
    browser: 'Edge 121.0',
    os: 'Windows 11',
    ip: '118.179.224.89',
    location: 'Agrabad, Chittagong, Bangladesh',
    status: 'success',
    isCurrent: false,
  },
  {
    id: 'log-4',
    userId: 'usr-admin-01',
    timestamp: 'Jan 10, 2025 11:22 PM BST',
    device: 'Linux X11 Device',
    browser: 'Firefox 120.0',
    os: 'Ubuntu 22.04',
    ip: '45.134.22.189',
    location: 'Bucharest, Romania (Foreign IP)',
    status: 'suspicious',
    isCurrent: false,
    suspiciousReason: 'Unrecognized country IP and abnormal midnight access attempt blocked by firewall',
  },
  {
    id: 'log-5',
    userId: 'usr-admin-01',
    timestamp: 'Jan 08, 2025 08:45 AM BST',
    device: 'MacBook Pro 16"',
    browser: 'Chrome 121.0',
    os: 'macOS Sonoma',
    ip: '103.108.144.12',
    location: 'Gulshan 2, Dhaka, Bangladesh',
    status: 'success',
    isCurrent: false,
  },
];
