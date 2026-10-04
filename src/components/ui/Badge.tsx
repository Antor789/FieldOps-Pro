import React from 'react';
import { WorkOrderPriority } from '../../types/fsm';

export type BadgeVariant =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | 'purple'
  | 'cyan'
  | 'outline';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: 'xs' | 'sm' | 'md';
  dot?: boolean;
  pulseDot?: boolean;
  icon?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'secondary',
  size = 'sm',
  dot = false,
  pulseDot = false,
  icon,
  className = '',
  ...props
}) => {
  const sizeClasses = {
    xs: 'px-1.5 py-0.5 text-[9px] gap-1',
    sm: 'px-2 py-0.5 text-[10px] gap-1.5',
    md: 'px-2.5 py-1 text-xs gap-1.5 font-semibold',
  }[size];

  const variantClasses = {
    primary:
      'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/60 dark:text-indigo-300 dark:border-indigo-800',
    secondary:
      'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
    success:
      'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800',
    warning:
      'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800',
    danger:
      'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/60 dark:text-red-300 dark:border-red-800',
    info:
      'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800',
    purple:
      'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-800',
    cyan:
      'bg-cyan-50 text-cyan-700 border-cyan-200 dark:bg-cyan-950/60 dark:text-cyan-300 dark:border-cyan-800',
    outline:
      'bg-transparent text-slate-600 border-slate-300 dark:text-slate-300 dark:border-slate-700',
  }[variant];

  const dotColors = {
    primary: 'bg-indigo-500',
    secondary: 'bg-slate-400',
    success: 'bg-emerald-500',
    warning: 'bg-amber-500',
    danger: 'bg-red-500',
    info: 'bg-blue-500',
    purple: 'bg-purple-500',
    cyan: 'bg-cyan-500',
    outline: 'bg-slate-400',
  }[variant];

  return (
    <span
      className={`inline-flex items-center justify-center font-bold rounded-lg border font-sans tracking-wide shrink-0 ${sizeClasses} ${variantClasses} ${className}`}
      {...props}
    >
      {dot && (
        <span
          className={`w-1.5 h-1.5 rounded-full ${dotColors} ${
            pulseDot ? 'animate-pulse' : ''
          }`}
        />
      )}
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </span>
  );
};

export const PriorityBadge: React.FC<{ priority: WorkOrderPriority; lang?: 'en' | 'bn' }> = ({
  priority,
  lang = 'en',
}) => {
  const configs: Record<
    WorkOrderPriority,
    { labelEn: string; labelBn: string; variant: BadgeVariant; dot: boolean; pulse: boolean }
  > = {
    EMERGENCY: {
      labelEn: 'Emergency',
      labelBn: 'জরুরী',
      variant: 'danger',
      dot: true,
      pulse: true,
    },
    CRITICAL: {
      labelEn: 'Critical',
      labelBn: 'গুরুত্বপূর্ণ',
      variant: 'warning',
      dot: true,
      pulse: false,
    },
    HIGH: {
      labelEn: 'High',
      labelBn: 'উচ্চ',
      variant: 'warning',
      dot: false,
      pulse: false,
    },
    MEDIUM: {
      labelEn: 'Medium',
      labelBn: 'মাঝারি',
      variant: 'info',
      dot: false,
      pulse: false,
    },
    LOW: {
      labelEn: 'Low',
      labelBn: 'সাধারণ',
      variant: 'secondary',
      dot: false,
      pulse: false,
    },
  };

  const config = configs[priority] || configs.MEDIUM;
  const label = lang === 'bn' ? config.labelBn : config.labelEn;

  return (
    <Badge
      variant={config.variant}
      size="xs"
      dot={config.dot}
      pulseDot={config.pulse}
      className="uppercase tracking-wider font-mono text-[9px]"
    >
      {label}
    </Badge>
  );
};
