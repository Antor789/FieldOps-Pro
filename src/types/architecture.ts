export interface ArchitectureSection {
  id: string;
  title: string;
  subtitle: string;
  iconName: string;
  description: string;
  keyMetrics: { label: string; value: string; detail: string }[];
  contentMd?: string;
  mermaidDiagram?: string;
  codeSnippets?: CodeSnippet[];
  decisionMatrix?: DecisionMatrixRow[];
}

export interface CodeSnippet {
  title: string;
  language: 'typescript' | 'sql' | 'hcl' | 'yaml' | 'go' | 'json';
  code: string;
  explanation: string;
}

export interface DecisionMatrixRow {
  factor: string;
  optionA: string; // e.g. Shared DB + RLS
  optionB: string; // e.g. Schema-per-tenant
  optionC: string; // e.g. DB-per-tenant
  recommendation: string;
}

export interface TechnicianCandidate {
  id: string;
  name: string;
  tenantId: string;
  avatar: string;
  currentLat: number;
  currentLng: number;
  distanceKm: number;
  travelTimeMins: number;
  skills: string[];
  skillMatchPercent: number;
  slaUrgencyScore: number;
  activeWorkOrders: number;
  workloadScore: number;
  hasParts: boolean;
  overallScore: number;
  hardConstraintsMet: boolean;
  failedConstraints: string[];
}

export interface WorkOrderRequest {
  id: string;
  title: string;
  tenantId: string;
  lat: number;
  lng: number;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  requiredSkills: string[];
  requiredParts: string[];
  slaDueMinutes: number;
}

export interface TelemetryPacket {
  id: string;
  techId: string;
  tenantId: string;
  lat: number;
  lng: number;
  speedKmh: number;
  batteryPct: number;
  timestamp: string;
  status: 'INGESTED' | 'KAFKA_QUEUED' | 'REDIS_GEO_INDEXED' | 'TIMESCALE_PERSISTED';
  latencyMs: number;
}

export interface TenantConfig {
  id: string;
  name: string;
  tier: 'ENTERPRISE' | 'PRO' | 'STANDARD';
  domain: string;
  isolationMode: 'SHARED_RLS' | 'DEDICATED_SCHEMA' | 'ISOLATED_DB';
  primaryColor: string;
  rateLimitRpm: number;
  maxTechnicians: number;
  customSsoEnabled: boolean;
}
