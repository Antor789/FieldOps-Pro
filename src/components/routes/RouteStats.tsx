import React from 'react';
import { OptimizationSavings } from '../../types/routes';
import { Route, Zap, Clock, ShieldCheck, DollarSign, Leaf, Sparkles } from 'lucide-react';

interface RouteStatsProps {
  totalDistanceKm: number;
  totalTimeMins: number;
  stopsCount: number;
  savings?: OptimizationSavings | null;
  trafficMultiplier?: number;
}

export const RouteStats: React.FC<RouteStatsProps> = ({
  totalDistanceKm,
  totalTimeMins,
  stopsCount,
  savings,
  trafficMultiplier = 1.8,
}) => {
  const hours = Math.floor(totalTimeMins / 60);
  const mins = totalTimeMins % 60;

  // Estimated fuel cost at ৳125/L octane (12 km/L average bike/van efficiency)
  const fuelLiter = totalDistanceKm / 12;
  const estimatedFuelBDT = Math.round(fuelLiter * 125);

  return (
    <div className="bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 space-y-4 shadow-xs">
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
        <h4 className="font-extrabold text-xs uppercase tracking-wider text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Route className="w-4 h-4 text-amber-500" />
          Route Performance & Dhaka Traffic Metrics
        </h4>
        <span className="text-[10px] font-mono font-bold bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300 px-2 py-0.5 rounded-full">
          {trafficMultiplier}x Traffic Mult
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 text-xs">
        <div className="p-3 bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800">
          <span className="text-[10px] text-slate-400 font-bold uppercase block">Total Distance</span>
          <span className="text-base font-black font-mono text-slate-900 dark:text-slate-100">
            {totalDistanceKm} <span className="text-xs font-normal text-slate-400">km</span>
          </span>
        </div>

        <div className="p-3 bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800">
          <span className="text-[10px] text-slate-400 font-bold uppercase block">Est. Total Duration</span>
          <span className="text-base font-black font-mono text-amber-600 dark:text-amber-400">
            {hours > 0 ? `${hours}h ` : ''}{mins}m
          </span>
        </div>

        <div className="p-3 bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800">
          <span className="text-[10px] text-slate-400 font-bold uppercase block">Fuel Cost (Octane)</span>
          <span className="text-base font-black font-mono text-emerald-600 dark:text-emerald-400">
            ৳ {estimatedFuelBDT}
          </span>
        </div>

        <div className="p-3 bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800">
          <span className="text-[10px] text-slate-400 font-bold uppercase block">Total Stops</span>
          <span className="text-base font-black font-mono text-slate-900 dark:text-slate-100">
            {stopsCount} <span className="text-xs font-normal text-slate-400">jobs</span>
          </span>
        </div>
      </div>

      {/* Savings Highlight Box if available */}
      {savings && savings.timeSavedMins > 0 && (
        <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 rounded-2xl space-y-1.5 text-xs">
          <div className="font-extrabold text-emerald-900 dark:text-emerald-200 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            Optimization Savings Achieved
          </div>
          <div className="grid grid-cols-3 text-[11px] font-mono text-emerald-800 dark:text-emerald-300">
            <div>⏱ {savings.timeSavedMins}m saved</div>
            <div>🛣 {savings.distanceSavedKm}km saved</div>
            <div>💰 ৳{savings.fuelCostSavedBDT} saved</div>
          </div>
        </div>
      )}
    </div>
  );
};
