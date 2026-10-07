import React, { createContext, useContext, useState, useCallback } from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  Info,
  XCircle,
  MessageSquare,
  Banknote,
  Sparkles,
  X
} from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info' | 'sms' | 'payment' | 'ai';

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  message?: string;
  type: ToastType;
  duration?: number;
}

interface ToastContextType {
  toasts: ToastMessage[];
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(
    ({ title, description, message, type, duration = 4000 }: Omit<ToastMessage, 'id'>) => {
      const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const newToast: ToastMessage = { id, title, description: description || message, type, duration };

      setToasts((prev) => [...prev, newToast]);

      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }
    },
    [removeToast]
  );

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      {/* Toast Render Container */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col space-y-2 max-w-sm w-full pointer-events-none px-3">
        {toasts.map((toast) => {
          let icon = <Info className="w-5 h-5 text-blue-500 shrink-0" />;
          let bgClasses = 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 shadow-xl';

          if (toast.type === 'success') {
            icon = <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />;
            bgClasses = 'bg-white dark:bg-slate-900 border-emerald-200 dark:border-emerald-800/60 shadow-emerald-500/10 shadow-lg';
          } else if (toast.type === 'error') {
            icon = <XCircle className="w-5 h-5 text-red-500 shrink-0" />;
            bgClasses = 'bg-white dark:bg-slate-900 border-red-200 dark:border-red-800/60 shadow-red-500/10 shadow-lg';
          } else if (toast.type === 'warning') {
            icon = <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />;
            bgClasses = 'bg-white dark:bg-slate-900 border-amber-200 dark:border-amber-800/60 shadow-amber-500/10 shadow-lg';
          } else if (toast.type === 'sms') {
            icon = <MessageSquare className="w-5 h-5 text-emerald-600 shrink-0" />;
            bgClasses = 'bg-emerald-50 dark:bg-slate-900 border-emerald-300 dark:border-emerald-700 text-emerald-950 dark:text-emerald-100 shadow-lg';
          } else if (toast.type === 'payment') {
            icon = <Banknote className="w-5 h-5 text-pink-600 shrink-0" />;
            bgClasses = 'bg-white dark:bg-slate-900 border-pink-200 dark:border-pink-800 text-slate-900 dark:text-slate-100 shadow-lg';
          } else if (toast.type === 'ai') {
            icon = <Sparkles className="w-5 h-5 text-indigo-500 shrink-0 animate-pulse" />;
            bgClasses = 'bg-indigo-50 dark:bg-slate-900 border-indigo-300 dark:border-indigo-700 text-indigo-950 dark:text-indigo-100 shadow-lg';
          }

          return (
            <div
              key={toast.id}
              className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-2xl border transition-all duration-300 animate-slide-up transform hover:scale-[1.02] ${bgClasses}`}
            >
              {icon}
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold leading-tight">{toast.title}</p>
                {toast.description && (
                  <p className="text-[11px] opacity-80 mt-0.5 leading-snug">{toast.description}</p>
                )}
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="opacity-50 hover:opacity-100 p-0.5 rounded transition text-slate-500 dark:text-slate-400"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
