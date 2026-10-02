import { ArchitectureSection, TenantConfig } from '../types/architecture';

export const SYSTEM_METRICS = {
  activeTechnicians: '100,000+',
  monthlyWorkOrders: '5,000,000+',
  telemetryIngestRate: '33,000 pings/sec (Peak 50k)',
  p99DispatchLatency: '< 450 ms',
  uptimeSla: '99.99%',
  dataRetention: '7 Years (Audit & Compliance)',
};

export const DEFAULT_TENANTS: TenantConfig[] = [
  {
    id: 'tenant-acme-ops',
    name: 'Acme Field Operations',
    tier: 'ENTERPRISE',
    domain: 'dispatch.acmeservices.com',
    isolationMode: 'DEDICATED_SCHEMA',
    primaryColor: '#2563eb',
    rateLimitRpm: 12000,
    maxTechnicians: 25000,
    customSsoEnabled: true,
  },
  {
    id: 'tenant-apex-hvac',
    name: 'Apex Heating & Cooling',
    tier: 'PRO',
    domain: 'hvac-dispatch.apex.io',
    isolationMode: 'SHARED_RLS',
    primaryColor: '#059669',
    rateLimitRpm: 3000,
    maxTechnicians: 2500,
    customSsoEnabled: false,
  },
  {
    id: 'tenant-metro-utility',
    name: 'Metro Energy & Gas',
    tier: 'ENTERPRISE',
    domain: 'fieldops.metrogas.gov',
    isolationMode: 'ISOLATED_DB',
    primaryColor: '#dc2626',
    rateLimitRpm: 25000,
    maxTechnicians: 50000,
    customSsoEnabled: true,
  },
];

