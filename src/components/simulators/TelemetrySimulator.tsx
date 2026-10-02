import React, { useState, useEffect } from 'react';
import { Radio, Play, Pause, Activity, Database, Server, RefreshCw, Smartphone } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export const TelemetrySimulator: React.FC = () => {
  const [isRunning, setIsRunning] = useState(true);
  const [techCount, setTechCount] = useState(100000);
  const [pingIntervalSec, setPingIntervalSec] = useState(3);
  const [networkCondition, setNetworkCondition] = useState<'EXCELLENT' | 'DEGRADED' | 'OFFLINE_RECONNECT'>('EXCELLENT');

  const [metricsHistory, setMetricsHistory] = useState<
    { time: string; pingsPerSec: number; kafkaQueueLag: number; redisGeoLatencyMs: number; timescaledbCopyRate: number }[]
  >([]);

  const [latestPacket, setLatestPacket] = useState({
    tenant_id: 'tenant-acme-ops',
    tech_id: 'tech-99182',
    lat: 37.774921,
    lng: -122.419415,
    speed_kmh: 48.2,
    battery_pct: 87,
    proto_bytes: 112,
    latency_ms: 12,
    timestamp: new Date().toISOString(),
  });

  // Calculate telemetry ingestion pings per second
  const pingsPerSec = Math.round(techCount / pingIntervalSec);

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString([], { hour12: false, minute: '2-digit', second: '2-digit' });

      // Add small jitter
      const jitter = Math.floor(Math.random() * 1200) - 600;
      const currentRate = Math.max(1000, pingsPerSec + jitter);

      let lag = Math.floor(Math.random() * 150) + 40;
      let latency = Math.floor(Math.random() * 8) + 10;

      if (networkCondition === 'DEGRADED') {
        lag += 800;
        latency += 35;
      } else if (networkCondition === 'OFFLINE_RECONNECT') {
        lag += 3500;
        latency += 120;
      }

      setMetricsHistory((prev) => {
        const next = [
          ...prev.slice(-19),
          {
            time: timeStr,
            pingsPerSec: currentRate,
            kafkaQueueLag: lag,
            redisGeoLatencyMs: latency,
            timescaledbCopyRate: Math.round(currentRate * 0.98),
          },
        ];
        return next;
      });

      setLatestPacket({
        tenant_id: 'tenant-acme-ops',
        tech_id: `tech-${Math.floor(Math.random() * 90000) + 10000}`,
        lat: Number((37.77 + Math.random() * 0.05).toFixed(6)),
        lng: Number((-122.41 + Math.random() * 0.05).toFixed(6)),
        speed_kmh: Number((30 + Math.random() * 40).toFixed(1)),
        battery_pct: Math.floor(70 + Math.random() * 30),
        proto_bytes: 112,
        latency_ms: latency,
        timestamp: new Date().toISOString(),
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, techCount, pingIntervalSec, networkCondition, pingsPerSec]);

  return (
    <div className="my-8 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl text-slate-100">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-6 border-b border-slate-800 gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Radio className="w-6 h-6 text-emerald-400 animate-pulse" />
            <h3 className="text-xl font-bold">Real-Time Telemetry & Kafka Stream Simulator</h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Simulate 100,000 technician GPS telemetry ingestion via MQTT, Kafka pipeline lag, and Redis spatial updates.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className={`flex items-center space-x-2 px-4 py-2 text-xs font-mono font-bold rounded-lg transition ${
              isRunning ? 'bg-amber-600 hover:bg-amber-500 text-white' : 'bg-emerald-600 hover:bg-emerald-500 text-white'
            }`}
          >
            {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span>{isRunning ? 'Pause Stream' : 'Start Telemetry'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mt-6">
        {/* Controls Column */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-5 space-y-6">
          <h4 className="text-sm font-semibold text-emerald-400 flex items-center space-x-2">
            <Smartphone className="w-4 h-4" />
            <span>Mobile Fleet Config</span>
          </h4>

          <div className="space-y-4 text-xs font-mono">
            <div>
              <label className="text-slate-300 justify-between flex mb-1">
                <span>Active Mobile Fleet</span>
                <span className="text-emerald-400 font-bold">{techCount.toLocaleString()} Techs</span>
              </label>
              <input
                type="range"
                min="10000"
                max="250000"
                step="10000"
                value={techCount}
                onChange={(e) => setTechCount(parseInt(e.target.value))}
                className="w-full accent-emerald-500"
              />
            </div>

            <div>
              <label className="text-slate-300 justify-between flex mb-1">
                <span>GPS Ping Frequency</span>
                <span className="text-blue-400 font-bold">Every {pingIntervalSec}s</span>
              </label>
              <select
                value={pingIntervalSec}
                onChange={(e) => setPingIntervalSec(parseInt(e.target.value))}
                className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-slate-200"
              >
                <option value={1}>1 Second (High Resolution)</option>
                <option value={3}>3 Seconds (Standard Fleet)</option>
                <option value={5}>5 Seconds (Battery Save)</option>
                <option value={10}>10 Seconds (Low Duty)</option>
              </select>
            </div>

            <div>
              <label className="text-slate-300 justify-between flex mb-1">
                <span>Cellular Link State</span>
              </label>
              <select
                value={networkCondition}
                onChange={(e) => setNetworkCondition(e.target.value as any)}
                className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-slate-200"
              >
                <option value="EXCELLENT">5G / LTE (0% Loss)</option>
                <option value="DEGRADED">Congested 3G (Network Jitter)</option>
                <option value="OFFLINE_RECONNECT">Cellular Dropout & Reconnect Burst</option>
              </select>
            </div>
          </div>

          <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg text-xs font-mono space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-400">Target Ingest Rate:</span>
              <span className="text-emerald-400 font-bold">{pingsPerSec.toLocaleString()} pings/s</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Monthly Volume:</span>
              <span className="text-slate-200">{((pingsPerSec * 86400 * 30) / 1000000000).toFixed(2)} Billion pings</span>
            </div>
          </div>
        </div>

        {/* Charts & Ingest Pipeline Visualizer (3 Cols) */}
        <div className="lg:col-span-3 space-y-6">
          {/* Key Pipeline Counters */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl font-mono">
              <div className="flex items-center space-x-2 text-slate-400 text-xs mb-1">
                <Activity className="w-3.5 h-3.5 text-emerald-400" />
                <span>Ingest Throughput</span>
              </div>
              <p className="text-xl font-bold text-emerald-400">
                {metricsHistory[metricsHistory.length - 1]?.pingsPerSec.toLocaleString() || pingsPerSec} /s
              </p>
            </div>

            <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl font-mono">
              <div className="flex items-center space-x-2 text-slate-400 text-xs mb-1">
                <Server className="w-3.5 h-3.5 text-amber-400" />
                <span>Kafka Consumer Lag</span>
              </div>
              <p className="text-xl font-bold text-amber-400">
                {metricsHistory[metricsHistory.length - 1]?.kafkaQueueLag || 45} msgs
              </p>
            </div>

            <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl font-mono">
              <div className="flex items-center space-x-2 text-slate-400 text-xs mb-1">
                <Database className="w-3.5 h-3.5 text-blue-400" />
                <span>Redis Geo Update</span>
              </div>
              <p className="text-xl font-bold text-blue-400">
                {metricsHistory[metricsHistory.length - 1]?.redisGeoLatencyMs || 12} ms
              </p>
            </div>

            <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl font-mono">
              <div className="flex items-center space-x-2 text-slate-400 text-xs mb-1">
                <RefreshCw className="w-3.5 h-3.5 text-purple-400" />
                <span>Packet Payload</span>
              </div>
              <p className="text-xl font-bold text-purple-400">112 Bytes</p>
            </div>
          </div>

          {/* Realtime Chart */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-5">
            <div className="flex items-center justify-between mb-4 font-mono text-xs">
              <span className="text-slate-300 font-bold flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                <span>Live GPS Ingestion Rate (Pings / Second)</span>
              </span>
              <span className="text-slate-500">Real-time Kafka Partition Metrics</span>
            </div>

            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={metricsHistory}>
                  <defs>
                    <linearGradient id="colorIngest" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="time" stroke="#475569" fontSize={10} tickLine={false} />
                  <YAxis stroke="#475569" fontSize={10} tickLine={false} domain={['auto', 'auto']} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '11px', fontFamily: 'monospace' }}
                  />
                  <Area type="monotone" dataKey="pingsPerSec" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorIngest)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Latest Protobuf Telemetry Packet Inspector */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-slate-400">
              <span className="text-emerald-400 font-bold">Latest Decoded Protobuf Telemetry Frame</span>
              <span>Sequence ID: #{Math.floor(Math.random() * 900000) + 100000}</span>
            </div>
            <pre className="mt-3 text-slate-300 text-[11px] overflow-x-auto">
{JSON.stringify(latestPacket, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
