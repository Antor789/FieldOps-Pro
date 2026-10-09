import React, { useEffect, useRef, useState } from 'react';
import { Route, RouteStop } from '../../types/routes';
import { DHAKA_TRAFFIC_ZONES } from '../../utils/dhakaGeography';
import { Map, Layers, Navigation, ZoomIn, ZoomOut, Eye, ShieldAlert } from 'lucide-react';

interface RouteMapProps {
  route: Route;
  selectedStopId?: string | null;
  onSelectStop?: (stop: RouteStop) => void;
  showTrafficOverlay?: boolean;
  className?: string;
}

export const RouteMap: React.FC<RouteMapProps> = ({
  route,
  selectedStopId,
  onSelectStop,
  showTrafficOverlay = true,
  className = 'w-full h-full min-h-[500px]',
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<any>(null);
  const layerGroupRef = useRef<any>(null);

  const [tileLayerType, setTileLayerType] = useState<'streets' | 'satellite'>('streets');
  const [trafficActive, setTrafficActive] = useState(showTrafficOverlay);

  // Initialize Leaflet map
  useEffect(() => {
    let isMounted = true;

    async function initMap() {
      if (!containerRef.current) return;
      try {
        const L = (await import('leaflet')).default;

        if (!document.getElementById('leaflet-css-link')) {
          const link = document.createElement('link');
          link.id = 'leaflet-css-link';
          link.rel = 'stylesheet';
          link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
          document.head.appendChild(link);
        }

        if (mapRef.current) {
          mapRef.current.remove();
          mapRef.current = null;
        }

        // Center on Dhaka Gulshan / Mirpur area
        const map = L.map(containerRef.current, {
          center: [23.7805, 90.41],
          zoom: 12,
          zoomControl: false,
        });

        const streetTile = L.tileLayer(
          'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
          {
            maxZoom: 19,
            attribution: '© OpenStreetMap | FieldOps Pro Dhaka',
          }
        );

        streetTile.addTo(map);
        mapRef.current = map;
        layerGroupRef.current = L.layerGroup().addTo(map);

        renderMapElements(L);
      } catch (err) {
        console.error('Leaflet map initialization error:', err);
      }
    }

    initMap();

    return () => {
      isMounted = false;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [route.id]);

  // Re-render markers & polylines when route or settings change
  useEffect(() => {
    async function updateElements() {
      if (!mapRef.current) return;
      const L = (await import('leaflet')).default;
      renderMapElements(L);
    }
    updateElements();
  }, [route, selectedStopId, tileLayerType, trafficActive]);

  const renderMapElements = (L: any) => {
    if (!mapRef.current || !layerGroupRef.current) return;
    const layerGroup = layerGroupRef.current;
    layerGroup.clearLayers();

    // Tile switcher
    if (tileLayerType === 'satellite') {
      L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        { attribution: 'Tiles © Esri' }
      ).addTo(layerGroup);
    }

    // Traffic congestion hotspots overlay
    if (trafficActive) {
      DHAKA_TRAFFIC_ZONES.forEach((tz) => {
        const circle = L.circle([tz.center.lat, tz.center.lng], {
          color: tz.congestionLevel === 'CRITICAL' ? '#ef4444' : '#f59e0b',
          fillColor: tz.congestionLevel === 'CRITICAL' ? '#ef4444' : '#f59e0b',
          fillOpacity: 0.2,
          radius: tz.radiusMeters,
        });
        circle.bindTooltip(`🚦 ${tz.name}: ${tz.reason}`, { permanent: false });
        circle.addTo(layerGroup);
      });
    }

    // Coordinates array for Polyline
    const points: [number, number][] = [];

    // Start Depot Marker
    if (route.startLocation) {
      points.push([route.startLocation.lat, route.startLocation.lng]);
      const depotIcon = L.divIcon({
        className: 'custom-depot-marker',
        html: `<div style="background:#0f172a; color:#f59e0b; border:2px solid #f59e0b; font-weight:900; font-size:10px; border-radius:12px; padding:3px 8px; box-shadow:0 4px 6px rgba(0,0,0,0.3);">📍 START: ${route.startLocation.name.split(' ')[0]}</div>`,
        iconSize: [120, 24],
      });
      L.marker([route.startLocation.lat, route.startLocation.lng], { icon: depotIcon }).addTo(
        layerGroup
      );
    }

    // Stop Markers
    route.stops.forEach((stop) => {
      points.push([stop.lat, stop.lng]);

      const isSelected = selectedStopId === stop.id;
      const markerColor =
        stop.status === 'completed'
          ? '#10b981'
          : stop.status === 'en_route'
          ? '#3b82f6'
          : '#f59e0b';

      const stopIcon = L.divIcon({
        className: 'custom-stop-marker',
        html: `
          <div style="background:${markerColor}; color:#090d16; font-weight:900; font-size:12px; border-radius:50%; width:28px; height:28px; display:flex; align-items:center; justify-content:center; border:2px solid #ffffff; box-shadow:0 4px 8px rgba(0,0,0,0.4); ${
            isSelected ? 'transform:scale(1.25); outline:3px solid #f59e0b;' : ''
          }">
            ${stop.order}
          </div>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      });

      const marker = L.marker([stop.lat, stop.lng], { icon: stopIcon }).addTo(layerGroup);

      marker.bindPopup(`
        <div style="font-family:sans-serif; font-size:12px; padding:4px;">
          <strong style="color:#0f172a; display:block;">#${stop.order} ${stop.customerName}</strong>
          <span style="color:#64748b; font-size:11px;">WO: ${stop.workOrderId} • ${stop.areaName}</span><br/>
          <span style="color:#d97706; font-weight:bold; font-size:11px;">ETA: ${stop.estimatedArrival}</span>
        </div>
      `);

      if (onSelectStop) {
        marker.on('click', () => onSelectStop(stop));
      }
    });

    // End Location Marker
    if (route.endLocation) {
      points.push([route.endLocation.lat, route.endLocation.lng]);
    }

    // Draw Polyline route path
    if (points.length >= 2) {
      const polyline = L.polyline(points, {
        color: '#f59e0b',
        weight: 4,
        opacity: 0.85,
        dashArray: '8, 6',
      }).addTo(layerGroup);

      mapRef.current.fitBounds(polyline.getBounds(), { padding: [40, 40] });
    }
  };

  return (
    <div className={`relative rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xl ${className}`}>
      {/* Leaflet map DOM container */}
      <div ref={containerRef} className="w-full h-full min-h-[500px] z-0" />

      {/* Map Control Toolbar */}
      <div className="absolute top-4 right-4 z-10 bg-slate-900/90 text-white backdrop-blur-md p-1.5 rounded-2xl border border-slate-800 flex items-center space-x-1 shadow-lg text-xs font-bold">
        <button
          onClick={() => setTileLayerType(tileLayerType === 'streets' ? 'satellite' : 'streets')}
          className={`px-2.5 py-1 rounded-xl transition flex items-center gap-1 ${
            tileLayerType === 'satellite' ? 'bg-amber-500 text-slate-950' : 'hover:bg-slate-800'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          {tileLayerType === 'satellite' ? 'Satellite' : 'Map'}
        </button>

        <button
          onClick={() => setTrafficActive(!trafficActive)}
          className={`px-2.5 py-1 rounded-xl transition flex items-center gap-1 ${
            trafficActive ? 'bg-red-500/80 text-white' : 'hover:bg-slate-800 text-slate-400'
          }`}
        >
          <ShieldAlert className="w-3.5 h-3.5" /> Traffic
        </button>
      </div>

      {/* Bottom Route Legend */}
      <div className="absolute bottom-4 left-4 z-10 bg-slate-900/90 text-white backdrop-blur-md p-3 rounded-2xl border border-slate-800 shadow-lg text-xs space-y-1">
        <div className="font-extrabold text-amber-400 flex items-center gap-1.5">
          <Navigation className="w-3.5 h-3.5" />
          Dhaka Optimized Polyline ({route.stops.length} Stops)
        </div>
        <div className="flex items-center space-x-3 text-[10px] text-slate-300 font-mono">
          <span className="flex items-center gap-1">🟢 Completed</span>
          <span className="flex items-center gap-1">🔵 En Route</span>
          <span className="flex items-center gap-1">🟠 Pending Stop</span>
        </div>
      </div>
    </div>
  );
};
