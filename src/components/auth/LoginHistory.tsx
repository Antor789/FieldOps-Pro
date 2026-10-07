import React from 'react';
import { LoginHistoryEntry } from '../../types/auth';
import { ShieldCheck, AlertTriangle, Laptop, Smartphone, Globe, Clock, CheckCircle2 } from 'lucide-react';

export interface LoginHistoryProps {
  entries: LoginHistoryEntry[];
  locale?: 'en' | 'bn';
}

export const LoginHistory: React.FC<LoginHistoryProps> = ({ entries, locale = 'en' }) => {
  return (
    <div className="space-y-4">
      {/* Header Info */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            {locale === 'bn' ? 'সাম্প্রতিক লগইন ও ডিভাইস হিস্ট্রি' : 'Recent Login Activity & Devices'}
          </h4>
        </div>
        <span className="text-[11px] text-slate-400 font-mono">
          Last 5 Sessions
        </span>
      </div>

      {/* History Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-500 uppercase">
              <th className="py-2.5 px-3">Device & Browser</th>
              <th className="py-2.5 px-3">Location & IP</th>
              <th className="py-2.5 px-3">Timestamp (BST)</th>
              <th className="py-2.5 px-3 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {entries.map((entry) => {
              const isSuspicious = entry.status === 'suspicious';
              const isMobile = entry.device.toLowerCase().includes('iphone') || entry.device.toLowerCase().includes('android');

              return (
                <tr
                  key={entry.id}
                  className={`hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors ${
                    isSuspicious ? 'bg-rose-50/40 dark:bg-rose-950/20' : ''
                  }`}
                >
                  {/* Device & OS */}
                  <td className="py-3 px-3">
                    <div className="flex items-start gap-2.5">
                      <div className={`p-2 rounded-xl shrink-0 ${
                        isSuspicious
                          ? 'bg-rose-100 dark:bg-rose-900/40 text-rose-600'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                      }`}>
                        {isMobile ? <Smartphone className="w-4 h-4" /> : <Laptop className="w-4 h-4" />}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                          <span>{entry.device}</span>
                          {entry.isCurrent && (
                            <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400">
                              Current
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          {entry.browser} • {entry.os}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Location & IP */}
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-1 font-medium text-slate-800 dark:text-slate-200">
                      <Globe className="w-3.5 h-3.5 text-slate-400" />
                      <span>{entry.location}</span>
                    </div>
                    <div className="text-[11px] font-mono text-slate-400 mt-0.5">
                      IP: {entry.ip}
                    </div>
                  </td>

                  {/* Timestamp */}
                  <td className="py-3 px-3 font-mono text-slate-600 dark:text-slate-400">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{entry.timestamp}</span>
                    </div>
                  </td>

                  {/* Status Badge */}
                  <td className="py-3 px-3 text-right">
                    {isSuspicious ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 border border-rose-300 dark:border-rose-800">
                        <AlertTriangle className="w-3 h-3" />
                        Suspicious
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                        <CheckCircle2 className="w-3 h-3" />
                        Success
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Suspicious Alert Banner if detected */}
      {entries.some((e) => e.status === 'suspicious') && (
        <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 flex items-start gap-2.5 text-xs text-amber-900 dark:text-amber-300">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">Security Notice (Foreign IP Detected):</p>
            <p className="mt-0.5 text-amber-800 dark:text-amber-400 leading-relaxed">
              An unrecognized login attempt originated outside Bangladesh (Bucharest, Romania). The access was blocked by IP geofencing rules. If this was not you, we recommend resetting your password and enabling Two-Factor Authentication (2FA).
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
