import React from 'react';
import { AuditSeverity } from '../../types/audit';
import { Info, AlertTriangle, AlertOctagon, CheckCircle2 } from 'lucide-react';

export interface SeverityBadgeProps {
  severity: AuditSeverity;
  size?: 'sm' | 'md';
  showIcon?: boolean;
}

export const SeverityBadge: React.FC<SeverityBadgeProps> = ({
  severity,
  size = 'md',
  showIcon = true,
}) => {
  const config = {
    info: {
      label: 'INFO',
      icon: <Info className="shrink-0" />,
      classes: 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800',
    },
    warning: {
      label: 'WARN',
      icon: <AlertTriangle className="shrink-0" />,
      classes: 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800',
    },
    critical: {
      label: 'CRITICAL',
      icon: <AlertOctagon className="shrink-0" />,
      classes: 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800 font-extrabold',
    },
  }[severity];

  const sizeClasses = size === 'sm' ? 'text-[9px] px-1.5 py-0.2 gap-1' : 'text-[10px] px-2 py-0.5 gap-1.5';
  const iconSize = size === 'sm' ? 'w-2.5 h-2.5' : 'w-3 h-3';

  return (
    <span
      className={`inline-flex items-center font-mono rounded-full border ${sizeClasses} ${config.classes}`}
    >
      {showIcon && React.cloneElement(config.icon, { className: iconSize })}
      <span>{config.label}</span>
    </span>
  );
};
