import React, { useState } from 'react';
import { Contact } from '../../types/customer';
import { X, User, Phone, Mail, Check } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export interface ContactFormProps {
  isOpen: boolean;
  locale?: 'en' | 'bn';
  onClose: () => void;
  onSave: (contactData: any) => void;
}

export const ContactForm: React.FC<ContactFormProps> = ({
  isOpen,
  locale = 'en',
  onClose,
  onSave,
}) => {
  const { addToast } = useToast();

  const [name, setName] = useState('Engr. Mahmudul Hasan');
  const [nameBangla, setNameBangla] = useState('প্রকৌঃ মাহমুদুল হাসান');
  const [designation, setDesignation] = useState('Senior Network Engineer');
  const [department, setDepartment] = useState('NOC & Transmission');
  const [email, setEmail] = useState('mahmudul.hasan@gp.com');
  const [phone, setPhone] = useState('+880 1711-889900');
  const [whatsapp, setWhatsapp] = useState('+880 1711-889900');
  const [role, setRole] = useState<Contact['role']>('technical');
  const [preferredContactMethod, setPreferredContactMethod] = useState<Contact['preferredContactMethod']>('phone');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    onSave({
      name,
      nameBangla,
      designation,
      department,
      email,
      phone,
      whatsapp,
      role,
      isPrimary: false,
      preferredContactMethod,
      preferredLanguage: 'en',
      isActive: true,
    });

    addToast({
      title: 'Contact Enrolled',
      message: `${name} (${designation}) added.`,
      type: 'success',
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-scaleIn">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950/60">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {locale === 'bn' ? 'নতুন প্রতিনিধি যোগ করুন' : 'Add Contact Person'}
              </h3>
              <p className="text-xs text-slate-500">
                {locale === 'bn' ? 'কাস্টমার পয়েন্ট অফ কন্টাক্ট (POC)' : 'Customer Key Stakeholder'}
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
        <form onSubmit={handleSubmit} className="p-5 space-y-3.5 text-xs">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Full Name (English) *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                নাম (বাংলা)
              </label>
              <input
                type="text"
                value={nameBangla}
                onChange={(e) => setNameBangla(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Designation
              </label>
              <input
                type="text"
                value={designation}
                onChange={(e) => setDesignation(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Role Function *
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as Contact['role'])}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              >
                <option value="technical">🔧 Technical Lead</option>
                <option value="billing">💰 Billing & Tax</option>
                <option value="escalation">🚨 Escalation</option>
                <option value="primary">⭐ Primary</option>
                <option value="other">Staff</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Phone Number *
              </label>
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Official Email *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          {/* Action Footer */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
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
              <span>Save Contact</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
