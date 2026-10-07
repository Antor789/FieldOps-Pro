import React, { useState } from 'react';
import { useReportBuilder } from '../hooks/useReportBuilder';
import { AVAILABLE_FIELDS_BY_SOURCE } from '../data/reportTemplates';
import { ColumnSelector, ChartBuilder, ReportSummary, ReportChart, ReportTable } from '../components/reports';
import { ReportTemplate, GeneratedReport } from '../types/reports';
import {
  Wrench,
  FileSpreadsheet,
  Users,
  Trophy,
  Boxes,
  CreditCard,
  ArrowRight,
  ArrowLeft,
  Save,
  Play,
  Eye,
  CheckCircle2,
  X,
  SlidersHorizontal,
} from 'lucide-react';

export interface ReportBuilderProps {
  onClose: () => void;
  onSaveTemplate: (template: ReportTemplate) => void;
  onGenerate: (report: GeneratedReport) => void;
  locale?: 'en' | 'bn';
}

const DATA_SOURCES = [
  { id: 'work_orders', label: 'Work Orders', desc: 'Field tasks, SLA, statuses', icon: Wrench },
  { id: 'invoices', label: 'Invoices & Billing', desc: 'Turnover, VAT, payment status', icon: FileSpreadsheet },
  { id: 'customers', label: 'Customers & CRM', desc: 'Accounts, AMC contracts, sites', icon: Users },
  { id: 'technicians', label: 'Technicians Fleet', desc: 'Performance, jobs, CSAT ratings', icon: Trophy },
  { id: 'inventory', label: 'Inventory & Parts', desc: 'Hardware SKU, consumed units', icon: Boxes },
  { id: 'payments', label: 'Payments & MFS', desc: 'bKash, Nagad, bank settlements', icon: CreditCard },
];

