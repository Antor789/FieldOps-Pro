import React, { useState } from 'react';
import { Tenant, WorkOrder, Technician, Site, WorkOrderStatus, PaymentReceipt, WorkOrderPriority } from '../../../types/fsm';
import {
  INITIAL_TENANTS,
  INITIAL_SITES,
  INITIAL_TECHNICIANS,
  INITIAL_WORK_ORDERS,
} from '../../../data/mockFsmData';
import { Language } from '../../../lib/i18n';
import { FSMHeader } from './FSMHeader';
import { FSMSidebar, FSMNavSection } from './FSMSidebar';
import { FSMStatsBar, StatsFilterType } from './FSMStatsBar';
import { FSMBreadcrumbs, FSMViewMode } from './FSMBreadcrumbs';
import { FSMCreateWorkOrderModal } from './FSMCreateWorkOrderModal';
import { WorkOrderKanban } from '../WorkOrderKanban';
import { LiveMapDispatcher } from '../LiveMapDispatcher';
import { FieldTechMobileApp } from '../FieldTechMobileApp';
import { CustomerTrackingModal } from '../CustomerTrackingModal';
import { DesignSystemModal } from '../../ui/DesignSystemModal';
import { CelebrationOverlay } from '../../ui/CelebrationOverlay';
import { AnalyticsDashboard } from '../../../pages/AnalyticsDashboard';
import { ScheduleCalendarPage } from '../../../pages/ScheduleCalendar';
import { InventoryPage } from '../../../pages/Inventory';
import { CustomersPage } from '../../../pages/Customers';
import { NotificationPreferences } from '../../notifications/NotificationPreferences';
import { Button } from '../../ui/Button';
import { executeAutoDispatchEngine } from '../../../lib/AutoDispatchEngine';
import { useToast } from '../../../context/ToastContext';
import {
  X,
  Sparkles,
  MapPin,
  Building,
  ShieldCheck,
  Maximize2,
  Minimize2,
  Map,
  Compass,
  FileText,
  Users,
  Package,
} from 'lucide-react';

