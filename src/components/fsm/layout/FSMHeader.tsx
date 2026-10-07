import React, { useState, useEffect, useRef } from 'react';
import { Tenant } from '../../../types/fsm';
import { Language, translations, formatDhakaTime } from '../../../lib/i18n';
import { useTheme } from '../../../context/ThemeContext';
import { useToast } from '../../../context/ToastContext';
import { useAuth } from '../../../hooks/useAuth';
import { Button } from '../../ui/Button';
import { Badge } from '../../ui/Badge';
import { NotificationBell } from '../../notifications/NotificationBell';
import { ConnectionStatus, OnlinePresence, LiveNotificationBell } from '../../realtime';
import { useSocket } from '../../../hooks/useSocket';
import {
  Search,
  Command,
  Bell,
  Sun,
  Moon,
  Globe,
  ShieldCheck,
  ChevronDown,
  Sparkles,
  Palette,
  CheckCircle2,
  AlertTriangle,
  MessageSquare,
  Banknote,
  User,
  Settings,
  LogOut,
  FileText,
  MapPin,
  X,
  Plus,
  KeyRound,
  History,
  Radio,
} from 'lucide-react';

interface FSMHeaderProps {
  tenants: Tenant[];
  currentTenant: Tenant;
  onSelectTenant: (tenant: Tenant) => void;
  lang: Language;
  onToggleLanguage: () => void;
  onOpenDesignSystem: () => void;
  onOpenCreateOrder: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  unreadNotificationCount?: number;
  onOpenSecurityModal?: (tab: '2fa' | 'password' | 'history') => void;
  onToggleLiveFeed?: () => void;
}

