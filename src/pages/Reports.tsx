import React, { useState } from 'react';
import { useReports } from '../hooks/useReports';
import { ReportTemplate, ReportCategory, GeneratedReport } from '../types/reports';
import { ReportCard, ScheduleModal } from '../components/reports';
import { ReportViewerPage } from './ReportViewer';
import { ReportBuilderPage } from './ReportBuilder';
import { ScheduledReportsPage } from './ScheduledReports';
import {
  FileText,
  Plus,
  Calendar,
  Search,
  SlidersHorizontal,
  ClipboardList,
  DollarSign,
  Trophy,
  Users,
  Boxes,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { useScheduledReports } from '../hooks/useScheduledReports';

export interface ReportsPageProps {
  locale?: 'en' | 'bn';
}

type ActiveView = 'library' | 'viewer' | 'builder' | 'schedules';

export const ReportsPage: React.FC<ReportsPageProps> = ({ locale = 'en' }) => {
  const {
    filteredTemplates,
    templatesByCategory,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    activeReport,
    setActiveReport,
    generateReport,
    saveTemplate,
  } = useReports();

  const { createSchedule } = useScheduledReports();

  const [view, setView] = useState<ActiveView>('library');
  const [selectedTemplateForSchedule, setSelectedTemplateForSchedule] = useState<ReportTemplate | null>(null);
  const [activeTemplateForViewer, setActiveTemplateForViewer] = useState<ReportTemplate | undefined>(undefined);

  // Generate and transition to viewer
  const handleGenerateTemplate = (template: ReportTemplate) => {
    setActiveTemplateForViewer(template);
    const report = generateReport(template.id);
    if (report) {
      setView('viewer');
    }
  };

  // Schedule modal handler
  const handleScheduleTemplate = (template: ReportTemplate) => {
    setSelectedTemplateForSchedule(template);
  };

  const handleCustomReportGenerated = (report: GeneratedReport) => {
    setActiveReport(report);
    setActiveTemplateForViewer(undefined);
    setView('viewer');
  };

  const CATEGORIES: { id: ReportCategory | 'all'; label: string; labelBn: string; icon: any }[] = [
    { id: 'all', label: 'All Reports', labelBn: 'সকল রিপোর্ট', icon: FileText },
    { id: 'operations', label: 'Operations', labelBn: 'অপারেশন', icon: ClipboardList },
    { id: 'financial', label: 'Financial', labelBn: 'ফাইন্যান্সিয়াল', icon: DollarSign },
    { id: 'technician', label: 'Technician', labelBn: 'টেকনিশিয়ান', icon: Trophy },
    { id: 'customer', label: 'Customer CRM', labelBn: 'গ্রাহক', icon: Users },
    { id: 'inventory', label: 'Inventory', labelBn: 'ইনভেন্টরি', icon: Boxes },
    { id: 'compliance', label: 'NBR VAT & Tax', labelBn: 'এনবিআর ভ্যাট', icon: ShieldCheck },
  ];

  // SUB-VIEW: REPORT VIEWER
  if (view === 'viewer' && activeReport) {
    return (
      <ReportViewerPage
        report={activeReport}
        template={activeTemplateForViewer}
        onBack={() => setView('library')}
        locale={locale}
      />
    );
  }

  // SUB-VIEW: CUSTOM REPORT BUILDER
  if (view === 'builder') {
    return (
      <ReportBuilderPage
        onClose={() => setView('library')}
        onSaveTemplate={(newTpl) => {
          saveTemplate(newTpl);
        }}
        onGenerate={handleCustomReportGenerated}
        locale={locale}
      />
    );
  }

  // SUB-VIEW: SCHEDULED REPORTS MANAGER
  if (view === 'schedules') {
    return (
      <div className="space-y-6">
        <button
          onClick={() => setView('library')}
          className="text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 flex items-center gap-1.5 transition-colors"
        >
          ← {locale === 'bn' ? 'রিপোর্ট লাইব্রেরিতে ফিরুন' : 'Back to Library'}
        </button>
        <ScheduledReportsPage locale={locale} />
      </div>
    );
  }

  // MAIN VIEW: REPORTS LIBRARY
  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                {locale === 'bn' ? 'রিপোর্টস ও বিজনেস ইন্টেলিজেন্স' : 'Reports & Business Intelligence'}
              </h2>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                v2.6
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {locale === 'bn'
                ? 'ফিল্ড সার্ভিস পারফরম্যান্স, এনবিআর ১৫% মূসক চালান, টেকনিশিয়ান র্যাঙ্কিং এবং কাস্টম রিপোর্ট এক্সপোর্ট।'
                : 'Pre-built executive reports, custom BI builder, NBR 15% VAT returns, and multi-format exports (PDF, Excel, CSV).'}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setView('schedules')}
            className="py-2.5 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/60 text-slate-800 dark:text-slate-200 text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <Calendar className="w-4 h-4 text-emerald-500" />
            <span>{locale === 'bn' ? 'শিডিউলড রিপোর্ট' : 'Scheduled Reports'}</span>
          </button>

          <button
            onClick={() => setView('builder')}
            className="py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>{locale === 'bn' ? 'কাস্টম রিপোর্ট তৈরি' : 'Create Custom Report'}</span>
          </button>
        </div>
      </div>

      {/* Category Pills & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const active = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`py-2 px-3.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 shrink-0 transition-all ${
                  active
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xs'
                    : 'bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/60'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{locale === 'bn' ? cat.labelBn : cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={locale === 'bn' ? 'রিপোর্ট খুঁজুন...' : 'Search reports...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs py-2 pl-8 pr-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 shadow-2xs"
          />
        </div>
      </div>

      {/* TEMPLATE CARDS SECTIONS */}
      {selectedCategory === 'all' ? (
        <div className="space-y-8">
          {/* Operations Reports */}
          {templatesByCategory.operations.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-200 dark:border-slate-800">
                <ClipboardList className="w-4 h-4 text-blue-500" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  {locale === 'bn' ? 'অপারেশনাল রিপোর্টস' : 'Operations Reports'}
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {templatesByCategory.operations.map((tpl) => (
                  <ReportCard
                    key={tpl.id}
                    template={tpl}
                    locale={locale}
                    onGenerate={handleGenerateTemplate}
                    onSchedule={handleScheduleTemplate}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Financial Reports */}
          {templatesByCategory.financial.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-200 dark:border-slate-800">
                <DollarSign className="w-4 h-4 text-emerald-500" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  {locale === 'bn' ? 'ফাইন্যান্সিয়াল ও বিলিং রিপোর্টস' : 'Financial & Billing Reports'}
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {templatesByCategory.financial.map((tpl) => (
                  <ReportCard
                    key={tpl.id}
                    template={tpl}
                    locale={locale}
                    onGenerate={handleGenerateTemplate}
                    onSchedule={handleScheduleTemplate}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Compliance & NBR VAT */}
          {templatesByCategory.compliance.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-200 dark:border-slate-800">
                <ShieldCheck className="w-4 h-4 text-rose-500" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  {locale === 'bn' ? 'এনবিআর ভ্যাট ও ট্যাক্স কমপ্লায়েন্স' : 'NBR VAT Compliance & Statutory Tax'}
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {templatesByCategory.compliance.map((tpl) => (
                  <ReportCard
                    key={tpl.id}
                    template={tpl}
                    locale={locale}
                    onGenerate={handleGenerateTemplate}
                    onSchedule={handleScheduleTemplate}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Technician Reports */}
          {templatesByCategory.technician.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-200 dark:border-slate-800">
                <Trophy className="w-4 h-4 text-purple-500" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  {locale === 'bn' ? 'টেকনিশিয়ান ও ফ্লিট রিপোর্টস' : 'Technician & Workforce Reports'}
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {templatesByCategory.technician.map((tpl) => (
                  <ReportCard
                    key={tpl.id}
                    template={tpl}
                    locale={locale}
                    onGenerate={handleGenerateTemplate}
                    onSchedule={handleScheduleTemplate}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Customer CRM Reports */}
          {templatesByCategory.customer.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-200 dark:border-slate-800">
                <Users className="w-4 h-4 text-amber-500" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  {locale === 'bn' ? 'গ্রাহক সিআরএম ও চুক্তি রিপোর্টস' : 'Customer Relationship & AMC Reports'}
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {templatesByCategory.customer.map((tpl) => (
                  <ReportCard
                    key={tpl.id}
                    template={tpl}
                    locale={locale}
                    onGenerate={handleGenerateTemplate}
                    onSchedule={handleScheduleTemplate}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Inventory Reports */}
          {templatesByCategory.inventory.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-200 dark:border-slate-800">
                <Boxes className="w-4 h-4 text-cyan-500" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  {locale === 'bn' ? 'ইনভেন্টরি ও যন্ত্রাংশ ব্যবহার' : 'Inventory & Hardware Reports'}
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {templatesByCategory.inventory.map((tpl) => (
                  <ReportCard
                    key={tpl.id}
                    template={tpl}
                    locale={locale}
                    onGenerate={handleGenerateTemplate}
                    onSchedule={handleScheduleTemplate}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Filtered Category Grid */
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              {CATEGORIES.find((c) => c.id === selectedCategory)?.label} ({filteredTemplates.length})
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTemplates.map((tpl) => (
              <ReportCard
                key={tpl.id}
                template={tpl}
                locale={locale}
                onGenerate={handleGenerateTemplate}
                onSchedule={handleScheduleTemplate}
              />
            ))}
          </div>

          {filteredTemplates.length === 0 && (
            <div className="text-center py-16 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 text-slate-400">
              <p className="text-xs">
                {locale === 'bn' ? 'কোন রিপোর্ট পাওয়া যায়নি।' : 'No report templates match your search.'}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Schedule Modal */}
      {selectedTemplateForSchedule && (
        <ScheduleModal
          template={selectedTemplateForSchedule}
          isOpen={!!selectedTemplateForSchedule}
          onClose={() => setSelectedTemplateForSchedule(null)}
          onSchedule={createSchedule}
          locale={locale}
        />
      )}
    </div>
  );
};
