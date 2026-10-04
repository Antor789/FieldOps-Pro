import React, { useState } from 'react';
import { CalendarTechnician } from '../../types/calendar';
import { Search, Star, Phone, MapPin, UserCheck, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';

export interface TechnicianSidebarProps {
  technicians: CalendarTechnician[];
  selectedTechId: string | 'all';
  locale?: 'en' | 'bn';
  onSelectTech: (techId: string | 'all') => void;
}

export const TechnicianSidebar: React.FC<TechnicianSidebarProps> = ({
  technicians,
  selectedTechId,
  locale = 'en',
  onSelectTech,
}) => {
  const [search, setSearch] = useState('');

  const filteredTechs = technicians.filter((t) => {
    const q = search.toLowerCase();
    const nameMatch = t.name.toLowerCase().includes(q) || (t.nameBangla && t.nameBangla.includes(q));
    const roleMatch = t.role.toLowerCase().includes(q);
    const zoneMatch = t.currentZone.toLowerCase().includes(q);
    return nameMatch || roleMatch || zoneMatch;
  });

  const availableCount = technicians.filter((t) => t.status === 'available').length;
  const busyCount = technicians.filter((t) => t.status === 'busy').length;
  const offlineCount = technicians.filter((t) => t.status === 'offline').length;

  return (
    <div className="w-full lg:w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col h-full shrink-0 transition-colors">
      {/* Sidebar Header */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            {locale === 'bn' ? '👷 ফিল্ড টেকনিশিয়ান রোস্টার' : '👷 Technician Roster'}
          </h3>
          <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
            {technicians.length} {locale === 'bn' ? 'জন' : 'units'}
          </span>
        </div>

        {/* Search Field */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={locale === 'bn' ? 'নাম বা এলাকা খুঁজুন...' : 'Search tech or zone...'}
            className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
          />
        </div>

        {/* Availability Counters */}
        <div className="grid grid-cols-3 gap-1.5 mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-center text-[10px]">
          <div className="p-1 rounded bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900/60 font-medium">
            <span className="font-bold">{availableCount}</span> {locale === 'bn' ? 'মুক্ত' : 'Free'}
          </div>
          <div className="p-1 rounded bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-900/60 font-medium">
            <span className="font-bold">{busyCount}</span> {locale === 'bn' ? 'ব্যস্ত' : 'Busy'}
          </div>
          <div className="p-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 font-medium">
            <span className="font-bold">{offlineCount}</span> {locale === 'bn' ? 'অফলাইন' : 'Off'}
          </div>
        </div>
      </div>

      {/* Technician List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
        {/* All Technicians Option */}
        <button
          onClick={() => onSelectTech('all')}
          className={`w-full p-2 rounded-lg text-left text-xs font-semibold flex items-center justify-between transition-all ${
            selectedTechId === 'all'
              ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-900'
              : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
          }`}
        >
          <span>{locale === 'bn' ? '🌐 সকল টেকনিশিয়ান দেখুন' : '🌐 View All Technicians'}</span>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            {technicians.length}
          </span>
        </button>

        {filteredTechs.map((tech) => {
          const isSelected = selectedTechId === tech.id;

          return (
            <motion.div
              key={tech.id}
              whileHover={{ x: 2 }}
              onClick={() => onSelectTech(tech.id)}
              className={`p-2.5 rounded-lg border cursor-pointer transition-all ${
                isSelected
                  ? 'bg-indigo-50/80 dark:bg-indigo-950/40 border-indigo-300 dark:border-indigo-800 ring-1 ring-indigo-500'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div className="relative shrink-0">
                  <img
                    src={tech.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&fit=crop&q=80'}
                    alt={tech.name}
                    className="w-9 h-9 rounded-full object-cover border border-slate-200 dark:border-slate-700 shadow-xs"
                  />
                  <span
                    className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full ring-2 ring-white dark:ring-slate-900 ${
                      tech.status === 'available'
                        ? 'bg-emerald-500'
                        : tech.status === 'busy'
                        ? 'bg-amber-500'
                        : 'bg-slate-400'
                    }`}
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {locale === 'bn' && tech.nameBangla ? tech.nameBangla : tech.name}
                    </h4>
                    <div className="flex items-center gap-0.5 text-[10px] text-amber-500 font-bold shrink-0">
                      <Star className="w-2.5 h-2.5 fill-amber-400" />
                      {tech.rating}
                    </div>
                  </div>

                  <p className="text-[10px] text-slate-500 truncate">{tech.role}</p>

                  <div className="flex items-center justify-between mt-1 text-[10px] text-slate-400">
                    <span className="flex items-center gap-1 truncate">
                      <MapPin className="w-2.5 h-2.5 text-rose-500 shrink-0" />
                      {tech.currentZone}
                    </span>
                    <span className="font-mono text-slate-500">
                      {tech.workingHours.startHour}:00 - {tech.workingHours.endHour}:00
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
