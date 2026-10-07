import React from 'react';
import { AuthLayout } from '../../components/auth/AuthLayout';
import { ShieldCheck, Mail, Phone, Building, ArrowLeft, CheckCircle2 } from 'lucide-react';

export interface RegisterNoticeProps {
  onBackToLogin: () => void;
  locale?: 'en' | 'bn';
  onLocaleChange?: (lang: 'en' | 'bn') => void;
}

export const RegisterNoticePage: React.FC<RegisterNoticeProps> = ({
  onBackToLogin,
  locale = 'en',
  onLocaleChange,
}) => {
  return (
    <AuthLayout
      title={locale === 'bn' ? 'এন্টারপ্রাইজ অ্যাকাউন্ট নিবন্ধন' : 'Enterprise Registration Policy'}
      subtitle={
        locale === 'bn'
          ? 'ফিল্ডঅপস প্রো একটি সুরক্ষিত এন্টারপ্রাইজ প্ল্যাটফর্ম। অ্যাকাউন্ট শুধুমাত্র অনুমোদিত অ্যাডমিন দ্বারা খোলা যায়।'
          : 'FieldOps Pro accounts are strictly provisioned by certified corporate administrators.'
      }
      locale={locale}
      onLocaleChange={onLocaleChange}
    >
      <div className="space-y-6">
        <div className="p-5 rounded-3xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Managed Identity & RBAC Protocol
              </h4>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Statutory National Board of Revenue & ISO compliance
              </p>
            </div>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            To prevent unauthorized access to customer service sites, telemetry tracking, and NBR VAT invoicing records, public self-registration is disabled. All field technicians, dispatchers, and regional managers receive provisioned credentials directly from their company NOC administrator.
          </p>

          <div className="pt-2 border-t border-slate-200 dark:border-slate-700/80 space-y-2 text-xs">
            <div className="font-bold text-slate-800 dark:text-slate-200 mb-1">
              Need onboarding for your organization or team?
            </div>
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
              <Mail className="w-3.5 h-3.5 text-emerald-500" />
              <span>Direct NOC Desk: <strong className="text-slate-900 dark:text-white font-mono">noc.admin@fieldops.com.bd</strong></span>
            </div>
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
              <Phone className="w-3.5 h-3.5 text-blue-500" />
              <span>Dhaka Support Hotline: <strong className="text-slate-900 dark:text-white font-mono">+880 2-8888-1234</strong></span>
            </div>
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
              <Building className="w-3.5 h-3.5 text-purple-500" />
              <span>Headquarters: House 45, Road 12, Gulshan 2, Dhaka 1212</span>
            </div>
          </div>
        </div>

        {/* Back to Login */}
        <div className="text-center pt-2">
          <button
            type="button"
            onClick={onBackToLogin}
            className="inline-flex items-center gap-1.5 py-2.5 px-5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-semibold hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors shadow-xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{locale === 'bn' ? 'সাইন ইন স্ক্রিনে ফিরে যান' : 'Return to Sign In'}</span>
          </button>
        </div>
      </div>
    </AuthLayout>
  );
};
