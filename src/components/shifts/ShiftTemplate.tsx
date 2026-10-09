import React, { useState } from 'react';
import { PREDEFINED_TEMPLATES } from '../../data/mockShiftData';
import { Copy, Sparkles, CheckCircle2, Clock, Calendar } from 'lucide-react';
import { Button } from '../ui/Button';

interface ShiftTemplateProps {
  onApplyTemplate: (templateId: string) => void;
  onCopyPreviousWeek: () => void;
}

export const ShiftTemplate: React.FC<ShiftTemplateProps> = ({
  onApplyTemplate,
  onCopyPreviousWeek,
}) => {
  const [selectedTemplateId, setSelectedTemplateId] = useState(PREDEFINED_TEMPLATES[0].id);

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-5 shadow-xs">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <h3 className="font-extrabold text-sm text-slate-900 dark:text-slate-100">
            Shift Template & Roster Automation
          </h3>
        </div>

        <Button
          size="xs"
          variant="outline"
          onClick={onCopyPreviousWeek}
          className="text-xs font-bold border-indigo-200 text-indigo-700 dark:text-indigo-300 dark:border-indigo-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/50"
        >
          <Copy className="w-3.5 h-3.5 mr-1" /> Copy Previous Week Schedule
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {PREDEFINED_TEMPLATES.map((tpl) => (
          <div
            key={tpl.id}
            onClick={() => setSelectedTemplateId(tpl.id)}
            className={`p-4 rounded-2xl border cursor-pointer transition space-y-2 flex flex-col justify-between ${
              selectedTemplateId === tpl.id
                ? 'bg-amber-50/60 dark:bg-amber-950/30 border-amber-500 ring-2 ring-amber-500/20'
                : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 hover:border-amber-300'
            }`}
          >
            <div>
              <div className="font-bold text-xs text-slate-900 dark:text-slate-100 flex items-center justify-between">
                <span>{tpl.name}</span>
                {selectedTemplateId === tpl.id && (
                  <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
                )}
              </div>
              {tpl.nameBn && (
                <div className="text-[10px] text-amber-800 dark:text-amber-300 font-semibold mt-0.5">
                  {tpl.nameBn}
                </div>
              )}
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                {tpl.description}
              </p>
            </div>

            <Button
              size="xs"
              variant={selectedTemplateId === tpl.id ? 'primary' : 'outline'}
              onClick={(e) => {
                e.stopPropagation();
                onApplyTemplate(tpl.id);
              }}
              className="w-full mt-2 font-bold"
            >
              Apply Template to Week
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};
