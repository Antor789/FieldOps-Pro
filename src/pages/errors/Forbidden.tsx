import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { usePermissions } from '../../hooks/usePermissions';
import { RoleBadge } from '../../components/rbac/RoleBadge';
import { ShieldAlert, Lock, ArrowLeft, Mail, Phone, Home } from 'lucide-react';

export interface ForbiddenPageProps {
  requiredPermission?: string;
  onBack?: () => void;
  onGoHome?: () => void;
  locale?: 'en' | 'bn';
}

export const ForbiddenPage: React.FC<ForbiddenPageProps> = ({
  requiredPermission,
  onBack,
  onGoHome,
  locale = 'en',
}) => {
  const { user } = useAuth();
  const { currentUserRole } = usePermissions();

  return (
    <div className="min-h-[75vh] flex items-center justify-center p-6">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-2xl text-center space-y-6">
        {/* Lock Graphic */}
        <div className="relative w-20 h-20 mx-auto">
          <div className="absolute inset-0 bg-rose-500/10 dark:bg-rose-500/20 rounded-3xl blur-xl" />
          <div className="relative w-full h-full rounded-3xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900/60 flex items-center justify-center text-rose-600 dark:text-rose-400 shadow-md">
            <Lock className="w-10 h-10" />
          </div>
        </div>

        {/* Header */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 text-xs font-mono font-bold">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>403 FORBIDDEN • ACCESS RESTRICTED</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">
            {locale === 'bn' ? 'অনুমতি নেই (এক্সেস ডিনাইড)' : 'Access Permission Denied'}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-md mx-auto">
            {locale === 'bn'
              ? 'আপনার বর্তমান পদবি বা অ্যাকাউন্টে এই মডিউল বা রিসোর্স ব্যবহারের অনুমতি দেওয়া নেই।'
              : 'Your current account privileges do not permit access to this module or resource.'}
          </p>
        </div>

        {/* User Role Details Card */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-xs space-y-2 text-left">
          <div className="flex items-center justify-between">
            <span className="text-slate-500">Authenticated Account:</span>
            <strong className="text-slate-900 dark:text-white font-semibold">
              {user?.name || 'Authorized User'}
            </strong>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-500">Assigned Role:</span>
            <RoleBadge role={currentUserRole} size="sm" />
          </div>

          {requiredPermission && (
            <div className="flex items-center justify-between pt-1 border-t border-slate-200 dark:border-slate-700 font-mono text-[11px]">
              <span className="text-slate-400">Required Permission:</span>
              <span className="text-rose-600 dark:text-rose-400 font-bold bg-rose-50 dark:bg-rose-950/60 px-2 py-0.5 rounded">
                {requiredPermission}
              </span>
            </div>
          )}
        </div>

        {/* Contact Admin Info */}
        <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 text-xs text-amber-800 dark:text-amber-300 flex items-center justify-center gap-2">
          <Mail className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
          <span>Need elevated permissions? Contact your corporate NOC Admin at <strong>admin@fieldops.com.bd</strong></span>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-center gap-3 pt-2">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 transition flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Go Back</span>
            </button>
          )}

          {onGoHome && (
            <button
              type="button"
              onClick={onGoHome}
              className="py-2.5 px-5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold hover:bg-slate-800 dark:hover:bg-slate-100 transition shadow-sm flex items-center gap-1.5 cursor-pointer"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Return to Dashboard</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
