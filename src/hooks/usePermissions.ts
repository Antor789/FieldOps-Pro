import { useMemo, useCallback } from 'react';
import { useAuth } from './useAuth';
import { UserRole } from '../types/rbac';
import { checkPermission, ROLE_PERMISSIONS } from '../utils/permissions';

export function usePermissions() {
  const { user } = useAuth();

  const currentUserRole: UserRole = (user?.role as UserRole) || 'admin';
  const customPermissions = user?.customPermissions || [];

  const currentUserPermissions = useMemo(() => {
    const rolePerms = ROLE_PERMISSIONS[currentUserRole] || [];
    const combined = new Set([...rolePerms, ...customPermissions]);
    return Array.from(combined);
  }, [currentUserRole, customPermissions]);

  const hasPermission = useCallback(
    (permission: string, isOwnResource?: boolean): boolean => {
      return checkPermission(currentUserRole, permission, customPermissions, isOwnResource);
    },
    [currentUserRole, customPermissions]
  );

  const hasRole = useCallback(
    (role: UserRole | UserRole[]): boolean => {
      if (Array.isArray(role)) {
        return role.includes(currentUserRole);
      }
      return currentUserRole === role;
    },
    [currentUserRole]
  );

  const canAccess = useCallback(
    (resource: string, action: string): boolean => {
      // Map resource + action to permission key e.g. "work_orders" + "create" -> "work_orders.create"
      const permKey = `${resource}.${action}`;
      return hasPermission(permKey);
    },
    [hasPermission]
  );

  return {
    hasPermission,
    hasRole,
    canAccess,
    currentUserRole,
    currentUserPermissions,
    isSuperAdmin: currentUserRole === 'super_admin',
    isAdmin: currentUserRole === 'admin' || currentUserRole === 'super_admin',
    isManager: currentUserRole === 'manager',
    isDispatcher: currentUserRole === 'dispatcher',
    isTechnician: currentUserRole === 'technician',
    isAccountant: currentUserRole === 'accountant',
    isCustomer: currentUserRole === 'customer',
  };
}
