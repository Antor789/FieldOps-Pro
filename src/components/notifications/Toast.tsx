import React from 'react';
import { ToastItem } from '../../context/NotificationContext';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';
import { motion } from 'motion/react';
import { toastVariants } from '../animations';

export interface ToastProps {
  toast: ToastItem;
  onDismiss: (id: string) => void;
}

export function Toast({ toast, onDismiss }: ToastProps) {
  const icons = {
    success: <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />,
    error: <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />,
    warning: <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />,
    info: <Info className="w-4 h-4 text-sky-500 shrink-0" />,
  };

  const borderStyles = {
    success: 'border-emerald-200 dark:border-emerald-800/80',
    error: 'border-rose-200 dark:border-rose-800/80',
    warning: 'border-amber-200 dark:border-amber-800/80',
    info: 'border-sky-200 dark:border-sky-800/80',
  };

  return (
    <motion.div
      layout
      variants={toastVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className={`bg-white dark:bg-slate-900 border ${borderStyles[toast.type]} rounded-2xl p-4 shadow-xl max-w-sm w-full flex items-start gap-3 pointer-events-auto relative overflow-hidden backdrop-blur-md`}
    >
      <div className="mt-0.5">{icons[toast.type]}</div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
            {toast.title}
          </h4>
          <button
            onClick={() => onDismiss(toast.id)}
            className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg transition"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {toast.message && (
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 leading-relaxed">
            {toast.message}
          </p>
        )}

        {toast.action && (
          <button
            onClick={() => {
              toast.action?.onClick();
              onDismiss(toast.id);
            }}
            className="mt-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            {toast.action.label} →
          </button>
        )}
      </div>
    </motion.div>
  );
}
