import React, { useState } from 'react';
import { useShifts } from '../../hooks/useShifts';
import { useLeaves } from '../../hooks/useLeaves';
import { MOCK_SHIFT_TECHNICIANS, PREDEFINED_TEMPLATES } from '../../data/mockShiftData';
import { ShiftType } from '../../types/shifts';
import {
  Calendar,
  Sparkles,
  Copy,
  AlertTriangle,
  CheckCircle2,
  Users,
  Clock,
  Zap,
  ArrowRight,
  CheckSquare,
} from 'lucide-react';
import { Button } from '../../components/ui/Button';

export const ShiftScheduler: React.FC = () => {
  const { shifts, createShift, copyPreviousWeek, applyTemplate } = useShifts();
  const { leaves } = useLeaves();

  const [targetWeekStart, setTargetWeekStart] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [selectedTechIds, setSelectedTechIds] = useState<string[]>(
    MOCK_SHIFT_TECHNICIANS.map((t) => t.id)
  );
  const [selectedDays, setSelectedDays] = useState<number[]>([0, 1, 2, 3, 4, 6]); // Sun-Thu + Sat
  const [bulkShiftType, setBulkShiftType] = useState<ShiftType>('morning');
  const [bulkZone, setBulkZone] = useState('Dhaka North (Mirpur / Uttara)');
  const [isSuccessToast, setIsSuccessToast] = useState(false);

  const toggleTech = (id: string) => {
    setSelectedTechIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleDay = (dayNum: number) => {
    setSelectedDays((prev) =>
      prev.includes(dayNum) ? prev.filter((d) => d !== dayNum) : [...prev, dayNum]
    );
  };

  const dayLabels = [
    { num: 0, label: 'Sun' },
    { num: 1, label: 'Mon' },
    { num: 2, label: 'Tue' },
    { num: 3, label: 'Wed' },
    { num: 4, label: 'Thu' },
    { num: 5, label: 'Fri (BD Off)' },
    { num: 6, label: 'Sat' },
  ];

  // Conflict Detection Logic
  const detectConflicts = () => {
    const conflicts: { techName: string; reason: string; date: string }[] = [];

    // Check leave conflicts
    leaves.forEach((l) => {
      if (l.status === 'approved') {
        const matchingShift = shifts.find(
          (s) => s.technicianId === l.technicianId && s.date >= l.startDate && s.date <= l.endDate && s.shiftType !== 'off'
        );
        if (matchingShift) {
          conflicts.push({
            techName: l.technicianName,
            reason: `Assigned shift on approved leave day (${l.type})`,
            date: matchingShift.date,
          });
        }
      }
    });

    return conflicts;
  };

  const conflictsList = detectConflicts();

  const handleExecuteBulkAssign = async () => {
    const d = new Date(targetWeekStart);
    const day = d.getDay();
    const diff = d.getDate() - day;
    const sunday = new Date(d.setDate(diff));

    for (const techId of selectedTechIds) {
      const tech = MOCK_SHIFT_TECHNICIANS.find((t) => t.id === techId);
      if (!tech) continue;

      for (const dayNum of selectedDays) {
        const curDate = new Date(sunday);
        curDate.setDate(sunday.getDate() + dayNum);
        const dateStr = curDate.toISOString().split('T')[0];

        await createShift({
          technicianId: tech.id,
          technicianName: tech.name,
          date: dateStr,
          shiftType: bulkShiftType,
          startTime: bulkShiftType === 'morning' ? '08:00' : '14:00',
          endTime: bulkShiftType === 'morning' ? '16:00' : '22:00',
          zone: bulkZone,
          isOvertime: false,
          createdBy: 'Bulk Scheduler Engine',
        });
      }
    }

    setIsSuccessToast(true);
    setTimeout(() => setIsSuccessToast(false), 3000);
  };

  return (
    <div className="space-y-6 pb-12 animate-fadeIn">
      {/* Page Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-xl border border-slate-800 flex justify-between items-center">
        <div>
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <h1 className="text-xl font-extrabold text-white">Smart Shift Scheduler & Bulk Dispatch</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Automated weekly schedule generator with conflict detection and template application
          </p>
        </div>

        <Button
          size="sm"
          variant="primary"
          onClick={() => copyPreviousWeek(targetWeekStart)}
          className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold"
        >
          <Copy className="w-4 h-4 mr-1.5" /> Clone Previous Week Schedule
        </Button>
      </div>

      {/* Conflict Alert Banner if detected */}
      {conflictsList.length > 0 && (
        <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800/80 rounded-2xl p-4 flex items-start space-x-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="font-extrabold text-xs text-amber-900 dark:text-amber-200">
              {conflictsList.length} Schedule Conflicts Detected!
            </h4>
            <div className="text-xs text-amber-800 dark:text-amber-300 space-y-0.5 font-mono">
              {conflictsList.map((c, i) => (
                <div key={i}>
                  • <strong>{c.techName}</strong> ({c.date}): {c.reason}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Bulk Schedule Builder Tool */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-6 shadow-xs">
          <h3 className="font-extrabold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <Zap className="w-4 h-4 text-amber-500" />
            Step 1: Select Technicians & Work Days
          </h3>

          {/* Technician Multi-Select */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              Technicians to Schedule ({selectedTechIds.length} Selected)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {MOCK_SHIFT_TECHNICIANS.map((tech) => (
                <button
                  key={tech.id}
                  type="button"
                  onClick={() => toggleTech(tech.id)}
                  className={`p-3 rounded-2xl border text-left flex items-center justify-between transition ${
                    selectedTechIds.includes(tech.id)
                      ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-500 text-slate-900 dark:text-slate-100 font-bold'
                      : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-500'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 rounded-md bg-slate-800 text-white text-[10px] font-extrabold flex items-center justify-center">
                      {tech.avatar}
                    </div>
                    <span className="text-xs">{tech.name}</span>
                  </div>
                  {selectedTechIds.includes(tech.id) && (
                    <CheckSquare className="w-4 h-4 text-amber-600" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Days of Week Selector */}
          <div className="space-y-2 pt-2">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              Active Shift Days
            </label>
            <div className="flex flex-wrap gap-2">
              {dayLabels.map((d) => (
                <button
                  key={d.num}
                  type="button"
                  onClick={() => toggleDay(d.num)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition border ${
                    selectedDays.includes(d.num)
                      ? d.num === 5
                        ? 'bg-emerald-500 text-white border-emerald-600'
                        : 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 border-slate-900'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          {/* Shift Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Shift Type
              </label>
              <select
                value={bulkShiftType}
                onChange={(e) => setBulkShiftType(e.target.value as ShiftType)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 dark:text-slate-100"
              >
                <option value="morning">Morning (8:00 AM - 4:00 PM)</option>
                <option value="afternoon">Afternoon (2:00 PM - 10:00 PM)</option>
                <option value="night">Night (10:00 PM - 6:00 AM)</option>
                <option value="full_day">Full Day (8:00 AM - 8:00 PM)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Field Deployment Zone
              </label>
              <select
                value={bulkZone}
                onChange={(e) => setBulkZone(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-slate-100"
              >
                <option value="Dhaka North (Mirpur / Uttara)">Dhaka North (Mirpur / Uttara)</option>
                <option value="Dhaka Central (Gulshan / Banani)">Dhaka Central (Gulshan / Banani)</option>
                <option value="Dhaka South (Motijheel / Dhanmondi)">Dhaka South (Motijheel / Dhanmondi)</option>
                <option value="Chittagong EPZ & Port">Chittagong EPZ & Port</option>
              </select>
            </div>
          </div>

          <Button
            size="md"
            variant="primary"
            onClick={handleExecuteBulkAssign}
            disabled={selectedTechIds.length === 0 || selectedDays.length === 0}
            className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold py-3 text-sm"
          >
            <Sparkles className="w-4 h-4 mr-2" /> Generate Bulk Schedule
          </Button>

          {isSuccessToast && (
            <div className="bg-emerald-50 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-200 border border-emerald-300 p-3 rounded-2xl text-xs flex items-center space-x-2 font-bold animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Bulk Roster successfully generated & assigned!</span>
            </div>
          )}
        </div>

        {/* Sidebar Templates & Tips */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 space-y-4 shadow-xs">
            <h3 className="font-extrabold text-xs uppercase tracking-wider text-slate-900 dark:text-slate-100">
              Preset Roster Templates
            </h3>

            <div className="space-y-3">
              {PREDEFINED_TEMPLATES.map((tpl) => (
                <div
                  key={tpl.id}
                  className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-2 text-xs"
                >
                  <div className="font-bold text-slate-900 dark:text-slate-100">{tpl.name}</div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">{tpl.description}</p>
                  <Button
                    size="xs"
                    variant="outline"
                    onClick={() => applyTemplate(tpl.id, targetWeekStart)}
                    className="w-full font-bold"
                  >
                    Apply Template
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
