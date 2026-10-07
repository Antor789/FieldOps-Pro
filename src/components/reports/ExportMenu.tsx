import React, { useState } from 'react';
import { GeneratedReport } from '../../types/reports';
import { useReportExport } from '../../hooks/useReportExport';
import { FileText, FileSpreadsheet, Download, Mail, RefreshCw, Loader2, Check } from 'lucide-react';

export interface ExportMenuProps {
  report: GeneratedReport;
  onRefresh?: () => void;
  locale?: 'en' | 'bn';
}

export const ExportMenu: React.FC<ExportMenuProps> = ({ report, onRefresh, locale = 'en' }) => {
  const { isExporting, exportPDF, exportExcel, exportCSV, sendByEmail } = useReportExport();
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [recipientEmail, setRecipientEmail] = useState('');
  const [emailSent, setEmailSent] = useState(false);

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipientEmail) return;
    await sendByEmail(report, recipientEmail);
    setEmailSent(true);
    setTimeout(() => {
      setIsEmailModalOpen(false);
      setEmailSent(false);
      setRecipientEmail('');
    }, 1500);
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* PDF Export */}
      <button
        onClick={() => exportPDF(report)}
        disabled={isExporting}
        className="flex items-center gap-1.5 py-2 px-3.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 text-xs font-semibold shadow-xs transition-all disabled:opacity-50"
      >
        {isExporting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <FileText className="w-3.5 h-3.5 text-rose-400 dark:text-rose-600" />}
        <span>{locale === 'bn' ? 'পিডিএফ ডাউনলোড' : 'Export PDF'}</span>
      </button>

      {/* Excel Export */}
      <button
        onClick={() => exportExcel(report)}
        disabled={isExporting}
        className="flex items-center gap-1.5 py-2 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/60 text-slate-800 dark:text-slate-200 text-xs font-semibold shadow-xs transition-colors disabled:opacity-50"
      >
        <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
        <span>{locale === 'bn' ? 'এক্সেল (.xlsx)' : 'Export Excel'}</span>
      </button>

      {/* CSV Export */}
      <button
        onClick={() => exportCSV(report)}
        disabled={isExporting}
        className="flex items-center gap-1.5 py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/60 text-slate-700 dark:text-slate-300 text-xs font-medium transition-colors disabled:opacity-50"
      >
        <Download className="w-3.5 h-3.5 text-slate-400" />
        <span>CSV</span>
      </button>

      {/* Email Modal Trigger */}
      <button
        onClick={() => setIsEmailModalOpen(true)}
        className="flex items-center gap-1.5 py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/60 text-slate-700 dark:text-slate-300 text-xs font-medium transition-colors"
      >
        <Mail className="w-3.5 h-3.5 text-blue-500" />
        <span>{locale === 'bn' ? 'ইমেইল' : 'Email'}</span>
      </button>

      {/* Re-generate / Refresh */}
      {onRefresh && (
        <button
          onClick={onRefresh}
          title="Refresh report data"
          className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/60 text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      )}

      {/* Email Dispatch Modal */}
      {isEmailModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 w-full max-w-md shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-500" />
                {locale === 'bn' ? 'ইমেইলে রিপোর্ট প্রেরণ' : 'Send Report via Email'}
              </h3>
              <button
                onClick={() => setIsEmailModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              {locale === 'bn'
                ? `"${report.templateName}" রিপোর্টটি সংযুক্ত পিডিএফ আকারে নির্ধারিত ঠিকানায় পাঠানো হবে।`
                : `A PDF summary of "${report.templateName}" will be delivered to the specified email address.`}
            </p>

            <form onSubmit={handleSendEmail} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Recipient Email Address *
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. director@fieldops.com.bd"
                  value={recipientEmail}
                  onChange={(e) => setRecipientEmail(e.target.value)}
                  className="w-full text-xs py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEmailModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isExporting || emailSent}
                  className="px-4 py-2 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl flex items-center gap-1.5 transition-colors disabled:opacity-50"
                >
                  {isExporting ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : emailSent ? (
                    <Check className="w-3.5 h-3.5" />
                  ) : (
                    <Mail className="w-3.5 h-3.5" />
                  )}
                  <span>{emailSent ? 'Sent Successfully' : 'Send PDF Report'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
