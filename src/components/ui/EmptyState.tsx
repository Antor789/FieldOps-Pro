import React from 'react';
import { Inbox, Sparkles, FolderPlus } from 'lucide-react';
import { Button } from './Button';

export interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  compact?: boolean;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon,
  actionLabel,
  onAction,
  compact = false,
}) => {
  if (compact) {
    return (
      <div className="border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl p-6 text-center text-slate-400 dark:text-slate-500 my-auto flex flex-col items-center justify-center space-y-2">
        <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800/80 flex items-center justify-center text-slate-400 dark:text-slate-500">
          {icon || <Inbox className="w-5 h-5" />}
        </div>
        <div className="text-xs font-semibold text-slate-600 dark:text-slate-400">{title}</div>
        {description && <div className="text-[11px] text-slate-400">{description}</div>}
      </div>
    );
  }

  return (
    <div className="border border-dashed border-slate-200 dark:border-slate-800 rounded-3xl p-10 text-center space-y-4 max-w-md mx-auto my-6 bg-slate-50/50 dark:bg-slate-900/30">
      <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto shadow-xs">
        {icon || <Inbox className="w-7 h-7" />}
      </div>

      <div className="space-y-1">
        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">{title}</h3>
        {description && (
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            {description}
          </p>
        )}
      </div>

      {actionLabel && onAction && (
        <Button
          size="sm"
          variant="primary"
          onClick={onAction}
          leftIcon={<FolderPlus className="w-3.5 h-3.5" />}
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
