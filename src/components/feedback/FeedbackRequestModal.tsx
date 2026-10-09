import React, { useState } from 'react';
import { X, Send, MessageSquare, Mail, Clock, CheckCircle2, Globe, Sparkles } from 'lucide-react';
import { Button } from '../ui/Button';

interface FeedbackRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSend: (workOrderId: string, channel: 'sms_link' | 'email_link' | 'both', lang: 'en' | 'bn', delayHours: number) => void;
  workOrders?: { id: string; customerName: string; title: string }[];
}

export const FeedbackRequestModal: React.FC<FeedbackRequestModalProps> = ({
  isOpen,
  onClose,
  onSend,
  workOrders = [
    { id: 'WO-9045', customerName: 'Grameenphone Ltd', title: 'Precision AC Servicing' },
    { id: 'WO-9046', customerName: 'DESCO Central', title: 'Substation Inspection' },
    { id: 'WO-9047', customerName: 'Walton Corporate', title: 'Water Pump Repair' },
  ],
}) => {
  const [selectedWoId, setSelectedWoId] = useState(workOrders[0]?.id || 'WO-9045');
  const [channel, setChannel] = useState<'sms_link' | 'email_link' | 'both'>('sms_link');
  const [lang, setLang] = useState<'en' | 'bn'>('bn');
  const [delayHours, setDelayHours] = useState<number>(0); // 0 = now, 1 = +1 hour

  if (!isOpen) return null;

  const currentWo = workOrders.find((w) => w.id === selectedWoId) || workOrders[0];

  const sampleMessages = {
    en: `[FieldOps Pro] Dear ${currentWo.customerName}, thank you for choosing us for #${currentWo.id} (${currentWo.title}). Please take 30 seconds to rate our service: https://fieldopspro.bd/feedback/${currentWo.id}`,
    bn: `[ফিল্ডঅপস প্রো] প্রিয় ${currentWo.customerName}, #${currentWo.id} কাজের জন্য ধন্যবাদ। আমাদের সেবা কেমন ছিল তা জানাতে ৩০ সেকেন্ডের এই ফর্মে মতামত দিন: https://fieldopspro.bd/feedback/${currentWo.id}`,
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSend(selectedWoId, channel, lang, delayHours);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="w-10 h-10 rounded-2xl bg-amber-50 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 flex items-center justify-center border border-amber-200 dark:border-amber-800">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-extrabold text-base text-slate-900 dark:text-slate-100">
              Dispatch Customer Survey Request
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Send bilingual feedback link via Greenweb SMS or Email
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              Select Completed Work Order
            </label>
            <select
              value={selectedWoId}
              onChange={(e) => setSelectedWoId(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 font-bold text-slate-900 dark:text-slate-100"
            >
              {workOrders.map((wo) => (
                <option key={wo.id} value={wo.id}>
                  {wo.id} - {wo.customerName} ({wo.title})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Dispatch Channel
              </label>
              <select
                value={channel}
                onChange={(e) => setChannel(e.target.value as any)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-slate-100"
              >
                <option value="sms_link">Greenweb SMS Link</option>
                <option value="email_link">Email Survey Link</option>
                <option value="both">Both SMS & Email</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Preferred Language
              </label>
              <select
                value={lang}
                onChange={(e) => setLang(e.target.value as any)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 font-bold text-slate-900 dark:text-slate-100"
              >
                <option value="bn">বাংলা (Bangla Standard)</option>
                <option value="en">English Corporate</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              Dispatch Schedule Timing
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setDelayHours(0)}
                className={`flex-1 p-2.5 rounded-xl border text-xs font-bold transition ${
                  delayHours === 0
                    ? 'bg-amber-500 text-slate-950 border-amber-600'
                    : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600'
                }`}
              >
                Send Immediately
              </button>
              <button
                type="button"
                onClick={() => setDelayHours(1)}
                className={`flex-1 p-2.5 rounded-xl border text-xs font-bold transition ${
                  delayHours === 1
                    ? 'bg-amber-500 text-slate-950 border-amber-600'
                    : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600'
                }`}
              >
                +1 Hour Auto-Delay
              </button>
            </div>
          </div>

          {/* Message Preview */}
          <div className="space-y-1">
            <label className="block font-bold text-slate-700 dark:text-slate-300">
              Message Preview
            </label>
            <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 font-mono text-[11px] text-slate-700 dark:text-slate-300 leading-relaxed">
              {sampleMessages[lang]}
            </div>
          </div>

          <div className="pt-2 flex justify-end space-x-2">
            <Button size="xs" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              size="xs"
              variant="primary"
              type="submit"
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold"
            >
              <Send className="w-3.5 h-3.5 mr-1" /> Dispatch Survey
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
