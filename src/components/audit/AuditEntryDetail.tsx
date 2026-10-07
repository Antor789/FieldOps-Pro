import React from 'react';
import { AuditEntry } from '../../types/audit';
import { SeverityBadge } from './SeverityBadge';
import { formatAuditAction, formatDiff, getCategoryBadge } from '../../utils/auditFormatter';
import {
  X,
  Clock,
  User,
  Shield,
  MapPin,
  Laptop,
  Server,
  AlertTriangle,
  ArrowRight,
  Copy,
  Check,
  FileText,
  ExternalLink,
} from 'lucide-react';

export interface AuditEntryDetailProps {
  entry: AuditEntry | null;
  onClose: () => void;
  onViewRelatedEntity?: (resourceType: string, resourceId: string) => void;
  locale?: 'en' | 'bn';
}

export const AuditEntryDetail: React.FC<AuditEntryDetailProps> = ({
  entry,
  onClose,
  onViewRelatedEntity,
  locale = 'en',
}) => {
  if (!entry) return null;

  const diffs = formatDiff(entry.before, entry.after);
  const catBadge = getCategoryBadge(entry.category);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex justify-end animate-fadeIn">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 h-full shadow-2xl flex flex-col justify-between overflow-hidden">
        {/* Top Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <SeverityBadge severity={entry.severity} size="md" />
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${catBadge.badge}`}>
                {catBadge.label}
              </span>
            </div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white pt-1">
              {formatAuditAction(entry.action)}
            </h3>
            <p className="text-xs text-slate-500 font-mono">Log ID: {entry.id}</p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-5 flex-1 overflow-y-auto space-y-5 text-xs font-sans">
          {/* Suspicious Warning Callout */}
          {entry.flaggedSuspicious && (
            <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 flex items-start gap-3 text-rose-800 dark:text-rose-200">
              <AlertTriangle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-xs">Flagged Security Anomaly</div>
                <p className="text-[11px] mt-0.5 leading-relaxed">
                  {entry.suspiciousReason || 'Unusual access profile or foreign IP address outside Bangladesh.'}
                </p>
              </div>
            </div>
          )}

          {/* Description Card */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Event Summary:
            </span>
            <p className="text-slate-900 dark:text-white text-xs leading-relaxed font-medium">
              {locale === 'bn' && entry.descriptionBangla ? entry.descriptionBangla : entry.description}
            </p>
          </div>

          {/* Actor & Session Info */}
          <div className="space-y-3">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Actor & Context
            </h4>

            <div className="grid grid-cols-2 gap-2.5">
              <div className="p-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                <span className="text-slate-400 text-[10px] block">User Name</span>
                <span className="font-bold text-slate-900 dark:text-white truncate block mt-0.5">
                  {entry.userName}
                </span>
                <span className="text-[10px] text-slate-400 capitalize mt-0.5 block">
                  Role: {entry.userRole.replace('_', ' ')}
                </span>
              </div>

              <div className="p-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                <span className="text-slate-400 text-[10px] block">Timestamp (BST)</span>
                <span className="font-mono text-slate-900 dark:text-white text-[11px] block mt-0.5">
                  {new Date(entry.timestamp).toLocaleTimeString('en-GB')}
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5">
                  {new Date(entry.timestamp).toLocaleDateString('en-GB')}
                </span>
              </div>

              <div className="p-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                <span className="text-slate-400 text-[10px] block">Client IP Address</span>
                <span className="font-mono text-slate-900 dark:text-white text-xs font-semibold block mt-0.5">
                  {entry.metadata.ip}
                </span>
                <span className="text-[10px] text-slate-400 truncate block mt-0.5">
                  {entry.metadata.location || 'Dhaka NOC'}
                </span>
              </div>

              <div className="p-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                <span className="text-slate-400 text-[10px] block">Target Resource</span>
                <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold block mt-0.5">
                  {entry.resourceId}
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5">
                  Type: {entry.resourceType}
                </span>
              </div>
            </div>
          </div>

          {/* Before & After Values Diff Viewer */}
          {diffs.length > 0 ? (
            <div className="space-y-3">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Data State Modifications (Diff)
              </h4>

              <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden divide-y divide-slate-100 dark:divide-slate-800">
                {diffs.map((d, idx) => (
                  <div key={idx} className="p-3 space-y-1.5 bg-white dark:bg-slate-900">
                    <span className="font-bold text-[11px] text-slate-700 dark:text-slate-300 font-mono">
                      {d.label || d.field}
                    </span>
                    <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                      <div className="p-2 rounded-xl bg-rose-50/70 dark:bg-rose-950/30 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900/40">
                        <span className="text-[9px] uppercase tracking-wider block text-rose-500 font-bold">
                          Before
                        </span>
                        <span className="truncate block mt-0.5">
                          {typeof d.before === 'object' ? JSON.stringify(d.before) : String(d.before)}
                        </span>
                      </div>

                      <div className="p-2 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900/40">
                        <span className="text-[9px] uppercase tracking-wider block text-emerald-500 font-bold">
                          After
                        </span>
                        <span className="truncate block mt-0.5">
                          {typeof d.after === 'object' ? JSON.stringify(d.after) : String(d.after)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            entry.after && (
              <div className="space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Payload JSON Snapshot:
                </span>
                <pre className="p-3 rounded-2xl bg-slate-900 text-emerald-400 font-mono text-[11px] overflow-x-auto">
                  {JSON.stringify(entry.after, null, 2)}
                </pre>
              </div>
            )
          )}

          {/* User Agent & Technical Metadata */}
          <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400">
            <div className="flex items-center gap-1.5">
              <Laptop className="w-3.5 h-3.5" />
              <span>{entry.metadata.device}</span>
            </div>
            <p className="font-mono text-[10px] break-all leading-normal">
              {entry.metadata.userAgent}
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/90 flex items-center justify-between gap-3">
          <span className="text-[11px] text-slate-400 font-mono">
            Signed by FieldOps Audit Engine
          </span>

          <button
            type="button"
            onClick={onClose}
            className="py-2 px-4 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold hover:bg-slate-800 dark:hover:bg-slate-100 transition cursor-pointer"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
};
