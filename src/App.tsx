import React, { useState } from 'react';
import { BLUEPRINT_SECTIONS } from './data/blueprintData';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { SectionViewer } from './components/SectionViewer';
import { DispatchSimulator } from './components/simulators/DispatchSimulator';
import { TelemetrySimulator } from './components/simulators/TelemetrySimulator';
import { MultiTenancySandbox } from './components/simulators/MultiTenancySandbox';
import { DevOpsCalculator } from './components/simulators/DevOpsCalculator';
import { FSMFrontendDashboard } from './components/fsm/FSMFrontendDashboard';
import { downloadFullBlueprintMarkdown } from './utils/exporter';
import { Cpu, Radio, ShieldCheck, Server } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'app' | 'blueprint' | 'simulators'>('app');
  const [activeSectionId, setActiveSectionId] = useState<string>(BLUEPRINT_SECTIONS[0].id);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeSimTab, setActiveSimTab] = useState<'dispatch' | 'telemetry' | 'multitenancy' | 'devops'>('dispatch');

  const currentSection =
    BLUEPRINT_SECTIONS.find((s) => s.id === activeSectionId) || BLUEPRINT_SECTIONS[0];

  if (activeTab === 'app') {
    return <FSMFrontendDashboard />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white bg-grid-pattern">
      {/* Top Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onDownloadBlueprint={downloadFullBlueprintMarkdown}
      />

      {/* Main Body Layout */}
      <div className="flex-1 flex flex-col lg:flex-row max-w-7xl w-full mx-auto overflow-hidden">
        {/* Navigation Sidebar */}
        <Sidebar
          activeSectionId={activeSectionId}
          onSelectSection={(id) => setActiveSectionId(id)}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />

        {/* Content Area */}
        <main className="flex-1 p-4 lg:p-6 overflow-y-auto">
          {activeTab === 'blueprint' ? (
            <SectionViewer section={currentSection} />
          ) : (
            <div className="space-y-6 animate-fadeIn">
              <div className="border-b border-slate-800/80 pb-3">
                <h2 className="text-xl font-extrabold text-white tracking-tight">Interactive Technical Simulators & Sandboxes</h2>
                <p className="text-xs text-slate-400 mt-1 font-mono">
                  Test dispatch algorithm weights, telemetry ingestion benchmarks, multi-tenant row-level security, and cloud infrastructure sizing.
                </p>

                {/* Simulator Sub-Tabs */}
                <div className="flex flex-wrap items-center gap-1.5 mt-3 font-mono text-xs">
                  <button
                    onClick={() => setActiveSimTab('dispatch')}
                    className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md transition ${
                      activeSimTab === 'dispatch'
                        ? 'bg-blue-600 text-white font-semibold shadow-sm'
                        : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Cpu className="w-3.5 h-3.5 text-blue-400" />
                    <span>AI Dispatch Engine</span>
                  </button>

                  <button
                    onClick={() => setActiveSimTab('telemetry')}
                    className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md transition ${
                      activeSimTab === 'telemetry'
                        ? 'bg-emerald-600 text-white font-semibold shadow-sm'
                        : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Radio className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Telemetry Ingest Stream</span>
                  </button>

                  <button
                    onClick={() => setActiveSimTab('multitenancy')}
                    className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md transition ${
                      activeSimTab === 'multitenancy'
                        ? 'bg-purple-600 text-white font-semibold shadow-sm'
                        : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
                    <span>Multi-Tenant RLS Sandbox</span>
                  </button>

                  <button
                    onClick={() => setActiveSimTab('devops')}
                    className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md transition ${
                      activeSimTab === 'devops'
                        ? 'bg-amber-600 text-white font-semibold shadow-sm'
                        : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Server className="w-3.5 h-3.5 text-amber-400" />
                    <span>DevOps Cost Calculator</span>
                  </button>
                </div>
              </div>

              {/* Active Simulator Render */}
              {activeSimTab === 'dispatch' && <DispatchSimulator />}
              {activeSimTab === 'telemetry' && <TelemetrySimulator />}
              {activeSimTab === 'multitenancy' && <MultiTenancySandbox />}
              {activeSimTab === 'devops' && <DevOpsCalculator />}
            </div>
          )}
        </main>
      </div>

      {/* Operational Status Footer Bar */}
      <footer className="h-8 border-t border-slate-800/80 bg-slate-950/95 px-4 lg:px-6 flex items-center justify-between shrink-0 font-mono text-[10px] text-slate-500">
        <div className="flex items-center space-x-4">
          <span className="flex items-center text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse mr-1.5"></span>
            ALL SYSTEMS OPERATIONAL
          </span>
          <span className="hidden md:inline-block text-slate-700">|</span>
          <span className="hidden md:inline-block">Aurora PostgreSQL v15</span>
          <span className="hidden md:inline-block text-slate-700">|</span>
          <span className="hidden md:inline-block">Redis 7.0 Cluster</span>
          <span className="hidden lg:inline-block text-slate-700">|</span>
          <span className="hidden lg:inline-block">Terraform IaC</span>
        </div>
        <div className="flex items-center space-x-3 text-slate-600">
          <span>DEPLOY_SHA: 8f92a10c</span>
          <span>SLA: 99.99%</span>
        </div>
      </footer>
    </div>
  );
}
