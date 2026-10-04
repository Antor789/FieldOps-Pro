import React from 'react';
import {
  LayoutDashboard,
  ClipboardList,
  Users,
  Building2,
  Map,
  Package,
  BarChart3,
  Settings,
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Smartphone,
  Eye,
  Radio,
  Flame,
} from 'lucide-react';
import { Language } from '../../../lib/i18n';

export type FSMNavSection =
  | 'dashboard'
  | 'work-orders'
  | 'schedule'
  | 'technicians'
  | 'customers'
  | 'live-map'
  | 'inventory'
  | 'reports'
  | 'settings'
  | 'field-pwa'
  | 'customer-portal';

interface FSMSidebarProps {
  activeSection: FSMNavSection;
  onSelectSection: (section: FSMNavSection) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  lang: Language;
  workOrderCount?: number;
  onlineTechCount?: number;
  criticalCount?: number;
}

export const FSMSidebar: React.FC<FSMSidebarProps> = ({
  activeSection,
  onSelectSection,
  isCollapsed,
  onToggleCollapse,
  lang,
  workOrderCount = 45,
  onlineTechCount = 12,
  criticalCount = 3,
}) => {
  const navItems: {
    id: FSMNavSection;
    labelEn: string;
    labelBn: string;
    icon: React.ReactNode;
    badge?: string | number;
    badgeColor?: string;
  }[] = [
    {
      id: 'dashboard',
      labelEn: 'Dashboard',
      labelBn: 'ড্যাশবোর্ড',
      icon: <LayoutDashboard className="w-4 h-4 shrink-0" />,
    },
    {
      id: 'work-orders',
      labelEn: 'Work Orders',
      labelBn: 'ওয়ার্ক অর্ডার',
      icon: <ClipboardList className="w-4 h-4 shrink-0" />,
      badge: workOrderCount,
      badgeColor: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300',
    },
    {
      id: 'schedule',
      labelEn: 'Calendar & Dispatch',
      labelBn: 'শিডিউল ক্যালেন্ডার',
      icon: <CalendarIcon className="w-4 h-4 shrink-0" />,
      badge: 'Gantt',
      badgeColor: 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300',
    },
    {
      id: 'technicians',
      labelEn: 'Technicians',
      labelBn: 'টেকনিশিয়ান',
      icon: <Users className="w-4 h-4 shrink-0" />,
      badge: `${onlineTechCount} Online`,
      badgeColor: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300',
    },
    {
      id: 'customers',
      labelEn: 'Customers',
      labelBn: 'গ্রাহক তালিকা',
      icon: <Building2 className="w-4 h-4 shrink-0" />,
    },
    {
      id: 'live-map',
      labelEn: 'Live Map (GPS)',
      labelBn: 'লাইভ ম্যাপ (GPS)',
      icon: <Map className="w-4 h-4 shrink-0" />,
      badge: 'Dhaka',
      badgeColor: 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300',
    },
    {
      id: 'inventory',
      labelEn: 'Inventory',
      labelBn: 'ইনভেন্টরি',
      icon: <Package className="w-4 h-4 shrink-0" />,
    },
    {
      id: 'reports',
      labelEn: 'Reports & NBR',
      labelBn: 'রিপোর্ট ও এনবিআর',
      icon: <BarChart3 className="w-4 h-4 shrink-0" />,
      badge: 'VAT 15%',
      badgeColor: 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300',
    },
    {
      id: 'settings',
      labelEn: 'Settings',
      labelBn: 'সেটিংস',
      icon: <Settings className="w-4 h-4 shrink-0" />,
    },
  ];

  const secondaryNavItems: {
    id: FSMNavSection;
    labelEn: string;
    labelBn: string;
    icon: React.ReactNode;
    badge?: string;
  }[] = [
    {
      id: 'field-pwa',
      labelEn: 'Mobile Field App',
      labelBn: 'মোবাইল ফিল্ড অ্যাপ',
      icon: <Smartphone className="w-4 h-4 shrink-0" />,
      badge: 'PWA',
    },
    {
      id: 'customer-portal',
      labelEn: 'Customer Portal',
      labelBn: 'কাস্টমার পোর্টাল',
      icon: <Eye className="w-4 h-4 shrink-0" />,
      badge: 'Live',
    },
  ];

  return (
    <aside
      className={`bg-white/95 dark:bg-slate-900/95 border-r border-slate-200/80 dark:border-slate-800 flex flex-col justify-between transition-all duration-300 ease-in-out shrink-0 select-none z-30 ${
        isCollapsed ? 'w-18' : 'w-60'
      }`}
    >
      {/* 1. Main Navigation List */}
      <div className="p-3 space-y-5 overflow-y-auto">
        {/* Primary Menu Group */}
        <div className="space-y-1">
          {!isCollapsed && (
            <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 font-mono">
              {lang === 'bn' ? 'অপারেশনাল মেনু' : 'Operations'}
            </div>
          )}

          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            const label = lang === 'bn' ? item.labelBn : item.labelEn;

            return (
              <div key={item.id} className="relative group">
                <button
                  onClick={() => onSelectSection(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-150 cursor-pointer ${
                    isActive
                      ? 'bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 shadow-2xs font-bold border-l-3 border-indigo-600'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100/80 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-slate-100'
                  } ${isCollapsed ? 'justify-center px-0' : ''}`}
                >
                  <span className={isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}>
                    {item.icon}
                  </span>

                  {!isCollapsed && (
                    <div className="flex-1 flex items-center justify-between text-left truncate">
                      <span className="truncate">{label}</span>
                      {item.badge && (
                        <span
                          className={`text-[10px] font-bold font-mono px-1.5 py-0.2 rounded-md ${
                            item.badgeColor || 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </div>
                  )}
                </button>

                {/* Tooltip on Collapsed Mode */}
                {isCollapsed && (
                  <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 px-2.5 py-1 bg-slate-900 text-white text-[11px] font-semibold rounded-lg shadow-xl whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-50">
                    {label}
                    {item.badge && <span className="ml-1 opacity-75 font-mono">({item.badge})</span>}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Secondary Switchers (PWA & Customer Live Tracker) */}
        <div className="space-y-1 pt-3 border-t border-slate-100 dark:border-slate-800">
          {!isCollapsed && (
            <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 font-mono">
              {lang === 'bn' ? 'রোলে ভিউ' : 'App Roles'}
            </div>
          )}

          {secondaryNavItems.map((item) => {
            const isActive = activeSection === item.id;
            const label = lang === 'bn' ? item.labelBn : item.labelEn;

            return (
              <div key={item.id} className="relative group">
                <button
                  onClick={() => onSelectSection(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-150 cursor-pointer ${
                    isActive
                      ? 'bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 font-bold border-l-3 border-indigo-600'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100/80 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-slate-100'
                  } ${isCollapsed ? 'justify-center px-0' : ''}`}
                >
                  <span className={isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}>
                    {item.icon}
                  </span>

                  {!isCollapsed && (
                    <div className="flex-1 flex items-center justify-between text-left truncate">
                      <span className="truncate">{label}</span>
                      {item.badge && (
                        <span className="text-[9px] bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-mono px-1.5 py-0.2 rounded font-bold">
                          {item.badge}
                        </span>
                      )}
                    </div>
                  )}
                </button>

                {isCollapsed && (
                  <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 px-2.5 py-1 bg-slate-900 text-white text-[11px] font-semibold rounded-lg shadow-xl whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-50">
                    {label}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Bottom Zone: Collapse/Expand Sidebar Trigger Button */}
      <div className="p-3 border-t border-slate-200/80 dark:border-slate-800">
        <button
          onClick={onToggleCollapse}
          className="w-full flex items-center justify-center gap-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-700/80 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 text-xs font-semibold transition cursor-pointer"
          title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <>
              <ChevronLeft className="w-4 h-4" />
              <span className="truncate">{lang === 'bn' ? 'সাইডবার গুটিয়ে নিন' : 'Collapse Sidebar'}</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
};
