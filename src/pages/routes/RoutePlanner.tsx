import React, { useState } from 'react';
import { useRoutes } from '../../hooks/useRoutes';
import { useRouteOptimizer } from '../../hooks/useRouteOptimizer';
import { RouteMap } from '../../components/routes/RouteMap';
import { StopsList } from '../../components/routes/StopsList';
import { RouteStats } from '../../components/routes/RouteStats';
import { OptimizeButton } from '../../components/routes/OptimizeButton';
import { DhakaTrafficLayer } from '../../components/routes/DhakaTrafficLayer';
import { RouteSMSModal } from '../../components/routes/RouteSMSModal';
import { RouteStop } from '../../types/routes';
import {
  MapPin,
  Navigation,
  Sparkles,
  Share2,
  Calendar,
  User,
  Zap,
  CheckCircle2,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import { Button } from '../../components/ui/Button';

export const RoutePlanner: React.FC = () => {
  const { routes, selectedRoute, selectRoute, updateRouteStops, saveOptimizedRoute } = useRoutes();
  const { isOptimizing, optimizeRoute } = useRouteOptimizer();

  const [selectedStopId, setSelectedStopId] = useState<string | null>(null);
  const [isSmsModalOpen, setIsSmsModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleRunOptimization = async () => {
    const result = await optimizeRoute(
      selectedRoute.stops,
      selectedRoute.startLocation,
      selectedRoute.endLocation
    );

    saveOptimizedRoute(
      selectedRoute.id,
      result.stops,
      result.savings,
      result.totalDistanceKm,
      result.totalTimeMins
    );

    setToastMessage(`🎉 Optimized! Saved ${result.savings.timeSavedMins} mins & ৳${result.savings.fuelCostSavedBDT} fuel.`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleReorderStops = (newStops: RouteStop[]) => {
    updateRouteStops(selectedRoute.id, newStops);
  };

  const handleRemoveStop = (stopId: string) => {
    const updated = selectedRoute.stops
      .filter((s) => s.id !== stopId)
      .map((s, idx) => ({ ...s, order: idx + 1 }));
    updateRouteStops(selectedRoute.id, updated);
  };

  return (
    <div className="space-y-6 pb-12 animate-fadeIn">
      {/* Page Header */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-xl border border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping" />
            <h1 className="text-xl font-extrabold text-white">Dhaka Route Optimizer & Multi-Stop TSP</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time traffic-adjusted turn-by-turn routing for field technicians across Dhaka
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setIsSmsModalOpen(true)}
            className="bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700 font-bold"
          >
            <Share2 className="w-4 h-4 mr-1.5" /> Send Route via SMS
          </Button>

          <Button
            size="sm"
            variant="primary"
            onClick={handleRunOptimization}
            disabled={isOptimizing}
            className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold"
          >
            <Sparkles className="w-4 h-4 mr-1.5" /> Auto-Optimize Route
          </Button>
        </div>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 p-4 rounded-2xl text-xs font-bold flex items-center space-x-2 shadow-lg animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main 2-Column Route Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT CONTROL PANEL (4 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Technician Selector & Summary */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 space-y-4 shadow-xs">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
              <label className="text-xs font-extrabold uppercase text-slate-500 flex items-center gap-1.5">
                <User className="w-4 h-4 text-amber-500" /> Select Technician Route
              </label>
              <span className="text-[10px] font-mono font-bold bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-600 dark:text-slate-400">
                {selectedRoute.date}
              </span>
            </div>

            <select
              value={selectedRoute.id}
              onChange={(e) => selectRoute(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-2xl px-3 py-2 text-xs font-bold text-slate-900 dark:text-slate-100"
            >
              {routes.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.technicianName} ({r.stops.length} Jobs - {r.totalDistanceKm} km)
                </option>
              ))}
            </select>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-3 gap-2 text-center text-xs bg-slate-50 dark:bg-slate-800/50 p-3 rounded-2xl border border-slate-200/80 dark:border-slate-800">
              <div>
                <span className="text-[9px] text-slate-400 uppercase font-bold block">Jobs Today</span>
                <span className="font-mono font-extrabold text-slate-900 dark:text-slate-100">
                  {selectedRoute.stops.length}
                </span>
              </div>
              <div>
                <span className="text-[9px] text-slate-400 uppercase font-bold block">Total Distance</span>
                <span className="font-mono font-extrabold text-slate-900 dark:text-slate-100">
                  {selectedRoute.totalDistanceKm} km
                </span>
              </div>
              <div>
                <span className="text-[9px] text-slate-400 uppercase font-bold block">Est. Time</span>
                <span className="font-mono font-extrabold text-amber-600 dark:text-amber-400">
                  {Math.floor(selectedRoute.totalTimeMins / 60)}h {selectedRoute.totalTimeMins % 60}m
                </span>
              </div>
            </div>
          </div>

          {/* Reorderable Stops List */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 space-y-4 shadow-xs">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-extrabold text-xs uppercase tracking-wider text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-amber-500" />
                Sequence of Stops ({selectedRoute.stops.length})
              </h3>
              <span className="text-[10px] text-slate-400 font-mono">Drag or use ↑↓</span>
            </div>

            <StopsList
              stops={selectedRoute.stops}
              onReorderStops={handleReorderStops}
              onRemoveStop={handleRemoveStop}
              onSelectStop={(s) => setSelectedStopId(s.id)}
              selectedStopId={selectedStopId}
            />

            {/* Optimize Trigger */}
            <OptimizeButton
              isOptimizing={isOptimizing}
              onOptimize={handleRunOptimization}
              isAlreadyOptimized={selectedRoute.isOptimized}
            />
          </div>

          {/* Performance & Fuel Stats */}
          <RouteStats
            totalDistanceKm={selectedRoute.totalDistanceKm}
            totalTimeMins={selectedRoute.totalTimeMins}
            stopsCount={selectedRoute.stops.length}
            savings={selectedRoute.optimizationSavings}
            trafficMultiplier={selectedRoute.trafficMultiplier}
          />

          {/* Dhaka Traffic & Congestion Info */}
          <DhakaTrafficLayer />
        </div>

        {/* RIGHT FULL LEAFLET MAP PANEL (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 shadow-xs">
            <div className="flex justify-between items-center mb-3">
              <div>
                <h3 className="font-extrabold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <Navigation className="w-4 h-4 text-amber-500" />
                  Dhaka Live Turn-by-Turn GPS Map
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {selectedRoute.technicianName} • Starting from {selectedRoute.startLocation.name}
                </p>
              </div>

              <Button
                size="xs"
                variant="outline"
                onClick={() => setIsSmsModalOpen(true)}
                className="font-bold text-xs"
              >
                <Share2 className="w-3.5 h-3.5 mr-1" /> Share SMS Link
              </Button>
            </div>

            <RouteMap
              route={selectedRoute}
              selectedStopId={selectedStopId}
              onSelectStop={(stop) => setSelectedStopId(stop.id)}
              className="w-full h-[680px]"
            />
          </div>
        </div>
      </div>

      {/* Share SMS Modal */}
      <RouteSMSModal
        route={selectedRoute}
        isOpen={isSmsModalOpen}
        onClose={() => setIsSmsModalOpen(false)}
        onSendSms={(phone, text) => {
          alert(`Greenweb SMS dispatched to ${phone}: ${text.slice(0, 40)}...`);
        }}
        onSendWhatsapp={(text) => {
          const encoded = encodeURIComponent(text);
          window.open(`https://wa.me/?text=${encoded}`, '_blank');
        }}
      />
    </div>
  );
};
