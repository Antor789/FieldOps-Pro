import React, { useState } from 'react';
import { Bell } from 'lucide-react';
import { useNotifications } from '../../context/NotificationContext';
import { NotificationCenter } from './NotificationCenter';
import { motion, AnimatePresence } from 'motion/react';
import { bellShakeVariants } from '../animations';

export interface NotificationBellProps {
  locale?: 'en' | 'bn';
  onOpenSettings?: () => void;
}

export function NotificationBell({ locale = 'en', onOpenSettings }: NotificationBellProps) {
  const [isOpen, setIsOpen] = useState(false);
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAll,
  } = useNotifications();

  return (
    <div className="relative">
      <motion.button
        whileTap={{ scale: 0.92 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`relative p-2 rounded-xl border transition-all cursor-pointer ${
          isOpen
            ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-300 dark:border-indigo-700 text-indigo-600'
            : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
        }`}
        title="Notifications"
      >
        <Bell className="w-4 h-4" />

        {/* Unread Red Badge */}
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 min-w-4.5 h-4.5 px-1 bg-rose-600 text-white text-[10px] font-mono font-extrabold rounded-full flex items-center justify-center ring-2 ring-white dark:ring-slate-900 shadow-sm animate-pulse"
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </motion.span>
        )}
      </motion.button>

      {/* Floating Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
            <div className="absolute right-0 top-full mt-2.5 z-50">
              <NotificationCenter
                notifications={notifications}
                unreadCount={unreadCount}
                onMarkAsRead={markAsRead}
                onMarkAllAsRead={markAllAsRead}
                onDelete={deleteNotification}
                onClearAll={clearAll}
                onOpenSettings={() => {
                  setIsOpen(false);
                  if (onOpenSettings) onOpenSettings();
                }}
                locale={locale}
              />
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
