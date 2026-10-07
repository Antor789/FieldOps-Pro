import React, { useState } from 'react';
import { useScheduledReports } from '../hooks/useScheduledReports';
import { ScheduledReport, ReportTemplate } from '../types/reports';
import { ScheduleModal } from '../components/reports/ScheduleModal';
import { REPORT_TEMPLATES } from '../data/reportTemplates';
import {
  Calendar,
  Clock,
  Mail,
  Plus,
  Play,
  Pause,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Check,
  Send,
} from 'lucide-react';

export interface ScheduledReportsProps {
  locale?: 'en' | 'bn';
}

export const ScheduledReportsPage: React.FC<ScheduledReportsProps> = ({ locale = 'en' }) => {
  const { schedules, deliveryLogs, togglePause, deleteSchedule, createSchedule, triggerImmediateRun } =
    useScheduledReports();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<ReportTemplate>(REPORT_TEMPLATES[0]);

  const handleOpenScheduleModal = (tpl?: ReportTemplate) => {
    if (tpl) setSelectedTemplate(tpl);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
              {locale === 'bn' ? 'স্বয়ংক্রিয় শিডিউলড রিপোর্ট' : 'Automated Scheduled Reports'}
            </h2>
            <p className="text-xs text-slate-500">
              {locale === 'bn'
                ? 'দৈনিক, সাপ্তাহিক বা মাসিক ভিত্তিতে স্বয়ংক্রিয় ইমেইল ও পিডিএফ রিপোর্ট ডেলিভারি ব্যবস্থা।'
                : 'Automated background cron dispatches sending PDF, Excel, and CSV digests to stakeholders.'}
            </p>
          </div>
        </div>

        <button
          onClick={() => handleOpenScheduleModal()}
          className="py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>{locale === 'bn' ? 'নতুন শিডিউল যোগ করুন' : 'Schedule Report'}</span>
        </button>
      </div>

      {/* Schedules Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Active Scheduled Jobs ({schedules.length})
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-500 uppercase">
                <th className="py-2.5 px-4">Report Template</th>
                <th className="py-2.5 px-4">Frequency</th>
                <th className="py-2.5 px-4">Next Delivery (BST)</th>
                <th className="py-2.5 px-4">Format</th>
                <th className="py-2.5 px-4">Recipients</th>
                <th className="py-2.5 px-4 text-center">Status</th>
                <th className="py-2.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {schedules.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-900 dark:text-white">{s.templateName}</div>
                    <div className="text-[10px] text-slate-400 font-mono">Timezone: {s.timezone}</div>
                  </td>

                  <td className="py-3 px-4">
                    <span className="inline-block uppercase font-bold text-[10px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {s.frequency} ({s.time})
                    </span>
                  </td>

                  <td className="py-3 px-4 font-mono text-slate-700 dark:text-slate-300">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{s.nextRunAt}</span>
                    </div>
                  </td>

                  <td className="py-3 px-4">
                    <span className="uppercase text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                      {s.format}
                    </span>
                  </td>

                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1 text-slate-600 dark:text-slate-300">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      <span>{s.recipients.length} recipient(s)</span>
                    </div>
                  </td>

                  <td className="py-3 px-4 text-center">
                    {s.isActive ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                        <CheckCircle2 className="w-3 h-3" />
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                        <AlertCircle className="w-3 h-3" />
                        Paused
                      </span>
                    )}
                  </td>

                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      {/* Test Run */}
                      <button
                        onClick={() => triggerImmediateRun(s)}
                        title="Send immediate test email"
                        className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
                      >
                        <Send className="w-3.5 h-3.5 text-blue-500" />
                      </button>

                      {/* Pause / Resume */}
                      <button
                        onClick={() => togglePause(s.id)}
                        title={s.isActive ? 'Pause Schedule' : 'Resume Schedule'}
                        className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
                      >
                        {s.isActive ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                      </button>

                      {/* Delete */}
                      <button
                        onClick={() => deleteSchedule(s.id)}
                        title="Delete schedule"
                        className="p-1.5 rounded-lg border border-rose-200 dark:border-rose-900/50 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-rose-500 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Delivery Audit Log */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Recent Deliveries & Dispatch History
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-500 uppercase">
                <th className="py-2.5 px-4">Report</th>
                <th className="py-2.5 px-4">Delivered At</th>
                <th className="py-2.5 px-4">Format</th>
                <th className="py-2.5 px-4">Recipients Summary</th>
                <th className="py-2.5 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {deliveryLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                  <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white">
                    {log.reportName}
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-600 dark:text-slate-400">
                    {log.deliveredAt}
                  </td>
                  <td className="py-3 px-4">
                    <span className="uppercase text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                      {log.format}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-600 dark:text-slate-300">
                    {log.recipientsSummary}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                      <Check className="w-3 h-3" />
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Schedule Modal */}
      {isModalOpen && (
        <ScheduleModal
          template={selectedTemplate}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSchedule={createSchedule}
          locale={locale}
        />
      )}
    </div>
  );
};
