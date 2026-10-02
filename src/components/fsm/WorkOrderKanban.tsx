import React, { useState } from 'react';
import { WorkOrder, WorkOrderStatus, Technician, PaymentReceipt } from '../../types/fsm';
import { Language, translations, formatBDT } from '../../lib/i18n';
import { executeAutoDispatchEngine } from '../../lib/AutoDispatchEngine';
import { PaymentReceiptModal } from './PaymentReceiptModal';
import {
  Cpu,
  Search,
  GripVertical,
  MapPin,
  Building,
  Filter,
  ChevronRight,
  UserPlus,
  Sparkles,
  CheckCircle2,
  Receipt,
  MessageSquare,
  Phone,
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
  activeThemeId?: string;
}

export const WorkOrderKanban: React.FC<WorkOrderKanbanProps> = ({
  workOrders,
  technicians,
  lang,
  onUpdateStatus,
  onAssignTechnician,
  onSelectWorkOrder,
  onPaymentSuccess,
}) => {
  const t = translations[lang];

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPriority, setSelectedPriority] = useState<string>('ALL');
  const [dispatchingWoId, setDispatchingWoId] = useState<string | null>(null);
  const [autoDispatchResult, setAutoDispatchResult] = useState<any | null>(null);

  // Drag and Drop States
  const [draggedWoId, setDraggedWoId] = useState<string | null>(null);
  const [dragOverColumnId, setDragOverColumnId] = useState<WorkOrderStatus | null>(null);
  const [assigningWoId, setAssigningWoId] = useState<string | null>(null);

  // Payment Modal Target
  const [paymentWoTarget, setPaymentWoTarget] = useState<WorkOrder | null>(null);

  // 5 Localized Columns for Bangladesh Market
  const KANBAN_COLUMNS: {
    id: WorkOrderStatus;
    titleEn: string;
    titleBn: string;
    badgeBg: string;
    dotColor: string;
  }[] = [
    {
      id: 'PENDING',
      titleEn: 'Unassigned Queue',
      titleBn: 'অপেক্ষমান',
      badgeBg: 'bg-red-50 text-red-700 border border-red-200',
      dotColor: 'bg-red-500',
    },
    {
      id: 'ASSIGNED',
      titleEn: 'Assigned / Scheduled',
      titleBn: 'বরাদ্দকৃত',
      badgeBg: 'bg-indigo-50 text-indigo-700 border border-indigo-200',
      dotColor: 'bg-indigo-600',
    },
    {
      id: 'EN_ROUTE',
      titleEn: 'En Route (GPS)',
      titleBn: 'চলমান (GPS)',
      badgeBg: 'bg-blue-50 text-blue-700 border border-blue-200',
      dotColor: 'bg-blue-500',
    },
    {
      id: 'IN_PROGRESS',
      titleEn: 'In Progress (On-Site)',
      titleBn: 'কাজ চলছে',
      badgeBg: 'bg-amber-50 text-amber-700 border border-amber-200',
      dotColor: 'bg-amber-500',
    },
    {
      id: 'COMPLETED',
      titleEn: 'Completed & Signed',
      titleBn: 'সম্পন্ন ও স্বাক্ষরিত',
      badgeBg: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
      dotColor: 'bg-emerald-500',
    },
  ];

  // Filter Work Orders
  const filteredWorkOrders = workOrders.filter((wo) => {
    const matchesSearch =
      wo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      wo.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      wo.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      wo.siteName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (wo.locationPoint.landmark && wo.locationPoint.landmark.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesPriority = selectedPriority === 'ALL' || wo.priority === selectedPriority;
    return matchesSearch && matchesPriority;
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
        onAssignTechnician(wo.id, result.assignedTechnician.technicianId, result.assignedTechnician.technicianName);
        setDispatchingWoId(null);
      }, 500);
    } else {
      setDispatchingWoId(null);
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

    if (targetColId === 'ASSIGNED' && !wo.assignedTechnicianId && technicians.length > 0) {
      const defaultTech = technicians.find((tech) => tech.dutyStatus === 'ONLINE') || technicians[0];
      onUpdateStatus(woId, targetColId, defaultTech.id, `${defaultTech.firstName} ${defaultTech.lastName}`);
    } else {
      onUpdateStatus(woId, targetColId);
    }
  };

  return (
    <div className="space-y-4 font-sans text-slate-900">
      {/* Search & Filter Header Toolbar */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-3 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-3 flex-1 min-w-[280px]">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder={t.searchPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
            />
          </div>

          <div className="flex items-center space-x-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1 text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-500" />
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="bg-transparent text-slate-700 font-medium focus:outline-none cursor-pointer"
            >
              <option value="ALL">{lang === 'bn' ? 'সকল অগ্রাধিকার' : 'All Priorities'}</option>
              <option value="EMERGENCY">{lang === 'bn' ? 'জরুরী (৩০ মি:)' : 'Emergency'}</option>
              <option value="CRITICAL">{lang === 'bn' ? 'গুরুত্বপূর্ণ (১ ঘণ্টা)' : 'Critical'}</option>
              <option value="HIGH">{lang === 'bn' ? 'উচ্চ অগ্রাধিকার' : 'High Priority'}</option>
              <option value="MEDIUM">{lang === 'bn' ? 'মাঝারি' : 'Medium Priority'}</option>
              <option value="LOW">{lang === 'bn' ? 'সাধারণ' : 'Low Priority'}</option>
            </select>
          </div>
        </div>

        <div className="text-xs text-slate-500 flex items-center space-x-3 font-medium">
          <div className="hidden md:flex items-center space-x-1.5 text-emerald-700 bg-emerald-50/80 border border-emerald-200 px-2.5 py-1 rounded-lg font-mono">
            <span> Greenweb SMS BD Gateway Active</span>
          </div>

          <div className="flex items-center space-x-2 font-mono">
            <span>Total: <strong className="text-slate-900 font-bold">{workOrders.length}</strong></span>
            <span className="text-slate-300">•</span>
            <span>Unassigned: <strong className="text-red-600 font-bold">{workOrders.filter((w) => w.status === 'PENDING').length}</strong></span>
          </div>
        </div>
      </div>

      {/* AI Solver Banner */}
      {autoDispatchResult && (
        <div className="bg-indigo-50/90 border border-indigo-200 rounded-2xl p-3 text-xs flex items-center justify-between shadow-sm animate-fadeIn">
          <div className="flex items-center space-x-2 text-indigo-950 font-medium">
            <Sparkles className="w-4 h-4 text-indigo-600 animate-spin" />
            <span>
              AI Solver evaluated <strong className="text-indigo-600 font-bold">{autoDispatchResult.evaluatedCount} units</strong> in{' '}
              <strong className="text-emerald-700 font-bold">{autoDispatchResult.executionTimeMs}ms</strong>:
            </span>
            {autoDispatchResult.assignedTechnician ? (
              <span className="bg-white text-emerald-700 font-bold px-2 py-0.5 rounded-lg border border-emerald-200 shadow-xs">
                Matched: {autoDispatchResult.assignedTechnician.technicianName} ({autoDispatchResult.assignedTechnician.compositeScore}/100)
              </span>
            ) : (
              <span className="bg-white text-amber-700 font-bold px-2 py-0.5 rounded-lg border border-amber-200">
                No unit met hard constraints.
              </span>
            )}
          </div>
          <button
            onClick={() => setAutoDispatchResult(null)}
            className="text-slate-400 hover:text-slate-700 font-bold text-sm px-2"
          >
            ×
          </button>
        </div>
      )}

      {/* 5-Column Clean SaaS Light Kanban Grid */}
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
              className={`bg-slate-100/70 border border-slate-200/90 rounded-2xl p-2.5 flex flex-col min-h-[620px] transition-all duration-200 ${
                isDragOver ? 'bg-indigo-50/50 border-indigo-400 ring-2 ring-indigo-400/30' : 'hover:border-slate-300'
              }`}
            >
              {/* Column Header */}
              <div className="flex items-center justify-between px-1.5 py-1 mb-2 border-b border-slate-200/80">
                <div className="flex items-center space-x-2">
                  <div className={`w-2.5 h-2.5 rounded-full ${col.dotColor}`} />
                  <h3 className="font-bold text-xs text-slate-800 tracking-tight">{title}</h3>
                </div>

                <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${col.badgeBg}`}>
                  {colWorkOrders.length}
                </span>
              </div>

              {/* Drag Target Cue */}
              {isDragOver && (
                <div className="mb-2.5 border-2 border-dashed border-indigo-400 bg-white/80 rounded-xl p-3 text-center text-xs font-bold text-indigo-600 animate-pulse">
                  + Drop Job Here
                </div>
              )}

              {/* Cards List */}
              <div className="space-y-2.5 flex-1 overflow-y-auto max-h-[720px] pr-0.5">
                {colWorkOrders.map((wo) => {
                  const isEmergency = wo.priority === 'EMERGENCY' || wo.priority === 'CRITICAL';
                  const isBeingDragged = draggedWoId === wo.id;

                  return (
                    <div
                      key={wo.id}
                      draggable={true}
                      onDragStart={(e) => handleDragStart(e, wo)}
                      onDragEnd={handleDragEnd}
                      onClick={() => onSelectWorkOrder(wo)}
                      className={`bg-white border rounded-xl p-3 space-y-2.5 shadow-xs transition-all duration-200 cursor-grab active:cursor-grabbing group hover:-translate-y-0.5 hover:shadow-md relative ${
                        isBeingDragged
                          ? 'opacity-40 border-dashed border-indigo-400 ring-2 ring-indigo-400/40 scale-95'
                          : isEmergency
                          ? 'border-red-200 hover:border-red-400 ring-1 ring-red-100'
                          : 'border-slate-200 hover:border-indigo-300'
                      }`}
                    >
                      {/* Top Bar: ID, BDT Currency Price & Priority Badge */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1.5">
                          <GripVertical className="w-3.5 h-3.5 text-slate-300 group-hover:text-slate-500 transition" />
                          <span className="text-[10px] font-mono font-bold text-slate-500">{wo.id}</span>
                        </div>

                        <div className="flex items-center space-x-1">
                          <span className="text-[11px] font-extrabold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 font-mono">
                            {formatBDT(wo.pricingEstimatedBDT || 5000, lang)}
                          </span>
                          <span
                            className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded uppercase tracking-wide ${
                              isEmergency
                                ? 'bg-red-50 text-red-700 border border-red-200'
                                : 'bg-slate-100 text-slate-600 border border-slate-200'
                            }`}
                          >
                            {wo.priority}
                          </span>
                        </div>
                      </div>

                      {/* Job Title */}
                      <div className="font-bold text-xs text-slate-900 group-hover:text-indigo-600 transition leading-snug line-clamp-2">
                        {wo.title}
                      </div>

                      {/* Customer Name & Bangladesh Landmark Address */}
                      <div className="space-y-1 text-[11px] text-slate-500">
                        <div className="flex items-center space-x-1.5 truncate">
                          <Building className="w-3 h-3 text-slate-400 shrink-0" />
                          <span className="truncate text-slate-700 font-medium">{wo.customerName}</span>
                        </div>
                        <div className="flex items-center space-x-1.5 truncate text-[10px]">
                          <MapPin className="w-3 h-3 text-indigo-500 shrink-0" />
                          <span className="truncate text-slate-600">
                            {wo.locationPoint.landmark || wo.locationPoint.address}
                          </span>
                        </div>
                      </div>

                      {/* Greenweb SMS Gateway & Payment Badges */}
                      <div className="flex flex-wrap items-center gap-1 text-[9px] font-mono">
                        {wo.lastSmsSentAt && (
                          <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-1.5 py-0.5 rounded flex items-center gap-1 font-bold">
                            <MessageSquare className="w-2.5 h-2.5" />
                            <span>SMS Sent</span>
                          </span>
                        )}

                        <span className={`px-1.5 py-0.5 rounded border font-bold ${
                          wo.paymentStatus === 'PAID_BKASH' || wo.paymentStatus === 'PAID_CASH'
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                            : 'bg-amber-50 text-amber-800 border-amber-200'
                        }`}>
                          {wo.paymentStatus === 'PAID_BKASH' ? '✓ bKash Paid' : wo.paymentStatus === 'PAID_CASH' ? '✓ Cash Collected' : 'Unpaid'}
                        </span>
                      </div>

                      {/* Skills Badges */}
                      <div className="flex flex-wrap gap-1">
                        {wo.requiredSkills.map((skill) => (
                          <span
                            key={skill}
                            className="text-[9px] bg-slate-50 border border-slate-200 text-slate-600 px-1.5 py-0.5 rounded font-medium"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>

                      {/* Card Footer: Tech Assignment & Actions */}
                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                        {wo.assignedTechnicianName ? (
                          <div className="flex items-center space-x-1.5 text-indigo-700 font-bold truncate">
                            <div className="w-5 h-5 rounded-full bg-indigo-100 border border-indigo-200 flex items-center justify-center text-[10px] text-indigo-700 font-extrabold">
                              {wo.assignedTechnicianName.charAt(0)}
                            </div>
                            <span className="truncate max-w-[100px]">{wo.assignedTechnicianName}</span>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-1">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAutoDispatchJob(wo);
                              }}
                              disabled={dispatchingWoId === wo.id}
                              className="bg-indigo-50 hover:bg-indigo-600 text-indigo-700 hover:text-white border border-indigo-200 px-2 py-0.5 rounded-lg transition flex items-center space-x-1 font-bold text-[10px]"
                            >
                              <Cpu className="w-3 h-3" />
                              <span>{dispatchingWoId === wo.id ? 'Solving...' : 'AI Dispatch'}</span>
                            </button>

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setAssigningWoId(assigningWoId === wo.id ? null : wo.id);
                              }}
                              className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded"
                            >
                              <UserPlus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}

                        {/* Inline Status Advancement & Payment Button */}
                        <div className="flex items-center space-x-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setPaymentWoTarget(wo);
                            }}
                            className="p-1 text-emerald-600 hover:bg-emerald-50 rounded"
                            title="Collect Payment & Issue NBR Receipt"
                          >
                            <Banknote className="w-3.5 h-3.5" />
                          </button>

                          {col.id === 'PENDING' && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                const defaultTech = technicians.find((t) => t.dutyStatus === 'ONLINE') || technicians[0];
                                onUpdateStatus(wo.id, 'ASSIGNED', defaultTech.id, `${defaultTech.firstName} ${defaultTech.lastName}`);
                              }}
                              className="text-indigo-600 hover:text-indigo-800 text-[10px] font-bold flex items-center"
                            >
                              <span>Assign</span>
                              <ChevronRight className="w-3 h-3 ml-0.5" />
                            </button>
                          )}
                          {col.id === 'ASSIGNED' && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onUpdateStatus(wo.id, 'EN_ROUTE');
                              }}
                              className="text-blue-600 hover:text-blue-800 text-[10px] font-bold"
                            >
                              En Route →
                            </button>
                          )}
                          {col.id === 'EN_ROUTE' && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onUpdateStatus(wo.id, 'IN_PROGRESS');
                              }}
                              className="text-amber-600 hover:text-amber-800 text-[10px] font-bold"
                            >
                              Start →
                            </button>
                          )}
                          {col.id === 'IN_PROGRESS' && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onUpdateStatus(wo.id, 'COMPLETED');
                              }}
                              className="text-emerald-600 hover:text-emerald-800 text-[10px] font-bold flex items-center"
                            >
                              <CheckCircle2 className="w-3 h-3 mr-0.5" />
                              <span>Done</span>
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Manual Tech Assign Dropdown */}
                      {assigningWoId === wo.id && (
                        <div
                          onClick={(e) => e.stopPropagation()}
                          className="mt-2 bg-white border border-slate-200 rounded-xl p-2 space-y-1 z-20 shadow-xl text-[11px]"
                        >
                          <div className="text-[10px] font-bold uppercase text-slate-400 border-b border-slate-100 pb-1">
                            Select Field Technician
                          </div>
                          {technicians.map((tech) => (
                            <button
                              key={tech.id}
                              onClick={() => {
                                onAssignTechnician(wo.id, tech.id, `${tech.firstName} ${tech.lastName}`);
                                setAssigningWoId(null);
                              }}
                              className="w-full text-left px-2 py-1 rounded hover:bg-slate-50 flex items-center justify-between text-slate-800 transition"
                            >
                              <span className="font-medium">{tech.firstName} {tech.lastName}</span>
                              <span className={`text-[9px] px-1 rounded font-bold ${
                                tech.dutyStatus === 'ONLINE' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'
                              }`}>
                                {tech.dutyStatus}
                              </span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}

                {colWorkOrders.length === 0 && (
                  <div className="border border-dashed border-slate-200 rounded-xl p-8 text-center text-slate-400 text-xs my-auto space-y-1">
                    <div>No Jobs in {title}</div>
                  </div>
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
            }
          }}
        />
      )}
    </div>
  );
};
