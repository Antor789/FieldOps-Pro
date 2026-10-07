import React, { useState } from 'react';
import { useAuditLog } from '../../hooks/useAuditLog';
import { AuditEntry } from '../../types/audit';
import { AuditFilters } from '../../components/audit/AuditFilters';
import { AuditLogTable } from '../../components/audit/AuditLogTable';
import { AuditEntryDetail } from '../../components/audit/AuditEntryDetail';
import { ActivityTimeline } from '../../components/audit/ActivityTimeline';
import { AuditStats } from '../../components/audit/AuditStats';
import { SecurityAlertsPage } from './SecurityAlerts';
import { AuditLogDetailPage } from './AuditLogDetail';
import {
  FileText,
  Download,
  ShieldAlert,
  Clock,
  LayoutList,
  Activity,
  FileSpreadsheet,
  Loader2,
  Sparkles,
} from 'lucide-react';

export interface AuditLogPageProps {
  locale?: 'en' | 'bn';
}

export const AuditLogPage: React.FC<AuditLogPageProps> = ({ locale = 'en' }) => {
  const {
    filteredLogs,
    paginatedLogs,
    currentPage,
    setCurrentPage,
    totalPages,
    pageSize,
    isLoading,
    filters,
    setFilters,
    clearFilters,
    exportLogs,
    statsSummary,
  } = useAuditLog(50);

  // Active view tab: 'table' | 'timeline' | 'stats' | 'alerts'
  const [activeTab, setActiveTab] = useState<'table' | 'timeline' | 'stats' | 'alerts'>('table');

  // Selected entry for detail slide-over
  const [selectedEntry, setSelectedEntry] = useState<AuditEntry | null>(null);

  // Selected entry for standalone full page detail view
  const [fullPageDetailEntry, setFullPageDetailEntry] = useState<AuditEntry | null>(null);

  // If user opened full page detail view
  if (fullPageDetailEntry) {
    return (
      <AuditLogDetailPage
        entry={fullPageDetailEntry}
        onBack={() => setFullPageDetailEntry(null)}
        locale={locale}
      />
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn font-sans pb-12">
      {/* Top Header & Export Buttons */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                {locale === 'bn' ? 'অডিট লগ ও নিরাপত্তা ট্র্যাকিং' : 'Audit Log & Security Activity Trail'}
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Immutable event record for statutory NBR compliance, user authentication, and system mutations.
              </p>
            </div>
          </div>
        </div>

        {/* Export Actions */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            type="button"
            disabled={isLoading}
            onClick={() => exportLogs('csv')}
            className="flex-1 sm:flex-initial py-2.5 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>Export CSV</span>
          </button>

          <button
            type="button"
            disabled={isLoading}
            onClick={() => exportLogs('pdf')}
            className="flex-1 sm:flex-initial py-2.5 px-4 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold hover:bg-slate-800 dark:hover:bg-slate-100 transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            <span>Export PDF</span>
          </button>
        </div>
      </div>

      {/* Primary KPI Stats Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Total Logged Events
          </span>
          <span className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-mono mt-0.5 block">
            {statsSummary.totalLogs.toLocaleString()}
          </span>
        </div>

        <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            ⚠️ Warning Alerts
          </span>
          <span className="text-xl sm:text-2xl font-black text-amber-500 font-mono mt-0.5 block">
            {statsSummary.warningsCount}
          </span>
        </div>

        <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            🔴 Critical Incidents
          </span>
          <span className="text-xl sm:text-2xl font-black text-rose-500 font-mono mt-0.5 block">
            {statsSummary.criticalCount}
          </span>
        </div>

        <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Events Today (BST)
          </span>
          <span className="text-xl sm:text-2xl font-black text-emerald-500 font-mono mt-0.5 block">
            {statsSummary.todayCount}
          </span>
        </div>
      </div>

      {/* Sub-Tabs: Table vs Timeline vs Analytics vs Alerts */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 text-xs font-semibold">
        <button
          type="button"
          onClick={() => setActiveTab('table')}
          className={`py-2.5 px-4 border-b-2 transition cursor-pointer flex items-center gap-2 ${
            activeTab === 'table'
              ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <LayoutList className="w-4 h-4" />
          <span>Audit Log Table ({filteredLogs.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('alerts')}
          className={`py-2.5 px-4 border-b-2 transition cursor-pointer flex items-center gap-2 ${
            activeTab === 'alerts'
              ? 'border-rose-500 text-rose-600 dark:text-rose-400 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <ShieldAlert className="w-4 h-4 text-rose-500" />
          <span>Security Incident Alerts (4)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('timeline')}
          className={`py-2.5 px-4 border-b-2 transition cursor-pointer flex items-center gap-2 ${
            activeTab === 'timeline'
              ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Activity Timeline Feed</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('stats')}
          className={`py-2.5 px-4 border-b-2 transition cursor-pointer flex items-center gap-2 ${
            activeTab === 'stats'
              ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>Security & Activity Analytics</span>
        </button>
      </div>

      {/* TAB 1: AUDIT LOG TABLE + FILTERS */}
      {activeTab === 'table' && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <AuditFilters
            filters={filters}
            onChange={setFilters}
            onClear={clearFilters}
            locale={locale}
          />

          {/* Table */}
          <AuditLogTable
            entries={paginatedLogs}
            totalEntriesCount={filteredLogs.length}
            currentPage={currentPage}
            totalPages={totalPages}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
            onSelectEntry={(entry) => setSelectedEntry(entry)}
            locale={locale}
          />
        </div>
      )}

      {/* TAB 2: SECURITY ALERTS */}
      {activeTab === 'alerts' && (
        <SecurityAlertsPage locale={locale} />
      )}

      {/* TAB 3: ACTIVITY TIMELINE */}
      {activeTab === 'timeline' && (
        <ActivityTimeline
          entries={paginatedLogs}
          onSelectEntry={(entry) => setSelectedEntry(entry)}
          locale={locale}
        />
      )}

      {/* TAB 4: AUDIT STATS & CHARTS */}
      {activeTab === 'stats' && (
        <AuditStats stats={statsSummary} locale={locale} />
      )}

      {/* Slide-over Detail Panel */}
      {selectedEntry && (
        <AuditEntryDetail
          entry={selectedEntry}
          onClose={() => setSelectedEntry(null)}
          onViewRelatedEntity={(type, id) => {
            setSelectedEntry(null);
            setFullPageDetailEntry(selectedEntry);
          }}
          locale={locale}
        />
      )}
    </div>
  );
};
