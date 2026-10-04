import React, { useState, useEffect } from 'react';
import { WorkOrder, WorkOrderStatus, Technician, PaymentReceipt, WorkOrderPriority } from '../../types/fsm';
import { Language, translations, formatBDT } from '../../lib/i18n';
import { executeAutoDispatchEngine } from '../../lib/AutoDispatchEngine';
import { PaymentReceiptModal } from './PaymentReceiptModal';
import { WorkOrderCard } from './cards';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { EmptyState } from '../ui/EmptyState';
import { useToast } from '../../context/ToastContext';
import { AnimatePresence, motion } from 'motion/react';
import {
  Cpu,
  Search,
  Filter,
  ArrowUpDown,
  Sparkles,
  CheckCircle2,
  Banknote,
  Send,
} from 'lucide-react';

interface WorkOrderKanbanProps {
  workOrders: WorkOrder[];
  technicians: Technician[];
  lang: Language;
  onUpdateStatus: (woId: string, status: WorkOrderStatus, techId?: string, techName?: string) => void;
  onAssignTechnician: (woId: string, techId: string, techName: string) => void;
  onSelectWorkOrder: (wo: WorkOrder) => void;
  onPaymentSuccess?: (woId: string, receipt: PaymentReceipt) => void;
  onTriggerCelebration?: () => void;
}

