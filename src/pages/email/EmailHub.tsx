import React, { useState } from 'react';
import { EmailTemplatesPage } from './EmailTemplates';
import { EmailTemplateEditorPage } from './EmailTemplateEditor';
import { EmailHistoryPage } from './EmailHistory';
import { EmailSettingsPage } from './EmailSettings';
import { EmailTemplate } from '../../types/email';
import { Mail, FileCode, History, Settings, Send, Sparkles } from 'lucide-react';

export type EmailHubTab = 'templates' | 'editor' | 'history' | 'settings';

export interface EmailHubProps {
  initialTab?: EmailHubTab;
  locale?: 'en' | 'bn';
}

export const EmailHub: React.FC<EmailHubProps> = ({
  initialTab = 'templates',
  locale = 'en',
}) => {
  const [activeTab, setActiveTab] = useState<EmailHubTab>(initialTab);
  const [editingTemplate, setEditingTemplate] = useState<EmailTemplate | null>(null);

  const handleSelectEdit = (template: EmailTemplate) => {
    setEditingTemplate(template);
    setActiveTab('editor');
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Sub-Navigation Pill Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-slate-900 p-2 sm:p-2.5 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-2xs">
        <div className="flex items-center space-x-1.5 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('templates')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === 'templates'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>Templates Library</span>
          </button>

          <button
            onClick={() => setActiveTab('editor')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === 'editor'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Send className="w-3.5 h-3.5" />
            <span>
              {editingTemplate ? `Editor: ${editingTemplate.id}` : 'Template Editor'}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === 'history'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Delivery History</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === 'settings'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span>SMTP & Gateway Settings</span>
          </button>
        </div>

        <div className="hidden lg:flex items-center space-x-1.5 text-[11px] text-slate-500 font-mono pr-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Bangladesh NOC SMTP Active</span>
        </div>
      </div>

      {/* Tab Panels */}
      {activeTab === 'templates' && (
        <EmailTemplatesPage
          onSelectEditTemplate={handleSelectEdit}
          locale={locale}
        />
      )}

      {activeTab === 'editor' && (
        <EmailTemplateEditorPage
          initialTemplateId={editingTemplate?.id || 'wo_assigned'}
          onBack={() => setActiveTab('templates')}
          locale={locale}
        />
      )}

      {activeTab === 'history' && <EmailHistoryPage locale={locale} />}

      {activeTab === 'settings' && <EmailSettingsPage locale={locale} />}
    </div>
  );
};
