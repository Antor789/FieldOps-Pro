import React from 'react';
import { Technician } from '../../../../types/fsm';
import { TechnicianAvatar } from './TechnicianAvatar';
import { Button } from '../../../ui/Button';
import { Cpu, UserPlus } from 'lucide-react';

interface CardTechnicianProps {
  assignedTechnician?: Technician | { id?: string; name?: string; firstName?: string; lastName?: string; dutyStatus?: string };
  distance?: string;
  onOpenAssignModal?: () => void;
  onAutoDispatch?: () => void;
  isDispatching?: boolean;
}

export const CardTechnician: React.FC<CardTechnicianProps> = ({
  assignedTechnician,
  distance = '2.3 km',
  onOpenAssignModal,
  onAutoDispatch,
  isDispatching = false,
}) => {
  const techName =
    assignedTechnician && 'firstName' in assignedTechnician && assignedTechnician.firstName
      ? `${assignedTechnician.firstName} ${assignedTechnician.lastName || ''}`
      : assignedTechnician && 'name' in assignedTechnician
      ? assignedTechnician.name
      : null;

  return (
    <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
      {techName ? (
        <div className="flex items-center space-x-2 min-w-0">
          <TechnicianAvatar technician={assignedTechnician} size="sm" />
          <div className="truncate">
            <div className="font-bold text-xs text-slate-800 dark:text-slate-200 truncate max-w-[140px]">
              {techName}
            </div>
            <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono font-medium truncate">
              {distance} away • Active
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center space-x-1.5">
          <Button
            size="xs"
            variant="ai"
            isLoading={isDispatching}
            onClick={(e) => {
              e.stopPropagation();
              onAutoDispatch?.();
            }}
            leftIcon={<Cpu className="w-3 h-3" />}
          >
            AI Dispatch
          </Button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenAssignModal?.();
            }}
            className="text-[10px] font-bold text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer flex items-center gap-0.5"
          >
            <UserPlus className="w-3 h-3" />
            <span>Assign →</span>
          </button>
        </div>
      )}
    </div>
  );
};
