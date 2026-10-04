import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { WorkOrder, WorkOrderStatus, Technician, PaymentReceipt, WorkOrderPriority } from '../../../types/fsm';
import { Language } from '../../../lib/i18n';
import { cardVariants, priorityConfig } from './styles';
import { CardHeader } from './components/CardHeader';
import { CardJobDetails } from './components/CardJobDetails';
import { CardLocation } from './components/CardLocation';
import { CardCustomer } from './components/CardCustomer';
import { CardTags } from './components/CardTags';
import { CardTechnician } from './components/CardTechnician';
import { CardFooter } from './components/CardFooter';
import { ExpandedCardModal } from './ExpandedCardModal';
import { AssignTechnicianModal } from './AssignTechnicianModal';

export interface WorkOrderCardProps {
  workOrder: WorkOrder;
  technicians: Technician[];
  lang: Language;
  isSelected?: boolean;
  isDragging?: boolean;
  onSelect?: (wo: WorkOrder) => void;
  onUpdateStatus: (woId: string, status: WorkOrderStatus, techId?: string, techName?: string) => void;
  onAssignTechnician: (woId: string, techId: string, techName: string) => void;
  onAutoDispatch?: (wo: WorkOrder) => void;
  onOpenPaymentModal?: (wo: WorkOrder) => void;
  onTriggerCelebration?: () => void;
  onDragStart?: (e: React.DragEvent<HTMLDivElement>, wo: WorkOrder) => void;
  onDragEnd?: () => void;
}

export const WorkOrderCard: React.FC<WorkOrderCardProps> = ({
  workOrder,
  technicians,
  lang,
  isSelected = false,
  isDragging = false,
  onSelect,
  onUpdateStatus,
  onAssignTechnician,
  onAutoDispatch,
  onOpenPaymentModal,
  onTriggerCelebration,
  onDragStart,
  onDragEnd,
}) => {
  const [isExpandedModalOpen, setIsExpandedModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(Date.now());
  const [isDispatching, setIsDispatching] = useState(false);

  // Update SLA ticker
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(Date.now()), 10000);
    return () => clearInterval(timer);
  }, []);

  // SLA Calculation
  const deadline = new Date(workOrder.slaDeadline).getTime();
  const created = new Date(workOrder.createdAt).getTime();
  const totalDuration = Math.max(deadline - created, 1);
  const remainingMs = deadline - currentTime;
  const remainingMins = Math.round(remainingMs / (1000 * 60));
  const isBreached = remainingMs <= 0 && workOrder.status !== 'COMPLETED';
  const progressPercent = Math.max(0, Math.min(100, Math.round((remainingMs / totalDuration) * 100)));

  // Priority Settings
  const config = priorityConfig[workOrder.priority] || priorityConfig.MEDIUM;
  const assignedTech = technicians.find((t) => t.id === workOrder.assignedTechnicianId);

  // Handle Action Dropdown Selection
  const handleActionSelect = (actionKey: string) => {
    if (actionKey === 'payment') {
      onOpenPaymentModal?.(workOrder);
    } else if (actionKey === 'ai-dispatch') {
      setIsDispatching(true);
      onAutoDispatch?.(workOrder);
      setTimeout(() => setIsDispatching(false), 500);
    } else if (actionKey === 'assign') {
      setIsAssignModalOpen(true);
    } else if (actionKey === 'details') {
      setIsExpandedModalOpen(true);
    } else if (actionKey === 'complete') {
      onUpdateStatus(workOrder.id, 'COMPLETED');
      onTriggerCelebration?.();
    }
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setIsExpandedModalOpen(true);
    }
  };

  return (
    <>
      <motion.div
        layout
        variants={cardVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        whileHover="hover"
        role="article"
        tabIndex={0}
        aria-label={`Work Order ${workOrder.id}: ${workOrder.title}, Priority ${workOrder.priority}`}
        onKeyDown={handleKeyDown}
        onClick={() => onSelect?.(workOrder)}
        onDoubleClick={() => setIsExpandedModalOpen(true)}
        draggable={true}
        onDragStart={(e) => onDragStart?.(e as any, workOrder)}
        onDragEnd={onDragEnd}
        style={{
          borderLeftColor: config.color,
          borderLeftWidth: '5px',
        }}
        className={`group relative select-none rounded-2xl border transition-all duration-200 cursor-grab active:cursor-grabbing font-sans overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
          isDragging
            ? 'opacity-40 border-dashed border-indigo-400 ring-2 ring-indigo-400/40 rotate-1 scale-95'
            : isBreached
            ? 'bg-red-50/20 dark:bg-red-950/20 border-red-300 dark:border-red-900 shadow-md ring-1 ring-red-200 dark:ring-red-900/50 animate-pulse-glow'
            : isSelected
            ? 'bg-indigo-50/30 dark:bg-indigo-950/30 border-indigo-400 dark:border-indigo-600 shadow-md ring-2 ring-indigo-400/30'
            : 'bg-white dark:bg-slate-900 border-slate-200/90 dark:border-slate-800 shadow-2xs hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-lg'
        }`}
      >
        {/* 1. Header: Drag Handle, Work Order ID, SLA Progress & Quick Actions */}
        <CardHeader
          workOrderId={workOrder.id}
          priority={workOrder.priority}
          remainingMinutes={remainingMins}
          progressPercent={progressPercent}
          isBreached={isBreached}
          lang={lang}
          onSelectAction={handleActionSelect}
        />

        {/* 2. Main Body: Title, Location, Customer, Tags & Assigned Tech */}
        <div className="p-3.5 space-y-2.5">
          {/* Job Details */}
          <CardJobDetails title={workOrder.title} siteName={workOrder.siteName} />

          {/* Customer & Bangladesh Landmark */}
          <div className="space-y-1">
            <CardCustomer customerName={workOrder.customerName} />
            <CardLocation
              landmark={workOrder.locationPoint?.landmark}
              address={workOrder.locationPoint?.address}
            />
          </div>

          {/* Skills Badges & Payment Badge */}
          <CardTags
            skills={workOrder.requiredSkills}
            paymentStatus={workOrder.paymentStatus}
            partsRequiredCount={workOrder.requiredParts?.length || 0}
          />

          {/* Assigned Technician & Quick Assign Actions */}
          <CardTechnician
            assignedTechnician={assignedTech}
            distance="2.3 km"
            onOpenAssignModal={() => setIsAssignModalOpen(true)}
            onAutoDispatch={() => {
              setIsDispatching(true);
              onAutoDispatch?.(workOrder);
              setTimeout(() => setIsDispatching(false), 500);
            }}
            isDispatching={isDispatching}
          />
        </div>

        {/* 3. Footer: BDT Amount & Created Timestamp */}
        <CardFooter
          amountBDT={workOrder.pricingEstimatedBDT || 5000}
          createdAt={workOrder.createdAt}
          lang={lang}
        />
      </motion.div>

      {/* Full Details Modal on Click */}
      <ExpandedCardModal
        workOrder={workOrder}
        technicians={technicians}
        lang={lang}
        isOpen={isExpandedModalOpen}
        onClose={() => setIsExpandedModalOpen(false)}
        onOpenPaymentModal={onOpenPaymentModal}
        onAssignTechnician={onAssignTechnician}
      />

      {/* Quick Assign Technician Modal */}
      <AssignTechnicianModal
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        technicians={technicians}
        workOrderTitle={workOrder.title}
        onAssign={(techId, techName) => {
          onAssignTechnician(workOrder.id, techId, techName);
          setIsAssignModalOpen(false);
        }}
      />
    </>
  );
};
