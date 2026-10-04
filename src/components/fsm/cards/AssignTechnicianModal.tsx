import React from 'react';
import { Technician } from '../../../types/fsm';
import { Modal } from '../../ui/Modal';
import { Button } from '../../ui/Button';
import { TechnicianAvatar } from './components/TechnicianAvatar';
import { Badge } from '../../ui/Badge';
import { Zap, Radio } from 'lucide-react';

interface AssignTechnicianModalProps {
  isOpen: boolean;
  onClose: () => void;
  technicians: Technician[];
  onAssign: (techId: string, techName: string) => void;
  workOrderTitle?: string;
}

export const AssignTechnicianModal: React.FC<AssignTechnicianModalProps> = ({
  isOpen,
  onClose,
  technicians,
  onAssign,
  workOrderTitle,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="md"
      title={
        <div>
          <h3 className="text-sm font-extrabold text-slate-900 dark:text-slate-100">
            Dispatch Field Technician
          </h3>
          {workOrderTitle && (
            <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
              Target: {workOrderTitle}
            </p>
          )}
        </div>
      }
      footer={
        <Button variant="ghost" size="sm" onClick={onClose}>
          Cancel
        </Button>
      }
    >
      <div className="space-y-2 font-sans text-xs">
        <div className="text-[10px] font-bold uppercase text-slate-400 dark:text-slate-500 font-mono">
          Available Field Specialists (Dhaka Fleet)
        </div>

        <div className="space-y-1.5 max-h-80 overflow-y-auto">
          {technicians.map((tech) => {
            const isOnline = tech.dutyStatus === 'ONLINE';

            return (
              <button
                key={tech.id}
                onClick={() => {
                  onAssign(tech.id, `${tech.firstName} ${tech.lastName}`);
                  onClose();
                }}
                className="w-full text-left p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/70 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 border border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-700 flex items-center justify-between transition cursor-pointer group"
              >
                <div className="flex items-center space-x-3">
                  <TechnicianAvatar technician={tech} size="md" />
                  <div>
                    <div className="font-bold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">
                      {tech.firstName} {tech.lastName}
                    </div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                      {tech.vehicleType} • Active Jobs: {tech.activeWorkOrderCount}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end space-y-1">
                  <Badge variant={isOnline ? 'success' : 'secondary'} size="xs" dot={true}>
                    {tech.dutyStatus}
                  </Badge>
                  <span className="text-[10px] font-mono text-indigo-600 dark:text-indigo-400 font-bold group-hover:underline">
                    Assign Unit →
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </Modal>
  );
};
