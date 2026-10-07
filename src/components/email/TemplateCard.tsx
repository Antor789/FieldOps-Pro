import React from 'react';
import { EmailTemplate } from '../../types/email';
import {
  Mail,
  Eye,
  Edit3,
  Send,
  Clock,
  Shield,
  CheckCircle2,
  AlertTriangle,
  Globe,
  Tag,
} from 'lucide-react';

export interface TemplateCardProps {
  template: EmailTemplate;
  onPreview: (template: EmailTemplate) => void;
  onEdit: (template: EmailTemplate) => void;
  onSendTest: (template: EmailTemplate) => void;
  onToggle: (template: EmailTemplate) => void;
}

export const TemplateCard: React.FC<TemplateCardProps> = ({
  template,
  onPreview,
  onEdit,
  onSendTest,
  onToggle,
}) => {
  const getCategoryBadge = () => {
    switch (template.category) {
      case 'operations':
        return 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800';
      case 'finance':
        return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
      case 'customer':
        return 'bg-pink-50 text-pink-700 dark:bg-pink-950/60 dark:text-pink-300 border-pink-200 dark:border-pink-800';
      case 'system':
      default:
        return 'bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border-purple-200 dark:border-purple-800';
    }
  };

  const formattedDate = new Date(template.lastModified).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div
      className={`group relative flex flex-col justify-between p-5 rounded-2xl border transition-all duration-200 ${
        template.isEnabled
          ? 'bg-white dark:bg-slate-900 border-slate-200/90 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-indigo-300 dark:hover:border-indigo-700'
          : 'bg-slate-50/70 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800/60 opacity-75'
      }`}
    >
      <div>
        {/* Top Badges & Toggle */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center space-x-1.5 flex-wrap gap-y-1">
            <span
              className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${getCategoryBadge()}`}
            >
              {template.category}
            </span>
            <span className="flex items-center space-x-1 text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded-md font-semibold">
              <Globe className="w-2.5 h-2.5" />
              <span>EN / বাংলা</span>
            </span>
          </div>

          {/* Toggle Switch */}
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={template.isEnabled}
              onChange={() => onToggle(template)}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-slate-200 dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
          </label>
        </div>

        {/* Title and Description */}
        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-1">
          {template.name}
        </h3>
        <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium mt-0.5">
          {template.nameBangla}
        </p>

        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-2 leading-relaxed">
          {template.description}
        </p>

        {/* Subject Preview */}
        <div className="mt-3 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-xs">
          <div className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Subject Line:</div>
          <div className="font-mono text-slate-800 dark:text-slate-200 font-medium truncate mt-0.5">
            {template.subject}
          </div>
        </div>

        {/* Trigger tag & Last modified */}
        <div className="flex items-center justify-between text-[11px] text-slate-400 mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          <span className="flex items-center gap-1 font-mono text-[10px] bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
            <Tag className="w-2.5 h-2.5 text-indigo-500" />
            {template.triggerEvent}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {formattedDate}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-3 gap-1.5 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
        <button
          onClick={() => onPreview(template)}
          className="flex items-center justify-center space-x-1 py-1.5 px-2 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs transition cursor-pointer border border-slate-200 dark:border-slate-700"
        >
          <Eye className="w-3.5 h-3.5 text-slate-500" />
          <span>Preview</span>
        </button>

        <button
          onClick={() => onEdit(template)}
          className="flex items-center justify-center space-x-1 py-1.5 px-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 font-semibold text-xs transition cursor-pointer border border-indigo-200 dark:border-indigo-800"
        >
          <Edit3 className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
          <span>Edit</span>
        </button>

        <button
          onClick={() => onSendTest(template)}
          className="flex items-center justify-center space-x-1 py-1.5 px-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 font-semibold text-xs transition cursor-pointer border border-emerald-200 dark:border-emerald-800"
        >
          <Send className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>Test</span>
        </button>
      </div>
    </div>
  );
};
