import React from 'react';
import { Wrench } from 'lucide-react';

interface CardJobDetailsProps {
  title: string;
  siteName?: string;
  description?: string;
}

export const CardJobDetails: React.FC<CardJobDetailsProps> = ({ title, siteName }) => {
  return (
    <div className="space-y-0.5">
      <h4 className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition leading-snug line-clamp-2">
        {title}
      </h4>
      {siteName && (
        <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono truncate">
          {siteName}
        </div>
      )}
    </div>
  );
};