export const BLUEPRINT_SECTIONS: ArchitectureSection[] = [
  {
    id: 'executive-overview',
    title: '1. Executive Architecture Overview',
    subtitle: 'High-Throughput Architectural Foundation, DDD Bounded Contexts & CQRS Topology',
    iconName: 'LayoutGrid',
    description: `FieldOps Pro is engineered to orchestrate mission-critical field service operations for enterprise deployments scaling beyond 100,000 concurrent mobile technicians and 5,000,000 monthly work orders. The architecture balances domain modularity, real-time spatial reactivity, and zero-downtime multi-tenant execution.`,
    keyMetrics: [
      { label: 'Target SLA', value: '99.99%', detail: 'Max annual downtime: 52.6 mins' },
      { label: 'Work Orders', value: '5,000,000+/mo', detail: 'Distributed transactional writes' },
      { label: 'Ingest Throughput', value: '33.3k pings/sec', detail: 'Sub-second GPS telemetry ingest' },
      { label: 'Auto-Dispatch P99', value: '< 450ms', detail: 'AI Spatial & VRPTW Solver' },
    ],
    mermaidDiagram: `graph TD
    subgraph "Client Layer"
        MA["Mobile App - Flutter/Native"]
        DC["Dispatcher Web Console - React"]
        EXT["External ERP/CRM API Clients"]
    end

    subgraph "Edge & Security Gateways"
        CF["Cloudflare WAF / DDoS & SSL"]
        KONG["Kong API Gateway - OAuth2 / JWT & Rate Limiter"]
        WSG["WebSocket / Socket.IO Gateway Cluster"]
    end

    subgraph "Real-Time Telemetry & Event Ingestion Pipeline"
        MQTT["EMQX Enterprise MQTT Broker Cluster"]
        KAFKA["Apache Kafka / AWS MSK Telemetry Stream"]
        INGEST["Go/Rust Telemetry Consumer Service"]
        REDIS_GEO[("Redis Cluster - GeoSpatial & State Cache")]
    end

    subgraph "Core Domain Microservices"
        WO_SVC["Work Order Management Service"]
        DISPATCH_ENG["AI Dispatch & Route Optimizer"]
        TENANT_SVC["Tenant Admin & Config Service"]
        TELEMETRY_SVC["Telemetry & History Service"]
        BILLING_SVC["Billing & Invoicing Service"]
        NOTIF_SVC["Notification & Event Gateway"]
    end

    subgraph "Async Processing & Worker Queue"
        BULL["BullMQ / KEDA Async Workers"]
        SOLVER["OR-Tools / VRPTW Route Calculation Engine"]
    end

    subgraph "Storage & Persistence Tier"
        PG_MAIN[("PostgreSQL Primary - RLS & PostGIS")]
        TS_DB[("TimescaleDB - GPS History & Telemetry")]
        ES_SEARCH[("Elasticsearch - Work Order Search")]
        S3[("AWS S3 / GCS - Attachments & Proof-of-Work")]
    end

    MA -->|MQTT / WSS| MQTT
    MA -->|HTTPS REST| CF
    DC -->|WSS Realtime| WSG
    DC -->|HTTPS REST| CF
    EXT -->|gRPC / REST| CF

    CF --> KONG
    KONG --> WO_SVC
    KONG --> DISPATCH_ENG
    KONG --> TENANT_SVC
    KONG --> BILLING_SVC

    MQTT --> KAFKA
    KAFKA --> INGEST
    INGEST --> REDIS_GEO
    INGEST --> TS_DB

    DISPATCH_ENG --> BULL
    BULL --> SOLVER
    DISPATCH_ENG --> REDIS_GEO

    WO_SVC --> PG_MAIN
    WO_SVC --> ES_SEARCH
    WO_SVC --> NOTIF_SVC
    NOTIF_SVC --> WSG
`,
    decisionMatrix: [
      {
        factor: 'Architecture Pattern',
        optionA: 'Monolith (Single App)',
        optionB: 'Distributed Microservices',
        optionC: 'Hybrid Modular Monolith + Dedicated Spatial Services',
        recommendation: 'Hybrid Strategy: Modular Monolith for domain logic (Work Orders, Billing) with isolated microservices for Telemetry Ingest & AI Routing Solver to eliminate network hops while enabling independent scaling.',
      },
      {
        factor: 'Read/Write Topology',
        optionA: 'Single DB Read/Write',
        optionB: 'CQRS with Event Sourcing',
        optionC: 'Postgres Primary + Read Replicas + Redis Geo Cache',
        recommendation: 'CQRS with Event Sourcing for Telemetry and Work Order History; Command writes to Primary PostgreSQL, Queries served via Redis Spatial Cache & Elasticsearch.',
      },
      {
        factor: 'Event Ingestion Protocol',
        optionA: 'HTTPS REST Polling',
        optionB: 'Standard WebSockets',
        optionC: 'MQTT over TLS + Kafka Consumer Pipeline',
        recommendation: 'MQTT for battery-optimized mobile telemetry streaming (low overhead header, QOS 1) fed into Kafka for high-throughput stream processing.',
      },
    ],
    codeSnippets: [
      {
        title: 'Domain-Driven Design: Work Order Aggregate Root (TypeScript)',
        language: 'typescript',
        explanation: 'Enforces invariants, domain events creation, and immutability inside the WorkOrder Aggregate Root.',
        code: `export enum WorkOrderStatus {
  CREATED = 'CREATED',
  SCHEDULED = 'SCHEDULED',
  EN_ROUTE = 'EN_ROUTE',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export interface LocationValueObject {
  latitude: number;
  longitude: number;
  address: string;
}

export class WorkOrderAggregate {
  private id: string;
  private tenantId: string;
  private status: WorkOrderStatus;
  private assignedTechnicianId?: string;
  private location: LocationValueObject;
  private requiredSkills: string[];
  private domainEvents: Array<{ eventName: string; payload: any; timestamp: Date }> = [];

  constructor(id: string, tenantId: string, location: LocationValueObject, requiredSkills: string[]) {
    this.id = id;
    this.tenantId = tenantId;
    this.status = WorkOrderStatus.CREATED;
    this.location = location;
    this.requiredSkills = requiredSkills;

    this.recordEvent('WorkOrderCreated', { workOrderId: id, tenantId, location });
  }

  public assignTechnician(technicianId: string, estimatedArrivalTime: Date): void {
    if (this.status !== WorkOrderStatus.CREATED && this.status !== WorkOrderStatus.SCHEDULED) {
      throw new Error(\`Cannot assign technician when status is \${this.status}\`);
    }
    this.assignedTechnicianId = technicianId;
    this.status = WorkOrderStatus.SCHEDULED;

    this.recordEvent('WorkOrderAssigned', {
      workOrderId: this.id,
      tenantId: this.tenantId,
      technicianId,
      estimatedArrivalTime
    });
  }

  private recordEvent(eventName: string, payload: any) {
    this.domainEvents.push({ eventName, payload, timestamp: new Date() });
  }

  public pullDomainEvents() {
    const events = [...this.domainEvents];
    this.domainEvents = [];
    return events;
  }
}`
      }
    ]
  },
  {
    id: 'multi-tenancy',
    title: '2. Multi-Tenancy & Isolation Model',
    subtitle: 'Zero-Trust Tenant Isolation, Postgres Row-Level Security & Custom Domain Routing',
    iconName: 'ShieldCheck',
    description: `FieldOps Pro implements a hybrid multi-tenant model supporting thousands of mid-market customers on shared high-density compute alongside enterprise tier-1 clients with strict data residency and dedicated hardware requirements.`,
    keyMetrics: [
      { label: 'Isolation Guarantee', value: 'Zero Cross-Tenant Leakage', detail: 'Enforced at Gateway & DB RLS' },
      { label: 'Tenant Onboarding', value: '< 90 seconds', detail: 'Automated terraform & schema provision' },
      { label: 'Custom Domains', value: 'SSL Auto-Provisioning', detail: 'Cloudflare SaaS Custom Hostnames' },
      { label: 'Max Rate Limit', value: 'Per-Tenant Token Bucket', detail: 'Isolated rate queues in Redis' },
    ],
    mermaidDiagram: `graph LR
    subgraph "Client Request"
        R1["Request from dispatch.acme.com"]
        R2["Request from hvac-apex.com"]
    end

    subgraph "Edge SSL & Gateway Layer"
        CF_SAAS["Cloudflare Custom Hostname API"]
        KONG_GATEWAY["Kong Gateway Tenant Resolution Middleware"]
    end

    subgraph "Context Injection"
        JWT["Verify OAuth JWT & Claim tenant_id"]
        CTX["Inject App Context: req.tenantId"]
    end

    subgraph "Database Isolation Strategy"
        direction TB
        RLS["PostgreSQL Shared Pool - Row Level Security RLS"]
        DEDICATED_SCHEMA["PostgreSQL Dedicated Schema tenant_acme"]
        ISOLATED_DB["Dedicated PostgreSQL Cluster tenant_metro"]
    end

    R1 --> CF_SAAS
    R2 --> CF_SAAS
    CF_SAAS --> KONG_GATEWAY
    KONG_GATEWAY --> JWT
    JWT --> CTX

    CTX -->|Tenant Tier: Standard| RLS
    CTX -->|Tenant Tier: Pro| DEDICATED_SCHEMA
    CTX -->|Tenant Tier: Enterprise| ISOLATED_DB
`,
    decisionMatrix: [
      {
        factor: 'Storage Strategy',
        optionA: 'Shared Database with Row-Level Security (RLS)',
        optionB: 'Schema-per-Tenant (Isolated Postgres Schemas)',
        optionC: 'Database-per-Tenant (Isolated Postgres DB Clusters)',
        recommendation: 'Hybrid Matrix: Standard/Pro tiers share PostgreSQL instance with strictly tested RLS policies. Enterprise tier tenants receive dedicated schemas or isolated database clusters with customer-managed KMS encryption keys.',
      },
      {
        factor: 'Connection Pooling',
        optionA: 'Direct App DB Connections',
        optionB: 'PgBouncer in Transaction Pooling Mode',
        optionC: 'AWS RDS Proxy / Supabase Supavisor',
        recommendation: 'PgBouncer in Transaction Pooling mode with session parameters (`SET LOCAL app.current_tenant_id`) passed per transaction to maintain connection efficiency under 100k concurrent client requests.',
      },
    ],
    codeSnippets: [
      {
        title: 'PostgreSQL Row-Level Security (RLS) Policy Definition (SQL)',
        language: 'sql',
        explanation: 'Enforces automatic row-level tenant boundaries for all SELECT, INSERT, UPDATE, and DELETE queries across work orders.',
        code: `-- 1. Enable RLS on the core work_orders table
ALTER TABLE work_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE work_orders FORCE ROW LEVEL SECURITY;

-- 2. Create security policy checking current session tenant_id
CREATE POLICY tenant_isolation_policy ON work_orders
    AS RESTRICTIVE
    USING (tenant_id = current_setting('app.current_tenant_id', true)::uuid)
    WITH CHECK (tenant_id = current_setting('app.current_tenant_id', true)::uuid);

-- 3. Application Connection Pool Context Setting Function
CREATE OR REPLACE FUNCTION set_tenant_context(p_tenant_id UUID) 
RETURNS void AS $$
BEGIN
    IF p_tenant_id IS NULL THEN
        RAISE EXCEPTION 'Tenant ID cannot be null for context set';
    END IF;
    PERFORM set_config('app.current_tenant_id', p_tenant_id::text, true);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;`
      },
      {
        title: 'Express / Fastify Tenant Context & Scope Middleware (TypeScript)',
        language: 'typescript',
        explanation: 'Parses tenant host / JWT claim, sets database session variables before request execution, and cleans up context.',
        code: `import { Request, Response, NextFunction } from 'express';
import { dbPool } from '../database';

export async function tenantIsolationMiddleware(req: Request, res: Response, next: NextFunction) {
  const tenantId = req.headers['x-tenant-id'] || req.user?.tenantId;

  if (!tenantId) {
    return res.status(403).json({ error: 'TENANT_CONTEXT_MISSING', message: 'Unauthorized: Missing tenant context' });
  }

  // Acquire dedicated DB client from pool for transaction scoped execution
  const dbClient = await dbPool.connect();

  try {
    // Set tenant session configuration variable in Postgres connection
    await dbClient.query("SELECT set_tenant_context($1::uuid)", [tenantId]);
    
    // Attach client & tenantId to request context
    req.dbClient = dbClient;
    req.tenantId = tenantId as string;

    res.on('finish', () => {
      dbClient.release(); // Return client to pool clean
    });

    next();
  } catch (err) {
    dbClient.release();
    return res.status(500).json({ error: 'TENANT_INITIALIZATION_FAILED', detail: (err as Error).message });
  }
}`
      }
    ]
  },
  {
    id: 'telemetry-streaming',
    title: '3. Real-Time Telemetry & Event Streaming',
    subtitle: '50k Pings/Sec Telemetry Pipeline, EMQX MQTT Broker, Kafka & Redis Spatial Indexing',
    iconName: 'Radio',
    description: `High-density real-time tracking of 100,000 active field technicians requires high-concurrency packet processing with minimal battery and cellular bandwidth usage. MQTT over TLS delivers telemetry packets into Kafka, indexing live positions into Redis Spatial structures within 15 milliseconds.`,
    keyMetrics: [
      { label: 'Ingest Rate', value: '33,000 pings/sec', detail: 'Sustained peak volume' },
      { label: 'End-to-End Latency', value: '< 80 ms', detail: 'GPS Ping -> Dispatcher UI' },
      { label: 'Payload Footprint', value: '112 bytes / ping', detail: 'Binary Protobuf / Compact JSON' },
      { label: 'Mobile Battery', value: '< 3% per 8hr shift', detail: 'Optimized adaptive pinging' },
    ],
    mermaidDiagram: `graph TD
    subgraph "Mobile Device Fleet (100,000 Technicians)"
        MOB1["Technician App - Android"]
        MOB2["Technician App - iOS"]
        MOB3["Vehicle OBD-II Gateway"]
    end

    subgraph "MQTT Connection Layer"
        EMQX1["EMQX Cluster Node 1"]
        EMQX2["EMQX Cluster Node 2"]
        EMQX3["EMQX Cluster Node 3"]
    end

    subgraph "Stream Ingestion Pipeline"
        KAFKA_TOPIC[("Kafka Topic: telemetry.gps.raw")]
        CONSUMER_GO["Go Telemetry Consumer Service Cluster - KEDA Scaled"]
    end

    subgraph "Dual-Storage Path (CQRS)"
        subgraph "Hot In-Memory Path (<10ms)"
            REDIS_GEO[("Redis Geo Cluster - GEOADD tenant:techs")]
            WS_ADAPTER["Socket.IO Redis Streams Adapter"]
            DISPATCH_UI["Dispatcher Web Dashboard"]
        end

        subgraph "Cold Persistent Path (Batch Write)"
            BATCH_WRITER["TimescaleDB Bulk Copy Consumer"]
            TS_HYPER[("TimescaleDB Compressed Hypertables")]
        end
    end

    MOB1 -->|MQTT TLS / Protobuf| EMQX1
    MOB2 -->|MQTT TLS / Protobuf| EMQX2
    MOB3 -->|MQTT TLS / Protobuf| EMQX3

    EMQX1 --> KAFKA_TOPIC
    EMQX2 --> KAFKA_TOPIC
    EMQX3 --> KAFKA_TOPIC

    KAFKA_TOPIC --> CONSUMER_GO
    CONSUMER_GO -->|GEOADD lon lat tech_id| REDIS_GEO
    CONSUMER_GO --> BATCH_WRITER

    REDIS_GEO --> WS_ADAPTER
    WS_ADAPTER --> DISPATCH_UI
    BATCH_WRITER -->|COPY microbatch 500ms| TS_HYPER
`,
    decisionMatrix: [
      {
        factor: 'Ingest Protocol',
        optionA: 'HTTP REST / JSON POST',
        optionB: 'WebSocket Persistent Connections',
        optionC: 'MQTT v5.0 over TLS with Protobuf Serialization',
        recommendation: 'MQTT v5.0 over TLS with Protobuf serialization. MQTT delivers 90% header reduction compared to HTTP, retains session QoS 1 for reconnects, and protects mobile battery life.',
      },
      {
        factor: 'Spatial Indexing Engine',
        optionA: 'PostGIS SQL Queries (`ST_DWithin`)',
        optionB: 'Elasticsearch Geo-Shape Queries',
        optionC: 'Redis Cluster GEO Commands (`GEOADD`, `GEOSEARCH`)',
        recommendation: 'Redis GEO commands (`GEOSEARCH BYRADIUS`) for sub-millisecond proximity lookup of candidate technicians, backed by PostGIS for complex polygon boundary geofencing.',
      },
    ],
    codeSnippets: [
      {
        title: 'Go Telemetry Consumer Service - Kafka to Redis & TimescaleDB Ingester',
        language: 'go',
        explanation: 'High-performance concurrent Go pipeline processing 50,000 GPS pings per second with minimal memory allocation.',
        code: `package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"time"

	"github.com/confluentinc/confluent-kafka-go/kafka"
	"github.com/go-redis/redis/v8"
)

type TelemetryPacket struct {
	TenantID   string  \`json:"tenant_id"\`
	TechID     string  \`json:"tech_id"\`
	Latitude   float64 \`json:"lat"\`
	Longitude  float64 \`json:"lng"\`
	SpeedKmh   float64 \`json:"speed"\`
	Timestamp  int64   \`json:"ts"\`
}

func main() {
	rdb := redis.NewClient(&redis.Options{Addr: "redis-cluster.internal:6379"})
	ctx := context.Background()

	c, err := kafka.NewConsumer(&kafka.ConfigMap{
		"bootstrap.servers": "kafka.internal:9092",
		"group.id":          "telemetry-ingest-group",
		"auto.offset.reset": "latest",
	})
	if err != nil {
		log.Fatalf("Failed to create Kafka consumer: %s", err)
	}

	c.SubscribeTopics([]string{"telemetry.gps.raw"}, nil)

	for {
		msg, err := c.ReadMessage(time.Millisecond * 100)
		if err == nil {
			var packet TelemetryPacket
			if err := json.Unmarshal(msg.Value, &packet); err == nil {
				// Fast In-Memory Spatial Index Update in Redis (Sub-millisecond execution)
				redisKey := fmt.Sprintf("tenant:%s:tech_locations", packet.TenantID)
				
				rdb.GeoAdd(ctx, redisKey, &redis.GeoLocation{
					Name:      packet.TechID,
					Longitude: packet.Longitude,
					Latitude:  packet.Latitude,
				})

				// Store latest state metadata hash
				techMetaKey := fmt.Sprintf("tenant:%s:tech:%s", packet.TenantID, packet.TechID)
				rdb.HSet(ctx, techMetaKey, map[string]interface{}{
					"lat":       packet.Latitude,
					"lng":       packet.Longitude,
					"speed":     packet.SpeedKmh,
					"last_ping": packet.Timestamp,
				})
			}
		}
	}
}`
      }
    ]
  },
  {
    id: 'ai-dispatch-engine',
    title: '4. AI Dispatch & Optimization Engine',
    subtitle: 'Multi-Objective Worker Matching, Mapbox Distance Matrix & VRPTW Solver',
    iconName: 'Cpu',
    description: `The AI Auto-Dispatch Engine resolves complex Vehicle Routing Problems with Time Windows (VRPTW) in real-time. When a high-priority work order is received, the solver filters candidates through hard constraints and scores candidate technicians using weighted multi-objective algorithms under 450 milliseconds.`,
    keyMetrics: [
      { label: 'Match Calculation', value: '< 450ms P99', detail: 'Real-time dispatch decision' },
      { label: 'Route Optimization', value: '18-24% Miles Saved', detail: 'Reduced fuel & travel duration' },
      { label: 'First-Time Fix Rate', value: '+14% Improvement', detail: 'Skill & inventory exact matching' },
      { label: 'SLA Breaches', value: '-85% Reduction', detail: 'Dynamic SLA urgency weighting' },
    ],
    mermaidDiagram: `graph TD
    subgraph "Trigger"
        WO["Incoming High-Priority Work Order"]
    end

    subgraph "Step 1: Radial Geofence Pre-Filter (Redis)"
        GEO["Redis GEOSEARCH 25km Radius around Work Order Location"]
        CANDIDATES["25 Candidate Technicians Identified"]
    end

    subgraph "Step 2: Hard Constraint Evaluation"
        C1["Skill & Certification Check"]
        C2["Shift Hours & Overtime Rules"]
        C3["On-Board Inventory / Parts Check"]
        VALID["8 Eligible Candidates Pass Hard Rules"]
    end

    subgraph "Step 3: Real-Time Distance & Matrix Lookup"
        MAPBOX["Mapbox / OSRM Distance Matrix API with Live Traffic"]
        TRAFFIC["Real Travel Times & ETA Calculated"]
    end

    subgraph "Step 4: Multi-Objective Scoring Algorithm"
        SCORE["Compute Weighted Score: Distance, Skill Fit, SLA Urgency, Workload, Parts"]
        RANK["Rank Candidates by Score"]
    end

    subgraph "Step 5: Optimization & Assignment Execution"
        SOLVER{"Score > Threshold 80?"}
        SOLVER -->|Yes| AUTO["Auto-Assign Work Order & Push Alert to Tech App"]
        SOLVER -->|No| DISPATCH_QUEUE["Flag for Dispatcher Manual Review"]
    end

    WO --> GEO
    GEO --> CANDIDATES
    CANDIDATES --> C1
    C1 --> C2
    C2 --> C3
    C3 --> VALID

    VALID --> MAPBOX
    MAPBOX --> TRAFFIC
    TRAFFIC --> SCORE
    SCORE --> RANK
    RANK --> SOLVER
`,
    decisionMatrix: [
      {
        factor: 'Distance Calculation Method',
        optionA: 'Haversine Straight-Line Distance',
        optionB: 'Static Road Network Graph (OSRM)',
        optionC: 'Haversine Pre-Filter + Mapbox Traffic-Aware Matrix API',
        recommendation: 'Haversine radial search in Redis to prune candidates from 100,000 down to 20 near candidates, followed by Mapbox Matrix API for exact traffic-adjusted travel duration.',
      },
      {
        factor: 'Solver Architecture',
        optionA: 'Synchronous API Calculation',
        optionB: 'Asynchronous Job Queue (BullMQ + Google OR-Tools C++ Solver)',
        optionC: 'Pure Heuristic Greedy Match',
        recommendation: 'Async BullMQ Workers backed by C++ Google OR-Tools VRPTW solver with a 2-second timeout circuit breaker falling back to greedy weighted scoring.',
      },
    ],
    codeSnippets: [
      {
        title: 'Multi-Objective Technician Matching & Scoring Engine (TypeScript)',
        language: 'typescript',
        explanation: 'Calculates normalized candidate matching scores incorporating proximity, skills, parts availability, workload, and SLA urgency.',
        code: `export interface ScoringWeights {
  proximity: number;   // default 0.35
  skillFit: number;    // default 0.25
  slaUrgency: number;  // default 0.20
  workload: number;    // default 0.10
  parts: number;       // default 0.10
}

export function calculateTechnicianScore(
  distanceKm: number,
  travelTimeMins: number,
  skillMatchPct: number,
  slaMinutesRemaining: number,
  activeWorkOrders: number,
  hasParts: boolean,
  weights: ScoringWeights = { proximity: 0.35, skillFit: 0.25, slaUrgency: 0.20, workload: 0.10, parts: 0.10 }
): { overallScore: number; breakdown: Record<string, number> } {
  // 1. Proximity Score (Normalized exponential decay curve: 0km = 100, 30km = ~10)
  const maxDistanceKm = 30;
  const proximityScore = Math.max(0, 100 * Math.exp(-distanceKm / 10));

  // 2. Skill Fit Score (Direct Percentage 0 - 100)
  const skillScore = Math.min(100, Math.max(0, skillMatchPct));

  // 3. SLA Urgency Score (Shorter remaining time = higher urgency weight boost)
  const slaUrgencyScore = slaMinutesRemaining <= 60 
    ? 100 
    : Math.max(0, 100 - (slaMinutesRemaining - 60) * 0.25);

  // 4. Workload Score (Fewer active work orders = higher score)
  const maxWorkload = 6;
  const workloadScore = Math.max(0, 100 * (1 - activeWorkOrders / maxWorkload));

  // 5. Parts Inventory Score (Binary match: 100 if tech has required parts in truck)
  const partsScore = hasParts ? 100 : 0;

  // Composite Weighted Sum
  const overallScore = Number((
    (proximityScore * weights.proximity) +
    (skillScore * weights.skillFit) +
    (slaUrgencyScore * weights.slaUrgency) +
    (workloadScore * weights.workload) +
    (partsScore * weights.parts)
  ).toFixed(1));

  return {
    overallScore,
    breakdown: {
      proximityScore: Math.round(proximityScore),
      skillScore: Math.round(skillScore),
      slaUrgencyScore: Math.round(slaUrgencyScore),
      workloadScore: Math.round(workloadScore),
      partsScore: Math.round(partsScore)
    }
  };
}`
      }
    ]
  },
  {
    id: 'cloud-devops',
    title: '5. Cloud Architecture & DevOps Pipeline',
    subtitle: 'AWS EKS / GCP GKE Topologies, Terraform IaC, KEDA Autoscaling & Zero-Downtime Deployments',
    iconName: 'Server',
    description: `Infrastructure is managed strictly via Infrastructure-as-Code (Terraform) across multi-availability-zone Kubernetes clusters. Pods scale dynamically based on request throughput and Kafka consumer group lag via KEDA.`,
    keyMetrics: [
      { label: 'Cluster Scale', value: '45 - 200 EKS Nodes', detail: 'Auto-scaled Spot + On-Demand' },
      { label: 'Deployment Strategy', value: 'Canary / Blue-Green', detail: 'Zero-downtime progressive rollouts' },
      { label: 'Recovery Time (RTO)', value: '< 15 Minutes', detail: 'Multi-AZ automated failover' },
      { label: 'Recovery Point (RPO)', value: '< 1 Second', detail: 'Continuous WAL archiving' },
    ],
    mermaidDiagram: `graph TD
    subgraph "Multi-AZ Kubernetes Cluster (AWS EKS / GCP GKE)"
        subgraph "Ingress & Mesh"
            ALB["AWS Application Load Balancer"]
            ISTIO["Istio Service Mesh - mTLS Enforced"]
        end

        subgraph "System Node Pool (On-Demand)"
            KONG_PODS["Kong Gateway Pods - HPA 8..30"]
            API_PODS["Core API Service Pods - HPA 12..60"]
        end

        subgraph "Telemetry Node Pool (High Network I/O)"
            GO_CONSUMERS["Go Telemetry Ingest Pods - KEDA Kafka Lag Scaled 10..80"]
        end

        subgraph "Worker Node Pool (Spot Instances - Cost Optimized)"
            BULL_WORKERS["AI Dispatch Solver Workers - KEDA Queue Scaled 5..40"]
        end
    end

    subgraph "Managed Data Cloud Infrastructure"
        MSK_KAFKA[("AWS MSK Kafka Cluster - 3 AZs")]
        REDIS_CACHE[("AWS ElastiCache Redis Cluster")]
        AURORA_PG[("AWS Aurora PostgreSQL Serverless v2")]
        TS_TIMESCALE[("Managed Timescale Cloud")]
    end

    ALB --> ISTIO
    ISTIO --> KONG_PODS
    KONG_PODS --> API_PODS

    API_PODS --> AURORA_PG
    API_PODS --> REDIS_CACHE

    GO_CONSUMERS --> MSK_KAFKA
    GO_CONSUMERS --> REDIS_CACHE
    GO_CONSUMERS --> TS_TIMESCALE

    BULL_WORKERS --> REDIS_CACHE
    BULL_WORKERS --> AURORA_PG
`,
    decisionMatrix: [
      {
        factor: 'Container Orchestration',
        optionA: 'Docker Swarm / Bare EC2',
        optionB: 'AWS ECS Fargate',
        optionC: 'AWS EKS / GCP GKE with Karpenter Node Autoscaling',
        recommendation: 'AWS EKS with Karpenter autoscaler. Karpenter provisions right-sized EC2 instances in seconds based on pending pod requirements, leveraging Spot instances for background AI workers.',
      },
    ],
    codeSnippets: [
      {
        title: 'Kubernetes KEDA ScaledObject for Kafka Consumer Group Lag (YAML)',
        language: 'yaml',
        explanation: 'Autoscales Go Telemetry Consumer pods automatically when Kafka partition lag exceeds 500 messages.',
        code: `apiVersion: keda.sh/v1alpha1
kind: ScaledObject
metadata:
  name: telemetry-consumer-scaler
  namespace: fieldops-prod
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: telemetry-consumer-service
  minReplicaCount: 10
  maxReplicaCount: 100
  cooldownPeriod: 60
  pollingInterval: 15
  triggers:
  - type: apache-kafka
    metadata:
      bootstrapServers: msk-kafka.internal:9092
      consumerGroup: telemetry-ingest-group
      topic: telemetry.gps.raw
      lagThreshold: "500"
      offsetResetPolicy: latest`
      },
      {
        title: 'Terraform AWS Aurora PostgreSQL Serverless v2 Infrastructure (HCL)',
        language: 'hcl',
        explanation: 'Provisions multi-AZ PostgreSQL with auto-scaling ACUs and encryption enabled.',
        code: `resource "aws_rds_cluster" "fieldops_aurora" {
  cluster_identifier      = "fieldops-prod-db"
  engine                  = "aurora-postgresql"
  engine_mode             = "provisioned"
  engine_version          = "15.4"
  database_name           = "fieldops_db"
  master_username         = "db_admin"
  master_password         = var.db_password
  storage_encrypted       = true
  kms_key_id              = aws_kms_key.db_kms.arn
  deletion_protection     = true
  backup_retention_period = 30

  serverlessv2_scaling_configuration {
    min_capacity = 2.0
    max_capacity = 128.0
  }
}

resource "aws_rds_cluster_instance" "fieldops_instances" {
  count              = 3
  identifier         = "fieldops-prod-db-instance-\${count.index}"
  cluster_identifier = aws_rds_cluster.fieldops_aurora.id
  instance_class     = "db.serverless"
  engine             = aws_rds_cluster.fieldops_aurora.engine
}`
      }
    ]
  },
  {
    id: 'security-compliance',
    title: '6. Security & Compliance Architecture',
    subtitle: 'Zero-Trust Framework, OAuth 2.0 / OIDC, JWT Revocation, RBAC/ABAC & SOC2 Compliance',
    iconName: 'Lock',
    description: `FieldOps Pro enforces strict security controls for enterprise compliance (SOC2 Type II, HIPAA, ISO 27001). All microservice interactions require mutual TLS (mTLS) via SPIFFE/SPIRE, and data is encrypted using AWS KMS Customer Managed Keys.`,
    keyMetrics: [
      { label: 'Auth Standard', value: 'OAuth 2.0 + OIDC', detail: 'SAML 2.0 for Enterprise SSO' },
      { label: 'Token Expiry', value: '15 Min JWT Access', detail: 'Redis sliding refresh rotation' },
      { label: 'Encryption', value: 'AES-256 / TLS 1.3', detail: 'End-to-End field encryption' },
      { label: 'Audit Logging', value: '100% Mutation CDC', detail: 'Immutable Debezium event stream' },
    ],
    mermaidDiagram: `graph TD
    subgraph "Client Authentication"
        USER["User / Dispatcher / Mobile App"]
        IDP["Enterprise Identity Provider - Okta / Azure AD / Entra ID"]
        AUTH_SVC["Auth & Token Service"]
    end

    subgraph "Token Verification & Enforcement"
        GATEWAY["Kong Gateway - JWT Signature & Revocation Check"]
        REVOCATION_LIST[("Redis Revocation Blacklist")]
    end

    subgraph "RBAC & ABAC Engine"
        PERM{"Evaluate Permissions"}
        ROLE["Check Role: DISPATCHER"]
        ATTR["Check Attributes: tenant_id & geofence_region"]
    end

    subgraph "Service Execution"
        SERVICE["Execute Requested Domain Action"]
        AUDIT["Audit Log Engine - CDC Pipeline"]
    end

    USER -->|Login SSO| IDP
    IDP -->|OIDC Token Code| AUTH_SVC
    AUTH_SVC -->|Issue JWT Access & Refresh Token| USER

    USER -->|Request + Bearer JWT| GATEWAY
    GATEWAY -->|Check Token Revocation| REVOCATION_LIST
    GATEWAY --> PERM

    PERM --> ROLE
    ROLE --> ATTR
    ATTR -->|Pass| SERVICE
    ATTR -->|Fail 403| DENY["Access Denied Logged"]

    SERVICE --> AUDIT
`,
    decisionMatrix: [
      {
        factor: 'Authorization Engine Pattern',
        optionA: 'Simple RBAC (Role-Based Access Control)',
        optionB: 'ABAC (Attribute-Based Access Control)',
        optionC: 'Hybrid RBAC + ABAC (Tenant + Geofence Attribute Boundaries)',
        recommendation: 'Hybrid RBAC + ABAC. Roles specify action permissions (e.g. `work_order:assign`), while attributes enforce strict boundary constraints (e.g. `user.tenant_id == resource.tenant_id AND user.region IN resource.allowed_regions`).',
      },
    ],
    codeSnippets: [
      {
        title: 'ABAC Policy Evaluator & JWT Validator (TypeScript)',
        language: 'typescript',
        explanation: 'Enforces attribute-based boundaries checking tenant matching, role permissions, and geofence region scope.',
        code: `export interface UserJwtClaims {
  sub: string;
  tenantId: string;
  roles: string[];
  allowedRegions: string[];
  exp: number;
}

export interface ResourceContext {
  tenantId: string;
  region: string;
  requiredPermission: string;
}

export function evaluateAbacPolicy(user: UserJwtClaims, resource: ResourceContext): { allowed: boolean; reason?: string } {
  // 1. Strict Tenant Context Boundary Check
  if (user.tenantId !== resource.tenantId) {
    return { allowed: false, reason: 'CROSS_TENANT_ACCESS_DENIED' };
  }

  // 2. Token Expiration Verification
  const now = Math.floor(Date.now() / 1000);
  if (user.exp < now) {
    return { allowed: false, reason: 'TOKEN_EXPIRED' };
  }

  // 3. Permission Role Verification
  const userPermissions = getPermissionsForRoles(user.roles);
  if (!userPermissions.includes(resource.requiredPermission)) {
    return { allowed: false, reason: 'INSUFFICIENT_ROLE_PERMISSIONS' };
  }

  // 4. Attribute Geofence Verification
  if (!user.allowedRegions.includes('*') && !user.allowedRegions.includes(resource.region)) {
    return { allowed: false, reason: 'REGION_SCOPE_UNAUTHORIZED' };
  }

  return { allowed: true };
}

function getPermissionsForRoles(roles: string[]): string[] {
  const map: Record<string, string[]> = {
    ADMIN: ['work_order:*', 'technician:*', 'tenant:*'],
    DISPATCHER: ['work_order:read', 'work_order:create', 'work_order:assign', 'technician:read'],
    TECHNICIAN: ['work_order:read_assigned', 'work_order:update_status', 'telemetry:write']
  };

  const perms = new Set<string>();
  roles.forEach(r => map[r]?.forEach(p => perms.add(p)));
  return Array.from(perms);
}`
      }
    ]
  },
  {
    id: 'database-architecture',
    title: '7. Database & Spatial Data Architecture',
    subtitle: 'PostgreSQL 16+, PostGIS 3.4+, Redis Stack 7.x & Elasticsearch 8.x Data Model & Indexing Strategy',
    iconName: 'Database',
    description: `FieldOps Pro utilizes a multi-tiered data persistence layer engineered for extreme scale: 100,000+ active technicians sending high-frequency GPS telemetry, 5,000,000+ monthly work orders, sub-10ms spatial proximity queries, and instant full-text search across millions of asset and job records. Strict multi-tenant Row-Level Security (RLS) guarantees data privacy at the database kernel level.`,
    keyMetrics: [
      { label: 'PostgreSQL Engine', value: 'v16 + PostGIS 3.4', detail: 'Primary Transactional DB with RLS' },
      { label: 'Spatial Latency', value: '< 8ms P99', detail: 'PostGIS GIST & Redis GEOADD' },
      { label: 'Partition Strategy', value: 'Monthly Range', detail: 'telemetry_history partitioned by month' },
      { label: 'Search Scale', value: 'Sub-second FullText', detail: 'Elasticsearch 8.x Geo + Text Cluster' }
    ],
    mermaidDiagram: `erDiagram
    tenants ||--o{ users : "owns_accounts"
    tenants ||--o{ technicians : "manages_fleet"
    tenants ||--o{ customers : "services_clients"
    customers ||--o{ sites : "owns_facilities"
    sites ||--o{ assets : "houses_equipment"
    sites ||--o{ work_orders : "location_for"
    users ||--o| technicians : "linked_profile"
    technicians ||--o{ work_orders : "assigned_to"
    work_orders ||--o| proof_of_work : "verified_by"
    warehouses ||--o{ inventory : "stores_parts"
    technicians ||--o{ inventory : "van_stock"
    technicians ||--o{ telemetry_history : "emits_breadcrumbs"

    tenants {
        uuid id PK
        string name
        string domain
        jsonb config
        string sla_default_tier
    }
    users {
        uuid id PK
        uuid tenant_id FK
        string email
        string role
        boolean mfa_enabled
    }
    technicians {
        uuid id PK
        uuid tenant_id FK
        uuid user_id FK
        text_array skills
        string vehicle_type
        jsonb working_hours
        string duty_status
        integer battery_status
        geometry location_point
    }
    customers {
        uuid id PK
        uuid tenant_id FK
        string name
        string contact_email
    }
    sites {
        uuid id PK
        uuid tenant_id FK
        uuid customer_id FK
        geometry location_point
        float geofence_radius_meters
    }
    assets {
        uuid id PK
        uuid tenant_id FK
        uuid site_id FK
        string serial_number
        jsonb maintenance_history
    }
    work_orders {
        uuid id PK
        uuid tenant_id FK
        uuid site_id FK
        uuid assigned_technician_id FK
        string priority
        string status
        geometry location_point
        timestamp sla_deadline
    }
    proof_of_work {
        uuid id PK
        uuid tenant_id FK
        uuid work_order_id FK
        string signature_url
        jsonb checklist_responses
        timestamp checkin_time
        timestamp checkout_time
    }
    warehouses {
        uuid id PK
        uuid tenant_id FK
        string name
        geometry location_point
    }
    inventory {
        uuid id PK
        uuid tenant_id FK
        uuid warehouse_id FK
        uuid technician_id FK
        string sku
        integer quantity
        integer reorder_threshold
    }
    telemetry_history {
        uuid id PK
        uuid tenant_id FK
        uuid technician_id FK
        geometry location_point
        float speed
        float heading
        integer battery
        timestamp recorded_at
    }`,
    decisionMatrix: [
      {
        factor: 'Multi-Tenant Data Isolation Strategy',
        optionA: 'Separate Database per Tenant',
        optionB: 'Separate Schema per Tenant',
        optionC: 'Shared Pool with PostgreSQL Row-Level Security (RLS)',
        recommendation: 'Shared Pool with RLS + Dedicated Schemas for Tier-1 Enterprise. PostgreSQL RLS enforces tenant separation natively at the query engine level (`tenant_id = current_setting("app.current_tenant_id")`) preventing data leaks even during raw SQL execution.',
      },
      {
        factor: 'Spatial Indexing Engine',
        optionA: 'B-Tree on Latitude/Longitude',
        optionB: 'PostGIS GIST (Generalized Search Tree) Index',
        optionC: 'Quadtree In-Memory Custom Index',
        recommendation: 'PostGIS GIST Index (`USING GIST(location_point)`). B-Tree fails on 2D spatial queries. GIST provides sub-10ms bounding box and radial queries across millions of geo points using R-Tree algorithms.',
      },
      {
        factor: 'High-Frequency Telemetry Storage',
        optionA: 'Standard Monolithic RDBMS Table',
        optionB: 'PostgreSQL Range Partitioning by Month + TimescaleDB Hypertables',
        optionC: 'NoSQL Document Store (MongoDB)',
        recommendation: 'PostgreSQL Range Partitioning by Month (`telemetry_history_YYYY_MM`). Enables instant partition pruning, automated rolling data retention drop table execution, and compressed chunk storage.',
      },
      {
        factor: 'Search & Filtering Infrastructure',
        optionA: 'PostgreSQL `LIKE` / ILIKE Wildcards',
        optionB: 'PostgreSQL `tsvector` Full Text Search',
        optionC: 'Dedicated Elasticsearch 8.x Cluster',
        recommendation: 'Elasticsearch 8.x Cluster. Handles combined fuzzy full-text search across titles, addresses, and customer names with geo-bounding filters (`geo_point`) in under 50ms.',
      }
    ],
    codeSnippets: [
      {
        title: '1. PostgreSQL 16 + PostGIS Production DDL & RLS Security Engine (SQL)',
        language: 'sql',
        explanation: 'Enables PostGIS & cryptographic extensions, initializes RLS policies with `app.current_tenant_id`, and defines core tables (`tenants`, `users`, `technicians`, `customers`, `sites`, `assets`, `work_orders`, `proof_of_work`, `inventory`, `warehouses`, `telemetry_history`).',
        code: `-- ============================================================================
-- FIELDOPS PRO: ENTERPRISE DATABASE ARCHITECTURE (POSTGRESQL 16 + POSTGIS 3.4)
-- ============================================================================

-- 1. EXTENSION INITIALIZATION
CREATE EXTENSION IF NOT EXISTS "postgis";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "btree_gist";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. ENUM TYPES DECLARATION
CREATE TYPE user_role_enum AS ENUM (
  'SUPER_ADMIN', 'COMPANY_ADMIN', 'DISPATCHER', 'WORKER', 
  'CUSTOMER', 'MANAGER', 'INVENTORY_MANAGER', 'FINANCE_MANAGER'
);

CREATE TYPE duty_status_enum AS ENUM (
  'ONLINE', 'BUSY', 'OFFLINE', 'ON_BREAK'
);

CREATE TYPE work_order_priority_enum AS ENUM (
  'LOW', 'MEDIUM', 'HIGH', 'EMERGENCY'
);

CREATE TYPE work_order_status_enum AS ENUM (
  'PENDING', 'ASSIGNED', 'ACCEPTED', 'EN_ROUTE', 
  'ARRIVED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'
);

-- 3. CORE TABLE DEFINITIONS WITH CONSTRAINTS
-- Tenants Registry Table
CREATE TABLE tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  domain VARCHAR(255) UNIQUE NOT NULL,
  whitelabel_config JSONB NOT NULL DEFAULT '{"theme": "dark", "logo_url": null}'::jsonb,
  sla_default_tier VARCHAR(50) NOT NULL DEFAULT 'STANDARD',
  max_technicians INTEGER NOT NULL DEFAULT 500,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Users & Auth Credentials Table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  role user_role_enum NOT NULL DEFAULT 'WORKER',
  mfa_enabled BOOLEAN NOT NULL DEFAULT FALSE,
  mfa_secret VARCHAR(255),
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uk_users_tenant_email UNIQUE(tenant_id, email)
);

-- Technicians Profile Table
CREATE TABLE technicians (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  skills TEXT[] NOT NULL DEFAULT '{}',
  vehicle_type VARCHAR(100) NOT NULL DEFAULT 'VAN',
  working_hours JSONB NOT NULL DEFAULT '{"mon_fri": {"start": "08:00", "end": "17:00"}}'::jsonb,
  duty_status duty_status_enum NOT NULL DEFAULT 'OFFLINE',
  battery_status INTEGER CHECK (battery_status BETWEEN 0 AND 100),
  location_point GEOMETRY(Point, 4326),
  last_ping_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uk_technician_user UNIQUE(user_id)
);

-- Customers Registry Table
CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  company_name VARCHAR(255) NOT NULL,
  contact_email VARCHAR(255) NOT NULL,
  contact_phone VARCHAR(50) NOT NULL,
  billing_address TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Sites & Facilities Table
CREATE TABLE sites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  site_name VARCHAR(255) NOT NULL,
  address_line TEXT NOT NULL,
  location_point GEOMETRY(Point, 4326) NOT NULL,
  geofence_radius_meters FLOAT NOT NULL DEFAULT 150.0,
  access_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Equipment Assets Table
CREATE TABLE assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  site_id UUID NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
  asset_name VARCHAR(255) NOT NULL,
  serial_number VARCHAR(100) NOT NULL,
  model_number VARCHAR(100),
  warranty_expires_at DATE,
  amc_renewal_date DATE,
  maintenance_history JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uk_asset_tenant_serial UNIQUE(tenant_id, serial_number)
);

-- Work Orders Core Table
CREATE TABLE work_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  site_id UUID NOT NULL REFERENCES sites(id) ON DELETE RESTRICT,
  assigned_technician_id UUID REFERENCES technicians(id) ON DELETE SET NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  priority work_order_priority_enum NOT NULL DEFAULT 'MEDIUM',
  status work_order_status_enum NOT NULL DEFAULT 'PENDING',
  location_point GEOMETRY(Point, 4326) NOT NULL,
  required_skills TEXT[] NOT NULL DEFAULT '{}',
  estimated_duration_mins INTEGER NOT NULL DEFAULT 60,
  sla_deadline TIMESTAMPTZ NOT NULL,
  pricing_estimated NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Proof of Work & Verification Table
CREATE TABLE proof_of_work (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  work_order_id UUID NOT NULL REFERENCES work_orders(id) ON DELETE CASCADE,
  signature_url TEXT,
  attachment_urls TEXT[] NOT NULL DEFAULT '{}',
  checklist_responses JSONB NOT NULL DEFAULT '{}'::jsonb,
  checkin_timestamp TIMESTAMPTZ NOT NULL,
  checkout_timestamp TIMESTAMPTZ,
  checkin_location GEOMETRY(Point, 4326) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uk_pow_work_order UNIQUE(work_order_id)
);

-- Warehouses & Storage Table
CREATE TABLE warehouses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  warehouse_code VARCHAR(50) NOT NULL,
  name VARCHAR(255) NOT NULL,
  location_point GEOMETRY(Point, 4326) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uk_warehouse_code UNIQUE(tenant_id, warehouse_code)
);

-- Inventory & Van Stock Allocations
CREATE TABLE inventory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  warehouse_id UUID REFERENCES warehouses(id) ON DELETE CASCADE,
  technician_id UUID REFERENCES technicians(id) ON DELETE CASCADE,
  sku VARCHAR(100) NOT NULL,
  part_name VARCHAR(255) NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 0 CHECK (quantity >= 0),
  reorder_threshold INTEGER NOT NULL DEFAULT 5,
  unit_cost NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT chk_inventory_location CHECK (
    (warehouse_id IS NOT NULL AND technician_id IS NULL) OR
    (warehouse_id IS NULL AND technician_id IS NOT NULL)
  )
);

-- 4. MULTI-TENANT ROW LEVEL SECURITY (RLS) POLICY ENGINE
-- Enable RLS on all tenant-isolated tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE technicians ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE sites ENABLE ROW LEVEL SECURITY;
ALTER TABLE assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE work_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE proof_of_work ENABLE ROW LEVEL SECURITY;
ALTER TABLE warehouses ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;

-- Standard Multi-Tenant Policy Expression
CREATE POLICY tenant_isolation_users ON users
  FOR ALL USING (tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid);

CREATE POLICY tenant_isolation_technicians ON technicians
  FOR ALL USING (tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid);

CREATE POLICY tenant_isolation_customers ON customers
  FOR ALL USING (tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid);

CREATE POLICY tenant_isolation_sites ON sites
  FOR ALL USING (tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid);

CREATE POLICY tenant_isolation_assets ON assets
  FOR ALL USING (tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid);

CREATE POLICY tenant_isolation_work_orders ON work_orders
  FOR ALL USING (tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid);

CREATE POLICY tenant_isolation_proof_of_work ON proof_of_work
  FOR ALL USING (tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid);

CREATE POLICY tenant_isolation_warehouses ON warehouses
  FOR ALL USING (tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid);

CREATE POLICY tenant_isolation_inventory ON inventory
  FOR ALL USING (tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid);`
      },
      {
        title: '2. Partitioning & Spatial Indexing Strategy (SQL)',
        language: 'sql',
        explanation: 'Monthly range partitioning for telemetry_history table, PostGIS GIST spatial indexes, and high-performance partial B-tree indexes.',
        code: `-- ============================================================================
-- PARTITIONING & HIGH-PERFORMANCE SPATIAL INDEXES
-- ============================================================================

-- 1. RANGE PARTITIONED TELEMETRY TABLE (By Month)
CREATE TABLE telemetry_history (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  technician_id UUID NOT NULL,
  location_point GEOMETRY(Point, 4326) NOT NULL,
  speed_kmh FLOAT DEFAULT 0.0,
  heading_degrees FLOAT DEFAULT 0.0,
  battery_pct INTEGER,
  duty_state duty_status_enum NOT NULL DEFAULT 'ONLINE',
  recorded_at TIMESTAMPTZ NOT NULL,
  PRIMARY KEY (recorded_at, id, tenant_id)
) PARTITION BY RANGE (recorded_at);

-- Attach RLS to Partitioned Parent
ALTER TABLE telemetry_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation_telemetry ON telemetry_history
  FOR ALL USING (tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid);

-- Monthly Partition Tables
CREATE TABLE telemetry_history_2026_08 PARTITION OF telemetry_history
  FOR VALUES FROM ('2026-08-01 00:00:00+00') TO ('2026-09-01 00:00:00+00');

CREATE TABLE telemetry_history_2026_09 PARTITION OF telemetry_history
  FOR VALUES FROM ('2026-09-01 00:00:00+00') TO ('2026-10-01 00:00:00+00');

CREATE TABLE telemetry_history_default PARTITION OF telemetry_history DEFAULT;

-- 2. POSTGIS GIST SPATIAL INDEXES (Sub-10ms 2D Proximity)
CREATE INDEX idx_technicians_spatial ON technicians USING GIST (location_point);
CREATE INDEX idx_work_orders_spatial ON work_orders USING GIST (location_point);
CREATE INDEX idx_sites_spatial ON sites USING GIST (location_point);
CREATE INDEX idx_telemetry_spatial ON telemetry_history USING GIST (location_point);

-- 3. PARTIAL B-TREE INDEXES FOR ACTIVE DISPATCH EFFICIENCY
-- Fast lookup for online technicians available for dispatch
CREATE INDEX idx_technicians_online_dispatch 
  ON technicians (tenant_id, duty_status) 
  WHERE duty_status = 'ONLINE';

-- Fast lookup for pending / active work orders
CREATE INDEX idx_work_orders_active_dispatch 
  ON work_orders (tenant_id, priority, sla_deadline) 
  WHERE status NOT IN ('COMPLETED', 'CANCELLED');

-- Array GIN index for skill-matching queries
CREATE INDEX idx_technicians_skills_gin ON technicians USING GIN (skills);
CREATE INDEX idx_work_orders_skills_gin ON work_orders USING GIN (required_skills);`
      },
      {
        title: '3. Geospatial PostGIS Stored Functions (SQL)',
        language: 'sql',
        explanation: 'Production PostGIS stored functions for nearest technician spatial ranking and automated geofence arrival detection.',
        code: `-- ============================================================================
-- HIGH-PERFORMANCE POSTGIS STORED FUNCTIONS
-- ============================================================================

-- Function 1: Find Nearest Qualified Technicians within Radius
CREATE OR REPLACE FUNCTION fn_find_nearest_technicians(
  p_tenant_id UUID,
  p_job_lat FLOAT,
  p_job_lng FLOAT,
  p_required_skill TEXT DEFAULT NULL,
  p_radius_km FLOAT DEFAULT 50.0
)
RETURNS TABLE (
  technician_id UUID,
  user_first_name VARCHAR,
  user_last_name VARCHAR,
  distance_km FLOAT,
  duty_status duty_status_enum,
  battery_status INT,
  skills TEXT[]
)
LANGUAGE plpgsql
STABLE
AS $$
DECLARE
  v_job_point GEOMETRY;
BEGIN
  -- Construct EPSG:4326 Point Geometry
  v_job_point := ST_SetSRID(ST_MakePoint(p_job_lng, p_job_lat), 4326);

  RETURN QUERY
  SELECT 
    t.id AS technician_id,
    u.first_name AS user_first_name,
    u.last_name AS user_last_name,
    (ST_DistanceSphere(t.location_point, v_job_point) / 1000.0) AS distance_km,
    t.duty_status,
    t.battery_status,
    t.skills
  FROM technicians t
  JOIN users u ON u.id = t.user_id
  WHERE t.tenant_id = p_tenant_id
    AND t.duty_status IN ('ONLINE', 'BUSY')
    AND t.location_point IS NOT NULL
    AND ST_DWithin(t.location_point::geography, v_job_point::geography, p_radius_km * 1000.0)
    AND (p_required_skill IS NULL OR p_required_skill = ANY(t.skills))
  ORDER BY 
    ST_DistanceSphere(t.location_point, v_job_point) ASC
  LIMIT 25;
END;
$$;

-- Function 2: Check Geofence Arrival Status
CREATE OR REPLACE FUNCTION fn_check_geofence_arrival(
  p_work_order_id UUID,
  p_tech_lat FLOAT,
  p_tech_lng FLOAT
)
RETURNS TABLE (
  is_within_geofence BOOLEAN,
  distance_meters FLOAT,
  site_geofence_radius FLOAT
)
LANGUAGE plpgsql
STABLE
AS $$
DECLARE
  v_tech_point GEOMETRY;
  v_site_point GEOMETRY;
  v_radius FLOAT;
  v_dist FLOAT;
BEGIN
  v_tech_point := ST_SetSRID(ST_MakePoint(p_tech_lng, p_tech_lat), 4326);

  SELECT s.location_point, s.geofence_radius_meters
    INTO v_site_point, v_radius
  FROM work_orders wo
  JOIN sites s ON s.id = wo.site_id
  WHERE wo.id = p_work_order_id;

  IF v_site_point IS NULL THEN
    RAISE EXCEPTION 'Work order or site location not found for ID %', p_work_order_id;
  END IF;

  v_dist := ST_DistanceSphere(v_tech_point, v_site_point);

  RETURN QUERY
  SELECT 
    (v_dist <= v_radius) AS is_within_geofence,
    v_dist AS distance_meters,
    v_radius AS site_geofence_radius;
END;
$$;`
      },
      {
        title: '4. Redis Stack Key Naming Conventions & Data Structures (Redis Command / Spec)',
        language: 'json',
        explanation: 'Documented Redis Stack data structures, key patterns, TTL settings, and concurrency lock rules.',
        code: `{
  "redis_version": "Redis Stack 7.2+",
  "key_patterns": [
    {
      "pattern": "tenant:{tenant_id}:techs",
      "type": "GEO",
      "ttl": "PERMANENT",
      "description": "Live spatial index of technician current locations.",
      "example_cmd": "GEOADD tenant:tenant-acme-ops:techs -122.4194 37.7749 tech-101",
      "query_cmd": "GEOSEARCH tenant:tenant-acme-ops:techs FROMLONLAT -122.4194 37.7749 BYRADIUS 15 km ASC WITHDIST WITHCOORD"
    },
    {
      "pattern": "auth:session:{user_id}",
      "type": "STRING (JSON)",
      "ttl": "86400s (24 Hours)",
      "description": "Authenticated user session context, permissions array, and current active tenant.",
      "example_cmd": "SET auth:session:usr-8812 '{\"tenant_id\":\"tenant-acme\",\"role\":\"DISPATCHER\"}' EX 86400"
    },
    {
      "pattern": "lock:dispatch:{work_order_id}",
      "type": "STRING (Redlock)",
      "ttl": "10s",
      "description": "Distributed mutex lock preventing duplicate simultaneous auto-dispatch assignments.",
      "example_cmd": "SET lock:dispatch:wo-9901 'node-worker-04' NX PX 10000"
    },
    {
      "pattern": "rate:{ip}:{endpoint}",
      "type": "HASH / Sliding Window",
      "ttl": "60s",
      "description": "Tenant & IP API rate-limiter bucket tracking request count per minute.",
      "example_cmd": "HINCRBY rate:192.168.1.1:/api/telemetry count 1"
    }
  ]
}`
      },
      {
        title: '5. Elasticsearch 8.x Index Mapping Schema (`work_orders_index`) (JSON)',
        language: 'json',
        explanation: 'Production Elasticsearch 8.x index mapping for fast full-text title/address search, keyword tenant filtering, and spatial geo_point location matching.',
        code: `{
  "index_name": "work_orders_index_v1",
  "settings": {
    "number_of_shards": 3,
    "number_of_replicas": 1,
    "index": {
      "max_result_window": 10000,
      "refresh_interval": "1s"
    },
    "analysis": {
      "analyzer": {
        "address_analyzer": {
          "type": "custom",
          "tokenizer": "standard",
          "filter": ["lowercase", "asciifolding", "stop"]
        }
      }
    }
  },
  "mappings": {
    "properties": {
      "work_order_id": { "type": "keyword" },
      "tenant_id": { "type": "keyword" },
      "title": { 
        "type": "text",
        "fields": { "keyword": { "type": "keyword", "ignore_above": 256 } }
      },
      "description": { "type": "text" },
      "customer_name": { 
        "type": "text",
        "fields": { "keyword": { "type": "keyword" } }
      },
      "address": { 
        "type": "text",
        "analyzer": "address_analyzer"
      },
      "status": { "type": "keyword" },
      "priority": { "type": "keyword" },
      "assigned_to": { "type": "keyword" },
      "required_skills": { "type": "keyword" },
      "location": { "type": "geo_point" },
      "sla_deadline": { "type": "date" },
      "created_at": { "type": "date" }
    }
  }
}`
      }
    ]
  },
  {
    id: 'api-and-dispatch-engine',
    title: '8. REST API, WebSockets & Auto-Dispatch Algorithm',
    subtitle: 'OpenAPI 3.0 Specs, Socket.IO v4 Contracts & Production TypeScript Solver Module',
    iconName: 'Code',
    description: 'FieldOps Pro exposes an enterprise-grade OpenAPI 3.0 REST interface alongside a low-latency Socket.IO v4 WebSocket protocol. High-throughput telemetry streams into an in-memory solver engine that evaluates candidates using a multi-factor composite scoring function (proximity, skill fit, workload balance, SLA urgency, and vehicle equipment).',
    keyMetrics: [
      { label: 'OpenAPI Version', value: '3.0.3 Spec', detail: 'Strict REST JSON API Standard' },
      { label: 'WebSocket Protocol', value: 'Socket.IO v4', detail: 'Room hierarchy + Binary Telemetry' },
      { label: 'Solver Latency', value: '< 5ms P99', detail: '500 Candidates Multi-Factor Scoring' },
      { label: 'Scoring Vectors', value: '5 Weighted Factors', detail: 'Proximity, Skill, Workload, SLA, Parts' }
    ],
    mermaidDiagram: `graph TD
    subgraph "API & Gateway Layer"
        GATEWAY["Kong API Gateway (OAuth2 / Bearer JWT + X-Tenant-ID)"]
        REST_AUTH["POST /api/v1/auth/*"]
        REST_WO["GET/POST/PATCH /api/v1/work-orders/*"]
        REST_DISPATCH["POST /api/v1/dispatch/*"]
        REST_TRACK["GET /api/v1/customer/track/*"]
    end

    subgraph "Real-Time WebSocket Protocol (Socket.IO v4)"
        WSS_HANDSHAKE["Connection Handshake & JWT Verification"]
        ROOM_DISPATCH["tenant:{id}:dispatchers"]
        ROOM_TECH["tenant:{id}:tech:{id}"]
        ROOM_JOB["job:{work_order_id}"]
    end

    subgraph "Intelligent GPS Auto-Dispatch Solver"
        WO_REQ["Work Order Input: Location, Skills, SLA, Priority"]
        FLEET_CANDIDATES["Active Fleet Filter: Redis GEOSEARCH & RLS"]
        MULTI_SCORE["Multi-Factor Scoring: W_dist(35%), W_skill(25%), W_work(15%), W_sla(15%), W_parts(10%)"]
        CONSTRAINT_CHECK{"Hard Constraints Met? (Battery > 15%, Shift Hours, Skills)"}
        DISPATCH_RESULT["Assign Top Candidate & Publish Event"]
    end

    GATEWAY --> REST_AUTH
    GATEWAY --> REST_WO
    GATEWAY --> REST_DISPATCH
    GATEWAY --> REST_TRACK

    WSS_HANDSHAKE --> ROOM_DISPATCH
    WSS_HANDSHAKE --> ROOM_TECH
    WSS_HANDSHAKE --> ROOM_JOB

    REST_DISPATCH --> WO_REQ
    WO_REQ --> FLEET_CANDIDATES
    FLEET_CANDIDATES --> MULTI_SCORE
    MULTI_SCORE --> CONSTRAINT_CHECK
    CONSTRAINT_CHECK -->|Pass| DISPATCH_RESULT
`,
    decisionMatrix: [
      {
        factor: 'API Architecture Choice',
        optionA: 'GraphQL Unified API',
        optionB: 'gRPC Protobuf Services',
        optionC: 'OpenAPI 3.0 REST + Socket.IO WebSockets',
        recommendation: 'OpenAPI 3.0 REST + Socket.IO WebSockets. Provides standard client SDK compatibility for web & mobile apps while Socket.IO enables multiplexed, low-latency room-based event broadcasting.',
      },
      {
        factor: 'Auto-Dispatch Solver Execution Model',
        optionA: 'Asynchronous Batch Cron Job (Every 10 mins)',
        optionB: 'Real-Time Event-Driven In-Memory Solver Node',
        optionC: 'Database Trigger-Based Stored Procedure',
        recommendation: 'Real-Time Event-Driven In-Memory Solver Node. Evaluates 500 candidate technicians in <5ms upon work order creation, ensuring instantaneous response for emergency SLAs.',
      }
    ],
    codeSnippets: [
      {
        title: '1. OpenAPI 3.0 RESTful API Specification (JSON / YAML Spec)',
        language: 'json',
        explanation: 'Complete OpenAPI 3.0 spec for Authentication, Dispatch, Work Orders, Telemetry, and Customer Public Tracking Portal.',
        code: `{
  "openapi": "3.0.3",
  "info": {
    "title": "FieldOps Pro Enterprise API",
    "version": "1.0.0",
    "description": "Production REST API for FSM, Auto-Dispatch, Work Orders, and GPS Telemetry"
  },
  "servers": [
    { "url": "https://api.fieldopspro.com/api/v1", "description": "Production Cluster" }
  ],
  "security": [
    { "BearerAuth": [], "TenantHeader": [] }
  ],
  "paths": {
    "/auth/login": {
      "post": {
        "summary": "Authenticate User & Issue JWT Session",
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "required": ["email", "password", "tenant_id"],
                "properties": {
                  "email": { "type": "string", "format": "email" },
                  "password": { "type": "string" },
                  "tenant_id": { "type": "string", "format": "uuid" }
                }
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Tokens Issued",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "access_token": { "type": "string" },
                    "refresh_token": { "type": "string" },
                    "expires_in": { "type": "integer", "example": 900 },
                    "mfa_required": { "type": "boolean" }
                  }
                }
              }
            }
          },
          "401": { "description": "Invalid Credentials" }
        }
      }
    },
    "/auth/refresh": {
      "post": {
        "summary": "Sliding JWT Token Rotation",
        "responses": {
          "200": { "description": "New Access Token Issued" },
          "401": { "description": "Expired or Revoked Refresh Token" }
        }
      }
    },
    "/auth/mfa/verify": {
      "post": {
        "summary": "Verify Time-Based OTP (TOTP) Security Code",
        "responses": { "200": { "description": "MFA Verified" } }
      }
    },
    "/dispatch/auto-assign": {
      "post": {
        "summary": "Trigger Multi-Variable AI Candidate Scoring & Auto-Assign",
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "required": ["work_order_id"],
                "properties": {
                  "work_order_id": { "type": "string", "format": "uuid" },
                  "custom_weights": {
                    "type": "object",
                    "properties": {
                      "proximity": { "type": "number", "example": 0.35 },
                      "skillFit": { "type": "number", "example": 0.25 },
                      "workload": { "type": "number", "example": 0.15 },
                      "slaUrgency": { "type": "number", "example": 0.15 },
                      "vehicleEquipment": { "type": "number", "example": 0.10 }
                    }
                  }
                }
              }
            }
          }
        },
        "responses": {
          "200": { "description": "Optimal Technician Assigned & Dispatched" },
          "409": { "description": "Dispatch Mutex Lock Conflict" },
          "422": { "description": "No Qualified Technicians Met Hard Constraints" }
        }
      }
    },
    "/dispatch/matrix": {
      "post": {
        "summary": "Batch ETA & Distance Matrix Calculation",
        "responses": { "200": { "description": "Distance & Travel Matrix Calculated" } }
      }
    },
    "/dispatch/override": {
      "post": {
        "summary": "Manual Dispatcher Assignment Override with Audit Log",
        "responses": { "200": { "description": "Manual Assignment Recorded" } }
      }
    },
    "/work-orders": {
      "get": {
        "summary": "Paginated Work Orders Query",
        "parameters": [
          { "name": "page", "in": "query", "schema": { "type": "integer", "default": 1 } },
          { "name": "status", "in": "query", "schema": { "type": "string" } },
          { "name": "priority", "in": "query", "schema": { "type": "string" } }
        ],
        "responses": { "200": { "description": "Work Orders Array" } }
      },
      "post": {
        "summary": "Create Work Order with Location Point & SLA",
        "responses": { "201": { "description": "Work Order Created" } }
      }
    },
    "/work-orders/{id}/status": {
      "patch": {
        "summary": "Work Order State Machine Transition",
        "parameters": [{ "name": "id", "in": "path", "required": true, "schema": { "type": "string" } }],
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "required": ["status"],
                "properties": {
                  "status": { "type": "string", "enum": ["ACCEPTED", "EN_ROUTE", "ARRIVED", "IN_PROGRESS", "COMPLETED", "CANCELLED"] },
                  "location": {
                    "type": "object",
                    "properties": { "latitude": { "type": "number" }, "longitude": { "type": "number" } }
                  }
                }
              }
            }
          }
        },
        "responses": { "200": { "description": "Status Updated" } }
      }
    },
    "/work-orders/{id}/proof": {
      "post": {
        "summary": "Upload Signature Base64, Photos, and Parts Checklist",
        "responses": { "200": { "description": "Proof of Work Verified" } }
      }
    },
    "/telemetry/ping": {
      "post": {
        "summary": "High-Frequency GPS Ping Ingestion from Mobile App",
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "required": ["latitude", "longitude", "battery_level", "duty_status"],
                "properties": {
                  "latitude": { "type": "number" },
                  "longitude": { "type": "number" },
                  "speed": { "type": "number" },
                  "heading": { "type": "number" },
                  "battery_level": { "type": "integer" },
                  "duty_status": { "type": "string" }
                }
              }
            }
          }
        },
        "responses": { "200": { "description": "Ping Ingested & Redis Spatial Index Updated" } }
      }
    },
    "/technicians/nearby": {
      "get": {
        "summary": "Query Nearby Techs using PostGIS & Redis GEOSEARCH",
        "responses": { "200": { "description": "Nearby Techs List" } }
      }
    },
    "/customer/track/{tracking_token}": {
      "get": {
        "summary": "Public Live Tracking Endpoint for End-Customers",
        "parameters": [{ "name": "tracking_token", "in": "path", "required": true, "schema": { "type": "string" } }],
        "responses": {
          "200": {
            "description": "Public Tech Coordinates, Polyline & Live ETA",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "technician_name": { "type": "string" },
                    "vehicle_type": { "type": "string" },
                    "current_location": { "type": "object" },
                    "eta_minutes": { "type": "integer" },
                    "route_polyline": { "type": "string" }
                  }
                }
              }
            }
          }
        }
      }
    }
  },
  "components": {
    "securitySchemes": {
      "BearerAuth": { "type": "http", "scheme": "bearer", "bearerFormat": "JWT" },
      "TenantHeader": { "type": "apiKey", "in": "header", "name": "X-Tenant-ID" }
    }
  }
}`
      },
      {
        title: '2. Real-Time WebSocket Protocol Specification (Socket.IO v4 Spec)',
        language: 'json',
        explanation: 'Detailed room hierarchy, authentication handshake protocol, client events, and server broadcast payloads.',
        code: `{
  "protocol": "Socket.IO v4 / WebSocket",
  "transports": ["websocket"],
  "handshake": {
    "auth": {
      "token": "Bearer <jwt_access_token>",
      "tenant_id": "uuid-v4-string"
    },
    "connection_validation": "Socket middleware verifies JWT signature against Redis revocation list & extracts user_id, role, tenant_id before join."
  },
  "room_hierarchy": {
    "dispatcher_room": "tenant:{tenant_id}:dispatchers",
    "technician_room": "tenant:{tenant_id}:tech:{technician_id}",
    "work_order_room": "job:{work_order_id}"
  },
  "client_to_server_events": [
    {
      "event": "telemetry:location_update",
      "description": "Emitted by Technician Mobile App every 5s",
      "payload": {
        "technician_id": "uuid",
        "latitude": 37.7749,
        "longitude": -122.4194,
        "speed_kmh": 42.5,
        "heading_deg": 180.0,
        "battery_level": 84,
        "duty_status": "ONLINE",
        "timestamp": "2026-08-01T13:45:00.000Z"
      }
    },
    {
      "event": "job:status_update",
      "description": "Emitted by Technician when updating job state",
      "payload": {
        "work_order_id": "uuid",
        "status": "ARRIVED",
        "timestamp": "2026-08-01T13:46:12.000Z",
        "coordinates": { "latitude": 37.7750, "longitude": -122.4190 }
      }
    },
    {
      "event": "sos:trigger_panic",
      "description": "High-priority emergency alert from technician app",
      "payload": {
        "technician_id": "uuid",
        "latitude": 37.7749,
        "longitude": -122.4194,
        "timestamp": "2026-08-01T13:47:00.000Z",
        "battery": 12
      }
    }
  ],
  "server_to_client_events": [
    {
      "event": "dispatch:assignment_notification",
      "target_room": "tenant:{tenant_id}:tech:{technician_id}",
      "payload": {
        "work_order_id": "uuid",
        "title": "Emergency HVAC Compressor Repair",
        "customer_name": "Acme Plaza",
        "address": "100 Market St, San Francisco, CA",
        "location": { "latitude": 37.7749, "longitude": -122.4194 },
        "sla_deadline": "2026-08-01T14:30:00.000Z",
        "required_skills": ["HVAC Certified", "High Voltage"]
      }
    },
    {
      "event": "telemetry:broadcast_location",
      "target_room": "tenant:{tenant_id}:dispatchers",
      "payload": {
        "technician_id": "uuid",
        "name": "Alex Rivera",
        "location": { "latitude": 37.7749, "longitude": -122.4194 },
        "duty_status": "ONLINE",
        "battery": 84
      }
    },
    {
      "event": "geofence:auto_checkin_triggered",
      "target_room": "job:{work_order_id}",
      "payload": {
        "work_order_id": "uuid",
        "technician_id": "uuid",
        "event": "ARRIVED_AT_SITE",
        "distance_meters": 42.1,
        "timestamp": "2026-08-01T13:46:12.000Z"
      }
    }
  ]
}`
      },
      {
        title: '3. Intelligent GPS Auto-Dispatch Algorithm (`AutoDispatchEngine.ts`) (TypeScript)',
        language: 'typescript',
        explanation: 'Production-ready TypeScript implementation of the multi-factor candidate ranking solver (`executeAutoDispatchEngine`). Enforces hard constraints (battery > 15%, status, skills, capacity, shift hours) and applies weighted scoring (proximity 35%, skill 25%, workload 15%, SLA 15%, parts 10%).',
        code: `/**
 * FieldOps Pro - Intelligent GPS Auto-Dispatch Engine Module
 * Production-grade multi-objective matching solver (<5ms P99 execution time)
 */

export type WorkOrderPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'EMERGENCY' | 'CRITICAL';
export type DutyStatus = 'ONLINE' | 'BUSY' | 'OFFLINE' | 'ON_BREAK';

export interface LocationCoordinates {
  latitude: number;
  longitude: number;
}

export interface WorkOrderDispatchPayload {
  id: string;
  tenantId: string;
  title: string;
  location: LocationCoordinates;
  priority: WorkOrderPriority;
  requiredSkills: string[];
  requiredCertifications?: string[];
  requiredParts?: string[];
  slaDeadline: Date | string;
  estimatedDurationMins: number;
}

export interface TechnicianProfile {
  id: string;
  tenantId: string;
  name: string;
  dutyStatus: DutyStatus;
  location: LocationCoordinates;
  skills: string[];
  certifications?: string[];
  vehicleParts?: string[];
  activeWorkOrderCount: number;
  maxCapacity: number;
  batteryLevel: number;
  remainingShiftHours: number;
  vehicleType: string;
}

export interface DispatchWeights {
  proximity: number;        // W_dist  (35%)
  skillMatch: number;       // W_skill (25%)
  workload: number;         // W_work  (15%)
  slaUrgency: number;       // W_sla   (15%)
  vehicleEquipment: number; // W_parts (10%)
}

export interface CandidateEvaluationResult {
  technicianId: string;
  technicianName: string;
  compositeScore: number;
  hardConstraintsMet: boolean;
  failedConstraints: string[];
  metrics: {
    distanceKm: number;
    travelTimeMins: number;
    proximityScore: number;
    skillMatchPercent: number;
    workloadScore: number;
    slaUrgencyScore: number;
    equipmentScore: number;
  };
}

export interface AutoDispatchResponse {
  workOrderId: string;
  assignedTechnician: CandidateEvaluationResult | null;
  rankedCandidates: CandidateEvaluationResult[];
  evaluatedCount: number;
  executionTimeMs: number;
  status: 'OPTIMAL_MATCH_FOUND' | 'NO_QUALIFIED_TECHNICIANS' | 'INSUFFICIENT_CAPACITY';
}

/**
 * Calculates Haversine distance in kilometers between two geo points.
 */
export function calculateHaversineDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Number((R * c).toFixed(2));
}

export const DEFAULT_DISPATCH_WEIGHTS: DispatchWeights = {
  proximity: 0.35,
  skillMatch: 0.25,
  workload: 0.15,
  slaUrgency: 0.15,
  vehicleEquipment: 0.10,
};

/**
 * Main Candidate Evaluation Loop & Optimization Solver
 */
export function executeAutoDispatchEngine(
  workOrder: WorkOrderDispatchPayload,
  technicians: TechnicianProfile[],
  weights: DispatchWeights = DEFAULT_DISPATCH_WEIGHTS
): AutoDispatchResponse {
  const startTime = performance.now();

  const deadlineDate = typeof workOrder.slaDeadline === 'string' ? new Date(workOrder.slaDeadline) : workOrder.slaDeadline;
  const now = new Date();
  const slaRemainingMins = Math.max(0, Math.round((deadlineDate.getTime() - now.getTime()) / (1000 * 60)));

  const rankedCandidates: CandidateEvaluationResult[] = [];

  for (let i = 0; i < technicians.length; i++) {
    const tech = technicians[i];
    const failedConstraints: string[] = [];

    // --- Hard Constraints Evaluation ---
    if (tech.dutyStatus === 'OFFLINE' || tech.dutyStatus === 'ON_BREAK') {
      failedConstraints.push(\`Status is \${tech.dutyStatus}\`);
    }

    if (tech.batteryLevel < 15) {
      failedConstraints.push(\`Battery level low (\${tech.batteryLevel}% < 15%)\`);
    }

    if (tech.remainingShiftHours < workOrder.estimatedDurationMins / 60) {
      failedConstraints.push(\`Remaining shift (\${tech.remainingShiftHours}h) insufficient\`);
    }

    const techSkills = tech.skills || [];
    const missingSkills = workOrder.requiredSkills.filter(
      (req) => !techSkills.some((s) => s.toLowerCase() === req.toLowerCase())
    );
    if (missingSkills.length > 0) {
      failedConstraints.push(\`Missing skills: \${missingSkills.join(', ')}\`);
    }

    if (tech.activeWorkOrderCount >= tech.maxCapacity) {
      failedConstraints.push(\`Max capacity reached (\${tech.activeWorkOrderCount}/\${tech.maxCapacity})\`);
    }

    const hardConstraintsMet = failedConstraints.length === 0;

    // --- Multi-Factor Scoring Metrics ---
    const distanceKm = calculateHaversineDistanceKm(
      tech.location.latitude, tech.location.longitude,
      workOrder.location.latitude, workOrder.location.longitude
    );
    const travelTimeMins = Math.round((distanceKm / 35) * 60) + 5;
    const proximityScore = Math.max(0, 100 * Math.exp(-distanceKm / 12));

    const skillMatchPercent = workOrder.requiredSkills.length > 0
      ? Math.round(((workOrder.requiredSkills.length - missingSkills.length) / workOrder.requiredSkills.length) * 100)
      : 100;

    const workloadScore = Math.max(0, 100 * (1 - tech.activeWorkOrderCount / Math.max(1, tech.maxCapacity)));

    let slaUrgencyScore = 100;
    if (slaRemainingMins < travelTimeMins) {
      slaUrgencyScore = 10;
    } else if (slaRemainingMins < 60) {
      slaUrgencyScore = Math.round(100 - ((60 - slaRemainingMins) / 60) * 40);
    }

    let equipmentScore = 100;
    if (workOrder.requiredParts && workOrder.requiredParts.length > 0) {
      const techParts = tech.vehicleParts || [];
      const matchedParts = workOrder.requiredParts.filter((p) =>
        techParts.some((tp) => tp.toLowerCase() === p.toLowerCase())
      );
      equipmentScore = Math.round((matchedParts.length / workOrder.requiredParts.length) * 100);
    }

    // Weighted Score Summary
    const totalWeights = weights.proximity + weights.skillMatch + weights.workload + weights.slaUrgency + weights.vehicleEquipment;
    const rawComposite = (
      proximityScore * weights.proximity +
      skillMatchPercent * weights.skillMatch +
      workloadScore * weights.workload +
      slaUrgencyScore * weights.slaUrgency +
      equipmentScore * weights.vehicleEquipment
    ) / (totalWeights || 1);

    const finalScore = hardConstraintsMet ? Number(rawComposite.toFixed(1)) : Number((rawComposite * 0.2).toFixed(1));

    rankedCandidates.push({
      technicianId: tech.id,
      technicianName: tech.name,
      compositeScore: finalScore,
      hardConstraintsMet: hardConstraintsMet && failedConstraints.length === 0,
      failedConstraints,
      metrics: {
        distanceKm,
        travelTimeMins,
        proximityScore: Number(proximityScore.toFixed(1)),
        skillMatchPercent,
        workloadScore: Number(workloadScore.toFixed(1)),
        slaUrgencyScore,
        equipmentScore
      }
    });
  }

  rankedCandidates.sort((a, b) => b.compositeScore - a.compositeScore);
  const bestCandidate = rankedCandidates.find((c) => c.hardConstraintsMet) || null;
  const endTime = performance.now();

  return {
    workOrderId: workOrder.id,
    assignedTechnician: bestCandidate,
    rankedCandidates,
    evaluatedCount: technicians.length,
    executionTimeMs: Number((endTime - startTime).toFixed(2)),
    status: bestCandidate ? 'OPTIMAL_MATCH_FOUND' : 'NO_QUALIFIED_TECHNICIANS'
  };
}`
      }
    ]
  }
];

