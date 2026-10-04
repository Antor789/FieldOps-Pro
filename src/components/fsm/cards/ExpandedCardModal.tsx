import React from 'react';
import { WorkOrder, Technician } from '../../../types/fsm';
import { Modal } from '../../ui/Modal';
import { Button } from '../../ui/Button';
import { Badge, PriorityBadge } from '../../ui/Badge';
import { Language, formatBDT, formatDhakaTime } from '../../../lib/i18n';
import {
  Building,
  MapPin,
  Clock,
  Banknote,
  Wrench,
  User,
  Phone,
  ShieldCheck,
  CheckCircle2,
  FileText,
  Package,
  Calendar,
  Sparkles,
} from 'lucide-react';

interface ExpandedCardModalProps {
  workOrder: WorkOrder | null;
  technicians: Technician[];
  lang: Language;
  isOpen: boolean;
  onClose: () => void;
  onOpenPaymentModal?: (wo: WorkOrder) => void;
  onAssignTechnician?: (woId: string, techId: string, techName: string) => void;
  onAdvanceStatus?: (woId: string, status: any) => void;
}

export const ExpandedCardModal: React.FC<ExpandedCardModalProps> = ({
  workOrder,
  technicians,
  lang,
  isOpen,
  onClose,
  onOpenPaymentModal,
  onAssignTechnician,
  onAdvanceStatus,
}) => {
  if (!workOrder) return null;

  const assignedTech = technicians.find((t) => t.id === workOrder.assignedTechnicianId);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="xl"
      title={
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white font-bold flex items-center justify-center text-xs">
            WO
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm text-slate-900 dark:text-slate-100 font-mono">
                {workOrder.id}
              </span>
              <PriorityBadge priority={workOrder.priority} lang={lang} />
              <Badge variant="primary" size="xs">
                {workOrder.status}
              </Badge>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
              {workOrder.siteName}
            </p>
          </div>
        </div>
      }
      footer={
        <div className="flex items-center justify-between w-full">
          <div className="text-xs font-mono font-extrabold text-emerald-600 dark:text-emerald-400">
            {formatBDT(workOrder.pricingEstimatedBDT || 5000, lang)}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                onClose();
                onOpenPaymentModal?.(workOrder);
              }}
              leftIcon={<Banknote className="w-3.5 h-3.5" />}
            >
              Collect Payment
            </Button>
            <Button variant="primary" size="sm" onClick={onClose}>
              Done
            </Button>
          </div>
        </div>
      }
    >
      <div className="space-y-4 font-sans text-xs">
        {/* Title & Description */}
        <div className="space-y-1">
          <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100 leading-snug">
            {workOrder.title}
          </h3>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
            {workOrder.description || 'Standard enterprise field service dispatch order.'}
          </p>
        </div>

        {/* 2-Column Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Customer Card */}
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
            <div className="text-[10px] font-bold uppercase text-slate-400 dark:text-slate-500 font-mono">
              Customer & Contact
            </div>
            <div className="font-bold text-slate-800 dark:text-slate-200 flex items-center space-x-1.5">
              <Building className="w-3.5 h-3.5 text-slate-400" />
              <span>{workOrder.customerName}</span>
            </div>
            <div className="text-slate-600 dark:text-slate-400 flex items-center space-x-1.5 font-mono text-[11px]">
              <Phone className="w-3.5 h-3.5 text-indigo-500" />
              <span>{workOrder.customerPhoneBd || '+880 1711-001122'}</span>
            </div>
          </div>

          {/* Location & Landmark */}
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
            <div className="text-[10px] font-bold uppercase text-slate-400 dark:text-slate-500 font-mono">
              Bangladesh Landmark Geocoding
            </div>
            <div className="text-slate-800 dark:text-slate-200 flex items-center space-x-1.5">
              <MapPin className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
              <span>{workOrder.locationPoint?.landmark || workOrder.locationPoint?.address || 'Gulshan 2, Dhaka'}</span>
            </div>
            <div className="text-slate-500 dark:text-slate-400 font-mono text-[11px]">
              Coordinates: {workOrder.locationPoint?.latitude.toFixed(4)}° N, {workOrder.locationPoint?.longitude.toFixed(4)}° E
            </div>
          </div>
        </div>

        {/* Assigned Technician Card */}
        <div className="p-3.5 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/80 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white font-extrabold flex items-center justify-center text-sm shadow-xs">
              {assignedTech ? `${assignedTech.firstName[0]}${assignedTech.lastName[0]}` : '?'}
            </div>
            <div>
              <div className="font-bold text-slate-900 dark:text-slate-100">
                {assignedTech ? `${assignedTech.firstName} ${assignedTech.lastName}` : 'Unassigned (In Queue)'}
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                {assignedTech ? `${assignedTech.vehicleType} • ${assignedTech.phone}` : 'Click assign to dispatch unit'}
              </div>
            </div>
          </div>

          {assignedTech && (
            <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-mono font-bold px-2 py-0.5 rounded-md">
              {assignedTech.dutyStatus}
            </span>
          )}
        </div>

        {/* Safety & Checklist */}
        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
          <div className="text-[10px] font-bold uppercase text-slate-400 dark:text-slate-500 font-mono">
            Safety & Pre-Job Checklist
          </div>
          <div className="space-y-1 text-slate-600 dark:text-slate-400">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span>Personal Protective Equipment (PPE) Verified</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span>High Voltage Lockout-Tagout (LOTO) Compliance</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span>Digital Customer Signature Required upon Completion</span>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};
