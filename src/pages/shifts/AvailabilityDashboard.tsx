import React, { useMemo } from 'react';
import { useShifts } from '../../hooks/useShifts';
import { AvailabilityBadge } from '../../components/shifts/AvailabilityBadge';
import { Sun, Sunset, Moon, MapPin, Phone, Clock, Users, Wrench, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export const AvailabilityDashboard: React.FC = () => {
  const { getTechnicianAvailability } = useShifts();

  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);
  const todayAvailability = useMemo(
    () => getTechnicianAvailability(todayStr),
    [getTechnicianAvailability, todayStr]
  );

  const stats = useMemo(() => {
    const available = todayAvailability.filter((t) => t.status === 'available').length;
    const onJob = todayAvailability.filter((t) => t.status === 'on_job').length;
    const off = todayAvailability.filter((t) => t.status === 'off').length;
    const overtime = todayAvailability.filter((t) => t.status === 'overtime').length;
    return { available, onJob, off, overtime, total: todayAvailability.length };
  }, [todayAvailability]);

  // Group by shift type
  const morningTechs = todayAvailability.filter((t) => t.shift?.shiftType === 'morning');
  const afternoonTechs = todayAvailability.filter((t) => t.shift?.shiftType === 'afternoon');
  const nightTechs = todayAvailability.filter((t) => t.shift?.shiftType === 'night' || t.shift?.shiftType === 'full_day');

  return (
    <div className="space-y-6 pb-12 animate-fadeIn">
      {/* Top Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-xl border border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
            <h1 className="text-xl font-extrabold text-white">Today's Live Availability Dashboard</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1 font-mono">
            Real-time technician duty telemetry & active shift status for {todayStr}
          </p>
        </div>

        <div className="text-right">
          <span className="text-[10px] font-mono uppercase text-slate-400 block">Dhaka Command Time</span>
          <span className="text-base font-extrabold font-mono text-amber-400">
            {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} GMT+6
          </span>
        </div>
      </div>

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-xs flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 font-extrabold flex items-center justify-center text-lg border border-emerald-200 dark:border-emerald-800">
            🟢
          </div>
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Available Now</div>
            <div className="text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400">
              {stats.available} <span className="text-xs text-slate-400 font-normal">/ {stats.total}</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-xs flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 font-extrabold flex items-center justify-center text-lg border border-blue-200 dark:border-blue-800">
            🔵
          </div>
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">On Active Job</div>
            <div className="text-2xl font-black font-mono text-blue-600 dark:text-blue-400">
              {stats.onJob}
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-xs flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-extrabold flex items-center justify-center text-lg border border-slate-200 dark:border-slate-700">
            ⚪
          </div>
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Off Today</div>
            <div className="text-2xl font-black font-mono text-slate-700 dark:text-slate-300">
              {stats.off}
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-xs flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-yellow-50 dark:bg-yellow-950/80 text-yellow-700 dark:text-yellow-300 font-extrabold flex items-center justify-center text-lg border border-yellow-200 dark:border-yellow-800">
            ⚡
          </div>
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Overtime Roster</div>
            <div className="text-2xl font-black font-mono text-yellow-600 dark:text-yellow-400">
              {stats.overtime}
            </div>
          </div>
        </div>
      </div>

      {/* Morning Shift Group */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-4 shadow-xs">
        <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <Sun className="w-5 h-5 text-amber-500" />
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-slate-100">
              MORNING SHIFT (8:00 AM - 4:00 PM)
            </h3>
          </div>
          <span className="text-xs font-mono font-bold bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300 px-2.5 py-0.5 rounded-full">
            {morningTechs.length} Technicians
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {morningTechs.map((tech) => (
            <div
              key={tech.technicianId}
              className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 space-y-2 text-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-center">
                  <div className="font-extrabold text-slate-900 dark:text-slate-100">
                    {tech.technicianName}
                  </div>
                  <AvailabilityBadge status={tech.status} />
                </div>
                <div className="text-[11px] text-slate-500 font-mono flex items-center gap-1 mt-1">
                  <MapPin className="w-3 h-3 text-slate-400" /> {tech.zone}
                </div>
              </div>

              {tech.currentJobTitle && (
                <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-[10px] text-blue-900 dark:text-blue-200 font-bold">
                  <Wrench className="w-3 h-3 inline mr-1 text-blue-500" />
                  {tech.currentJobTitle}
                </div>
              )}

              <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center text-[10px] text-slate-500 font-mono">
                <span>{tech.phone}</span>
                <span className="font-bold text-slate-700 dark:text-slate-300">8A - 4P</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Afternoon Shift Group */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-4 shadow-xs">
        <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <Sunset className="w-5 h-5 text-orange-500" />
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-slate-100">
              AFTERNOON SHIFT (2:00 PM - 10:00 PM)
            </h3>
          </div>
          <span className="text-xs font-mono font-bold bg-orange-100 text-orange-900 dark:bg-orange-950 dark:text-orange-300 px-2.5 py-0.5 rounded-full">
            {afternoonTechs.length} Technicians
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {afternoonTechs.map((tech) => (
            <div
              key={tech.technicianId}
              className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 space-y-2 text-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-center">
                  <div className="font-extrabold text-slate-900 dark:text-slate-100">
                    {tech.technicianName}
                  </div>
                  <AvailabilityBadge status={tech.status} />
                </div>
                <div className="text-[11px] text-slate-500 font-mono flex items-center gap-1 mt-1">
                  <MapPin className="w-3 h-3 text-slate-400" /> {tech.zone}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center text-[10px] text-slate-500 font-mono">
                <span>{tech.phone}</span>
                <span className="font-bold text-slate-700 dark:text-slate-300">2P - 10P</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Night / Full Day Shift Group */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-4 shadow-xs">
        <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <Moon className="w-5 h-5 text-indigo-400" />
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-slate-100">
              NIGHT & FULL DAY EMERGENCY ROSTER
            </h3>
          </div>
          <span className="text-xs font-mono font-bold bg-indigo-100 text-indigo-900 dark:bg-indigo-950 dark:text-indigo-300 px-2.5 py-0.5 rounded-full">
            {nightTechs.length} Technicians
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {nightTechs.map((tech) => (
            <div
              key={tech.technicianId}
              className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 space-y-2 text-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-center">
                  <div className="font-extrabold text-slate-900 dark:text-slate-100">
                    {tech.technicianName}
                  </div>
                  <AvailabilityBadge status={tech.status} />
                </div>
                <div className="text-[11px] text-slate-500 font-mono flex items-center gap-1 mt-1">
                  <MapPin className="w-3 h-3 text-slate-400" /> {tech.zone}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center text-[10px] text-slate-500 font-mono">
                <span>{tech.phone}</span>
                <span className="font-bold text-slate-700 dark:text-slate-300">
                  {tech.shift?.startTime} - {tech.shift?.endTime}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
