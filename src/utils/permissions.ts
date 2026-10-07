import { UserRole, RoleDefinition, MenuItem, StandardPermissionKey } from '../types/rbac';

/**
 * Standard Permission keys and metadata
 */
export const PERMISSIONS: Record<
  StandardPermissionKey,
  { label: string; labelBangla: string; category: string; description: string }
> = {
  'work_orders.create': {
    label: 'Create Work Orders',
    labelBangla: 'নতুন ওয়ার্ক অর্ডার তৈরি',
    category: 'Work Orders',
    description: 'Dispatch new tickets, schedule field jobs, and assign crews.',
  },
  'work_orders.view': {
    label: 'View Work Orders',
    labelBangla: 'ওয়ার্ক অর্ডার দেখা',
    category: 'Work Orders',
    description: 'View work order board, status cards, and service tasks.',
  },
  'work_orders.edit': {
    label: 'Edit Work Orders',
    labelBangla: 'ওয়ার্ক অর্ডার সম্পাদনা',
    category: 'Work Orders',
    description: 'Update status, reschedule, change assigned tech or parts.',
  },
  'work_orders.delete': {
    label: 'Delete Work Orders',
    labelBangla: 'ওয়ার্ক অর্ডার মুছুন',
    category: 'Work Orders',
    description: 'Permanently remove tickets from database records.',
  },
  'technicians.manage': {
    label: 'Manage Technicians',
    labelBangla: 'টেকনিশিয়ান ব্যবস্থাপনা',
    category: 'Fleet & Staff',
    description: 'Add, edit, assign skills, and track technician duty rosters.',
  },
  'reports.view': {
    label: 'View Operational Reports',
    labelBangla: 'অপারেশনাল রিপোর্ট দেখা',
    category: 'Analytics',
    description: 'Access KPI dashboards, SLA breach analytics, and team efficiency.',
  },
  'reports.financial': {
    label: 'Financial Reports',
    labelBangla: 'আর্থিক হিসাব রিপোর্ট',
    category: 'Financial',
    description: 'Revenue breakdowns, profit margins, and turnover audits.',
  },
  vat_reports: {
    label: 'NBR VAT & Mushak 6.3',
    labelBangla: 'জাতীয় রাজস্ব বোর্ড (এনবিআর) মূসক ৬.৩',
    category: 'Compliance',
    description: 'Statutory VAT audit trail, BIN tax invoices, and NBR returns.',
  },
  'settings.system': {
    label: 'System & Multi-Tenant Settings',
    labelBangla: 'সিস্টেম কনফিগারেশন ও ক্লাউড সেটিংস',
    category: 'Administration',
    description: 'Platform infrastructure, database tenancy, and API credentials.',
  },
  'users.manage': {
    label: 'User Management & RBAC',
    labelBangla: 'ব্যবহারকারী ও পদবি পরিচালনা',
    category: 'Administration',
    description: 'Invite employees, modify roles, deactivate, and assign permissions.',
  },
  'customers.manage': {
    label: 'Manage Enterprise Clients',
    labelBangla: 'ক্লায়েন্ট ডিরেক্টরি ব্যবস্থাপনা',
    category: 'CRM',
    description: 'Enterprise corporate contracts, contact sites, and SLAs.',
  },
  'inventory.manage': {
    label: 'Inventory & Van Stock',
    labelBangla: 'যন্ত্রাংশ ও ইনভেন্টরি স্টক',
    category: 'Logistics',
    description: 'Warehouse spare parts, van stock requisitions, and barcode scan.',
  },
  'map.view': {
    label: 'Live GPS Map & Radar',
    labelBangla: 'লাইভ জিপিএস ট্র্যাকিং ম্যাপ',
    category: 'Dispatch',
    description: 'Real-time telemetry, technician location markers, and geofencing.',
  },
  'payments.process': {
    label: 'Process Payments & bKash',
    labelBangla: 'পেমেন্ট ও বিকাশ গ্রহণ',
    category: 'Financial',
    description: 'Accept bKash, Nagad, Cash-on-delivery, and verify transactions.',
  },
};

/**
 * Standard Role Permissions Mapping
 */
export const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  super_admin: [
    'work_orders.create',
    'work_orders.view',
    'work_orders.edit',
    'work_orders.delete',
    'technicians.manage',
    'reports.view',
    'reports.financial',
    'vat_reports',
    'settings.system',
    'users.manage',
    'customers.manage',
    'inventory.manage',
    'map.view',
    'payments.process',
  ],
  admin: [
    'work_orders.create',
    'work_orders.view',
    'work_orders.edit',
    'work_orders.delete',
    'technicians.manage',
    'reports.view',
    'reports.financial',
    'vat_reports',
    'users.manage',
    'customers.manage',
    'inventory.manage',
    'map.view',
    'payments.process',
  ],
  manager: [
    'work_orders.create',
    'work_orders.view',
    'work_orders.edit',
    'technicians.manage',
    'reports.view',
    'customers.manage',
    'inventory.manage',
    'map.view',
  ],
  dispatcher: [
    'work_orders.create',
    'work_orders.view',
    'work_orders.edit',
    'customers.manage',
    'map.view',
    'payments.process',
  ],
  technician: [
    'work_orders.view', // Scoped to own work orders
    'work_orders.edit', // Scoped to own work orders
    'payments.process',
  ],
  accountant: [
    'reports.view',
    'reports.financial',
    'vat_reports',
    'payments.process',
    'customers.manage',
  ],
  customer: [
    'work_orders.view', // Scoped to own customer jobs
  ],
};

/**
 * Role Definitions with badges, colors, and descriptions
 */
