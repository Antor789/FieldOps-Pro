import React from 'react';
import { Building, Phone } from 'lucide-react';

interface CardCustomerProps {
  customerName: string;
  phone?: string;
  isVIP?: boolean;
}

export const CardCustomer: React.FC<CardCustomerProps> = ({ customerName, phone, isVIP }) => {
  return (
    <div className="flex items-center justify-between text-xs text-slate-700 dark:text-slate-300 font-semibold truncate">
      <div className="flex items-center space-x-1.5 truncate">
        <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" aria-hidden="true" />
        <span className="truncate">{customerName}</span>
      </div>

      {isVIP && (
        <span className="text-[9px] bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 px-1.5 py-0.2 rounded font-bold font-mono">
          VIP
        </span>
      )}
    </div>
  );
};
