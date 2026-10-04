import React from 'react';
import { StockMovement } from '../../types/inventory';
import { formatCalendarDate, formatTime12H } from '../../utils/calendarHelpers';
import { History, ArrowRight, ArrowDownLeft, ArrowUpRight, CheckCircle2, User } from 'lucide-react';

export interface MovementHistoryProps {
  movements: StockMovement[];
  locale?: 'en' | 'bn';
}

export const MovementHistory: React.FC<MovementHistoryProps> = ({ movements, locale = 'en' }) => {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
      <div className="p-4 bg-slate-50 dark:bg-slate-950/60 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">
            {locale === 'bn' ? 'স্টক মুভমেন্ট ও অডিট ট্রেইল' : 'Stock Movement & Ledger Audit Trail'}
          </h3>
        </div>
        <span className="text-xs font-mono text-slate-500">
          {movements.length} {locale === 'bn' ? 'টি এন্ট্রি' : 'records logged'}
        </span>
      </div>

      <div className="divide-y divide-slate-100 dark:divide-slate-800/70 max-h-[460px] overflow-y-auto">
        {movements.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-xs font-semibold">
            {locale === 'bn' ? 'কোনো মুভমেন্ট ইতিহাস নেই' : 'No inventory movements recorded yet.'}
          </div>
        ) : (
          movements.map((m) => {
            const isOut = m.quantity < 0;

            return (
              <div
                key={m.id}
                className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 text-xs transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`p-2 rounded-xl flex items-center justify-center shrink-0 ${
                      m.type === 'usage'
                        ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-300'
                        : m.type === 'purchase'
                        ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-300'
                        : 'bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-300'
                    }`}
                  >
                    {m.type === 'usage' ? (
                      <ArrowUpRight className="w-4 h-4" />
                    ) : m.type === 'purchase' ? (
                      <ArrowDownLeft className="w-4 h-4" />
                    ) : (
                      <ArrowRight className="w-4 h-4" />
                    )}
                  </span>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-slate-900 dark:text-white">
                        {m.partSku}
                      </span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {locale === 'bn' && m.partNameBangla ? m.partNameBangla : m.partName}
                      </span>
                      <span className="text-[10px] font-bold uppercase px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                        {m.type}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {m.notes || 'Routine stock ledger update'}
                    </p>

                    <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono mt-1">
                      <span>{formatCalendarDate(m.timestamp, locale)}</span>
                      <span>•</span>
                      <span>{formatTime12H(m.timestamp, locale)}</span>
                      <span>•</span>
                      <span className="flex items-center gap-0.5 text-slate-600 dark:text-slate-300">
                        <User className="w-3 h-3 text-indigo-500" />
                        {m.performedByName}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-right font-mono self-end sm:self-center">
                  <div
                    className={`text-sm font-extrabold ${
                      isOut ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'
                    }`}
                  >
                    {m.quantity > 0 ? `+${m.quantity}` : m.quantity} units
                  </div>
                  {m.referenceId && (
                    <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400">
                      Ref: {m.referenceId}
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
