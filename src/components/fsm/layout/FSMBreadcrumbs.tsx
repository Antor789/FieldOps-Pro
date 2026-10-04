import React from 'react';
import {
  ChevronRight,
  Home,
  MapPin,
  Sparkles,
  Cpu,
  Plus,
  Download,
  LayoutGrid,
  Columns3,
  Map,
  Maximize2,
  Minimize2,
  Table as TableIcon,
} from 'lucide-react';
import { Button } from '../../ui/Button';
import { Language } from '../../../lib/i18n';

export type FSMViewMode = 'kanban' | 'split-map' | 'full-map' | 'table';

interface FSMBreadcrumbsProps {
  currentSectionTitle: string;
  subLocation?: string;
  lang: Language;
  viewMode: FSMViewMode;
  onChangeViewMode: (mode: FSMViewMode) => void;
  onOpenCreateOrder: () => void;
  onAutoDispatchAll: () => void;
  isDispatchingAll?: boolean;
}

export const FSMBreadcrumbs: React.FC<FSMBreadcrumbsProps> = ({
  currentSectionTitle,
  subLocation = 'Dhaka Division • Gulshan NOC',
  lang,
  viewMode,
  onChangeViewMode,
  onOpenCreateOrder,
  onAutoDispatchAll,
  isDispatchingAll = false,
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-sans pb-1">
      {/* 1. Breadcrumbs Trail & Section Title */}
      <div className="space-y-1">
        {/* Breadcrumb Trail */}
        <nav className="flex items-center space-x-1.5 text-[11px] text-slate-500 dark:text-slate-400 font-medium">
          <span className="flex items-center hover:text-indigo-600 transition cursor-pointer">
            <Home className="w-3.5 h-3.5 mr-1 text-slate-400" />
            <span>FieldOps Pro</span>
          </span>
          <ChevronRight className="w-3 h-3 text-slate-300 dark:text-slate-600" />
          <span className="hover:text-indigo-600 transition cursor-pointer">Bangladesh Ops</span>
          <ChevronRight className="w-3 h-3 text-slate-300 dark:text-slate-600" />
          <span className="text-indigo-600 dark:text-indigo-400 font-semibold">{currentSectionTitle}</span>
        </nav>

        {/* Title and Sub-location */}
        <div className="flex items-center space-x-2">
          <h1 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            {currentSectionTitle}
          </h1>
          <span className="hidden md:inline-flex items-center text-[10px] text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-2 py-0.5 rounded-md font-mono font-medium">
            <MapPin className="w-3 h-3 text-indigo-500 mr-1" />
            {subLocation}
          </span>
        </div>
      </div>

      {/* 2. Actions & View Mode Controls */}
      <div className="flex items-center flex-wrap gap-2">
        {/* View Mode Segmented Controls */}
        <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-semibold">
          <button
            onClick={() => onChangeViewMode('kanban')}
            className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg transition cursor-pointer ${
              viewMode === 'kanban'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-2xs font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
            title="Kanban Board View"
          >
            <Columns3 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Kanban</span>
          </button>

          <button
            onClick={() => onChangeViewMode('split-map')}
            className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg transition cursor-pointer ${
              viewMode === 'split-map'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-2xs font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
            title="Split Kanban & Live Dhaka Map"
          >
            <Map className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Split Map</span>
          </button>

          <button
            onClick={() => onChangeViewMode('full-map')}
            className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg transition cursor-pointer ${
              viewMode === 'full-map'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-2xs font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
            title="Full Screen GPS Map Mode"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Full Map</span>
          </button>
        </div>

        {/* AI Auto-Dispatch Button */}
        <Button
          size="sm"
          variant="ai"
          isLoading={isDispatchingAll}
          onClick={onAutoDispatchAll}
          leftIcon={<Cpu className="w-3.5 h-3.5" />}
        >
          <span>AI Auto-Dispatch</span>
        </Button>

        {/* + Create Work Order Button */}
        <Button
          size="sm"
          variant="primary"
          onClick={onOpenCreateOrder}
          leftIcon={<Plus className="w-3.5 h-3.5" />}
        >
          <span>{lang === 'bn' ? '+ নতুন অর্ডার' : '+ Create Order'}</span>
        </Button>
      </div>
    </div>
  );
};
