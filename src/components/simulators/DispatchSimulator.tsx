import React, { useState } from 'react';
import { MOCK_TECHNICIANS, DEFAULT_TENANTS } from '../../data/blueprintData';
import { TechnicianCandidate, WorkOrderRequest } from '../../types/architecture';
import { Sliders, Cpu, CheckCircle2, XCircle, AlertTriangle, ShieldCheck, MapPin, Wrench } from 'lucide-react';

export const DispatchSimulator: React.FC = () => {
  const [tenantId, setTenantId] = useState(DEFAULT_TENANTS[0].id);
  const [weights, setWeights] = useState({
    proximity: 0.35,
    skillFit: 0.25,
    slaUrgency: 0.20,
    workload: 0.10,
    parts: 0.10,
  });

  const [workOrder, setWorkOrder] = useState<WorkOrderRequest>({
    id: 'WO-99482',
    title: 'Emergency Commercial HVAC Compressor Failure',
    tenantId: DEFAULT_TENANTS[0].id,
    lat: 37.7749,
    lng: -122.4194,
    priority: 'CRITICAL',
    requiredSkills: ['HVAC Certified', 'High Voltage'],
    requiredParts: ['Compressor Valve TXV-9'],
    slaDueMinutes: 45,
  });

  // Calculate scores dynamically based on weights and WO requirements
  const evaluatedCandidates: TechnicianCandidate[] = MOCK_TECHNICIANS.map((tech) => {
    // 1. Skill Match Pct
    const matchedSkills = workOrder.requiredSkills.filter((s) => tech.skills.includes(s));
    const skillMatchPercent = (matchedSkills.length / workOrder.requiredSkills.length) * 100;

    // 2. Proximity Score (Exponential Decay)
    const proxScore = Math.max(0, 100 * Math.exp(-tech.distanceKm / 10));

    // 3. SLA Urgency Score
    const slaScore = workOrder.slaDueMinutes <= 60 ? 100 : Math.max(0, 100 - (workOrder.slaDueMinutes - 60) * 0.25);

    // 4. Workload Score
    const workloadScore = Math.max(0, 100 * (1 - tech.activeWorkOrders / 6));

    // 5. Parts Score
    const partsScore = tech.hasParts ? 100 : 0;

    // Hard Constraint Checks
    const failed: string[] = [];
    if (skillMatchPercent < 100) failed.push('Missing Required Skill Certifications');
    if (!tech.hasParts) failed.push('Missing Required Parts in Mobile Truck');

    const hardConstraintsMet = failed.length === 0;

    // Composite Weighted Score
    const rawScore =
      proxScore * weights.proximity +
      skillMatchPercent * weights.skillFit +
      slaScore * weights.slaUrgency +
      workloadScore * weights.workload +
      partsScore * weights.parts;

    const overallScore = hardConstraintsMet ? Number(rawScore.toFixed(1)) : Number((rawScore * 0.4).toFixed(1));

    return {
      ...tech,
      skillMatchPercent,
      slaUrgencyScore: Math.round(slaScore),
      workloadScore: Math.round(workloadScore),
      overallScore,
      hardConstraintsMet,
      failedConstraints: failed,
    };
  }).sort((a, b) => b.overallScore - a.overallScore);

  const topMatch = evaluatedCandidates[0];

  return (
    <div className="my-8 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl text-slate-100">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-6 border-b border-slate-800 gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Cpu className="w-6 h-6 text-blue-400" />
            <h3 className="text-xl font-bold">AI Auto-Dispatch Engine & Solver Simulator</h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Test multi-objective matching scoring against 100k active technician fleet. Adjust weights and work order parameters live.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <span className="text-xs text-slate-400 font-mono">Active Tenant Scope:</span>
          <select
            value={tenantId}
            onChange={(e) => setTenantId(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
          >
            {DEFAULT_TENANTS.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name} ({t.tier})
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        {/* Left Column: Config Panel */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-5 space-y-6">
          <div>
            <h4 className="text-sm font-semibold text-blue-400 flex items-center space-x-2">
              <Sliders className="w-4 h-4" />
              <span>Matching Weight Vectors ($w_1 .. w_5$)</span>
            </h4>
            <div className="space-y-4 mt-4 text-xs font-mono">
              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span>Proximity Weight ($w_1$)</span>
                  <span className="text-blue-400 font-bold">{(weights.proximity * 100).toFixed(0)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={weights.proximity}
                  onChange={(e) => setWeights({ ...weights, proximity: parseFloat(e.target.value) })}
                  className="w-full accent-blue-500"
                />
              </div>

              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span>Skill Fit Weight ($w_2$)</span>
                  <span className="text-emerald-400 font-bold">{(weights.skillFit * 100).toFixed(0)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={weights.skillFit}
                  onChange={(e) => setWeights({ ...weights, skillFit: parseFloat(e.target.value) })}
                  className="w-full accent-emerald-500"
                />
              </div>

              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span>SLA Urgency Weight ($w_3$)</span>
                  <span className="text-amber-400 font-bold">{(weights.slaUrgency * 100).toFixed(0)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={weights.slaUrgency}
                  onChange={(e) => setWeights({ ...weights, slaUrgency: parseFloat(e.target.value) })}
                  className="w-full accent-amber-500"
                />
              </div>

              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span>Workload Balance ($w_4$)</span>
                  <span className="text-purple-400 font-bold">{(weights.workload * 100).toFixed(0)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={weights.workload}
                  onChange={(e) => setWeights({ ...weights, workload: parseFloat(e.target.value) })}
                  className="w-full accent-purple-500"
                />
              </div>

              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span>Truck Parts Match ($w_5$)</span>
                  <span className="text-cyan-400 font-bold">{(weights.parts * 100).toFixed(0)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={weights.parts}
                  onChange={(e) => setWeights({ ...weights, parts: parseFloat(e.target.value) })}
                  className="w-full accent-cyan-500"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800">
            <h4 className="text-sm font-semibold text-slate-200 mb-3 flex items-center space-x-2">
              <Wrench className="w-4 h-4 text-amber-400" />
              <span>Simulated Work Order</span>
            </h4>
            <div className="space-y-2 text-xs text-slate-300">
              <div className="p-2.5 bg-slate-900 border border-slate-800 rounded-lg">
                <span className="font-bold text-white font-mono">{workOrder.id}</span>
                <p className="text-slate-400 mt-0.5">{workOrder.title}</p>
                <div className="flex items-center space-x-2 mt-2">
                  <span className="px-2 py-0.5 rounded bg-red-950 text-red-400 border border-red-800 font-mono text-[10px] font-bold">
                    {workOrder.priority}
                  </span>
                  <span className="text-slate-400 font-mono text-[11px]">SLA: {workOrder.slaDueMinutes} mins left</span>
                </div>
              </div>

              <div className="text-[11px] text-slate-400 space-y-1">
                <p><strong className="text-slate-300">Required Skills:</strong> HVAC Certified, High Voltage</p>
                <p><strong className="text-slate-300">Required Truck Parts:</strong> Compressor Valve TXV-9</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right 2 Columns: Candidate Scoring Matrix */}
        <div className="lg:col-span-2 space-y-4">
          <div className="p-4 bg-gradient-to-r from-blue-950/60 to-slate-900 border border-blue-800/60 rounded-xl flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 bg-blue-600/20 text-blue-400 rounded-lg border border-blue-500/40">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-mono text-blue-300 uppercase tracking-wider font-bold">
                  Optimal Match Auto-Dispatched
                </span>
                <p className="text-base font-bold text-white">{topMatch.name} (Score: {topMatch.overallScore}/100)</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs font-mono text-slate-400">P99 Solver Duration</span>
              <p className="text-lg font-mono font-bold text-emerald-400">412 ms</p>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase text-slate-400 font-semibold tracking-wider">
              Evaluated Candidate Fleet ({evaluatedCandidates.length} Candidates)
            </h4>

            {evaluatedCandidates.map((cand, idx) => (
              <div
                key={cand.id}
                className={`p-4 rounded-xl border transition-all ${
                  idx === 0
                    ? 'bg-slate-900 border-blue-500/80 shadow-lg ring-1 ring-blue-500/40'
                    : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center space-x-3">
                    <img src={cand.avatar} alt={cand.name} className="w-10 h-10 rounded-full object-cover border border-slate-700" />
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-sm text-slate-100">{cand.name}</span>
                        {cand.hardConstraintsMet ? (
                          <span className="flex items-center space-x-1 px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-mono">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Constraints Met</span>
                          </span>
                        ) : (
                          <span className="flex items-center space-x-1 px-2 py-0.5 rounded-full bg-red-950 text-red-400 border border-red-800 text-[10px] font-mono">
                            <XCircle className="w-3 h-3" />
                            <span>Constraint Failed</span>
                          </span>
                        )}
                      </div>
                      <div className="flex items-center space-x-3 text-xs text-slate-400 mt-1">
                        <span className="flex items-center space-x-1">
                          <MapPin className="w-3 h-3 text-slate-500" />
                          <span>{cand.distanceKm} km ({cand.travelTimeMins} mins travel)</span>
                        </span>
                        <span>•</span>
                        <span>{cand.activeWorkOrders} Active Jobs</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 justify-between sm:justify-end">
                    <div className="text-right font-mono">
                      <span className="text-[10px] text-slate-500 uppercase">Composite Score</span>
                      <p className={`text-xl font-bold ${idx === 0 ? 'text-blue-400' : cand.hardConstraintsMet ? 'text-slate-200' : 'text-slate-500'}`}>
                        {cand.overallScore}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Constraint & Skills breakdown */}
                <div className="mt-3 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between text-xs gap-2 font-mono">
                  <div className="flex items-center space-x-2 flex-wrap">
                    <span className="text-slate-500">Skills:</span>
                    {cand.skills.map((s) => (
                      <span key={s} className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px]">
                        {s}
                      </span>
                    ))}
                  </div>
                  {!cand.hardConstraintsMet && (
                    <div className="flex items-center space-x-1 text-red-400 text-[11px]">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>{cand.failedConstraints.join(', ')}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
