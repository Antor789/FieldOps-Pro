import React from 'react';
import { Contract } from '../../types/contracts';
import {
  AlertTriangle,
  Clock,
  ArrowRight,
  RefreshCw,
  Building2,
  Calendar,
  ShieldAlert,
} from 'lucide-react';
import { Button } from '../ui/Button';
import { formatBDT, formatBDTLakh } from '../../data/sampleContractsData';

interface ExpiryAlertProps {
  contracts: Contract[];
  onRenewContract: (contract: Contract) => void;
  onViewAllExpiring: () => void;
  className?: string;
}

export const ExpiryAlert: React.FC<ExpiryAlertProps> = ({
  contracts,
  onRenewContract,
  onViewAllExpiring,
  className = '',
}) => {
  const now = new Date();

  // Find contracts expiring in <= 60 days or already expired
  const expiringContracts = contracts
    .map((c) => {
      const end = new Date(c.endDate);
      const daysLeft = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      return { ...c, daysLeft };
    })
    .filter((c) => c.status === 'expiring_soon' || (c.daysLeft <= 60 && c.status !== 'renewed'))
    .sort((a, b) => a.daysLeft - b.daysLeft);

  const totalAtRiskBDT = expiringContracts.reduce((sum, c) => sum + (c.value || 0), 0);

  if (expiringContracts.length === 0) {
    return null;
  }

  return (
    <div
      className={`rounded-2xl border border-amber-200 dark:border-amber-900/60 bg-gradient-to-r from-amber-50/80 via-orange-50/40 to-amber-50/60 dark:from-amber-950/40 dark:via-orange-950/20 dark:to-amber-950/30 p-4 sm:p-5 shadow-xs ${className}`}
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Header and Value */}
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 dark:bg-amber-400/10 border border-amber-500/30 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
            <ShieldAlert className="w-5 h-5 animate-pulse" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-bold text-amber-950 dark:text-amber-200">
                Contract Renewal Alerts ({expiringContracts.length} agreements expiring)
              </h4>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-white">
                ACTION REQUIRED
              </span>
            </div>

            <p className="text-xs text-amber-800/90 dark:text-amber-300/80 mt-0.5">
              Annual maintenance contracts and SLAs require timely renewal to prevent service lapse and NBR tax audit gaps.
              Total revenue at renewal risk: <strong className="font-bold text-amber-950 dark:text-white">{formatBDT(totalAtRiskBDT)}</strong> ({formatBDTLakh(totalAtRiskBDT)}).
            </p>
          </div>
        </div>

        {/* View All Button */}
        <div className="shrink-0 flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onViewAllExpiring}
            className="text-xs border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200 hover:bg-amber-100 dark:hover:bg-amber-900/40"
          >
            Manage Renewals
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Button>
        </div>
      </div>

      {/* Quick Items Grid */}
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {expiringContracts.slice(0, 3).map((item) => (
          <div
            key={item.id}
            className="p-3 bg-white/90 dark:bg-slate-900/90 rounded-xl border border-amber-200/80 dark:border-amber-900/40 shadow-xs flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-mono font-bold text-blue-600 dark:text-blue-400 text-[11px]">
                  {item.contractNumber}
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    item.daysLeft <= 0
                      ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                      : item.daysLeft <= 15
                      ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                      : 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                  }`}
                >
                  {item.daysLeft <= 0 ? 'Expired' : `${item.daysLeft} days left`}
                </span>
              </div>

              <h5 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1" title={item.title}>
                {item.title}
              </h5>

              <div className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                <Building2 className="w-3 h-3 text-slate-400" />
                <span className="truncate">{item.customerName}</span>
              </div>
            </div>

            <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
              <span className="font-bold text-slate-800 dark:text-slate-200">
                {formatBDT(item.value)}
              </span>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => onRenewContract(item)}
                className="h-6 text-[11px] px-2 text-amber-700 dark:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-950/60 font-semibold"
              >
                <RefreshCw className="w-3 h-3 mr-1" />
                1-Click Renew
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
