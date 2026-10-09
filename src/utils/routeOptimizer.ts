import { RouteStop, RouteLocation, OptimizationSavings } from '../types/routes';
import { DHAKA_TRAFFIC_ZONES } from './dhakaGeography';

/**
 * Calculates straight-line distance between 2 coordinates using Haversine formula
 */
export function calculateHaversineDistance(
  p1: { lat: number; lng: number },
  p2: { lat: number; lng: number }
): number {
  const R = 6371; // Earth radius in km
  const dLat = ((p2.lat - p1.lat) * Math.PI) / 180;
  const dLng = ((p2.lng - p1.lng) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((p1.lat * Math.PI) / 180) *
      Math.cos((p2.lat * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distanceKm = R * c;
  // Apply a 1.35x road curvature factor for Dhaka city grid
  return Math.round(distanceKm * 1.35 * 10) / 10;
}

/**
 * Determines traffic speed multiplier based on Dhaka time of day and zone proximity
 */
export function getDhakaTrafficMultiplier(
  datetime?: Date | string | number,
  location?: { lat: number; lng: number }
): number {
  let hour = 9; // default 9 AM
  if (typeof datetime === 'number') {
    hour = datetime;
  } else if (datetime) {
    const d = new Date(datetime);
    hour = d.getHours();
  }

  let timeMultiplier = 1.2;

  // Dhaka Peak Hours
  if ((hour >= 8 && hour <= 10) || (hour >= 17 && hour <= 20)) {
    timeMultiplier = 2.4; // 2.4x time in peak hours
  } else if (hour >= 11 && hour <= 16) {
    timeMultiplier = 1.5; // Moderate daytime traffic
  } else if (hour >= 21 || hour <= 6) {
    timeMultiplier = 1.0; // Clear late night
  }

  // Check location proximity to Dhaka traffic congestion hotspots
  if (location) {
    for (const zone of DHAKA_TRAFFIC_ZONES) {
      const distToZone = calculateHaversineDistance(location, zone.center);
      if (distToZone <= zone.radiusMeters / 1000) {
        timeMultiplier = Math.max(timeMultiplier, zone.multiplier);
        break;
      }
    }
  }

  return Math.round(timeMultiplier * 10) / 10;
}

/**
 * Calculates estimated travel time in minutes based on distance in km and traffic multiplier
 * Standard base speed in Dhaka city = 25 km/h
 */
export function calculateTravelTimeMins(distanceKm: number, trafficMultiplier: number): number {
  const baseSpeedKmH = 25; // 25 km/h baseline speed
  const effectiveSpeedKmH = Math.max(8, baseSpeedKmH / trafficMultiplier);
  const travelHours = distanceKm / effectiveSpeedKmH;
  return Math.round(travelHours * 60);
}

/**
 * Nearest Neighbor Traveling Salesperson Problem (TSP) heuristic for route optimization
 */
export function nearestNeighborTSP(
  stops: RouteStop[],
  startLocation: RouteLocation,
  endLocation: RouteLocation,
  startTimeStr = '08:30 AM'
): {
  optimizedStops: RouteStop[];
  totalDistanceKm: number;
  totalTimeMins: number;
} {
  if (stops.length === 0) {
    return { optimizedStops: [], totalDistanceKm: 0, totalTimeMins: 0 };
  }

  const unvisited = [...stops];
  const reordered: RouteStop[] = [];
  let currentLocation = { lat: startLocation.lat, lng: startLocation.lng };
  let accumulatedTimeMins = 0;
  let totalDistKm = 0;

  let currentHour = 8;
  let currentMin = 30;

  let orderCounter = 1;

  while (unvisited.length > 0) {
    // Find closest unvisited stop considering distance and traffic multiplier
    let bestIdx = 0;
    let minCost = Infinity;

    for (let i = 0; i < unvisited.length; i++) {
      const stop = unvisited[i];
      const dist = calculateHaversineDistance(currentLocation, { lat: stop.lat, lng: stop.lng });
      const traffic = getDhakaTrafficMultiplier(currentHour, { lat: stop.lat, lng: stop.lng });
      const travelMins = calculateTravelTimeMins(dist, traffic);

      // Emergency priority factor gives precedence to emergency stops
      const priorityBonus = stop.priority === 'EMERGENCY' ? -15 : stop.priority === 'CRITICAL' ? -8 : 0;
      const cost = travelMins + priorityBonus;

      if (cost < minCost) {
        minCost = cost;
        bestIdx = i;
      }
    }

    const nextStop = unvisited.splice(bestIdx, 1)[0];
    const distToNext = calculateHaversineDistance(currentLocation, { lat: nextStop.lat, lng: nextStop.lng });
    const trafficMult = getDhakaTrafficMultiplier(currentHour, { lat: nextStop.lat, lng: nextStop.lng });
    const travelTime = calculateTravelTimeMins(distToNext, trafficMult);

    totalDistKm += distToNext;
    accumulatedTimeMins += travelTime + (nextStop.estimatedDuration || 30);

    // Calculate arrival time string
    currentMin += travelTime;
    if (currentMin >= 60) {
      currentHour += Math.floor(currentMin / 60);
      currentMin = currentMin % 60;
    }
    const ampm = currentHour >= 12 ? 'PM' : 'AM';
    const displayHour = currentHour > 12 ? currentHour - 12 : currentHour === 0 ? 12 : currentHour;
    const formattedArrival = `${displayHour.toString().padStart(2, '0')}:${currentMin
      .toString()
      .padStart(2, '0')} ${ampm}`;

    // Add service duration to time clock
    currentMin += nextStop.estimatedDuration || 30;
    if (currentMin >= 60) {
      currentHour += Math.floor(currentMin / 60);
      currentMin = currentMin % 60;
    }

    reordered.push({
      ...nextStop,
      order: orderCounter++,
      distanceFromPrev: distToNext,
      timeFromPrev: travelTime,
      estimatedArrival: formattedArrival,
      isTrafficHotspot: trafficMult >= 2.2,
    });

    currentLocation = { lat: nextStop.lat, lng: nextStop.lng };
  }

  // Distance from last stop back to endLocation (or Depot)
  const distBack = calculateHaversineDistance(currentLocation, { lat: endLocation.lat, lng: endLocation.lng });
  const trafficBack = getDhakaTrafficMultiplier(currentHour, { lat: endLocation.lat, lng: endLocation.lng });
  const travelBackMins = calculateTravelTimeMins(distBack, trafficBack);

  totalDistKm += distBack;
  accumulatedTimeMins += travelBackMins;

  return {
    optimizedStops: reordered,
    totalDistanceKm: Math.round(totalDistKm * 10) / 10,
    totalTimeMins: Math.round(accumulatedTimeMins),
  };
}

/**
 * Calculates optimization savings between unoptimized and optimized route
 */
export function calculateOptimizationSavings(
  originalDistanceKm: number,
  originalTimeMins: number,
  optimizedDistanceKm: number,
  optimizedTimeMins: number
): OptimizationSavings {
  const distanceSavedKm = Math.max(0, Math.round((originalDistanceKm - optimizedDistanceKm) * 10) / 10);
  const timeSavedMins = Math.max(0, Math.round(originalTimeMins - optimizedTimeMins));

  // Dhaka Octane / Petrol fuel price ৳125/Liter. Fuel efficiency ~ 12 km/Liter for motorbikes/vans
  const fuelLiterSaved = distanceSavedKm / 12;
  const fuelCostSavedBDT = Math.round(fuelLiterSaved * 125);

  // Carbon emissions ~ 2.3 kg CO2 per Liter petrol
  const co2SavedKg = Math.round(fuelLiterSaved * 2.3 * 10) / 10;

  return {
    distanceSavedKm,
    timeSavedMins,
    fuelCostSavedBDT,
    co2SavedKg,
    originalDistanceKm,
    originalTimeMins,
  };
}
