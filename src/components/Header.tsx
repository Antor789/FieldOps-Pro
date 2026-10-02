import React from 'react';
import { ShieldCheck, Download, Cpu, Activity } from 'lucide-react';
import { SYSTEM_METRICS } from '../data/blueprintData';

interface HeaderProps {
  activeTab: 'app' | 'blueprint' | 'simulators';
  setActiveTab: (tab: 'app' | 'blueprint' | 'simulators') => void;
  onDownloadBlueprint: () => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab, onDownloadBlueprint }) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-950/95 backdrop-blur border-b border-slate-800 text-slate-100 px-4 lg:px-6 py-2.5">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Brand Title & System Badge */}
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-600/90 rounded-lg shadow-sm shadow-blue-500/20 text-white flex items-center justify-center shrink-0">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-base font-bold tracking-tight text-white font-mono">FieldOps Pro</h1>
              <span className="px-1.5 py-0.5 rounded bg-blue-950 text-blue-400 border border-blue-800 text-[10px] font-mono font-bold uppercase tracking-wider">
                Enterprise v4.2 Blueprint
              </span>
              <span className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-mono font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse mr-1"></span>
                ONLINE
              </span>
            </div>
            <p className="text-[11px] text-slate-400 line-clamp-1">
              Architecture Blueprint & Specs for Intelligent Dispatch & Telemetry Streaming
            </p>
          </div>
        </div>

        {/* System SLA Metric Badges */}
        <div className="hidden xl:flex items-center space-x-2 font-mono text-xs">
          <div className="px-2.5 py-1 bg-slate-900/90 border border-slate-800/80 rounded-md">
            <span className="text-slate-500 text-[9px] block font-bold uppercase">Active Fleet</span>
            <p className="font-bold text-emerald-400 text-xs">{SYSTEM_METRICS.activeTechnicians}</p>
          </div>
          <div className="px-2.5 py-1 bg-slate-900/90 border border-slate-800/80 rounded-md">
            <span className="text-slate-500 text-[9px] block font-bold uppercase">Monthly WOs</span>
            <p className="font-bold text-blue-400 text-xs">{SYSTEM_METRICS.monthlyWorkOrders}</p>
          </div>
          <div className="px-2.5 py-1 bg-slate-900/90 border border-slate-800/80 rounded-md">
            <span className="text-slate-500 text-[9px] block font-bold uppercase">Throughput</span>
            <p className="font-bold text-purple-400 text-xs">33k pings/s</p>
          </div>
          <div className="px-2.5 py-1 bg-slate-900/90 border border-slate-800/80 rounded-md">
            <span className="text-slate-500 text-[9px] block font-bold uppercase">Target SLA</span>
            <p className="font-bold text-amber-400 text-xs">{SYSTEM_METRICS.uptimeSla}</p>
          </div>
        </div>

        {/* View Selector & Export Action */}
        <div className="flex items-center space-x-2 justify-between md:justify-end">
          <div className="flex items-center bg-slate-900/90 p-0.5 rounded-lg border border-slate-800 font-mono text-xs">
            <button
              onClick={() => setActiveTab('app')}
              className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-md transition text-xs ${
                activeTab === 'app' ? 'bg-cyan-600 text-white font-semibold shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Cpu className="w-3.5 h-3.5 text-cyan-300" />
              <span>FieldOps Pro App</span>
            </button>
            <button
              onClick={() => setActiveTab('blueprint')}
              className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-md transition text-xs ${
                activeTab === 'blueprint' ? 'bg-blue-600 text-white font-semibold shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Architecture Specs</span>
            </button>
            <button
              onClick={() => setActiveTab('simulators')}
              className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-md transition text-xs ${
                activeTab === 'simulators' ? 'bg-blue-600 text-white font-semibold shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Activity className="w-3.5 h-3.5 text-emerald-400" />
              <span>Simulators</span>
            </button>
          </div>

          <button
            onClick={onDownloadBlueprint}
            className="flex items-center space-x-1 px-2.5 py-1.5 text-xs bg-slate-900 hover:bg-slate-800 text-slate-200 rounded-lg border border-slate-700 transition font-mono font-medium"
            title="Download Full Markdown Specification"
          >
            <Download className="w-3.5 h-3.5 text-blue-400" />
            <span className="hidden sm:inline">Export Spec</span>
          </button>
        </div>
      </div>
    </header>
  );
};