export const MOCK_TECHNICIANS = [
  {
    id: 'tech-101',
    name: 'Marcus Vance',
    tenantId: 'tenant-acme-ops',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    currentLat: 37.7749,
    currentLng: -122.4194,
    distanceKm: 3.2,
    travelTimeMins: 8,
    skills: ['HVAC Certified', 'Electrical Master', 'High Voltage'],
    skillMatchPercent: 100,
    slaUrgencyScore: 90,
    activeWorkOrders: 1,
    workloadScore: 83,
    hasParts: true,
    overallScore: 92.4,
    hardConstraintsMet: true,
    failedConstraints: [],
  },
  {
    id: 'tech-102',
    name: 'Elena Rostova',
    tenantId: 'tenant-acme-ops',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80',
    currentLat: 37.7833,
    currentLng: -122.4167,
    distanceKm: 4.8,
    travelTimeMins: 12,
    skills: ['HVAC Certified', 'Plumbing Journeyman'],
    skillMatchPercent: 75,
    slaUrgencyScore: 90,
    activeWorkOrders: 0,
    workloadScore: 100,
    hasParts: true,
    overallScore: 86.1,
    hardConstraintsMet: true,
    failedConstraints: [],
  },
  {
    id: 'tech-103',
    name: 'David Chen',
    tenantId: 'tenant-acme-ops',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    currentLat: 37.7600,
    currentLng: -122.4350,
    distanceKm: 8.5,
    travelTimeMins: 21,
    skills: ['Electrical Master', 'Solar Specialist'],
    skillMatchPercent: 50,
    slaUrgencyScore: 90,
    activeWorkOrders: 3,
    workloadScore: 50,
    hasParts: false,
    overallScore: 61.3,
    hardConstraintsMet: false,
    failedConstraints: ['Missing Parts: Compressor Valve TXV-9'],
  },
  {
    id: 'tech-104',
    name: 'Sarah Jenkins',
    tenantId: 'tenant-acme-ops',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80',
    currentLat: 37.7910,
    currentLng: -122.4010,
    distanceKm: 2.1,
    travelTimeMins: 6,
    skills: ['HVAC Certified', 'Gas Pipe Specialist', 'High Voltage'],
    skillMatchPercent: 100,
    slaUrgencyScore: 90,
    activeWorkOrders: 4,
    workloadScore: 33,
    hasParts: true,
    overallScore: 79.8,
    hardConstraintsMet: true,
    failedConstraints: [],
  },
];
