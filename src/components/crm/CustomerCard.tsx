import React from 'react';
import { Customer } from '../../types/customer';
import { formatBDT } from '../../utils/formatters';
import {
  Building2,
  Phone,
  Mail,
  MapPin,
  Star,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  Plus,
  MessageSquare,
} from 'lucide-react';
import { motion } from 'motion/react';

export interface CustomerCardProps {
  customer: Customer;
  locale?: 'en' | 'bn';
  onViewProfile: (customer: Customer) => void;
  onCreateJob: (customer: Customer) => void;
}

export const CustomerCard: React.FC<CustomerCardProps> = ({
  customer,
  locale = 'en',
  onViewProfile,
  onCreateJob,
}) => {
  const isEnterprise = customer.customerType === 'enterprise';

  return (
    <motion.div
      whileHover={{ y: -2, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.08)' }}
      className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs transition-all flex flex-col justify-between group"
    >
      <div>
        {/* Top Header: Logo Avatar, Code & Status Tag */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white font-black text-sm flex items-center justify-center shrink-0 shadow-sm">
              {customer.companyName.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white leading-tight">
                  {locale === 'bn' && customer.companyNameBangla
                    ? customer.companyNameBangla
                    : customer.companyName}
                </h3>
              </div>
              <p className="text-[11px] font-mono text-slate-400 mt-0.5">
                {customer.customerCode} {customer.nbrBin && `• BIN: ${customer.nbrBin}`}
              </p>
            </div>
          </div>

          <span
            className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase shrink-0 ${
              isEnterprise
                ? 'bg-purple-100 text-purple-700 dark:bg-purple-950/80 dark:text-purple-300'
                : customer.customerType === 'government'
                ? 'bg-blue-100 text-blue-700 dark:bg-blue-950/80 dark:text-blue-300'
                : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
            }`}
          >
            {customer.customerType}
          </span>
        </div>

        {/* Head Office Address & Primary Contact */}
        <div className="space-y-1 text-xs text-slate-600 dark:text-slate-400 mb-3">
          <div className="flex items-center gap-1.5 truncate">
            <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
            <span className="truncate">
              {customer.headOffice.landmark || customer.headOffice.area}, {customer.headOffice.district}
            </span>
          </div>

          <div className="flex items-center gap-1.5 truncate text-[11px] text-slate-500">
            <Phone className="w-3 h-3 text-emerald-500 shrink-0" />
            <span className="font-mono">{customer.primaryPhone}</span>
          </div>
        </div>

        {/* Stats Grid: Sites count, Jobs completed, Total Revenue in BDT */}
        <div className="grid grid-cols-3 gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-center font-mono text-xs">
          <div>
            <span className="text-[10px] text-slate-400 block">{locale === 'bn' ? 'সাইট' : 'Sites'}</span>
            <strong className="text-slate-800 dark:text-slate-200">{customer.sites.length}</strong>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block">{locale === 'bn' ? 'মোট কাজ' : 'Jobs'}</span>
            <strong className="text-slate-800 dark:text-slate-200">{customer.totalJobs}</strong>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block">{locale === 'bn' ? 'রেটিং' : 'Rating'}</span>
            <span className="font-bold text-amber-500 flex items-center justify-center gap-0.5">
              <Star className="w-3 h-3 fill-amber-400" />
              {customer.averageRating}
            </span>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="pt-4 mt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
        <div className="font-mono">
          <span className="text-[10px] text-slate-400 block">{locale === 'bn' ? 'মোট টার্নওভার:' : 'Lifetime Value:'}</span>
          <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400">
            {formatBDT(customer.lifetimeValueBDT, locale)}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onCreateJob(customer)}
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors"
            title={locale === 'bn' ? 'নতুন কাজ তৈরি করুন' : 'Create Work Order'}
          >
            <Plus className="w-4 h-4" />
          </button>
          <button
            onClick={() => onViewProfile(customer)}
            className="px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-xs transition-colors flex items-center gap-1"
          >
            <span>{locale === 'bn' ? 'প্রোফাইল' : 'Profile'}</span>
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};
