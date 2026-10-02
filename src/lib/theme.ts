export type UIThemeId = 'tactical-dark' | 'clean-light' | 'neon-cyberpunk' | 'nordic-warm' | 'glassmorphism';

export interface UITheme {
  id: UIThemeId;
  name: string;
  description: string;
  previewColors: string[]; // 3 color hex/tw classes for preview swatch
  
  // Dynamic CSS Class Mappings
  appBg: string;
  headerBg: string;
  headerBorder: string;
  panelBg: string;
  panelBorder: string;
  cardBg: string;
  cardHoverBg: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  accentPrimary: string;
  accentSecondary: string;
  badgeBg: string;
  badgeText: string;
  buttonPrimary: string;
  fontFamily: string;
  glowEffect: string;
}

export const classNameThemes: Record<UIThemeId, UITheme> = {
  'tactical-dark': {
    id: 'tactical-dark',
    name: 'Tactical Dark Ops',
    description: 'High-density industrial dark slate canvas with vibrant cyan & amber neon telemetry',
    previewColors: ['#020617', '#0f172a', '#38bdf8'],
    appBg: 'bg-slate-950 text-slate-100',
    headerBg: 'bg-slate-900/90 backdrop-blur border-b border-slate-800',
    headerBorder: 'border-slate-800',
    panelBg: 'bg-slate-900 border border-slate-800',
    panelBorder: 'border-slate-800',
    cardBg: 'bg-slate-950 border border-slate-800/80',
    cardHoverBg: 'hover:border-blue-500/50 hover:bg-slate-900/60',
    textPrimary: 'text-white',
    textSecondary: 'text-slate-300',
    textMuted: 'text-slate-500',
    accentPrimary: 'text-cyan-400 bg-cyan-950/60 border-cyan-800',
    accentSecondary: 'text-blue-400',
    badgeBg: 'bg-blue-950/80 border border-blue-800',
    badgeText: 'text-blue-300',
    buttonPrimary: 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/20',
    fontFamily: 'font-mono',
    glowEffect: 'shadow-[0_0_15px_rgba(56,189,248,0.15)]',
  },
  'clean-light': {
    id: 'clean-light',
    name: 'Enterprise Clean Light',
    description: 'Crisp corporate light slate canvas with indigo accents & high contrast cards',
    previewColors: ['#f8fafc', '#ffffff', '#4f46e5'],
    appBg: 'bg-slate-100 text-slate-900',
    headerBg: 'bg-white/95 backdrop-blur border-b border-slate-200 shadow-sm',
    headerBorder: 'border-slate-200',
    panelBg: 'bg-white border border-slate-200 shadow-sm',
    panelBorder: 'border-slate-200',
    cardBg: 'bg-slate-50 border border-slate-200',
    cardHoverBg: 'hover:border-indigo-500 hover:bg-white',
    textPrimary: 'text-slate-900',
    textSecondary: 'text-slate-700',
    textMuted: 'text-slate-500',
    accentPrimary: 'text-indigo-600 bg-indigo-50 border-indigo-200',
    accentSecondary: 'text-indigo-600',
    badgeBg: 'bg-indigo-50 border border-indigo-200',
    badgeText: 'text-indigo-700',
    buttonPrimary: 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md',
    fontFamily: 'font-sans',
    glowEffect: 'shadow-md',
  },
  'neon-cyberpunk': {
    id: 'neon-cyberpunk',
    name: 'Neon Cyberpunk HUD',
    description: 'Ultra-dark obsidian canvas with high-glow neon yellow, magenta & cyan HUD borders',
    previewColors: ['#000000', '#111111', '#facc15'],
    appBg: 'bg-black text-yellow-100',
    headerBg: 'bg-zinc-950 border-b-2 border-yellow-500/80',
    headerBorder: 'border-yellow-500',
    panelBg: 'bg-zinc-950 border-2 border-yellow-500/40',
    panelBorder: 'border-yellow-500/50',
    cardBg: 'bg-black border border-yellow-500/30',
    cardHoverBg: 'hover:border-yellow-400 hover:bg-zinc-900',
    textPrimary: 'text-yellow-300',
    textSecondary: 'text-yellow-100/90',
    textMuted: 'text-zinc-500',
    accentPrimary: 'text-yellow-400 bg-yellow-950/60 border-yellow-600',
    accentSecondary: 'text-fuchsia-400',
    badgeBg: 'bg-yellow-950/90 border border-yellow-500',
    badgeText: 'text-yellow-300',
    buttonPrimary: 'bg-yellow-500 hover:bg-yellow-400 text-black font-extrabold shadow-[0_0_20px_rgba(250,204,21,0.4)]',
    fontFamily: 'font-mono',
    glowEffect: 'shadow-[0_0_20px_rgba(250,204,21,0.25)]',
  },
  'nordic-warm': {
    id: 'nordic-warm',
    name: 'Nordic Slate & Amber',
    description: 'Luxurious dark charcoal & warm stone with rich amber and teal accents',
    previewColors: ['#1c1917', '#292524', '#f59e0b'],
    appBg: 'bg-stone-900 text-stone-100',
    headerBg: 'bg-stone-900/95 border-b border-stone-800',
    headerBorder: 'border-stone-800',
    panelBg: 'bg-stone-800/80 border border-stone-700/80',
    panelBorder: 'border-stone-700',
    cardBg: 'bg-stone-900/90 border border-stone-800',
    cardHoverBg: 'hover:border-amber-500/60 hover:bg-stone-850',
    textPrimary: 'text-stone-100',
    textSecondary: 'text-stone-300',
    textMuted: 'text-stone-500',
    accentPrimary: 'text-amber-400 bg-amber-950/50 border-amber-800',
    accentSecondary: 'text-amber-400',
    badgeBg: 'bg-amber-950/80 border border-amber-800',
    badgeText: 'text-amber-300',
    buttonPrimary: 'bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold shadow-lg shadow-amber-900/30',
    fontFamily: 'font-sans',
    glowEffect: 'shadow-[0_0_15px_rgba(245,158,11,0.2)]',
  },
  'glassmorphism': {
    id: 'glassmorphism',
    name: 'Glassmorphism Futuristic',
    description: 'Deep gradient space canvas with glowing frosted translucent panels & blue highlights',
    previewColors: ['#090d16', '#1e1b4b', '#6366f1'],
    appBg: 'bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 text-slate-100 min-h-screen',
    headerBg: 'bg-slate-900/60 backdrop-blur-xl border-b border-indigo-500/30 shadow-2xl',
    headerBorder: 'border-indigo-500/30',
    panelBg: 'bg-slate-900/50 backdrop-blur-xl border border-indigo-500/20 shadow-2xl',
    panelBorder: 'border-indigo-500/30',
    cardBg: 'bg-slate-900/60 backdrop-blur-md border border-indigo-500/20',
    cardHoverBg: 'hover:border-indigo-400/80 hover:bg-indigo-950/40',
    textPrimary: 'text-white',
    textSecondary: 'text-indigo-100',
    textMuted: 'text-indigo-300/60',
    accentPrimary: 'text-indigo-300 bg-indigo-950/70 border-indigo-500/40',
    accentSecondary: 'text-cyan-300',
    badgeBg: 'bg-indigo-900/60 backdrop-blur border border-indigo-400/30',
    badgeText: 'text-indigo-200',
    buttonPrimary: 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-[0_0_20px_rgba(99,102,241,0.4)]',
    fontFamily: 'font-sans',
    glowEffect: 'shadow-[0_0_25px_rgba(99,102,241,0.25)]',
  },
};
