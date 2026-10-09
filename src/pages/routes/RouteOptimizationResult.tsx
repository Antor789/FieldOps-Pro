import React from 'react';
import { useRoutes } from '../../hooks/useRoutes';
import { Sparkles, ArrowRight, CheckCircle2, Clock, MapPin, DollarSign, Leaf, ShieldCheck, XCircle } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export const RouteOptimizationResult: React.FC = () => {
  const { selectedRoute } = useRoutes();

  const savings = selectedRoute.optimizationSavings || {
    distanceSavedKm: 8.2,
    timeSavedMins: 45,
    fuelCostSavedBDT: 85,
    co2SavedKg: 1.6,
    originalDistanceKm: 46.6,
    originalTimeMins: 310,
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12 animate-fadeIn">
      {/* Top Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-xl border border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <h1 className="text-xl font-extrabold text-white">TSP Route Optimization Results</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Before vs. After Comparison for {selectedRoute.technicianName} ({selectedRoute.date})
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            size="sm"
            variant="primary"
            onClick={() => alert('Optimized sequence accepted & applied to active dispatch!')}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
          >
            <CheckCircle2 className="w-4 h-4 mr-1.5" /> Accept Optimized Roster
          </Button>
        </div>
      </div>

      {/* KPI Comparison Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-xs space-y-1">
          <div className="text-[10px] font-bold uppercase text-slate-400">Travel Time Saved</div>
          <div className="text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400">
            {savings.timeSavedMins} mins
          </div>
          <p className="text-[10px] text-slate-500">
            {savings.originalTimeMins}m → {selectedRoute.totalTimeMins}m
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-xs space-y-1">
          <div className="text-[10px] font-bold uppercase text-slate-400">Distance Saved</div>
          <div className="text-2xl font-black font-mono text-blue-600 dark:text-blue-400">
            {savings.distanceSavedKm} km
          </div>
          <p className="text-[10px] text-slate-500">
            {savings.originalDistanceKm}km → {selectedRoute.totalDistanceKm}km
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-xs space-y-1">
          <div className="text-[10px] font-bold uppercase text-slate-400">Octane Fuel Saved</div>
          <div className="text-2xl font-black font-mono text-amber-600 dark:text-amber-400">
            ৳ {savings.fuelCostSavedBDT}
          </div>
          <p className="text-[10px] text-slate-500">At ৳125/L octane rate</p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-xs space-y-1">
          <div className="text-[10px] font-bold uppercase text-slate-400">Carbon Offset</div>
          <div className="text-2xl font-black font-mono text-teal-600 dark:text-teal-400">
            {savings.co2SavedKg} kg CO₂
          </div>
          <p className="text-[10px] text-slate-500">Green field operations</p>
        </div>
      </div>

      {/* Sequence Comparison Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-4 shadow-xs">
        <h3 className="font-extrabold text-xs uppercase tracking-wider text-slate-900 dark:text-slate-100 flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
          <Sparkles className="w-4 h-4 text-amber-500" />
          Optimized Turn-by-Turn Stop Sequence
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase text-[10px] font-bold">
                <th className="py-2.5 px-3">Order</th>
                <th className="py-2.5 px-3">Work Order & Client</th>
                <th className="py-2.5 px-3">Dhaka Area</th>
                <th className="py-2.5 px-3">Travel Leg</th>
                <th className="py-2.5 px-3">Optimized ETA</th>
                <th className="py-2.5 px-3">Priority</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {selectedRoute.stops.map((stop) => (
                <tr key={stop.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                  <td className="py-3 px-3 font-mono font-extrabold text-amber-600 dark:text-amber-400">
                    #{stop.order}
                  </td>
                  <td className="py-3 px-3">
                    <div className="font-bold text-slate-900 dark:text-slate-100">{stop.customerName}</div>
                    <div className="text-[10px] text-slate-500 font-mono">{stop.workOrderId}</div>
                  </td>
                  <td className="py-3 px-3 text-slate-700 dark:text-slate-300">
                    {stop.areaName}
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-600 dark:text-slate-400">
                    {stop.distanceFromPrev} km / {stop.timeFromPrev} mins
                  </td>
                  <td className="py-3 px-3 font-mono font-bold text-amber-700 dark:text-amber-400">
                    {stop.estimatedArrival}
                  </td>
                  <td className="py-3 px-3">
                    <span className="text-[10px] font-extrabold bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                      {stop.priority || 'MEDIUM'}
                    </span>
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
