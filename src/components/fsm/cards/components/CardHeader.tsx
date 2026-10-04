import React from 'react';
import { GripVertical } from 'lucide-react';
import { WorkOrderPriority } from '../../../../types/fsm';
import { SLAProgressRing } from './SLAProgressRing';
import { CardActions } from './CardActions';
import { PriorityBadge } from '../../../ui/Badge';
import { Language } from '../../../../lib/i18n';

interface CardHeaderProps {
  workOrderId: string;
  priority: WorkOrderPriority;
  remainingMinutes: number;
  progressPercent: number;
  isBreached: boolean;
  lang: Language;
  onOpenActionsMenu?: () => void;
  onSelectAction?: (actionKey: string) => void;
  status?: string;
}

export const CardHeader: React.FC<CardHeaderProps> = ({
  workOrderId,
  priority,
  remainingMinutes,
  progressPercent,
  isBreached,
  lang,
  onSelectAction,
}) => {
  return (
    <div className="p-3.5 pb-2 flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80">
      {/* Left: Drag Handle, Work Order ID & Priority Badge */}
      <div className="flex items-center space-x-2 min-w-0">
        <GripVertical
          className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600 group-hover:text-slate-500 transition shrink-0"
          aria-hidden="true"
        />
        <span className="font-mono text-xs font-extrabold text-slate-700 dark:text-slate-300 tracking-tight truncate">
          {workOrderId}
        </span>
        <PriorityBadge priority={priority} lang={lang} />
      </div>

      {/* Right: SLA Progress Ring & Quick Actions Menu */}
      <div className="flex items-center space-x-2 shrink-0">
        <SLAProgressRing
          remainingMinutes={remainingMinutes}
          progressPercent={progressPercent}
          isBreached={isBreached}
          size={32}
        />

        <CardActions onSelectAction={onSelectAction} />
      </div>
    </div>
  );
};
