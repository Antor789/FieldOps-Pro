import React from 'react';
import { SchedulingConflict } from '../../types/calendar';
import { X, AlertTriangle, CheckCircle2, RefreshCw, ShieldAlert } from 'lucide-react';

export interface ConflictModalProps {
  isOpen: boolean;
  conflicts: SchedulingConflict[];
  locale?: 'en' | 'bn';
  onClose: () => void;
  onAutoResolve?: () => void;
}

export const ConflictModal: React.FC<ConflictModalProps> = ({
  isOpen,
  conflicts,
  locale = 'en',
  onClose,
  onAutoResolve,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-scaleIn">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-rose-50/50 dark:bg-rose-950/30">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-rose-100 dark:bg-rose-900/60 text-rose-600 dark:text-rose-300">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {locale === 'bn' ? '⚠️ শিডিউল সংঘর্ষ ও সতর্কতা' : '⚠️ Scheduling Conflicts & Alerts'}
              </h3>
              <p className="text-xs text-rose-600 dark:text-rose-400 font-medium">
                {conflicts.length} {locale === 'bn' ? 'টি সমস্যা চিহ্নিত হয়েছে' : 'issues require attention'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Conflict List */}
        <div className="p-5 space-y-3 max-h-[60vh] overflow-y-auto">
          {conflicts.length === 0 ? (
            <div className="text-center py-6 text-slate-500">
              <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
              <p className="text-xs font-semibold">
                {locale === 'bn' ? 'কোনো শিডিউল সংঘর্ষ নেই!' : 'No scheduling conflicts detected!'}
              </p>
            </div>
          ) : (
            conflicts.map((c, idx) => (
              <div
                key={idx}
                className={`p-3.5 rounded-xl border ${
                  c.severity === 'error'
                    ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900/60 text-rose-900 dark:text-rose-200'
                    : 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900/60 text-amber-900 dark:text-amber-200'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <AlertTriangle
                    className={`w-4 h-4 shrink-0 ${
                      c.severity === 'error' ? 'text-rose-600 dark:text-rose-400' : 'text-amber-600 dark:text-amber-400'
                    }`}
                  />
                  <h4 className="text-xs font-bold">
                    {locale === 'bn' && c.titleBangla ? c.titleBangla : c.title}
                  </h4>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 ml-6">
                  {locale === 'bn' && c.messageBangla ? c.messageBangla : c.message}
                </p>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950/50">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
          >
            {locale === 'bn' ? 'বন্ধ করুন' : 'Dismiss'}
          </button>

          {conflicts.length > 0 && (
            <button
              onClick={() => {
                if (onAutoResolve) onAutoResolve();
                onClose();
              }}
              className="px-4 py-2 text-xs font-bold rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition-colors flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>{locale === 'bn' ? 'স্বয়ংক্রিয় সমাধান করুন' : 'Auto-Resolve Overlaps'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
