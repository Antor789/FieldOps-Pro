import React, { useState } from 'react';
import { useEmailTemplates } from '../../hooks/useEmailTemplates';
import { useEmailNotifications } from '../../hooks/useEmailNotifications';
import { EmailTemplate, EmailTemplateType } from '../../types/email';
import { TemplateCard } from '../../components/email/TemplateCard';
import { EmailPreview } from '../../components/email/EmailPreview';
import { TestEmailModal } from '../../components/email/TestEmailModal';
import {
  Mail,
  Search,
  Plus,
  Eye,
  Send,
  Globe,
  Filter,
  CheckCircle2,
  Sparkles,
  X,
  FileCode,
} from 'lucide-react';
import { Button } from '../../components/ui/Button';

export interface EmailTemplatesProps {
  onSelectEditTemplate?: (template: EmailTemplate) => void;
  locale?: 'en' | 'bn';
}

export const EmailTemplatesPage: React.FC<EmailTemplatesProps> = ({
  onSelectEditTemplate,
  locale = 'en',
}) => {
  const { templates, toggleTemplate, previewTemplate } = useEmailTemplates();
  const { sendEmail } = useEmailNotifications();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedLanguage, setSelectedLanguage] = useState<'all' | 'en' | 'bn'>('all');
  const [previewingTemplate, setPreviewingTemplate] = useState<EmailTemplate | null>(null);
  const [testModalTemplate, setTestModalTemplate] = useState<EmailTemplate | null>(null);

  const categories = [
    { id: 'all', label: 'All Templates' },
    { id: 'operations', label: 'Operations & Dispatch' },
    { id: 'finance', label: 'Finance & Invoices' },
    { id: 'customer', label: 'Customer Portal' },
    { id: 'system', label: 'System & Security' },
  ];

  const filteredTemplates = templates.filter((tpl) => {
    if (selectedCategory !== 'all' && tpl.category !== selectedCategory) {
      return false;
    }
    if (selectedLanguage !== 'all' && tpl.language !== selectedLanguage && tpl.language !== 'both') {
      return false;
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        tpl.name.toLowerCase().includes(q) ||
        tpl.nameBangla.toLowerCase().includes(q) ||
        tpl.subject.toLowerCase().includes(q) ||
        tpl.description.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold shadow-xs">
            <Mail className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <span>Email Templates Library</span>
              <span className="text-[10px] bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 font-bold px-2 py-0.5 rounded-full">
                {templates.length} Templates
              </span>
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Professional responsive HTML & plain-text email templates with Bangladesh English & Bengali copy
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* Language filter badge */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
            <button
              onClick={() => setSelectedLanguage('all')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition cursor-pointer ${
                selectedLanguage === 'all'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              All Langs
            </button>
            <button
              onClick={() => setSelectedLanguage('en')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition cursor-pointer ${
                selectedLanguage === 'en'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              English
            </button>
            <button
              onClick={() => setSelectedLanguage('bn')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition cursor-pointer ${
                selectedLanguage === 'bn'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              বাংলা
            </button>
          </div>
        </div>
      </div>

      {/* Filters & Search Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Category Pills */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 text-xs scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl font-bold transition whitespace-nowrap cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-50'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search templates, variables..."
            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Template Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredTemplates.map((template) => (
          <TemplateCard
            key={template.id}
            template={template}
            onPreview={(t) => setPreviewingTemplate(t)}
            onEdit={(t) => {
              if (onSelectEditTemplate) {
                onSelectEditTemplate(t);
              } else {
                setPreviewingTemplate(t);
              }
            }}
            onSendTest={(t) => setTestModalTemplate(t)}
            onToggle={(t) => toggleTemplate(t.id)}
          />
        ))}
      </div>

      {/* Full Preview Modal */}
      {previewingTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs font-sans">
          <div className="relative w-full max-w-4xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/60">
              <div className="flex items-center space-x-2">
                <FileCode className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    {previewingTemplate.name}
                  </h3>
                  <p className="text-xs text-indigo-600 dark:text-indigo-400">
                    {previewingTemplate.nameBangla}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    const target = previewingTemplate;
                    setPreviewingTemplate(null);
                    setTestModalTemplate(target);
                  }}
                  leftIcon={<Send className="w-3.5 h-3.5" />}
                >
                  Send Test
                </Button>
                {onSelectEditTemplate && (
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={() => {
                      const target = previewingTemplate;
                      setPreviewingTemplate(null);
                      onSelectEditTemplate(target);
                    }}
                  >
                    Open Editor
                  </Button>
                )}
                <button
                  onClick={() => setPreviewingTemplate(null)}
                  className="p-1 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-auto p-4">
              <EmailPreview
                htmlContent={previewTemplate(previewingTemplate.id)}
                subject={previewingTemplate.subject}
              />
            </div>
          </div>
        </div>
      )}

      {/* Test Email Modal */}
      {testModalTemplate && (
        <TestEmailModal
          isOpen={!!testModalTemplate}
          onClose={() => setTestModalTemplate(null)}
          templates={templates}
          initialTemplate={testModalTemplate}
          onSend={sendEmail}
        />
      )}
    </div>
  );
};
