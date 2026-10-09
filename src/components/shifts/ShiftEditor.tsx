import React, { useState, useEffect } from 'react';
import { Shift, ShiftType } from '../../types/shifts';
import { X, Clock, MapPin, Zap, CheckCircle2, Trash2, Sun, Sunset, Moon, Sparkles } from 'lucide-react';
import { Button } from '../ui/Button';

interface ShiftEditorProps {
  isOpen: boolean;
  shift?: Shift;
  technicianId?: string;
  technicianName?: string;
  date?: string;
  onClose: () => void;
  onSave: (shiftData: Omit<Shift, 'id'> | Shift) => void;
  onDelete?: (shiftId: string) => void;
}

export const ShiftEditor: React.FC<ShiftEditorProps> = ({
  isOpen,
  shift,
  technicianId,
  technicianName,
  date,
  onClose,
  onSave,
  onDelete,
}) => {
  const [shiftType, setShiftType] = useState<ShiftType>('morning');
  const [startTime, setStartTime] = useState('08:00');
  const [endTime, setEndTime] = useState('16:00');
  const [zone, setZone] = useState('Dhaka North (Mirpur)');
  const [isOvertime, setIsOvertime] = useState(false);
  const [notes, setNotes] = useState('');
  const [isRamadan, setIsRamadan] = useState(false);

  useEffect(() => {
    if (shift) {
      setShiftType(shift.shiftType);
      setStartTime(shift.startTime);
      setEndTime(shift.endTime);
      setZone(shift.zone || 'Dhaka North (Mirpur)');
      setIsOvertime(shift.isOvertime);
      setNotes(shift.notes || '');
      setIsRamadan(!!shift.isRamadanSchedule);
    } else {
      setShiftType('morning');
      setStartTime('08:00');
      setEndTime('16:00');
      setZone('Dhaka North (Mirpur)');
      setIsOvertime(false);
      setNotes('');
      setIsRamadan(false);
    }
  }, [shift, isOpen]);

  if (!isOpen) return null;

  const handleShiftTypeChange = (type: ShiftType) => {
    setShiftType(type);
    if (type === 'morning') {
      setStartTime('08:00');
      setEndTime('16:00');
    } else if (type === 'afternoon') {
      setStartTime('14:00');
      setEndTime('22:00');
    } else if (type === 'night') {
      setStartTime('22:00');
      setEndTime('06:00');
    } else if (type === 'full_day') {
      setStartTime('08:00');
      setEndTime('20:00');
    } else if (type === 'off') {
      setStartTime('00:00');
      setEndTime('00:00');
    }
  };

  const handleApplyRamadanTimings = () => {
    setIsRamadan(true);
    setShiftType('morning');
    setStartTime('09:00');
    setEndTime('15:30');
    setNotes((prev) => (prev ? `${prev} (Ramadan Timing)` : 'Ramadan Schedule 9:00 AM - 3:30 PM'));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...(shift || {}),
      technicianId: shift?.technicianId || technicianId || 'tech-1',
      technicianName: shift?.technicianName || technicianName || 'Technician',
      date: shift?.date || date || new Date().toISOString().split('T')[0],
      shiftType,
      startTime,
      endTime,
      zone,
      isOvertime,
      notes,
      isRamadanSchedule: isRamadan,
      createdBy: 'Dispatcher',
    };
    onSave(payload as any);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="w-10 h-10 rounded-2xl bg-amber-50 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 flex items-center justify-center border border-amber-200 dark:border-amber-800">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-extrabold text-base text-slate-900 dark:text-slate-100">
              {shift ? 'Edit Shift Assignment' : 'Assign New Shift'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {shift?.technicianName || technicianName} • Date: {shift?.date || date}
            </p>
          </div>
        </div>

        {/* Ramadan Quick Preset */}
        <div className="bg-emerald-50 dark:bg-emerald-950/40 p-3 rounded-2xl border border-emerald-200 dark:border-emerald-800/60 flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span className="font-bold text-emerald-900 dark:text-emerald-200">
              Holy Ramadan Timing (9:00 AM - 3:30 PM)
            </span>
          </div>
          <button
            type="button"
            onClick={handleApplyRamadanTimings}
            className="bg-emerald-600 text-white font-bold text-[10px] px-2.5 py-1 rounded-xl hover:bg-emerald-700 transition"
          >
            Apply Preset
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Shift Type Selector */}
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-2">
              Select Shift Preset
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { type: 'morning', label: 'Morning', icon: <Sun className="w-3.5 h-3.5 text-amber-500" />, time: '8A - 4P' },
                { type: 'afternoon', label: 'Afternoon', icon: <Sunset className="w-3.5 h-3.5 text-orange-500" />, time: '2P - 10P' },
                { type: 'night', label: 'Night', icon: <Moon className="w-3.5 h-3.5 text-indigo-400" />, time: '10P - 6A' },
                { type: 'full_day', label: 'Full Day', icon: <Zap className="w-3.5 h-3.5 text-yellow-500" />, time: '8A - 8P' },
                { type: 'off', label: 'Off Day', icon: <X className="w-3.5 h-3.5 text-slate-400" />, time: 'Rest' },
                { type: 'custom', label: 'Custom', icon: <Clock className="w-3.5 h-3.5 text-emerald-500" />, time: 'Custom' },
              ].map((item) => (
                <button
                  key={item.type}
                  type="button"
                  onClick={() => handleShiftTypeChange(item.type as ShiftType)}
                  className={`p-2.5 rounded-2xl border text-left transition flex flex-col justify-between ${
                    shiftType === item.type
                      ? 'bg-amber-500 text-slate-950 font-bold border-amber-600 shadow-sm'
                      : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:border-amber-400 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <div className="flex items-center space-x-1.5">
                    {item.icon}
                    <span className="text-[11px] font-bold">{item.label}</span>
                  </div>
                  <span className="text-[9px] font-mono opacity-80 mt-1">{item.time}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Time pickers */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Start Time
              </label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 font-mono text-slate-900 dark:text-slate-100"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                End Time
              </label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 font-mono text-slate-900 dark:text-slate-100"
              />
            </div>
          </div>

          {/* Zone Selector */}
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              Assigned Field Zone
            </label>
            <select
              value={zone}
              onChange={(e) => setZone(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-slate-100"
            >
              <option value="Dhaka North (Mirpur / Uttara)">Dhaka North (Mirpur / Uttara)</option>
              <option value="Dhaka Central (Gulshan / Banani / Tejgaon)">Dhaka Central (Gulshan / Banani / Tejgaon)</option>
              <option value="Dhaka South (Motijheel / Dhanmondi)">Dhaka South (Motijheel / Dhanmondi)</option>
              <option value="Chittagong Port & Agrabad">Chittagong Port & Agrabad</option>
              <option value="Sylhet Zindabazar">Sylhet Zindabazar</option>
              <option value="Khulna & Barisal">Khulna & Barisal</option>
            </select>
          </div>

          {/* Overtime checkbox */}
          <div className="flex items-center space-x-2 pt-1">
            <input
              type="checkbox"
              id="overtimeCheck"
              checked={isOvertime}
              onChange={(e) => setIsOvertime(e.target.checked)}
              className="rounded border-slate-300 text-amber-500 focus:ring-amber-500 w-4 h-4"
            />
            <label htmlFor="overtimeCheck" className="font-bold text-slate-700 dark:text-slate-300 cursor-pointer">
              Mark as Overtime Shift (1.5x Hourly Rate)
            </label>
          </div>

          {/* Notes */}
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              Dispatch Instructions / Notes
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g., Assigned to Grameenphone Mirpur site overhaul..."
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl p-2.5 text-slate-900 dark:text-slate-100"
            />
          </div>

          {/* Actions */}
          <div className="pt-2 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
            {shift && onDelete ? (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  onDelete(shift.id);
                  onClose();
                }}
                className="text-red-600 border-red-200 hover:bg-red-50 dark:hover:bg-red-950/40"
              >
                <Trash2 className="w-3.5 h-3.5 mr-1" /> Remove Shift
              </Button>
            ) : (
              <div />
            )}

            <div className="flex items-center space-x-2">
              <Button type="button" variant="outline" size="sm" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm" className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold">
                <CheckCircle2 className="w-4 h-4 mr-1.5" /> Save Shift
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
