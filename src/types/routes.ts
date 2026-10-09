/**
 * FieldOps Pro - Route Optimization Types for Dhaka Field Operations
 * Context: Dhaka traffic congestion, flood zones, MRT/Flyover corridors, and TSP optimization
 */

export interface RouteStop {
  id: string;
  order: number;
  workOrderId: string;
  customerName: string;
  address: string;
  areaName: string; // e.g. "Gulshan 1", "Motijheel", "Uttara Sector 3"
  lat: number;
  lng: number;
  estimatedArrival: string; // ISO or formatted time "09:45 AM"
  estimatedDuration: number; // minutes on site
  distanceFromPrev: number; // km
  timeFromPrev: number; // minutes (with traffic multiplier)
  priority?: 'EMERGENCY' | 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  status?: 'pending' | 'en_route' | 'arrived' | 'completed' | 'skipped';
  isTrafficHotspot?: boolean;
}

export interface RouteLocation {
  lat: number;
  lng: number;
  name: string;
  address?: string;
}

export interface OptimizationSavings {
  distanceSavedKm: number;
  timeSavedMins: number;
  fuelCostSavedBDT: number;
  co2SavedKg: number;
  originalDistanceKm: number;
  originalTimeMins: number;
}

export interface Route {
  id: string;
  technicianId: string;
  technicianName: string;
  technicianPhone?: string;
  technicianAvatar?: string;
  date: string; // "YYYY-MM-DD"
  stops: RouteStop[];
  startLocation: RouteLocation;
  endLocation: RouteLocation;
  totalDistanceKm: number;
  totalTimeMins: number; // includes site time + travel time
  trafficMultiplier: number; // e.g. 1.8x
  isOptimized: boolean;
  optimizationSavings?: OptimizationSavings;
  status: 'planned' | 'in_progress' | 'completed';
  sharedLink?: string;
  sharedAt?: string;
  vehicleType?: 'BIKE' | 'VAN' | 'CAR' | 'FOOT';
}

export interface TrafficZone {
  id: string;
  name: string;
  nameBn: string;
  center: { lat: number; lng: number };
  radiusMeters: number;
  congestionLevel: 'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW';
  multiplier: number;
  reason: string; // e.g. "Elevated Expressway construction", "Flood waterlogging", "Peak office rush"
}

export interface DhakaLandmark {
  id: string;
  name: string;
  nameBn: string;
  area: string;
  lat: number;
  lng: number;
}