export const ROLES: RoleDefinition[] = [
  {
    id: 'super_admin',
    name: 'Super Admin',
    nameBangla: 'সুপার এডমিন',
    description: 'Full unrestricted system access across all infrastructure, tenants, and security protocols.',
    color: 'purple',
    icon: 'Crown',
    permissions: ROLE_PERMISSIONS.super_admin,
    isSystem: true,
  },
  {
    id: 'admin',
    name: 'Company Admin',
    nameBangla: 'কোম্পানি এডমিন',
    description: 'Company-level management for work orders, technicians, team RBAC, invoicing, and NBR VAT.',
    color: 'red',
    icon: 'ShieldCheck',
    permissions: ROLE_PERMISSIONS.admin,
    isSystem: true,
  },
  {
    id: 'manager',
    name: 'Operations Manager',
    nameBangla: 'অপারেশনস ম্যানেজার',
    description: 'Oversees daily field operations, inventory replenishment, technician schedules, and dispatching.',
    color: 'orange',
    icon: 'Briefcase',
    permissions: ROLE_PERMISSIONS.manager,
    isSystem: true,
  },
  {
    id: 'dispatcher',
    name: 'Job Dispatcher',
    nameBangla: 'ডিসপ্যাচার',
    description: 'Coordinates active work orders, assigns jobs on live GPS map, and monitors route telemetry.',
    color: 'blue',
    icon: 'Radio',
    permissions: ROLE_PERMISSIONS.dispatcher,
    isSystem: true,
  },
  {
    id: 'technician',
    name: 'Field Technician',
    nameBangla: 'ফিল্ড টেকনিশিয়ান',
    description: 'Executes assigned work orders on mobile PWA, collects signatures, and receives bKash payments.',
    color: 'green',
    icon: 'Wrench',
    permissions: ROLE_PERMISSIONS.technician,
    isSystem: true,
  },
  {
    id: 'accountant',
    name: 'Finance & Accounts',
    nameBangla: 'হিসাব ও অর্থ কর্মকর্তা',
    description: 'Accesses revenue ledgers, NBR VAT compliance, payment receipts, and corporate invoicing.',
    color: 'teal',
    icon: 'Banknote',
    permissions: ROLE_PERMISSIONS.accountant,
    isSystem: true,
  },
  {
    id: 'customer',
    name: 'Customer Portal',
    nameBangla: 'ক্লায়েন্ট পোর্টাল',
    description: 'Monitors service ticket status, live tech arrival ETA, and payment history.',
    color: 'gray',
    icon: 'User',
    permissions: ROLE_PERMISSIONS.customer,
    isSystem: true,
  },
];

/**
 * Checks if a given role has a specific permission key, accounting for custom overrides.
 */
export function checkPermission(
  userRole: UserRole,
  permission: string,
  customPermissions?: string[],
  isOwnResource?: boolean
): boolean {
  // Super admin has all permissions
  if (userRole === 'super_admin') return true;

  // Check custom individual user overrides first
  if (customPermissions && customPermissions.includes(permission)) {
    return true;
  }

  const rolePerms = ROLE_PERMISSIONS[userRole] || [];

  // Special scoping for technician and customer: own resource check
  if ((userRole === 'technician' || userRole === 'customer') && isOwnResource !== undefined) {
    if (!isOwnResource) return false;
  }

  return rolePerms.includes(permission);
}

/**
 * Return navigation items permitted for a role
 */
export function getMenuItemsForRole(role: UserRole): MenuItem[] {
  const allItems: MenuItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      labelBangla: 'ড্যাশবোর্ড',
      path: '/dashboard',
      icon: 'LayoutDashboard',
      requiredPermission: 'work_orders.view',
    },
    {
      id: 'work-orders',
      label: 'Work Orders',
      labelBangla: 'ওয়ার্ক অর্ডার',
      path: '/work-orders',
      icon: 'ClipboardList',
      requiredPermission: 'work_orders.view',
    },
    {
      id: 'technicians',
      label: 'Technicians',
      labelBangla: 'টেকনিশিয়ান',
      path: '/technicians',
      icon: 'Users',
      requiredPermission: 'technicians.manage',
    },
    {
      id: 'customers',
      label: 'Customers',
      labelBangla: 'ক্লায়েন্ট',
      path: '/customers',
      icon: 'Building2',
      requiredPermission: 'customers.manage',
    },
    {
      id: 'live-map',
      label: 'Live GPS Map',
      labelBangla: 'লাইভ ম্যাপ',
      path: '/live-map',
      icon: 'MapPin',
      requiredPermission: 'map.view',
    },
    {
      id: 'schedule',
      label: 'Schedule Gantt',
      labelBangla: 'শিডিউল',
      path: '/schedule',
      icon: 'Calendar',
      requiredPermission: 'work_orders.create',
    },
    {
      id: 'inventory',
      label: 'Van Inventory',
      labelBangla: 'ইনভেন্টরি',
      path: '/inventory',
      icon: 'Package',
      requiredPermission: 'inventory.manage',
    },
    {
      id: 'reports',
      label: 'Reports & NBR VAT',
      labelBangla: 'রিপোর্ট ও ভ্যাট',
      path: '/reports',
      icon: 'FileText',
      requiredPermission: 'reports.view',
    },
    {
      id: 'users',
      label: 'User Management & RBAC',
      labelBangla: 'ইউজার ও এক্সেস',
      path: '/users',
      icon: 'ShieldCheck',
      requiredPermission: 'users.manage',
    },
    {
      id: 'settings',
      label: 'Settings',
      labelBangla: 'সেটিংস',
      path: '/settings',
      icon: 'Settings',
      requiredPermission: 'settings.system',
    },
  ];

  return allItems.filter((item) => {
    if (!item.requiredPermission) return true;
    return checkPermission(role, item.requiredPermission);
  });
}
