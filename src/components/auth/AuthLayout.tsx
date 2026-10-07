import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import {
  Wrench,
  ShieldCheck,
  CheckCircle2,
  Users,
  ClipboardList,
  Star,
  Sun,
  Moon,
  Globe,
  Radio,
  Lock,
} from 'lucide-react';
import { motion } from 'motion/react';

export interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  locale?: 'en' | 'bn';
  onLocaleChange?: (lang: 'en' | 'bn') => void;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  title,
  subtitle,
  locale = 'en',
  onLocaleChange,
}) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen w-full flex bg-slate-50 dark:bg-[#070b14] text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {/* LEFT PANEL: Enterprise Branding & Animated Bangladesh Radar (Desktop Only) */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-12 bg-linear-to-br from-slate-900 via-slate-950 to-slate-900 text-white overflow-hidden border-r border-slate-800">
        {/* Background Grid & Radial Glow */}
        <div className="absolute inset-0 bg-grid-white/[0.03] bg-[size:32px_32px]" />
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Brand Header */}
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-linear-to-tr from-emerald-500 to-teal-400 text-slate-950 shadow-lg shadow-emerald-500/20">
              <Wrench className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black tracking-tight text-white font-mono">
                  FIELDOPS<span className="text-emerald-400 font-sans">PRO</span>
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Bangladesh
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Next-Gen Enterprise Field Service & Telemetry
              </p>
            </div>
          </div>
        </div>

        {/* Interactive Bangladesh Map & Live Dispatch Radar */}
        <div className="relative z-10 my-auto py-8">
          <div className="relative w-full max-w-md mx-auto aspect-4/3 bg-slate-950/70 border border-slate-800/90 rounded-3xl p-6 shadow-2xl backdrop-blur-md overflow-hidden">
            {/* Radar Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-4">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                </span>
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
                  National Fleet GPS Radar
                </span>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 font-semibold px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-800/60">
                LIVE • BST (UTC+6)
              </span>
            </div>

            {/* Stylized Bangladesh Map Geometry with Pulsing Node Hubs */}
            <div className="relative h-44 w-full flex items-center justify-center">
              {/* Map Outline Silhouette Simulation */}
              <svg
                viewBox="0 0 200 240"
                className="w-44 h-full stroke-emerald-500/30 fill-emerald-950/20 stroke-1"
              >
                <path d="M 90 20 Q 120 30 135 60 Q 160 80 150 110 Q 170 140 160 170 Q 140 210 110 220 Q 80 230 65 200 Q 50 160 60 120 Q 40 80 70 50 Z" />
              </svg>

              {/* Node 1: Dhaka NOC (HQ) */}
              <div className="absolute top-[48%] left-[50%] -translate-x-1/2 -translate-y-1/2 flex items-center gap-1.5 group cursor-pointer">
                <span className="relative flex h-3.5 w-3.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-90" />
                  <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-400 border-2 border-slate-950" />
                </span>
                <span className="text-[11px] font-mono font-bold bg-slate-900/90 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/40 shadow-sm">
                  Dhaka HQ (42 Units)
                </span>
              </div>

              {/* Node 2: Chittagong Hub */}
              <div className="absolute top-[72%] left-[68%] flex items-center gap-1">
                <span className="h-2.5 w-2.5 rounded-full bg-cyan-400 shadow-sm" />
                <span className="text-[10px] font-mono text-cyan-300 bg-slate-900/80 px-1.5 py-0.5 rounded">
                  Ctg Hub (24)
                </span>
              </div>

              {/* Node 3: Sylhet Substation */}
              <div className="absolute top-[32%] left-[66%] flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-amber-400" />
                <span className="text-[10px] font-mono text-amber-300 bg-slate-900/80 px-1.5 py-0.5 rounded">
                  Sylhet (12)
                </span>
              </div>

              {/* Node 4: Rajshahi Depot */}
              <div className="absolute top-[36%] left-[28%] flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-purple-400" />
                <span className="text-[10px] font-mono text-purple-300 bg-slate-900/80 px-1.5 py-0.5 rounded">
                  Rajshahi (11)
                </span>
              </div>
            </div>

            <p className="text-xs text-center text-slate-400 mt-2">
              &quot;Managing 500+ field technicians across 64 districts in Bangladesh&quot;
            </p>
          </div>

          {/* Operational Metrics Cards */}
          <div className="grid grid-cols-3 gap-3 max-w-md mx-auto mt-4">
            <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 text-center">
              <div className="text-sm font-black text-emerald-400 font-mono">1,240+</div>
              <div className="text-[10px] text-slate-400 mt-0.5 flex items-center justify-center gap-1">
                <ClipboardList className="w-3 h-3 text-emerald-500" />
                Jobs / Month
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 text-center">
              <div className="text-sm font-black text-cyan-400 font-mono">89 Techs</div>
              <div className="text-[10px] text-slate-400 mt-0.5 flex items-center justify-center gap-1">
                <Users className="w-3 h-3 text-cyan-500" />
                Active Fleet
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 text-center">
              <div className="text-sm font-black text-amber-400 font-mono">⭐ 4.8 / 5.0</div>
              <div className="text-[10px] text-slate-400 mt-0.5 flex items-center justify-center gap-1">
                <Star className="w-3 h-3 text-amber-500" />
                CSAT Rating
              </div>
            </div>
          </div>
        </div>

        {/* Security & Compliance Footer */}
        <div className="relative z-10 flex items-center justify-between text-xs text-slate-400 pt-4 border-t border-slate-800">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>NBR VAT BIN: 002938102-0101</span>
          </div>
          <div className="flex items-center gap-1 font-mono text-[11px]">
            <Radio className="w-3 h-3 text-blue-400 animate-pulse" />
            <span>Greenweb SMS BD Gateway</span>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL: Form Container with Responsive Layout */}
      <div className="w-full lg:w-1/2 flex flex-col justify-between p-6 sm:p-12 overflow-y-auto">
        {/* Top Controls (Theme & Language Switcher) */}
        <div className="flex items-center justify-between sm:justify-end gap-3 w-full max-w-md mx-auto">
          {onLocaleChange && (
            <button
              onClick={() => onLocaleChange(locale === 'en' ? 'bn' : 'en')}
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <Globe className="w-3.5 h-3.5 text-emerald-500" />
              <span>{locale === 'en' ? 'বাংলা' : 'English'}</span>
            </button>
          )}

          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
            title="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>
        </div>

        {/* Centered Form Body */}
        <div className="w-full max-w-md mx-auto my-auto py-8">
          {/* Header Title */}
          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              {title}
            </h1>
            {subtitle && (
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
                {subtitle}
              </p>
            )}
          </div>

          {/* Form Content */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            {children}
          </motion.div>
        </div>

        {/* Bottom Note */}
        <div className="w-full max-w-md mx-auto text-center text-xs text-slate-400 pt-4 border-t border-slate-200 dark:border-slate-800/80">
          <p>© {new Date().getFullYear()} FieldOps Pro Bangladesh Ltd. All rights reserved.</p>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Encrypted with 256-bit TLS • Greenweb SMS OTP • NBR Compliant
          </p>
        </div>
      </div>
    </div>
  );
};
