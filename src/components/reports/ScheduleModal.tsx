import React, { useState } from 'react';
import { ReportTemplate, ReportFormat, ScheduledReport } from '../../types/reports';
import { Calendar, Clock, Mail, X, Plus, Check, Globe } from 'lucide-react';

export interface ScheduleModalProps {
  template: ReportTemplate;
  isOpen: boolean;
  onClose: () => void;
  onSchedule: (scheduleData: Omit<ScheduledReport, 'id' | 'createdAt' | 'lastStatus'>) => void;
  locale?: 'en' | 'bn';
}

export const ScheduleModal: React.FC<ScheduleModalProps> = ({
  template,
  isOpen,
  onClose,
  onSchedule,
  locale = 'en',
}) => {
  const [frequency, setFrequency] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [dayOfWeek, setDayOfWeek] = useState<number>(1); // Monday
  const [dayOfMonth, setDayOfMonth] = useState<number>(1);
  const [time, setTime] = useState<string>('09:00');
  const [format, setFormat] = useState<ReportFormat>('pdf');
  const [recipients, setRecipients] = useState<{ email: string; name?: string }[]>([
    { email: 'admin@fieldops.com.bd', name: 'NOC Lead' },
    { email: 'operations@fieldops.com.bd', name: 'Operations Dispatch' },
  ]);
  const [newEmail, setNewEmail] = useState('');

  if (!isOpen) return null;

  const handleAddRecipient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail || !newEmail.includes('@')) return;
    if (recipients.some((r) => r.email === newEmail)) return;
    setRecipients([...recipients, { email: newEmail }]);
    setNewEmail('');
  };

  const handleRemoveRecipient = (email: string) => {
    setRecipients(recipients.filter((r) => r.email !== email));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (recipients.length === 0) return;

    onSchedule({
      templateId: template.id,
      templateName: template.name,
      frequency,
      dayOfWeek: frequency === 'weekly' ? dayOfWeek : undefined,
      dayOfMonth: frequency === 'monthly' ? dayOfMonth : undefined,
      time,
      timezone: 'Asia/Dhaka',
      filters: { dateRange: frequency === 'daily' ? 'today' : frequency === 'weekly' ? 'last_7_days' : 'this_month' },
      format,
      recipients,
      isActive: true,
      nextRunAt: frequency === 'daily' ? `Tomorrow, ${time} BST` : `Next Cycle, ${time} BST`,
      createdBy: 'System User',
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 w-full max-w-lg shadow-2xl space-y-5 my-8">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                {locale === 'bn' ? 'স্বয়ংক্রিয় রিপোর্ট শিডিউল' : 'Automated Report Delivery'}
              </h3>
              <p className="text-xs text-slate-500">{template.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Frequency */}
          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
              Dispatch Frequency
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['daily', 'weekly', 'monthly'] as const).map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFrequency(f)}
                  className={`py-2 px-3 rounded-xl border text-xs font-semibold uppercase tracking-wider transition-all ${
                    frequency === f
                      ? 'bg-emerald-600 border-emerald-600 text-white shadow-2xs'
                      : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Time & Day */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                Time (BST / Dhaka)
              </label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full text-xs py-2 px-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
              />
            </div>

            {frequency === 'weekly' && (
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Day of Week
                </label>
                <select
                  value={dayOfWeek}
                  onChange={(e) => setDayOfWeek(Number(e.target.value))}
                  className="w-full text-xs py-2 px-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                >
                  <option value={0}>Sunday (রবিবার)</option>
                  <option value={1}>Monday (সোমবার)</option>
                  <option value={2}>Tuesday (মঙ্গলবার)</option>
                  <option value={3}>Wednesday (বুধবার)</option>
                  <option value={4}>Thursday (বৃহস্পতিবার)</option>
                  <option value={5}>Friday (শুক্রবার)</option>
                  <option value={6}>Saturday (শনিবার)</option>
                </select>
              </div>
            )}

            {frequency === 'monthly' && (
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Day of Month
                </label>
                <select
                  value={dayOfMonth}
                  onChange={(e) => setDayOfMonth(Number(e.target.value))}
                  className="w-full text-xs py-2 px-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                >
                  <option value={1}>1st of Month (১ম দিন)</option>
                  <option value={15}>15th of Month (১৫তম দিন)</option>
                  <option value={28}>End of Month</option>
                </select>
              </div>
            )}
          </div>

          {/* Export Format */}
          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
              Attachment Format
            </label>
            <div className="flex items-center gap-4 text-xs font-medium">
              {(['pdf', 'excel', 'csv'] as const).map((fmt) => (
                <label key={fmt} className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="scheduleFormat"
                    checked={format === fmt}
                    onChange={() => setFormat(fmt)}
                    className="text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="uppercase">{fmt}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Recipients List */}
          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1 flex items-center justify-between">
              <span>Recipients ({recipients.length})</span>
              <span className="text-[11px] font-normal text-slate-400">Email delivery</span>
            </label>

            {/* Email Chips */}
            <div className="flex flex-wrap gap-1.5 mb-2 max-h-24 overflow-y-auto">
              {recipients.map((r) => (
                <span
                  key={r.email}
                  className="inline-flex items-center gap-1 text-[11px] py-1 px-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200"
                >
                  <Mail className="w-3 h-3 text-slate-400" />
                  <span>{r.email}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveRecipient(r.email)}
                    className="text-slate-400 hover:text-rose-500"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>

            {/* Add Recipient Row */}
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Add manager or auditor email..."
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                className="flex-1 text-xs py-2 px-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
              />
              <button
                type="button"
                onClick={handleAddRecipient}
                className="py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-xs font-semibold flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </div>
          </div>

          {/* Preview Box */}
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 flex items-start gap-2.5">
            <Globe className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-slate-800 dark:text-slate-200">
                Scheduled Summary:
              </p>
              <p className="mt-0.5">
                Report will be compiled and delivered{' '}
                <strong className="text-emerald-600 dark:text-emerald-400">{frequency}</strong> at{' '}
                <strong>{time} BST</strong> to <strong>{recipients.length} recipients</strong> in{' '}
                <strong className="uppercase">{format}</strong> format.
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="py-2 px-4 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={recipients.length === 0}
              className="py-2 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-40"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Schedule Report</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
