import React from 'react';
import { History, BarChart2, CheckCircle2, TrendingUp, MapPin, Flame } from 'lucide-react';

export const RouteHistory: React.FC = () => {
  const historyLogs = [
    {
      id: 'rh-1',
      date: '2025-01-14',
      techName: 'Rahim Ahmed',
      stopsCount: 5,
      plannedKm: 42.0,
      actualKm: 38.4,
      plannedMins: 290,
      actualMins: 265,
      compliance: '96.2%',
      savingsBDT: 85,
    },
    {
      id: 'rh-2',
      date: '2025-01-14',
      techName: 'Tanvir Hossain',
      stopsCount: 4,
      plannedKm: 31.5,
      actualKm: 29.2,
      plannedMins: 230,
      actualMins: 210,
      compliance: '94.8%',
      savingsBDT: 68,
    },
    {
      id: 'rh-3',
      date: '2025-01-13',
      techName: 'Kamal Uddin',
      stopsCount: 6,
      plannedKm: 48.0,
      actualKm: 43.1,
      plannedMins: 320,
      actualMins: 285,
      compliance: '95.5%',
      savingsBDT: 110,
    },
  ];

  return (
    <div className="space-y-6 pb-12 animate-fadeIn">
      {/* Page Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-xl border border-slate-800 flex justify-between items-center">
        <div>
          <div className="flex items-center space-x-2">
            <History className="w-5 h-5 text-amber-500" />
            <h1 className="text-xl font-extrabold text-white">Historical Route Performance & Efficiency Logs</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Planned vs. Actual route execution compliance across Dhaka field operations
          </p>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-xs">
          <span className="text-[10px] font-bold uppercase text-slate-400">Avg Route Compliance</span>
          <div className="text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400 mt-1">
            95.5%
          </div>
          <p className="text-[10px] text-slate-500 mt-1">Planned vs actual arrival accuracy</p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-xs">
          <span className="text-[10px] font-bold uppercase text-slate-400">Total Hours Saved (30 Days)</span>
          <div className="text-2xl font-black font-mono text-amber-600 dark:text-amber-400 mt-1">
            142.5 hrs
          </div>
          <p className="text-[10px] text-slate-500 mt-1">Saved via TSP optimization engine</p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-xs">
          <span className="text-[10px] font-bold uppercase text-slate-400">Total Fuel Cost Saved</span>
          <div className="text-2xl font-black font-mono text-teal-600 dark:text-teal-400 mt-1">
            ৳ 28,450
          </div>
          <p className="text-[10px] text-slate-500 mt-1">Direct savings on Octane fuel</p>
        </div>
      </div>

      {/* History Log Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-4 shadow-xs">
        <h3 className="font-extrabold text-xs uppercase tracking-wider text-slate-900 dark:text-slate-100 flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
          <History className="w-4 h-4 text-amber-500" />
          Past Route Logs
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase text-[10px] font-bold">
                <th className="py-2.5 px-3">Date</th>
                <th className="py-2.5 px-3">Technician</th>
                <th className="py-2.5 px-3">Stops</th>
                <th className="py-2.5 px-3">Planned vs Actual Dist</th>
                <th className="py-2.5 px-3">Planned vs Actual Time</th>
                <th className="py-2.5 px-3">Compliance</th>
                <th className="py-2.5 px-3 text-right">Fuel Saved (BDT)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {historyLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                  <td className="py-3 px-3 font-mono font-bold text-slate-900 dark:text-slate-100">
                    {log.date}
                  </td>
                  <td className="py-3 px-3 font-bold text-slate-800 dark:text-slate-200">
                    {log.techName}
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-700 dark:text-slate-300">
                    {log.stopsCount} stops
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-600 dark:text-slate-400">
                    {log.plannedKm}km → <strong className="text-slate-900 dark:text-slate-100">{log.actualKm}km</strong>
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-600 dark:text-slate-400">
                    {log.plannedMins}m → <strong className="text-amber-600 dark:text-amber-400">{log.actualMins}m</strong>
                  </td>
                  <td className="py-3 px-3 font-mono">
                    <span className="bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 px-2 py-0.5 rounded-full font-bold">
                      {log.compliance}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right font-mono font-extrabold text-emerald-600 dark:text-emerald-400">
                    ৳ {log.savingsBDT}
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
