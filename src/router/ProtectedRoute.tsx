import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { usePermissions } from '../hooks/usePermissions';
import { UserRole } from '../types/rbac';
import { ForbiddenPage } from '../pages/errors/Forbidden';

export interface ProtectedRouteProps {
  children: React.ReactNode;
  permission?: string;
  allowedRoles?: UserRole[];
  onRedirectToLogin?: () => void;
  onGoHome?: () => void;
  locale?: 'en' | 'bn';
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  permission,
  allowedRoles,
  onRedirectToLogin,
  onGoHome,
  locale = 'en',
}) => {
  const { isAuthenticated } = useAuth();
  const { hasPermission, hasRole } = usePermissions();

  // If not authenticated, prompt login
  if (!isAuthenticated) {
    if (onRedirectToLogin) {
      onRedirectToLogin();
      return null;
    }
    return (
      <div className="p-8 text-center text-xs text-slate-500">
        Authentication required to view this page.
      </div>
    );
  }

  // Check required permission
  if (permission && !hasPermission(permission)) {
    return (
      <ForbiddenPage
        requiredPermission={permission}
        onGoHome={onGoHome}
        locale={locale}
      />
    );
  }

  // Check required role
  if (allowedRoles && allowedRoles.length > 0 && !hasRole(allowedRoles)) {
    return (
      <ForbiddenPage
        requiredPermission={allowedRoles.join(' or ')}
        onGoHome={onGoHome}
        locale={locale}
      />
    );
  }

  return <>{children}</>;
};
