import React from 'react';
import { DHAKA_TRAFFIC_ZONES } from '../../utils/dhakaGeography';
import { ShieldAlert, Clock, AlertTriangle, Radio } from 'lucide-react';

interface DhakaTrafficLayerProps {
  currentHour?: number;
  activeZoneCount?: number;
}

export const DhakaTrafficLayer: React.FC<DhakaTrafficLayerProps> = ({
  currentHour = new Date().getHours(),
  activeZoneCount = DHAKA_TRAFFIC_ZONES.length,
}) => {
  const isPeakHour = (currentHour >= 8 && currentHour <= 10) || (currentHour >= 17 && currentHour <= 20);

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 space-y-3 shadow-xs">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
        <div className="flex items-center space-x-2">
          <ShieldAlert className="w-4 h-4 text-red-500" />
          <h4 className="font-extrabold text-xs uppercase tracking-wider text-slate-900 dark:text-slate-100">
            Dhaka Live Traffic & Congestion Corridors
          </h4>
        </div>
        <span
          className={`text-[10px] font-extrabold font-mono px-2.5 py-0.5 rounded-full border ${
            isPeakHour
              ? 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300 border-red-300 animate-pulse'
              : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-300'
          }`}
        >
          {isPeakHour ? '2.4x PEAK TRAFFIC' : '1.3x MODERATE FLOW'}
        </span>
      </div>

      <p className="text-xs text-slate-500 dark:text-slate-400">
        Traffic speed multipliers automatically applied to route ETAs based on real-time Dhaka gridlock points:
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
        {DHAKA_TRAFFIC_ZONES.map((zone) => (
          <div
            key={zone.id}
            className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-1"
          >
            <div className="flex justify-between items-center font-bold text-slate-900 dark:text-slate-100">
              <span className="truncate">{zone.name}</span>
              <span className="font-mono text-[10px] text-red-600 dark:text-red-400">
                {zone.multiplier}x Delay
              </span>
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 italic">
              "{zone.reason}"
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
