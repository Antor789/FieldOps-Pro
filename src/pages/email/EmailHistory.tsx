import React, { useState, useMemo } from 'react';
import { useEmailNotifications } from '../../hooks/useEmailNotifications';
import { useEmailTemplates } from '../../hooks/useEmailTemplates';
import { EmailRecord, EmailStatus, EmailTemplateType } from '../../types/email';
import { EmailPreview } from '../../components/email/EmailPreview';
import {
  History,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Mail,
  Send,
  Eye,
  Clock,
  CheckCheck,
  XCircle,
  TrendingUp,
  FileText,
  Calendar,
  X,
  ExternalLink,
} from 'lucide-react';
import { Button } from '../../components/ui/Button';

export interface EmailHistoryProps {
  locale?: 'en' | 'bn';
}

export const EmailHistoryPage: React.FC<EmailHistoryProps> = ({ locale = 'en' }) => {
  const { emailHistory, emailStats, resendEmail } = useEmailNotifications();
  const { previewTemplate, templates } = useEmailTemplates();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<EmailStatus | 'all'>('all');
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplateType | 'all'>('all');
  const [selectedRecord, setSelectedRecord] = useState<EmailRecord | null>(null);
  const [isResendingId, setIsResendingId] = useState<string | null>(null);

  // Filter history
  const filteredHistory = useMemo(() => {
    return emailHistory.filter((record) => {
      if (selectedStatus !== 'all' && record.status !== selectedStatus) {
        return false;
      }
      if (selectedTemplate !== 'all' && record.templateId !== selectedTemplate) {
        return false;
      }
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return (
          record.to.toLowerCase().includes(q) ||
          record.toName.toLowerCase().includes(q) ||
          record.subject.toLowerCase().includes(q) ||
          (record.workOrderId && record.workOrderId.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [emailHistory, selectedStatus, selectedTemplate, searchQuery]);

  const handleResend = async (record: EmailRecord) => {
    setIsResendingId(record.id);
    await resendEmail(record.id);
    setIsResendingId(null);
  };

  const getStatusBadge = (status: EmailStatus) => {
    switch (status) {
      case 'delivered':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300">
            <CheckCheck className="w-3 h-3 text-emerald-600" />
            Delivered
          </span>
        );
      case 'sent':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 text-blue-800 dark:bg-blue-950/80 dark:text-blue-300">
            <Clock className="w-3 h-3 text-blue-600" />
            Sent
          </span>
        );
      case 'failed':
      case 'bounced':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300">
            <XCircle className="w-3 h-3 text-rose-600" />
            {status === 'bounced' ? 'Bounced' : 'Failed'}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300">
            Queued
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold shadow-xs">
            <History className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <span>Email Delivery History</span>
              <span className="text-[10px] bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 font-bold px-2 py-0.5 rounded-full">
                {emailHistory.length} Total Logs
              </span>
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Audit trail of all automated transactional emails, delivery timestamps, open rates, and bounces
            </p>
          </div>
        </div>
      </div>

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-2xs">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Total Dispatched
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 mt-1">
            {emailStats.totalSent.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">
            {emailStats.todayCount} sent today
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-2xs">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Delivery Rate
          </div>
          <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">
            {emailStats.deliveryRate}%
          </div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-0.5">
            {emailStats.delivered} delivered successfully
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-2xs">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Open Rate
          </div>
          <div className="text-2xl font-extrabold text-indigo-600 dark:text-indigo-400 mt-1">
            {emailStats.openRate}%
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">
            {emailStats.opened} opened by recipient
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-2xs">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Failed / Bounces
          </div>
          <div className="text-2xl font-extrabold text-rose-600 dark:text-rose-400 mt-1">
            {emailStats.failed}
          </div>
          <div className="text-[11px] text-rose-500 mt-0.5">
            {emailStats.bounced} hard bounces logged
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-2xs">
        <div className="flex items-center space-x-2 flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by recipient, subject, work order..."
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        <div className="flex items-center space-x-2 overflow-x-auto pb-1 sm:pb-0">
          {/* Status selector */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value as any)}
            className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="delivered">Delivered</option>
            <option value="sent">Sent</option>
            <option value="failed">Failed</option>
            <option value="bounced">Bounced</option>
          </select>

          {/* Template selector */}
          <select
            value={selectedTemplate}
            onChange={(e) => setSelectedTemplate(e.target.value as any)}
            className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none"
          >
            <option value="all">All Templates</option>
            {templates.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* History Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50/80 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">Time</th>
                <th className="py-3 px-4">Recipient</th>
                <th className="py-3 px-4">Subject</th>
                <th className="py-3 px-4">Context</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredHistory.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <Mail className="w-8 h-8 mx-auto mb-2 opacity-30" />
                    No email records match your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredHistory.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition"
                  >
                    <td className="py-3.5 px-4 font-mono text-slate-500 text-[11px] whitespace-nowrap">
                      {new Date(item.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      <div className="text-[10px] text-slate-400">
                        {new Date(item.sentAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900 dark:text-slate-100">
                        {item.toName}
                      </div>
                      <div className="font-mono text-[11px] text-slate-500">{item.to}</div>
                    </td>

                    <td className="py-3.5 px-4 max-w-xs">
                      <div className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                        {item.subject}
                      </div>
                      {item.errorMessage ? (
                        <div className="text-[10px] text-rose-500 truncate mt-0.5">
                          ⚠️ {item.errorMessage}
                        </div>
                      ) : (
                        <div className="text-[11px] text-slate-400 truncate mt-0.5">
                          {item.previewSnippet}
                        </div>
                      )}
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {item.workOrderId && (
                        <span className="font-mono text-[10px] bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded font-bold text-slate-700 dark:text-slate-300">
                          {item.workOrderId}
                        </span>
                      )}
                      {item.amountBDT && (
                        <div className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                          ৳{item.amountBDT.toLocaleString()} BDT
                        </div>
                      )}
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {getStatusBadge(item.status)}
                    </td>

                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end space-x-1.5">
                        <button
                          onClick={() => setSelectedRecord(item)}
                          className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition cursor-pointer"
                          title="View Message Payload & HTML"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => handleResend(item)}
                          disabled={isResendingId === item.id}
                          className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 text-indigo-700 dark:text-indigo-300 transition cursor-pointer"
                          title="Resend this email"
                        >
                          <RotateCcw className={`w-3.5 h-3.5 ${isResendingId === item.id ? 'animate-spin' : ''}`} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Record Inspect Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs font-sans">
          <div className="relative w-full max-w-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/60">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  Email Message Audit Log: #{selectedRecord.id}
                </h3>
                <p className="text-xs text-slate-500">
                  Sent: {new Date(selectedRecord.sentAt).toLocaleString()}
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleResend(selectedRecord)}
                  leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
                >
                  Resend Now
                </Button>
                <button
                  onClick={() => setSelectedRecord(null)}
                  className="p-1 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-auto p-4 space-y-4">
              {/* Metadata details */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-3 bg-slate-50 dark:bg-slate-950 rounded-xl text-xs border border-slate-200 dark:border-slate-800">
                <div>
                  <span className="text-[10px] text-slate-400 block">Recipient:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{selectedRecord.toName}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Address:</span>
                  <span className="font-mono text-slate-800 dark:text-slate-200">{selectedRecord.to}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Delivery State:</span>
                  <div>{getStatusBadge(selectedRecord.status)}</div>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Opened At:</span>
                  <span className="font-mono text-slate-800 dark:text-slate-200">
                    {selectedRecord.openedAt ? new Date(selectedRecord.openedAt).toLocaleTimeString() : 'Unopened'}
                  </span>
                </div>
              </div>

              {/* Injected HTML Preview */}
              <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs">
                <EmailPreview
                  htmlContent={previewTemplate(selectedRecord.templateId, {
                    work_order_id: selectedRecord.workOrderId || 'WO-9045',
                    customer_name: selectedRecord.toName,
                  })}
                  subject={selectedRecord.subject}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