export const FSMHeader: React.FC<FSMHeaderProps> = ({
  tenants,
  currentTenant,
  onSelectTenant,
  lang,
  onToggleLanguage,
  onOpenDesignSystem,
  onOpenCreateOrder,
  searchQuery,
  onSearchChange,
  unreadNotificationCount = 3,
  onOpenSecurityModal,
  onToggleLiveFeed,
}) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { addToast } = useToast();
  const { isFeedDrawerOpen, setIsFeedDrawerOpen, unreadEventCount } = useSocket();
  const t = translations[lang];

  const [isTenantDropdownOpen, setIsTenantDropdownOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [dhakaTime, setDhakaTime] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut listener (⌘K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Live Dhaka BST Clock
  useEffect(() => {
    const updateTime = () => setDhakaTime(formatDhakaTime(new Date(), lang));
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [lang]);

  // Notifications List
  const mockNotifications = [
    {
      id: '1',
      title: 'Emergency SLA Alert',
      desc: 'Work order #WO-9022 in Mirpur DOHS approaching 30-min SLA breach',
      time: '2 mins ago',
      type: 'alert',
    },
    {
      id: '2',
      title: 'Greenweb SMS Gateway Dispatched',
      desc: 'Customer in Gulshan 2 notified: Technician Tanvir Ahmed is en route',
      time: '10 mins ago',
      type: 'sms',
    },
    {
      id: '3',
      title: 'bKash Payment Verified',
      desc: '৳ 8,500 collected from Grameenphone Banani (TRX-BKASH-891024)',
      time: '24 mins ago',
      type: 'payment',
    },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-colors duration-200 px-4 py-2.5 flex items-center justify-between gap-3 font-sans">
      {/* 1. Left Zone: Brand & Tenant Context Switcher */}
      <div className="flex items-center space-x-3">
        {/* Brand Lockup */}
        <div className="flex items-center space-x-2.5 select-none">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-700 text-white flex items-center justify-center font-extrabold text-xs shadow-xs tracking-wider ring-2 ring-indigo-500/20">
            FO
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-sm tracking-tight text-slate-900 dark:text-slate-100">
                {t.appName}
              </span>
              <span className="text-[9px] bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 px-1.5 py-0.2 rounded-full font-mono font-bold">
                BD v3.4
              </span>
            </div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium truncate max-w-[140px] sm:max-w-none">
              {t.appTagline}
            </div>
          </div>
        </div>

        <div className="hidden sm:block h-5 w-px bg-slate-200 dark:bg-slate-800" />

        {/* Tenant Selector Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setIsTenantDropdownOpen(!isTenantDropdownOpen);
              setIsNotificationsOpen(false);
              setIsProfileOpen(false);
            }}
            className="flex items-center space-x-1.5 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/80 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs px-2.5 py-1.5 rounded-xl transition font-medium text-slate-800 dark:text-slate-200 cursor-pointer shadow-2xs"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span className="font-semibold max-w-[110px] sm:max-w-[150px] truncate">
              {currentTenant.name}
            </span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {isTenantDropdownOpen && (
            <div className="absolute top-full left-0 mt-1.5 w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl z-50 p-1.5 text-xs animate-scale-in space-y-1">
              <div className="px-2.5 py-1 text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 border-b border-slate-100 dark:border-slate-800">
                {t.selectTenant}
              </div>
              {tenants.map((tenant) => (
                <button
                  key={tenant.id}
                  onClick={() => {
                    onSelectTenant(tenant);
                    setIsTenantDropdownOpen(false);
                    addToast({
                      title: `Switched Tenant: ${tenant.name}`,
                      description: `Active Domain: ${tenant.domain}`,
                      type: 'info',
                    });
                  }}
                  className={`w-full text-left px-2.5 py-2 rounded-xl flex items-center justify-between transition cursor-pointer ${
                    tenant.id === currentTenant.id
                      ? 'bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 font-bold border border-indigo-200 dark:border-indigo-800'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <div className="truncate">
                    <div className="font-semibold">{tenant.name}</div>
                    <div className="text-[10px] font-normal text-slate-400">{tenant.domain}</div>
                  </div>
                  <span className="text-[9px] bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800 px-1.5 py-0.5 rounded text-emerald-700 dark:text-emerald-300 font-mono font-bold">
                    {tenant.tier}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 2. Center Zone: Global Search with Keyboard Shortcut Indicator (⌘K) */}
      <div className="flex-1 max-w-md hidden md:block">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400 dark:text-slate-500" />
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="w-full bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 rounded-xl pl-9 pr-10 py-1.5 text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:bg-white dark:focus:bg-slate-950 focus:border-indigo-500 dark:focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition shadow-2xs"
          />
          <div className="absolute right-2.5 top-2 flex items-center space-x-0.5 bg-slate-200/80 dark:bg-slate-800 px-1.5 py-0.5 rounded text-[10px] text-slate-600 dark:text-slate-400 font-mono pointer-events-none">
            <Command className="w-2.5 h-2.5" />
            <span>K</span>
          </div>
        </div>
      </div>

      {/* 3. Right Zone: Realtime status, Presence, Actions, Design System, Notifications, Theme, Language, Profile */}
      <div className="flex items-center space-x-2 text-xs font-sans">
        {/* Real-time WebSocket Connection Status */}
        <div className="hidden sm:block">
          <ConnectionStatus compact />
        </div>

        {/* Real-time Field Technicians Online Presence */}
        <div className="hidden lg:block">
          <OnlinePresence />
        </div>

        {/* Live Feed Stream Toggle */}
        <button
          onClick={() => {
            if (onToggleLiveFeed) {
              onToggleLiveFeed();
            } else {
              setIsFeedDrawerOpen(!isFeedDrawerOpen);
            }
          }}
          className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-semibold transition cursor-pointer ${
            isFeedDrawerOpen
              ? 'bg-rose-500 text-white border-rose-600 shadow-xs'
              : 'bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
          }`}
          title="Toggle Real-time Live Event Feed"
        >
          <Radio className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
          <span className="hidden md:inline">Live Stream</span>
          {unreadEventCount > 0 && (
            <span className="bg-rose-500 text-white text-[10px] font-bold px-1.5 rounded-full">
              {unreadEventCount}
            </span>
          )}
        </button>

        {/* Quick Create Order Button */}
        <Button
          size="sm"
          variant="primary"
          onClick={onOpenCreateOrder}
          leftIcon={<Plus className="w-3.5 h-3.5" />}
          className="hidden xl:inline-flex shadow-xs"
        >
          <span>{lang === 'bn' ? '+ নতুন কাজ' : '+ New Job'}</span>
        </Button>

        {/* Design System Guide Launcher */}
        <button
          onClick={onOpenDesignSystem}
          className="hidden lg:flex items-center space-x-1.5 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 hover:from-indigo-500/20 hover:to-purple-500/20 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 px-2.5 py-1.5 rounded-xl transition font-bold cursor-pointer"
          title="Open Design System Tokens & Component Library Guide"
        >
          <Palette className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
          <span>Tokens</span>
        </button>

        {/* Live Dhaka BST Clock */}
        <div className="hidden xl:flex items-center space-x-1 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 px-2.5 py-1.5 rounded-xl font-mono text-[11px] text-slate-700 dark:text-slate-300">
          <span className="font-bold">{dhakaTime}</span>
        </div>

        {/* Notification Bell Dropdown */}
        <NotificationBell locale={lang} onOpenSettings={onOpenDesignSystem} />

        {/* Theme Toggle (Dark / Light) */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 transition cursor-pointer"
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-indigo-600" />
          )}
        </button>

        {/* Language Switcher (🇧🇩 / 🇬🇧) */}
        <button
          onClick={onToggleLanguage}
          className="flex items-center space-x-1.5 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 px-2.5 py-1.5 rounded-xl transition font-bold cursor-pointer"
          title="Toggle Language / ভাষা পরিবর্তন"
        >
          <span className="text-sm">{lang === 'en' ? '🇧🇩' : '🇬🇧'}</span>
          <span className="hidden sm:inline font-semibold">{lang === 'en' ? 'বাংলা' : 'EN'}</span>
        </button>

        {/* Profile Avatar Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setIsProfileOpen(!isProfileOpen);
              setIsTenantDropdownOpen(false);
              setIsNotificationsOpen(false);
            }}
            className="flex items-center space-x-1.5 p-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-emerald-500 text-white font-bold text-xs flex items-center justify-center shadow-xs ring-2 ring-white dark:ring-slate-800 uppercase font-mono">
              {user?.firstName?.[0] || 'A'}{user?.lastName?.[0] || 'D'}
            </div>
            <ChevronDown className="w-3 h-3 text-slate-400 hidden sm:block" />
          </button>

          {isProfileOpen && (
            <div className="absolute top-full right-0 mt-1.5 w-60 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl z-50 p-1.5 text-xs animate-scale-in space-y-1">
              <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
                <div className="font-bold text-slate-900 dark:text-slate-100 truncate">
                  {user?.name || 'Md. Shafiqul Islam'}
                </div>
                <div className="text-[10px] text-slate-400 font-mono truncate">
                  {user?.email || 'admin@fieldops.com.bd'}
                </div>
                <div className="mt-1 flex items-center gap-1.5">
                  <span className="text-[9px] uppercase font-bold px-1.5 py-0.2 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 font-mono">
                    {user?.role || 'ADMIN'}
                  </span>
                  {user?.isTwoFactorEnabled && (
                    <span className="text-[9px] font-bold text-emerald-600 flex items-center gap-0.5">
                      <ShieldCheck className="w-2.5 h-2.5" /> 2FA Active
                    </span>
                  )}
                </div>
              </div>

              {/* Security & 2FA modal trigger */}
              <button
                onClick={() => {
                  setIsProfileOpen(false);
                  if (onOpenSecurityModal) onOpenSecurityModal('2fa');
                }}
                className="w-full text-left px-3 py-1.5 rounded-xl flex items-center space-x-2 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition cursor-pointer"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>Two-Factor Auth (2FA)</span>
              </button>

              {/* Change Password trigger */}
              <button
                onClick={() => {
                  setIsProfileOpen(false);
                  if (onOpenSecurityModal) onOpenSecurityModal('password');
                }}
                className="w-full text-left px-3 py-1.5 rounded-xl flex items-center space-x-2 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition cursor-pointer"
              >
                <KeyRound className="w-3.5 h-3.5 text-blue-500" />
                <span>Change Password</span>
              </button>

              {/* Login History trigger */}
              <button
                onClick={() => {
                  setIsProfileOpen(false);
                  if (onOpenSecurityModal) onOpenSecurityModal('history');
                }}
                className="w-full text-left px-3 py-1.5 rounded-xl flex items-center space-x-2 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition cursor-pointer"
              >
                <History className="w-3.5 h-3.5 text-purple-500" />
                <span>Login Activity Log</span>
              </button>

              <button
                onClick={() => {
                  setIsProfileOpen(false);
                  onOpenDesignSystem();
                }}
                className="w-full text-left px-3 py-1.5 rounded-xl flex items-center space-x-2 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition cursor-pointer"
              >
                <Palette className="w-3.5 h-3.5 text-indigo-500" />
                <span>Design System Guide</span>
              </button>

              <div className="border-t border-slate-100 dark:border-slate-800 pt-1 mt-1">
                <button
                  onClick={() => {
                    setIsProfileOpen(false);
                    logout();
                  }}
                  className="w-full text-left px-3 py-1.5 rounded-xl flex items-center space-x-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition cursor-pointer font-semibold"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
