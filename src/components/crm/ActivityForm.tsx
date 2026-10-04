import React, { useState } from 'react';
import { CustomerInteraction } from '../../types/customer';
import { X, MessageSquare, Check, Phone, Calendar, Star, DollarSign } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export interface ActivityFormProps {
  isOpen: boolean;
  locale?: 'en' | 'bn';
  onClose: () => void;
  onSave: (activityData: any) => void;
}

export const ActivityForm: React.FC<ActivityFormProps> = ({
  isOpen,
  locale = 'en',
  onClose,
  onSave,
}) => {
  const { addToast } = useToast();

  const [type, setType] = useState<CustomerInteraction['type']>('call');
  const [subject, setSubject] = useState('Routine Maintenance Follow-up');
  const [description, setDescription] = useState('Contacted customer POC regarding upcoming quarterly transformer and generator service schedule.');
  const [outcome, setOutcome] = useState('Customer confirmed schedule for Wednesday morning.');
  const [followUpRequired, setFollowUpRequired] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    onSave({
      type,
      subject,
      description,
      outcome,
      followUpRequired,
      createdBy: 'user-admin',
      createdByName: 'Customer Support Desk',
    });

    addToast({
      title: 'Activity Logged',
      message: `${subject} recorded in timeline.`,
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
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {locale === 'bn' ? 'যোগাযোগ ও অ্যাক্টিভিটি রেকর্ড করুন' : 'Log Communication / Note'}
              </h3>
              <p className="text-xs text-slate-500">
                {locale === 'bn' ? 'কল, মিটিং বা গ্রাহক প্রতিক্রিয়া সংরক্ষণ' : 'Call log, site visit, or customer feedback'}
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-3.5 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Activity Type *
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as CustomerInteraction['type'])}
              className="w-full px-2.5 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            >
              <option value="call">📞 Phone Call</option>
              <option value="meeting">👥 Meeting / Consultation</option>
              <option value="site_visit">📍 On-Site Inspection</option>
              <option value="feedback">⭐ Feedback & CSAT</option>
              <option value="complaint">⚠️ Issue / Complaint</option>
              <option value="note">📝 Internal Account Note</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Subject Line *
            </label>
            <input
              type="text"
              required
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Discussion Summary / Description *
            </label>
            <textarea
              rows={3}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Action Outcome / Resolution
            </label>
            <input
              type="text"
              value={outcome}
              onChange={(e) => setOutcome(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>

          {/* Action Footer */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition-colors flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Log Activity</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
