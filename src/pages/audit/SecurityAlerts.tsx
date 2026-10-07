import React, { useState } from 'react';
import { SecurityAlert } from '../../types/audit';
import { INITIAL_SECURITY_ALERTS } from '../../data/mockAuditData';
import { SeverityBadge } from '../../components/audit/SeverityBadge';
import { useToast } from '../../context/ToastContext';
import {
  ShieldAlert,
  AlertTriangle,
  Lock,
  Globe,
  Clock,
  CheckCircle2,
  Ban,
  Eye,
  Check,
  X,
  Filter,
} from 'lucide-react';

export interface SecurityAlertsProps {
  locale?: 'en' | 'bn';
}

export const SecurityAlertsPage: React.FC<SecurityAlertsProps> = ({ locale = 'en' }) => {
  const { addToast } = useToast();

  const [alerts, setAlerts] = useState<SecurityAlert[]>(INITIAL_SECURITY_ALERTS);
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'resolved'>('all');

  const handleUpdateStatus = (alertId: string, newStatus: SecurityAlert['status']) => {
    setAlerts(
      alerts.map((a) => (a.id === alertId ? { ...a, status: newStatus } : a))
    );
    addToast({
      title: 'Incident Status Updated',
      description: `Security alert marked as ${newStatus.toUpperCase()}`,
      type: 'info',
    });
  };

  const handleBlockIP = (ip: string) => {
    addToast({
      title: 'IP Address Blacklisted',
      description: `Traffic from ${ip} has been permanently dropped by Bangladesh firewall rules.`,
      type: 'warning',
    });
  };

  const filteredAlerts = alerts.filter((a) => {
    if (statusFilter === 'all') return true;
    if (statusFilter === 'active') return a.status === 'active' || a.status === 'investigating';
    return a.status === 'resolved' || a.status === 'dismissed';
  });

  return (
    <div className="space-y-6 animate-fadeIn font-sans pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <ShieldAlert className="w-6 h-6 text-rose-500" />
            <span>{locale === 'bn' ? 'নিরাপত্তা সতর্কতা ও হুমকি মনিটরিং' : 'Security Anomaly & Threat Detection'}</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Real-time heuristic threat detection for brute-force attacks, off-hours data exfiltration, and foreign IPs.
          </p>
        </div>

        {/* Filter Switcher */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setStatusFilter('all')}
            className={`py-1.5 px-3 rounded-xl transition ${
              statusFilter === 'all'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
            }`}
          >
            All Alerts ({alerts.length})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('active')}
            className={`py-1.5 px-3 rounded-xl transition ${
              statusFilter === 'active'
                ? 'bg-white dark:bg-slate-900 text-rose-600 dark:text-rose-400 shadow-xs'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
            }`}
          >
            Active & Open
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('resolved')}
            className={`py-1.5 px-3 rounded-xl transition ${
              statusFilter === 'resolved'
                ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-xs'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
            }`}
          >
            Resolved
          </button>
        </div>
      </div>

      {/* Alerts Feed */}
      <div className="space-y-4">
        {filteredAlerts.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center text-slate-400 text-xs">
            No active threat alerts in this category. System perimeter is secure.
          </div>
        ) : (
          filteredAlerts.map((alert) => {
            const isResolved = alert.status === 'resolved' || alert.status === 'dismissed';

            return (
              <div
                key={alert.id}
                className={`bg-white dark:bg-slate-900 border rounded-3xl p-5 shadow-xs space-y-3.5 transition-all ${
                  isResolved
                    ? 'border-slate-200 dark:border-slate-800 opacity-75'
                    : alert.severity === 'critical'
                    ? 'border-rose-300 dark:border-rose-900/60 ring-2 ring-rose-500/10'
                    : 'border-amber-300 dark:border-amber-900/60 ring-2 ring-amber-500/10'
                }`}
              >
                {/* Title & Badges */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                  <div className="flex items-center gap-2.5">
                    <SeverityBadge severity={alert.severity} size="md" />
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                      {locale === 'bn' && alert.titleBangla ? alert.titleBangla : alert.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full uppercase border ${
                      alert.status === 'active'
                        ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800'
                        : alert.status === 'investigating'
                        ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800'
                        : 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                    }`}>
                      Status: {alert.status}
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">
                      {new Date(alert.timestamp).toLocaleTimeString('en-GB')} BST
                    </span>
                  </div>
                </div>

                {/* Details Description */}
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                  {alert.details}
                </p>

                {/* Meta details strip */}
                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800/80">
                  <div className="flex items-center gap-1 font-mono">
                    <Globe className="w-3.5 h-3.5 text-slate-400" />
                    <span>IP: <strong>{alert.ip}</strong> ({alert.location})</span>
                  </div>

                  {alert.userName && (
                    <div>
                      <span>Actor: <strong className="text-slate-800 dark:text-slate-200">{alert.userName}</strong></span>
                    </div>
                  )}
                </div>

                {/* Quick Action Buttons */}
                <div className="flex flex-wrap items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800/80 text-xs font-semibold">
                  <button
                    type="button"
                    onClick={() => handleBlockIP(alert.ip)}
                    className="py-1.5 px-3 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 hover:bg-rose-100 transition flex items-center gap-1 cursor-pointer"
                  >
                    <Ban className="w-3.5 h-3.5" />
                    <span>Drop IP Traffic</span>
                  </button>

                  {alert.status !== 'investigating' && alert.status !== 'resolved' && (
                    <button
                      type="button"
                      onClick={() => handleUpdateStatus(alert.id, 'investigating')}
                      className="py-1.5 px-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition cursor-pointer"
                    >
                      Investigate
                    </button>
                  )}

                  {alert.status !== 'resolved' && (
                    <button
                      type="button"
                      onClick={() => handleUpdateStatus(alert.id, 'resolved')}
                      className="py-1.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition flex items-center gap-1 cursor-pointer shadow-xs"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Mark Resolved</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
