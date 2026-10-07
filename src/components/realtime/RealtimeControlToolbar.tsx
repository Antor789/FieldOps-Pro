import React, { useState } from 'react';
import { useSocket } from '../../hooks/useSocket';
import { RealtimeEventType } from '../../types/realtime';
import {
  Play,
  Zap,
  MapPin,
  CheckCircle2,
  DollarSign,
  AlertTriangle,
  Radio,
  MessageSquare,
  Wrench,
  Users,
  ChevronDown,
  ChevronUp,
  RotateCcw,
} from 'lucide-react';

export interface RealtimeControlToolbarProps {
  className?: string;
  onOpenLiveFeed?: () => void;
}

export const RealtimeControlToolbar: React.FC<RealtimeControlToolbarProps> = ({
  className = '',
  onOpenLiveFeed,
}) => {
  const { triggerEventSimulation, isFeedDrawerOpen, setIsFeedDrawerOpen, connectionStatus } = useSocket();
  const [isExpanded, setIsExpanded] = useState(false);

  const eventTriggers: {
    type: RealtimeEventType;
    label: string;
    icon: React.ReactNode;
    color: string;
    bg: string;
    description: string;
  }[] = [
    {
      type: 'work_order:created',
      label: 'WO Created',
      icon: <Wrench className="w-3.5 h-3.5" />,
      color: 'text-indigo-600 dark:text-indigo-400',
      bg: 'hover:bg-indigo-50 dark:hover:bg-indigo-950/50 border-indigo-200 dark:border-indigo-800',
      description: 'Dispatch new emergency work order in Dhaka',
    },
    {
      type: 'work_order:assigned',
      label: 'WO Assigned',
      icon: <Users className="w-3.5 h-3.5" />,
      color: 'text-blue-600 dark:text-blue-400',
      bg: 'hover:bg-blue-50 dark:hover:bg-blue-950/50 border-blue-200 dark:border-blue-800',
      description: 'Assign technician to job',
    },
    {
      type: 'work_order:status_changed',
      label: 'En Route',
      icon: <Zap className="w-3.5 h-3.5" />,
      color: 'text-amber-600 dark:text-amber-400',
      bg: 'hover:bg-amber-50 dark:hover:bg-amber-950/50 border-amber-200 dark:border-amber-800',
      description: 'Technician updates status to En Route',
    },
    {
      type: 'work_order:completed',
      label: 'Job Done',
      icon: <CheckCircle2 className="w-3.5 h-3.5" />,
      color: 'text-emerald-600 dark:text-emerald-400',
      bg: 'hover:bg-emerald-50 dark:hover:bg-emerald-950/50 border-emerald-200 dark:border-emerald-800',
      description: 'Mark job completed with digital sign-off',
    },
    {
      type: 'technician:location',
      label: 'GPS Ping',
      icon: <MapPin className="w-3.5 h-3.5" />,
      color: 'text-sky-600 dark:text-sky-400',
      bg: 'hover:bg-sky-50 dark:hover:bg-sky-950/50 border-sky-200 dark:border-sky-800',
      description: 'Simulate live technician telemetry update',
    },
    {
      type: 'payment:received',
      label: 'bKash Pay',
      icon: <DollarSign className="w-3.5 h-3.5" />,
      color: 'text-pink-600 dark:text-pink-400',
      bg: 'hover:bg-pink-50 dark:hover:bg-pink-950/50 border-pink-200 dark:border-pink-800',
      description: 'Receive ৳8,500 via bKash Merchant Gateway',
    },
    {
      type: 'system:alert',
      label: 'SLA Alert',
      icon: <AlertTriangle className="w-3.5 h-3.5" />,
      color: 'text-rose-600 dark:text-rose-400',
      bg: 'hover:bg-rose-50 dark:hover:bg-rose-950/50 border-rose-200 dark:border-rose-800',
      description: 'Trigger 15-minute SLA breach warning',
    },
    {
      type: 'chat:message',
      label: 'Chat Msg',
      icon: <MessageSquare className="w-3.5 h-3.5" />,
      color: 'text-purple-600 dark:text-purple-400',
      bg: 'hover:bg-purple-50 dark:hover:bg-purple-950/50 border-purple-200 dark:border-purple-800',
      description: 'Send dispatcher-technician radio text',
    },
  ];

  return (
    <div className={`bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-2xl p-2.5 shadow-sm text-xs ${className}`}>
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center space-x-2">
          <div className="w-7 h-7 rounded-xl bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
            <Radio className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5 font-bold text-slate-900 dark:text-slate-100">
              <span>WebSocket Simulation Controls</span>
              <span className="text-[10px] font-mono bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 px-1.5 py-0.2 rounded">
                Socket.io
              </span>
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 hidden sm:block">
              Trigger real-time telemetry, WO status, GPS and bKash payment events
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-1.5">
          <button
            onClick={() => setIsFeedDrawerOpen(!isFeedDrawerOpen)}
            className={`flex items-center space-x-1 px-2.5 py-1 rounded-xl text-xs font-semibold border transition cursor-pointer ${
              isFeedDrawerOpen
                ? 'bg-rose-500 text-white border-rose-600'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200'
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
            <span>{isFeedDrawerOpen ? 'Close Stream' : 'Live Stream'}</span>
          </button>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition cursor-pointer"
            title={isExpanded ? 'Collapse triggers' : 'Expand all triggers'}
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Button Row / Grid */}
      <div className={`mt-2 pt-2 border-t border-slate-100 dark:border-slate-800/60 ${isExpanded ? 'grid grid-cols-2 sm:grid-cols-4 gap-1.5' : 'flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none'}`}>
        {eventTriggers.map((trig) => (
          <button
            key={trig.type}
            onClick={() => triggerEventSimulation(trig.type)}
            className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300 transition cursor-pointer shrink-0 shadow-2xs ${trig.bg}`}
            title={trig.description}
          >
            <span className={trig.color}>{trig.icon}</span>
            <span className="font-semibold text-[11px] whitespace-nowrap">{trig.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
