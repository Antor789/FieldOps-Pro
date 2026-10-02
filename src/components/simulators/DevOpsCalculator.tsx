import React, { useState } from 'react';
import { Server, HardDrive, Cpu, DollarSign } from 'lucide-react';

export const DevOpsCalculator: React.FC = () => {
  const [techCount, setTechCount] = useState(100000);
  const [pingIntervalSec, setPingIntervalSec] = useState(3);
  const [workOrdersPerMonth, setWorkOrdersPerMonth] = useState(5000000);
  const [cloudProvider, setCloudProvider] = useState<'AWS' | 'GCP'>('AWS');

  // Calculations
  const pingsPerSec = Math.round(techCount / pingIntervalSec);
  const dailyGbGpsTelemetry = Number(((pingsPerSec * 86400 * 112) / (1024 * 1024 * 1024)).toFixed(1));
  const monthlyTbTelemetry = Number(((dailyGbGpsTelemetry * 30) / 1024).toFixed(2));

  // Node sizing
  const telemetryConsumerPods = Math.max(8, Math.ceil(pingsPerSec / 3500));
  const apiPods = Math.max(12, Math.ceil(techCount / 3000));
  const solverPods = Math.max(6, Math.ceil(workOrdersPerMonth / 800000));

  const totalEksNodes = Math.max(20, Math.ceil((telemetryConsumerPods + apiPods + solverPods) / 4));

  // Infrastructure cost estimates
  const eksComputeCost = totalEksNodes * 280; // avg $280/mo per c6i.2xlarge
  const kafkaMskCost = Math.max(1200, Math.round(pingsPerSec * 0.12));
  const postgresAuroraCost = Math.max(1800, Math.round(workOrdersPerMonth / 2500));
  const redisCacheCost = Math.max(800, Math.round(techCount / 100)) * 0.9;
  const storageBandwidthCost = Math.round(dailyGbGpsTelemetry * 30 * 0.025);

  const totalMonthlyCost = Math.round(eksComputeCost + kafkaMskCost + postgresAuroraCost + redisCacheCost + storageBandwidthCost);

  return (
    <div className="my-8 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl text-slate-100">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-6 border-b border-slate-800 gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Server className="w-6 h-6 text-purple-400" />
            <h3 className="text-xl font-bold">DevOps Infrastructure Capacity & Cost Calculator</h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Calculate Kubernetes node pools, Kafka MSK broker counts, Aurora ACU sizing, and monthly cloud infrastructure cost breakdown.
          </p>
        </div>
        <div className="flex items-center space-x-2 bg-slate-950 p-1.5 rounded-lg border border-slate-800">
          <button
            onClick={() => setCloudProvider('AWS')}
            className={`px-3 py-1 text-xs font-mono font-bold rounded ${
              cloudProvider === 'AWS' ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            AWS Infrastructure
          </button>
          <button
            onClick={() => setCloudProvider('GCP')}
            className={`px-3 py-1 text-xs font-mono font-bold rounded ${
              cloudProvider === 'GCP' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            GCP Infrastructure
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        {/* Input Parameters */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-5 space-y-6">
          <h4 className="text-sm font-semibold text-purple-400 flex items-center space-x-2">
            <Cpu className="w-4 h-4" />
            <span>Target Scale Inputs</span>
          </h4>

          <div className="space-y-4 text-xs font-mono">
            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Active Mobile Fleet</span>
                <span className="text-purple-400 font-bold">{techCount.toLocaleString()} Techs</span>
              </div>
              <input
                type="range"
                min="10000"
                max="500000"
                step="10000"
                value={techCount}
                onChange={(e) => setTechCount(parseInt(e.target.value))}
                className="w-full accent-purple-500"
              />
            </div>

            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>GPS Telemetry Frequency</span>
                <span className="text-blue-400 font-bold">Every {pingIntervalSec}s</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                step="1"
                value={pingIntervalSec}
                onChange={(e) => setPingIntervalSec(parseInt(e.target.value))}
                className="w-full accent-blue-500"
              />
            </div>

            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Monthly Work Orders</span>
                <span className="text-emerald-400 font-bold">{(workOrdersPerMonth / 1000000).toFixed(1)}M / mo</span>
              </div>
              <input
                type="range"
                min="1000000"
                max="25000000"
                step="1000000"
                value={workOrdersPerMonth}
                onChange={(e) => setWorkOrdersPerMonth(parseInt(e.target.value))}
                className="w-full accent-emerald-500"
              />
            </div>
          </div>

          <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg text-xs font-mono space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-400">Telemetry Ingest Rate:</span>
              <span className="text-purple-400 font-bold">{pingsPerSec.toLocaleString()} pings/s</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Daily Telemetry Storage:</span>
              <span className="text-slate-200">{dailyGbGpsTelemetry} GB / day</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Monthly Telemetry Stream:</span>
              <span className="text-slate-200">{monthlyTbTelemetry} TB / month</span>
            </div>
          </div>
        </div>

        {/* Calculated Topology & Cost Estimate */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono">
            <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl">
              <span className="text-xs text-slate-400">Kubernetes Nodes</span>
              <p className="text-2xl font-bold text-blue-400 mt-1">{totalEksNodes} Nodes</p>
              <p className="text-[10px] text-slate-500 mt-1">{cloudProvider === 'AWS' ? 'c6i.2xlarge Spot/OnDemand' : 'n2-standard-8'}</p>
            </div>

            <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl">
              <span className="text-xs text-slate-400">Managed Kafka Cluster</span>
              <p className="text-2xl font-bold text-amber-400 mt-1">{Math.max(6, Math.ceil(pingsPerSec / 5000))} Brokers</p>
              <p className="text-[10px] text-slate-500 mt-1">{cloudProvider === 'AWS' ? 'MSK kafka.m5.2xlarge' : 'Confluent Cloud Dedicated'}</p>
            </div>

            <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl">
              <span className="text-xs text-slate-400">PostgreSQL Capacity</span>
              <p className="text-2xl font-bold text-emerald-400 mt-1">{Math.max(16, Math.ceil(workOrdersPerMonth / 250000))} ACUs</p>
              <p className="text-[10px] text-slate-500 mt-1">{cloudProvider === 'AWS' ? 'Aurora Serverless v2' : 'AlloyDB PostgreSQL'}</p>
            </div>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-sm font-bold text-slate-200 font-mono flex items-center space-x-2">
                <DollarSign className="w-4 h-4 text-emerald-400" />
                <span>Estimated Monthly Infrastructure Bill ({cloudProvider})</span>
              </span>
              <span className="text-xl font-mono font-bold text-emerald-400">${totalMonthlyCost.toLocaleString()} / mo</span>
            </div>

            <div className="space-y-2 font-mono text-xs">
              <div className="flex justify-between p-2.5 bg-slate-900 rounded border border-slate-800">
                <span className="text-slate-300">Kubernetes EKS / GKE Compute Pods</span>
                <span className="text-slate-100 font-bold">${eksComputeCost.toLocaleString()}</span>
              </div>
              <div className="flex justify-between p-2.5 bg-slate-900 rounded border border-slate-800">
                <span className="text-slate-300">Managed Kafka Telemetry Stream (MSK)</span>
                <span className="text-slate-100 font-bold">${kafkaMskCost.toLocaleString()}</span>
              </div>
              <div className="flex justify-between p-2.5 bg-slate-900 rounded border border-slate-800">
                <span className="text-slate-300">Aurora PostgreSQL + PostGIS Cluster</span>
                <span className="text-slate-100 font-bold">${postgresAuroraCost.toLocaleString()}</span>
              </div>
              <div className="flex justify-between p-2.5 bg-slate-900 rounded border border-slate-800">
                <span className="text-slate-300">ElastiCache Redis Spatial Indexing Cluster</span>
                <span className="text-slate-100 font-bold">${Math.round(redisCacheCost).toLocaleString()}</span>
              </div>
              <div className="flex justify-between p-2.5 bg-slate-900 rounded border border-slate-800">
                <span className="text-slate-300">TimescaleDB & S3 Object Storage + Egress</span>
                <span className="text-slate-100 font-bold">${storageBandwidthCost.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
