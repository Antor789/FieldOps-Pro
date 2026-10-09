import React from 'react';
import { Route } from '../../types/routes';
import {
  Navigation,
  CheckCircle2,
  Clock,
  Sparkles,
  MapPin,
  ChevronRight,
  Phone,
  Bike,
  Truck,
} from 'lucide-react';
import { Button } from '../ui/Button';

interface TechnicianRouteCardProps {
  route: Route;
  isSelected?: boolean;
  onSelect: () => void;
}

export const TechnicianRouteCard: React.FC<TechnicianRouteCardProps> = ({
  route,
  isSelected = false,
  onSelect,
}) => {
  const hours = Math.floor(route.totalTimeMins / 60);
  const mins = route.totalTimeMins % 60;

  return (
    <div
      onClick={onSelect}
      className={`p-4 rounded-3xl border transition cursor-pointer space-y-3 ${
        isSelected
          ? 'bg-amber-50/70 dark:bg-amber-950/30 border-amber-500 ring-2 ring-amber-500/20 shadow-md'
          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-amber-300 shadow-xs'
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-slate-900 text-white font-black text-sm flex items-center justify-center">
            {route.technicianAvatar || route.technicianName[0]}
          </div>
          <div>
            <h4 className="font-extrabold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
              {route.technicianName}
              {route.vehicleType === 'VAN' ? (
                <Truck className="w-3.5 h-3.5 text-slate-400" />
              ) : (
                <Bike className="w-3.5 h-3.5 text-amber-500" />
              )}
            </h4>
            <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
              {route.technicianPhone}
            </span>
          </div>
        </div>

        <span
          className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border ${
            route.status === 'in_progress'
              ? 'bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border-blue-200'
              : route.status === 'completed'
              ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border-emerald-200'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200'
          }`}
        >
          {route.status}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-2 text-center text-xs bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-2xl border border-slate-200/80 dark:border-slate-800">
        <div>
          <span className="text-[9px] text-slate-400 uppercase font-bold block">Jobs</span>
          <span className="font-mono font-extrabold text-slate-900 dark:text-slate-100">
            {route.stops.length}
          </span>
        </div>
        <div>
          <span className="text-[9px] text-slate-400 uppercase font-bold block">Distance</span>
          <span className="font-mono font-extrabold text-slate-900 dark:text-slate-100">
            {route.totalDistanceKm} km
          </span>
        </div>
        <div>
          <span className="text-[9px] text-slate-400 uppercase font-bold block">Time</span>
          <span className="font-mono font-extrabold text-amber-600 dark:text-amber-400">
            {hours > 0 ? `${hours}h ` : ''}{mins}m
          </span>
        </div>
      </div>

      {route.optimizationSavings && (
        <div className="flex items-center justify-between text-[10px] font-mono text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 p-2 rounded-xl border border-emerald-200 dark:border-emerald-800">
          <span className="flex items-center gap-1 font-bold">
            <Sparkles className="w-3 h-3 text-emerald-600" /> Optimized Path
          </span>
          <span>Saved {route.optimizationSavings.timeSavedMins}m / ৳{route.optimizationSavings.fuelCostSavedBDT}</span>
        </div>
      )}
    </div>
  );
};
