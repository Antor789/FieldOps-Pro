import React, { useState, useMemo } from 'react';
import { Contract, ContractRenewalAdjustment } from '../../types/contracts';
import {
  RefreshCw,
  ArrowLeft,
  AlertTriangle,
  Building2,
  Calendar,
  CheckCircle2,
  DollarSign,
  TrendingUp,
  FileCheck,
  ShieldAlert,
  Percent,
  Sparkles,
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { formatBDT, formatBDTLakh } from '../../data/sampleContractsData';

interface ContractRenewalProps {
  contracts: Contract[];
  onBack: () => void;
  onRenewContract: (contractId: string, adjustment: ContractRenewalAdjustment) => void;
  onViewContract: (contract: Contract) => void;
}

export const ContractRenewal: React.FC<ContractRenewalProps> = ({
  contracts,
  onBack,
  onRenewContract,
  onViewContract,
}) => {
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);

  // Renewal form state for selected contract
  const [rateAdjustmentPercent, setRateAdjustmentPercent] = useState<number>(5); // default 5% annual adjustment
  const [renewalDurationMonths, setRenewalDurationMonths] = useState<number>(12);
  const [autoRenew, setAutoRenew] = useState<boolean>(true);
  const [renewalNotes, setRenewalNotes] = useState<string>(
    'Annual AMC renewal with 5% inflation and spare parts indexation adjustment.'
  );

  const now = new Date();

  // Find contracts that are expiring soon or expired or active with <= 60 days
  const eligibleContracts = useMemo(() => {
    return contracts
      .map((c) => {
        const end = new Date(c.endDate);
        const daysLeft = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        return { ...c, daysLeft };
      })
      .filter((c) => c.status === 'expiring_soon' || c.status === 'expired' || c.daysLeft <= 90)
      .sort((a, b) => a.daysLeft - b.daysLeft);
  }, [contracts]);

  const totalRenewalValueBDT = eligibleContracts.reduce((sum, c) => sum + (c.value || 0), 0);

  const handleOpenRenewalModal = (contract: Contract) => {
    setSelectedContract(contract);
    setRateAdjustmentPercent(5);
    setRenewalDurationMonths(12);
    setRenewalNotes(`Annual renewal for ${contract.customerName} with standard 5% escalation.`);
  };

  const handleExecuteRenewal = () => {
    if (!selectedContract) return;

    const currentVal = selectedContract.value;
    const adjustedVal = Math.round(currentVal * (1 + rateAdjustmentPercent / 100));

    // Calculate new dates: starts day after current end date
    const prevEndDate = new Date(selectedContract.endDate);
    const newStartDate = new Date(prevEndDate);
    newStartDate.setDate(newStartDate.getDate() + 1);

    const newEndDate = new Date(newStartDate);
    newEndDate.setMonth(newEndDate.getMonth() + renewalDurationMonths);

    const adjustment: ContractRenewalAdjustment = {
      newValueBDT: adjustedVal,
      newStartDate: newStartDate.toISOString(),
      newEndDate: newEndDate.toISOString(),
      rateAdjustmentPercent,
      notes: renewalNotes,
      autoRenew,
    };

    onRenewContract(selectedContract.id, adjustment);
    setSelectedContract(null);
  };

  return (
    <div className="space-y-6">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={onBack} className="p-2">
            <ArrowLeft className="w-5 h-5 text-slate-500" />
          </Button>
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <RefreshCw className="w-5 h-5 text-amber-500" />
              Contract Renewal Hub (চুক্তি নবায়ন কেন্দ্র)
            </h1>
            <p className="text-xs text-slate-500">
              Manage expiring service agreements, automate term extensions, and generate renewal invoices
            </p>
          </div>
        </div>

        <Button variant="outline" size="sm" onClick={onBack} className="text-xs">
          Back to Contracts
        </Button>
      </div>

      {/* 2. Pipeline Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/50 dark:bg-amber-950/20 text-xs">
          <span className="font-bold text-amber-900 dark:text-amber-200 block text-xs mb-1">
            Expiring Pipeline ({eligibleContracts.length} Contracts)
          </span>
          <div className="text-2xl font-black text-amber-700 dark:text-amber-300">
            {formatBDTLakh(totalRenewalValueBDT)}
          </div>
          <span className="text-[11px] text-amber-800/80 dark:text-amber-400 mt-1 block">
            Annual revenue up for renewal
          </span>
        </div>

        <div className="p-4 rounded-xl border border-blue-200 dark:border-blue-900/60 bg-blue-50/50 dark:bg-blue-950/20 text-xs">
          <span className="font-bold text-blue-900 dark:text-blue-200 block text-xs mb-1">
            Projected Post-Renewal ARR (+5%)
          </span>
          <div className="text-2xl font-black text-blue-700 dark:text-blue-300">
            {formatBDTLakh(Math.round(totalRenewalValueBDT * 1.05))}
          </div>
          <span className="text-[11px] text-blue-800/80 dark:text-blue-400 mt-1 block">
            With standard indexation
          </span>
        </div>

        <div className="p-4 rounded-xl border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/50 dark:bg-emerald-950/20 text-xs">
          <span className="font-bold text-emerald-900 dark:text-emerald-200 block text-xs mb-1">
            Target SLA Retention
          </span>
          <div className="text-2xl font-black text-emerald-700 dark:text-emerald-300">
            100%
          </div>
          <span className="text-[11px] text-emerald-800/80 dark:text-emerald-400 mt-1 block">
            Zero customer churn target
          </span>
        </div>
      </div>

      {/* 3. Expiring Contracts Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-500" />
            Agreements Requiring Renewal Action
          </h3>
          <span className="text-xs text-slate-500">{eligibleContracts.length} agreements found</span>
        </div>

        {eligibleContracts.length === 0 ? (
          <div className="text-center py-12 text-slate-400 text-xs">
            No contracts are currently pending renewal. All agreements are active with healthy tenure.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/70 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 font-semibold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-3 px-4">Contract #</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Current Value</th>
                  <th className="py-3 px-4">End Date</th>
                  <th className="py-3 px-4">Urgency</th>
                  <th className="py-3 px-4">SLA Score</th>
                  <th className="py-3 px-4 text-right">Renewal Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {eligibleContracts.map((c) => {
                  return (
                    <tr key={c.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="py-3 px-4 font-mono font-bold text-blue-600 dark:text-blue-400">
                        {c.contractNumber}
                      </td>
                      <td className="py-3 px-4">
                        <strong className="text-slate-900 dark:text-white block">{c.customerName}</strong>
                        <span className="text-[11px] text-slate-400">{c.title}</span>
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">
                        {formatBDT(c.value)}
                        <span className="block text-[10px] text-slate-400 font-normal capitalize">
                          {c.paymentTerms}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-700 dark:text-slate-300 font-medium">
                        {new Date(c.endDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="py-3 px-4">
                        {c.daysLeft <= 0 ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300">
                            Expired ({Math.abs(c.daysLeft)}d ago)
                          </span>
                        ) : c.daysLeft <= 15 ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 animate-pulse">
                            ⚠️ {c.daysLeft} days left
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                            {c.daysLeft} days left
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-emerald-600 dark:text-emerald-400 font-bold">
                        {c.slaCompliancePercent ?? 98}%
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onViewContract(c)}
                            className="h-7 text-xs px-2"
                          >
                            View
                          </Button>
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => handleOpenRenewalModal(c)}
                            className="h-7 text-xs px-2.5 bg-amber-600 hover:bg-amber-700 text-white"
                          >
                            <RefreshCw className="w-3 h-3 mr-1" />
                            Renew Terms
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 4. Renewal Adjustment Modal */}
      {selectedContract && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 max-w-lg w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <RefreshCw className="w-5 h-5 text-amber-500" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Renew Agreement: {selectedContract.contractNumber}
                </h3>
              </div>
              <button
                onClick={() => setSelectedContract(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <div className="text-xs space-y-3">
              <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-500">Customer:</span>
                  <strong className="text-slate-900 dark:text-white">{selectedContract.customerName}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Current Value:</span>
                  <strong className="text-slate-900 dark:text-white">{formatBDT(selectedContract.value)}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Current Expiry:</span>
                  <span>{new Date(selectedContract.endDate).toLocaleDateString('en-GB')}</span>
                </div>
              </div>

              {/* Adjustment Percentage */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Rate Adjustment (মূল্য সমন্বয় / মুদ্রাস্ফীতি) %
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[0, 5, 8, 10].map((rate) => (
                    <button
                      key={rate}
                      type="button"
                      onClick={() => setRateAdjustmentPercent(rate)}
                      className={`py-1.5 rounded-lg border text-xs font-bold transition-colors ${
                        rateAdjustmentPercent === rate
                          ? 'border-blue-600 bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                          : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {rate === 0 ? 'Same (0%)' : `+${rate}%`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Projected New Value */}
              <div className="p-3 bg-blue-50 dark:bg-blue-950/40 rounded-xl border border-blue-200 dark:border-blue-900 flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-blue-800 dark:text-blue-300 block">
                    New Annual Contract Consideration:
                  </span>
                  <strong className="text-sm font-black text-blue-900 dark:text-blue-200">
                    {formatBDT(Math.round(selectedContract.value * (1 + rateAdjustmentPercent / 100)))}
                  </strong>
                </div>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded-full">
                  +{rateAdjustmentPercent}%
                </span>
              </div>

              {/* Term Duration */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Extension Duration (মেয়াদ বৃদ্ধি)
                </label>
                <select
                  value={renewalDurationMonths}
                  onChange={(e) => setRenewalDurationMonths(parseInt(e.target.value, 10))}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  <option value={12}>12 Months (1 Year Standard AMC)</option>
                  <option value={24}>24 Months (2 Year Long-term)</option>
                  <option value={6}>6 Months (Short-term Extension)</option>
                </select>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Renewal Notes & Clause Amendments
                </label>
                <textarea
                  rows={2}
                  value={renewalNotes}
                  onChange={(e) => setRenewalNotes(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              {/* Auto Renew */}
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoRenew}
                  onChange={(e) => setAutoRenew(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded"
                />
                <span className="text-slate-700 dark:text-slate-300">
                  Keep auto-renew enabled for subsequent period
                </span>
              </label>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
              <Button variant="outline" size="sm" onClick={() => setSelectedContract(null)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleExecuteRenewal}
                className="bg-amber-600 hover:bg-amber-700 text-white"
              >
                <CheckCircle2 className="w-4 h-4 mr-1" />
                Confirm & Auto-Generate Invoice
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
