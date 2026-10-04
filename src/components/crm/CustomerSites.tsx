import React, { useState } from 'react';
import { ServiceSite } from '../../types/customer';
import {
  MapPin,
  Building,
  Plus,
  Wrench,
  AlertTriangle,
  CheckCircle2,
  Phone,
  Clock,
} from 'lucide-react';
import { motion } from 'motion/react';

export interface CustomerSitesProps {
  sites: ServiceSite[];
  locale?: 'en' | 'bn';
  onAddSite: () => void;
  onCreateJobForSite: (site: ServiceSite) => void;
}

export const CustomerSites: React.FC<CustomerSitesProps> = ({
  sites,
  locale = 'en',
  onAddSite,
  onCreateJobForSite,
}) => {
  const [search, setSearch] = useState('');

  const filteredSites = sites.filter((s) => {
    const q = search.toLowerCase();
    return (
      s.siteName.toLowerCase().includes(q) ||
      (s.siteNameBangla && s.siteNameBangla.includes(q)) ||
      s.address.area.toLowerCase().includes(q) ||
      s.siteCode.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-4 text-xs">
      {/* Search & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-2xl border border-slate-200 dark:border-slate-700">
        <div className="relative flex-1 max-w-sm">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={locale === 'bn' ? 'সাইট নাম বা এলাকা খুঁজুন...' : 'Search sites by name or area...'}
            className="w-full pl-3 pr-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
          />
        </div>

        <button
          onClick={onAddSite}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>{locale === 'bn' ? '+ নতুন সাইট যোগ করুন' : '+ Add Service Site'}</span>
        </button>
      </div>

      {/* Sites Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredSites.length === 0 ? (
          <div className="col-span-2 p-8 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-400">
            <Building className="w-8 h-8 mx-auto mb-2 opacity-40" />
            <p className="font-semibold text-xs">
              {locale === 'bn' ? 'কোনো সার্ভিস সাইট নেই' : 'No service sites found.'}
            </p>
          </div>
        ) : (
          filteredSites.map((site) => (
            <motion.div
              key={site.id}
              whileHover={{ y: -2 }}
              className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-3"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      {site.siteCode}
                    </span>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white mt-1">
                      {locale === 'bn' && site.siteNameBangla ? site.siteNameBangla : site.siteName}
                    </h4>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                    {site.siteType}
                  </span>
                </div>

                <div className="space-y-1 text-slate-600 dark:text-slate-400">
                  <div className="flex items-start gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                    <span>
                      {site.address.street}, {site.address.area}, {site.address.district}
                    </span>
                  </div>

                  {site.siteContactName && (
                    <div className="flex items-center gap-1.5 text-slate-500">
                      <Phone className="w-3 h-3 text-emerald-500 shrink-0" />
                      <span>{site.siteContactName} ({site.siteContactPhone})</span>
                    </div>
                  )}
                </div>

                {/* Service chips & equipment count */}
                <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                  {site.serviceTypes.map((svc) => (
                    <span
                      key={svc}
                      className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[10px] font-medium text-slate-700 dark:text-slate-300"
                    >
                      {svc}
                    </span>
                  ))}
                  {site.equipmentList && site.equipmentList.length > 0 && (
                    <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 text-[10px] font-bold font-mono">
                      {site.equipmentList.length} assets installed
                    </span>
                  )}
                </div>
              </div>

              {/* Action Footer */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="font-mono text-slate-400 text-[11px]">
                  {site.totalJobs} {locale === 'bn' ? 'টি কাজ সম্পন্ন' : 'total work orders'}
                </span>

                <button
                  onClick={() => onCreateJobForSite(site)}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 transition-colors flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{locale === 'bn' ? 'কাজের অর্ডার' : 'Create Job'}</span>
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};