export const WorkOrderKanban: React.FC<WorkOrderKanbanProps> = ({
  workOrders,
  technicians,
  lang,
  onUpdateStatus,
  onAssignTechnician,
  onSelectWorkOrder,
  onPaymentSuccess,
  onTriggerCelebration,
}) => {
  const t = translations[lang];
  const { addToast } = useToast();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPriority, setSelectedPriority] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'sla' | 'priority' | 'price'>('sla');
  const [dispatchingWoId, setDispatchingWoId] = useState<string | null>(null);
  const [autoDispatchResult, setAutoDispatchResult] = useState<any | null>(null);

  // Drag and Drop States
  const [draggedWoId, setDraggedWoId] = useState<string | null>(null);
  const [dragOverColumnId, setDragOverColumnId] = useState<WorkOrderStatus | null>(null);

  // Payment Modal Target
  const [paymentWoTarget, setPaymentWoTarget] = useState<WorkOrder | null>(null);

  // 5 Standardized Columns
  const KANBAN_COLUMNS: {
    id: WorkOrderStatus;
    titleEn: string;
    titleBn: string;
    badgeVariant: 'danger' | 'primary' | 'info' | 'warning' | 'success';
    dotColor: string;
  }[] = [
    {
      id: 'PENDING',
      titleEn: 'Unassigned Queue',
      titleBn: 'অপেক্ষমান',
      badgeVariant: 'danger',
      dotColor: 'bg-red-500',
    },
    {
      id: 'ASSIGNED',
      titleEn: 'Assigned / Scheduled',
      titleBn: 'বরাদ্দকৃত',
      badgeVariant: 'primary',
      dotColor: 'bg-indigo-600',
    },
    {
      id: 'EN_ROUTE',
      titleEn: 'En Route (GPS)',
      titleBn: 'চলমান (GPS)',
      badgeVariant: 'info',
      dotColor: 'bg-blue-500',
    },
    {
      id: 'IN_PROGRESS',
      titleEn: 'In Progress (On-Site)',
      titleBn: 'কাজ চলছে',
      badgeVariant: 'warning',
      dotColor: 'bg-amber-500',
    },
    {
      id: 'COMPLETED',
      titleEn: 'Completed & Signed',
      titleBn: 'সম্পন্ন ও স্বাক্ষরিত',
      badgeVariant: 'success',
      dotColor: 'bg-emerald-500',
    },
  ];

  // Filter & Sort Work Orders
  const filteredWorkOrders = workOrders
    .filter((wo) => {
      const matchesSearch =
        wo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        wo.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        wo.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        wo.siteName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (wo.locationPoint.landmark &&
          wo.locationPoint.landmark.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesPriority = selectedPriority === 'ALL' || wo.priority === selectedPriority;
      return matchesSearch && matchesPriority;
    })
    .sort((a, b) => {
      if (sortBy === 'sla') {
        return new Date(a.slaDeadline).getTime() - new Date(b.slaDeadline).getTime();
      }
      if (sortBy === 'price') {
        return (b.pricingEstimatedBDT || 0) - (a.pricingEstimatedBDT || 0);
      }
      const priorityWeights: Record<WorkOrderPriority, number> = {
        EMERGENCY: 5,
        CRITICAL: 4,
        HIGH: 3,
        MEDIUM: 2,
        LOW: 1,
      };
      return priorityWeights[b.priority] - priorityWeights[a.priority];
    });

  // AI Auto-Dispatch Solver Trigger
  const handleAutoDispatchJob = (wo: WorkOrder) => {
    setDispatchingWoId(wo.id);

    const result = executeAutoDispatchEngine(
      {
        id: wo.id,
        tenantId: wo.tenantId,
        title: wo.title,
        location: { latitude: wo.locationPoint.latitude, longitude: wo.locationPoint.longitude },
        priority: wo.priority,
        requiredSkills: wo.requiredSkills,
        requiredParts: wo.requiredParts,
        slaDeadline: wo.slaDeadline,
        estimatedDurationMins: wo.estimatedDurationMins,
      },
      technicians.map((tech) => ({
        id: tech.id,
        tenantId: tech.tenantId,
        name: `${tech.firstName} ${tech.lastName}`,
        dutyStatus: tech.dutyStatus,
        location: { latitude: tech.locationPoint.latitude, longitude: tech.locationPoint.longitude },
        skills: tech.skills,
        vehicleParts: tech.vehicleParts,
        activeWorkOrderCount: tech.activeWorkOrderCount,
        maxCapacity: tech.maxCapacity,
        batteryLevel: tech.batteryLevel,
        remainingShiftHours: 8,
        vehicleType: tech.vehicleType,
      }))
    );

    setAutoDispatchResult(result);

    if (result.assignedTechnician) {
      setTimeout(() => {
        onAssignTechnician(
          wo.id,
          result.assignedTechnician.technicianId,
          result.assignedTechnician.technicianName
        );
        setDispatchingWoId(null);
        addToast({
          title: `AI Matched: ${result.assignedTechnician.technicianName}`,
          description: `Composite Score: ${result.assignedTechnician.compositeScore}/100 • Travel ETA: ${result.assignedTechnician.travelTimeMinutes}m`,
          type: 'ai',
        });
      }, 350);
    } else {
      setDispatchingWoId(null);
      addToast({
        title: 'No Available Unit',
        description: 'All field technicians are at capacity or out of range.',
        type: 'warning',
      });
    }
  };

  // Drag & Drop Handlers
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, wo: WorkOrder) => {
    e.dataTransfer.setData('text/plain', wo.id);
    e.dataTransfer.effectAllowed = 'move';
    setDraggedWoId(wo.id);
  };

  const handleDragEnd = () => {
    setDraggedWoId(null);
    setDragOverColumnId(null);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, colId: WorkOrderStatus) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverColumnId !== colId) {
      setDragOverColumnId(colId);
    }
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>, colId: WorkOrderStatus) => {
    e.preventDefault();
    if (dragOverColumnId === colId) {
      setDragOverColumnId(null);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetColId: WorkOrderStatus) => {
    e.preventDefault();
    const woId = e.dataTransfer.getData('text/plain') || draggedWoId;
    setDragOverColumnId(null);
    setDraggedWoId(null);

    if (!woId) return;

    const wo = workOrders.find((w) => w.id === woId);
    if (!wo) return;

    if (targetColId === 'COMPLETED') {
      onUpdateStatus(woId, targetColId);
      onTriggerCelebration?.();
      addToast({
        title: `Work Order #${woId} Completed`,
        description: 'Customer digital signature recorded & NBR VAT invoice generated.',
        type: 'success',
      });
      return;
    }

    if (targetColId === 'ASSIGNED' && !wo.assignedTechnicianId && technicians.length > 0) {
      const defaultTech = technicians.find((tech) => tech.dutyStatus === 'ONLINE') || technicians[0];
      onUpdateStatus(woId, targetColId, defaultTech.id, `${defaultTech.firstName} ${defaultTech.lastName}`);
      addToast({
        title: `Assigned to ${defaultTech.firstName}`,
        description: `Dispatched notification via Greenweb SMS.`,
        type: 'info',
      });
    } else {
      onUpdateStatus(woId, targetColId);
    }
  };

  return (
    <div className="space-y-4 font-sans text-slate-900 dark:text-slate-100">
      {/* Search & Filter Toolbar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-3 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-2.5 flex-1 min-w-[280px]">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400 dark:text-slate-500" />
            <input
              type="text"
              placeholder={t.searchPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
            />
          </div>

          {/* Priority Filter */}
          <div className="flex items-center space-x-1.5 bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 rounded-xl px-2.5 py-1 text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-500" />
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="bg-transparent text-slate-700 dark:text-slate-300 font-medium focus:outline-none cursor-pointer text-xs"
            >
              <option value="ALL" className="dark:bg-slate-900">{lang === 'bn' ? 'সকল অগ্রাধিকার' : 'All Priorities'}</option>
              <option value="EMERGENCY" className="dark:bg-slate-900">{lang === 'bn' ? 'জরুরী (৩০ মি:)' : 'Emergency'}</option>
              <option value="CRITICAL" className="dark:bg-slate-900">{lang === 'bn' ? 'গুরুত্বপূর্ণ (১ ঘণ্টা)' : 'Critical'}</option>
              <option value="HIGH" className="dark:bg-slate-900">{lang === 'bn' ? 'উচ্চ অগ্রাধিকার' : 'High Priority'}</option>
              <option value="MEDIUM" className="dark:bg-slate-900">{lang === 'bn' ? 'মাঝারি' : 'Medium Priority'}</option>
              <option value="LOW" className="dark:bg-slate-900">{lang === 'bn' ? 'সাধারণ' : 'Low Priority'}</option>
            </select>
          </div>

          {/* Sort By Dropdown */}
          <div className="hidden sm:flex items-center space-x-1.5 bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 rounded-xl px-2.5 py-1 text-xs">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-500" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent text-slate-700 dark:text-slate-300 font-medium focus:outline-none cursor-pointer text-xs"
            >
              <option value="sla" className="dark:bg-slate-900">Sort by SLA Deadline</option>
              <option value="priority" className="dark:bg-slate-900">Sort by Priority</option>
              <option value="price" className="dark:bg-slate-900">Sort by BDT Value</option>
            </select>
          </div>
        </div>

        {/* Right Status Counters */}
        <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center space-x-3 font-medium">
          <div className="flex items-center space-x-2 font-mono text-[11px]">
            <span>Total: <strong className="text-slate-900 dark:text-slate-100 font-bold">{workOrders.length}</strong></span>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <span>Unassigned: <strong className="text-red-600 dark:text-red-400 font-bold">{workOrders.filter((w) => w.status === 'PENDING').length}</strong></span>
          </div>
        </div>
      </div>

      {/* 5-Column Kanban Board with Redesigned WorkOrderCard */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3.5 items-start">
        {KANBAN_COLUMNS.map((col) => {
          const colWorkOrders = filteredWorkOrders.filter((w) => w.status === col.id);
          const isDragOver = dragOverColumnId === col.id;
          const title = lang === 'bn' ? col.titleBn : col.titleEn;

          return (
            <div
              key={col.id}
              onDragOver={(e) => handleDragOver(e, col.id)}
              onDragLeave={(e) => handleDragLeave(e, col.id)}
              onDrop={(e) => handleDrop(e, col.id)}
              className={`bg-slate-100/70 dark:bg-slate-950/60 border border-slate-200/90 dark:border-slate-800/80 rounded-2xl p-2.5 flex flex-col min-h-[640px] transition-all duration-200 ${
                isDragOver
                  ? 'bg-indigo-50/60 dark:bg-indigo-950/40 border-indigo-400 ring-2 ring-indigo-400/30'
                  : 'hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              {/* Column Header */}
              <div className="flex items-center justify-between px-2 py-1.5 mb-2.5 border-b border-slate-200/80 dark:border-slate-800/80">
                <div className="flex items-center space-x-2">
                  <div className={`w-2.5 h-2.5 rounded-full ${col.dotColor}`} />
                  <h3 className="font-bold text-xs text-slate-800 dark:text-slate-200 tracking-tight">
                    {title}
                  </h3>
                </div>

                <Badge variant={col.badgeVariant} size="xs">
                  {colWorkOrders.length}
                </Badge>
              </div>

              {/* Drag Target Cue */}
              {isDragOver && (
                <div className="mb-2.5 border-2 border-dashed border-indigo-500 bg-white/80 dark:bg-slate-900/80 rounded-xl p-3 text-center text-xs font-bold text-indigo-600 dark:text-indigo-400 animate-pulse">
                  + Drop Job Here
                </div>
              )}

              {/* Cards List using Redesigned WorkOrderCard */}
              <div className="space-y-2.5 flex-1 overflow-y-auto max-h-[720px] pr-0.5">
                <AnimatePresence>
                  {colWorkOrders.map((wo) => (
                    <WorkOrderCard
                      key={wo.id}
                      workOrder={wo}
                      technicians={technicians}
                      lang={lang}
                      isDragging={draggedWoId === wo.id}
                      onSelect={onSelectWorkOrder}
                      onUpdateStatus={onUpdateStatus}
                      onAssignTechnician={onAssignTechnician}
                      onAutoDispatch={handleAutoDispatchJob}
                      onOpenPaymentModal={(w) => setPaymentWoTarget(w)}
                      onTriggerCelebration={onTriggerCelebration}
                      onDragStart={handleDragStart}
                      onDragEnd={handleDragEnd}
                    />
                  ))}
                </AnimatePresence>

                {colWorkOrders.length === 0 && (
                  <EmptyState
                    compact={true}
                    title={`No jobs in ${title}`}
                    description="Drag work orders here or create a new job"
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Payment & NBR Receipt Modal Trigger */}
      {paymentWoTarget && (
        <PaymentReceiptModal
          workOrder={paymentWoTarget}
          lang={lang}
          onClose={() => setPaymentWoTarget(null)}
          onPaymentSuccess={(receipt) => {
            if (onPaymentSuccess) {
              onPaymentSuccess(paymentWoTarget.id, receipt);
              onTriggerCelebration?.();
              addToast({
                title: `Payment Collected: ${formatBDT(receipt.amountBDT, lang)}`,
                description: `Method: ${receipt.method} • NBR Tax Invoice Issued`,
                type: 'payment',
              });
            }
          }}
        />
      )}
    </div>
  );
};
