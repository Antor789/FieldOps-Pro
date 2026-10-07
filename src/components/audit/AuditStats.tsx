import React from 'react';
import { AuditStatsSummary } from '../../types/audit';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { ShieldCheck, AlertTriangle, TrendingUp, Users, Activity, Sparkles } from 'lucide-react';
import { formatAuditAction, getCategoryBadge } from '../../utils/auditFormatter';

export interface AuditStatsProps {
  stats: AuditStatsSummary;
  locale?: 'en' | 'bn';
}

export const AuditStats: React.FC<AuditStatsProps> = ({ stats, locale = 'en' }) => {
  return (
    <div className="space-y-4 font-sans text-xs">
      {/* 4 Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Total Logged Events
            </span>
            <span className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-mono mt-0.5 block">
              {stats.totalLogs.toLocaleString()}
            </span>
          </div>
          <div className="p-3 rounded-2xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400">
            <Activity className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Warning Alerts
            </span>
            <span className="text-xl sm:text-2xl font-black text-amber-500 font-mono mt-0.5 block">
              {stats.warningsCount}
            </span>
          </div>
          <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Critical Incidents
            </span>
            <span className="text-xl sm:text-2xl font-black text-rose-500 font-mono mt-0.5 block">
              {stats.criticalCount}
            </span>
          </div>
          <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Security Index
            </span>
            <span className="text-xl sm:text-2xl font-black text-emerald-500 font-mono mt-0.5 block">
              {stats.securityScore} / 100
            </span>
          </div>
          <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400">
            <Sparkles className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Charts & Breakdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* 7-Day Activity Trend Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-xs text-slate-900 dark:text-white uppercase tracking-wider">
              7-Day Activity Velocity (BST)
            </h4>
            <span className="text-[11px] text-slate-400 font-mono">Info vs Warning vs Critical</span>
          </div>

          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.dailyActivityTrend}>
                <defs>
                  <linearGradient id="infoGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="warnGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="date" tick={{ fontSize: 10 }} tickLine={false} />
                <YAxis tick={{ fontSize: 10 }} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '12px',
                    fontSize: '11px',
                    color: '#fff',
                  }}
                />
                <Area type="monotone" dataKey="info" stroke="#3b82f6" fillOpacity={1} fill="url(#infoGrad)" />
                <Area type="monotone" dataKey="warning" stroke="#f59e0b" fillOpacity={1} fill="url(#warnGrad)" />
                <Area type="monotone" dataKey="critical" stroke="#f43f5e" fillOpacity={0.6} fill="#f43f5e" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Most Active Operators & Top Actions */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-xs space-y-4">
          {/* Top Actions */}
          <div className="space-y-2">
            <h4 className="font-bold text-xs text-slate-900 dark:text-white uppercase tracking-wider">
              Top Audited Actions
            </h4>
            <div className="space-y-2">
              {stats.topActions.slice(0, 3).map((act, i) => (
                <div key={i} className="flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-700 dark:text-slate-300 truncate max-w-[180px]">
                    {formatAuditAction(act.action)}
                  </span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800">
                    {act.count}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Active Users */}
          <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <h4 className="font-bold text-xs text-slate-900 dark:text-white uppercase tracking-wider">
              Key Operators (Last 30 Days)
            </h4>
            <div className="space-y-2">
              {stats.mostActiveUsers.slice(0, 3).map((u, i) => (
                <div key={i} className="flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-700 dark:text-slate-300 truncate max-w-[180px]">
                    {u.userName}
                  </span>
                  <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                    {u.count} ops
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
