import React from 'react';
import { Zap, Banknote, Package } from 'lucide-react';
import { PaymentStatus } from '../../../../types/fsm';

interface CardTagsProps {
  skills: string[];
  paymentStatus: PaymentStatus;
  partsRequiredCount?: number;
}

export const CardTags: React.FC<CardTagsProps> = ({
  skills,
  paymentStatus,
  partsRequiredCount = 0,
}) => {
  const isPaid = paymentStatus === 'PAID_BKASH' || paymentStatus === 'PAID_CASH';

  return (
    <div className="flex flex-wrap items-center gap-1.5 pt-1">
      {/* Required Skills Badges */}
      {skills.map((skill) => (
        <span
          key={skill}
          className="inline-flex items-center gap-1 text-[9px] bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 px-1.5 py-0.5 rounded-md font-mono font-medium hover:bg-slate-200 dark:hover:bg-slate-700 transition select-none"
        >
          <Zap className="w-2.5 h-2.5 text-amber-500 shrink-0" />
          <span>{skill}</span>
        </span>
      ))}

      {/* Parts Required Pill */}
      {partsRequiredCount > 0 && (
        <span className="inline-flex items-center gap-1 text-[9px] bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 px-1.5 py-0.5 rounded-md font-mono font-medium">
          <Package className="w-2.5 h-2.5 text-indigo-500 shrink-0" />
          <span>{partsRequiredCount} Parts</span>
        </span>
      )}

      {/* Payment Status Badge */}
      <span
        className={`inline-flex items-center gap-1 text-[9px] font-bold px-1.5 py-0.5 rounded-md border font-mono select-none ${
          paymentStatus === 'PAID_BKASH'
            ? 'bg-pink-50 dark:bg-pink-950/60 text-[#E2136E] border-pink-200 dark:border-pink-800'
            : isPaid
            ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
            : 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800'
        }`}
      >
        <Banknote className="w-2.5 h-2.5 shrink-0" />
        <span>
          {paymentStatus === 'PAID_BKASH'
            ? 'bKash Paid'
            : paymentStatus === 'PAID_CASH'
            ? 'Cash Paid'
            : 'Unpaid ৳'}
        </span>
      </span>
    </div>
  );
};
