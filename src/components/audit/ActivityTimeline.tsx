import React from 'react';
import { AuditEntry } from '../../types/audit';
import { SeverityBadge } from './SeverityBadge';
import { formatAuditAction, formatRelativeTimestamp } from '../../utils/auditFormatter';
import {
  LogIn,
  LogOut,
  Wrench,
  Users,
  CreditCard,
  FileText,
  Settings,
  Database,
  Clock,
  ShieldAlert,
} from 'lucide-react';

export interface ActivityTimelineProps {
  entries: AuditEntry[];
  onSelectEntry?: (entry: AuditEntry) => void;
  locale?: 'en' | 'bn';
}

export const ActivityTimeline: React.FC<ActivityTimelineProps> = ({
  entries,
  onSelectEntry,
  locale = 'en',
}) => {
  // Group entries by Date string
  const grouped: Record<string, AuditEntry[]> = {};
  for (const entry of entries) {
    const dateStr = new Date(entry.timestamp).toLocaleDateString('en-GB', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
    if (!grouped[dateStr]) {
      grouped[dateStr] = [];
    }
    grouped[dateStr].push(entry);
  }

  const getActionIcon = (cat: string) => {
    switch (cat) {
      case 'auth':
        return <LogIn className="w-3.5 h-3.5 text-blue-500" />;
      case 'work_orders':
        return <Wrench className="w-3.5 h-3.5 text-indigo-500" />;
      case 'users':
        return <Users className="w-3.5 h-3.5 text-purple-500" />;
      case 'payments':
        return <CreditCard className="w-3.5 h-3.5 text-emerald-500" />;
      case 'reports':
        return <FileText className="w-3.5 h-3.5 text-teal-500" />;
      case 'system':
        return <Settings className="w-3.5 h-3.5 text-amber-500" />;
      case 'data':
        return <Database className="w-3.5 h-3.5 text-rose-500" />;
      default:
        return <Clock className="w-3.5 h-3.5 text-slate-400" />;
    }
  };

  return (
    <div className="space-y-6 font-sans">
      {Object.entries(grouped).map(([dateLabel, items]) => (
        <div key={dateLabel} className="space-y-3">
          {/* Day Header Badge */}
          <div className="sticky top-0 z-10 py-1 bg-slate-50/90 dark:bg-slate-950/90 backdrop-blur-xs flex items-center gap-2">
            <span className="text-xs font-bold font-mono px-3 py-1 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 shadow-xs">
              {dateLabel}
            </span>
            <span className="text-[11px] text-slate-400">
              {items.length} logged events
            </span>
          </div>

          {/* Timeline Feed items */}
          <div className="relative pl-6 space-y-4 border-l-2 border-slate-200 dark:border-slate-800 ml-3">
            {items.map((entry) => {
              return (
                <div
                  key={entry.id}
                  onClick={() => onSelectEntry && onSelectEntry(entry)}
                  className="relative group cursor-pointer"
                >
                  {/* Timeline Dot Node */}
                  <div className="absolute -left-[31px] top-1.5 w-6 h-6 rounded-full bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-700 flex items-center justify-center shadow-xs group-hover:border-emerald-500 transition">
                    {getActionIcon(entry.category)}
                  </div>

                  {/* Feed Card */}
                  <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs group-hover:border-slate-300 dark:group-hover:border-slate-700 transition space-y-2 text-xs">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="font-bold text-slate-900 dark:text-white">
                          {entry.userName}
                        </span>{' '}
                        <span className="text-slate-600 dark:text-slate-400">
                          {formatAuditAction(entry.action)}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <SeverityBadge severity={entry.severity} size="sm" />
                        <span className="text-[11px] font-mono text-slate-400">
                          {formatRelativeTimestamp(entry.timestamp)}
                        </span>
                      </div>
                    </div>

                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-[11px]">
                      {entry.description}
                    </p>

                    <div className="pt-1 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                      <span>IP: {entry.metadata.ip}</span>
                      <span>Target: {entry.resourceId}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};
