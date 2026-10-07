import React, { useState } from 'react';
import { TEMPLATE_VARIABLES } from '../../utils/emailRenderer';
import { TemplateVariableDefinition } from '../../types/email';
import { Search, Copy, Check, Plus, Tag, HelpCircle } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export interface VariablesListProps {
  onInsertVariable?: (variableKey: string) => void;
  className?: string;
  allowedVariables?: string[];
}

export const VariablesList: React.FC<VariablesListProps> = ({
  onInsertVariable,
  className = '',
  allowedVariables,
}) => {
  const { addToast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const categories = [
    { id: 'all', label: 'All' },
    { id: 'order', label: 'Order' },
    { id: 'customer', label: 'Customer' },
    { id: 'technician', label: 'Tech' },
    { id: 'financial', label: 'Finance' },
    { id: 'company', label: 'Company' },
    { id: 'system', label: 'System' },
  ];

  const filteredVariables = TEMPLATE_VARIABLES.filter((item) => {
    if (allowedVariables && !allowedVariables.includes(item.key)) {
      return false;
    }
    if (selectedCategory !== 'all' && item.category !== selectedCategory) {
      return false;
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        item.key.toLowerCase().includes(q) ||
        item.name.toLowerCase().includes(q) ||
        item.nameBangla.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleSelect = (key: string) => {
    const token = `{{${key}}}`;
    if (onInsertVariable) {
      onInsertVariable(token);
    } else {
      navigator.clipboard.writeText(token);
      setCopiedKey(key);
      addToast({
        title: 'Variable Copied',
        description: `Copied ${token} to clipboard`,
        type: 'info',
      });
      setTimeout(() => setCopiedKey(null), 2000);
    }
  };

  return (
    <div className={`flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm ${className}`}>
      {/* Header */}
      <div className="p-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
            <Tag className="w-3.5 h-3.5 text-indigo-500" />
            Template Variables
          </span>
          <span className="text-[10px] text-slate-500 font-mono">
            {filteredVariables.length} available
          </span>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search variables or fields..."
            className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        {/* Categories */}
        <div className="flex items-center space-x-1 overflow-x-auto pt-2 pb-0.5 text-[10px] scrollbar-none">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`px-2 py-0.5 rounded-full font-semibold shrink-0 transition cursor-pointer ${
                selectedCategory === c.id
                  ? 'bg-indigo-600 text-white shadow-2xs'
                  : 'bg-slate-200/60 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-300'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Variables List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1.5 max-h-96">
        {filteredVariables.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-400">
            No variables match your query.
          </div>
        ) : (
          filteredVariables.map((v) => (
            <div
              key={v.key}
              onClick={() => handleSelect(v.key)}
              className="group p-2 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 bg-slate-50/50 dark:bg-slate-900/60 hover:bg-indigo-50/40 dark:hover:bg-indigo-950/30 transition cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1.5">
                  <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400">
                    {`{{${v.key}}}`}
                  </span>
                </div>
                <div className="flex items-center space-x-1 text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                  {onInsertVariable ? (
                    <span className="flex items-center gap-0.5 text-[10px] font-semibold bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 px-1.5 py-0.5 rounded">
                      <Plus className="w-2.5 h-2.5" />
                      Insert
                    </span>
                  ) : copiedKey === v.key ? (
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                </div>
              </div>

              <div className="text-[11px] text-slate-700 dark:text-slate-300 font-medium mt-1">
                {v.name} • <span className="text-slate-500">{v.nameBangla}</span>
              </div>

              <div className="text-[10px] text-slate-400 mt-0.5 flex items-center justify-between">
                <span className="truncate max-w-[200px]">{v.description}</span>
                <span className="font-mono text-[9px] text-slate-400 shrink-0 italic">
                  e.g. {v.sampleValue}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="p-2 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-[10px] text-slate-500 text-center">
        Click any token to {onInsertVariable ? 'insert into template' : 'copy to clipboard'}
      </div>
    </div>
  );
};
