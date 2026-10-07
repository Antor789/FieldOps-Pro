import React, { useState } from 'react';
import { useSocket } from '../../hooks/useSocket';
import { Wifi, WifiOff, RefreshCw, Radio, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';

export interface ConnectionStatusProps {
  className?: string;
  showSyncTime?: boolean;
  compact?: boolean;
  interactive?: boolean;
}

export const ConnectionStatus: React.FC<ConnectionStatusProps> = ({
  className = '',
  showSyncTime = true,
  compact = false,
  interactive = true,
}) => {
  const { connectionStatus, lastSyncedAt, reconnect, disconnect } = useSocket();
  const [isHovered, setIsHovered] = useState(false);

  const getStatusBadge = () => {
    switch (connectionStatus) {
      case 'connected':
        return {
          icon: <Wifi className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />,
          dotColor: 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]',
          label: 'Connected - Live Updates',
          labelBn: 'সংযুক্ত - লাইভ আপডেট সক্রিয়',
          bg: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30',
        };
      case 'connecting':
        return {
          icon: <RefreshCw className="w-3.5 h-3.5 text-amber-500 animate-spin" />,
          dotColor: 'bg-amber-500',
          label: 'Connecting...',
          labelBn: 'সংযোগ হচ্ছে...',
          bg: 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30',
        };
      case 'reconnecting':
        return {
          icon: <RefreshCw className="w-3.5 h-3.5 text-amber-500 animate-spin" />,
          dotColor: 'bg-amber-500 animate-ping',
          label: 'Disconnected - Reconnecting',
          labelBn: 'বিচ্ছিন্ন - পুনরায় সংযোগ চলছে',
          bg: 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30',
        };
      case 'disconnected':
      default:
        return {
          icon: <WifiOff className="w-3.5 h-3.5 text-rose-500" />,
          dotColor: 'bg-rose-500',
          label: 'Disconnected',
          labelBn: 'সংযোগ বিচ্ছিন্ন',
          bg: 'bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/30',
        };
    }
  };

  const status = getStatusBadge();

  const formattedTime = lastSyncedAt
    ? lastSyncedAt.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      })
    : null;

  if (compact) {
    return (
      <div
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-colors cursor-pointer ${status.bg} ${className}`}
        onClick={connectionStatus === 'connected' ? disconnect : reconnect}
        title={connectionStatus === 'connected' ? 'Click to simulate disconnect' : 'Click to reconnect'}
      >
        <span className="relative flex h-2 w-2">
          {connectionStatus === 'connected' && (
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          )}
          <span className={`relative inline-flex rounded-full h-2 w-2 ${status.dotColor}`}></span>
        </span>
        <span className="font-semibold text-[11px]">{status.label}</span>
      </div>
    );
  }

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative inline-flex items-center justify-between gap-3 px-3 py-1.5 rounded-xl border text-xs font-sans transition-all duration-200 ${status.bg} ${className}`}
    >
      <div className="flex items-center gap-2">
        <span className="relative flex h-2.5 w-2.5">
          {connectionStatus === 'connected' && (
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          )}
          <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${status.dotColor}`}></span>
        </span>

        <div className="flex flex-col text-left">
          <span className="font-bold tracking-tight text-[11px] leading-tight">
            {status.label}
          </span>
          {showSyncTime && formattedTime && (
            <span className="text-[10px] opacity-75 font-mono">
              Synced: {formattedTime}
            </span>
          )}
        </div>
      </div>

      {interactive && (
        <div className="flex items-center gap-1 pl-1 border-l border-current/20">
          {connectionStatus === 'connected' ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                disconnect();
              }}
              title="Simulate network disconnect"
              className="p-1 hover:bg-black/10 dark:hover:bg-white/10 rounded text-[10px] font-semibold transition cursor-pointer"
            >
              Simulate Drop
            </button>
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation();
                reconnect();
              }}
              title="Attempt manual reconnect"
              className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-emerald-600 text-white hover:bg-emerald-700 text-[10px] font-bold transition cursor-pointer shadow-xs"
            >
              <RefreshCw className="w-2.5 h-2.5 animate-spin" />
              Reconnect
            </button>
          )}
        </div>
      )}
    </div>
  );
};
