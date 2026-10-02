import React, { useState, useEffect, useRef } from 'react';
import { Technician, WorkOrder, Site } from '../../types/fsm';
import { Language, formatBDT } from '../../lib/i18n';
import { Shield, Navigation, ZoomIn, ZoomOut, Compass, MapPin } from 'lucide-react';

interface LiveMapDispatcherProps {
  technicians: Technician[];
  workOrders: WorkOrder[];
  sites: Site[];
  selectedTechId?: string | null;
  selectedWorkOrderId?: string | null;
  onSelectTechnician: (tech: Technician | null) => void;
  onSelectWorkOrder: (wo: WorkOrder | null) => void;
  onAssignTechToWorkOrder: (woId: string, techId: string, techName: string) => void;
  className?: string;
  mapTheme?: 'light' | 'dark';
  lang?: Language;
}

export const LiveMapDispatcher: React.FC<LiveMapDispatcherProps> = ({
  technicians,
  workOrders,
  sites,
  selectedTechId,
  selectedWorkOrderId,
  onSelectTechnician,
  onSelectWorkOrder,
  onAssignTechToWorkOrder,
  className = 'w-full h-full',
  mapTheme = 'light',
  lang = 'en',
}) => {
  const [showGeofences, setShowGeofences] = useState(true);
  const [showRoutes, setShowRoutes] = useState(true);
  const [mapZoom] = useState(13);

  // Default Map Focus: Dhaka, Bangladesh (Gulshan / Banani / Dhanmondi center)
  const [mapCenter] = useState<{ lat: number; lng: number }>({
    lat: 23.7805,
    lng: 90.4100,
  });

  const leafletContainerRef = useRef<HTMLDivElement | null>(null);
  const leafletMapRef = useRef<any>(null);

  // Initialize Leaflet Map focused on Dhaka
  useEffect(() => {
    let isMounted = true;

    async function initLeaflet() {
      if (!leafletContainerRef.current) return;
      try {
        const L = (await import('leaflet')).default;

        if (!document.getElementById('leaflet-css-link')) {
          const link = document.createElement('link');
          link.id = 'leaflet-css-link';
          link.rel = 'stylesheet';
          link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
          document.head.appendChild(link);
        }

        if (!leafletMapRef.current && isMounted) {
          const map = L.map(leafletContainerRef.current, {
            center: [mapCenter.lat, mapCenter.lng],
            zoom: mapZoom,
            zoomControl: false,
          });

          // CartoDB Positron Light / Dark Matter tile layer
          const tileUrl = mapTheme === 'dark'
            ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
            : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';

          L.tileLayer(tileUrl, {
            attribution: '&copy; OpenStreetMap &copy; CARTO (Dhaka, Bangladesh)',
            subdomains: 'abcd',
            maxZoom: 19,
          }).addTo(map);

          leafletMapRef.current = map;
        }
      } catch (err) {
        console.warn('Leaflet map load warning:', err);
      }
    }

    initLeaflet();

    return () => {
      isMounted = false;
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }
    };
  }, []);

  // Smooth Fly/Pan when a selected Tech or Work Order changes
  useEffect(() => {
    if (!leafletMapRef.current) return;
    const map = leafletMapRef.current;

    if (selectedTechId) {
      const tech = technicians.find((t) => t.id === selectedTechId);
      if (tech) {
        map.flyTo([tech.locationPoint.latitude, tech.locationPoint.longitude], 15, {
          animate: true,
          duration: 1.2,
        });
      }
    } else if (selectedWorkOrderId) {
      const wo = workOrders.find((w) => w.id === selectedWorkOrderId);
      if (wo) {
        map.flyTo([wo.locationPoint.latitude, wo.locationPoint.longitude], 15, {
          animate: true,
          duration: 1.2,
        });
      }
    }
  }, [selectedTechId, selectedWorkOrderId, technicians, workOrders]);

  // Update Leaflet Markers, Geofences, and Route Polylines in Dhaka
  useEffect(() => {
    if (!leafletMapRef.current) return;
    const map = leafletMapRef.current;

    // Clear previous vector layers
    map.eachLayer((layer: any) => {
      if (!layer._url) {
        map.removeLayer(layer);
      }
    });

    import('leaflet').then(({ default: L }) => {
      // 1. Draw Dhaka Site Geofence Circles
      if (showGeofences) {
        sites.forEach((site) => {
          L.circle([site.locationPoint.latitude, site.locationPoint.longitude], {
            color: '#10b981',
            fillColor: '#10b981',
            fillOpacity: 0.1,
            radius: site.geofenceRadiusMeters,
            weight: 1.5,
            dashArray: '4, 4',
          }).addTo(map);
        });
      }

      // 2. Draw Work Order Markers
      workOrders.forEach((wo) => {
        const isSelected = wo.id === selectedWorkOrderId;
        const isEmergency = wo.priority === 'EMERGENCY' || wo.priority === 'CRITICAL';
        const color = isEmergency ? '#ef4444' : wo.priority === 'HIGH' ? '#f59e0b' : '#4f46e5';

        const customIcon = L.divIcon({
          className: 'custom-wo-icon',
          html: `
            <div style="position: relative; display: flex; align-items: center; justify-content: center;">
              ${
                isEmergency
                  ? `<div style="position: absolute; inset: -6px; border-radius: 50%; border: 2px solid #ef4444; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite; opacity: 0.75;"></div>`
                  : ''
              }
              <div style="
                background: ${color};
                width: ${isSelected ? '32px' : '24px'};
                height: ${isSelected ? '32px' : '24px'};
                border-radius: 50%;
                border: 2px solid #ffffff;
                box-shadow: 0 2px 10px rgba(0,0,0,0.25);
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-weight: 800;
                font-size: ${isSelected ? '11px' : '9px'};
                font-family: monospace;
                cursor: pointer;
                transition: all 0.2s;
              ">
                ${isEmergency ? '🚨' : '৳'}
              </div>
            </div>
          `,
          iconSize: [32, 32],
          iconAnchor: [16, 16],
        });

        const marker = L.marker([wo.locationPoint.latitude, wo.locationPoint.longitude], {
          icon: customIcon,
        }).addTo(map);

        marker.on('click', () => {
          onSelectWorkOrder(wo);
        });
      });

      // 3. Draw Technician Live Markers & Polyline Routes in Dhaka
      technicians.forEach((tech) => {
        const isSelected = tech.id === selectedTechId;
        const statusColor =
          tech.dutyStatus === 'ONLINE'
            ? '#10b981'
            : tech.dutyStatus === 'BUSY'
            ? '#0284c7'
            : tech.dutyStatus === 'ON_BREAK'
            ? '#f59e0b'
            : '#64748b';

        const customIcon = L.divIcon({
          className: 'custom-tech-icon',
          html: `
            <div style="position: relative; display: flex; align-items: center; justify-content: center;">
              <div style="position: absolute; inset: -4px; border-radius: 50%; border: 1.5px solid ${statusColor}; animation: pulse 2s infinite; opacity: 0.6;"></div>
              <div style="
                background: #0f172a;
                width: ${isSelected ? '36px' : '28px'};
                height: ${isSelected ? '36px' : '28px'};
                border-radius: 50%;
                border: 3px solid ${statusColor};
                box-shadow: 0 2px 12px rgba(0,0,0,0.3);
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-size: ${isSelected ? '12px' : '10px'};
                font-weight: 800;
                font-family: monospace;
                cursor: pointer;
                transition: all 0.2s;
              ">
                ${tech.firstName[0]}${tech.lastName[0]}
              </div>
            </div>
          `,
          iconSize: [36, 36],
          iconAnchor: [18, 18],
        });

        const marker = L.marker([tech.locationPoint.latitude, tech.locationPoint.longitude], {
          icon: customIcon,
        }).addTo(map);

        marker.on('click', () => {
          onSelectTechnician(tech);
        });

        // Glowing Route Polyline to assigned job in Dhaka
        if (showRoutes) {
          const assignedWo = workOrders.find((w) => w.assignedTechnicianId === tech.id && w.status !== 'COMPLETED');
          if (assignedWo) {
            L.polyline(
              [
                [tech.locationPoint.latitude, tech.locationPoint.longitude],
                [assignedWo.locationPoint.latitude, assignedWo.locationPoint.longitude],
              ],
              {
                color: statusColor,
                weight: 3,
                dashArray: '6, 6',
                opacity: 0.85,
              }
            ).addTo(map);
          }
        }
      });
    });
  }, [technicians, workOrders, sites, selectedTechId, selectedWorkOrderId, showGeofences, showRoutes, onSelectWorkOrder, onSelectTechnician]);

  const handleZoomIn = () => {
    if (leafletMapRef.current) {
      leafletMapRef.current.zoomIn();
    }
  };

  const handleZoomOut = () => {
    if (leafletMapRef.current) {
      leafletMapRef.current.zoomOut();
    }
  };

  const handleResetCenter = () => {
    if (leafletMapRef.current) {
      leafletMapRef.current.flyTo([mapCenter.lat, mapCenter.lng], 13, { animate: true });
    }
  };

  return (
    <div className={`relative ${className} overflow-hidden font-sans`}>
      {/* Leaflet Map DOM Node */}
      <div ref={leafletContainerRef} className="w-full h-full bg-slate-100 z-0" />

      {/* Floating Map Controls Dock (Top Right) */}
      <div className="absolute top-4 right-4 z-20 flex flex-col space-y-2 font-mono text-xs">
        <div className="bg-white/90 backdrop-blur-md p-1.5 rounded-2xl border border-slate-200 shadow-xl flex flex-col space-y-1">
          <button
            onClick={handleZoomIn}
            className="p-2 text-slate-700 hover:text-indigo-600 hover:bg-slate-100 rounded-xl transition flex items-center justify-center"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={handleZoomOut}
            className="p-2 text-slate-700 hover:text-indigo-600 hover:bg-slate-100 rounded-xl transition flex items-center justify-center"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={handleResetCenter}
            className="p-2 text-slate-700 hover:text-indigo-600 hover:bg-slate-100 rounded-xl transition flex items-center justify-center"
            title="Focus Dhaka, Bangladesh"
          >
            <Compass className="w-4 h-4 text-emerald-600" />
          </button>
        </div>

        <div className="bg-white/90 backdrop-blur-md p-2 rounded-2xl border border-slate-200 shadow-xl flex flex-col space-y-1.5">
          <button
            onClick={() => setShowGeofences(!showGeofences)}
            className={`p-2 rounded-xl transition text-[11px] font-bold flex items-center space-x-1.5 ${
              showGeofences ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'text-slate-500 hover:text-slate-800'
            }`}
            title="Toggle Site Geofences"
          >
            <Shield className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Geofences</span>
          </button>

          <button
            onClick={() => setShowRoutes(!showRoutes)}
            className={`p-2 rounded-xl transition text-[11px] font-bold flex items-center space-x-1.5 ${
              showRoutes ? 'bg-indigo-50 text-indigo-800 border border-indigo-200' : 'text-slate-500 hover:text-slate-800'
            }`}
            title="Toggle Active Route Polylines"
          >
            <Navigation className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Routes</span>
          </button>
        </div>
      </div>
    </div>
  );
};
