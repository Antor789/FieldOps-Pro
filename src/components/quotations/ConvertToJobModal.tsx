import React, { useState } from 'react';
import { Quotation } from '../../types/quotations';
import { formatBDT } from '../../data/mockQuotationData';
import {
  ArrowRightCircle,
  X,
  Calendar,
  User,
  AlertTriangle,
  CheckCircle2,
  FileCheck,
  Building2,
  Clock,
  Zap,
} from 'lucide-react';
import { Button } from '../ui/Button';

interface ConvertToJobModalProps {
  quotation: Quotation;
  isOpen: boolean;
  onClose: () => void;
  onConfirmConvert: (options: {
    scheduledDate: string;
    technicianId: string;
    priority: 'EMERGENCY' | 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
    notes?: string;
  }) => void;
}

export const ConvertToJobModal: React.FC<ConvertToJobModalProps> = ({
  quotation,
  isOpen,
  onClose,
  onConfirmConvert,
}) => {
  const [scheduledDate, setScheduledDate] = useState<string>(
    new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
  );
  const [technicianId, setTechnicianId] = useState<string>('tech-1');
  const [priority, setPriority] = useState<'EMERGENCY' | 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW'>('HIGH');
  const [notes, setNotes] = useState<string>('Converted from approved quotation ' + quotation.quotationNumber);

  if (!isOpen) return null;

  const totalItemsCount = quotation.sections.reduce((sum, s) => sum + s.items.length, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirmConvert({
      scheduledDate,
      technicianId,
      priority,
      notes,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-fadeIn">
        {/* Top Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-300">
              <ArrowRightCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Convert Quotation to Work Order
              </h3>
              <p className="text-[11px] text-slate-500">
                {quotation.quotationNumber} • {quotation.customerName}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          {/* Quote Overview Badge */}
          <div className="p-3 bg-purple-50/60 dark:bg-purple-950/30 rounded-xl border border-purple-200 dark:border-purple-900 flex items-center justify-between">
            <div>
              <span className="text-[11px] text-purple-700 dark:text-purple-300 block">
                Agreed Contract Consideration:
              </span>
              <strong className="text-base font-black text-purple-900 dark:text-purple-200">
                {formatBDT(quotation.total)}
              </strong>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-purple-600 dark:text-purple-400 block font-semibold">
                {totalItemsCount} line items carried over
              </span>
              <span className="text-[10px] text-slate-500">Includes 15% NBR VAT</span>
            </div>
          </div>

          {/* Execution Date & Priority */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Execution / Start Date *
              </label>
              <input
                type="date"
                required
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Job Priority Level *
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="CRITICAL">Critical (জরুরি)</option>
                <option value="HIGH">High Priority (উচ্চ)</option>
                <option value="MEDIUM">Medium Priority (সাধারণ)</option>
                <option value="LOW">Low Priority (কম)</option>
                <option value="EMERGENCY">Emergency (P1)</option>
              </select>
            </div>
          </div>

          {/* Assigned Technician */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Assign Primary Field Engineer *
            </label>
            <select
              value={technicianId}
              onChange={(e) => setTechnicianId(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="tech-1">Rashidul Islam (HVAC Lead • Gulshan)</option>
              <option value="tech-2">Kamrul Hasan (High Voltage Specialist • Mirpur)</option>
              <option value="tech-3">Tanvir Ahmed (Refrigeration Tech • Uttara)</option>
              <option value="tech-4">Sumon Mia (Factory Automation • Gazipur)</option>
              <option value="tech-5">Shahadat Hossain (Cleanroom Certification)</option>
            </select>
          </div>

          {/* Dispatch Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Dispatch Instructions / Site Notes
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Call client POC 30 minutes before arrival at site..."
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Conversion Notice */}
          <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 space-y-1">
            <p>✓ All items and pricing will be linked into the new work order.</p>
            <p>✓ The technician will receive mobile PWA notification with job dispatch coordinates.</p>
            <p>✓ Quotation #{quotation.quotationNumber} will be marked as &quot;Converted&quot;.</p>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <Button type="button" variant="outline" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              className="bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-1.5 shadow-sm"
            >
              <Zap className="w-3.5 h-3.5" />
              Generate Work Order & Dispatch
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
