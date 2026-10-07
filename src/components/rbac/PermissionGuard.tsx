import React from 'react';
import { usePermissions } from '../../hooks/usePermissions';
import { UserRole } from '../../types/rbac';
import { ShieldAlert, Lock, ArrowLeft } from 'lucide-react';
import { RoleBadge } from './RoleBadge';

export interface PermissionGuardProps {
  permission?: string;
  role?: UserRole | UserRole[];
  fallback?: React.ReactNode;
  showDeniedNotice?: boolean;
  isOwnResource?: boolean;
  children: React.ReactNode;
}

export const PermissionGuard: React.FC<PermissionGuardProps> = ({
  permission,
  role,
  fallback = null,
  showDeniedNotice = false,
  isOwnResource,
  children,
}) => {
  const { hasPermission, hasRole, currentUserRole } = usePermissions();

  let isAllowed = true;

  if (permission && !hasPermission(permission, isOwnResource)) {
    isAllowed = false;
  }

  if (role && !hasRole(role)) {
    isAllowed = false;
  }

  if (isAllowed) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  if (showDeniedNotice) {
    return (
      <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-3 max-w-md mx-auto my-6 shadow-sm">
        <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 mx-auto flex items-center justify-center">
          <Lock className="w-6 h-6" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-slate-900 dark:text-white">
            Access Restricted (RBAC 403)
          </h4>
          <p className="text-xs text-slate-500 mt-1">
            Your current role does not have permission to view or manage this operational resource.
          </p>
        </div>
        <div className="flex items-center justify-center gap-2 pt-1">
          <span className="text-xs text-slate-400">Current Role:</span>
          <RoleBadge role={currentUserRole} size="sm" />
        </div>
      </div>
    );
  }

  return null;
};
