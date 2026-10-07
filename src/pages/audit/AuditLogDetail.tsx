import React, { useState } from 'react';
import { AuditEntry } from '../../types/audit';
import { SeverityBadge } from '../../components/audit/SeverityBadge';
import { formatAuditAction, formatDiff, getCategoryBadge } from '../../utils/auditFormatter';
import {
  ArrowLeft,
  Clock,
  User,
  Shield,
  MapPin,
  Laptop,
  Copy,
  Check,
  FileText,
  AlertTriangle,
  ExternalLink,
  ChevronRight,
  Database,
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export interface AuditLogDetailProps {
  entry: AuditEntry;
  onBack: () => void;
  onViewRelatedEntity?: (type: string, id: string) => void;
  locale?: 'en' | 'bn';
}

export const AuditLogDetailPage: React.FC<AuditLogDetailProps> = ({
  entry,
  onBack,
  onViewRelatedEntity,
  locale = 'en',
}) => {
  const { addToast } = useToast();
  const [copiedJson, setCopiedJson] = useState(false);

  const diffs = formatDiff(entry.before, entry.after);
  const catBadge = getCategoryBadge(entry.category);

  const handleCopyJSON = () => {
    navigator.clipboard.writeText(JSON.stringify(entry, null, 2));
    setCopiedJson(true);
    addToast({
      title: 'Audit Record Copied',
      description: 'Raw JSON audit record copied to clipboard.',
      type: 'info',
    });
    setTimeout(() => setCopiedJson(false), 2000);
  };

  return (
    <div className="space-y-6 animate-fadeIn font-sans pb-12 max-w-5xl mx-auto">
      {/* Top Back Navigation */}
      <div className="flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Audit Log Trail</span>
        </button>

        <button
          type="button"
          onClick={handleCopyJSON}
          className="py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 transition flex items-center gap-1.5 cursor-pointer shadow-xs"
        >
          {copiedJson ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copiedJson ? 'Copied JSON' : 'Export Record JSON'}</span>
        </button>
      </div>

      {/* Main Header Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <SeverityBadge severity={entry.severity} size="md" />
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${catBadge.badge}`}>
              {catBadge.label}
            </span>
          </div>
          <span className="font-mono text-xs text-slate-400">
            Log UUID: <strong className="text-slate-700 dark:text-slate-300">{entry.id}</strong>
          </span>
        </div>

        <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
          {formatAuditAction(entry.action)}
        </h1>

        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          {locale === 'bn' && entry.descriptionBangla ? entry.descriptionBangla : entry.description}
        </p>

        {entry.flaggedSuspicious && (
          <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 flex items-center gap-3 text-rose-800 dark:text-rose-200 text-xs">
            <AlertTriangle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />
            <div>
              <span className="font-bold">Flagged Security Anomaly:</span>{' '}
              {entry.suspiciousReason || 'Unusual access profile or foreign IP address outside Bangladesh.'}
            </div>
          </div>
        )}
      </div>

      {/* 2-Column Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-sans">
        {/* Left Column: Actor & Execution Context */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
            <User className="w-4 h-4 text-blue-500" />
            <span>Actor & Authentication Metadata</span>
          </h3>

          <div className="space-y-3 text-slate-600 dark:text-slate-400">
            <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/80">
              <span>Full Name:</span>
              <strong className="text-slate-900 dark:text-white font-semibold">{entry.userName}</strong>
            </div>

            <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/80">
              <span>User ID / Role:</span>
              <span className="font-mono text-slate-800 dark:text-slate-200">
                {entry.userId} ({entry.userRole})
              </span>
            </div>

            <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/80">
              <span>Timestamp (BST / UTC+6):</span>
              <span className="font-mono text-slate-900 dark:text-white">
                {new Date(entry.timestamp).toLocaleString('en-GB', { timeZone: 'Asia/Dhaka' })}
              </span>
            </div>

            <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/80">
              <span>IP Address:</span>
              <span className="font-mono font-bold text-slate-900 dark:text-white">{entry.metadata.ip}</span>
            </div>

            <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/80">
              <span>Geo Location:</span>
              <span className="text-slate-800 dark:text-slate-200">{entry.metadata.location || 'Dhaka NOC Center'}</span>
            </div>

            <div className="flex justify-between py-1">
              <span>Session ID:</span>
              <span className="font-mono text-slate-500">{entry.metadata.sessionId || 'sess-active'}</span>
            </div>
          </div>
        </div>

        {/* Right Column: Resource Context & System Specs */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
            <Database className="w-4 h-4 text-emerald-500" />
            <span>Target Entity & System Environment</span>
          </h3>

          <div className="space-y-3 text-slate-600 dark:text-slate-400">
            <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/80">
              <span>Target Resource Type:</span>
              <strong className="text-slate-900 dark:text-white font-mono">{entry.resourceType}</strong>
            </div>

            <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/80">
              <span>Resource Identifier:</span>
              <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                {entry.resourceId}
              </span>
            </div>

            <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/80">
              <span>Device Environment:</span>
              <span className="text-slate-800 dark:text-slate-200">{entry.metadata.device}</span>
            </div>

            <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/80">
              <span>Multi-Tenant Context:</span>
              <span className="text-slate-800 dark:text-slate-200">{entry.metadata.tenantName}</span>
            </div>

            <div className="py-1">
              <span className="block mb-1">User Agent Signature:</span>
              <p className="font-mono text-[10px] text-slate-500 bg-slate-50 dark:bg-slate-800/60 p-2 rounded-xl break-all">
                {entry.metadata.userAgent}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* State Changes Diff Section */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white">
          State Mutations & Record Changes
        </h3>

        {diffs.length > 0 ? (
          <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden divide-y divide-slate-100 dark:divide-slate-800">
            {diffs.map((d, i) => (
              <div key={i} className="p-4 space-y-2 bg-white dark:bg-slate-900">
                <span className="font-bold text-xs font-mono text-slate-800 dark:text-slate-200">
                  Property: {d.label || d.field}
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                  <div className="p-3 rounded-xl bg-rose-50/70 dark:bg-rose-950/40 text-rose-800 dark:text-rose-200 border border-rose-200 dark:border-rose-900/40">
                    <span className="text-[10px] uppercase font-bold text-rose-500 block mb-1">
                      Before Change
                    </span>
                    <pre className="text-[11px] whitespace-pre-wrap">
                      {typeof d.before === 'object' ? JSON.stringify(d.before, null, 2) : String(d.before)}
                    </pre>
                  </div>

                  <div className="p-3 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-900/40">
                    <span className="text-[10px] uppercase font-bold text-emerald-500 block mb-1">
                      After Change
                    </span>
                    <pre className="text-[11px] whitespace-pre-wrap">
                      {typeof d.after === 'object' ? JSON.stringify(d.after, null, 2) : String(d.after)}
                    </pre>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <pre className="p-4 rounded-2xl bg-slate-900 text-emerald-400 font-mono text-xs overflow-x-auto">
            {JSON.stringify({ payload: entry.after || entry.before || {} }, null, 2)}
          </pre>
        )}
      </div>
    </div>
  );
};
