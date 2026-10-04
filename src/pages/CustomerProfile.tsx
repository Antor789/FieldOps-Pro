import React, { useState } from 'react';
import { Customer, CustomerType, CustomerStatus } from '../types/customer';
import { useCustomerProfile } from '../hooks/useCustomerProfile';
import {
  CustomerOverview,
  CustomerSites,
  CustomerContacts,
  CustomerJobs,
  CustomerActivity,
  CustomerForm,
  SiteForm,
  ContactForm,
  ActivityForm,
} from '../components/crm';
import { formatBDT } from '../utils/formatters';
import {
  Building2,
  ArrowLeft,
  Edit2,
  Plus,
  Phone,
  Mail,
  MapPin,
  Star,
  ShieldCheck,
  Calendar,
  Layers,
  Users,
  History,
  ClipboardList,
} from 'lucide-react';
import { motion } from 'motion/react';

export interface CustomerProfilePageProps {
  customerId: string;
  locale?: 'en' | 'bn';
  onBack: () => void;
  onCreateJob: (customer: Customer) => void;
}

export type ProfileTab = 'overview' | 'sites' | 'contacts' | 'jobs' | 'activity';

export const CustomerProfilePage: React.FC<CustomerProfilePageProps> = ({
  customerId,
  locale = 'en',
  onBack,
  onCreateJob,
}) => {
  const [activeTab, setActiveTab] = useState<ProfileTab>('overview');

  const {
    customer,
    setCustomer,
    sites,
    contacts,
    interactions,
    addSite,
    addContact,
    addInteraction,
  } = useCustomerProfile(customerId);

  const [isEditCustomerOpen, setIsEditCustomerOpen] = useState(false);
  const [isAddSiteOpen, setIsAddSiteOpen] = useState(false);
  const [isAddContactOpen, setIsAddContactOpen] = useState(false);
  const [isAddActivityOpen, setIsAddActivityOpen] = useState(false);

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-5 animate-fadeIn text-xs">
      {/* Back Button & Breadcrumbs */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 font-semibold transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{locale === 'bn' ? 'সকল গ্রাহক তালিকায় ফিরে যান' : 'Back to Customers'}</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsEditCustomerOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 font-semibold shadow-xs"
          >
            <Edit2 className="w-3.5 h-3.5" />
            <span>{locale === 'bn' ? 'সম্পাদনা' : 'Edit Profile'}</span>
          </button>

          <button
            onClick={() => onCreateJob(customer)}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>{locale === 'bn' ? '+ নতুন কাজের টিকিট' : '+ Create Work Order'}</span>
          </button>
        </div>
      </div>

      {/* Hero Customer Card Header */}
      <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white font-black text-xl flex items-center justify-center shadow-md shrink-0">
            {customer.companyName.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white">
                {locale === 'bn' && customer.companyNameBangla ? customer.companyNameBangla : customer.companyName}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300">
                {customer.customerType}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                {customer.status}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-slate-500 text-xs font-mono mt-1">
              <span>Code: <strong>{customer.customerCode}</strong></span>
              {customer.nbrBin && (
                <>
                  <span>•</span>
                  <span>NBR VAT BIN: <strong className="text-slate-800 dark:text-slate-200">{customer.nbrBin}</strong></span>
                </>
              )}
              <span>•</span>
              <span className="text-amber-500 font-bold flex items-center gap-0.5">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                {customer.averageRating} Rating
              </span>
            </div>
          </div>
        </div>

        {/* LTV & Balance */}
        <div className="flex items-center gap-4 border-t md:border-t-0 md:border-l border-slate-100 dark:border-slate-800 pt-3 md:pt-0 md:pl-6 self-start md:self-auto font-mono">
          <div>
            <span className="text-[10px] text-slate-400 block">{locale === 'bn' ? 'মোট আয় (LTV)' : 'Lifetime Revenue'}</span>
            <div className="text-base sm:text-lg font-extrabold text-emerald-600 dark:text-emerald-400">
              {formatBDT(customer.lifetimeValueBDT, locale)}
            </div>
          </div>

          <div>
            <span className="text-[10px] text-slate-400 block">{locale === 'bn' ? 'বকেয়া' : 'Outstanding'}</span>
            <div className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-200">
              {formatBDT(customer.outstandingBalanceBDT, locale)}
            </div>
          </div>
        </div>
      </div>

      {/* Profile Sub-Tabs Navigation */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-200/80 dark:bg-slate-800/80 rounded-xl max-w-fit overflow-x-auto text-xs font-semibold">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
            activeTab === 'overview'
              ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs font-bold'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Building2 className="w-3.5 h-3.5" />
          <span>{locale === 'bn' ? 'সংক্ষিপ্ত বিবরণ' : 'Overview'}</span>
        </button>

        <button
          onClick={() => setActiveTab('sites')}
          className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
            activeTab === 'sites'
              ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs font-bold'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <MapPin className="w-3.5 h-3.5 text-rose-500" />
          <span>{locale === 'bn' ? 'সার্ভিস সাইট' : `Sites (${sites.length})`}</span>
        </button>

        <button
          onClick={() => setActiveTab('contacts')}
          className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
            activeTab === 'contacts'
              ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs font-bold'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Users className="w-3.5 h-3.5 text-emerald-500" />
          <span>{locale === 'bn' ? 'যোগাযোগ কর্মকর্তা' : `Contacts (${contacts.length})`}</span>
        </button>

        <button
          onClick={() => setActiveTab('jobs')}
          className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
            activeTab === 'jobs'
              ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs font-bold'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <ClipboardList className="w-3.5 h-3.5 text-blue-500" />
          <span>{locale === 'bn' ? 'কাজের ইতিহাস' : `Work Orders (${customer.totalJobs})`}</span>
        </button>

        <button
          onClick={() => setActiveTab('activity')}
          className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
            activeTab === 'activity'
              ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs font-bold'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <History className="w-3.5 h-3.5" />
          <span>{locale === 'bn' ? 'অ্যাক্টিভিটি লগ' : `Timeline (${interactions.length})`}</span>
        </button>
      </div>

      {/* Dynamic Tab Contents */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-xs">
        {activeTab === 'overview' && <CustomerOverview customer={customer} locale={locale} />}

        {activeTab === 'sites' && (
          <CustomerSites
            sites={sites}
            locale={locale}
            onAddSite={() => setIsAddSiteOpen(true)}
            onCreateJobForSite={() => onCreateJob(customer)}
          />
        )}

        {activeTab === 'contacts' && (
          <CustomerContacts
            contacts={contacts}
            locale={locale}
            onAddContact={() => setIsAddContactOpen(true)}
          />
        )}

        {activeTab === 'jobs' && (
          <CustomerJobs
            customerId={customer.id}
            locale={locale}
            onCreateJob={() => onCreateJob(customer)}
          />
        )}

        {activeTab === 'activity' && (
          <CustomerActivity
            interactions={interactions}
            locale={locale}
            onAddInteraction={() => setIsAddActivityOpen(true)}
          />
        )}
      </div>

      {/* Modals */}
      <CustomerForm
        isOpen={isEditCustomerOpen}
        initialCustomer={customer}
        locale={locale}
        onClose={() => setIsEditCustomerOpen(false)}
        onSave={(updated) => setCustomer((prev) => ({ ...prev, ...updated }))}
      />

      <SiteForm
        isOpen={isAddSiteOpen}
        locale={locale}
        onClose={() => setIsAddSiteOpen(false)}
        onSave={addSite}
      />

      <ContactForm
        isOpen={isAddContactOpen}
        locale={locale}
        onClose={() => setIsAddContactOpen(false)}
        onSave={addContact}
      />

      <ActivityForm
        isOpen={isAddActivityOpen}
        locale={locale}
        onClose={() => setIsAddActivityOpen(false)}
        onSave={addInteraction}
      />
    </div>
  );
};
