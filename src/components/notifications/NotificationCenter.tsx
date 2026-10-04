import React, { useState } from 'react';
import { NotificationItemData } from '../../types/notifications';
import { NotificationItem } from './NotificationItem';
import { Bell, CheckCheck, Trash2, Filter, Volume2, VolumeX, ShieldAlert, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export interface NotificationCenterProps {
  notifications: NotificationItemData[];
  unreadCount: number;
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onDelete: (id: string) => void;
  onClearAll: () => void;
  onOpenSettings?: () => void;
  onSelectNotification?: (notif: NotificationItemData) => void;
  locale?: 'en' | 'bn';
}

export function NotificationCenter({
  notifications,
  unreadCount,
  onMarkAsRead,
  onMarkAllAsRead,
  onDelete,
  onClearAll,
  onOpenSettings,
  onSelectNotification,
  locale = 'en',
}: NotificationCenterProps) {
  const [filter, setFilter] = useState<'ALL' | 'UNREAD' | 'CRITICAL'>('ALL');

  const filteredNotifications = notifications.filter((n) => {
    if (filter === 'UNREAD') return !n.isRead;
    if (filter === 'CRITICAL') return n.priority === 'critical' || n.priority === 'high';
    return true;
  });

  return (
    <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
      {/* Top Header */}
      <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/40">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
            <Bell className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              {locale === 'bn' ? 'নোটিফিকেশন ও অ্যালার্ট' : 'Notification Center'}
            </h3>
            <span className="text-[10px] text-slate-500 font-mono">
              {unreadCount > 0
                ? locale === 'bn'
                  ? `${unreadCount}টি অপঠিত বার্তা`
                  : `${unreadCount} unread alerts`
                : locale === 'bn'
                ? 'সব বার্তা পড়া হয়েছে'
                : 'All caught up'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {unreadCount > 0 && (
            <button
              onClick={onMarkAllAsRead}
              className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 px-2 py-1 rounded-lg transition"
            >
              {locale === 'bn' ? 'সব পড়ুন' : 'Mark all read'}
            </button>
          )}
          {onOpenSettings && (
            <button
              onClick={onOpenSettings}
              className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              title="Notification Settings"
            >
              <Sparkles className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1 px-4 py-2 border-b border-slate-100 dark:border-slate-800 text-xs bg-white dark:bg-slate-900">
        <button
          onClick={() => setFilter('ALL')}
          className={`px-3 py-1 rounded-lg font-medium transition ${
            filter === 'ALL'
              ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 font-semibold'
              : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          {locale === 'bn' ? 'সকল' : 'All'} ({notifications.length})
        </button>
        <button
          onClick={() => setFilter('UNREAD')}
          className={`px-3 py-1 rounded-lg font-medium transition ${
            filter === 'UNREAD'
              ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 font-semibold'
              : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          {locale === 'bn' ? 'অপঠিত' : 'Unread'} ({unreadCount})
        </button>
        <button
          onClick={() => setFilter('CRITICAL')}
          className={`px-3 py-1 rounded-lg font-medium transition ${
            filter === 'CRITICAL'
              ? 'bg-rose-600 text-white font-semibold'
              : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          {locale === 'bn' ? 'জরুরী SLA' : 'Critical SLA'}
        </button>
      </div>

      {/* Notification List Scroll */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5 divide-y-0">
        <AnimatePresence mode="popLayout">
          {filteredNotifications.length === 0 ? (
            <div className="py-12 text-center text-slate-400 space-y-2">
              <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto text-xl">
                🔕
              </div>
              <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                {locale === 'bn' ? 'কোনো নোটিফিকেশন পাওয়া যায়নি' : 'No notifications in this view'}
              </p>
            </div>
          ) : (
            filteredNotifications.map((notif) => (
              <NotificationItem
                key={notif.id}
                notification={notif}
                onMarkAsRead={onMarkAsRead}
                onDelete={onDelete}
                onActionClick={onSelectNotification}
                locale={locale}
              />
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Footer Actions */}
      {notifications.length > 0 && (
        <div className="p-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 flex items-center justify-between text-xs text-slate-500">
          <span>{notifications.length} {locale === 'bn' ? 'টি নোটিফিকেশন সংরক্ষিত' : 'total items cached'}</span>
          <button
            onClick={onClearAll}
            className="text-rose-600 dark:text-rose-400 hover:underline font-semibold"
          >
            {locale === 'bn' ? 'সব মুছুন' : 'Clear all'}
          </button>
        </div>
      )}
    </div>
  );
}
