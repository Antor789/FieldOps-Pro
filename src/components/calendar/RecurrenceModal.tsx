import React, { useState } from 'react';
import { X, Repeat, Check, Calendar as CalendarIcon } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export interface RecurrenceModalProps {
  isOpen: boolean;
  locale?: 'en' | 'bn';
  onClose: () => void;
  onSave?: (recurrenceData: any) => void;
}

const WEEKDAYS = [
  { id: 0, label: 'Sun', labelBn: 'রবি' },
  { id: 1, label: 'Mon', labelBn: 'সোম' },
  { id: 2, label: 'Tue', labelBn: 'মঙ্গল' },
  { id: 3, label: 'Wed', labelBn: 'বুধ' },
  { id: 4, label: 'Thu', labelBn: 'বৃহঃ' },
  { id: 5, label: 'Fri', labelBn: 'শুক্র' },
  { id: 6, label: 'Sat', labelBn: 'শনি' },
];

export const RecurrenceModal: React.FC<RecurrenceModalProps> = ({
  isOpen,
  locale = 'en',
  onClose,
  onSave,
}) => {
  const { addToast } = useToast();
  const [frequency, setFrequency] = useState<'daily' | 'weekly' | 'monthly'>('weekly');
  const [interval, setInterval] = useState(1);
  const [selectedDays, setSelectedDays] = useState<number[]>([1, 3]); // Mon & Wed
  const [endType, setEndType] = useState<'never' | 'after'>('after');
  const [occurrences, setOccurrences] = useState(8);

  if (!isOpen) return null;

  const toggleDay = (dayId: number) => {
    if (selectedDays.includes(dayId)) {
      if (selectedDays.length > 1) {
        setSelectedDays(selectedDays.filter((d) => d !== dayId));
      }
    } else {
      setSelectedDays([...selectedDays, dayId]);
    }
  };

  const handleSave = () => {
    if (onSave) {
      onSave({ frequency, interval, selectedDays, endType, occurrences });
    }
    addToast({
      title: locale === 'bn' ? 'পুনরাবৃত্তি শিডিউল সক্রিয় হয়েছে' : 'Recurrence Rule Saved',
      message: `Repeating ${frequency} for ${occurrences} occurrences.`,
      type: 'success',
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-scaleIn">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950/60">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400">
              <Repeat className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {locale === 'bn' ? 'পুনরাবৃত্তিমূলক কাজের শিডিউল' : 'Recurring Job Rule'}
              </h3>
              <p className="text-xs text-slate-500">
                {locale === 'bn' ? 'নিয়মিত মেইনটেন্যান্স কাজের পুনরাবৃত্তি' : 'Preventive Maintenance Automation'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 text-xs">
          {/* Frequency Type */}
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-2">
              {locale === 'bn' ? 'পুনরাবৃত্তির ধরন' : 'Repeat Frequency'}
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['daily', 'weekly', 'monthly'] as const).map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFrequency(f)}
                  className={`py-2 px-3 rounded-lg capitalize font-bold transition-all ${
                    frequency === f
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {f === 'daily'
                    ? locale === 'bn' ? 'প্রতিদিন' : 'Daily'
                    : f === 'weekly'
                    ? locale === 'bn' ? 'সাপ্তাহিক' : 'Weekly'
                    : locale === 'bn' ? 'মাসিক' : 'Monthly'}
                </button>
              ))}
            </div>
          </div>

          {/* Weekday Selection if weekly */}
          {frequency === 'weekly' && (
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-2">
                {locale === 'bn' ? 'সপ্তাহের দিনগুলো নির্বাচন করুন' : 'Select Days of the Week'}
              </label>
              <div className="flex items-center justify-between gap-1">
                {WEEKDAYS.map((d) => {
                  const isSelected = selectedDays.includes(d.id);
                  return (
                    <button
                      key={d.id}
                      type="button"
                      onClick={() => toggleDay(d.id)}
                      className={`w-9 h-9 rounded-lg font-bold text-xs flex items-center justify-center transition-all ${
                        isSelected
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                      }`}
                    >
                      {locale === 'bn' ? d.labelBn : d.label}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Occurrences count */}
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              {locale === 'bn' ? 'মোট পুনরাবৃত্তির সংখ্যা' : 'End After (Occurrences)'}
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={1}
                max={52}
                value={occurrences}
                onChange={(e) => setOccurrences(Number(e.target.value))}
                className="w-24 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono text-slate-900 dark:text-white"
              />
              <span className="text-slate-500">
                {locale === 'bn' ? 'বার কাজের পর শেষ হবে' : 'cycles'}
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2 bg-slate-50 dark:bg-slate-950/50">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
          >
            {locale === 'bn' ? 'বাতিল' : 'Cancel'}
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2 text-xs font-bold rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition-colors flex items-center gap-1.5"
          >
            <Check className="w-4 h-4" />
            <span>{locale === 'bn' ? 'নিয়ম সংরক্ষণ করুন' : 'Save Recurrence'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
