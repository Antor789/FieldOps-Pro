import React, { useState } from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import { Input, FloatingInput } from './Input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './Card';
import { Badge, PriorityBadge } from './Badge';
import { ProgressRing } from './ProgressRing';
import { Skeleton } from './Skeleton';
import { useToast } from '../../context/ToastContext';
import { useTheme } from '../../context/ThemeContext';
import { DESIGN_TOKENS } from '../../styles/designTokens';
import {
  Palette,
  Type,
  Layers,
  Sparkles,
  MousePointer,
  Bell,
  Sun,
  Moon,
  Search,
  CheckCircle2,
  AlertTriangle,
  Cpu,
  Clock,
  ShieldCheck,
  Send,
  Zap,
} from 'lucide-react';

interface DesignSystemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTriggerCelebration: () => void;
}

export const DesignSystemModal: React.FC<DesignSystemModalProps> = ({
  isOpen,
  onClose,
  onTriggerCelebration,
}) => {
  const [activeTab, setActiveTab] = useState<'tokens' | 'components' | 'interactions' | 'typography'>('tokens');
  const { theme, toggleTheme } = useTheme();
  const { addToast } = useToast();

  const [inputVal, setInputVal] = useState('Gulshan 2, Road 113');
  const [floatingVal, setFloatingVal] = useState('DESCO Substation #4');
  const [progressVal, setProgressVal] = useState(65);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="4xl"
      title={
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
            DS
          </div>
          <div>
            <div className="text-sm font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              FieldOps Pro — Design System & Component Library
              <span className="text-[10px] bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 px-2 py-0.5 rounded-full font-mono">
                v3.4 Production
              </span>
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400">
              Tokens, UI Components, Dark/Light Themes & Micro-Interactions
            </div>
          </div>
        </div>
      }
      footer={
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center space-x-2">
            <button
              onClick={toggleTheme}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold cursor-pointer"
            >
              {theme === 'dark' ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-indigo-500" />}
              <span>{theme === 'dark' ? 'Light Theme' : 'Dark Theme'}</span>
            </button>
          </div>
          <Button size="sm" variant="primary" onClick={onClose}>
            Close System Guide
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl overflow-x-auto text-xs font-semibold">
          <button
            onClick={() => setActiveTab('tokens')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition shrink-0 ${
              activeTab === 'tokens'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            <span>1. Design Tokens & Palette</span>
          </button>

          <button
            onClick={() => setActiveTab('components')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition shrink-0 ${
              activeTab === 'components'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>2. UI Component Library</span>
          </button>

          <button
            onClick={() => setActiveTab('interactions')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition shrink-0 ${
              activeTab === 'interactions'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <MousePointer className="w-3.5 h-3.5" />
            <span>3. Micro-Interactions & SLAs</span>
          </button>

          <button
            onClick={() => setActiveTab('typography')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition shrink-0 ${
              activeTab === 'typography'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Type className="w-3.5 h-3.5" />
            <span>4. Typography & Spacing Scale</span>
          </button>
        </div>

        {/* Tab 1: Design Tokens & Palette */}
        {activeTab === 'tokens' && (
          <div className="space-y-5">
            {/* Color Palette Sections */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Brand Primary (Enterprise Indigo)
              </h4>
              <div className="grid grid-cols-5 sm:grid-cols-10 gap-1.5 font-mono text-[10px]">
                {Object.entries(DESIGN_TOKENS.colors.primary).map(([step, hex]) => (
                  <div key={step} className="space-y-1 text-center">
                    <div
                      className="h-10 rounded-xl shadow-xs border border-black/5 flex items-center justify-center text-[9px] font-bold text-white/90"
                      style={{ backgroundColor: hex }}
                    >
                      {step}
                    </div>
                    <div className="text-slate-600 dark:text-slate-400 font-bold">{hex}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Slate Neutrals */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Slate Surface & Canvas Neutrals
              </h4>
              <div className="grid grid-cols-5 sm:grid-cols-11 gap-1.5 font-mono text-[10px]">
                {Object.entries(DESIGN_TOKENS.colors.slate).map(([step, hex]) => (
                  <div key={step} className="space-y-1 text-center">
                    <div
                      className="h-10 rounded-xl shadow-xs border border-slate-300 dark:border-slate-700 flex items-center justify-center text-[9px] font-bold"
                      style={{
                        backgroundColor: hex,
                        color: Number(step) > 400 ? '#ffffff' : '#0f172a',
                      }}
                    >
                      {step}
                    </div>
                    <div className="text-slate-600 dark:text-slate-400 truncate">{hex}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Semantic Colors */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Semantic & Bangladesh MFS Palette
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-sans text-xs">
                <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 rounded-2xl flex items-center space-x-3">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500 flex items-center justify-center text-white font-bold">✓</div>
                  <div>
                    <div className="font-bold text-emerald-900 dark:text-emerald-100">Success / Completed</div>
                    <div className="text-[10px] font-mono text-emerald-700 dark:text-emerald-300">#10B981</div>
                  </div>
                </div>

                <div className="p-3 bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 rounded-2xl flex items-center space-x-3">
                  <div className="w-7 h-7 rounded-lg bg-amber-500 flex items-center justify-center text-white font-bold">!</div>
                  <div>
                    <div className="font-bold text-amber-900 dark:text-amber-100">Warning / En Route</div>
                    <div className="text-[10px] font-mono text-amber-700 dark:text-amber-300">#F59E0B</div>
                  </div>
                </div>

                <div className="p-3 bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800 rounded-2xl flex items-center space-x-3">
                  <div className="w-7 h-7 rounded-lg bg-red-500 flex items-center justify-center text-white font-bold">✕</div>
                  <div>
                    <div className="font-bold text-red-900 dark:text-red-100">Emergency / SLA Breach</div>
                    <div className="text-[10px] font-mono text-red-700 dark:text-red-300">#EF4444</div>
                  </div>
                </div>

                <div className="p-3 bg-pink-50 dark:bg-pink-950/60 border border-pink-200 dark:border-pink-800 rounded-2xl flex items-center space-x-3">
                  <div className="w-7 h-7 rounded-lg bg-[#E2136E] flex items-center justify-center text-white font-bold">৳</div>
                  <div>
                    <div className="font-bold text-pink-900 dark:text-pink-100">bKash MFS & COD</div>
                    <div className="text-[10px] font-mono text-pink-700 dark:text-pink-300">#E2136E</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: UI Component Library */}
        {activeTab === 'components' && (
          <div className="space-y-6">
            {/* Buttons Showcase */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                1. Button Component Variants & Ripple
              </h4>
              <div className="flex flex-wrap gap-2.5 items-center">
                <Button variant="primary" leftIcon={<Zap className="w-3.5 h-3.5" />}>
                  Primary Button
                </Button>
                <Button variant="secondary" leftIcon={<ShieldCheck className="w-3.5 h-3.5" />}>
                  Secondary
                </Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost Action</Button>
                <Button variant="danger" leftIcon={<AlertTriangle className="w-3.5 h-3.5" />}>
                  Danger / Reject
                </Button>
                <Button variant="success" leftIcon={<CheckCircle2 className="w-3.5 h-3.5" />}>
                  Success / Sign
                </Button>
                <Button variant="ai" leftIcon={<Cpu className="w-3.5 h-3.5" />}>
                  AI Auto-Dispatch
                </Button>
                <Button isLoading={true}>Loading State</Button>
              </div>
            </div>

            {/* Inputs Showcase */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                2. Input Fields & Floating Labels
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Bangladesh Landmark Address"
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  leftIcon={<Search className="w-4 h-4" />}
                  clearable={true}
                  onClear={() => setInputVal('')}
                  helperText="Barikoi API & Google Maps BD address autocompletion"
                />

                <FloatingInput
                  label="Asset Identifier / Substation Code"
                  value={floatingVal}
                  onChange={(e) => setFloatingVal(e.target.value)}
                  leftIcon={<Cpu className="w-4 h-4" />}
                />
              </div>
            </div>

            {/* Badges & Status Indicators */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                3. Badges & Priority Chips
              </h4>
              <div className="flex flex-wrap gap-2 items-center">
                <PriorityBadge priority="EMERGENCY" />
                <PriorityBadge priority="CRITICAL" />
                <PriorityBadge priority="HIGH" />
                <PriorityBadge priority="MEDIUM" />
                <PriorityBadge priority="LOW" />
                <Badge variant="success" dot={true} pulseDot={true}>
                  ONLINE (GPS 4G)
                </Badge>
                <Badge variant="purple">DESCO ENTERPRISE</Badge>
                <Badge variant="cyan">MOHAKHALI ZONE</Badge>
              </div>
            </div>

            {/* Cards Showcase */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                4. Cards with Hover-Lift & Micro-Borders
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card hoverLift={true} accentBorderColor="#4F46E5" gradientOverlay={true}>
                  <CardHeader>
                    <div>
                      <CardTitle>Optical Fiber Splicing #WO-9021</CardTitle>
                      <CardDescription>Grameenphone Telecom • Banani Sector 4</CardDescription>
                    </div>
                    <PriorityBadge priority="HIGH" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
                      <div>Technician: <strong>Tanvir Ahmed (Field Unit #1)</strong></div>
                      <div>SLA Target: <strong>45 mins</strong></div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <span className="text-xs font-mono font-bold text-emerald-600">৳ 8,500</span>
                    <Button size="xs" variant="primary">Dispatch Now</Button>
                  </CardFooter>
                </Card>

                <Card hoverLift={true} accentBorderColor="#EF4444">
                  <CardHeader>
                    <div>
                      <CardTitle>Substation Transformer Outage #WO-9022</CardTitle>
                      <CardDescription>DESCO Power • Mirpur DOHS</CardDescription>
                    </div>
                    <PriorityBadge priority="EMERGENCY" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
                      <div>Technician: <strong>Unassigned (Queue)</strong></div>
                      <div>SLA Target: <strong>30 mins Emergency</strong></div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <span className="text-xs font-mono font-bold text-emerald-600">৳ 12,000</span>
                    <Button size="xs" variant="danger">Auto Dispatch AI</Button>
                  </CardFooter>
                </Card>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Micro-Interactions & SLAs */}
        {activeTab === 'interactions' && (
          <div className="space-y-6">
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                1. SLA Countdown Circular Progress Rings
              </h4>
              <div className="flex flex-wrap items-center gap-6 p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
                <div className="flex items-center space-x-3">
                  <ProgressRing progressPercent={85} size={42} remainingText="48m" />
                  <div>
                    <div className="text-xs font-bold text-slate-800 dark:text-slate-200">Normal SLA (&gt;50%)</div>
                    <div className="text-[10px] text-emerald-600">Emerald Nominal</div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <ProgressRing progressPercent={35} size={42} remainingText="18m" />
                  <div>
                    <div className="text-xs font-bold text-slate-800 dark:text-slate-200">Warning SLA (&lt;40%)</div>
                    <div className="text-[10px] text-amber-600">Amber Approaching</div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <ProgressRing progressPercent={10} size={42} remainingText="4m" isBreached={true} />
                  <div>
                    <div className="text-xs font-bold text-slate-800 dark:text-slate-200">Critical Breach (&lt;15%)</div>
                    <div className="text-[10px] text-red-600">Crimson Flashing</div>
                  </div>
                </div>

                <div className="flex-1 min-w-[200px] flex items-center space-x-3">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={progressVal}
                    onChange={(e) => setProgressVal(Number(e.target.value))}
                    className="w-full"
                  />
                  <ProgressRing progressPercent={progressVal} size={42} remainingText={`${progressVal}%`} />
                </div>
              </div>
            </div>

            {/* Trigger Toasts */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                2. Real-Time Toast Notifications System
              </h4>
              <div className="flex flex-wrap gap-2.5">
                <Button
                  size="sm"
                  variant="success"
                  onClick={() =>
                    addToast({
                      title: 'Work Order Completed',
                      description: 'Signed by customer & NBR VAT receipt generated in BDT',
                      type: 'success',
                    })
                  }
                >
                  Trigger Success Toast
                </Button>

                <Button
                  size="sm"
                  variant="primary"
                  onClick={() =>
                    addToast({
                      title: 'Greenweb SMS Sent to Customer',
                      description: '“আপনার সার্ভিস টেকনিশিয়ান ১০ মিনিটের মধ্যে পৌঁছাচ্ছেন”',
                      type: 'sms',
                    })
                  }
                >
                  Trigger SMS Toast
                </Button>

                <Button
                  size="sm"
                  variant="danger"
                  onClick={() =>
                    addToast({
                      title: 'SLA Breach Warning #WO-8910',
                      description: 'Job in Mirpur DOHS approaching 30-min threshold',
                      type: 'error',
                    })
                  }
                >
                  Trigger SLA Alert Toast
                </Button>

                <Button
                  size="sm"
                  variant="ai"
                  onClick={() => {
                    addToast({
                      title: 'AI Auto-Dispatch Solved',
                      description: 'Matched Technician Tanvir Ahmed in 42ms (Score: 94/100)',
                      type: 'ai',
                    });
                  }}
                >
                  Trigger AI Solver Toast
                </Button>
              </div>
            </div>

            {/* Status Change Celebration Trigger */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                3. Micro-Interaction Status Change Celebration
              </h4>
              <div className="p-4 bg-gradient-to-r from-emerald-500/10 via-indigo-500/10 to-purple-500/10 border border-emerald-300 dark:border-emerald-700/80 rounded-2xl flex items-center justify-between">
                <div>
                  <div className="font-bold text-xs text-slate-900 dark:text-slate-100">
                    Confetti & Badge Micro-Celebration
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    Fired whenever a work order transitions to COMPLETED & SIGNED or payment is settled.
                  </div>
                </div>
                <Button
                  variant="success"
                  onClick={onTriggerCelebration}
                  leftIcon={<Sparkles className="w-4 h-4" />}
                >
                  Launch Celebration
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Typography & Spacing Scale */}
        {activeTab === 'typography' && (
          <div className="space-y-5 font-sans">
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Typography Scale (Plus Jakarta Sans & JetBrains Mono)
              </h4>
              <div className="space-y-3 p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
                <div className="flex items-baseline justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                  <span className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">Display 32px • FieldOps Pro</span>
                  <span className="font-mono text-xs text-slate-500">2rem / 32px</span>
                </div>
                <div className="flex items-baseline justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                  <span className="text-lg font-bold text-slate-900 dark:text-slate-100">H1 Heading 20px • Work Order Dispatch</span>
                  <span className="font-mono text-xs text-slate-500">1.25rem / 20px</span>
                </div>
                <div className="flex items-baseline justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                  <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">H2 Subheading 14px • Gulshan Zone Substation</span>
                  <span className="font-mono text-xs text-slate-500">0.875rem / 14px</span>
                </div>
                <div className="flex items-baseline justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                  <span className="text-xs text-slate-600 dark:text-slate-400">Body Text 12px • High density FSM task scannability</span>
                  <span className="font-mono text-xs text-slate-500">0.75rem / 12px</span>
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="font-mono text-xs text-indigo-600 dark:text-indigo-400 font-bold tabular-nums">
                    Monospace Telemetry 12px: 23.8103° N, 90.4125° E • ৳ 12,500 • 1,482 pings/s
                  </span>
                  <span className="font-mono text-xs text-slate-500">JetBrains Mono</span>
                </div>
              </div>
            </div>

            {/* 4px Base Spacing Grid */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                4px Base Grid Spacing Standards
              </h4>
              <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 font-mono text-xs text-center">
                {Object.entries(DESIGN_TOKENS.spacing).map(([key, val]) => (
                  <div key={key} className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    <div className="font-bold text-indigo-600 dark:text-indigo-400">{val}</div>
                    <div className="text-[10px] text-slate-500">space-{key}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