export const ReportBuilderPage: React.FC<ReportBuilderProps> = ({
  onClose,
  onSaveTemplate,
  onGenerate,
  locale = 'en',
}) => {
  const {
    step,
    setStep,
    config,
    setName,
    setDescription,
    setCategory,
    setDataSource,
    setFilter,
    addColumn,
    removeColumn,
    reorderColumns,
    setGroupBy,
    setSortBy,
    setShowSubtotals,
    addChart,
    removeChart,
    generatePreview,
    previewReport,
    saveAsTemplate,
  } = useReportBuilder();

  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);

  const availableCols = AVAILABLE_FIELDS_BY_SOURCE[config.dataSource] || [];

  const handlePreview = () => {
    const report = generatePreview();
    if (report) {
      setIsPreviewModalOpen(true);
    }
  };

  const handleFinalGenerate = () => {
    const report = generatePreview();
    if (report) {
      onGenerate(report);
    }
  };

  const handleSaveAndGenerate = () => {
    const template = saveAsTemplate();
    onSaveTemplate(template);
    const report = generatePreview();
    if (report) {
      onGenerate(report);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
            <SlidersHorizontal className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
              {locale === 'bn' ? 'কাস্টম রিপোর্ট বিল্ডার' : 'Custom Report Builder'}
            </h2>
            <p className="text-xs text-slate-500">
              {locale === 'bn'
                ? 'আপনার প্রয়োজন অনুযায়ী ডেটাসোর্স, ফিল্টার, কলাম এবং ভিজ্যুয়ালাইজেশন কাস্টমাইজ করুন।'
                : 'Build tailored business intelligence reports with custom filters, columns, and charts.'}
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 self-end sm:self-auto"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Step Indicators */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-3 shadow-xs">
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
          {[
            { num: 1, label: 'Data Source' },
            { num: 2, label: 'Filters' },
            { num: 3, label: 'Columns' },
            { num: 4, label: 'Grouping' },
            { num: 5, label: 'Charts' },
          ].map((s) => (
            <button
              key={s.num}
              onClick={() => setStep(s.num)}
              className={`p-2 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all ${
                step === s.num
                  ? 'bg-emerald-600 text-white shadow-2xs'
                  : step > s.num
                  ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                  : 'bg-slate-50 dark:bg-slate-800 text-slate-500 hover:bg-slate-100'
              }`}
            >
              <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] bg-black/10 dark:bg-white/10 font-bold">
                {step > s.num ? '✓' : s.num}
              </span>
              <span>{s.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Report Basic Info Input */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Report Name *
            </label>
            <input
              type="text"
              required
              value={config.name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Q1 Operations Revenue Analysis"
              className="w-full text-xs py-2 px-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-medium"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Category
            </label>
            <select
              value={config.category}
              onChange={(e) => setCategory(e.target.value as any)}
              className="w-full text-xs py-2 px-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
            >
              <option value="operations">Operations (অপারেশন)</option>
              <option value="financial">Financial (ফাইন্যান্সিয়াল)</option>
              <option value="technician">Technician (টেকনিশিয়ান)</option>
              <option value="customer">Customer CRM (গ্রাহক)</option>
              <option value="inventory">Inventory (ইনভেন্টরি)</option>
              <option value="compliance">Compliance & VAT (ট্যাক্স/ভ্যাট)</option>
            </select>
          </div>
        </div>
      </div>

      {/* STEP 1: DATA SOURCE */}
      {step === 1 && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-4">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Step 1: Select Primary Data Source
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Choose the foundational dataset to power your reports and charts.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {DATA_SOURCES.map((ds) => {
              const Icon = ds.icon;
              const selected = config.dataSource === ds.id;
              return (
                <button
                  key={ds.id}
                  type="button"
                  onClick={() => setDataSource(ds.id as any)}
                  className={`p-4 rounded-2xl border text-left flex items-start gap-3 transition-all ${
                    selected
                      ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-500 ring-2 ring-emerald-500/20 shadow-xs'
                      : 'bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                  }`}
                >
                  <div
                    className={`p-2.5 rounded-xl shrink-0 ${
                      selected
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                      {ds.label}
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      {ds.desc}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* STEP 2: FILTERS */}
      {step === 2 && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-4">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Step 2: Define Filters & Scope
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Narrow down records by date range, division, and status criteria.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Date Range *
              </label>
              <select
                value={config.filters.dateRange || 'this_month'}
                onChange={(e) => setFilter('dateRange', e.target.value)}
                className="w-full text-xs py-2 px-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
              >
                <option value="today">Today</option>
                <option value="last_7_days">Last 7 Days</option>
                <option value="last_30_days">Last 30 Days</option>
                <option value="this_month">This Month</option>
                <option value="last_month">Last Month</option>
                <option value="this_quarter">This Quarter</option>
                <option value="this_year">This Year</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Geographic Division
              </label>
              <select
                value={config.filters.division || 'ALL'}
                onChange={(e) => setFilter('division', e.target.value)}
                className="w-full text-xs py-2 px-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
              >
                <option value="ALL">All Divisions (সমগ্র বাংলাদেশ)</option>
                <option value="DHAKA">Dhaka Division (ঢাকা)</option>
                <option value="CHITTAGONG">Chittagong Division (চট্টগ্রাম)</option>
                <option value="SYLHET">Sylhet Division (সিলেট)</option>
                <option value="RAJSHAHI">Rajshahi Division (রাজশাহী)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Service Category
              </label>
              <select
                value={config.filters.serviceType || 'ALL'}
                onChange={(e) => setFilter('serviceType', e.target.value)}
                className="w-full text-xs py-2 px-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
              >
                <option value="ALL">All Categories</option>
                <option value="Electrical">Electrical & Power</option>
                <option value="HVAC">HVAC & Cooling</option>
                <option value="Plumbing">Plumbing & Emergency</option>
                <option value="Telecom">Telecom & Optical Fiber</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* STEP 3: COLUMNS */}
      {step === 3 && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-4">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Step 3: Pick & Reorder Columns
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Select which fields should be included in the table and drag/reorder their position.
            </p>
          </div>

          <ColumnSelector
            availableColumns={availableCols}
            selectedColumns={config.columns}
            onAddColumn={addColumn}
            onRemoveColumn={removeColumn}
            onReorderColumns={reorderColumns}
            locale={locale}
          />
        </div>
      )}

      {/* STEP 4: GROUPING & SORTING */}
      {step === 4 && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-5">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Step 4: Grouping & Sorting
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Specify how records should be aggregated and ordered.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Group By Field
              </label>
              <select
                value={config.groupBy || ''}
                onChange={(e) => setGroupBy(e.target.value)}
                className="w-full text-xs py-2 px-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
              >
                <option value="">None (Flat Records)</option>
                {config.columns.map((c) => (
                  <option key={c.field} value={c.field}>
                    {c.header}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Sort By Field
              </label>
              <select
                value={config.sortBy || ''}
                onChange={(e) => setSortBy(e.target.value, config.sortOrder)}
                className="w-full text-xs py-2 px-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
              >
                {config.columns.map((c) => (
                  <option key={c.field} value={c.field}>
                    {c.header}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-xs">
            <div>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                Sort Order:
              </span>
              <div className="inline-flex items-center gap-3 ml-3">
                <label className="inline-flex items-center gap-1 cursor-pointer">
                  <input
                    type="radio"
                    name="sortOrder"
                    checked={config.sortOrder === 'asc'}
                    onChange={() => setSortBy(config.sortBy || 'id', 'asc')}
                    className="text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>Ascending</span>
                </label>
                <label className="inline-flex items-center gap-1 cursor-pointer">
                  <input
                    type="radio"
                    name="sortOrder"
                    checked={config.sortOrder === 'desc'}
                    onChange={() => setSortBy(config.sortBy || 'id', 'desc')}
                    className="text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>Descending</span>
                </label>
              </div>
            </div>

            <label className="inline-flex items-center gap-2 cursor-pointer font-semibold">
              <input
                type="checkbox"
                checked={config.showSubtotals}
                onChange={(e) => setShowSubtotals(e.target.checked)}
                className="rounded text-emerald-600 focus:ring-emerald-500"
              />
              <span>Calculate Group Subtotals</span>
            </label>
          </div>
        </div>
      )}

      {/* STEP 5: VISUALIZATIONS */}
      {step === 5 && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-4">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Step 5: Visual Charts & Analytics
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Add interactive Bar, Pie, Line, and Area charts to accompany your table.
            </p>
          </div>

          <ChartBuilder
            charts={config.charts}
            columns={config.columns}
            onAddChart={addChart}
            onRemoveChart={removeChart}
            locale={locale}
          />
        </div>
      )}

      {/* Navigation & Action Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {step > 1 && (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold flex items-center gap-1 text-slate-700 dark:text-slate-300"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          )}

          {step < 5 && (
            <button
              type="button"
              onClick={() => setStep(step + 1)}
              className="py-2 px-4 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-semibold flex items-center gap-1"
            >
              <span>Next Step</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePreview}
            className="py-2 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Eye className="w-3.5 h-3.5 text-blue-500" />
            <span>{locale === 'bn' ? 'প্রিভিউ দেখুন' : 'Preview Report'}</span>
          </button>

          <button
            type="button"
            onClick={handleSaveAndGenerate}
            className="py-2 px-3.5 rounded-xl border border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-300 text-xs font-semibold flex items-center gap-1.5 hover:bg-emerald-100 transition-colors"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{locale === 'bn' ? 'টেমপ্লেট সেভ করুন' : 'Save Template'}</span>
          </button>

          <button
            type="button"
            onClick={handleFinalGenerate}
            className="py-2 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            <span>{locale === 'bn' ? 'রিপোর্ট চালু করুন' : 'Run & View Report'}</span>
          </button>
        </div>
      </div>

      {/* Preview Modal */}
      {isPreviewModalOpen && previewReport && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 w-full max-w-4xl shadow-2xl space-y-5 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Eye className="w-5 h-5 text-emerald-500" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Report Preview: {previewReport.templateName}
                </h3>
              </div>
              <button
                onClick={() => setIsPreviewModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
              >
                ✕
              </button>
            </div>

            <ReportSummary summary={previewReport.summary} locale={locale} />

            {previewReport.charts && previewReport.charts.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {previewReport.charts.map((c) => (
                  <ReportChart key={c.id} chart={c} data={previewReport.data} locale={locale} />
                ))}
              </div>
            )}

            <ReportTable columns={previewReport.columns} data={previewReport.data} locale={locale} />

            <div className="flex justify-end pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setIsPreviewModalOpen(false)}
                className="py-2 px-4 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-semibold"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
