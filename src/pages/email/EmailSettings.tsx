import React, { useState } from 'react';
import { useEmailNotifications } from '../../hooks/useEmailNotifications';
import { useEmailTemplates } from '../../hooks/useEmailTemplates';
import { TestEmailModal } from '../../components/email/TestEmailModal';
import { Button } from '../../components/ui/Button';
import {
  Server,
  ShieldCheck,
  Send,
  Save,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Mail,
  Lock,
  Globe,
  Sliders,
  Check,
  Building,
} from 'lucide-react';

export interface EmailSettingsProps {
  locale?: 'en' | 'bn';
}

export const EmailSettingsPage: React.FC<EmailSettingsProps> = ({ locale = 'en' }) => {
  const {
    smtpConfig,
    preferences,
    isTestingSmtp,
    testSmtpConnection,
    saveSmtpConfig,
    savePreferences,
    sendEmail,
  } = useEmailNotifications();

  const { templates } = useEmailTemplates();

  const [formData, setFormData] = useState({ ...smtpConfig });
  const [prefData, setPrefData] = useState({ ...preferences });
  const [isTestModalOpen, setIsTestModalOpen] = useState(false);

  const handleSmtpChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: name === 'port' ? Number(value) : value }));
    }
  };

  const handlePrefToggle = (key: keyof typeof preferences) => {
    setPrefData((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSaveAll = (e: React.FormEvent) => {
    e.preventDefault();
    saveSmtpConfig(formData);
    savePreferences(prefData);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto font-sans">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold shadow-xs">
            <Mail className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <span>Email Notification Settings</span>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold px-2 py-0.5 rounded-full">
                SMTP Active
              </span>
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Configure SMTP gateway, automated business triggers, and Bangladesh email sender profiles
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsTestModalOpen(true)}
            leftIcon={<Send className="w-3.5 h-3.5 text-indigo-500" />}
          >
            Send Test Email
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={handleSaveAll}
            leftIcon={<Save className="w-3.5 h-3.5" />}
          >
            Save Settings
          </Button>
        </div>
      </div>

      <form onSubmit={handleSaveAll} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: SMTP Configuration */}
        <div className="lg:col-span-2 space-y-6">
          {/* SMTP Server Configuration Box */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <Server className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  SMTP Server Configuration
                </h2>
              </div>
              <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Connected (Port {formData.port})
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  SMTP Host *
                </label>
                <input
                  type="text"
                  required
                  name="host"
                  value={formData.host}
                  onChange={handleSmtpChange}
                  placeholder="smtp.gmail.com or mail.yourcompany.bd"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Port
                </label>
                <select
                  name="port"
                  value={formData.port}
                  onChange={handleSmtpChange}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-indigo-500"
                >
                  <option value={587}>587 (TLS / STARTTLS)</option>
                  <option value={465}>465 (SSL Encrypted)</option>
                  <option value={25}>25 (Standard Relay)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Username / Account
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleSmtpChange}
                  placeholder="info@fieldops.bd"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Password / App Key
                </label>
                <div className="relative">
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleSmtpChange}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                  <Lock className="w-3.5 h-3.5 absolute right-3 top-2.5 text-slate-400 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* TLS Switch & Test Connection */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <label className="flex items-center space-x-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  name="secureTls"
                  checked={formData.secureTls}
                  onChange={handleSmtpChange}
                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Enforce Secure TLS Encryption (Recommended for Bangladesh NOC)
                </span>
              </label>

              <button
                type="button"
                onClick={testSmtpConnection}
                disabled={isTestingSmtp}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition cursor-pointer border border-slate-200 dark:border-slate-700"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isTestingSmtp ? 'animate-spin text-indigo-600' : ''}`} />
                <span>{isTestingSmtp ? 'Testing Handshake...' : 'Test Connection'}</span>
              </button>
            </div>
          </div>

          {/* Sender Profile */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-5 shadow-sm space-y-4">
            <div className="flex items-center space-x-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <Building className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Sender Identity & Letterhead
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  From Display Name
                </label>
                <input
                  type="text"
                  name="fromName"
                  value={formData.fromName}
                  onChange={handleSmtpChange}
                  placeholder="FieldOps Pro Bangladesh"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  From Email Address
                </label>
                <input
                  type="email"
                  name="fromEmail"
                  value={formData.fromEmail}
                  onChange={handleSmtpChange}
                  placeholder="no-reply@fieldops.bd"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Reply-To Support Address
              </label>
              <input
                type="email"
                name="replyTo"
                value={formData.replyTo || ''}
                onChange={handleSmtpChange}
                placeholder="support@fieldops.bd"
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Notification Preferences Checklist */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <Sliders className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  Notification Triggers
                </h2>
              </div>
              <span className="text-[10px] text-slate-400 uppercase font-semibold">
                Auto-Dispatched
              </span>
            </div>

            <div className="space-y-2.5">
              {[
                { key: 'woAssigned', label: 'Work order assigned to technician', labelBn: 'কাজের দায়িত্ব অর্পণ বিজ্ঞপ্তি' },
                { key: 'woCompleted', label: 'Work order completed notification', labelBn: 'কাজ সম্পন্ন হওয়ার বিজ্ঞপ্তি' },
                { key: 'paymentReceipt', label: 'Payment receipt to customer', labelBn: 'পেমেন্ট রসিদ গ্রাহককে প্রেরণ' },
                { key: 'invoiceDelivery', label: 'Invoice delivery (Mushak 6.3)', labelBn: 'কর চালানপত্র (মুশক ৬.৩)' },
                { key: 'slaBreach', label: 'SLA breach alerts', labelBn: 'এসএলএ চুক্তি লঙ্ঘন সতর্কতা' },
                { key: 'dailyReport', label: 'Daily operations report', labelBn: 'দৈনিক অপারেশনাল সারাংশ' },
                { key: 'userInvitation', label: 'New user invitation', labelBn: 'নতুন ব্যবহারকারী আমন্ত্রণ' },
                { key: 'passwordReset', label: 'Password reset emails', labelBn: 'পাসওয়ার্ড রিসেট ইমেইল' },
                { key: 'feedbackRequests', label: 'Customer feedback requests', labelBn: 'গ্রাহক মতামত জরিপ' },
                { key: 'inventoryAlerts', label: 'Low inventory stock alerts', labelBn: 'যন্ত্রাংশের ঘাটতি সতর্কতা' },
                { key: 'scheduledReports', label: 'Scheduled automated reports', labelBn: 'নির্ধারিত স্বয়ংক্রিয় রিপোর্ট' },
              ].map((item) => (
                <label
                  key={item.key}
                  className="flex items-start space-x-2.5 p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={prefData[item.key as keyof typeof preferences] ?? true}
                    onChange={() => handlePrefToggle(item.key as keyof typeof preferences)}
                    className="mt-0.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <div className="text-xs">
                    <span className="font-semibold text-slate-800 dark:text-slate-200 block">
                      {item.label}
                    </span>
                    <span className="text-[10px] text-slate-400 block">{item.labelBn}</span>
                  </div>
                </label>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
              <Button
                type="submit"
                variant="primary"
                className="w-full"
                leftIcon={<Save className="w-4 h-4" />}
              >
                Save Preferences
              </Button>
            </div>
          </div>
        </div>
      </form>

      {/* Test Email Modal */}
      <TestEmailModal
        isOpen={isTestModalOpen}
        onClose={() => setIsTestModalOpen(false)}
        templates={templates}
        onSend={sendEmail}
      />
    </div>
  );
};
