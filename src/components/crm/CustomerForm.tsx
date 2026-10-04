import React, { useState } from 'react';
import { Customer, CustomerType, CustomerStatus } from '../../types/customer';
import { X, Building2, Check, MapPin, User, Phone, Mail } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export interface CustomerFormProps {
  isOpen: boolean;
  initialCustomer?: Customer | null;
  locale?: 'en' | 'bn';
  onClose: () => void;
  onSave: (customerData: any) => void;
}

export const CustomerForm: React.FC<CustomerFormProps> = ({
  isOpen,
  initialCustomer,
  locale = 'en',
  onClose,
  onSave,
}) => {
  const { addToast } = useToast();

  const [companyName, setCompanyName] = useState(initialCustomer?.companyName || 'Robi Axiata Limited');
  const [companyNameBangla, setCompanyNameBangla] = useState(initialCustomer?.companyNameBangla || 'রবি আজিয়াটা লিমিটেড');
  const [customerType, setCustomerType] = useState<CustomerType>(initialCustomer?.customerType || 'enterprise');
  const [status, setStatus] = useState<CustomerStatus>(initialCustomer?.status || 'active');
  const [nbrBin, setNbrBin] = useState(initialCustomer?.nbrBin || '003928102-0404');
  const [primaryPhone, setPrimaryPhone] = useState(initialCustomer?.primaryPhone || '+880 1819-009988');
  const [primaryEmail, setPrimaryEmail] = useState(initialCustomer?.primaryEmail || 'procurement@robi.com.bd');
  
  // Head Office Address
  const [division, setDivision] = useState(initialCustomer?.headOffice?.division || 'Dhaka');
  const [district, setDistrict] = useState(initialCustomer?.headOffice?.district || 'Dhaka');
  const [area, setArea] = useState(initialCustomer?.headOffice?.area || 'Gulshan 1');
  const [street, setStreet] = useState(initialCustomer?.headOffice?.street || 'Robi Corporate Center, 53 Gulshan South Avenue');
  const [landmark, setLandmark] = useState(initialCustomer?.headOffice?.landmark || 'Near Gulshan 1 DCC Market & Police Plaza');

  // Primary Contact
  const [contactName, setContactName] = useState(initialCustomer?.contacts?.[0]?.name || 'Shakil Ahmed');
  const [contactDesignation, setContactDesignation] = useState(initialCustomer?.contacts?.[0]?.designation || 'Facilities Supervisor');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const contactId = initialCustomer?.primaryContactId || `cnt-${Date.now()}`;
    const primaryContact = {
      id: contactId,
      customerId: initialCustomer?.id || '',
      name: contactName,
      designation: contactDesignation,
      email: primaryEmail,
      phone: primaryPhone,
      role: 'primary' as const,
      isPrimary: true,
      preferredContactMethod: 'phone' as const,
      preferredLanguage: 'en' as const,
      isActive: true,
    };

    onSave({
      companyName,
      companyNameBangla,
      customerType,
      status,
      nbrBin,
      primaryEmail,
      primaryPhone,
      headOffice: {
        street,
        area,
        district,
        division,
        landmark,
      },
      primaryContactId: contactId,
      contacts: initialCustomer ? initialCustomer.contacts : [primaryContact],
      sites: initialCustomer ? initialCustomer.sites : [],
      hasServiceAgreement: initialCustomer?.hasServiceAgreement || true,
      tags: initialCustomer?.tags || [customerType.toUpperCase(), 'Dhaka Region'],
      paymentTermsDays: 30,
    });

    addToast({
      title: initialCustomer ? 'Customer Updated' : 'New Customer Enrolled',
      message: `${companyName} saved successfully to CRM.`,
      type: 'success',
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-scaleIn">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950/60">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {initialCustomer
                  ? locale === 'bn' ? 'গ্রাহক তথ্য সম্পাদনা' : 'Edit Customer Account'
                  : locale === 'bn' ? 'নতুন গ্রাহক যোগ করুন' : 'Enroll Enterprise Customer'}
              </h3>
              <p className="text-xs text-slate-500">
                {locale === 'bn' ? 'বাংলাদেশ এনবিআর ভ্যাট ও কর্পোরেট প্রোফাইল' : 'Bangladesh Corporate CRM & Tax Profile'}
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
          {/* Company Names */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Company Name (English) *
              </label>
              <input
                type="text"
                required
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                প্রতিষ্ঠানের নাম (বাংলা)
              </label>
              <input
                type="text"
                value={companyNameBangla}
                onChange={(e) => setCompanyNameBangla(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Type, Status & NBR VAT BIN */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Account Type *
              </label>
              <select
                value={customerType}
                onChange={(e) => setCustomerType(e.target.value as CustomerType)}
                className="w-full px-2.5 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              >
                <option value="enterprise">🏢 Enterprise</option>
                <option value="sme">🏬 SME / Commercial</option>
                <option value="government">🏛️ Government</option>
                <option value="residential">🏠 Residential</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Account Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as CustomerStatus)}
                className="w-full px-2.5 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              >
                <option value="active">🟢 Active</option>
                <option value="prospect">🟡 Prospect</option>
                <option value="inactive">⚪ Inactive</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                NBR 15% VAT BIN
              </label>
              <input
                type="text"
                placeholder="002938102-0101"
                value={nbrBin}
                onChange={(e) => setNbrBin(e.target.value)}
                className="w-full px-2.5 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono text-slate-900 dark:text-white"
              />
            </div>
          </div>

          {/* Phone & Email */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Primary Helpline / Phone *
              </label>
              <input
                type="text"
                required
                value={primaryPhone}
                onChange={(e) => setPrimaryPhone(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Official Invoicing Email *
              </label>
              <input
                type="email"
                required
                value={primaryEmail}
                onChange={(e) => setPrimaryEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          {/* Head Office Address */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
            <h4 className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-rose-500" />
              <span>Head Office Address (প্রধান কার্যালয়)</span>
            </h4>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-[11px] text-slate-500 mb-1">Division *</label>
                <select
                  value={division}
                  onChange={(e) => setDivision(e.target.value)}
                  className="w-full px-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs"
                >
                  <option value="Dhaka">Dhaka (ঢাকা)</option>
                  <option value="Chittagong">Chittagong (চট্টগ্রাম)</option>
                  <option value="Sylhet">Sylhet (সিলেট)</option>
                  <option value="Rajshahi">Rajshahi (রাজশাহী)</option>
                  <option value="Khulna">Khulna (খুলনা)</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] text-slate-500 mb-1">District *</label>
                <input
                  type="text"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full px-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-500 mb-1">Area / Thana *</label>
                <input
                  type="text"
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  className="w-full px-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] text-slate-500 mb-1">Street Address</label>
              <input
                type="text"
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs"
              />
            </div>

            <div>
              <label className="block text-[11px] text-slate-500 mb-1">Local Landmark Ref</label>
              <input
                type="text"
                value={landmark}
                onChange={(e) => setLandmark(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs"
              />
            </div>
          </div>

          {/* Primary Contact Person */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Primary Contact Person
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
                Designation / Department
              </label>
              <input
                type="text"
                value={contactDesignation}
                onChange={(e) => setContactDesignation(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
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
              {locale === 'bn' ? 'বাতিল' : 'Cancel'}
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition-colors flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>{locale === 'bn' ? 'সংরক্ষণ করুন' : 'Save Customer'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
