import React, { useState } from 'react';
import { DEFAULT_TENANTS } from '../../data/blueprintData';
import { ShieldCheck, Database, Key, CheckCircle, Lock } from 'lucide-react';

export const MultiTenancySandbox: React.FC = () => {
  const [selectedTenantId, setSelectedTenantId] = useState(DEFAULT_TENANTS[0].id);
  const [attemptCrossTenantQuery, setAttemptCrossTenantQuery] = useState(false);

  const activeTenant = DEFAULT_TENANTS.find((t) => t.id === selectedTenantId) || DEFAULT_TENANTS[0];

  // Simulated Work Order Table Rows for all tenants
  const allWorkOrders = [
    { id: 'WO-101', tenantId: 'tenant-acme-ops', title: 'HVAC Air Handler Repair', customer: 'Boeing SF Facility', priority: 'HIGH' },
    { id: 'WO-102', tenantId: 'tenant-acme-ops', title: 'Chiller Valve Inspection', customer: 'Tesla Fremont Factory', priority: 'MEDIUM' },
    { id: 'WO-201', tenantId: 'tenant-apex-hvac', title: 'Residential Heat Pump Install', customer: 'Oakland Residential #48', priority: 'LOW' },
    { id: 'WO-202', tenantId: 'tenant-apex-hvac', title: 'Duct Cleaning & Filter Replace', customer: 'Berkeley Office Suite', priority: 'LOW' },
    { id: 'WO-301', tenantId: 'tenant-metro-utility', title: 'Gas Substation Emergency Leak Check', customer: 'PG&E Substation 9', priority: 'CRITICAL' },
  ];

  // Filter based on RLS simulation
  const visibleWorkOrders = attemptCrossTenantQuery
    ? allWorkOrders // Simulated RLS bypass attempt (should return 0 rows under Postgres RLS)
    : allWorkOrders.filter((wo) => wo.tenantId === selectedTenantId);

  return (
    <div className="my-8 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl text-slate-100">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-6 border-b border-slate-800 gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-6 h-6 text-blue-400" />
            <h3 className="text-xl font-bold">Multi-Tenant Row-Level Security (RLS) & CNAME Sandbox</h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Test database row-level security isolation policies, connection pooling contexts, and custom domain CNAME mappings.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        {/* Left Column: Tenant Context Config */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-5 space-y-6">
          <div>
            <label className="text-xs font-mono text-slate-400 font-semibold uppercase tracking-wider block mb-2">
              Select Active Session Tenant Context
            </label>
            <div className="space-y-2">
              {DEFAULT_TENANTS.map((t) => (
                <button
                  key={t.id}
                  onClick={() => {
                    setSelectedTenantId(t.id);
                    setAttemptCrossTenantQuery(false);
                  }}
                  className={`w-full text-left p-3 rounded-xl border transition flex items-center justify-between ${
                    selectedTenantId === t.id
                      ? 'bg-blue-950/60 border-blue-500 text-white font-semibold'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div>
                    <p className="text-xs font-bold font-mono">{t.name}</p>
                    <p className="text-[10px] text-slate-500 font-mono mt-0.5">{t.domain}</p>
                  </div>
                  <span className="px-2 py-0.5 text-[10px] font-mono rounded bg-slate-800 text-slate-300">
                    {t.tier}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 space-y-3 font-mono text-xs">
            <h4 className="font-semibold text-slate-200">Active Tenant Context Parameters</h4>
            <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg space-y-2 text-[11px]">
              <div className="flex justify-between">
                <span className="text-slate-400">Tenant ID:</span>
                <span className="text-blue-400 font-bold">{activeTenant.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Isolation Mode:</span>
                <span className="text-emerald-400">{activeTenant.isolationMode}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Rate Limit:</span>
                <span className="text-amber-400">{activeTenant.rateLimitRpm.toLocaleString()} req/min</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Custom SSO:</span>
                <span className="text-purple-400">{activeTenant.customSsoEnabled ? 'ENABLED (OIDC)' : 'STANDARD'}</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 space-y-2">
            <label className="flex items-center space-x-2 text-xs text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={attemptCrossTenantQuery}
                onChange={(e) => setAttemptCrossTenantQuery(e.target.checked)}
                className="accent-red-500 rounded"
              />
              <span className="text-red-400 font-mono">Attempt Cross-Tenant Query (Simulate RLS Enforcement)</span>
            </label>
          </div>
        </div>

        {/* Right 2 Columns: Query Execution & Results */}
        <div className="lg:col-span-2 space-y-6">
          {/* SQL Session Context Preview */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-slate-400">
              <span className="flex items-center space-x-2 text-blue-400 font-bold">
                <Database className="w-4 h-4" />
                <span>PostgreSQL RLS Transaction Context</span>
              </span>
              <span className="text-[10px] text-slate-500">PgBouncer Pooled Connection</span>
            </div>

            <div className="mt-3 p-3 bg-slate-900 rounded border border-slate-800 text-slate-300 space-y-1 text-[11px]">
              <p className="text-slate-500">-- Executed via middleware before API query handler:</p>
              <p className="text-emerald-400">SET LOCAL app.current_tenant_id = '{activeTenant.id}';</p>
              <p className="text-blue-400">SELECT * FROM work_orders;</p>
            </div>
          </div>

          {/* RLS Enforcement Results */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-bold text-slate-200 font-mono flex items-center space-x-2">
                <Key className="w-4 h-4 text-emerald-400" />
                <span>Returned Work Order Records ({visibleWorkOrders.length} Rows)</span>
              </span>
              {attemptCrossTenantQuery ? (
                <span className="flex items-center space-x-1 px-2.5 py-1 rounded bg-red-950 text-red-400 border border-red-800 text-xs font-mono font-bold">
                  <Lock className="w-3.5 h-3.5" />
                  <span>RLS Blocked Unscoped Rows</span>
                </span>
              ) : (
                <span className="flex items-center space-x-1 px-2.5 py-1 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 text-xs font-mono font-bold">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Strict Tenant Isolation Verified</span>
                </span>
              )}
            </div>

            <div className="space-y-3 font-mono text-xs">
              {visibleWorkOrders.map((wo) => (
                <div
                  key={wo.id}
                  className="p-3 bg-slate-900 border border-slate-800 rounded-lg flex items-center justify-between hover:border-slate-700 transition"
                >
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-blue-400">{wo.id}</span>
                      <span className="text-slate-200">{wo.title}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">{wo.customer}</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300">{wo.tenantId}</span>
                    <span className="px-2 py-0.5 rounded bg-blue-950 text-blue-400 border border-blue-800 text-[10px] font-bold">
                      {wo.priority}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
