import React, { useState } from 'react';
import { CalendarEvent, CalendarTechnician, EventPriority } from '../../types/calendar';
import { formatCalendarDate } from '../../utils/calendarHelpers';
import { X, Calendar as CalIcon, Clock, User, MapPin, Sparkles, Check, DollarSign } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export interface ScheduleJobModalProps {
  isOpen: boolean;
  technicians: CalendarTechnician[];
  locale?: 'en' | 'bn';
  onClose: () => void;
  onSchedule: (eventData: Omit<CalendarEvent, 'id'>) => void;
}

export const ScheduleJobModal: React.FC<ScheduleJobModalProps> = ({
  isOpen,
  technicians,
  locale = 'en',
  onClose,
  onSchedule,
}) => {
  const { addToast } = useToast();

  const [title, setTitle] = useState('High-Voltage Substation Repair');
  const [titleBn, setTitleBn] = useState('উচ্চ-ভোল্টেজ সাবস্টেশন মেরামত');
  const [workOrderNumber, setWorkOrderNumber] = useState('WO-9015');
  const [priority, setPriority] = useState<EventPriority>('critical');
  const [selectedTechId, setSelectedTechId] = useState(technicians[0]?.id || 'tech-rahim');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [startHour, setStartHour] = useState(9);
  const [durationHours, setDurationHours] = useState(2);
  const [costBDT, setCostBDT] = useState(16500);
  const [location, setLocation] = useState('Gulshan 2 DCC Market Area, Dhaka');
  const [sendSms, setSendSms] = useState(true);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const matchedTech = technicians.find((t) => t.id === selectedTechId) || technicians[0];
    const start = new Date(selectedDate);
    start.setHours(startHour, 0, 0, 0);

    const end = new Date(start.getTime() + durationHours * 60 * 60 * 1000);

    onSchedule({
      workOrderId: `wo-${Date.now().toString().slice(-4)}`,
      workOrderNumber,
      title,
      titleBangla: titleBn,
      description: 'Scheduled field service dispatch.',
      start,
      end,
      durationMins: durationHours * 60,
      technicianId: matchedTech.id,
      technicianName: matchedTech.name,
      technicianRole: matchedTech.role,
      location,
      locationBangla: location,
      zone: matchedTech.currentZone,
      priority,
      status: 'scheduled',
      estimatedCostBDT: costBDT,
    });

    addToast({
      title: locale === 'bn' ? 'কাজ সফলভাবে শিডিউল হয়েছে' : 'Job Scheduled Successfully',
      message: `${workOrderNumber} assigned to ${matchedTech.name} for ${formatCalendarDate(start, locale)}.`,
      type: 'success',
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-scaleIn">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950/60">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400">
              <CalIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {locale === 'bn' ? 'নতুন কাজ শিডিউল করুন' : 'Schedule Work Order'}
              </h3>
              <p className="text-xs text-slate-500">
                {locale === 'bn' ? 'বাংলাদেশ ফিল্ড টেকনিশিয়ান ডিসপ্যাচ' : 'Bangladesh Dispatcher Calendar'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Job Title & WO# */}
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {locale === 'bn' ? 'কাজের বিবরণ (Title)' : 'Job Title'}
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                WO Number
              </label>
              <input
                type="text"
                required
                value={workOrderNumber}
                onChange={(e) => setWorkOrderNumber(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Priority & Cost */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {locale === 'bn' ? 'প্রায়োরিটি' : 'Priority'}
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as EventPriority)}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              >
                <option value="emergency">🚨 Emergency (30m SLA)</option>
                <option value="critical">🔴 Critical (1h SLA)</option>
                <option value="high">🟠 High (4h SLA)</option>
                <option value="medium">🔵 Medium (8h SLA)</option>
                <option value="low">⚪ Low (24h SLA)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {locale === 'bn' ? 'আনুমানিক চার্জ (৳ BDT)' : 'Est. Fee (৳ BDT)'}
              </label>
              <input
                type="number"
                value={costBDT}
                onChange={(e) => setCostBDT(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Technician Assignment */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              {locale === 'bn' ? 'টেকনিশিয়ান নির্বাচন করুন' : 'Assign Technician'}
            </label>
            <select
              value={selectedTechId}
              onChange={(e) => setSelectedTechId(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            >
              {technicians.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name} ({t.role}) — {t.currentZone} [{t.status}]
                </option>
              ))}
            </select>
          </div>

          {/* Date & Time Selection */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {locale === 'bn' ? 'তারিখ' : 'Date'}
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-2.5 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {locale === 'bn' ? 'শুরু' : 'Start Time'}
              </label>
              <select
                value={startHour}
                onChange={(e) => setStartHour(Number(e.target.value))}
                className="w-full px-2.5 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              >
                {[8, 9, 10, 11, 12, 13, 14, 15, 16, 17].map((h) => (
                  <option key={h} value={h}>
                    {h > 12 ? `${h - 12}:00 PM` : `${h}:00 AM`}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {locale === 'bn' ? 'সময়কাল' : 'Duration'}
              </label>
              <select
                value={durationHours}
                onChange={(e) => setDurationHours(Number(e.target.value))}
                className="w-full px-2.5 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              >
                <option value={1}>1 hour</option>
                <option value={1.5}>1.5 hours</option>
                <option value={2}>2 hours</option>
                <option value={3}>3 hours</option>
                <option value={4}>4 hours</option>
              </select>
            </div>
          </div>

          {/* Location Landmark */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              {locale === 'bn' ? 'লোকাল ল্যান্ডমার্ক ঠিকানা' : 'Dhaka Landmark Address'}
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          {/* Greenweb SMS Dispatch Trigger */}
          <label className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer pt-1">
            <input
              type="checkbox"
              checked={sendSms}
              onChange={(e) => setSendSms(e.target.checked)}
              className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
            />
            <span>{locale === 'bn' ? 'Greenweb SMS অ্যালার্ট পাঠান' : 'Send Greenweb SMS alert to customer & technician'}</span>
          </label>

          {/* Action Footer */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {locale === 'bn' ? 'বাতিল' : 'Cancel'}
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition-colors flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>{locale === 'bn' ? 'শিডিউল নিশ্চিত করুন' : 'Confirm Schedule'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
