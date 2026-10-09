import { useState, useCallback } from 'react';
import { RouteStop, RouteLocation, OptimizationSavings } from '../types/routes';
import {
  calculateHaversineDistance,
  getDhakaTrafficMultiplier,
  calculateTravelTimeMins,
  nearestNeighborTSP,
  calculateOptimizationSavings,
} from '../utils/routeOptimizer';

export function useRouteOptimizer() {
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizedStops, setOptimizedStops] = useState<RouteStop[]>([]);
  const [savings, setSavings] = useState<OptimizationSavings | null>(null);

  const calculateDistance = useCallback((from: RouteLocation, to: RouteLocation): number => {
    return calculateHaversineDistance(from, to);
  }, []);

  const estimateTime = useCallback(
    (from: RouteLocation, to: RouteLocation, datetime?: Date | string | number): number => {
      const dist = calculateHaversineDistance(from, to);
      const mult = getDhakaTrafficMultiplier(datetime, { lat: to.lat, lng: to.lng });
      return calculateTravelTimeMins(dist, mult);
    },
    []
  );

  const optimizeRoute = useCallback(
    async (
      stops: RouteStop[],
      startLocation: RouteLocation,
      endLocation: RouteLocation
    ): Promise<{
      stops: RouteStop[];
      savings: OptimizationSavings;
      totalDistanceKm: number;
      totalTimeMins: number;
    }> => {
      setIsOptimizing(true);

      // Simulate realistic async optimization calculation
      await new Promise((resolve) => setTimeout(resolve, 900));

      // Calculate unoptimized baseline
      let originalDist = 0;
      let originalTime = 0;
      let curr = { lat: startLocation.lat, lng: startLocation.lng };

      stops.forEach((s) => {
        const d = calculateHaversineDistance(curr, { lat: s.lat, lng: s.lng });
        const mult = getDhakaTrafficMultiplier(9, { lat: s.lat, lng: s.lng });
        const t = calculateTravelTimeMins(d, mult);
        originalDist += d;
        originalTime += t + (s.estimatedDuration || 30);
        curr = { lat: s.lat, lng: s.lng };
      });
      const dBack = calculateHaversineDistance(curr, { lat: endLocation.lat, lng: endLocation.lng });
      originalDist += dBack;
      originalTime += calculateTravelTimeMins(dBack, 1.5);

      // Run TSP optimization
      const {
        optimizedStops: reordered,
        totalDistanceKm: optDist,
        totalTimeMins: optTime,
      } = nearestNeighborTSP(stops, startLocation, endLocation);

      // Compute savings metrics
      const optSavings = calculateOptimizationSavings(
        originalDist,
        originalTime,
        optDist,
        optTime
      );

      setOptimizedStops(reordered);
      setSavings(optSavings);
      setIsOptimizing(false);

      return {
        stops: reordered,
        savings: optSavings,
        totalDistanceKm: optDist,
        totalTimeMins: optTime,
      };
    },
    []
  );

  return {
    isOptimizing,
    optimizedStops,
    savings,
    optimizeRoute,
    calculateDistance,
    estimateTime,
  };
}
