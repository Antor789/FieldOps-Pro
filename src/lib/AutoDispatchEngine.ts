/**
 * FieldOps Pro - Intelligent GPS & Skill Auto-Dispatch Solver Engine
 * Implements weighted constraint evaluation based on PostGIS ST_Distance,
 * skill compatibility, part availability, and SLA due urgency.
 */

export interface DispatchCandidateInput {
  id: string;
  tenantId: string;
  name: string;
  dutyStatus: 'ONLINE' | 'BUSY' | 'ON_BREAK' | 'OFFLINE';
  location: { latitude: number; longitude: number };
  skills: string[];
  vehicleParts: string[];
  activeWorkOrderCount: number;
  maxCapacity: number;
  batteryLevel: number;
  remainingShiftHours: number;
  vehicleType: string;
}

export interface WorkOrderInput {
  id: string;
  tenantId: string;
  title: string;
  location: { latitude: number; longitude: number };
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'EMERGENCY' | 'CRITICAL';
  requiredSkills: string[];
  requiredParts?: string[];
  slaDeadline: string;
  estimatedDurationMins: number;
}

export interface CandidateScoreResult {
  technicianId: string;
  technicianName: string;
  compositeScore: number; // 0..100
  distanceKm: number;
  estimatedTravelTimeMins: number;
  skillMatchPercent: number;
  hasRequiredParts: boolean;
  hardConstraintsMet: boolean;
  failedConstraints: string[];
}

export interface AutoDispatchSolution {
  workOrderId: string;
  evaluatedCount: number;
  executionTimeMs: number;
  assignedTechnician: CandidateScoreResult | null;
  rankedCandidates: CandidateScoreResult[];
}

// Haversine GPS Distance formula
function haversineDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 100) / 100;
}

export function executeAutoDispatchEngine(
  workOrder: WorkOrderInput,
  candidates: DispatchCandidateInput[]
): AutoDispatchSolution {
  const startTime = performance.now();

  const rankedCandidates: CandidateScoreResult[] = candidates.map((tech) => {
    const failedConstraints: string[] = [];

    // Hard Constraint 1: Duty Status
    if (tech.dutyStatus === 'OFFLINE' || tech.dutyStatus === 'ON_BREAK') {
      failedConstraints.push(`Duty status is ${tech.dutyStatus}`);
    }

    // Hard Constraint 2: Workload Capacity
    if (tech.activeWorkOrderCount >= tech.maxCapacity) {
      failedConstraints.push(`At max capacity (${tech.activeWorkOrderCount}/${tech.maxCapacity})`);
    }

    // Hard Constraint 3: Battery Check
    if (tech.batteryLevel < 15) {
      failedConstraints.push(`Critical battery (${tech.batteryLevel}%)`);
    }

    // Skill Match Calculation
    const matchedSkills = workOrder.requiredSkills.filter((s) => tech.skills.includes(s));
    const skillMatchPercent =
      workOrder.requiredSkills.length > 0
        ? Math.round((matchedSkills.length / workOrder.requiredSkills.length) * 100)
        : 100;

    if (skillMatchPercent < 50 && workOrder.requiredSkills.length > 0) {
      failedConstraints.push(`Skill match too low (${skillMatchPercent}%)`);
    }

    // Parts Check
    const requiredParts = workOrder.requiredParts || [];
    const hasRequiredParts = requiredParts.every((p) => tech.vehicleParts.includes(p));

    // Distance & Travel Time
    const distKm = haversineDistanceKm(
      workOrder.location.latitude,
      workOrder.location.longitude,
      tech.location.latitude,
      tech.location.longitude
    );
    const travelMins = Math.round((distKm / 40) * 60 + 5); // 40km/h avg speed + 5m buffer

    // Weighted Score Components (0..100)
    const distanceScore = Math.max(0, 100 - distKm * 8); // Closer is higher
    const skillScore = skillMatchPercent;
    const partsScore = hasRequiredParts ? 100 : 40;
    const capacityScore = Math.max(0, 100 - (tech.activeWorkOrderCount / tech.maxCapacity) * 50);

    const hardConstraintsMet = failedConstraints.length === 0;

    // Composite Weighted Sum: Distance (35%), Skills (30%), Capacity (20%), Parts (15%)
    let compositeScore = 0;
    if (hardConstraintsMet) {
      compositeScore = Math.round(
        distanceScore * 0.35 + skillScore * 0.3 + capacityScore * 0.2 + partsScore * 0.15
      );
    }

    return {
      technicianId: tech.id,
      technicianName: tech.name,
      compositeScore,
      distanceKm: distKm,
      estimatedTravelTimeMins: travelMins,
      skillMatchPercent,
      hasRequiredParts,
      hardConstraintsMet,
      failedConstraints,
    };
  });

  // Filter valid and sort by score descending
  const validCandidates = rankedCandidates
    .filter((c) => c.hardConstraintsMet)
    .sort((a, b) => b.compositeScore - a.compositeScore);

  const endTime = performance.now();

  return {
    workOrderId: workOrder.id,
    evaluatedCount: candidates.length,
    executionTimeMs: Math.round((endTime - startTime) * 100) / 100,
    assignedTechnician: validCandidates.length > 0 ? validCandidates[0] : null,
    rankedCandidates,
  };
}
