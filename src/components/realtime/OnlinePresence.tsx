import React, { useState, useRef, useEffect } from 'react';
import { useSocket } from '../../hooks/useSocket';
import { OnlineUserPresence } from '../../types/realtime';
import {
  Users,
  MapPin,
  Battery,
  Radio,
  ExternalLink,
  ChevronDown,
  Clock,
  Shield,
  CheckCircle,
  X,
} from 'lucide-react';

export interface OnlinePresenceProps {
  onSelectTechnician?: (tech: OnlineUserPresence) => void;
  className?: string;
  compact?: boolean;
}

export const OnlinePresence: React.FC<OnlinePresenceProps> = ({
  onSelectTechnician,
  className = '',
  compact = false,
}) => {
  const { onlineUsers, onlineTechCount, triggerEventSimulation } = useSocket();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const activeTechnicians = onlineUsers.filter((u) => u.isTechnician);
  const activeDispatchers = onlineUsers.filter((u) => !u.isTechnician);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getStatusBadge = (status: OnlineUserPresence['status']) => {
    switch (status) {
      case 'online':
        return <span className="w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900 shadow-xs"></span>;
      case 'busy':
        return <span className="w-2 h-2 rounded-full bg-amber-500 ring-2 ring-white dark:ring-slate-900 shadow-xs"></span>;
      default:
        return <span className="w-2 h-2 rounded-full bg-slate-400 ring-2 ring-white dark:ring-slate-900 shadow-xs"></span>;
    }
  };

  return (
    <div className={`relative inline-block font-sans ${className}`} ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-2.5 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-700/80 border border-slate-200 dark:border-slate-700 transition cursor-pointer text-xs"
        title="View online technicians & dispatchers"
      >
        {/* Avatars preview overlap */}
        <div className="flex -space-x-1.5 overflow-hidden py-0.5">
          {activeTechnicians.slice(0, 3).map((user) => (
            <div key={user.id} className="relative inline-block">
              <img
                src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`}
                alt={user.name}
                className="w-5 h-5 rounded-full object-cover ring-1 ring-white dark:ring-slate-900"
              />
              <span className="absolute bottom-0 right-0 w-1.5 h-1.5 rounded-full bg-emerald-500 ring-1 ring-white dark:ring-slate-900"></span>
            </div>
          ))}
        </div>

        {/* Counter label */}
        <div className="flex items-center space-x-1.5 text-slate-700 dark:text-slate-200">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="font-bold text-[11px] text-slate-800 dark:text-slate-200">
            {onlineTechCount} Techs Online
          </span>
          <ChevronDown className="w-3 h-3 text-slate-400" />
        </div>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-3 z-50 text-xs">
          {/* Header */}
          <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center space-x-1.5">
              <Radio className="w-4 h-4 text-emerald-500 animate-pulse" />
              <span className="font-bold text-slate-900 dark:text-slate-100">
                Active Field Presence
              </span>
            </div>
            <span className="text-[10px] bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 font-bold px-2 py-0.5 rounded-full">
              {onlineTechCount} Active
            </span>
          </div>

          {/* Technicians List */}
          <div className="py-2 space-y-1.5 max-h-72 overflow-y-auto">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1">
              Field Technicians (GPS Active)
            </div>

            {activeTechnicians.map((tech) => (
              <div
                key={tech.id}
                onClick={() => {
                  if (onSelectTechnician) {
                    onSelectTechnician(tech);
                    setIsOpen(false);
                  }
                }}
                className="p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 transition cursor-pointer border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="relative">
                      <img
                        src={tech.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(tech.name)}`}
                        alt={tech.name}
                        className="w-7 h-7 rounded-full object-cover"
                      />
                      <span className="absolute bottom-0 right-0">
                        {getStatusBadge(tech.status)}
                      </span>
                    </div>

                    <div>
                      <div className="font-bold text-slate-900 dark:text-slate-100 text-[11px] flex items-center gap-1">
                        <span>{tech.name}</span>
                        {tech.activeWorkOrderId && (
                          <span className="text-[9px] bg-indigo-100 text-indigo-700 dark:bg-indigo-900/60 dark:text-indigo-300 px-1 rounded">
                            {tech.activeWorkOrderId}
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400">
                        {tech.role}
                      </div>
                    </div>
                  </div>

                  {tech.batteryLevel !== undefined && (
                    <div className="flex items-center space-x-1 text-[10px] font-mono text-slate-500">
                      <Battery className={`w-3.5 h-3.5 ${tech.batteryLevel < 30 ? 'text-rose-500' : 'text-emerald-500'}`} />
                      <span>{tech.batteryLevel}%</span>
                    </div>
                  )}
                </div>

                {tech.location && (
                  <div className="mt-1.5 flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/40 px-2 py-1 rounded-lg">
                    <div className="flex items-center space-x-1 truncate max-w-[180px]">
                      <MapPin className="w-3 h-3 text-sky-500 shrink-0" />
                      <span className="truncate">{tech.location.landmark}</span>
                    </div>
                    <span className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline shrink-0">
                      View Map →
                    </span>
                  </div>
                )}
              </div>
            ))}

            {/* Dispatchers & Admins */}
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1 pt-2">
              Dispatch & Ops Leads
            </div>

            {activeDispatchers.map((user) => (
              <div
                key={user.id}
                className="p-1.5 rounded-lg flex items-center justify-between text-[11px]"
              >
                <div className="flex items-center space-x-2">
                  <div className="relative">
                    <img
                      src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}`}
                      alt={user.name}
                      className="w-6 h-6 rounded-full object-cover"
                    />
                    <span className="absolute bottom-0 right-0">
                      {getStatusBadge(user.status)}
                    </span>
                  </div>
                  <div>
                    <div className="font-semibold text-slate-800 dark:text-slate-200">
                      {user.name}
                    </div>
                    <div className="text-[10px] text-slate-400">{user.role}</div>
                  </div>
                </div>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono">
                  Online
                </span>
              </div>
            ))}
          </div>

          {/* Quick Simulation trigger */}
          <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[10px]">
            <span className="text-slate-400">Simulate Tech:</span>
            <div className="space-x-1">
              <button
                onClick={() => triggerEventSimulation('technician:online')}
                className="px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-semibold hover:bg-emerald-100 cursor-pointer"
              >
                + Join
              </button>
              <button
                onClick={() => triggerEventSimulation('technician:offline')}
                className="px-2 py-0.5 rounded bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-300 font-semibold hover:bg-rose-100 cursor-pointer"
              >
                - Leave
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
