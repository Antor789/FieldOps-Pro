import React, { useState, useMemo } from 'react';
import { useShifts } from '../../hooks/useShifts';
import { WeeklyShiftGrid } from '../../components/shifts/WeeklyShiftGrid';
import { ShiftTemplate } from '../../components/shifts/ShiftTemplate';
import { ShiftEditor } from '../../components/shifts/ShiftEditor';
import { MOCK_SHIFT_TECHNICIANS } from '../../data/mockShiftData';
import { Shift, ShiftType } from '../../types/shifts';
import {
  Calendar,
  Grid,
  List,
  BarChart2,
  ChevronLeft,
  ChevronRight,
  Plus,
  Search,
  Filter,
  Sun,
  Sunset,
  Moon,
  Zap,
  Clock,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '../../components/ui/Button';

export const ShiftManagement: React.FC = () => {
  const {
    shifts,
    createShift,
    updateShift,
    deleteShift,
    getShiftsForWeek,
    copyPreviousWeek,
    applyTemplate,
    getWeekDates,
  } = useShifts();

  const [currentWeekStart, setCurrentWeekStart] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [activeView, setActiveView] = useState<'grid' | 'timeline' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedShiftType, setSelectedShiftType] = useState<string>('all');
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingShift, setEditingShift] = useState<Shift | undefined>(undefined);

  const weekDates = useMemo(() => getWeekDates(currentWeekStart), [currentWeekStart, getWeekDates]);
  const currentWeekShifts = useMemo(
    () => getShiftsForWeek(currentWeekStart),
    [getShiftsForWeek, currentWeekStart]
  );

  const navigateWeek = (direction: 'prev' | 'next') => {
    const d = new Date(currentWeekStart);
    d.setDate(d.getDate() + (direction === 'next' ? 7 : -7));
    setCurrentWeekStart(d.toISOString().split('T')[0]);
  };

  const handleSaveShift = async (shiftData: any) => {
    if (shiftData.id) {
      await updateShift(shiftData.id, shiftData);
    } else {
      await createShift(shiftData);
    }
  };

  const handleDeleteShift = async (id: string) => {
    await deleteShift(id);
  };

  const filteredShiftsList = useMemo(() => {
    return shifts.filter((s) => {
      const matchesSearch =
        s.technicianName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.zone?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.notes?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = selectedShiftType === 'all' || s.shiftType === selectedShiftType;
      return matchesSearch && matchesType;
    });
  }, [shifts, searchQuery, selectedShiftType]);

  return (
    <div className="space-y-6 pb-12 animate-fadeIn">
      {/* Top Page Header */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4 border border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="w-11 h-11 rounded-2xl bg-amber-500 text-slate-950 font-extrabold flex items-center justify-center text-lg shadow-sm">
            👷
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-extrabold text-white">Technician Shift Roster & Availability</h1>
              <span className="bg-amber-500/20 text-amber-300 font-mono text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full border border-amber-500/30">
                BD Roster Standard
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Managing field technician shifts across Dhaka, Chittagong & Sylhet • Friday BD Weekend Roster
            </p>
          </div>
        </div>

        {/* View Switcher & Action */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="bg-slate-800 p-1 rounded-2xl flex items-center border border-slate-700">
            <button
              onClick={() => setActiveView('grid')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                activeView === 'grid'
                  ? 'bg-amber-500 text-slate-950 shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Grid className="w-3.5 h-3.5" /> Weekly Grid
            </button>
            <button
              onClick={() => setActiveView('timeline')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                activeView === 'timeline'
                  ? 'bg-amber-500 text-slate-950 shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <BarChart2 className="w-3.5 h-3.5" /> Timeline
            </button>
            <button
              onClick={() => setActiveView('list')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                activeView === 'list'
                  ? 'bg-amber-500 text-slate-950 shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <List className="w-3.5 h-3.5" /> List View
            </button>
          </div>

          <Button
            size="sm"
            variant="primary"
            onClick={() => {
              setEditingShift(undefined);
              setIsEditorOpen(true);
            }}
            className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold"
          >
            <Plus className="w-4 h-4 mr-1" /> Add Shift
          </Button>
        </div>
      </div>

      {/* Week Navigator Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center space-x-3">
          <Button size="xs" variant="outline" onClick={() => navigateWeek('prev')}>
            <ChevronLeft className="w-4 h-4 mr-1" /> Prev Week
          </Button>
          <div className="text-xs font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-amber-500" />
            <span>Week: {weekDates[0]} to {weekDates[6]}</span>
          </div>
          <Button size="xs" variant="outline" onClick={() => navigateWeek('next')}>
            Next Week <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <span className="font-bold text-slate-500 dark:text-slate-400 font-mono">
            {currentWeekShifts.length} Shifts Assigned This Week
          </span>
        </div>
      </div>

      {/* Automation & Template bar */}
      {activeView === 'grid' && (
        <ShiftTemplate
          onApplyTemplate={(tplId) => applyTemplate(tplId, currentWeekStart)}
          onCopyPreviousWeek={() => copyPreviousWeek(currentWeekStart)}
        />
      )}

      {/* VIEW 1: Weekly Grid */}
      {activeView === 'grid' && (
        <WeeklyShiftGrid
          shifts={currentWeekShifts}
          weekDates={weekDates}
          onSaveShift={handleSaveShift}
          onDeleteShift={handleDeleteShift}
        />
      )}

      {/* VIEW 2: Technician Timeline (Gantt-style) */}
      {activeView === 'timeline' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-6 shadow-xs overflow-x-auto">
          <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-amber-500" />
              Daily 24-Hour Gantt Timeline ({weekDates[0]})
            </h3>
            <span className="text-xs font-mono text-slate-500">Dhaka Time (GMT+6)</span>
          </div>

          <div className="min-w-[700px] space-y-4">
            {/* Timeline hour markers */}
            <div className="grid grid-cols-13 text-[10px] font-mono text-slate-400 border-b border-slate-200 dark:border-slate-800 pb-2 pl-44">
              <span>08:00</span>
              <span>09:00</span>
              <span>10:00</span>
              <span>12:00</span>
              <span>14:00</span>
              <span>16:00</span>
              <span>18:00</span>
              <span>20:00</span>
              <span>22:00</span>
              <span>00:00</span>
              <span>02:00</span>
              <span>04:00</span>
              <span>06:00</span>
            </div>

            {MOCK_SHIFT_TECHNICIANS.map((tech) => {
              const techShifts = shifts.filter(
                (s) => s.technicianId === tech.id && s.date === weekDates[0]
              );
              const activeShift = techShifts[0];

              return (
                <div key={tech.id} className="flex items-center space-x-3 text-xs">
                  <div className="w-40 shrink-0 font-bold text-slate-900 dark:text-slate-100 flex items-center space-x-2">
                    <div className="w-6 h-6 rounded-lg bg-slate-800 text-white font-extrabold text-[10px] flex items-center justify-center">
                      {tech.avatar}
                    </div>
                    <span className="truncate">{tech.name}</span>
                  </div>

                  <div className="flex-1 h-10 bg-slate-100 dark:bg-slate-800/60 rounded-xl relative overflow-hidden flex items-center px-2">
                    {activeShift && activeShift.shiftType !== 'off' ? (
                      <div
                        className={`h-7 rounded-lg px-3 flex items-center justify-between text-white font-bold text-[10px] shadow-xs ${
                          activeShift.shiftType === 'morning'
                            ? 'bg-amber-500 text-slate-950 w-2/3'
                            : activeShift.shiftType === 'afternoon'
                            ? 'bg-orange-500 ml-[30%] w-2/3'
                            : activeShift.shiftType === 'night'
                            ? 'bg-indigo-600 ml-[60%] w-1/3'
                            : 'bg-yellow-500 text-slate-950 w-full'
                        }`}
                      >
                        <span className="truncate">
                          {activeShift.shiftType.toUpperCase()} ({activeShift.startTime} - {activeShift.endTime})
                        </span>
                        <span className="font-mono">{activeShift.zone}</span>
                      </div>
                    ) : (
                      <span className="text-[10px] text-slate-400 font-mono italic mx-auto">
                        Off Day / Standby Rest
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW 3: List view with filters */}
      {activeView === 'list' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-5 shadow-xs">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="flex items-center space-x-2 bg-slate-100 dark:bg-slate-800/80 rounded-2xl px-3 py-1.5 flex-1 max-w-sm">
              <Search className="w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search technician, zone or notes..."
                className="bg-transparent border-none text-xs text-slate-900 dark:text-slate-100 focus:outline-none w-full"
              />
            </div>

            <div className="flex items-center space-x-2 text-xs">
              <span className="font-bold text-slate-500">Shift Filter:</span>
              <select
                value={selectedShiftType}
                onChange={(e) => setSelectedShiftType(e.target.value)}
                className="bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-1 text-slate-900 dark:text-slate-100 font-semibold"
              >
                <option value="all">All Shifts</option>
                <option value="morning">Morning</option>
                <option value="afternoon">Afternoon</option>
                <option value="night">Night</option>
                <option value="full_day">Full Day</option>
                <option value="off">Off Day</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase text-[10px] font-bold">
                  <th className="py-2.5 px-3">Technician</th>
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Shift Type</th>
                  <th className="py-2.5 px-3">Timing</th>
                  <th className="py-2.5 px-3">Field Zone</th>
                  <th className="py-2.5 px-3">Overtime</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredShiftsList.map((shift) => (
                  <tr key={shift.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                    <td className="py-3 px-3 font-bold text-slate-900 dark:text-slate-100">
                      {shift.technicianName}
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-600 dark:text-slate-400">
                      {shift.date}
                    </td>
                    <td className="py-3 px-3">
                      <span className="capitalize font-extrabold text-[11px] bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 rounded-full">
                        {shift.shiftType}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-700 dark:text-slate-300">
                      {shift.startTime} - {shift.endTime}
                    </td>
                    <td className="py-3 px-3 text-slate-600 dark:text-slate-400">
                      {shift.zone || 'Unassigned'}
                    </td>
                    <td className="py-3 px-3">
                      {shift.isOvertime ? (
                        <span className="text-[10px] font-bold bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-300 px-2 py-0.5 rounded-full">
                          Yes (1.5x)
                        </span>
                      ) : (
                        <span className="text-slate-400 font-mono">Regular</span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <Button
                        size="xs"
                        variant="outline"
                        onClick={() => {
                          setEditingShift(shift);
                          setIsEditorOpen(true);
                        }}
                      >
                        Edit
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Shift Editor Modal */}
      <ShiftEditor
        isOpen={isEditorOpen}
        shift={editingShift}
        onClose={() => setIsEditorOpen(false)}
        onSave={handleSaveShift}
        onDelete={handleDeleteShift}
      />
    </div>
  );
};
