import React, { useState } from 'react';
import { useRoutes } from '../../hooks/useRoutes';
import { RouteMap } from '../../components/routes/RouteMap';
import { TechnicianRouteCard } from '../../components/routes/TechnicianRouteCard';
import { RouteSMSModal } from '../../components/routes/RouteSMSModal';
import { Navigation, Users, Sparkles, MapPin, Share2 } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export const DailyDispatch: React.FC = () => {
  const { routes, selectedRoute, selectRoute } = useRoutes();
  const [isSmsModalOpen, setIsSmsModalOpen] = useState(false);

  return (
    <div className="space-y-6 pb-12 animate-fadeIn">
      {/* Page Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-xl border border-slate-800 flex justify-between items-center">
        <div>
          <div className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-amber-500" />
            <h1 className="text-xl font-extrabold text-white">Dhaka Master Fleet Dispatch & Route Roster</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time multi-technician route monitoring & workload balancing across Dhaka Metro
          </p>
        </div>

        <Button
          size="sm"
          variant="primary"
          onClick={() => setIsSmsModalOpen(true)}
          className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold"
        >
          <Share2 className="w-4 h-4 mr-1.5" /> Share Selected Route
        </Button>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Technician Route Cards (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <h3 className="font-extrabold text-xs uppercase tracking-wider text-slate-500 px-1">
            Active Technician Fleet ({routes.length})
          </h3>

          <div className="space-y-3">
            {routes.map((r) => (
              <TechnicianRouteCard
                key={r.id}
                route={r}
                isSelected={r.id === selectedRoute.id}
                onSelect={() => selectRoute(r.id)}
              />
            ))}
          </div>
        </div>

        {/* Right Column: Fleet Route Map (8 cols) */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 shadow-xs">
          <div className="flex justify-between items-center mb-3">
            <div>
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Navigation className="w-4 h-4 text-amber-500" />
                Fleet Map View ({selectedRoute.technicianName})
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {selectedRoute.stops.length} Jobs • {selectedRoute.totalDistanceKm} km Total Distance
              </p>
            </div>
          </div>

          <RouteMap route={selectedRoute} className="w-full h-[650px]" />
        </div>
      </div>

      {/* Share SMS Modal */}
      <RouteSMSModal
        route={selectedRoute}
        isOpen={isSmsModalOpen}
        onClose={() => setIsSmsModalOpen(false)}
        onSendSms={(phone, text) => {
          alert(`Greenweb SMS dispatched to ${phone}`);
        }}
        onSendWhatsapp={(text) => {
          window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
        }}
      />
    </div>
  );
};
