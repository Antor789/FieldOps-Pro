import React, { useState } from 'react';
import { Contract, ContractPaymentMilestone } from '../../types/contracts';
import {
  ArrowLeft,
  FileText,
  Building2,
  Calendar,
  CreditCard,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Download,
  RefreshCw,
  XCircle,
  PenTool,
  Clock,
  Printer,
  Wrench,
  Package,
  MapPin,
  Users,
  ShieldAlert,
  Zap,
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { SLATermsBuilder } from '../../components/contracts/SLATermsBuilder';
import { ContractTimeline } from '../../components/contracts/ContractTimeline';
import { ContractPDFModal } from '../../components/contracts/ContractPDFModal';
import { formatBDT, formatBDTLakh } from '../../data/sampleContractsData';

interface ContractDetailProps {
  contract: Contract;
  onBack: () => void;
  onRenew: (contract: Contract) => void;
  onTerminate: (contractId: string) => void;
  onWorkOrderClick?: (workOrderId: string) => void;
}

export const ContractDetail: React.FC<ContractDetailProps> = ({
  contract,
  onBack,
  onRenew,
  onTerminate,
  onWorkOrderClick,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'sla' | 'timeline' | 'billing'>('overview');
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [showTerminateConfirm, setShowTerminateConfirm] = useState(false);

  const now = new Date();
  const endDate = new Date(contract.endDate);
  const daysLeft = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  return (
    <div className="space-y-6">
      {/* 1. Top Navigation Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={onBack} className="p-2">
            <ArrowLeft className="w-5 h-5 text-slate-500" />
          </Button>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950 px-2 py-0.5 rounded border border-blue-200 dark:border-blue-900">
                {contract.contractNumber}
              </span>
              <span className="text-xs font-bold px-2 py-0.5 rounded uppercase bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                {contract.type.toUpperCase()}
              </span>
              <span
                className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                  contract.status === 'active'
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                    : contract.status === 'expiring_soon'
                    ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                    : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                }`}
              >
                {contract.status.toUpperCase()}
              </span>
            </div>

            <h1 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mt-1">
              {contract.title}
            </h1>
            {contract.titleBangla && (
              <p className="text-xs text-slate-500">{contract.titleBangla}</p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsPdfModalOpen(true)}
            className="text-xs flex items-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5 text-blue-500" />
            Print / PDF Deed
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => onRenew(contract)}
            className="text-xs flex items-center gap-1.5 bg-amber-600 hover:bg-amber-700 text-white"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Renew Agreement
          </Button>

          {contract.status === 'active' && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowTerminateConfirm(true)}
              className="text-xs text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40"
            >
              <XCircle className="w-3.5 h-3.5 mr-1" />
              Terminate
            </Button>
          )}
        </div>
      </div>

      {/* 2. Highlights Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 text-xs shadow-xs">
        <div>
          <span className="text-slate-400 block text-[11px]">Client / Enterprise</span>
          <strong className="text-slate-900 dark:text-white text-sm block truncate">
            {contract.customerName}
          </strong>
          <span className="text-slate-500">{contract.customerContactPerson}</span>
        </div>

        <div>
          <span className="text-slate-400 block text-[11px]">Contract Consideration</span>
          <strong className="text-slate-900 dark:text-white text-sm block">
            {formatBDT(contract.value)}
          </strong>
          <span className="text-slate-500 capitalize">{contract.paymentTerms} payment cycle</span>
        </div>

        <div>
          <span className="text-slate-400 block text-[11px]">Validity Period</span>
          <strong className="text-slate-900 dark:text-white text-sm block">
            {new Date(contract.endDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
          </strong>
          <span className={daysLeft <= 30 ? 'text-amber-600 font-bold' : 'text-slate-500'}>
            {daysLeft > 0 ? `${daysLeft} days remaining` : 'Expired'}
          </span>
        </div>

        <div>
          <span className="text-slate-400 block text-[11px]">SLA Compliance</span>
          <strong className="text-emerald-600 dark:text-emerald-400 text-sm block flex items-center gap-1">
            <ShieldCheck className="w-4 h-4" />
            {contract.slaCompliancePercent ?? 99}% Achieved
          </strong>
          <span className="text-slate-500">Auto-renew: {contract.autoRenew ? 'Enabled' : 'Disabled'}</span>
        </div>
      </div>

      {/* 3. Detail Tabs Bar */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 text-xs overflow-x-auto">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2.5 font-bold border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'overview'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          Agreement Overview & Equipment
        </button>
        <button
          onClick={() => setActiveTab('sla')}
          className={`px-4 py-2.5 font-bold border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'sla'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          SLA Commitments & Response Times
        </button>
        <button
          onClick={() => setActiveTab('timeline')}
          className={`px-4 py-2.5 font-bold border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'timeline'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          Service Execution Timeline ({contract.serviceHistory?.length || 0})
        </button>
        <button
          onClick={() => setActiveTab('billing')}
          className={`px-4 py-2.5 font-bold border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'billing'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          Billing & Invoicing Milestones ({contract.paymentMilestones?.length || 0})
        </button>
      </div>

      {/* 4. Tab Contents */}

      {/* Tab 1: Overview */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Scope, Equipment, Locations */}
          <div className="lg:col-span-2 space-y-6">
            {/* Scope of Work */}
            <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-600" />
                Service Scope & Deliverables
              </h3>
              <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
                {contract.scopeOfWork.map((item, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Covered Equipment */}
            <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Package className="w-4 h-4 text-emerald-600" />
                Covered Machinery & Assets ({contract.coveredEquipment?.length || 0})
              </h3>

              {(!contract.coveredEquipment || contract.coveredEquipment.length === 0) ? (
                <p className="text-xs text-slate-400">All customer facility equipment covered under blanket SLA.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase text-[10px]">
                      <tr>
                        <th className="py-2 px-3">Equipment Name</th>
                        <th className="py-2 px-3">Category</th>
                        <th className="py-2 px-3">Serial #</th>
                        <th className="py-2 px-3">Facility Location</th>
                        <th className="py-2 px-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {contract.coveredEquipment.map((eq) => (
                        <tr key={eq.id}>
                          <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-white">{eq.name}</td>
                          <td className="py-2.5 px-3 text-slate-600 dark:text-slate-400">{eq.category}</td>
                          <td className="py-2.5 px-3 font-mono text-slate-500">{eq.serialNumber || 'N/A'}</td>
                          <td className="py-2.5 px-3 text-slate-600 dark:text-slate-400">{eq.location}</td>
                          <td className="py-2.5 px-3">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                              {eq.warrantyStatus}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Covered Locations */}
            <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <MapPin className="w-4 h-4 text-rose-500" />
                Covered Facilities & Service Sites
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {contract.coveredLocations.map((loc, idx) => (
                  <div key={idx} className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-slate-400 shrink-0" />
                    <span className="text-slate-800 dark:text-slate-200 font-medium">{loc}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Customer Info, Assigned Techs, Digital Signature */}
          <div className="space-y-6">
            {/* Customer Details */}
            <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3 text-xs">
              <h4 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                <Building2 className="w-4 h-4 text-blue-600" />
                Customer Enterprise Information
              </h4>
              <div className="space-y-2 divide-y divide-slate-100 dark:divide-slate-800">
                <div className="pt-1">
                  <span className="text-slate-400 text-[11px] block">Company Name</span>
                  <span className="font-bold text-slate-900 dark:text-white">{contract.customerName}</span>
                </div>
                <div className="pt-2">
                  <span className="text-slate-400 text-[11px] block">Primary POC</span>
                  <span className="text-slate-800 dark:text-slate-200">{contract.customerContactPerson}</span>
                  {contract.customerPhone && (
                    <span className="block text-slate-500">{contract.customerPhone}</span>
                  )}
                  {contract.customerEmail && (
                    <span className="block text-slate-500">{contract.customerEmail}</span>
                  )}
                </div>
                <div className="pt-2">
                  <span className="text-slate-400 text-[11px] block">NBR VAT BIN</span>
                  <span className="font-mono text-slate-800 dark:text-slate-200">{contract.customerBin || '002938102-0101'}</span>
                </div>
                <div className="pt-2">
                  <span className="text-slate-400 text-[11px] block">Billing / Site Address</span>
                  <span className="text-slate-600 dark:text-slate-400">{contract.customerAddress || 'Dhaka, Bangladesh'}</span>
                </div>
              </div>
            </div>

            {/* Assigned Technicians */}
            <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3 text-xs">
              <h4 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                <Users className="w-4 h-4 text-purple-600" />
                Dedicated Field Engineers
              </h4>
              <div className="space-y-2">
                {contract.assignedTechnicians.map((tech, idx) => (
                  <div key={idx} className="flex items-center gap-2 p-2 bg-slate-50 dark:bg-slate-800/40 rounded-lg">
                    <div className="w-7 h-7 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center font-bold text-purple-700 dark:text-purple-300 text-xs">
                      {tech[0]}
                    </div>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{tech}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Digital Signature Card */}
            <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3 text-xs">
              <h4 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                <PenTool className="w-4 h-4 text-emerald-600" />
                Legally Binding Signature
              </h4>

              <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-800">
                {contract.signature ? (
                  <img
                    src={contract.signature}
                    alt="Digital Signature"
                    className="max-h-16 object-contain mx-auto"
                  />
                ) : (
                  <div className="text-center py-3 font-serif italic text-lg text-blue-900 dark:text-blue-300">
                    {contract.signedBy || 'Fahim Rahman'}
                  </div>
                )}
                <div className="mt-2 pt-2 border-t border-slate-200 dark:border-slate-700 text-center">
                  <span className="font-bold text-slate-800 dark:text-slate-200 block">
                    {contract.signedBy || 'Fahim Rahman'}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Signed: {contract.signedAt ? String(contract.signedAt).slice(0, 10) : '2025-04-01'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: SLA Commitments */}
      {activeTab === 'sla' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
            <SLATermsBuilder
              terms={contract.slaTerms}
              onChange={() => {}}
              readOnly={true}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 text-xs">
              <span className="font-bold text-blue-900 dark:text-blue-200 block mb-1">
                Guaranteed Resolution Time
              </span>
              <p className="text-blue-800/80 dark:text-blue-300/80">
                Emergency priority incidents trigger an automated escalation to the lead technical supervisor within 15 minutes of logging.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 text-xs">
              <span className="font-bold text-emerald-900 dark:text-emerald-200 block mb-1">
                Uptime Target: {contract.slaCompliancePercent || 99}%
              </span>
              <p className="text-emerald-800/80 dark:text-emerald-300/80">
                Performance is evaluated on a rolling 30-day window based on IoT sensors and field service ticket completion stamps.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 text-xs">
              <span className="font-bold text-rose-900 dark:text-rose-200 block mb-1">
                Liquidated Damages
              </span>
              <p className="text-rose-800/80 dark:text-rose-300/80">
                Unresolved SLA breaches deduct agreed penalty amounts from subsequent quarterly advance invoices automatically.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Service Execution Timeline */}
      {activeTab === 'timeline' && (
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <ContractTimeline
            contract={contract}
            onWorkOrderClick={onWorkOrderClick}
          />
        </div>
      )}

      {/* Tab 4: Billing & Payments */}
      {activeTab === 'billing' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Payment Milestones & Invoices (চালান ও বিলিং)
                </h3>
                <p className="text-xs text-slate-500">
                  Total Value: {formatBDT(contract.value)} • NBR VAT 15% Mushak-6.3 Applicable
                </p>
              </div>
            </div>

            {(!contract.paymentMilestones || contract.paymentMilestones.length === 0) ? (
              <p className="text-xs text-slate-400 py-6 text-center">No payment milestones generated for this contract yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-800/70 border-b border-slate-200 dark:border-slate-800 text-slate-500 uppercase text-[10px]">
                    <tr>
                      <th className="py-2.5 px-3">Invoice #</th>
                      <th className="py-2.5 px-3">Due Date</th>
                      <th className="py-2.5 px-3 text-right">Amount (BDT)</th>
                      <th className="py-2.5 px-3">Status</th>
                      <th className="py-2.5 px-3">Settlement Date</th>
                      <th className="py-2.5 px-3">Payment Method & Trx</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {contract.paymentMilestones.map((pm) => (
                      <tr key={pm.id}>
                        <td className="py-3 px-3 font-mono font-bold text-blue-600 dark:text-blue-400">
                          {pm.invoiceNumber}
                        </td>
                        <td className="py-3 px-3 text-slate-700 dark:text-slate-300">
                          {new Date(pm.dueDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </td>
                        <td className="py-3 px-3 text-right font-bold text-slate-900 dark:text-white">
                          {formatBDT(pm.amountBDT)}
                        </td>
                        <td className="py-3 px-3">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              pm.status === 'PAID'
                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                            }`}
                          >
                            {pm.status}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-slate-500">
                          {pm.paidDate ? new Date(pm.paidDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                        </td>
                        <td className="py-3 px-3 text-slate-600 dark:text-slate-400">
                          {pm.paymentMethod || 'Bank Wire'}
                          {pm.trxId && <span className="block font-mono text-[10px] text-slate-400">Ref: {pm.trxId}</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Official Deed PDF Modal */}
      <ContractPDFModal
        contract={contract}
        isOpen={isPdfModalOpen}
        onClose={() => setIsPdfModalOpen(false)}
      />

      {/* Termination Modal */}
      {showTerminateConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
            <div className="w-12 h-12 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Terminate Contract {contract.contractNumber}?
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Terminating this service agreement will stop all automated recurring maintenance schedules and notify <strong>{contract.customerName}</strong>. This action will be recorded in the audit log.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <Button variant="outline" size="sm" onClick={() => setShowTerminateConfirm(false)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  onTerminate(contract.id);
                  setShowTerminateConfirm(false);
                }}
                className="bg-rose-600 hover:bg-rose-700 text-white"
              >
                Yes, Terminate Agreement
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
