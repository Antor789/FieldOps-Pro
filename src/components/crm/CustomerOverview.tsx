import React from 'react';
import { Customer } from '../../types/customer';
import { formatBDT } from '../../utils/formatters';
import { formatCalendarDate } from '../../utils/calendarHelpers';
import { RevenueChart } from './RevenueChart';
import {
  MapPin,
  Phone,
  Mail,
  ShieldCheck,
  Calendar,
  Building,
  Star,
  ExternalLink,
  Clock,
  DollarSign,
  FileCheck,
} from 'lucide-react';

export interface CustomerOverviewProps {
  customer: Customer;
  locale?: 'en' | 'bn';
}

export const CustomerOverview: React.FC<CustomerOverviewProps> = ({ customer, locale = 'en' }) => {
  const primaryContact = customer.contacts.find((c) => c.isPrimary) || customer.contacts[0];
  const sa = customer.serviceAgreement;

  return (
    <div className="space-y-5 text-xs">
      {/* 4 Summary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-1">
          <span className="text-slate-500 font-medium">{locale === 'bn' ? 'মোট কাজ সম্পন্ন' : 'Total Jobs Completed'}</span>
          <div className="text-xl font-mono font-extrabold text-slate-900 dark:text-white">
            {customer.completedJobs} / {customer.totalJobs}
          </div>
          <span className="text-[11px] text-emerald-600 font-bold">
            98.5% {locale === 'bn' ? 'সফলতা হার' : 'success rate'}
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-1">
          <span className="text-slate-500 font-medium">{locale === 'bn' ? 'সক্রিয় সার্ভিস সাইট' : 'Active Service Sites'}</span>
          <div className="text-xl font-mono font-extrabold text-slate-900 dark:text-white">
            {customer.sites.length}
          </div>
          <span className="text-[11px] text-indigo-600 font-bold">
            {locale === 'bn' ? 'ঢাকা ও আঞ্চলিক হাব' : 'Dhaka division hubs'}
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-1">
          <span className="text-slate-500 font-medium">{locale === 'bn' ? 'মোট টার্নওভার (LTV)' : 'Lifetime Revenue (LTV)'}</span>
          <div className="text-xl font-mono font-extrabold text-emerald-600 dark:text-emerald-400">
            {formatBDT(customer.lifetimeValueBDT, locale)}
          </div>
          <span className="text-[11px] text-slate-400 font-mono">
            {locale === 'bn' ? '১৫% এনবিআর মূসক সহ' : 'Incl. 15% NBR VAT'}
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-1">
          <span className="text-slate-500 font-medium">{locale === 'bn' ? 'গ্রাহক সন্তুষ্টি স্কোর' : 'Customer CSAT'}</span>
          <div className="text-xl font-mono font-extrabold text-amber-500 flex items-center gap-1">
            <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
            <span>{customer.averageRating}</span>
          </div>
          <span className="text-[11px] text-amber-600 font-bold">
            {locale === 'bn' ? '৫-স্টার রেটিং' : '5-star certified'}
          </span>
        </div>
      </div>

      {/* Two Columns: Head Office & Primary Contact */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Head Office Address */}
        <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
          <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
            <Building className="w-4 h-4 text-indigo-500" />
            <span>{locale === 'bn' ? 'প্রধান কার্যালয় (Head Office)' : 'Head Office Address'}</span>
          </h4>

          <div className="space-y-2 text-slate-700 dark:text-slate-300">
            <p className="font-semibold text-slate-900 dark:text-white">{customer.headOffice.street}</p>
            <p className="flex items-center gap-1.5 text-slate-500">
              <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
              <span>
                {customer.headOffice.area}, {customer.headOffice.district} - {customer.headOffice.postalCode}
              </span>
            </p>
            {customer.headOffice.landmark && (
              <p className="text-[11px] text-slate-500 italic">Landmark: {customer.headOffice.landmark}</p>
            )}
          </div>

          <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between text-slate-500">
            <span>NBR VAT BIN: <strong className="font-mono text-slate-800 dark:text-slate-200">{customer.nbrBin || 'N/A'}</strong></span>
            <span>Payment Terms: <strong>{customer.paymentTermsDays} days</strong></span>
          </div>
        </div>

        {/* Primary Contact Person */}
        {primaryContact && (
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>{locale === 'bn' ? 'প্রধান যোগাযোগ কর্মকর্তা (POC)' : 'Primary Contact Officer'}</span>
              </h4>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                Primary POC
              </span>
            </div>

            <div className="space-y-1.5">
              <h5 className="font-bold text-sm text-slate-900 dark:text-white">{primaryContact.name}</h5>
              <p className="text-slate-500 font-medium">{primaryContact.designation} • {primaryContact.department}</p>
              
              <div className="flex items-center gap-2 pt-1">
                <a
                  href={`tel:${primaryContact.phone}`}
                  className="flex items-center gap-1 px-3 py-1 rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 font-mono font-bold text-slate-800 dark:text-slate-200 hover:bg-slate-100"
                >
                  <Phone className="w-3.5 h-3.5 text-emerald-500" />
                  <span>{primaryContact.phone}</span>
                </a>

                <a
                  href={`mailto:${primaryContact.email}`}
                  className="flex items-center gap-1 px-3 py-1 rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-800 dark:text-slate-200 hover:bg-slate-100"
                >
                  <Mail className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Email</span>
                </a>
              </div>
            </div>

            {primaryContact.notes && (
              <p className="text-[11px] text-slate-500 pt-1 border-t border-slate-200 dark:border-slate-700">
                {primaryContact.notes}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Service Agreement (AMC / SLA) Card */}
      {sa && (
        <div className="p-5 rounded-2xl bg-gradient-to-r from-indigo-50/80 to-purple-50/80 dark:from-indigo-950/40 dark:to-purple-950/40 border border-indigo-200 dark:border-indigo-900/60 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                  {locale === 'bn' ? 'সক্রিয় সার্ভিস চুক্তি (AMC SLA)' : 'Active Service Level Agreement (AMC)'}
                </h4>
                <p className="text-[11px] font-mono text-indigo-600 dark:text-indigo-400 font-bold">
                  {sa.agreementNumber} • {sa.status.toUpperCase()}
                </p>
              </div>
            </div>

            <span className="text-xs font-mono font-extrabold text-emerald-600 dark:text-emerald-400 bg-white dark:bg-slate-900 px-3 py-1 rounded-xl border border-indigo-100 dark:border-indigo-950 shadow-xs self-start sm:self-auto">
              {formatBDT(sa.monthlyFeeBDT || 85000, locale)} / month
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-indigo-100 dark:border-indigo-900/60 text-slate-600 dark:text-slate-300 font-mono">
            <div>
              <span className="text-[10px] text-slate-400 block">Emergency SLA</span>
              <strong>{sa.responseTimeMinutes} mins response</strong>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block">Resolution Target</span>
              <strong>{sa.resolutionTimeMinutes / 60} hours</strong>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block">Contract Start</span>
              <strong>{formatCalendarDate(sa.startDate, locale)}</strong>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block">Valid Until</span>
              <strong className="text-indigo-600 dark:text-indigo-400">{formatCalendarDate(sa.endDate, locale)}</strong>
            </div>
          </div>
        </div>
      )}

      {/* 12-Month Revenue Turnover Trend Chart */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="font-bold text-sm text-slate-900 dark:text-white">
            {locale === 'bn' ? 'মাসিক রাজস্ব ও সার্ভিস বিলিং ট্রেন্ড (গত ১২ মাস)' : '12-Month Revenue & Turnover Trajectory'}
          </h4>
          <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
            ↑ 18.4% YoY Growth
          </span>
        </div>

        <RevenueChart locale={locale} />
      </div>
    </div>
  );
};
