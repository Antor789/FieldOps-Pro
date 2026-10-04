import React from 'react';
import { Contact } from '../../types/customer';
import { User, Phone, Mail, MessageSquare, Plus, Star, Edit2 } from 'lucide-react';
import { motion } from 'motion/react';

export interface CustomerContactsProps {
  contacts: Contact[];
  locale?: 'en' | 'bn';
  onAddContact: () => void;
}

const ROLE_BADGES = {
  primary: { bg: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300', label: 'Primary POC' },
  billing: { bg: 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300', label: 'Billing & VAT' },
  technical: { bg: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300', label: 'Technical Lead' },
  escalation: { bg: 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300', label: 'Escalation' },
  other: { bg: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300', label: 'Staff' },
};

export const CustomerContacts: React.FC<CustomerContactsProps> = ({
  contacts,
  locale = 'en',
  onAddContact,
}) => {
  return (
    <div className="space-y-4 text-xs">
      <div className="flex items-center justify-between">
        <h4 className="font-bold text-sm text-slate-900 dark:text-white">
          {locale === 'bn' ? 'গ্রাহক প্রতিনিধি ও যোগাযোগের তালিকা' : 'Key Account Stakeholders & Contacts'}
        </h4>
        <button
          onClick={onAddContact}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>{locale === 'bn' ? '+ নতুন প্রতিনিধি' : '+ Add Contact'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {contacts.map((contact) => {
          const badge = ROLE_BADGES[contact.role] || ROLE_BADGES.other;

          return (
            <motion.div
              key={contact.id}
              whileHover={{ y: -2 }}
              className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 font-bold text-slate-800 dark:text-slate-200 flex items-center justify-center text-xs">
                      {contact.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                        {locale === 'bn' && contact.nameBangla ? contact.nameBangla : contact.name}
                      </h4>
                      <p className="text-[11px] text-slate-500 font-medium">
                        {contact.designation} {contact.department && `• ${contact.department}`}
                      </p>
                    </div>
                  </div>

                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${badge.bg}`}>
                    {badge.label}
                  </span>
                </div>

                {contact.notes && (
                  <p className="text-[11px] text-slate-500 italic mt-2 bg-slate-50 dark:bg-slate-800/40 p-2 rounded-lg border border-slate-100 dark:border-slate-800">
                    {contact.notes}
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-1 text-[11px] text-slate-400 font-mono">
                  <span>Pref: {contact.preferredContactMethod.toUpperCase()}</span>
                  <span>•</span>
                  <span>Lang: {contact.preferredLanguage.toUpperCase()}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <a
                    href={`tel:${contact.phone}`}
                    className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-emerald-50 text-emerald-600 dark:text-emerald-400"
                    title="Call"
                  >
                    <Phone className="w-3.5 h-3.5" />
                  </a>
                  <a
                    href={`mailto:${contact.email}`}
                    className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-indigo-50 text-indigo-600 dark:text-indigo-400"
                    title="Email"
                  >
                    <Mail className="w-3.5 h-3.5" />
                  </a>
                  {contact.whatsapp && (
                    <a
                      href={`https://wa.me/${contact.whatsapp.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noreferrer"
                      className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-emerald-50 text-emerald-600 dark:text-emerald-400"
                      title="WhatsApp"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
