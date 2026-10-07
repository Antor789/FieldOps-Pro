import { AuditEntry, AuditSeverity, AuditCategory, DiffEntry } from '../types/audit';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

/**
 * Returns formatted human-readable action label
 */
export function formatAuditAction(action: string): string {
  return action
    .replace(/_/g, ' ')
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

/**
 * Returns color classes for severities
 */
export function getSeverityColor(severity: AuditSeverity): {
  bg: string;
  text: string;
  border: string;
  badge: string;
  dot: string;
} {
  switch (severity) {
    case 'critical':
      return {
        bg: 'bg-rose-50 dark:bg-rose-950/60',
        text: 'text-rose-700 dark:text-rose-300',
        border: 'border-rose-200 dark:border-rose-800',
        badge: 'bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 border-rose-300 dark:border-rose-800',
        dot: 'bg-rose-500',
      };
    case 'warning':
      return {
        bg: 'bg-amber-50 dark:bg-amber-950/60',
        text: 'text-amber-700 dark:text-amber-300',
        border: 'border-amber-200 dark:border-amber-800',
        badge: 'bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-800',
        dot: 'bg-amber-500',
      };
    case 'info':
    default:
      return {
        bg: 'bg-slate-50 dark:bg-slate-800/60',
        text: 'text-slate-700 dark:text-slate-300',
        border: 'border-slate-200 dark:border-slate-700',
        badge: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700',
        dot: 'bg-emerald-500',
      };
  }
}

/**
 * Returns category color badge styles
 */
export function getCategoryBadge(category: AuditCategory): { label: string; badge: string } {
  switch (category) {
    case 'auth':
      return { label: 'Auth & Security', badge: 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200' };
    case 'work_orders':
      return { label: 'Work Orders', badge: 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border-indigo-200' };
    case 'users':
      return { label: 'Users & RBAC', badge: 'bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border-purple-200' };
    case 'payments':
      return { label: 'Payments (bKash)', badge: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200' };
    case 'reports':
      return { label: 'Reports & NBR', badge: 'bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border-teal-200' };
    case 'system':
      return { label: 'System & Infra', badge: 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200' };
    case 'data':
      return { label: 'Data Management', badge: 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-200' };
    default:
      return { label: category, badge: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200' };
  }
}

/**
 * Generates an array of structured diffs between before and after states
 */
export function formatDiff(before?: Record<string, any>, after?: Record<string, any>): DiffEntry[] {
  if (!before && !after) return [];

  const keys = Array.from(new Set([...Object.keys(before || {}), ...Object.keys(after || {})]));
  const diffs: DiffEntry[] = [];

  for (const key of keys) {
    const valBefore = before ? before[key] : undefined;
    const valAfter = after ? after[key] : undefined;

    if (JSON.stringify(valBefore) !== JSON.stringify(valAfter)) {
      diffs.push({
        field: key,
        label: key.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase()),
        before: valBefore !== undefined ? valBefore : '(none)',
        after: valAfter !== undefined ? valAfter : '(deleted)',
      });
    }
  }

  return diffs;
}

/**
 * Formats relative timestamp in Bangladesh Timezone
 */
export function formatRelativeTimestamp(isoDate: string | Date): string {
  const date = new Date(isoDate);
  const now = new Date();
  const diffSec = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffSec < 60) return 'Just now';
  if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`;
  if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`;
  if (diffSec < 172800) return 'Yesterday';

  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Export audit entries to CSV
 */
export function exportAuditLogsToCSV(entries: AuditEntry[]): void {
  const headers = ['ID', 'Timestamp (BST)', 'User', 'Role', 'Category', 'Action', 'Severity', 'Resource', 'Details', 'IP Address', 'Location'];
  const rows = entries.map((e) => [
    e.id,
    new Date(e.timestamp).toLocaleString('en-GB', { timeZone: 'Asia/Dhaka' }),
    `"${e.userName.replace(/"/g, '""')}"`,
    e.userRole,
    e.category,
    e.action,
    e.severity.toUpperCase(),
    `${e.resourceType}:${e.resourceId}`,
    `"${e.description.replace(/"/g, '""')}"`,
    e.metadata.ip,
    `"${(e.metadata.location || '').replace(/"/g, '""')}"`,
  ]);

  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `FieldOps_Audit_Log_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Export audit entries to formal PDF
 */
export function exportAuditLogsToPDF(entries: AuditEntry[]): void {
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });

  // Official Enterprise Header
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('FIELDOPS PRO BANGLADESH — ENTERPRISE AUDIT TRAIL', 14, 15);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('Statutory Security Compliance & NBR Audit Report • Timezone: BST (UTC+6)', 14, 21);
  doc.text(`Generated at: ${new Date().toLocaleString('en-GB', { timeZone: 'Asia/Dhaka' })} | Total Records: ${entries.length}`, 14, 26);

  const tableData = entries.slice(0, 100).map((e) => [
    new Date(e.timestamp).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
    e.userName,
    e.action,
    e.category.toUpperCase(),
    e.severity.toUpperCase(),
    e.description.slice(0, 75) + (e.description.length > 75 ? '...' : ''),
    e.metadata.ip,
  ]);

  autoTable(doc, {
    startY: 30,
    head: [['Time (BST)', 'User', 'Action', 'Category', 'Severity', 'Description', 'IP Address']],
    body: tableData,
    theme: 'grid',
    styles: { fontSize: 8, cellPadding: 2 },
    headStyles: { fillColor: [15, 23, 42], textColor: [255, 255, 255] },
    alternateRowStyles: { fillColor: [248, 250, 252] },
  });

  doc.save(`FieldOps_Audit_Trail_${new Date().toISOString().split('T')[0]}.pdf`);
}
