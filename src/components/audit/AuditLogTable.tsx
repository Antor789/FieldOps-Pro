import React, { useState } from 'react';
import { AuditEntry } from '../../types/audit';
import { SeverityBadge } from './SeverityBadge';
import { formatAuditAction, getCategoryBadge, formatRelativeTimestamp } from '../../utils/auditFormatter';
import {
  Clock,
  User,
  Shield,
  MapPin,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  ChevronLeft,
  AlertTriangle,
  FileText,
} from 'lucide-react';

export interface AuditLogTableProps {
  entries: AuditEntry[];
  totalEntriesCount: number;
  currentPage: number;
  totalPages: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onSelectEntry: (entry: AuditEntry) => void;
  locale?: 'en' | 'bn';
}

export const AuditLogTable: React.FC<AuditLogTableProps> = ({
  entries,
  totalEntriesCount,
  currentPage,
  totalPages,
  pageSize,
  onPageChange,
  onSelectEntry,
  locale = 'en',
}) => {
  const [expandedRowId, setExpandedRowId] = useState<string | null>(null);

  const toggleExpand = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedRowId(expandedRowId === id ? null : id);
  };

  return (
    <div className="space-y-3 font-sans">
      {/* Table Container */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto max-h-[640px] overflow-y-auto">
          <table className="w-full text-xs text-left">
            {/* Sticky Header */}
            <thead className="sticky top-0 z-20 bg-slate-50 dark:bg-slate-800/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4 w-8"></th>
                <th className="py-3 px-4">Time (BST)</th>
                <th className="py-3 px-4">Actor / User</th>
                <th className="py-3 px-4">Action & Resource</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Severity</th>
                <th className="py-3 px-4">IP & Location</th>
                <th className="py-3 px-4 text-right">Details</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {entries.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    No activity logs match your selected filter criteria.
                  </td>
                </tr>
              ) : (
                entries.map((entry) => {
                  const isExpanded = expandedRowId === entry.id;
                  const catBadge = getCategoryBadge(entry.category);
                  const isCritical = entry.severity === 'critical';
                  const isWarning = entry.severity === 'warning';

                  return (
                    <React.Fragment key={entry.id}>
                      <tr
                        onClick={() => onSelectEntry(entry)}
                        className={`cursor-pointer transition-colors ${
                          isCritical
                            ? 'bg-rose-50/40 dark:bg-rose-950/20 hover:bg-rose-50/70 dark:hover:bg-rose-950/30'
                            : isWarning
                            ? 'bg-amber-50/30 dark:bg-amber-950/10 hover:bg-amber-50/60 dark:hover:bg-amber-950/20'
                            : 'hover:bg-slate-50/80 dark:hover:bg-slate-800/40'
                        }`}
                      >
                        {/* Expand toggle */}
                        <td className="py-3 px-3 text-center">
                          <button
                            type="button"
                            onClick={(e) => toggleExpand(entry.id, e)}
                            className="p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition"
                          >
                            {isExpanded ? (
                              <ChevronDown className="w-3.5 h-3.5" />
                            ) : (
                              <ChevronRight className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </td>

                        {/* Timestamp */}
                        <td className="py-3 px-4 font-mono text-slate-600 dark:text-slate-400">
                          <div className="font-semibold text-slate-900 dark:text-white">
                            {new Date(entry.timestamp).toLocaleTimeString('en-GB', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </div>
                          <div className="text-[10px] text-slate-400">
                            {formatRelativeTimestamp(entry.timestamp)}
                          </div>
                        </td>

                        {/* User / Actor */}
                        <td className="py-3 px-4">
                          <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                            <span>{entry.userName}</span>
                            {entry.flaggedSuspicious && (
                              <span title="Suspicious Actor">
                                <AlertTriangle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] text-slate-400 capitalize">
                            {entry.userRole.replace('_', ' ')}
                          </div>
                        </td>

                        {/* Action & Resource */}
                        <td className="py-3 px-4">
                          <div className="font-semibold text-slate-800 dark:text-slate-200">
                            {formatAuditAction(entry.action)}
                          </div>
                          <div className="text-[10px] font-mono text-slate-400 mt-0.5 truncate max-w-xs">
                            {entry.description}
                          </div>
                        </td>

                        {/* Category */}
                        <td className="py-3 px-4">
                          <span
                            className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full border ${catBadge.badge}`}
                          >
                            {catBadge.label}
                          </span>
                        </td>

                        {/* Severity */}
                        <td className="py-3 px-4">
                          <SeverityBadge severity={entry.severity} size="sm" />
                        </td>

                        {/* IP & Location */}
                        <td className="py-3 px-4">
                          <div className="font-mono text-[11px] text-slate-700 dark:text-slate-300">
                            {entry.metadata.ip}
                          </div>
                          <div className="text-[10px] text-slate-400 truncate max-w-[120px]">
                            {entry.metadata.location || 'Dhaka NOC'}
                          </div>
                        </td>

                        {/* Details trigger */}
                        <td className="py-3 px-4 text-right">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectEntry(entry);
                            }}
                            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-emerald-600 transition"
                            title="Inspect Details"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>

                      {/* Expandable Row Preview */}
                      {isExpanded && (
                        <tr className="bg-slate-50/80 dark:bg-slate-800/50 border-y border-slate-200 dark:border-slate-800">
                          <td colSpan={8} className="p-4 pl-12 text-xs">
                            <div className="space-y-2">
                              <div className="flex items-center justify-between text-[11px] font-mono text-slate-500">
                                <span>Target Resource: <strong>{entry.resourceType}:{entry.resourceId}</strong></span>
                                <span>Session: {entry.metadata.sessionId}</span>
                              </div>
                              <p className="text-slate-800 dark:text-slate-200">
                                {entry.description}
                              </p>
                              {entry.before && (
                                <div className="text-[11px] font-mono bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800">
                                  <span className="text-rose-500 block font-bold mb-1">State Mutation Before &rarr; After:</span>
                                  <pre className="text-slate-600 dark:text-slate-300 text-[10px] overflow-x-auto">
                                    {JSON.stringify({ before: entry.before, after: entry.after }, null, 2)}
                                  </pre>
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-2 text-xs text-slate-500">
        <div>
          Showing {entries.length} of {totalEntriesCount} records (Page {currentPage} of {totalPages})
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            disabled={currentPage <= 1}
            onClick={() => onPageChange(currentPage - 1)}
            className="py-1.5 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-40 transition flex items-center gap-1 cursor-pointer"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Previous</span>
          </button>

          <span className="px-3 py-1.5 font-mono font-bold text-slate-900 dark:text-white">
            {currentPage}
          </span>

          <button
            type="button"
            disabled={currentPage >= totalPages}
            onClick={() => onPageChange(currentPage + 1)}
            className="py-1.5 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-40 transition flex items-center gap-1 cursor-pointer"
          >
            <span>Next</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
