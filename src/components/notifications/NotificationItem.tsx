import React from 'react';
import { NotificationItemData, notificationTypeConfigs } from '../../types/notifications';
import { formatBDT } from '../../utils/formatters';
import { Check, Trash2, Clock, ArrowRight, ExternalLink } from 'lucide-react';
import { motion } from 'motion/react';

export interface NotificationItemProps {
  key?: React.Key;
  notification: NotificationItemData;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
  onActionClick?: (notif: NotificationItemData) => void;
  locale?: 'en' | 'bn';
}

export function NotificationItem({
  notification,
  onMarkAsRead,
  onDelete,
  onActionClick,
  locale = 'en',
}: NotificationItemProps) {
  const config = notificationTypeConfigs[notification.type] || notificationTypeConfigs.system_alert;

  const timeAgo = (date: Date) => {
    const diffMs = Date.now() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return locale === 'bn' ? 'এইমাত্র' : 'Just now';
    if (diffMins < 60) return locale === 'bn' ? `${diffMins} মি. আগে` : `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return locale === 'bn' ? `${diffHours} ঘণ্টা আগে` : `${diffHours}h ago`;
    return locale === 'bn' ? 'গতকাল' : 'Yesterday';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -16 }}
      className={`p-3.5 border-l-4 ${config.borderAccent} rounded-xl transition-all relative group ${
        notification.isRead
          ? 'bg-white dark:bg-slate-900/60 border-y border-r border-slate-100 dark:border-slate-800'
          : 'bg-indigo-50/40 dark:bg-indigo-950/20 border-y border-r border-indigo-100 dark:border-indigo-900/40 shadow-2xs'
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Type Icon Badge */}
        <div className="w-8 h-8 rounded-xl flex items-center justify-center text-sm shrink-0 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-2xs">
          <span>{config.icon}</span>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h4 className={`text-xs font-bold truncate ${notification.isRead ? 'text-slate-800 dark:text-slate-200' : 'text-slate-900 dark:text-slate-50'}`}>
              {locale === 'bn' && notification.titleBn ? notification.titleBn : notification.title}
            </h4>
            <span className="text-[10px] font-mono text-slate-400 shrink-0">
              {timeAgo(notification.timestamp)}
            </span>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
            {locale === 'bn' && notification.messageBn ? notification.messageBn : notification.message}
          </p>

          {/* Action Button & Meta */}
          <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800/80">
            <div className="flex items-center gap-2">
              {notification.workOrderId && (
                <span className="text-[10px] font-mono font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded-md">
                  {notification.workOrderId}
                </span>
              )}
              {notification.amountBDT && (
                <span className="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400">
                  {formatBDT(notification.amountBDT, locale)}
                </span>
              )}
            </div>

            <div className="flex items-center gap-1">
              {!notification.isRead && (
                <button
                  onClick={() => onMarkAsRead(notification.id)}
                  title="Mark as read"
                  className="p-1 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  <Check className="w-3.5 h-3.5" />
                </button>
              )}
              <button
                onClick={() => onDelete(notification.id)}
                title="Dismiss"
                className="p-1 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
              {(notification.actionLabel || notification.actionUrl) && (
                <button
                  onClick={() => onActionClick && onActionClick(notification)}
                  className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center gap-0.5 ml-1"
                >
                  <span>
                    {locale === 'bn' && notification.actionLabelBn
                      ? notification.actionLabelBn
                      : notification.actionLabel || 'View'}
                  </span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
