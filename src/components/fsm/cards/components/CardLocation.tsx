import React from 'react';
import { MapPin } from 'lucide-react';

interface CardLocationProps {
  landmark?: string;
  address?: string;
}

export const CardLocation: React.FC<CardLocationProps> = ({ landmark, address }) => {
  const displayLocation = landmark || address || 'Dhaka, Bangladesh';

  return (
    <div className="flex items-center space-x-1.5 text-[11px] text-slate-500 dark:text-slate-400 truncate">
      <MapPin className="w-3.5 h-3.5 text-indigo-500 shrink-0" aria-hidden="true" />
      <span className="truncate">{displayLocation}</span>
    </div>
  );
};
