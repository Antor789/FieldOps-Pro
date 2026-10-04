import React, { useState } from 'react';
import { formatBDT } from '../../utils/formatters';
import { formatCalendarDate } from '../../utils/calendarHelpers';
import {
  ClipboardList,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Star,
  Plus,
  ArrowRight,
} from 'lucide-react';

export interface CustomerJobsProps {
  customerId: string;
  locale?: 'en' | 'bn';
  onCreateJob: () => void;
}

const SAMPLE_CUSTOMER_JOBS = [
  {
    id: 'wo-9003',
    number: 'WO-9003',
    title: 'Transformer Overheating & Coil Replacement',
    titleBn: 'ট্রান্সফরমার অতিরিক্ত গরম পরীক্ষা ও মেরামত',
    siteName: 'Gulshan 2 DCC Market Area',
    technicianName: 'Rahim Ahmed',
    date: new Date('2025-01-15T10:45:00'),
    status: 'completed',
    amountBDT: 14500,
    rating: 5.0,
    paymentStatus: 'paid_bkash',
  },
  {
    id: 'wo-9001',
    number: 'WO-9001',
    title: 'Cleanroom HVAC Multi-Split Preventive Service',
    titleBn: 'ক্লিনরুম এইচভিএসি প্রাক-প্রতিরোধমূলক সার্ভিস',
    siteName: 'GP House Central Datacenter',
    technicianName: 'Tanvir Hossain',
    date: new Date('2025-01-14T14:30:00'),
    status: 'completed',
    amountBDT: 8500,
    rating: 4.8,
    paymentStatus: 'paid_nagad',
  },
  {
    id: 'wo-8998',
    number: 'WO-8998',
    title: 'Fiber Backbone Dark Core Splicing',
    titleBn: 'ডার্ক ফাইবার ব্যাকবোন স্প্লাইসিং',
    siteName: 'Banani Road 11 Optical Core Hub',
    technicianName: 'Tanvir Hossain',
    date: new Date('2025-01-12T11:00:00'),
    status: 'completed',
    amountBDT: 12000,
    rating: 5.0,
    paymentStatus: 'paid_sslcommerz',
  },
  {
    id: 'wo-9005',
    number: 'WO-9005',
    title: 'Backup Diesel Generator 500KVA Overhaul',
    titleBn: '৫০০কেভিএ ডিজেল জেনারেটর ওভারহলিং',
    siteName: 'GP House Central Datacenter',
    technicianName: 'Kamal Uddin',
    date: new Date('2025-01-16T09:00:00'),
    status: 'scheduled',
    amountBDT: 22000,
    paymentStatus: 'unpaid',
  },
];

export const CustomerJobs: React.FC<CustomerJobsProps> = ({
  customerId,
  locale = 'en',
  onCreateJob,
}) => {
  return (
    <div className="space-y-4 text-xs">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-bold text-sm text-slate-900 dark:text-white">
            {locale === 'bn' ? 'কাস্টমার কাজের ইতিহাস ও চালান' : 'Work Order & Invoicing History'}
          </h4>
          <p className="text-slate-500 font-mono text-[11px]">
            {SAMPLE_CUSTOMER_JOBS.length} recent field tickets recorded.
          </p>
        </div>

        <button
          onClick={onCreateJob}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>{locale === 'bn' ? '+ নতুন কাজ তৈরি' : '+ Create Work Order'}</span>
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="divide-y divide-slate-100 dark:divide-slate-800/70">
          {SAMPLE_CUSTOMER_JOBS.map((job) => (
            <div
              key={job.id}
              className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-xs bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200">
                    {job.number}
                  </span>
                  <h5 className="font-bold text-slate-900 dark:text-white">
                    {locale === 'bn' && job.titleBn ? job.titleBn : job.title}
                  </h5>
                  {job.status === 'completed' ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.2 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                      <CheckCircle2 className="w-3 h-3" />
                      Completed
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.2 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                      <Clock className="w-3 h-3" />
                      Scheduled
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-2 text-slate-500 text-[11px]">
                  <span>Site: <strong>{job.siteName}</strong></span>
                  <span>•</span>
                  <span>Tech: <strong>{job.technicianName}</strong></span>
                  <span>•</span>
                  <span className="font-mono">{formatCalendarDate(job.date, locale)}</span>
                </div>
              </div>

              <div className="flex items-center gap-4 self-end sm:self-center font-mono">
                {job.rating && (
                  <div className="flex items-center gap-1 text-amber-500 font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>{job.rating.toFixed(1)}</span>
                  </div>
                )}

                <div className="text-right">
                  <div className="text-sm font-extrabold text-slate-900 dark:text-white">
                    {formatBDT(job.amountBDT, locale)}
                  </div>
                  <span className="text-[10px] text-emerald-600 font-semibold block uppercase">
                    {job.paymentStatus.replace('_', ' ')}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