export const FSMLayout: React.FC = () => {
  const { addToast } = useToast();

  // Global State
  const [tenants] = useState<Tenant[]>(INITIAL_TENANTS);
  const [currentTenant, setCurrentTenant] = useState<Tenant>(INITIAL_TENANTS[0]);
  const [lang, setLang] = useState<Language>('en');

  const [sites] = useState<Site[]>(INITIAL_SITES);
  const [technicians, setTechnicians] = useState<Technician[]>(INITIAL_TECHNICIANS);
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>(INITIAL_WORK_ORDERS);

  // Layout & Navigation State
  const [activeSection, setActiveSection] = useState<FSMNavSection>('work-orders');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeStatsFilter, setActiveStatsFilter] = useState<StatsFilterType>('ALL');
  const [viewMode, setViewMode] = useState<FSMViewMode>('kanban');

  // Modal & Drawer States
  const [isCreateOrderOpen, setIsCreateOrderOpen] = useState<boolean>(false);
  const [isDesignSystemOpen, setIsDesignSystemOpen] = useState<boolean>(false);
  const [showCelebration, setShowCelebration] = useState<boolean>(false);
  const [isMiniMapOpen, setIsMiniMapOpen] = useState<boolean>(false);

  // Selected Entities
  const [selectedWorkOrder, setSelectedWorkOrder] = useState<WorkOrder | null>(null);
  const [selectedTechnician, setSelectedTechnician] = useState<Technician | null>(null);
  const [isDispatchingAll, setIsDispatchingAll] = useState<boolean>(false);

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
    setShowCelebration(true);
  };

  const handleCreateWorkOrder = (newOrderData: Partial<WorkOrder>) => {
    const newId = `WO-90${workOrders.length + 20}`;
    const newWo: WorkOrder = {
      id: newId,
      tenantId: currentTenant.id,
      title: newOrderData.title || 'Untitled Work Order',
      description: 'Bangladesh Enterprise Field Service Task',
      status: 'PENDING',
      priority: newOrderData.priority || 'HIGH',
      siteId: 'site-1',
      siteName: newOrderData.siteName || 'Dhaka NOC Center',
      customerName: newOrderData.customerName || 'Standard Client',
      customerPhoneBd: newOrderData.customerPhoneBd || '01711-001122',
      locationPoint: newOrderData.locationPoint || {
        latitude: 23.8103,
        longitude: 90.4125,
        division: 'DHAKA',
        district: 'Dhaka',
        thana: 'Gulshan',
        address: 'Gulshan 2, Dhaka',
        landmark: 'Near DCC Market',
      },
      requiredSkills: newOrderData.requiredSkills || ['FIBER_SPLICING'],
      requiredParts: [],
      slaDeadline: newOrderData.slaDeadline || new Date(Date.now() + 60 * 60 * 1000).toISOString(),
      estimatedDurationMins: 45,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      pricingEstimatedBDT: newOrderData.pricingEstimatedBDT || 5000,
      paymentStatus: 'UNPAID',
    };

    setWorkOrders((prev) => [newWo, ...prev]);
  };

  // AI Auto-Dispatch All Unassigned Jobs
  const handleAutoDispatchAll = () => {
    const unassigned = workOrders.filter((w) => w.status === 'PENDING');
    if (unassigned.length === 0) {
      addToast({
        title: 'No Pending Work Orders',
        description: 'All work orders are currently assigned or completed.',
        type: 'info',
      });
      return;
    }

    setIsDispatchingAll(true);
    let matchedCount = 0;

    setTimeout(() => {
      unassigned.forEach((wo) => {
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
          technicians.map((t) => ({
            id: t.id,
            tenantId: t.tenantId,
            name: `${t.firstName} ${t.lastName}`,
            dutyStatus: t.dutyStatus,
            location: { latitude: t.locationPoint.latitude, longitude: t.locationPoint.longitude },
            skills: t.skills,
            vehicleParts: t.vehicleParts,
            activeWorkOrderCount: t.activeWorkOrderCount,
            maxCapacity: t.maxCapacity,
            batteryLevel: t.batteryLevel,
            remainingShiftHours: 8,
            vehicleType: t.vehicleType,
          }))
        );

        if (result.assignedTechnician) {
          matchedCount++;
          handleAssignTechnician(
            wo.id,
            result.assignedTechnician.technicianId,
            result.assignedTechnician.technicianName
          );
        }
      });

      setIsDispatchingAll(false);
      addToast({
        title: `AI Auto-Dispatched ${matchedCount} Work Orders`,
        description: 'Optimal route and skill constraints evaluated across Dhaka fleet.',
        type: 'ai',
      });
    }, 800);
  };

  // KPI Calculations
  const criticalJobsCount = workOrders.filter(
    (w) => (w.priority === 'EMERGENCY' || w.priority === 'CRITICAL') && w.status !== 'COMPLETED'
  ).length;
  const enRouteJobsCount = workOrders.filter((w) => w.status === 'EN_ROUTE').length;
  const completedJobsCount = workOrders.filter((w) => w.status === 'COMPLETED').length;
  const totalRevenueBDT = workOrders.reduce(
    (sum, wo) => sum + (wo.paymentStatus !== 'UNPAID' ? wo.pricingEstimatedBDT || 0 : 0),
    0
  );

  // Filtered Work Orders for Stats Filter
  const displayedWorkOrders = workOrders.filter((wo) => {
    if (activeStatsFilter === 'CRITICAL') {
      return (wo.priority === 'EMERGENCY' || wo.priority === 'CRITICAL') && wo.status !== 'COMPLETED';
    }
    if (activeStatsFilter === 'EN_ROUTE') {
      return wo.status === 'EN_ROUTE';
    }
    if (activeStatsFilter === 'COMPLETED') {
      return wo.status === 'COMPLETED';
    }
    if (activeStatsFilter === 'REVENUE') {
      return wo.paymentStatus !== 'UNPAID';
    }
    return true;
  });

  // Section Titles mapping
  const sectionTitles: Record<FSMNavSection, string> = {
    dashboard: lang === 'bn' ? 'অপারেশনাল ড্যাশবোর্ড' : 'Operational Dashboard',
    'work-orders': lang === 'bn' ? 'ওয়ার্ক অর্ডার ও ডিসপ্যাচ বোর্ড' : 'Work Order & Dispatch Board',
    technicians: lang === 'bn' ? 'ফিল্ড টেকনিশিয়ান ও জিপিএস ট্র্যাক' : 'Field Technicians & Fleet Radar',
    customers: lang === 'bn' ? 'এন্টারপ্রাইজ ক্লায়েন্ট তালিকা' : 'Enterprise Customer Directory',
    'live-map': lang === 'bn' ? 'ঢাকা লাইভ কমান্ড জিপিএস ম্যাপ' : 'Dhaka Live GPS Command Map',
    inventory: lang === 'bn' ? 'যানবাহন ও ভ্যান যন্ত্রাংশ ইনভেন্টরি' : 'Vehicle & Van Inventory Stock',
    reports: lang === 'bn' ? 'এনবিআর ভ্যাট ও এসএলএ পারফরম্যান্স রিপোর্ট' : 'NBR VAT Invoicing & SLA Reports',
    settings: lang === 'bn' ? 'মাল্টি-টেন্যান্ট ও এসএমএস গেটওয়ে সেটিংস' : 'Multi-Tenant & Gateway Settings',
    'field-pwa': lang === 'bn' ? 'টেকনিশিয়ান মোবাইল অ্যাপ (PWA)' : 'Field Technician Mobile App (PWA)',
    'customer-portal': lang === 'bn' ? 'লাইভ কাস্টমার ট্র্যাকার পোর্টাল' : 'Live Customer Tracking Portal',
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#090D16] text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      {/* 1. Header Navigation */}
      <FSMHeader
        tenants={tenants}
        currentTenant={currentTenant}
        onSelectTenant={setCurrentTenant}
        lang={lang}
        onToggleLanguage={handleToggleLanguage}
        onOpenDesignSystem={() => setIsDesignSystemOpen(true)}
        onOpenCreateOrder={() => setIsCreateOrderOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        unreadNotificationCount={criticalJobsCount > 0 ? criticalJobsCount : 1}
      />

      {/* 2. Main Workspace Layout with Sidebar + Viewport */}
      <div className="flex-1 flex overflow-hidden">
        {/* Collapsible Sidebar Navigation */}
        <FSMSidebar
          activeSection={activeSection}
          onSelectSection={setActiveSection}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          lang={lang}
          workOrderCount={workOrders.length}
          onlineTechCount={technicians.filter((t) => t.dutyStatus === 'ONLINE').length}
          criticalCount={criticalJobsCount}
        />

        {/* 3. Main Content Viewport */}
        <main className="flex-1 flex flex-col overflow-y-auto p-3 sm:p-5 space-y-4">
          {/* Breadcrumb Navigation & Action Toolbar */}
          <FSMBreadcrumbs
            currentSectionTitle={sectionTitles[activeSection]}
            subLocation={`${currentTenant.name} • Dhaka NOC`}
            lang={lang}
            viewMode={viewMode}
            onChangeViewMode={setViewMode}
            onOpenCreateOrder={() => setIsCreateOrderOpen(true)}
            onAutoDispatchAll={handleAutoDispatchAll}
            isDispatchingAll={isDispatchingAll}
          />

          {/* Quick Stats Bar */}
          <FSMStatsBar
            totalJobs={workOrders.length}
            criticalJobs={criticalJobsCount}
            enRouteJobs={enRouteJobsCount}
            completedJobs={completedJobsCount}
            totalRevenueBDT={totalRevenueBDT}
            activeFilter={activeStatsFilter}
            onSelectFilter={setActiveStatsFilter}
            lang={lang}
          />

          {/* Main Dynamic View Content */}
          <div className="flex-1">
            {/* ANALYTICS & EXECUTIVE DASHBOARD SECTION */}
            {activeSection === 'dashboard' && (
              <AnalyticsDashboard
                locale={lang}
                onNavigateToKanban={() => setActiveSection('work-orders')}
                onNavigateToMap={() => setActiveSection('live-map')}
              />
            )}

            {/* SCHEDULING CALENDAR & DISPATCH GANTT SECTION */}
            {activeSection === 'schedule' && (
              <ScheduleCalendarPage
                locale={lang}
                onNavigateToWorkOrder={(woId) => {
                  const matched = workOrders.find((w) => w.id === woId);
                  if (matched) setSelectedWorkOrder(matched);
                  setActiveSection('work-orders');
                }}
              />
            )}

            {/* WORK ORDERS / KANBAN / SPLIT MAP VIEW */}
            {activeSection === 'work-orders' && (
              <div className="flex flex-col lg:flex-row gap-4 items-start relative">
                {/* Kanban Board Panel */}
                <div
                  className={`w-full transition-all duration-300 ${
                    viewMode === 'split-map' ? 'lg:w-[calc(100%-440px)]' : viewMode === 'full-map' ? 'hidden' : 'w-full'
                  }`}
                >
                  <WorkOrderKanban
                    workOrders={displayedWorkOrders}
                    technicians={technicians}
                    lang={lang}
                    onUpdateStatus={handleUpdateStatus}
                    onAssignTechnician={handleAssignTechnician}
                    onSelectWorkOrder={(wo) => setSelectedWorkOrder(wo)}
                    onPaymentSuccess={handlePaymentSuccess}
                    onTriggerCelebration={() => setShowCelebration(true)}
                  />
                </div>

                {/* Split or Full Screen Dhaka Live Map */}
                {(viewMode === 'split-map' || viewMode === 'full-map') && (
                  <div
                    className={`bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl overflow-hidden shadow-xl flex flex-col shrink-0 animate-fadeIn ${
                      viewMode === 'full-map'
                        ? 'w-full h-[calc(100vh-230px)]'
                        : 'w-full lg:w-[420px] h-[640px] lg:h-[calc(100vh-240px)] sticky top-4'
                    }`}
                  >
                    <div className="bg-slate-900 dark:bg-slate-950 text-white px-4 py-3 flex items-center justify-between border-b border-slate-800">
                      <div className="flex items-center space-x-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                        <h3 className="font-bold text-xs">Dhaka GPS Command Radar</h3>
                      </div>
                      <div className="flex items-center space-x-1.5">
                        <button
                          onClick={() => setViewMode(viewMode === 'full-map' ? 'split-map' : 'full-map')}
                          className="p-1 rounded text-slate-400 hover:text-white cursor-pointer"
                          title={viewMode === 'full-map' ? 'Exit Fullscreen' : 'Fullscreen Map'}
                        >
                          {viewMode === 'full-map' ? (
                            <Minimize2 className="w-4 h-4" />
                          ) : (
                            <Maximize2 className="w-4 h-4" />
                          )}
                        </button>
                        <button
                          onClick={() => setViewMode('kanban')}
                          className="p-1 rounded text-slate-400 hover:text-white cursor-pointer"
                          title="Close Map Split"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
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
            )}

            {/* LIVE MAP DEDICATED SECTION */}
            {activeSection === 'live-map' && (
              <div className="w-full h-[calc(100vh-220px)] bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl overflow-hidden shadow-xl flex flex-col">
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

            {/* FIELD TECHNICIAN MOBILE APP SECTION */}
            {activeSection === 'field-pwa' && (
              <div className="py-2">
                <FieldTechMobileApp
                  technician={technicians[0]}
                  assignedWorkOrders={workOrders.filter((w) => w.assignedTechnicianId === technicians[0].id)}
                  lang={lang}
                  onUpdateWorkOrderStatus={(woId, status) => {
                    handleUpdateStatus(woId, status);
                    if (status === 'COMPLETED') setShowCelebration(true);
                  }}
                  onSaveProofOfWork={(woId) => addToast({ title: 'Proof of Work Saved', description: `Geo-tagged photos recorded for #${woId}`, type: 'success' })}
                  onPaymentSuccess={handlePaymentSuccess}
                />
              </div>
            )}

            {/* LIVE CUSTOMER PORTAL SECTION */}
            {activeSection === 'customer-portal' && (
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 max-w-lg mx-auto text-center space-y-4 shadow-xl">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto font-bold shadow-xs">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h2 className="text-lg font-extrabold text-slate-900 dark:text-slate-100">
                  Bangladesh Customer Portal Live Tracker
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Select any work order below to test the live customer tracking modal with bKash payment gateway and Greenweb SMS updates.
                </p>
                <div className="space-y-2 pt-2">
                  {workOrders.map((wo) => (
                    <button
                      key={wo.id}
                      onClick={() => setSelectedWorkOrder(wo)}
                      className="w-full bg-slate-50 dark:bg-slate-800/80 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 border border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-700 p-3 rounded-2xl text-left flex items-center justify-between transition cursor-pointer"
                    >
                      <div>
                        <div className="font-bold text-xs text-slate-900 dark:text-slate-100">{wo.title}</div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">{wo.siteName}</div>
                      </div>
                      <span className="text-[10px] bg-indigo-600 text-white px-2.5 py-1 rounded-full font-bold shadow-xs">
                        Track →
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* TECHNICIANS LIST SECTION */}
            {activeSection === 'technicians' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {technicians.map((tech) => (
                  <div
                    key={tech.id}
                    className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-3 shadow-xs hover:shadow-md transition"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-700 text-white font-extrabold flex items-center justify-center text-sm shadow-xs">
                          {tech.firstName[0]}
                          {tech.lastName[0]}
                        </div>
                        <div>
                          <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                            {tech.firstName} {tech.lastName}
                          </h4>
                          <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
                            {tech.vehicleType}
                          </span>
                        </div>
                      </div>

                      <span
                        className={`text-[9px] font-bold font-mono px-2 py-0.5 rounded-full border ${
                          tech.dutyStatus === 'ONLINE'
                            ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        {tech.dutyStatus}
                      </span>
                    </div>

                    <div className="space-y-1 text-xs text-slate-600 dark:text-slate-400">
                      <div className="flex justify-between">
                        <span>Active Orders:</span>
                        <strong className="font-mono">{tech.activeWorkOrderCount} / {tech.maxCapacity}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Device Battery:</span>
                        <strong className="font-mono text-emerald-600">{tech.batteryLevel}%</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Contact:</span>
                        <strong className="font-mono">{tech.phone}</strong>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                      <Button
                        size="xs"
                        variant="outline"
                        onClick={() => {
                          setSelectedTechnician(tech);
                          setViewMode('split-map');
                        }}
                      >
                        Locate GPS
                      </Button>
                      <Button
                        size="xs"
                        variant="primary"
                        onClick={() =>
                          addToast({
                            title: `Dispatched Ping to ${tech.firstName}`,
                            description: 'Telemetry sync requested over 4G cellular.',
                            type: 'info',
                          })
                        }
                      >
                        Send Telemetry Ping
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* CUSTOMERS & SITES CRM SECTION */}
            {activeSection === 'customers' && (
              <CustomersPage
                locale={lang}
                onCreateJob={() => setIsCreateOrderOpen(true)}
              />
            )}

            {/* INVENTORY & VAN STOCK SECTION */}
            {activeSection === 'inventory' && (
              <InventoryPage locale={lang} />
            )}

            {/* REPORTS & NBR VAT SECTION */}
            {activeSection === 'reports' && (
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-4 font-sans">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                      Official NBR VAT (15%) Ledger & SLA Compliance
                    </h3>
                    <p className="text-xs text-slate-500">Government of the People's Republic of Bangladesh standard tax invoicing.</p>
                  </div>
                  <Button size="sm" variant="primary" onClick={() => addToast({ title: 'Export Generated', description: 'Downloaded NBR Tax Monthly Summary (PDF)', type: 'payment' })}>
                    Export PDF Invoice Ledger
                  </Button>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900 text-white font-mono text-xs space-y-2">
                  <div className="flex justify-between">
                    <span>Total Service Turnover (BDT):</span>
                    <strong className="text-emerald-400">৳ {(totalRevenueBDT || 0).toLocaleString()}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Total NBR VAT Collected (15%):</span>
                    <strong className="text-emerald-400">৳ {Math.round((totalRevenueBDT || 0) * 0.15).toLocaleString()}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>NBR BIN Registration:</span>
                    <strong>002938102-0101</strong>
                  </div>
                </div>
              </div>
            )}

            {/* SETTINGS SECTION */}
            {activeSection === 'settings' && (
              <div className="space-y-6">
                <NotificationPreferences locale={lang} />

                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-4 max-w-2xl mx-auto shadow-xs">
                  <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                    Platform & Gateway Configurations (Bangladesh)
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2">
                      <div className="font-bold text-slate-900 dark:text-slate-100">Greenweb SMS Gateway</div>
                      <p className="text-slate-500">API Key: ******************** (Active 99.98% delivery rate)</p>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 px-2 py-0.5 rounded font-bold">CONNECTED</span>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2">
                      <div className="font-bold text-slate-900 dark:text-slate-100">bKash Merchant Checkout API</div>
                      <p className="text-slate-500">Merchant Account: 01711-009988 (Production Live)</p>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 px-2 py-0.5 rounded font-bold">VERIFIED</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* 4. Customer Tracking Modal */}
      {selectedWorkOrder && (
        <CustomerTrackingModal
          workOrder={selectedWorkOrder}
          technician={technicians.find((t) => t.id === selectedWorkOrder.assignedTechnicianId)}
          lang={lang}
          onClose={() => setSelectedWorkOrder(null)}
        />
      )}

      {/* 5. Create Work Order Modal */}
      <FSMCreateWorkOrderModal
        isOpen={isCreateOrderOpen}
        onClose={() => setIsCreateOrderOpen(false)}
        onCreateWorkOrder={handleCreateWorkOrder}
        lang={lang}
      />

      {/* 6. Design System Guide Modal */}
      <DesignSystemModal
        isOpen={isDesignSystemOpen}
        onClose={() => setIsDesignSystemOpen(false)}
        onTriggerCelebration={() => setShowCelebration(true)}
      />

      {/* 7. Status Change Celebration Overlay */}
      <CelebrationOverlay
        show={showCelebration}
        onComplete={() => setShowCelebration(false)}
      />
    </div>
  );
};
