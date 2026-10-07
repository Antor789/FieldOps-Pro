import React, { useState } from 'react';
import { EmailTemplate, EmailTemplateType } from '../../types/email';
import { renderTemplate, getSampleDataMap } from '../../utils/emailRenderer';
import { X, Send, Eye, CheckCircle2, RefreshCw, Mail, User, Sparkles } from 'lucide-react';
import { Button } from '../ui/Button';

export interface TestEmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  templates: EmailTemplate[];
  initialTemplate?: EmailTemplate;
  onSend: (templateId: EmailTemplateType, to: string, data: Record<string, any>, toName?: string) => Promise<any>;
}

export const TestEmailModal: React.FC<TestEmailModalProps> = ({
  isOpen,
  onClose,
  templates,
  initialTemplate,
  onSend,
}) => {
  const [selectedTemplateId, setSelectedTemplateId] = useState<EmailTemplateType>(
    initialTemplate?.id || templates[0]?.id || 'wo_assigned'
  );
  const [recipientEmail, setRecipientEmail] = useState('antormahin45455@gmail.com');
  const [recipientName, setRecipientName] = useState('Engr. Antor Mahin');
  const [isSending, setIsSending] = useState(false);
  const [showLivePreview, setShowLivePreview] = useState(false);
  const [customParams, setCustomParams] = useState<Record<string, string>>(getSampleDataMap());

  if (!isOpen) return null;

  const currentTemplate = templates.find((t) => t.id === selectedTemplateId) || templates[0];
  const renderedHtml = currentTemplate
    ? renderTemplate(currentTemplate.bodyHtml, customParams, currentTemplate.name)
    : '';

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipientEmail) return;

    setIsSending(true);
    try {
      await onSend(selectedTemplateId, recipientEmail, customParams, recipientName);
      onClose();
    } catch (err) {
      console.error('Failed to send test email:', err);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs font-sans">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/80 dark:bg-slate-800/50">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Send className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100">
                Send Test Email Notification
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Verify template layout and SMTP delivery to real inboxes
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Form */}
        <form onSubmit={handleSend} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 text-xs">
          {/* Template Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Select Email Template to Test
            </label>
            <select
              value={selectedTemplateId}
              onChange={(e) => setSelectedTemplateId(e.target.value as EmailTemplateType)}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              {templates.map((tpl) => (
                <option key={tpl.id} value={tpl.id}>
                  {tpl.name} ({tpl.nameBangla})
                </option>
              ))}
            </select>
          </div>

          {/* Recipient Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Recipient Email Address *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="email"
                  required
                  value={recipientEmail}
                  onChange={(e) => setRecipientEmail(e.target.value)}
                  placeholder="name@company.bd"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Recipient Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  placeholder="e.g. Engr. Antor Mahin"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Quick preset chips */}
          <div className="flex items-center space-x-2 text-[11px]">
            <span className="text-slate-400 font-medium">Quick Recipient:</span>
            <button
              type="button"
              onClick={() => {
                setRecipientEmail('antormahin45455@gmail.com');
                setRecipientName('Antor Mahin (User)');
              }}
              className="px-2 py-0.5 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 font-semibold cursor-pointer"
            >
              My Account
            </button>
            <button
              type="button"
              onClick={() => {
                setRecipientEmail('rahim.tech@fieldops.bd');
                setRecipientName('Md. Rahim Uddin (Lead Tech)');
              }}
              className="px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 font-semibold cursor-pointer"
            >
              Field Tech Lead
            </button>
            <button
              type="button"
              onClick={() => {
                setRecipientEmail('procurement@grameenphone.com');
                setRecipientName('Grameenphone Corporate Client');
              }}
              className="px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 font-semibold cursor-pointer"
            >
              Customer
            </button>
          </div>

          {/* Subject Line Preview */}
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-400">Subject Preview:</span>
            <p className="font-mono text-slate-800 dark:text-slate-200 font-semibold text-xs mt-0.5 truncate">
              {currentTemplate?.subject}
            </p>
          </div>

          {/* Live Preview Toggle */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <button
                type="button"
                onClick={() => setShowLivePreview(!showLivePreview)}
                className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>{showLivePreview ? 'Hide Live Preview' : 'Show In-Modal Preview Before Sending'}</span>
              </button>
              <span className="text-[10px] text-slate-400">Sample Bangladesh data injected</span>
            </div>

            {showLivePreview && (
              <div className="h-64 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden shadow-inner bg-white">
                <iframe
                  srcDoc={renderedHtml}
                  title="In-modal preview"
                  className="w-full h-full border-none"
                  sandbox="allow-same-origin"
                />
              </div>
            )}
          </div>
        </form>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/40">
          <span className="text-[11px] text-slate-500">
            Dispatched via SMTP Port 587 (TLS Active)
          </span>

          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" onClick={onClose} disabled={isSending}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleSend}
              isLoading={isSending}
              leftIcon={<Send className="w-3.5 h-3.5" />}
            >
              <span>Send Test Email</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
