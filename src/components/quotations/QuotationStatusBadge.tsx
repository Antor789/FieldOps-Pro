import React from 'react';
import { QuotationStatus } from '../../types/quotations';
import {
  FileText,
  Send,
  Eye,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowRightCircle,
  Zap,
} from 'lucide-react';

interface QuotationStatusBadgeProps {
  status: QuotationStatus;
  showIcon?: boolean;
  className?: string;
  size?: 'sm' | 'md';
}

const STATUS_CONFIG: Record<
  QuotationStatus,
  { labelEn: string; labelBn: string; color: string; bg: string; border: string; icon: React.ReactNode }
> = {
  draft: {
    labelEn: 'Draft',
    labelBn: 'খসড়া',
    color: 'text-slate-700 dark:text-slate-300',
    bg: 'bg-slate-100 dark:bg-slate-800',
    border: 'border-slate-300 dark:border-slate-700',
    icon: <FileText className="w-3 h-3" />,
  },
  sent: {
    labelEn: 'Sent',
    labelBn: 'প্রেরিত',
    color: 'text-blue-700 dark:text-blue-300',
    bg: 'bg-blue-100/80 dark:bg-blue-950/80',
    border: 'border-blue-300 dark:border-blue-800',
    icon: <Send className="w-3 h-3" />,
  },
  viewed: {
    labelEn: 'Viewed',
    labelBn: 'দেখা হয়েছে',
    color: 'text-amber-700 dark:text-amber-300',
    bg: 'bg-amber-100/80 dark:bg-amber-950/80',
    border: 'border-amber-300 dark:border-amber-800',
    icon: <Eye className="w-3 h-3" />,
  },
  approved: {
    labelEn: 'Approved',
    labelBn: 'অনুমোদিত',
    color: 'text-emerald-700 dark:text-emerald-300',
    bg: 'bg-emerald-100/90 dark:bg-emerald-950/90',
    border: 'border-emerald-300 dark:border-emerald-800',
    icon: <CheckCircle2 className="w-3 h-3" />,
  },
  rejected: {
    labelEn: 'Rejected',
    labelBn: 'প্রত্যাখ্যাত',
    color: 'text-rose-700 dark:text-rose-300',
    bg: 'bg-rose-100/80 dark:bg-rose-950/80',
    border: 'border-rose-300 dark:border-rose-800',
    icon: <XCircle className="w-3 h-3" />,
  },
  expired: {
    labelEn: 'Expired',
    labelBn: 'মেয়াদোত্তীর্ণ',
    color: 'text-orange-700 dark:text-orange-300',
    bg: 'bg-orange-100/80 dark:bg-orange-950/80',
    border: 'border-orange-300 dark:border-orange-800',
    icon: <Clock className="w-3 h-3" />,
  },
  converted: {
    labelEn: 'Converted to WO',
    labelBn: 'ওয়ার্ক অর্ডারে রূপান্তর',
    color: 'text-purple-700 dark:text-purple-300',
    bg: 'bg-purple-100/90 dark:bg-purple-950/90',
    border: 'border-purple-300 dark:border-purple-800',
    icon: <ArrowRightCircle className="w-3 h-3" />,
  },
};

export const QuotationStatusBadge: React.FC<QuotationStatusBadgeProps> = ({
  status,
  showIcon = true,
  className = '',
  size = 'md',
}) => {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.draft;
  const isSizeSm = size === 'sm';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-bold uppercase tracking-wider rounded-full border ${config.bg} ${config.color} ${config.border} ${
        isSizeSm ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs'
      } ${className}`}
    >
      {showIcon && config.icon}
      <span>{config.labelEn}</span>
      <span className="opacity-75 text-[10px] hidden sm:inline">({config.labelBn})</span>
    </span>
  );
};
