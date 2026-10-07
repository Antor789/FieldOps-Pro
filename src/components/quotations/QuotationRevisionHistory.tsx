import React from 'react';
import { Quotation } from '../../types/quotations';
import { History, ArrowRight, ArrowDownRight, Tag, Calendar, User, FileDiff } from 'lucide-react';
import { formatBDT } from '../../data/mockQuotationData';

interface RevisionEntry {
  version: string;
  updatedAt: string;
  updatedBy: string;
  note: string;
  totalBDT: number;
  changes: string[];
}

interface QuotationRevisionHistoryProps {
  quotation: Quotation;
}

export const QuotationRevisionHistory: React.FC<QuotationRevisionHistoryProps> = ({ quotation }) => {
  // Generate sample revision entries based on quotation data
  const revisions: RevisionEntry[] = [
    {
      version: 'v1.2 (Current)',
      updatedAt: typeof quotation.updatedAt === 'string' ? quotation.updatedAt : new Date().toISOString(),
      updatedBy: quotation.createdBy || 'Commercial Officer',
      note: 'Applied 5% corporate discount & updated labor hours following technical audit',
      totalBDT: quotation.total,
      changes: [
        'Updated Labor Charges from 3 hours to 4 hours',
        'Applied 5% Corporate Special Discount',
        'Recalculated NBR 15% VAT component',
      ],
    },
    {
      version: 'v1.1',
      updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      updatedBy: 'Lead Engineer',
      note: 'Added transport lumping & spare parts line items after site survey',
      totalBDT: Math.round(quotation.total * 1.1),
      changes: [
        'Added Refrigerant Gas R410A (2 kg)',
        'Added Emergency Transport Lumpsum (৳1,500)',
      ],
    },
    {
      version: 'v1.0 (Initial)',
      updatedAt: typeof quotation.createdAt === 'string' ? quotation.createdAt : new Date(Date.now() - 86400000 * 5).toISOString(),
      updatedBy: quotation.createdBy || 'FieldOps System',
      note: 'Initial estimate generated from lead ticket request',
      totalBDT: Math.round(quotation.total * 0.9),
      changes: ['Draft quotation created with basic AC servicing rates'],
    },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-5 shadow-xs">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
        <div className="flex items-center space-x-2">
          <History className="w-4 h-4 text-amber-500" />
          <h3 className="font-extrabold text-sm text-slate-900 dark:text-slate-100">
            Quotation Revision Audit Log
          </h3>
        </div>
        <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 rounded-full">
          3 Revisions Recorded
        </span>
      </div>

      <div className="space-y-4">
        {revisions.map((rev, idx) => (
          <div
            key={idx}
            className={`p-4 rounded-2xl border transition ${
              idx === 0
                ? 'bg-amber-50/50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800/60'
                : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800'
            }`}
          >
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
              <div className="flex items-center space-x-2">
                <span className="font-mono font-bold text-xs bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 px-2 py-0.5 rounded-md">
                  {rev.version}
                </span>
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  {rev.note}
                </span>
              </div>
              <span className="font-mono text-xs font-extrabold text-slate-900 dark:text-slate-100">
                {formatBDT(rev.totalBDT)}
              </span>
            </div>

            <div className="flex items-center space-x-4 text-[10px] text-slate-500 dark:text-slate-400 mb-2">
              <span className="flex items-center gap-1">
                <User className="w-3 h-3 text-slate-400" />
                {rev.updatedBy}
              </span>
              <span className="flex items-center gap-1 font-mono">
                <Calendar className="w-3 h-3 text-slate-400" />
                {new Date(rev.updatedAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </span>
            </div>

            <ul className="space-y-1 pl-4 border-l-2 border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-400">
              {rev.changes.map((change, cIdx) => (
                <li key={cIdx} className="flex items-center gap-1.5">
                  <Tag className="w-3 h-3 text-amber-500 shrink-0" />
                  <span>{change}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};
