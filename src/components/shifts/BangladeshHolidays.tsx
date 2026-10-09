import React from 'react';
import { BANGLADESH_HOLIDAYS_2025 } from '../../data/mockShiftData';
import { Calendar, ShieldAlert, CheckCircle2, Sparkles, Moon, Flag } from 'lucide-react';
import { Button } from '../ui/Button';

interface BangladeshHolidaysProps {
  onAutoMarkHolidaysOff?: () => void;
}

export const BangladeshHolidays: React.FC<BangladeshHolidaysProps> = ({
  onAutoMarkHolidaysOff,
}) => {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-5 shadow-xs">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-50 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 flex items-center justify-center border border-amber-200 dark:border-amber-800">
            <Flag className="w-5 h-5 text-red-500" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-slate-100">
              Bangladesh Public & Religious Holidays (2025)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Official off-days & Ramadan shift guidelines mandated by NBR and BD Ministry of Labor
            </p>
          </div>
        </div>

        {onAutoMarkHolidaysOff && (
          <Button
            size="xs"
            variant="primary"
            onClick={onAutoMarkHolidaysOff}
            className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold"
          >
            <Sparkles className="w-3.5 h-3.5 mr-1" /> Auto-Mark Holidays as Off
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {BANGLADESH_HOLIDAYS_2025.map((hol) => (
          <div
            key={hol.id}
            className={`p-3.5 rounded-2xl border transition space-y-1.5 ${
              hol.type === 'religious'
                ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/60'
                : hol.type === 'national'
                ? 'bg-red-50/40 dark:bg-red-950/20 border-red-200 dark:border-red-800/60'
                : 'bg-amber-50/40 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800/60'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-slate-900 dark:text-slate-100">
                {hol.name}
              </span>
              {hol.type === 'religious' ? (
                <Moon className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              ) : (
                <Flag className="w-3.5 h-3.5 text-red-500 shrink-0" />
              )}
            </div>

            <div className="text-xs font-semibold text-slate-600 dark:text-slate-300">
              {hol.nameBn}
            </div>

            <div className="flex items-center justify-between text-[10px] font-mono pt-1 text-slate-500 dark:text-slate-400">
              <span>{hol.date} ({hol.dayName})</span>
              <span className="bg-white dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700 font-bold text-slate-700 dark:text-slate-300 uppercase">
                {hol.type}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
