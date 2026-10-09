import React, { useState } from 'react';
import { Shift } from '../../types/shifts';
import { MOCK_SHIFT_TECHNICIANS, BANGLADESH_HOLIDAYS_2025 } from '../../data/mockShiftData';
import { ShiftCell } from './ShiftCell';
import { ShiftEditor } from './ShiftEditor';
import { Sun, Sunset, Moon, XCircle, Calendar, AlertTriangle } from 'lucide-react';

interface WeeklyShiftGridProps {
  shifts: Shift[];
  weekDates: string[]; // 7 dates ["YYYY-MM-DD", ...]
  onSaveShift: (shiftData: any) => void;
  onDeleteShift: (shiftId: string) => void;
}

export const WeeklyShiftGrid: React.FC<WeeklyShiftGridProps> = ({
  shifts,
  weekDates,
  onSaveShift,
  onDeleteShift,
}) => {
  const [selectedCell, setSelectedCell] = useState<{
    shift?: Shift;
    technicianId: string;
    technicianName: string;
    date: string;
  } | null>(null);

  // Day names for header
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-6 shadow-xs overflow-x-auto">
      {/* Legend & Summary */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div className="flex items-center space-x-2">
          <Calendar className="w-5 h-5 text-amber-500" />
          <h3 className="font-extrabold text-sm text-slate-900 dark:text-slate-100">
            Weekly Technician Shift Roster
          </h3>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-xs">
          <span className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
            <Sun className="w-3.5 h-3.5 text-amber-500" /> Morning (8A-4P)
          </span>
          <span className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
            <Sunset className="w-3.5 h-3.5 text-orange-500" /> Afternoon (2P-10P)
          </span>
          <span className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
            <Moon className="w-3.5 h-3.5 text-indigo-400" /> Night (10P-6A)
          </span>
          <span className="flex items-center gap-1 font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800">
            <XCircle className="w-3.5 h-3.5" /> Fri Off (BD Weekend)
          </span>
        </div>
      </div>

      {/* Grid Table */}
      <div className="min-w-[800px]">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="p-3 text-left text-xs font-extrabold text-slate-500 uppercase tracking-wider w-48 border-b border-slate-200 dark:border-slate-800">
                Technician
              </th>
              {weekDates.map((dateStr, idx) => {
                const dateObj = new Date(dateStr);
                const dayNum = dateObj.getDay();
                const isFriday = dayNum === 5;
                const holiday = BANGLADESH_HOLIDAYS_2025.find((h) => h.date === dateStr);

                return (
                  <th
                    key={dateStr}
                    className={`p-3 text-center border-b border-slate-200 dark:border-slate-800 ${
                      isFriday
                        ? 'bg-emerald-50/50 dark:bg-emerald-950/30 font-bold text-emerald-800 dark:text-emerald-300'
                        : 'text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div className="text-xs font-bold uppercase">{dayNames[dayNum]}</div>
                    <div className="text-[11px] font-mono opacity-70">
                      {dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </div>
                    {holiday && (
                      <span className="text-[9px] bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300 px-1 rounded font-bold inline-block mt-0.5 truncate max-w-[80px]">
                        {holiday.nameBn.slice(0, 10)}...
                      </span>
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {MOCK_SHIFT_TECHNICIANS.map((tech) => (
              <tr key={tech.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition">
                <td className="p-3">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-8 h-8 rounded-xl bg-slate-900 text-white font-extrabold text-xs flex items-center justify-center shrink-0">
                      {tech.avatar}
                    </div>
                    <div>
                      <div className="font-extrabold text-xs text-slate-900 dark:text-slate-100">
                        {tech.name}
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono truncate max-w-[130px]">
                        {tech.role}
                      </div>
                    </div>
                  </div>
                </td>

                {weekDates.map((dateStr) => {
                  const dateObj = new Date(dateStr);
                  const isFriday = dateObj.getDay() === 5;
                  const holiday = BANGLADESH_HOLIDAYS_2025.find((h) => h.date === dateStr);
                  const matchingShift = shifts.find(
                    (s) => s.technicianId === tech.id && s.date === dateStr
                  );

                  return (
                    <td key={dateStr} className="p-1.5">
                      <ShiftCell
                        shift={matchingShift}
                        isFriday={isFriday}
                        isHoliday={!!holiday}
                        holidayName={holiday?.name}
                        onClick={() =>
                          setSelectedCell({
                            shift: matchingShift,
                            technicianId: tech.id,
                            technicianName: tech.name,
                            date: dateStr,
                          })
                        }
                      />
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Editor Modal */}
      {selectedCell && (
        <ShiftEditor
          isOpen={true}
          shift={selectedCell.shift}
          technicianId={selectedCell.technicianId}
          technicianName={selectedCell.technicianName}
          date={selectedCell.date}
          onClose={() => setSelectedCell(null)}
          onSave={onSaveShift}
          onDelete={onDeleteShift}
        />
      )}
    </div>
  );
};
