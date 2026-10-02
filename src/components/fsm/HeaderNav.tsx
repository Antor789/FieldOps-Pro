import React, { useState, useEffect } from 'react';
import { Tenant } from '../../types/fsm';
import { Language, translations, formatDhakaTime } from '../../lib/i18n';
import {
  ShieldCheck,
  Users,
  ChevronDown,
  Smartphone,
  LayoutDashboard,
  Eye,
  Search,
  Activity,
  Radio,
  Sparkles,
  Command,
  Globe,
  MessageSquare,
} from 'lucide-react';

interface HeaderNavProps {
  tenants: Tenant[];
  currentTenant: Tenant;
  onSelectTenant: (tenant: Tenant) => void;
  activeRoleView: 'DISPATCHER' | 'FIELD_TECH' | 'CUSTOMER_TRACK';
  onChangeRoleView: (view: 'DISPATCHER' | 'FIELD_TECH' | 'CUSTOMER_TRACK') => void;
  socketStatus: 'CONNECTED' | 'RECONNECTING' | 'DISCONNECTED';
  onlineTechCount: number;
  totalTechCount: number;
  sosCount: number;
  lang: Language;
  onToggleLanguage: () => void;
  telemetryPingsPerSec?: number;
  onToggleMapDrawer?: () => void;
  isMapDrawerOpen?: boolean;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  tenants,
  currentTenant,
  onSelectTenant,
  activeRoleView,
  onChangeRoleView,
  socketStatus,
  onlineTechCount,
  totalTechCount,
  sosCount,
  lang,
  onToggleLanguage,
  telemetryPingsPerSec = 1482,
  onToggleMapDrawer,
  isMapDrawerOpen,
}) => {
  const [dhakaTime, setDhakaTime] = useState<string>('');
  const [isTenantDropdownOpen, setIsTenantDropdownOpen] = useState(false);

  const t = translations[lang];

  useEffect(() => {
    const updateClock = () => {
      setDhakaTime(formatDhakaTime(new Date(), lang));
    };
    updateClock();
    const timer = setInterval(updateClock, 1000);
    return () => clearInterval(timer);
  }, [lang]);

  return (
    <header className="bg-white/95 border border-slate-200/90 shadow-xs backdrop-blur-md rounded-2xl px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 font-sans transition-all duration-200 relative z-30">
      {/* 1. Left: FieldOps Pro Brand & Multi-Tenant Switcher */}
      <div className="flex items-center space-x-3">
        {/* Brand Badge */}
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center font-extrabold text-white shadow-xs text-xs tracking-wider">
            FO
          </div>
          <div>
            <h1 className="text-sm font-extrabold tracking-tight text-slate-900 flex items-center gap-1.5">
              {t.appName} <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-1.5 py-0.5 rounded-full font-mono font-bold">BD v3.4</span>
            </h1>
            <p className="text-[10px] text-slate-500 font-medium">{t.appTagline}</p>
          </div>
        </div>

        <div className="h-5 w-px bg-slate-200" />

        {/* Multi-Tenant Switcher Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsTenantDropdownOpen(!isTenantDropdownOpen)}
            className="flex items-center space-x-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs px-2.5 py-1.5 rounded-xl transition font-medium text-slate-800"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
            <span className="font-semibold max-w-[140px] truncate">{currentTenant.name}</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {isTenantDropdownOpen && (
            <div className="absolute top-full left-0 mt-1.5 w-64 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 p-1.5 text-xs animate-fadeIn space-y-1">
              <div className="px-2 py-1 text-[10px] uppercase font-bold text-slate-400 border-b border-slate-100">
                {t.selectTenant}
              </div>
              {tenants.map((tenant) => (
                <button
                  key={tenant.id}
                  onClick={() => {
                    onSelectTenant(tenant);
                    setIsTenantDropdownOpen(false);
                  }}
                  className={`w-full text-left px-2.5 py-2 rounded-xl flex items-center justify-between transition ${
                    tenant.id === currentTenant.id
                      ? 'bg-indigo-50 text-indigo-700 font-bold border border-indigo-200'
                      : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="truncate">
                    <div>{tenant.name}</div>
                    <div className="text-[10px] font-normal text-slate-400">{tenant.domain}</div>
                  </div>
                  <span className="text-[9px] bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded text-emerald-700 font-mono">
                    {tenant.tier}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 2. Center: Quick Search Bar with Landmark Support */}
      <div className="flex-1 max-w-md hidden md:block">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder={t.searchPlaceholder}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-10 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition shadow-2xs"
          />
          <div className="absolute right-2.5 top-2 flex items-center space-x-0.5 bg-slate-200/80 px-1.5 py-0.5 rounded text-[10px] text-slate-600 font-mono">
            <Command className="w-2.5 h-2.5" />
            <span>K</span>
          </div>
        </div>
      </div>

      {/* 3. Right: Greenweb SMS Sync, Language Switcher, Telemetry, Clock & Views */}
      <div className="flex items-center space-x-2.5 text-xs font-sans">
        {/* Language Switcher Toggle */}
        <button
          onClick={onToggleLanguage}
          className="flex items-center space-x-1.5 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 px-2.5 py-1.5 rounded-xl transition font-bold"
          title="Toggle Language / ভাষা পরিবর্তন"
        >
          <Globe className="w-3.5 h-3.5 text-indigo-600" />
          <span>{lang === 'en' ? 'বাংলা' : 'English'}</span>
        </button>

        {/* Greenweb SMS Gateway Sync Badge */}
        <div className="hidden xl:flex items-center space-x-1.5 bg-emerald-50 border border-emerald-200 text-emerald-800 px-2.5 py-1.5 rounded-xl font-mono text-[11px] font-semibold">
          <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
          <span>Greenweb SMS BD</span>
        </div>

        {/* Dhaka Standard Time (BST) */}
        <div className="hidden lg:flex items-center space-x-1 bg-slate-50 border border-slate-200 px-2.5 py-1.5 rounded-xl font-mono text-[11px] text-slate-700">
          <span className="font-bold">{dhakaTime}</span>
        </div>

        {/* Role View Toggles */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs">
          <button
            onClick={() => onChangeRoleView('DISPATCHER')}
            className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-lg transition font-semibold ${
              activeRoleView === 'DISPATCHER'
                ? 'bg-white text-indigo-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t.kanbanBoard}</span>
          </button>

          <button
            onClick={() => onChangeRoleView('FIELD_TECH')}
            className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-lg transition font-semibold ${
              activeRoleView === 'FIELD_TECH'
                ? 'bg-white text-indigo-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t.techApp}</span>
          </button>

          <button
            onClick={() => onChangeRoleView('CUSTOMER_TRACK')}
            className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-lg transition font-semibold ${
              activeRoleView === 'CUSTOMER_TRACK'
                ? 'bg-white text-indigo-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t.livePortal}</span>
          </button>
        </div>

        {/* Map Drawer Toggle Button */}
        {onToggleMapDrawer && (
          <button
            onClick={onToggleMapDrawer}
            className={`px-3 py-1.5 rounded-xl border font-semibold text-xs transition flex items-center space-x-1.5 shadow-2xs ${
              isMapDrawerOpen
                ? 'bg-indigo-600 text-white border-indigo-600'
                : 'bg-white text-indigo-600 border-indigo-200 hover:bg-indigo-50'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isMapDrawerOpen ? t.closeMap : t.viewLiveMap}</span>
          </button>
        )}

        {/* User Profile Avatar */}
        <div className="flex items-center space-x-2 pl-1 border-l border-slate-200">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 to-emerald-500 text-white font-bold text-xs flex items-center justify-center shadow-xs cursor-pointer ring-2 ring-white">
            GP
          </div>
        </div>
      </div>
    </header>
  );
};
