import React from 'react';
import { Bell, ShieldCheck, X } from 'lucide-react';
import { Button } from '../ui/Button';
import { motion, AnimatePresence } from 'motion/react';

export interface PermissionPromptProps {
  isOpen: boolean;
  onClose: () => void;
  onEnable: () => Promise<void>;
  locale?: 'en' | 'bn';
}

export function PermissionPrompt({
  isOpen,
  onClose,
  onEnable,
  locale = 'en',
}: PermissionPromptProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-sm w-full shadow-2xl relative space-y-4 text-center"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto text-2xl shadow-xs">
              <Bell className="w-7 h-7" />
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-50">
                {locale === 'bn' ? 'লাইভ নোটিফিকেশন চালু করুন' : 'Enable Real-Time Push Alerts?'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
                {locale === 'bn'
                  ? 'জরুরী এসএলএ লঙ্ঘন, নতুন কাজ বরাদ্দ এবং বিকাশ পেমেন্ট নিশ্চিতকরণ মুহূর্তেই পাওয়ার জন্য ব্রাউজার পারমিশন দিন।'
                  : 'Receive instant notifications for emergency SLA warnings, dispatch updates, and bKash transaction receipts.'}
              </p>
            </div>

            <div className="space-y-2 text-left bg-slate-50 dark:bg-slate-800/60 p-3 rounded-2xl border border-slate-100 dark:border-slate-800 text-xs">
              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Critical SLA Breach Alerts (৩০ মিনিট)</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>bKash & Nagad Payment Webhooks</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Technician Geofence Arrival Pings</span>
              </div>
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <Button
                variant="primary"
                onClick={async () => {
                  await onEnable();
                  onClose();
                }}
                className="w-full py-2.5"
              >
                {locale === 'bn' ? 'নোটিফিকেশন সক্রিয় করুন' : 'Enable Push Notifications'}
              </Button>
              <button
                onClick={onClose}
                className="text-xs font-semibold text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 py-1"
              >
                {locale === 'bn' ? 'পরে করবেন' : 'Maybe Later'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
