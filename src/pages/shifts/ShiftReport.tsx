import React, { useMemo } from 'react';
import { useShifts } from '../../hooks/useShifts';
import { useLeaves } from '../../hooks/useLeaves';
import { MOCK_SHIFT_TECHNICIANS } from '../../data/mockShiftData';
import {
  BarChart2,
  Clock,
  Printer,
  Download,
  Users,
  CheckCircle2,
  AlertCircle,
  FileSpreadsheet,
} from 'lucide-react';
import { Button } from '../../components/ui/Button';

export const ShiftReport: React.FC = () => {
  const { shifts } = useShifts();
  const { leaveBalances } = useLeaves();

  // Aggregate stats per technician
  const techReports = useMemo(() => {
    return MOCK_SHIFT_TECHNICIANS.map((tech) => {
      const techShifts = shifts.filter((s) => s.technicianId === tech.id);
      const regularShifts = techShifts.filter((s) => s.shiftType !== 'off' && !s.isOvertime);
      const overtimeShifts = techShifts.filter((s) => s.isOvertime);

      const regularHours = regularShifts.length * 8;
      const overtimeHours = overtimeShifts.length * 4; // average 4 hrs OT
      const totalHours = regularHours + overtimeHours;

      // Base hourly rate estimated at 350 BDT/hr, OT at 1.5x = 525 BDT/hr
      const regularPayBDT = regularHours * 350;
      const overtimePayBDT = overtimeHours * 525;
      const totalPayBDT = regularPayBDT + overtimePayBDT;

      const attendancePercent = techShifts.length > 0 ? Math.round((regularShifts.length / (techShifts.length || 1)) * 100) : 95;

      return {
        tech,
        totalShifts: techShifts.length,
        regularHours,
        overtimeHours,
        totalHours,
        regularPayBDT,
        overtimePayBDT,
        totalPayBDT,
        attendancePercent,
        leaveBal: leaveBalances[tech.id],
      };
    });
  }, [shifts, leaveBalances]);

  const grandTotalHours = useMemo(() => techReports.reduce((acc, r) => acc + r.totalHours, 0), [techReports]);
  const grandTotalOT = useMemo(() => techReports.reduce((acc, r) => acc + r.overtimeHours, 0), [techReports]);
  const grandTotalPayrollBDT = useMemo(() => techReports.reduce((acc, r) => acc + r.totalPayBDT, 0), [techReports]);

  return (
    <div className="space-y-6 pb-12 animate-fadeIn">
      {/* Page Header */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-xl border border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <BarChart2 className="w-5 h-5 text-amber-500" />
            <h1 className="text-xl font-extrabold text-white">Technician Attendance, Hours & Overtime Report</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Monthly payroll metrics, overtime hour logs (1.5x BD labor code) and attendance compliance
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Button size="sm" variant="outline" onClick={() => window.print()} className="bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700">
            <Printer className="w-4 h-4 mr-1.5" /> Print Report
          </Button>
          <Button size="sm" variant="primary" onClick={() => alert('Exporting CSV shift report...')} className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold">
            <Download className="w-4 h-4 mr-1.5" /> Export Excel
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-xs">
          <div className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Total Worked Hours</div>
          <div className="text-2xl font-black font-mono text-slate-900 dark:text-slate-100 mt-1">
            {grandTotalHours} <span className="text-xs text-slate-400 font-normal">hrs</span>
          </div>
          <p className="text-[10px] text-slate-500 mt-1">Across all 5 field technicians</p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-xs">
          <div className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Overtime Hours (1.5x)</div>
          <div className="text-2xl font-black font-mono text-yellow-600 dark:text-yellow-400 mt-1">
            {grandTotalOT} <span className="text-xs text-slate-400 font-normal">hrs</span>
          </div>
          <p className="text-[10px] text-slate-500 mt-1">1.5x Bangladesh overtime allowance</p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-xs">
          <div className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Estimated Shift Payroll (BDT)</div>
          <div className="text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400 mt-1">
            ৳ {grandTotalPayrollBDT.toLocaleString()}
          </div>
          <p className="text-[10px] text-slate-500 mt-1">Includes regular + overtime payouts</p>
        </div>
      </div>

      {/* Main Breakdown Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-4 shadow-xs">
        <h3 className="font-extrabold text-xs uppercase tracking-wider text-slate-900 dark:text-slate-100 flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
          <FileSpreadsheet className="w-4 h-4 text-amber-500" />
          Individual Technician Hours & Attendance Summary
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase text-[10px] font-bold">
                <th className="py-2.5 px-3">Technician</th>
                <th className="py-2.5 px-3">Regular Hours</th>
                <th className="py-2.5 px-3">Overtime Hours</th>
                <th className="py-2.5 px-3">Total Hours</th>
                <th className="py-2.5 px-3">Attendance %</th>
                <th className="py-2.5 px-3">Leaves Taken</th>
                <th className="py-2.5 px-3 text-right">Est. Pay (BDT)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {techReports.map((item) => (
                <tr key={item.tech.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                  <td className="py-3 px-3">
                    <div className="font-bold text-slate-900 dark:text-slate-100">{item.tech.name}</div>
                    <div className="text-[10px] text-slate-500 font-mono">{item.tech.role}</div>
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-700 dark:text-slate-300">
                    {item.regularHours} hrs
                  </td>
                  <td className="py-3 px-3 font-mono font-bold text-yellow-600 dark:text-yellow-400">
                    {item.overtimeHours} hrs
                  </td>
                  <td className="py-3 px-3 font-mono font-extrabold text-slate-900 dark:text-slate-100">
                    {item.totalHours} hrs
                  </td>
                  <td className="py-3 px-3 font-mono">
                    <span className="bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 px-2 py-0.5 rounded-full font-bold">
                      {item.attendancePercent}%
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-600 dark:text-slate-400 font-mono">
                    {10 - (item.leaveBal?.casualRemaining || 10)} days
                  </td>
                  <td className="py-3 px-3 text-right font-mono font-extrabold text-emerald-600 dark:text-emerald-400">
                    ৳ {item.totalPayBDT.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
