import React from 'react';
import { Shift, ShiftType } from '../../types/shifts';
import { Sun, Sunset, Moon, Clock, XCircle, Zap, ShieldAlert } from 'lucide-react';

interface ShiftCellProps {
  shift?: Shift;
  isFriday?: boolean;
  isHoliday?: boolean;
  holidayName?: string;
  onClick: () => void;
}

export const ShiftCell: React.FC<ShiftCellProps> = ({
  shift,
  isFriday = false,
  isHoliday = false,
  holidayName,
  onClick,
}) => {
  const getShiftIcon = (type?: ShiftType) => {
    switch (type) {
      case 'morning':
        return <Sun className="w-4 h-4 text-amber-500" />;
      case 'afternoon':
        return <Sunset className="w-4 h-4 text-orange-500" />;
      case 'night':
        return <Moon className="w-4 h-4 text-indigo-400" />;
      case 'full_day':
        return <Zap className="w-4 h-4 text-yellow-500" />;
      case 'off':
        return <XCircle className="w-4 h-4 text-slate-400" />;
      default:
        return <Clock className="w-4 h-4 text-slate-400" />;
    }
  };

  const getShiftLabel = (type?: ShiftType) => {
    switch (type) {
      case 'morning':
        return 'Morning (8A-4P)';
      case 'afternoon':
        return 'Afternoon (2P-10P)';
      case 'night':
        return 'Night (10P-6A)';
      case 'full_day':
        return 'Full Day (8A-8P)';
      case 'off':
        return 'Off Day';
      default:
        return 'Unassigned';
    }
  };

  const getShiftBg = (type?: ShiftType) => {
    if (isFriday) {
      return 'bg-emerald-50/60 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/50';
    }
    if (isHoliday) {
      return 'bg-amber-50/70 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800';
    }
    switch (type) {
      case 'morning':
        return 'bg-amber-50 dark:bg-amber-950/50 border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200';
      case 'afternoon':
        return 'bg-orange-50 dark:bg-orange-950/50 border-orange-200 dark:border-orange-800 text-orange-900 dark:text-orange-200';
      case 'night':
        return 'bg-indigo-50 dark:bg-indigo-950/50 border-indigo-200 dark:border-indigo-800 text-indigo-900 dark:text-indigo-200';
      case 'full_day':
        return 'bg-yellow-50 dark:bg-yellow-950/50 border-yellow-300 dark:border-yellow-800 text-yellow-900 dark:text-yellow-200';
      case 'off':
        return 'bg-slate-100/80 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-500';
      default:
        return 'bg-slate-50/50 dark:bg-slate-900/40 border-dashed border-slate-200 dark:border-slate-800 hover:border-indigo-400 text-slate-400';
    }
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full min-h-[52px] p-2 rounded-xl border transition flex flex-col items-center justify-center text-center relative group cursor-pointer ${getShiftBg(
        shift?.shiftType
      )}`}
    >
      {shift && shift.shiftType !== 'off' ? (
        <>
          <div className="flex items-center space-x-1 font-bold text-[11px]">
            {getShiftIcon(shift.shiftType)}
            <span className="capitalize">{shift.shiftType}</span>
          </div>
          <span className="text-[10px] font-mono opacity-80 mt-0.5">
            {shift.startTime} - {shift.endTime}
          </span>
          {shift.isOvertime && (
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-yellow-500 ring-2 ring-white dark:ring-slate-900" title="Overtime Shift" />
          )}
        </>
      ) : isFriday ? (
        <div className="flex flex-col items-center space-y-0.5">
          <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 font-mono">
            BD Weekend
          </span>
          <span className="text-[9px] text-emerald-600 dark:text-emerald-500">Friday Off</span>
        </div>
      ) : isHoliday ? (
        <div className="flex flex-col items-center space-y-0.5">
          <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
          <span className="text-[9px] font-bold text-amber-800 dark:text-amber-300 truncate max-w-[80px]" title={holidayName}>
            {holidayName || 'Holiday'}
          </span>
        </div>
      ) : shift?.shiftType === 'off' ? (
        <div className="flex items-center space-x-1 text-[11px] text-slate-400 font-semibold">
          <XCircle className="w-3.5 h-3.5" />
          <span>Off Day</span>
        </div>
      ) : (
        <span className="text-[10px] text-slate-400 group-hover:text-indigo-600 font-bold">
          + Assign
        </span>
      )}

      {/* Hover Tooltip */}
      {shift && (
        <div className="absolute z-20 bottom-full mb-1 hidden group-hover:block w-48 p-2.5 bg-slate-900 text-white text-[11px] rounded-xl shadow-xl border border-slate-800 pointer-events-none text-left font-sans">
          <div className="font-bold border-b border-slate-800 pb-1 mb-1 text-amber-400 flex items-center justify-between">
            <span>{shift.technicianName}</span>
            <span className="uppercase text-[9px]">{shift.shiftType}</span>
          </div>
          <div className="space-y-0.5 text-slate-300">
            <p>⏰ Hours: {shift.startTime} - {shift.endTime}</p>
            <p>📍 Zone: {shift.zone || 'Dhaka Metro'}</p>
            {shift.isOvertime && <p className="text-yellow-400 font-bold">⚡ Overtime Approved</p>}
            {shift.notes && <p className="text-slate-400 italic font-mono text-[10px]">"{shift.notes}"</p>}
          </div>
        </div>
      )}
    </button>
  );
};
