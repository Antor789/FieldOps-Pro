import React from 'react';
import { Contract } from '../../types/contracts';
import {
  FileText,
  Calendar,
  AlertTriangle,
  Building2,
  Clock,
  ExternalLink,
  RefreshCw,
  Download,
  ShieldCheck,
  CheckCircle2,
  Zap,
} from 'lucide-react';
import { Button } from '../ui/Button';
import { formatBDT, formatBDTLakh } from '../../data/sampleContractsData';

interface ContractCardProps {
  contract: Contract;
  onView: (contract: Contract) => void;
  onRenew?: (contract: Contract) => void;
  onDownloadPdf?: (contract: Contract) => void;
  className?: string;
}

export const ContractCard: React.FC<ContractCardProps> = ({
  contract,
  onView,
  onRenew,
  onDownloadPdf,
  className = '',
}) => {
  // Calculate days remaining
  const now = new Date();
  const endDate = new Date(contract.endDate);
  const diffDays = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  const isExpiringSoon = contract.status === 'expiring_soon' || (diffDays > 0 && diffDays <= 30);
  const isExpired = contract.status === 'expired' || diffDays <= 0;

  const getStatusBadge = () => {
    switch (contract.status) {
      case 'active':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Active (সক্রিয়)
          </span>
        );
      case 'expiring_soon':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
            <AlertTriangle className="w-3 h-3 text-amber-500" />
            Expiring Soon ({diffDays}d)
          </span>
        );
      case 'expired':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300">
            Expired (মেয়াদোত্তীর্ণ)
          </span>
        );
      case 'draft':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300">
            Draft (খসড়া)
          </span>
        );
      case 'renewed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300">
            Renewed (নবায়িত)
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
            {contract.status}
          </span>
        );
    }
  };

  const getTypeBadge = () => {
    switch (contract.type) {
      case 'amc':
        return { label: 'AMC', bn: 'বার্ষিক রক্ষণাবেক্ষণ', color: 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300' };
      case 'sla':
        return { label: 'SLA', bn: 'সেবা চুক্তি', color: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300' };
      case 'retainer':
        return { label: 'Retainer', bn: 'রিটেইনার চুক্তি', color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' };
      case 'on_demand':
        return { label: 'On-Demand', bn: 'অন-ডিমান্ড', color: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' };
      case 'project':
        return { label: 'Project', bn: 'প্রজেক্ট চুক্তি', color: 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300' };
      default:
        return { label: contract.type, bn: '', color: 'bg-slate-100 text-slate-700' };
    }
  };

  const typeInfo = getTypeBadge();

  return (
    <div
      className={`group relative rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 sm:p-5 shadow-sm hover:shadow-md transition-all duration-200 hover:border-blue-400 dark:hover:border-blue-600 flex flex-col justify-between ${className}`}
    >
      <div>
        {/* Top Meta: Contract Number, Type, Status */}
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded border border-blue-200/60 dark:border-blue-900">
              {contract.contractNumber}
            </span>
            <span className={`text-[11px] font-bold px-2 py-0.5 rounded uppercase ${typeInfo.color}`}>
              {typeInfo.label}
            </span>
          </div>
          <div>{getStatusBadge()}</div>
        </div>

        {/* Contract Title & Customer */}
        <h3
          onClick={() => onView(contract)}
          className="text-sm sm:text-base font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 cursor-pointer line-clamp-1 transition-colors"
          title={contract.title}
        >
          {contract.title}
        </h3>

        {contract.titleBangla && (
          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
            {contract.titleBangla}
          </p>
        )}

        <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300 mt-2">
          <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="font-semibold">{contract.customerName}</span>
        </div>

        {/* Financial & Time Specs */}
        <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
          <div>
            <span className="text-[11px] text-slate-400 block">Total Value</span>
            <span className="font-bold text-slate-900 dark:text-white text-sm">
              {formatBDT(contract.value)}
            </span>
            <span className="text-[10px] text-slate-400 ml-1">({formatBDTLakh(contract.value)})</span>
          </div>

          <div>
            <span className="text-[11px] text-slate-400 block">Billing Term</span>
            <span className="font-semibold text-slate-700 dark:text-slate-300 capitalize">
              {contract.paymentTerms}
            </span>
            {contract.monthlyValue && (
              <span className="text-[10px] text-slate-400 block">
                ~{formatBDT(contract.monthlyValue)}/mo
              </span>
            )}
          </div>
        </div>

        {/* Dates and Expiry Notice */}
        <div className="mt-3 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 p-2 rounded-lg">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>
              {new Date(contract.startDate).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })} –{' '}
              {new Date(contract.endDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
            </span>
          </div>

          {contract.slaCompliancePercent !== undefined && (
            <div className="flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400 text-[11px]">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{contract.slaCompliancePercent}% SLA</span>
            </div>
          )}
        </div>

        {/* Warning if expiring soon */}
        {isExpiringSoon && (
          <div className="mt-2.5 p-2 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 flex items-center justify-between text-xs text-amber-800 dark:text-amber-300">
            <span className="flex items-center gap-1.5 font-medium text-[11px]">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
              Expires in {diffDays} days!
            </span>
            {onRenew && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRenew(contract);
                }}
                className="text-[11px] font-bold text-amber-900 dark:text-amber-200 hover:underline flex items-center gap-0.5"
              >
                Renew Now →
              </button>
            )}
          </div>
        )}
      </div>

      {/* Card Actions Bottom Bar */}
      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onView(contract)}
          className="text-xs flex items-center gap-1"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          View Agreement
        </Button>

        <div className="flex items-center gap-1">
          {onDownloadPdf && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDownloadPdf(contract)}
              title="Download Signed Contract PDF"
              className="p-1.5 text-slate-500 hover:text-blue-600"
            >
              <Download className="w-4 h-4" />
            </Button>
          )}

          {(isExpiringSoon || isExpired) && onRenew && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => onRenew(contract)}
              className="text-xs flex items-center gap-1 bg-amber-600 hover:bg-amber-700 text-white"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Renew
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
