import React, { useState } from 'react';
import { Customer, CustomerType, CustomerStatus } from '../types/customer';
import { useCustomers } from '../hooks/useCustomers';
import { CustomerCard, CustomerStats, CustomerForm } from '../components/crm';
import { CustomerProfilePage } from './CustomerProfile';
import {
  Users,
  Plus,
  Search,
  Building2,
  Filter,
  Download,
} from 'lucide-react';
import { motion } from 'motion/react';

export interface CustomersPageProps {
  locale?: 'en' | 'bn';
  onCreateJob?: (customer: Customer) => void;
}

export const CustomersPage: React.FC<CustomersPageProps> = ({
  locale = 'en',
  onCreateJob,
}) => {
  const {
    customers,
    allCustomers,
    stats,
    selectedType,
    setSelectedType,
    selectedStatus,
    setSelectedStatus,
    selectedDivision,
    setSelectedDivision,
    searchQuery,
    setSearchQuery,
    isAddModalOpen,
    setIsAddModalOpen,
    selectedCustomer,
    setSelectedCustomer,
    addCustomer,
    updateCustomer,
    deleteCustomer,
  } = useCustomers();

  // If a customer profile is opened, render CustomerProfilePage
  if (selectedCustomer) {
    return (
      <CustomerProfilePage
        customerId={selectedCustomer.id}
        locale={locale}
        onBack={() => setSelectedCustomer(null)}
        onCreateJob={(cust) => {
          if (onCreateJob) onCreateJob(cust);
        }}
      />
    );
  }

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-5 animate-fadeIn text-xs">
      {/* Page Title & Add CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-slate-500 mb-1">
            <span>FieldOps Pro</span>
            <span>/</span>
            <span>Enterprise CRM</span>
            <span>/</span>
            <span className="text-indigo-600 dark:text-indigo-400 font-bold">
              {locale === 'bn' ? 'গ্রাহক ও সাইট পোর্টফোলিও' : 'Customer Directory'}
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <Users className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            <span>{locale === 'bn' ? 'গ্রাহক সিআরএম ও সার্ভিস সাইট' : 'Customer CRM & Service Sites'}</span>
          </h1>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>{locale === 'bn' ? '+ নতুন গ্রাহক নিবন্ধন' : '+ Enroll Customer'}</span>
        </button>
      </div>

      {/* Top 4 KPI Metrics */}
      <CustomerStats
        total={stats.total}
        active={stats.active}
        enterprise={stats.enterprise}
        totalRevenue={stats.totalRevenue}
        locale={locale}
      />

      {/* Filter & Search Toolbar */}
      <div className="bg-white dark:bg-slate-900 p-3.5 sm:p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-xs">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={locale === 'bn' ? 'গ্রাহকের নাম, BIN বা এলাকা দিয়ে খুঁজুন...' : 'Search by company name, BIN, or area...'}
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </div>

        {/* Dropdown Filters */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value as CustomerType | 'all')}
            className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-medium focus:outline-none"
          >
            <option value="all">{locale === 'bn' ? 'সকল ধরন' : 'All Types'}</option>
            <option value="enterprise">🏢 Enterprise</option>
            <option value="sme">🏬 SME / Commercial</option>
            <option value="government">🏛️ Government</option>
            <option value="residential">🏠 Residential</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value as CustomerStatus | 'all')}
            className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-medium focus:outline-none"
          >
            <option value="all">{locale === 'bn' ? 'সকল স্ট্যাটাস' : 'All Status'}</option>
            <option value="active">🟢 Active</option>
            <option value="prospect">🟡 Prospect</option>
            <option value="inactive">⚪ Inactive</option>
          </select>

          <select
            value={selectedDivision}
            onChange={(e) => setSelectedDivision(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-medium focus:outline-none"
          >
            <option value="all">{locale === 'bn' ? 'সকল বিভাগ' : 'All Divisions'}</option>
            <option value="Dhaka">Dhaka (ঢাকা)</option>
            <option value="Chittagong">Chittagong (চট্টগ্রাম)</option>
            <option value="Sylhet">Sylhet (সিলেট)</option>
            <option value="Rajshahi">Rajshahi (রাজশাহী)</option>
          </select>
        </div>
      </div>

      {/* Customer Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {customers.length === 0 ? (
          <div className="col-span-full p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 text-slate-400">
            <Building2 className="w-12 h-12 mx-auto mb-2 text-slate-300 dark:text-slate-600" />
            <h3 className="font-bold text-sm text-slate-700 dark:text-slate-300">
              {locale === 'bn' ? 'কোনো গ্রাহক খুঁজে পাওয়া যায়নি' : 'No customer accounts found'}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              {locale === 'bn' ? 'অনুগ্রহ করে সার্চ কোয়েরি পরিবর্তন করুন।' : 'Try adjusting your search query or filter parameters.'}
            </p>
          </div>
        ) : (
          customers.map((cust) => (
            <CustomerCard
              key={cust.id}
              customer={cust}
              locale={locale}
              onViewProfile={(c) => setSelectedCustomer(c)}
              onCreateJob={(c) => {
                if (onCreateJob) onCreateJob(c);
              }}
            />
          ))
        )}
      </div>

      {/* Add Customer Modal */}
      <CustomerForm
        isOpen={isAddModalOpen}
        locale={locale}
        onClose={() => setIsAddModalOpen(false)}
        onSave={addCustomer}
      />
    </div>
  );
};
