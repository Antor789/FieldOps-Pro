import React from 'react';
import { BLUEPRINT_SECTIONS } from '../data/blueprintData';
import { LayoutGrid, ShieldCheck, Radio, Cpu, Server, Lock, Activity, Search, Database, Code } from 'lucide-react';

interface SidebarProps {
  activeSectionId: string;
  onSelectSection: (id: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  activeTab: 'app' | 'blueprint' | 'simulators';
  setActiveTab: (tab: 'app' | 'blueprint' | 'simulators') => void;
}

const ICON_MAP: Record<string, React.ReactNode> = {
  LayoutGrid: <LayoutGrid className="w-4 h-4" />,
  ShieldCheck: <ShieldCheck className="w-4 h-4" />,
  Radio: <Radio className="w-4 h-4" />,
  Cpu: <Cpu className="w-4 h-4" />,
  Server: <Server className="w-4 h-4" />,
  Lock: <Lock className="w-4 h-4" />,
  Database: <Database className="w-4 h-4" />,
  Code: <Code className="w-4 h-4" />,
};

export const Sidebar: React.FC<SidebarProps> = ({
  activeSectionId,
  onSelectSection,
  searchQuery,
  setSearchQuery,
  activeTab,
  setActiveTab,
}) => {
  const filteredSections = BLUEPRINT_SECTIONS.filter(
    (sec) =>
      sec.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sec.subtitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <aside className="w-full lg:w-64 bg-slate-950/90 border-b lg:border-b-0 lg:border-r border-slate-800/80 p-3 shrink-0 font-mono text-xs">
      {/* Search Input */}
      <div className="relative mb-3">
        <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-500" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Filter specs..."
          className="w-full bg-slate-900 border border-slate-800 rounded-md pl-8 pr-2.5 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      {/* Blueprint Sections Menu */}
      <div className="space-y-0.5 mb-4">
        <div className="px-2 py-1 text-[10px] uppercase font-bold text-slate-500 tracking-wider flex items-center justify-between">
          <span>Architectural Blueprint</span>
          <span className="text-[9px] bg-slate-900 text-slate-400 px-1.5 py-0.2 rounded border border-slate-800">
            {filteredSections.length}
          </span>
        </div>

        {filteredSections.map((section) => {
          const isActive = activeTab === 'blueprint' && activeSectionId === section.id;
          return (
            <button
              key={section.id}
              onClick={() => {
                setActiveTab('blueprint');
                onSelectSection(section.id);
              }}
              className={`w-full text-left px-2.5 py-2 rounded-md transition flex items-center space-x-2 text-xs ${
                isActive
                  ? 'bg-blue-600/90 text-white font-semibold shadow-sm shadow-blue-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              <span className={isActive ? 'text-white' : 'text-blue-400'}>
                {ICON_MAP[section.iconName] || <LayoutGrid className="w-3.5 h-3.5" />}
              </span>
              <span className="truncate flex-1">{section.title}</span>
              <span className={`text-[10px] font-mono ${isActive ? 'text-blue-200' : 'text-slate-600'}`}>
                #{section.id}
              </span>
            </button>
          );
        })}
      </div>

      {/* Interactive Simulators Menu */}
      <div className="space-y-0.5 pt-3 border-t border-slate-800/80">
        <div className="px-2 py-1 text-[10px] uppercase font-bold text-slate-500 tracking-wider">
          Interactive Tools
        </div>

        <button
          onClick={() => setActiveTab('simulators')}
          className={`w-full text-left px-2.5 py-2 rounded-md transition flex items-center space-x-2 text-xs ${
            activeTab === 'simulators'
              ? 'bg-emerald-600/90 text-white font-semibold shadow-sm shadow-emerald-500/20'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
          }`}
        >
          <Activity className="w-3.5 h-3.5 text-emerald-400" />
          <span className="flex-1 font-medium">Interactive Simulators</span>
          <span className="px-1 py-0.2 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 text-[9px] font-bold">
            LIVE
          </span>
        </button>
      </div>
    </aside>
  );
};
