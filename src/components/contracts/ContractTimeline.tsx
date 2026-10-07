import React, { useState } from 'react';
import { Contract, ContractServiceRecord, ContractPaymentMilestone } from '../../types/contracts';
import {
  Clock,
  CheckCircle2,
  AlertTriangle,
  CreditCard,
  Wrench,
  Calendar,
  FileCheck,
  Building2,
  DollarSign,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { formatBDT } from '../../data/sampleContractsData';

interface ContractTimelineProps {
  contract: Contract;
  className?: string;
  onWorkOrderClick?: (workOrderId: string) => void;
}

export const ContractTimeline: React.FC<ContractTimelineProps> = ({
  contract,
  className = '',
  onWorkOrderClick,
}) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'services' | 'payments'>('all');

  const services = contract.serviceHistory || [];
  const payments = contract.paymentMilestones || [];

  // Merge items into a unified timeline sorted by date descending
  type TimelineItem =
    | { type: 'service'; date: string; data: ContractServiceRecord }
    | { type: 'payment'; date: string; data: ContractPaymentMilestone }
    | { type: 'milestone'; date: string; title: string; desc: string };

  const timelineItems: TimelineItem[] = [
    // Contract Start Milestone
    {
      type: 'milestone',
      date: typeof contract.startDate === 'string' ? contract.startDate : new Date(contract.startDate).toISOString(),
      title: 'Agreement Commenced',
      desc: `Service contract signed and activated with ${contract.customerName}. Value: ${formatBDT(contract.value)}.`,
    },
    ...services.map((s) => ({
      type: 'service' as const,
      date: typeof s.serviceDate === 'string' ? s.serviceDate : new Date(s.serviceDate).toISOString(),
      data: s,
    })),
    ...payments.map((p) => ({
      type: 'payment' as const,
      date: typeof p.dueDate === 'string' ? p.dueDate : new Date(p.dueDate).toISOString(),
      data: p,
    })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const filteredItems = timelineItems.filter((item) => {
    if (activeFilter === 'services') return item.type === 'service';
    if (activeFilter === 'payments') return item.type === 'payment';
    return true;
  });

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Top Filter Buttons */}
      <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-slate-200 dark:border-slate-800">
        <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Clock className="w-4 h-4 text-blue-500" />
          Contract Activity Timeline & Milestones
        </h4>

        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg text-xs">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-2.5 py-1 rounded font-medium transition-colors ${
              activeFilter === 'all'
                ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            All Activity ({timelineItems.length})
          </button>
          <button
            onClick={() => setActiveFilter('services')}
            className={`px-2.5 py-1 rounded font-medium transition-colors ${
              activeFilter === 'services'
                ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Services ({services.length})
          </button>
          <button
            onClick={() => setActiveFilter('payments')}
            className={`px-2.5 py-1 rounded font-medium transition-colors ${
              activeFilter === 'payments'
                ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Invoices & Payments ({payments.length})
          </button>
        </div>
      </div>

      {/* Timeline Stream */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-8 text-slate-500 text-xs bg-slate-50 dark:bg-slate-800/30 rounded-xl border border-dashed border-slate-200 dark:border-slate-800">
          No records found for the selected filter.
        </div>
      ) : (
        <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
          {filteredItems.map((item, idx) => {
            const formattedDate = new Date(item.date).toLocaleDateString('en-GB', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            });

            if (item.type === 'service') {
              const rec = item.data;
              return (
                <div key={idx} className="relative group">
                  <div
                    className={`absolute -left-6 top-1 w-5 h-5 rounded-full border-2 bg-white dark:bg-slate-900 flex items-center justify-center ${
                      rec.slaMet ? 'border-emerald-500 text-emerald-500' : 'border-rose-500 text-rose-500'
                    }`}
                  >
                    <Wrench className="w-2.5 h-2.5" />
                  </div>

                  <div className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs hover:border-blue-300 dark:hover:border-blue-700 transition-colors">
                    <div className="flex items-center justify-between gap-2 flex-wrap text-xs mb-1">
                      <div className="flex items-center gap-2">
                        <span
                          onClick={() => onWorkOrderClick?.(rec.workOrderId)}
                          className="font-mono font-bold text-blue-600 dark:text-blue-400 cursor-pointer hover:underline"
                        >
                          {rec.workOrderId}
                        </span>
                        <span className="font-semibold text-slate-900 dark:text-white">
                          {rec.serviceTitle}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400">{formattedDate}</span>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-slate-600 dark:text-slate-400 mt-2 flex-wrap">
                      <span>Tech: <strong className="text-slate-800 dark:text-slate-200">{rec.technicianName}</strong></span>
                      <span>Response: <strong>{rec.responseTimeMinutes}m</strong></span>
                      <span>Resolution: <strong>{rec.resolutionTimeMinutes}m</strong></span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        rec.slaMet
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                      }`}>
                        {rec.slaMet ? '✓ SLA Met' : '⚠ SLA Breached'}
                      </span>
                      {rec.costBDT > 0 && (
                        <span className="text-slate-700 dark:text-slate-300 font-medium">
                          Spares: {formatBDT(rec.costBDT)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            }

            if (item.type === 'payment') {
              const pay = item.data;
              const isPaid = pay.status === 'PAID';
              return (
                <div key={idx} className="relative group">
                  <div
                    className={`absolute -left-6 top-1 w-5 h-5 rounded-full border-2 bg-white dark:bg-slate-900 flex items-center justify-center ${
                      isPaid ? 'border-blue-500 text-blue-500' : 'border-amber-500 text-amber-500'
                    }`}
                  >
                    <CreditCard className="w-2.5 h-2.5" />
                  </div>

                  <div className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
                    <div className="flex items-center justify-between gap-2 flex-wrap text-xs mb-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                          {pay.invoiceNumber}
                        </span>
                        <span className="font-bold text-slate-900 dark:text-white">
                          {formatBDT(pay.amountBDT)}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400">Due: {formattedDate}</span>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-slate-600 dark:text-slate-400 mt-2 flex-wrap">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          isPaid
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                        }`}
                      >
                        {pay.status}
                      </span>
                      {pay.paymentMethod && <span>Method: {pay.paymentMethod}</span>}
                      {pay.trxId && <span className="font-mono text-[11px]">Trx: {pay.trxId}</span>}
                    </div>
                  </div>
                </div>
              );
            }

            // Milestone
            return (
              <div key={idx} className="relative group">
                <div className="absolute -left-6 top-1 w-5 h-5 rounded-full border-2 border-slate-400 bg-white dark:bg-slate-900 flex items-center justify-center text-slate-500">
                  <FileCheck className="w-2.5 h-2.5" />
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-xs">
                  <div className="flex items-center justify-between">
                    <strong className="text-slate-900 dark:text-white">{item.title}</strong>
                    <span className="text-[11px] text-slate-400">{formattedDate}</span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 mt-1">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
