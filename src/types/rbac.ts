/**
 * FieldOps Pro - Role-Based Access Control (RBAC) Types
 * Multi-tier authorization, resource-action matrix, custom permissions, and team audit logs.
 */

export type UserRole =
  | 'super_admin'
  | 'admin'
  | 'manager'
  | 'dispatcher'
  | 'technician'
  | 'accountant'
  | 'customer';

export type UserStatus = 'active' | 'inactive' | 'pending';

export type PermissionAction = 'create' | 'read' | 'update' | 'delete';

export interface Permission {
  resource: string;
  actions: PermissionAction[];
}

export type StandardPermissionKey =
  | 'work_orders.create'
  | 'work_orders.view'
  | 'work_orders.edit'
  | 'work_orders.delete'
  | 'technicians.manage'
  | 'reports.view'
  | 'reports.financial'
  | 'vat_reports'
  | 'settings.system'
  | 'users.manage'
  | 'customers.manage'
  | 'inventory.manage'
  | 'map.view'
  | 'payments.process';

export interface RoleDefinition {
  id: UserRole;
  name: string;
  nameBangla: string;
  description: string;
  color: string; // Tailored badge color: purple, red, orange, blue, green, teal, gray
  icon: string;
  permissions: string[];
  isSystem?: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  customPermissions?: string[];
  status: UserStatus;
  division?: string;
  avatar?: string;
  lastLogin?: Date | string;
  createdAt: Date | string;
}

export interface InviteUserData {
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  division: string;
  customPermissions?: string[];
  sendSMS?: boolean;
}

export interface MenuItem {
  id: string;
  label: string;
  labelBangla: string;
  path: string;
  icon: string;
  requiredPermission?: string;
}
