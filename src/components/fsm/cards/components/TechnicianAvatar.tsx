import React from 'react';
import { Technician } from '../../../../types/fsm';

interface TechnicianAvatarProps {
  technician?: Technician | { name?: string; firstName?: string; lastName?: string; dutyStatus?: string };
  size?: 'sm' | 'md' | 'lg';
  showStatusDot?: boolean;
}

export const TechnicianAvatar: React.FC<TechnicianAvatarProps> = ({
  technician,
  size = 'md',
  showStatusDot = true,
}) => {
  const getInitials = () => {
    if (!technician) return '?';
    if ('firstName' in technician && technician.firstName) {
      return `${technician.firstName[0]}${technician.lastName ? technician.lastName[0] : ''}`;
    }
    if ('name' in technician && technician.name) {
      const parts = technician.name.split(' ');
      return parts.length > 1 ? `${parts[0][0]}${parts[1][0]}` : parts[0][0];
    }
    return 'T';
  };

  const sizeClasses = {
    sm: 'w-6 h-6 text-[10px]',
    md: 'w-8 h-8 text-xs',
    lg: 'w-10 h-10 text-sm',
  }[size];

  const dotSizeClasses = {
    sm: 'w-1.5 h-1.5 ring-1',
    md: 'w-2 h-2 ring-1.5',
    lg: 'w-2.5 h-2.5 ring-2',
  }[size];

  const dutyStatus = technician?.dutyStatus || 'ONLINE';
  const isOnline = dutyStatus === 'ONLINE' || dutyStatus === 'available';

  return (
    <div className="relative inline-flex shrink-0">
      <div
        className={`${sizeClasses} rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-700 text-white font-extrabold flex items-center justify-center shadow-2xs select-none`}
      >
        {getInitials()}
      </div>

      {showStatusDot && (
        <span
          className={`absolute -bottom-0.5 -right-0.5 ${dotSizeClasses} rounded-full ring-white dark:ring-slate-900 ${
            isOnline ? 'bg-emerald-500' : 'bg-slate-400'
          }`}
        />
      )}
    </div>
  );
};
