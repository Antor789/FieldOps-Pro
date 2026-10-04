import React, { useState, useRef, useEffect } from 'react';
import {
  MoreVertical,
  Banknote,
  Cpu,
  UserPlus,
  CheckCircle2,
  Phone,
  MessageSquare,
  MapPin,
  ExternalLink,
  Trash2,
  Edit,
} from 'lucide-react';

interface CardActionsProps {
  onSelectAction?: (actionKey: string) => void;
}

export const CardActions: React.FC<CardActionsProps> = ({ onSelectAction }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleActionClick = (actionKey: string) => {
    setIsOpen(false);
    onSelectAction?.(actionKey);
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen((prev) => !prev);
        }}
        aria-label="Work order options menu"
        className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
      >
        <MoreVertical className="w-4 h-4" />
      </button>

      {isOpen && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl z-50 p-1.5 text-xs animate-scale-in space-y-1"
        >
          <div className="px-2.5 py-1 text-[10px] font-bold uppercase text-slate-400 border-b border-slate-100 dark:border-slate-800">
            Quick Actions
          </div>

          <button
            onClick={() => handleActionClick('payment')}
            className="w-full text-left px-2.5 py-1.5 rounded-xl flex items-center space-x-2 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 transition cursor-pointer font-semibold"
          >
            <Banknote className="w-3.5 h-3.5 text-emerald-600" />
            <span>Collect Payment (৳)</span>
          </button>

          <button
            onClick={() => handleActionClick('ai-dispatch')}
            className="w-full text-left px-2.5 py-1.5 rounded-xl flex items-center space-x-2 text-indigo-700 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 transition cursor-pointer font-semibold"
          >
            <Cpu className="w-3.5 h-3.5 text-indigo-600" />
            <span>AI Auto-Dispatch</span>
          </button>

          <button
            onClick={() => handleActionClick('assign')}
            className="w-full text-left px-2.5 py-1.5 rounded-xl flex items-center space-x-2 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition cursor-pointer font-medium"
          >
            <UserPlus className="w-3.5 h-3.5 text-slate-400" />
            <span>Assign Technician</span>
          </button>

          <button
            onClick={() => handleActionClick('details')}
            className="w-full text-left px-2.5 py-1.5 rounded-xl flex items-center space-x-2 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition cursor-pointer font-medium"
          >
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            <span>Full Details Modal</span>
          </button>

          <button
            onClick={() => handleActionClick('complete')}
            className="w-full text-left px-2.5 py-1.5 rounded-xl flex items-center space-x-2 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 transition cursor-pointer font-medium"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Mark as Completed</span>
          </button>
        </div>
      )}
    </div>
  );
};
