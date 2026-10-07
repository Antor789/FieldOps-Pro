import React, { useState, useEffect, useRef } from 'react';
import { useSocket } from '../../hooks/useSocket';
import { EventCategory, LiveFeedItem, RealtimeEventType } from '../../types/realtime';
import {
  Activity,
  CheckCircle2,
  Clock,
  CreditCard,
  MapPin,
  AlertTriangle,
  Radio,
  Filter,
  Trash2,
  CheckCheck,
  ChevronRight,
  ExternalLink,
  X,
  Play,
  ArrowUpRight,
  MessageSquare,
  Wrench,
  Sparkles,
} from 'lucide-react';

export interface LiveFeedProps {
  isDrawer?: boolean;
  isOpen?: boolean;
  onClose?: () => void;
  className?: string;
  onSelectEvent?: (event: LiveFeedItem) => void;
}

export const LiveFeed: React.FC<LiveFeedProps> = ({
  isDrawer = false,
  isOpen = true,
  onClose,
  className = '',
  onSelectEvent,
}) => {
  const {
    liveEvents,
    unreadEventCount,
    markEventAsRead,
    markAllEventsAsRead,
    clearLiveEvents,
    triggerEventSimulation,
  } = useSocket();

  const [selectedCategory, setSelectedCategory] = useState<EventCategory | 'all'>('all');
  const [filterQuery, setFilterQuery] = useState('');
  const [autoScroll, setAutoScroll] = useState(true);
  const feedListRef = useRef<HTMLDivElement>(null);

  // Filter events
  const filteredEvents = liveEvents.filter((item) => {
    if (selectedCategory !== 'all' && item.category !== selectedCategory) {
      return false;
    }
    if (filterQuery) {
      const q = filterQuery.toLowerCase();
      return (
        item.title.toLowerCase().includes(q) ||
        (item.subtitle && item.subtitle.toLowerCase().includes(q)) ||
        item.type.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Auto-scroll to top when new events arrive
  useEffect(() => {
    if (autoScroll && feedListRef.current) {
      feedListRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [liveEvents, autoScroll]);

  const getRelativeTime = (timestamp: string) => {
    const diff = Math.max(0, Math.floor((Date.now() - new Date(timestamp).getTime()) / 1000));
    if (diff < 5) return 'Just now';
    if (diff < 60) return `${diff}s ago`;
    const mins = Math.floor(diff / 60);
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    return `${hours}h ago`;
  };

  const getCategoryIcon = (item: LiveFeedItem) => {
    switch (item.category) {
      case 'work_order':
        if (item.type === 'work_order:completed') {
          return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
        }
        if (item.type === 'work_order:created') {
          return <Wrench className="w-4 h-4 text-indigo-500" />;
        }
        return <Activity className="w-4 h-4 text-amber-500" />;
      case 'payment':
        return <CreditCard className="w-4 h-4 text-pink-500" />;
      case 'technician':
        return <MapPin className="w-4 h-4 text-sky-500" />;
      case 'system':
        return <AlertTriangle className="w-4 h-4 text-rose-500" />;
      case 'chat':
        return <MessageSquare className="w-4 h-4 text-indigo-500" />;
      default:
        return <Radio className="w-4 h-4 text-purple-500" />;
    }
  };

  const content = (
    <div className={`flex flex-col h-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl overflow-hidden ${className}`}>
      {/* Header */}
      <div className="p-3.5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/80 dark:bg-slate-800/50 backdrop-blur-xs">
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Radio className="w-4 h-4 text-rose-500 animate-pulse" />
            <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-rose-500 rounded-full animate-ping"></span>
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
              <span>LIVE FEED</span>
              {unreadEventCount > 0 && (
                <span className="bg-rose-500 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                  {unreadEventCount} new
                </span>
              )}
            </h3>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">
              Real-time WebSocket event stream (Socket.io)
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-1">
          {unreadEventCount > 0 && (
            <button
              onClick={markAllEventsAsRead}
              className="p-1 rounded text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition cursor-pointer"
              title="Mark all as read"
            >
              <CheckCheck className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            onClick={clearLiveEvents}
            className="p-1 rounded text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition cursor-pointer"
            title="Clear event stream"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
          {isDrawer && onClose && (
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition cursor-pointer ml-1"
              title="Close Live Feed"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Filter and Simulator Quick-Pills */}
      <div className="p-2 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 space-y-2">
        {/* Category Pills */}
        <div className="flex items-center space-x-1 overflow-x-auto pb-1 text-[11px] font-sans scrollbar-none">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-2 py-0.5 rounded-full transition font-semibold shrink-0 cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
            }`}
          >
            All ({liveEvents.length})
          </button>
          <button
            onClick={() => setSelectedCategory('work_order')}
            className={`px-2 py-0.5 rounded-full transition font-semibold shrink-0 cursor-pointer ${
              selectedCategory === 'work_order'
                ? 'bg-indigo-600 text-white'
                : 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100'
            }`}
          >
            Work Orders
          </button>
          <button
            onClick={() => setSelectedCategory('technician')}
            className={`px-2 py-0.5 rounded-full transition font-semibold shrink-0 cursor-pointer ${
              selectedCategory === 'technician'
                ? 'bg-sky-600 text-white'
                : 'bg-sky-50 dark:bg-sky-950/50 text-sky-700 dark:text-sky-300 hover:bg-sky-100'
            }`}
          >
            Technicians
          </button>
          <button
            onClick={() => setSelectedCategory('payment')}
            className={`px-2 py-0.5 rounded-full transition font-semibold shrink-0 cursor-pointer ${
              selectedCategory === 'payment'
                ? 'bg-pink-600 text-white'
                : 'bg-pink-50 dark:bg-pink-950/50 text-pink-700 dark:text-pink-300 hover:bg-pink-100'
            }`}
          >
            Payments
          </button>
          <button
            onClick={() => setSelectedCategory('system')}
            className={`px-2 py-0.5 rounded-full transition font-semibold shrink-0 cursor-pointer ${
              selectedCategory === 'system'
                ? 'bg-rose-600 text-white'
                : 'bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 hover:bg-rose-100'
            }`}
          >
            Alerts
          </button>
        </div>

        {/* Quick simulator triggers */}
        <div className="flex items-center justify-between pt-1 border-t border-slate-200/60 dark:border-slate-800/60 text-[10px]">
          <span className="text-slate-400 font-medium">Quick Sim:</span>
          <div className="flex items-center space-x-1">
            <button
              onClick={() => triggerEventSimulation('work_order:completed')}
              className="px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-200 font-bold transition cursor-pointer"
              title="Trigger WO Completed"
            >
              + Completed
            </button>
            <button
              onClick={() => triggerEventSimulation('technician:location')}
              className="px-1.5 py-0.5 rounded bg-sky-100 dark:bg-sky-950/80 text-sky-800 dark:text-sky-300 hover:bg-sky-200 font-bold transition cursor-pointer"
              title="Trigger GPS Update"
            >
              + GPS
            </button>
            <button
              onClick={() => triggerEventSimulation('payment:received')}
              className="px-1.5 py-0.5 rounded bg-pink-100 dark:bg-pink-950/80 text-pink-800 dark:text-pink-300 hover:bg-pink-200 font-bold transition cursor-pointer"
              title="Trigger bKash Payment"
            >
              + ৳ Pay
            </button>
          </div>
        </div>
      </div>

      {/* Stream list */}
      <div
        ref={feedListRef}
        className="flex-1 overflow-y-auto p-2 space-y-2 divide-y divide-slate-100 dark:divide-slate-800/40"
      >
        {filteredEvents.length === 0 ? (
          <div className="py-12 text-center text-slate-400 dark:text-slate-500">
            <Radio className="w-8 h-8 mx-auto mb-2 opacity-30" />
            <p className="text-xs font-semibold">No live events matching filter</p>
            <p className="text-[10px] opacity-75 mt-0.5">Real-time socket messages will appear here</p>
          </div>
        ) : (
          filteredEvents.map((event) => {
            const timeAgo = getRelativeTime(event.timestamp);

            return (
              <div
                key={event.id}
                onClick={() => {
                  markEventAsRead(event.id);
                  if (onSelectEvent) onSelectEvent(event);
                }}
                className={`pt-2 first:pt-0 p-2 rounded-xl transition duration-150 cursor-pointer ${
                  event.unread
                    ? 'bg-slate-50/80 dark:bg-slate-800/60 border border-indigo-200/50 dark:border-indigo-800/40'
                    : 'hover:bg-slate-50 dark:hover:bg-slate-800/30'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start space-x-2 min-w-0">
                    <div className="mt-0.5 p-1 rounded-lg bg-slate-100 dark:bg-slate-800 shrink-0">
                      {getCategoryIcon(event)}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center space-x-1.5">
                        <span className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                          {event.title}
                        </span>
                        {event.unread && (
                          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0"></span>
                        )}
                      </div>
                      {event.subtitle && (
                        <p className="text-[11px] text-slate-600 dark:text-slate-400 line-clamp-2 mt-0.5">
                          {event.subtitle}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col items-end shrink-0">
                    <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500">
                      {timeAgo}
                    </span>
                    {event.badgeText && (
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.2 rounded-md mt-1 ${
                          event.badgeColor || 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {event.badgeText}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer Status */}
      <div className="p-2 border-t border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/40 text-[10px] text-slate-500 flex items-center justify-between">
        <span className="flex items-center gap-1 font-mono">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          Streaming ({liveEvents.length} events buffered)
        </span>
        <button
          onClick={() => setAutoScroll(!autoScroll)}
          className={`font-semibold hover:underline cursor-pointer ${
            autoScroll ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'
          }`}
        >
          {autoScroll ? 'Auto-scroll: ON' : 'Auto-scroll: OFF'}
        </button>
      </div>
    </div>
  );

  if (isDrawer) {
    if (!isOpen) return null;
    return (
      <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-96 p-3 shadow-2xl transition-transform duration-300">
        <div className="h-full drop-shadow-2xl">
          {content}
        </div>
      </div>
    );
  }

  return content;
};
