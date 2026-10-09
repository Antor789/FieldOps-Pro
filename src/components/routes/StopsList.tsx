import React from 'react';
import { RouteStop } from '../../types/routes';
import {
  GripVertical,
  MapPin,
  Clock,
  ArrowDown,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  ChevronUp,
  ChevronDown,
} from 'lucide-react';

interface StopsListProps {
  stops: RouteStop[];
  onReorderStops: (newStops: RouteStop[]) => void;
  onRemoveStop: (stopId: string) => void;
  onSelectStop?: (stop: RouteStop) => void;
  selectedStopId?: string | null;
}

export const StopsList: React.FC<StopsListProps> = ({
  stops,
  onReorderStops,
  onRemoveStop,
  onSelectStop,
  selectedStopId,
}) => {
  const moveStop = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= stops.length) return;

    const newStops = [...stops];
    const temp = newStops[index];
    newStops[index] = newStops[targetIndex];
    newStops[targetIndex] = temp;

    // Re-index orders
    const reindexed = newStops.map((s, idx) => ({ ...s, order: idx + 1 }));
    onReorderStops(reindexed);
  };

  return (
    <div className="space-y-3">
      {stops.map((stop, idx) => {
        const isSelected = selectedStopId === stop.id;

        return (
          <div key={stop.id} className="space-y-1.5">
            {/* Travel leg separator */}
            {idx > 0 && (
              <div className="flex items-center justify-center space-x-2 text-[10px] font-mono text-slate-400 py-1 border-l-2 border-dashed border-amber-500/40 ml-6 pl-4">
                <ArrowDown className="w-3 h-3 text-amber-500" />
                <span>
                  ↓ {stop.distanceFromPrev} km / {stop.timeFromPrev} mins
                </span>
                {stop.isTrafficHotspot && (
                  <span className="bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300 font-bold px-1.5 rounded">
                    Traffic Peak
                  </span>
                )}
              </div>
            )}

            {/* Stop Item Card */}
            <div
              onClick={() => onSelectStop && onSelectStop(stop)}
              className={`p-3.5 rounded-2xl border transition cursor-pointer flex items-center justify-between gap-3 ${
                isSelected
                  ? 'bg-amber-50/80 dark:bg-amber-950/40 border-amber-500 ring-2 ring-amber-500/20 shadow-sm'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-amber-300'
              }`}
            >
              <div className="flex items-center space-x-3 min-w-0">
                <div className="flex flex-col items-center justify-center shrink-0">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      moveStop(idx, 'up');
                    }}
                    disabled={idx === 0}
                    className="p-0.5 text-slate-400 hover:text-amber-500 disabled:opacity-20"
                  >
                    <ChevronUp className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 font-extrabold text-xs flex items-center justify-center shadow-xs">
                    {stop.order}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      moveStop(idx, 'down');
                    }}
                    disabled={idx === stops.length - 1}
                    className="p-0.5 text-slate-400 hover:text-amber-500 disabled:opacity-20"
                  >
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-extrabold text-xs text-slate-900 dark:text-slate-100 truncate">
                      {stop.customerName}
                    </span>
                    <span className="text-[10px] font-mono bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-slate-600 dark:text-slate-400">
                      {stop.workOrderId}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                    <MapPin className="w-3 h-3 inline mr-1 text-amber-500" />
                    {stop.address}
                  </p>

                  <div className="flex items-center space-x-3 text-[10px] font-mono mt-1">
                    <span className="text-amber-700 dark:text-amber-400 font-bold flex items-center gap-1">
                      <Clock className="w-3 h-3" /> ETA: {stop.estimatedArrival}
                    </span>
                    <span className="text-slate-400">
                      Duration: {stop.estimatedDuration}m
                    </span>
                  </div>
                </div>
              </div>

              {/* Delete Stop */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemoveStop(stop.id);
                }}
                className="p-1.5 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition shrink-0"
                title="Remove Stop from Route"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};
