import { useState, useCallback } from 'react';
import { Route, RouteStop } from '../types/routes';
import { INITIAL_ROUTES } from '../data/mockRouteData';

export function useRoutes() {
  const [routes, setRoutes] = useState<Route[]>(INITIAL_ROUTES);
  const [selectedRouteId, setSelectedRouteId] = useState<string>(INITIAL_ROUTES[0].id);

  const selectedRoute = routes.find((r) => r.id === selectedRouteId) || routes[0];

  const selectRoute = useCallback((id: string) => {
    setSelectedRouteId(id);
  }, []);

  const updateRouteStops = useCallback((routeId: string, updatedStops: RouteStop[]) => {
    setRoutes((prev) =>
      prev.map((r) => {
        if (r.id === routeId) {
          return {
            ...r,
            stops: updatedStops,
          };
        }
        return r;
      })
    );
  }, []);

  const saveOptimizedRoute = useCallback(
    (
      routeId: string,
      optimizedStops: RouteStop[],
      savings: any,
      optDistKm: number,
      optTimeMins: number
    ) => {
      setRoutes((prev) =>
        prev.map((r) => {
          if (r.id === routeId) {
            return {
              ...r,
              stops: optimizedStops,
              isOptimized: true,
              totalDistanceKm: optDistKm,
              totalTimeMins: optTimeMins,
              optimizationSavings: savings,
            };
          }
          return r;
        })
      );
    },
    []
  );

  const shareRoute = useCallback(
    async (routeId: string, channel: 'SMS' | 'WHATSAPP' = 'SMS'): Promise<string> => {
      const targetRoute = routes.find((r) => r.id === routeId) || selectedRoute;
      const shareUrl = `https://fieldopspro.bd/r/${routeId.slice(-6)}`;
      const message = `[FieldOps Pro] Hi ${targetRoute.technicianName}, your optimized Dhaka route for today (${targetRoute.stops.length} jobs, ${targetRoute.totalDistanceKm}km): ${shareUrl}`;

      // Mark shared in state
      setRoutes((prev) =>
        prev.map((r) =>
          r.id === routeId
            ? { ...r, sharedLink: shareUrl, sharedAt: new Date().toISOString() }
            : r
        )
      );

      if (channel === 'WHATSAPP') {
        const encoded = encodeURIComponent(message);
        window.open(`https://wa.me/?text=${encoded}`, '_blank');
      }

      return shareUrl;
    },
    [routes, selectedRoute]
  );

  return {
    routes,
    selectedRoute,
    selectRoute,
    updateRouteStops,
    saveOptimizedRoute,
    shareRoute,
  };
}
