import React, { useState, useRef, useEffect } from 'react';
import { useSocket } from '../../hooks/useSocket';
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  CreditCard,
  MapPin,
  Clock,
  Radio,
  ExternalLink,
  Volume2,
  Trash2,
  CheckCheck,
} from 'lucide-react';

export interface LiveNotificationBellProps {
  className?: string;
  onOpenFeed?: () => void;
}

export const LiveNotificationBell: React.FC<LiveNotificationBellProps> = ({
  className = '',
  onOpenFeed,
}) => {
  const { liveEvents, unreadEventCount, markEventAsRead, markAllEventsAsRead } = useSocket();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const recentAlerts = liveEvents.slice(0, 6);

  return (
    <div className={`relative inline-block ${className}`} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 transition cursor-pointer"
        title="Live WebSocket Notifications"
      >
        <Bell className="w-4 h-4 text-slate-700 dark:text-slate-300" />

        {unreadEventCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow-xs animate-bounce">
            {unreadEventCount > 9 ? '9+' : unreadEventCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-84 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-3 z-50 text-xs font-sans">
          {/* Header */}
          <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="font-bold text-slate-900 dark:text-slate-100">
                Live Notifications
              </span>
            </div>

            <div className="flex items-center space-x-2">
              {unreadEventCount > 0 && (
                <button
                  onClick={markAllEventsAsRead}
                  className="text-[10px] text-indigo-600 dark:text-indigo-400 hover:underline font-semibold cursor-pointer"
                >
                  Mark read
                </button>
              )}
              {onOpenFeed && (
                <button
                  onClick={() => {
                    setIsOpen(false);
                    onOpenFeed();
                  }}
                  className="text-[10px] text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer flex items-center gap-0.5"
                >
                  <span>All</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </button>
              )}
            </div>
          </div>

          {/* List */}
          <div className="py-2 space-y-1.5 max-h-72 overflow-y-auto">
            {recentAlerts.length === 0 ? (
              <div className="py-6 text-center text-slate-400">
                <Bell className="w-6 h-6 mx-auto mb-1 opacity-30" />
                <p className="text-xs">No notifications yet</p>
              </div>
            ) : (
              recentAlerts.map((evt) => (
                <div
                  key={evt.id}
                  onClick={() => markEventAsRead(evt.id)}
                  className={`p-2 rounded-xl transition cursor-pointer ${
                    evt.unread
                      ? 'bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200/60 dark:border-indigo-800/40'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-1">
                    <span className="font-bold text-slate-900 dark:text-slate-100 text-[11px] truncate">
                      {evt.title}
                    </span>
                    <span className="text-[9px] font-mono text-slate-400 shrink-0">
                      {new Date(evt.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  {evt.subtitle && (
                    <p className="text-[10px] text-slate-600 dark:text-slate-400 line-clamp-1 mt-0.5">
                      {evt.subtitle}
                    </p>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Footer button */}
          {onOpenFeed && (
            <div className="pt-2 border-t border-slate-200 dark:border-slate-800 text-center">
              <button
                onClick={() => {
                  setIsOpen(false);
                  onOpenFeed();
                }}
                className="w-full py-1 text-center text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 rounded-lg transition cursor-pointer"
              >
                Open Full Live Event Stream →
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
