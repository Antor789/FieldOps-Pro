import React, { useState, useEffect } from 'react';
import { Tenant } from '../../types/fsm';
import { Language, translations, formatDhakaTime } from '../../lib/i18n';
import { useTheme } from '../../context/ThemeContext';
import { Button } from '../ui/Button';
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
  Sun,
  Moon,
  Palette,
  Layers,
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
  onOpenDesignSystem?: () => void;
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
  onOpenDesignSystem,
}) => {
  const [dhakaTime, setDhakaTime] = useState<string>('');
  const [isTenantDropdownOpen, setIsTenantDropdownOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

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
    <header className="bg-white/95 dark:bg-slate-900/95 border border-slate-200/90 dark:border-slate-800 shadow-xs backdrop-blur-md rounded-2xl px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 font-sans transition-all duration-200 relative z-30">
      {/* 1. Left: FieldOps Pro Brand & Multi-Tenant Switcher */}
      <div className="flex items-center space-x-3">
        {/* Brand Badge */}
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center font-extrabold text-white shadow-xs text-xs tracking-wider">
            FO
          </div>
          <div>
            <h1 className="text-sm font-extrabold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
              {t.appName}{' '}
              <span className="text-[10px] bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 px-1.5 py-0.5 rounded-full font-mono font-bold">
                BD v3.4
              </span>
            </h1>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
              {t.appTagline}
            </p>
          </div>
        </div>

        <div className="h-5 w-px bg-slate-200 dark:bg-slate-800" />

        {/* Multi-Tenant Switcher Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsTenantDropdownOpen(!isTenantDropdownOpen)}
            className="flex items-center space-x-2 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-xs px-2.5 py-1.5 rounded-xl transition font-medium text-slate-800 dark:text-slate-200 cursor-pointer"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span className="font-semibold max-w-[140px] truncate">{currentTenant.name}</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {isTenantDropdownOpen && (
            <div className="absolute top-full left-0 mt-1.5 w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl z-50 p-1.5 text-xs animate-scale-in space-y-1">
              <div className="px-2 py-1 text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 border-b border-slate-100 dark:border-slate-800">
                {t.selectTenant}
              </div>
              {tenants.map((tenant) => (
                <button
                  key={tenant.id}
                  onClick={() => {
                    onSelectTenant(tenant);
                    setIsTenantDropdownOpen(false);
                  }}
                  className={`w-full text-left px-2.5 py-2 rounded-xl flex items-center justify-between transition cursor-pointer ${
                    tenant.id === currentTenant.id
                      ? 'bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 font-bold border border-indigo-200 dark:border-indigo-800'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <div className="truncate">
                    <div>{tenant.name}</div>
                    <div className="text-[10px] font-normal text-slate-400">{tenant.domain}</div>
                  </div>
                  <span className="text-[9px] bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800 px-1.5 py-0.5 rounded text-emerald-700 dark:text-emerald-300 font-mono">
                    {tenant.tier}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 2. Center: Quick Search Bar */}
      <div className="flex-1 max-w-md hidden md:block">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400 dark:text-slate-500" />
          <input
            type="text"
            placeholder={t.searchPlaceholder}
            className="w-full bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 rounded-xl pl-9 pr-10 py-1.5 text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:bg-white dark:focus:bg-slate-900 focus:border-indigo-500 dark:focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition shadow-2xs"
          />
          <div className="absolute right-2.5 top-2 flex items-center space-x-0.5 bg-slate-200/80 dark:bg-slate-800 px-1.5 py-0.5 rounded text-[10px] text-slate-600 dark:text-slate-400 font-mono">
            <Command className="w-2.5 h-2.5" />
            <span>K</span>
          </div>
        </div>
      </div>

      {/* 3. Right: Design System Button, Dark Mode, Language Switcher, Clock & Views */}
      <div className="flex items-center space-x-2 text-xs font-sans">
        {/* Interactive Design System Guide Trigger */}
        {onOpenDesignSystem && (
          <button
            onClick={onOpenDesignSystem}
            className="flex items-center space-x-1.5 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 hover:from-indigo-500/20 hover:to-purple-500/20 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 px-2.5 py-1.5 rounded-xl transition font-bold cursor-pointer"
            title="Open Design System Tokens & Component Library Guide"
          >
            <Palette className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span className="hidden lg:inline">Design System</span>
          </button>
        )}

        {/* Dark / Light Mode Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 transition cursor-pointer"
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
        >
          {theme === 'dark' ? (
            <Sun className="w-3.5 h-3.5 text-amber-400 animate-spin-slow" />
          ) : (
            <Moon className="w-3.5 h-3.5 text-indigo-600" />
          )}
        </button>

        {/* Language Switcher Toggle */}
        <button
          onClick={onToggleLanguage}
          className="flex items-center space-x-1.5 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 px-2.5 py-1.5 rounded-xl transition font-bold cursor-pointer"
          title="Toggle Language / ভাষা পরিবর্তন"
        >
          <Globe className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
          <span>{lang === 'en' ? 'বাংলা' : 'English'}</span>
        </button>

        {/* Dhaka Standard Time (BST) */}
        <div className="hidden xl:flex items-center space-x-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-2.5 py-1.5 rounded-xl font-mono text-[11px] text-slate-700 dark:text-slate-300">
          <span className="font-bold">{dhakaTime}</span>
        </div>

        {/* Role View Switcher */}
        <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs">
          <button
            onClick={() => onChangeRoleView('DISPATCHER')}
            className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-lg transition font-semibold cursor-pointer ${
              activeRoleView === 'DISPATCHER'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t.kanbanBoard}</span>
          </button>

          <button
            onClick={() => onChangeRoleView('FIELD_TECH')}
            className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-lg transition font-semibold cursor-pointer ${
              activeRoleView === 'FIELD_TECH'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t.techApp}</span>
          </button>

          <button
            onClick={() => onChangeRoleView('CUSTOMER_TRACK')}
            className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-lg transition font-semibold cursor-pointer ${
              activeRoleView === 'CUSTOMER_TRACK'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
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
            className={`px-3 py-1.5 rounded-xl border font-semibold text-xs transition flex items-center space-x-1.5 shadow-2xs cursor-pointer ${
              isMapDrawerOpen
                ? 'bg-indigo-600 text-white border-indigo-600'
                : 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800 hover:bg-indigo-50 dark:hover:bg-indigo-950'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isMapDrawerOpen ? t.closeMap : t.viewLiveMap}</span>
          </button>
        )}

        {/* User Profile Avatar */}
        <div className="flex items-center space-x-2 pl-1 border-l border-slate-200 dark:border-slate-700">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 to-emerald-500 text-white font-bold text-xs flex items-center justify-center shadow-xs cursor-pointer ring-2 ring-white dark:ring-slate-800">
            GP
          </div>
        </div>
      </div>
    </header>
  );
};
