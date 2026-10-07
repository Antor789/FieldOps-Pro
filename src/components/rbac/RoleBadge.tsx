import React from 'react';
import { UserRole } from '../../types/rbac';
import {
  Crown,
  ShieldCheck,
  Briefcase,
  Radio,
  Wrench,
  Banknote,
  User,
} from 'lucide-react';

export interface RoleBadgeProps {
  role: UserRole;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  className?: string;
}

export const RoleBadge: React.FC<RoleBadgeProps> = ({
  role,
  size = 'md',
  showIcon = true,
  className = '',
}) => {
  const roleConfig: Record<
    UserRole,
    { label: string; icon: React.ReactNode; bg: string; text: string; border: string }
  > = {
    super_admin: {
      label: 'Super Admin',
      icon: <Crown className="shrink-0" />,
      bg: 'bg-purple-50 dark:bg-purple-950/60',
      text: 'text-purple-700 dark:text-purple-300',
      border: 'border-purple-200 dark:border-purple-800',
    },
    admin: {
      label: 'Company Admin',
      icon: <ShieldCheck className="shrink-0" />,
      bg: 'bg-rose-50 dark:bg-rose-950/60',
      text: 'text-rose-700 dark:text-rose-300',
      border: 'border-rose-200 dark:border-rose-800',
    },
    manager: {
      label: 'Manager',
      icon: <Briefcase className="shrink-0" />,
      bg: 'bg-amber-50 dark:bg-amber-950/60',
      text: 'text-amber-700 dark:text-amber-300',
      border: 'border-amber-200 dark:border-amber-800',
    },
    dispatcher: {
      label: 'Dispatcher',
      icon: <Radio className="shrink-0" />,
      bg: 'bg-blue-50 dark:bg-blue-950/60',
      text: 'text-blue-700 dark:text-blue-300',
      border: 'border-blue-200 dark:border-blue-800',
    },
    technician: {
      label: 'Technician',
      icon: <Wrench className="shrink-0" />,
      bg: 'bg-emerald-50 dark:bg-emerald-950/60',
      text: 'text-emerald-700 dark:text-emerald-300',
      border: 'border-emerald-200 dark:border-emerald-800',
    },
    accountant: {
      label: 'Accountant',
      icon: <Banknote className="shrink-0" />,
      bg: 'bg-teal-50 dark:bg-teal-950/60',
      text: 'text-teal-700 dark:text-teal-300',
      border: 'border-teal-200 dark:border-teal-800',
    },
    customer: {
      label: 'Customer',
      icon: <User className="shrink-0" />,
      bg: 'bg-slate-100 dark:bg-slate-800',
      text: 'text-slate-700 dark:text-slate-300',
      border: 'border-slate-300 dark:border-slate-700',
    },
  };

  const current = roleConfig[role] || roleConfig.customer;

  const sizeClasses = {
    sm: 'text-[10px] px-1.5 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
    lg: 'text-sm px-3 py-1.5 gap-2',
  }[size];

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-3.5 h-3.5',
    lg: 'w-4 h-4',
  }[size];

  return (
    <span
      className={`inline-flex items-center font-bold font-mono rounded-full border ${current.bg} ${current.text} ${current.border} ${sizeClasses} ${className}`}
    >
      {showIcon && React.cloneElement(current.icon as React.ReactElement<{ className?: string }>, {
        className: `${iconSizes}`,
      })}
      <span>{current.label}</span>
    </span>
  );
};
