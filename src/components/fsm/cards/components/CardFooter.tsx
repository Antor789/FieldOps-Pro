import React from 'react';
import { Clock } from 'lucide-react';
import { Language, formatBDT, formatDhakaTime } from '../../../../lib/i18n';

interface CardFooterProps {
  amountBDT: number;
  createdAt: Date | string;
  lang: Language;
}

export const CardFooter: React.FC<CardFooterProps> = ({ amountBDT, createdAt, lang }) => {
  return (
    <div className="px-3.5 py-2 bg-slate-50/70 dark:bg-slate-950/40 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] font-mono select-none">
      <div className="flex items-center space-x-1 text-emerald-700 dark:text-emerald-400 font-extrabold">
        <span>💰</span>
        <span>{formatBDT(amountBDT || 5000, lang)}</span>
      </div>

      <div className="flex items-center space-x-1 text-slate-400 dark:text-slate-500 text-[10px]">
        <Clock className="w-3 h-3" />
        <span>{formatDhakaTime(createdAt, lang)}</span>
      </div>
    </div>
  );
};
