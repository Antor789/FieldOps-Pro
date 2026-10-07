import React, { useState, useRef, useEffect } from 'react';
import { UserRole } from '../../types/rbac';
import { ROLES } from '../../utils/permissions';
import { RoleBadge } from './RoleBadge';
import { ChevronDown, Check } from 'lucide-react';

export interface RoleSelectorProps {
  value: UserRole;
  onChange: (role: UserRole) => void;
  excludeSuperAdmin?: boolean;
  disabled?: boolean;
  className?: string;
  locale?: 'en' | 'bn';
}

export const RoleSelector: React.FC<RoleSelectorProps> = ({
  value,
  onChange,
  excludeSuperAdmin = false,
  disabled = false,
  className = '',
  locale = 'en',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const availableRoles = ROLES.filter((r) => !excludeSuperAdmin || r.id !== 'super_admin');
  const selectedRole = availableRoles.find((r) => r.id === value) || availableRoles[0];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className={`relative inline-block text-left w-full ${className}`}>
      {/* Trigger Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between gap-2 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs hover:border-slate-300 dark:hover:border-slate-600 transition-colors ${
          disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
        }`}
      >
        <div className="flex items-center gap-2 truncate">
          <RoleBadge role={selectedRole.id} size="sm" />
          <span className="text-slate-500 dark:text-slate-400 text-[11px] truncate">
            {locale === 'bn' ? selectedRole.nameBangla : selectedRole.name}
          </span>
        </div>
        <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-50 mt-1.5 w-full min-w-[280px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl overflow-hidden animate-fadeIn py-1">
          <div className="px-3 py-1.5 border-b border-slate-100 dark:border-slate-800 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            {locale === 'bn' ? 'পদবি নির্বাচন করুন' : 'Assign Enterprise Role'}
          </div>

          <div className="max-h-64 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60">
            {availableRoles.map((role) => {
              const isSelected = role.id === value;
              return (
                <button
                  key={role.id}
                  type="button"
                  onClick={() => {
                    onChange(role.id);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 flex items-start gap-2.5 transition-colors cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/60 ${
                    isSelected ? 'bg-slate-50/80 dark:bg-slate-800/40' : ''
                  }`}
                >
                  <div className="shrink-0 mt-0.5">
                    <RoleBadge role={role.id} size="sm" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-xs text-slate-800 dark:text-slate-200">
                        {locale === 'bn' ? role.nameBangla : role.name}
                      </span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 ml-1" />}
                    </div>
                    <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-2 leading-relaxed">
                      {role.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
