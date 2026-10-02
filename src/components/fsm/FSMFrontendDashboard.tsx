import React, { useState } from 'react';
import { Tenant, WorkOrder, Technician, Site, WorkOrderStatus, PaymentReceipt } from '../../types/fsm';
import {
  INITIAL_TENANTS,
  INITIAL_SITES,
  INITIAL_TECHNICIANS,
  INITIAL_WORK_ORDERS,
} from '../../data/mockFsmData';
import { Language } from '../../lib/i18n';
import { HeaderNav } from './HeaderNav';
import { WorkOrderKanban } from './WorkOrderKanban';
import { LiveMapDispatcher } from './LiveMapDispatcher';
import { FieldTechMobileApp } from './FieldTechMobileApp';
import { CustomerTrackingModal } from './CustomerTrackingModal';
import { X, Sparkles, MapPin, Building, ShieldCheck } from 'lucide-react';

export const FSMFrontendDashboard: React.FC = () => {
  // Global FSM State
  const [tenants] = useState<Tenant[]>(INITIAL_TENANTS);
  const [currentTenant, setCurrentTenant] = useState<Tenant>(INITIAL_TENANTS[0]);
  const [lang, setLang] = useState<Language>('en');

  const [sites] = useState<Site[]>(INITIAL_SITES);
  const [technicians, setTechnicians] = useState<Technician[]>(INITIAL_TECHNICIANS);
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>(INITIAL_WORK_ORDERS);

  // Active View & Drawers
  const [activeRoleView, setActiveRoleView] = useState<'DISPATCHER' | 'FIELD_TECH' | 'CUSTOMER_TRACK'>('DISPATCHER');
  const [isMapDrawerOpen, setIsMapDrawerOpen] = useState<boolean>(true);

  // Selected Entities
  const [selectedWorkOrder, setSelectedWorkOrder] = useState<WorkOrder | null>(null);
  const [selectedTechnician, setSelectedTechnician] = useState<Technician | null>(null);

  // Handlers
  const handleToggleLanguage = () => {
    setLang((prev) => (prev === 'en' ? 'bn' : 'en'));
  };

  const handleUpdateStatus = (woId: string, status: WorkOrderStatus, techId?: string, techName?: string) => {
    setWorkOrders((prev) =>
      prev.map((wo) => {
        if (wo.id === woId) {
          return {
            ...wo,
            status,
            assignedTechnicianId: techId !== undefined ? techId : wo.assignedTechnicianId,
            assignedTechnicianName: techName !== undefined ? techName : wo.assignedTechnicianName,
            updatedAt: new Date().toISOString(),
          };
        }
        return wo;
      })
    );
  };

  const handleAssignTechnician = (woId: string, techId: string, techName: string) => {
    handleUpdateStatus(woId, 'ASSIGNED', techId, techName);
  };

  const handlePaymentSuccess = (woId: string, receipt: PaymentReceipt) => {
    setWorkOrders((prev) =>
      prev.map((wo) => {
        if (wo.id === woId) {
          return {
            ...wo,
            paymentStatus: receipt.method === 'BKASH' ? 'PAID_BKASH' : 'PAID_CASH',
            paymentReceipt: receipt,
            updatedAt: new Date().toISOString(),
          };
        }
        return wo;
      })
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased flex flex-col p-3 md:p-5 space-y-4">
      {/* 1. Header Navigation Bar */}
      <HeaderNav
        tenants={tenants}
        currentTenant={currentTenant}
        onSelectTenant={setCurrentTenant}
        activeRoleView={activeRoleView}
        onChangeRoleView={setActiveRoleView}
        socketStatus="CONNECTED"
        onlineTechCount={technicians.filter((t) => t.dutyStatus === 'ONLINE').length}
        totalTechCount={technicians.length}
        sosCount={0}
        lang={lang}
        onToggleLanguage={handleToggleLanguage}
        isMapDrawerOpen={isMapDrawerOpen}
        onToggleMapDrawer={() => setIsMapDrawerOpen(!isMapDrawerOpen)}
      />

      {/* 2. Main Dashboard Layout Area */}
      <div className="flex-1 flex flex-col lg:flex-row gap-4 items-start relative overflow-hidden">
        {/* Main Role Content View */}
        <div className="flex-1 w-full space-y-4">
          {/* Dispatcher View: Kanban Board */}
          {activeRoleView === 'DISPATCHER' && (
            <WorkOrderKanban
              workOrders={workOrders}
              technicians={technicians}
              lang={lang}
              onUpdateStatus={handleUpdateStatus}
              onAssignTechnician={handleAssignTechnician}
              onSelectWorkOrder={(wo) => setSelectedWorkOrder(wo)}
              onPaymentSuccess={handlePaymentSuccess}
            />
          )}

          {/* Field Tech PWA Mobile View */}
          {activeRoleView === 'FIELD_TECH' && (
            <div className="py-2">
              <FieldTechMobileApp
                technician={technicians[0]}
                assignedWorkOrders={workOrders.filter((w) => w.assignedTechnicianId === technicians[0].id)}
                lang={lang}
                onUpdateWorkOrderStatus={(woId, status) => handleUpdateStatus(woId, status)}
                onSaveProofOfWork={(woId) => alert(`Proof saved for #${woId}`)}
                onPaymentSuccess={handlePaymentSuccess}
              />
            </div>
          )}

          {/* Customer Live Tracking View Trigger */}
          {activeRoleView === 'CUSTOMER_TRACK' && (
            <div className="bg-white border border-slate-200 rounded-3xl p-8 max-w-lg mx-auto text-center space-y-4 shadow-xl">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-600 flex items-center justify-center mx-auto font-bold">
                <Sparkles className="w-6 h-6" />
              </div>
              <h2 className="text-lg font-extrabold text-slate-900">Bangladesh Customer Portal Preview</h2>
              <p className="text-xs text-slate-500">
                Select any work order below to test the live customer tracking modal with bKash payment gateway and Greenweb SMS updates.
              </p>
              <div className="space-y-2 pt-2">
                {workOrders.map((wo) => (
                  <button
                    key={wo.id}
                    onClick={() => setSelectedWorkOrder(wo)}
                    className="w-full bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 p-3 rounded-2xl text-left flex items-center justify-between transition"
                  >
                    <div>
                      <div className="font-bold text-xs text-slate-900">{wo.title}</div>
                      <div className="text-[10px] text-slate-500 font-mono">{wo.siteName}</div>
                    </div>
                    <span className="text-[10px] bg-indigo-600 text-white px-2 py-0.5 rounded-full font-bold">
                      Track →
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 3. Collapsible Dhaka Live Map Drawer (Right Side) */}
        {isMapDrawerOpen && activeRoleView === 'DISPATCHER' && (
          <div className="w-full lg:w-[420px] xl:w-[480px] h-[640px] lg:h-[calc(100vh-120px)] bg-white border border-slate-200/90 rounded-3xl overflow-hidden shadow-xl flex flex-col shrink-0 sticky top-4 animate-fadeIn">
            <div className="bg-slate-900 text-white px-4 py-3 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <h3 className="font-bold text-xs">Dhaka Command GPS Map</h3>
              </div>
              <button
                onClick={() => setIsMapDrawerOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 relative">
              <LiveMapDispatcher
                technicians={technicians}
                workOrders={workOrders}
                sites={sites}
                selectedTechId={selectedTechnician?.id}
                selectedWorkOrderId={selectedWorkOrder?.id}
                onSelectTechnician={(tech) => setSelectedTechnician(tech)}
                onSelectWorkOrder={(wo) => setSelectedWorkOrder(wo)}
                onAssignTechToWorkOrder={handleAssignTechnician}
                lang={lang}
              />
            </div>
          </div>
        )}
      </div>

      {/* Customer Tracking Modal */}
      {selectedWorkOrder && (
        <CustomerTrackingModal
          workOrder={selectedWorkOrder}
          technician={technicians.find((t) => t.id === selectedWorkOrder.assignedTechnicianId)}
          lang={lang}
          onClose={() => setSelectedWorkOrder(null)}
        />
      )}
    </div>
  );
};
