import React, { useState, useRef, useEffect } from 'react';
import { EmailTemplate, EmailTemplateType } from '../../types/email';
import { useEmailTemplates } from '../../hooks/useEmailTemplates';
import { useEmailNotifications } from '../../hooks/useEmailNotifications';
import { EmailPreview } from '../../components/email/EmailPreview';
import { VariablesList } from '../../components/email/VariablesList';
import { TestEmailModal } from '../../components/email/TestEmailModal';
import { renderTemplate } from '../../utils/emailRenderer';
import { Button } from '../../components/ui/Button';
import {
  Save,
  RotateCcw,
  Send,
  Eye,
  Code,
  FileText,
  Sparkles,
  Smartphone,
  Monitor,
  Check,
  Globe,
  Tag,
  ArrowLeft,
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export interface EmailTemplateEditorProps {
  initialTemplateId?: EmailTemplateType;
  onBack?: () => void;
  locale?: 'en' | 'bn';
}

export const EmailTemplateEditorPage: React.FC<EmailTemplateEditorProps> = ({
  initialTemplateId = 'wo_assigned',
  onBack,
  locale = 'en',
}) => {
  const { templates, getTemplate, updateTemplate, resetToDefault } = useEmailTemplates();
  const { sendEmail } = useEmailNotifications();
  const { addToast } = useToast();

  const [activeTemplateId, setActiveTemplateId] = useState<EmailTemplateType>(initialTemplateId);
  const currentTemplate = getTemplate(activeTemplateId) || templates[0];

  // Editable fields
  const [subject, setSubject] = useState(currentTemplate?.subject || '');
  const [subjectBangla, setSubjectBangla] = useState(currentTemplate?.subjectBangla || '');
  const [htmlContent, setHtmlContent] = useState(currentTemplate?.bodyHtml || '');
  const [textContent, setTextContent] = useState(currentTemplate?.bodyText || '');
  const [activeTab, setActiveTab] = useState<'html' | 'text' | 'split'>('split');
  const [isTestModalOpen, setIsTestModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Sync state when template changes
  useEffect(() => {
    if (currentTemplate) {
      setSubject(currentTemplate.subject);
      setSubjectBangla(currentTemplate.subjectBangla || '');
      setHtmlContent(currentTemplate.bodyHtml);
      setTextContent(currentTemplate.bodyText);
    }
  }, [activeTemplateId]);

  const handleInsertVariable = (token: string) => {
    if (textareaRef.current) {
      const textarea = textareaRef.current;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const current = textarea.value;

      const updated = current.substring(0, start) + token + current.substring(end);
      if (activeTab === 'text') {
        setTextContent(updated);
      } else {
        setHtmlContent(updated);
      }

      // Reset cursor position after inserted token
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + token.length, start + token.length);
      }, 50);

      addToast({
        title: 'Variable Inserted',
        description: `Inserted ${token} into editor`,
        type: 'info',
      });
    } else {
      // Fallback: append
      if (activeTab === 'text') {
        setTextContent((prev) => prev + ' ' + token);
      } else {
        setHtmlContent((prev) => prev + ' ' + token);
      }
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    await updateTemplate(activeTemplateId, {
      subject,
      subjectBangla,
      bodyHtml: htmlContent,
      bodyText: textContent,
    });
    setIsSaving(false);
    addToast({
      title: 'Template Saved',
      description: `Changes to "${currentTemplate.name}" have been saved.`,
      type: 'success',
    });
  };

  const handleReset = () => {
    if (window.confirm('Reset this template back to factory defaults? Any custom HTML will be restored.')) {
      resetToDefault(activeTemplateId);
      const original = templates.find((t) => t.id === activeTemplateId);
      if (original) {
        setSubject(original.subject);
        setSubjectBangla(original.subjectBangla || '');
        setHtmlContent(original.bodyHtml);
        setTextContent(original.bodyText);
      }
      addToast({
        title: 'Reset to Factory Defaults',
        description: 'Template reverted to original FieldOps Pro layout.',
        type: 'warning',
      });
    }
  };

  return (
    <div className="space-y-5 max-w-7xl mx-auto font-sans">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-sm">
        <div className="flex items-center space-x-3">
          {onBack && (
            <button
              onClick={onBack}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition cursor-pointer"
              title="Return to Templates List"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}

          <div>
            <div className="flex items-center space-x-2">
              <select
                value={activeTemplateId}
                onChange={(e) => setActiveTemplateId(e.target.value as EmailTemplateType)}
                className="bg-transparent font-extrabold text-base sm:text-lg text-slate-900 dark:text-slate-100 border-none focus:outline-none cursor-pointer pr-4"
              >
                {templates.map((tpl) => (
                  <option key={tpl.id} value={tpl.id}>
                    {tpl.name} ({tpl.nameBangla})
                  </option>
                ))}
              </select>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Live variable injection, Bangladesh bilingual copy, and multi-client rendering
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            leftIcon={<RotateCcw className="w-3.5 h-3.5 text-slate-500" />}
          >
            Reset Default
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsTestModalOpen(true)}
            leftIcon={<Send className="w-3.5 h-3.5 text-indigo-500" />}
          >
            Send Test
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={handleSave}
            isLoading={isSaving}
            leftIcon={<Save className="w-3.5 h-3.5" />}
          >
            Save Template
          </Button>
        </div>
      </div>

      {/* Subject Line Editors */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Subject Line (English) *
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. New Job Assigned: #{{work_order_id}}"
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-slate-200 font-mono focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center justify-between">
              <span>Subject Line (বাংলা / Bengali)</span>
              <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-normal">Optional localized</span>
            </label>
            <input
              type="text"
              value={subjectBangla}
              onChange={(e) => setSubjectBangla(e.target.value)}
              placeholder="e.g. নতুন কাজের দায়িত্ব: #{{work_order_id}}"
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>
      </div>

      {/* Editor & Preview Split Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Side: Code / Text Editor (7 cols) */}
        <div className="lg:col-span-7 space-y-3">
          {/* Mode Switcher */}
          <div className="flex items-center justify-between bg-white dark:bg-slate-900 p-2 rounded-2xl border border-slate-200/90 dark:border-slate-800">
            <div className="flex items-center space-x-1">
              <button
                onClick={() => setActiveTab('split')}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition cursor-pointer ${
                  activeTab === 'split'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                HTML Editor
              </button>
              <button
                onClick={() => setActiveTab('text')}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition cursor-pointer ${
                  activeTab === 'text'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                Plain Text Version
              </button>
            </div>

            <span className="text-[11px] text-slate-400 font-mono hidden sm:inline">
              {activeTab === 'text' ? 'text/plain format' : 'HTML5 email markup'}
            </span>
          </div>

          {/* Textarea code container */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-3 shadow-sm">
            {activeTab === 'text' ? (
              <textarea
                ref={textareaRef}
                value={textContent}
                onChange={(e) => setTextContent(e.target.value)}
                rows={22}
                placeholder="Plain text fallback version of the email..."
                className="w-full bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800 font-mono text-xs text-slate-800 dark:text-slate-200 leading-relaxed focus:outline-none focus:border-indigo-500 resize-y"
              />
            ) : (
              <textarea
                ref={textareaRef}
                value={htmlContent}
                onChange={(e) => setHtmlContent(e.target.value)}
                rows={22}
                placeholder="HTML email template markup..."
                className="w-full bg-slate-950 text-indigo-200 p-4 rounded-xl border border-slate-800 font-mono text-xs leading-relaxed focus:outline-none focus:border-indigo-500 resize-y selection:bg-indigo-700 selection:text-white"
              />
            )}

            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 px-1">
              <span>Type or click variables from the panel to insert tokens</span>
              <span className="font-mono">
                {activeTab === 'text' ? `${textContent.length} chars` : `${htmlContent.length} chars`}
              </span>
            </div>
          </div>
        </div>

        {/* Right Side: Variable Picker & Live Preview (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Quick Variable Picker */}
          <VariablesList
            onInsertVariable={handleInsertVariable}
            allowedVariables={currentTemplate?.variables}
          />

          {/* Live Preview */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200 px-1">
              <span>Real-Time Injected Preview</span>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400">
                ● Live synchronized
              </span>
            </div>
            <EmailPreview
              htmlContent={renderTemplate(htmlContent, {}, subject)}
              subject={subject}
            />
          </div>
        </div>
      </div>

      {/* Test Email Modal */}
      <TestEmailModal
        isOpen={isTestModalOpen}
        onClose={() => setIsTestModalOpen(false)}
        templates={templates}
        initialTemplate={currentTemplate}
        onSend={sendEmail}
      />
    </div>
  );
};
