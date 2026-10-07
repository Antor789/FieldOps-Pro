import { useCallback } from 'react';
import { useAuth } from './useAuth';
import { AuditCategory, AuditSeverity, AuditEntry } from '../types/audit';

const LOCAL_BUFFER_KEY = 'fieldops_frontend_audit_buffer';

export function useAuditLogger() {
  const { user } = useAuth();

  const logAction = useCallback(
    (
      action: string,
      category: AuditCategory,
      details: string,
      options: {
        severity?: AuditSeverity;
        resourceType?: string;
        resourceId?: string;
        before?: Record<string, any>;
        after?: Record<string, any>;
        descriptionBangla?: string;
      } = {}
    ) => {
      const entry: AuditEntry = {
        id: `audit-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        timestamp: new Date().toISOString(),
        userId: user?.id || 'usr-guest',
        userName: user?.name || 'Unauthenticated User',
        userRole: user?.role || 'guest',
        action: action.toUpperCase(),
        category,
        severity: options.severity || 'info',
        resourceType: options.resourceType || 'General',
        resourceId: options.resourceId || 'N/A',
        description: details,
        descriptionBangla: options.descriptionBangla,
        before: options.before,
        after: options.after,
        metadata: {
          ip: '103.108.144.12',
          userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'Client',
          device: typeof navigator !== 'undefined' && navigator.userAgent.includes('Mobile') ? 'Mobile Device' : 'Desktop Browser',
          location: 'Gulshan 2, Dhaka, Bangladesh',
          tenantId: user?.tenantId || 'tenant-dhaka-hq',
          tenantName: user?.tenantName || 'Grameen Infrastructure NOC',
        },
      };

      try {
        const existingRaw = localStorage.getItem(LOCAL_BUFFER_KEY);
        const existing: AuditEntry[] = existingRaw ? JSON.parse(existingRaw) : [];
        const updated = [entry, ...existing].slice(0, 100);
        localStorage.setItem(LOCAL_BUFFER_KEY, JSON.stringify(updated));
      } catch (err) {
        console.warn('[FieldOps AuditLogger] Could not persist to local buffer', err);
      }

      console.log(`[FieldOps AuditTrail] [${entry.severity.toUpperCase()}] ${entry.action}: ${entry.description}`);
    },
    [user]
  );

  return { logAction };
}
