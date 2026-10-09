import React from 'react';
import { AvailabilityStatus } from '../../types/shifts';

interface AvailabilityBadgeProps {
  status: AvailabilityStatus;
  showDotOnly?: boolean;
  size?: 'xs' | 'sm' | 'md';
}

export const AvailabilityBadge: React.FC<AvailabilityBadgeProps> = ({
  status,
  showDotOnly = false,
  size = 'sm',
}) => {
  const configMap: Record<
    AvailabilityStatus,
    { label: string; bg: string; text: string; border: string; dot: string }
  > = {
    available: {
      label: 'Available',
      bg: 'bg-emerald-50 dark:bg-emerald-950/70',
      text: 'text-emerald-700 dark:text-emerald-300',
      border: 'border-emerald-200 dark:border-emerald-800',
      dot: 'bg-emerald-500',
    },
    on_job: {
      label: 'On Job',
      bg: 'bg-blue-50 dark:bg-blue-950/70',
      text: 'text-blue-700 dark:text-blue-300',
      border: 'border-blue-200 dark:border-blue-800',
      dot: 'bg-blue-500',
    },
    on_break: {
      label: 'On Break',
      bg: 'bg-purple-50 dark:bg-purple-950/70',
      text: 'text-purple-700 dark:text-purple-300',
      border: 'border-purple-200 dark:border-purple-800',
      dot: 'bg-purple-500',
    },
    on_leave: {
      label: 'On Leave',
      bg: 'bg-amber-50 dark:bg-amber-950/70',
      text: 'text-amber-700 dark:text-amber-300',
      border: 'border-amber-200 dark:border-amber-800',
      dot: 'bg-amber-500',
    },
    off: {
      label: 'Off Day',
      bg: 'bg-slate-100 dark:bg-slate-800/80',
      text: 'text-slate-600 dark:text-slate-400',
      border: 'border-slate-200 dark:border-slate-700',
      dot: 'bg-slate-400',
    },
    overtime: {
      label: 'Overtime',
      bg: 'bg-yellow-50 dark:bg-yellow-950/70',
      text: 'text-yellow-800 dark:text-yellow-300',
      border: 'border-yellow-300 dark:border-yellow-800',
      dot: 'bg-yellow-500',
    },
  };

  const cfg = configMap[status] || configMap.off;

  if (showDotOnly) {
    return (
      <span
        className={`inline-block rounded-full ${cfg.dot} ${
          size === 'xs' ? 'w-2 h-2' : size === 'md' ? 'w-3 h-3' : 'w-2.5 h-2.5'
        }`}
        title={cfg.label}
      />
    );
  }

  const sizeClass =
    size === 'xs'
      ? 'px-1.5 py-0.5 text-[9px]'
      : size === 'md'
      ? 'px-3 py-1 text-xs'
      : 'px-2 py-0.5 text-[10px]';

  return (
    <span
      className={`inline-flex items-center space-x-1.5 font-bold font-mono rounded-full border ${cfg.bg} ${cfg.text} ${cfg.border} ${sizeClass}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot} animate-pulse`} />
      <span>{cfg.label}</span>
    </span>
  );
};
