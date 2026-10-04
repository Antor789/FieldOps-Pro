import React, { useState } from 'react';
import { ServiceSite } from '../../types/customer';
import { X, Building, MapPin, Check, Plus } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export interface SiteFormProps {
  isOpen: boolean;
  locale?: 'en' | 'bn';
  onClose: () => void;
  onSave: (siteData: any) => void;
}

export const SiteForm: React.FC<SiteFormProps> = ({
  isOpen,
  locale = 'en',
  onClose,
  onSave,
}) => {
  const { addToast } = useToast();

  const [siteName, setSiteName] = useState('Uttara Sector 4 Regional Logistics Hub');
  const [siteNameBangla, setSiteNameBangla] = useState('উত্তরা সেক্টর ৪ আঞ্চলিক হাব');
  const [siteType, setSiteType] = useState<ServiceSite['siteType']>('warehouse');
  const [division, setDivision] = useState('Dhaka');
  const [district, setDistrict] = useState('Dhaka');
  const [area, setArea] = useState('Uttara Sector 4');
  const [street, setStreet] = useState('House 15, Road 7, Sector 4, Uttara');
  const [landmark, setLandmark] = useState('Opposite Uttara Rajuk College & Sector 4 Park');
  const [contactName, setContactName] = useState('Mohammad Rasel');
  const [contactPhone, setContactPhone] = useState('+880 1713-998877');
  const [services, setServices] = useState<string[]>(['Electrical', 'Telecom']);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    onSave({
      siteName,
      siteNameBangla,
      siteType,
      address: {
        street,
        area,
        district,
        division,
        landmark,
      },
      siteContactName: contactName,
      siteContactPhone: contactPhone,
      serviceTypes: services,
      totalJobs: 0,
      isActive: true,
    });

    addToast({
      title: 'Service Site Added',
      message: `${siteName} registered under customer account.`,
      type: 'success',
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-scaleIn">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950/60">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400">
              <Building className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {locale === 'bn' ? 'নতুন সার্ভিস সাইট নিবন্ধন' : 'Add Service Site'}
              </h3>
              <p className="text-xs text-slate-500">
                {locale === 'bn' ? 'কাস্টমার লোকেশন ও ঠিকানা যোগ করুন' : 'Service Point & Location Facility'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Site Name *
            </label>
            <input
              type="text"
              required
              value={siteName}
              onChange={(e) => setSiteName(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                সাইটের নাম (বাংলা)
              </label>
              <input
                type="text"
                value={siteNameBangla}
                onChange={(e) => setSiteNameBangla(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Site Type *
              </label>
              <select
                value={siteType}
                onChange={(e) => setSiteType(e.target.value as ServiceSite['siteType'])}
                className="w-full px-2.5 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              >
                <option value="office">🏢 Corporate Office</option>
                <option value="factory">🏭 Industrial Plant / Factory</option>
                <option value="warehouse">📦 Hub / Warehouse</option>
                <option value="retail">🏬 Retail / Commercial</option>
              </select>
            </div>
          </div>

          {/* Address */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
            <h4 className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-rose-500" />
              <span>Location Address</span>
            </h4>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-[10px] text-slate-500 mb-1">Division</label>
                <input
                  type="text"
                  value={division}
                  onChange={(e) => setDivision(e.target.value)}
                  className="w-full px-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs"
                />
              </div>
              <div>
                <label className="block text-[10px] text-slate-500 mb-1">District</label>
                <input
                  type="text"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full px-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs"
                />
              </div>
              <div>
                <label className="block text-[10px] text-slate-500 mb-1">Area / Thana</label>
                <input
                  type="text"
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  className="w-full px-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] text-slate-500 mb-1">Street Address</label>
              <input
                type="text"
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs"
              />
            </div>

            <div>
              <label className="block text-[10px] text-slate-500 mb-1">Landmark Ref</label>
              <input
                type="text"
                value={landmark}
                onChange={(e) => setLandmark(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs"
              />
            </div>
          </div>

          {/* On-Site Contact Person */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                On-Site Contact Name
              </label>
              <input
                type="text"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Contact Phone
              </label>
              <input
                type="text"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono text-slate-900 dark:text-white"
              />
            </div>
          </div>

          {/* Action Footer */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition-colors flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Save Site</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
