import React, { useState } from 'react';
import { User, UserRole } from '../../types/rbac';
import { RoleBadge } from './RoleBadge';
import {
  MoreVertical,
  Mail,
  Phone,
  MapPin,
  Clock,
  Shield,
  UserCheck,
  UserX,
  Trash2,
  ExternalLink,
} from 'lucide-react';

export interface UserCardProps {
  user: User;
  onEdit?: (user: User) => void;
  onUpdateRole?: (userId: string, role: UserRole) => void;
  onDeactivate?: (userId: string) => void;
  onReactivate?: (userId: string) => void;
  onDelete?: (userId: string) => void;
  locale?: 'en' | 'bn';
}

export const UserCard: React.FC<UserCardProps> = ({
  user,
  onEdit,
  onDeactivate,
  onReactivate,
  onDelete,
  locale = 'en',
}) => {
  const [showMenu, setShowMenu] = useState(false);

  const statusConfig = {
    active: {
      label: 'Active',
      color: 'bg-emerald-500',
      badge: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
    },
    inactive: {
      label: 'Suspended',
      color: 'bg-rose-500',
      badge: 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800',
    },
    pending: {
      label: 'Invited (Pending)',
      color: 'bg-amber-500',
      badge: 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800',
    },
  }[user.status];

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col justify-between space-y-4 relative">
      {/* Top Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src={
                user.avatar ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=0284c7&color=fff`
              }
              alt={user.name}
              className="w-11 h-11 rounded-2xl object-cover ring-2 ring-slate-100 dark:ring-slate-800"
            />
            <span
              className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white dark:border-slate-900 ${statusConfig.color}`}
            />
          </div>

          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate max-w-[160px] sm:max-w-xs">
              {user.name}
            </h4>
            <div className="flex items-center gap-1.5 mt-0.5">
              <RoleBadge role={user.role} size="sm" />
            </div>
          </div>
        </div>

        {/* Quick Menu */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowMenu(!showMenu)}
            className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition cursor-pointer"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {showMenu && (
            <div className="absolute right-0 top-8 z-30 w-44 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl py-1 text-xs divide-y divide-slate-100 dark:divide-slate-800/80 animate-fadeIn">
              {onEdit && (
                <button
                  type="button"
                  onClick={() => {
                    setShowMenu(false);
                    onEdit(user);
                  }}
                  className="w-full text-left px-3 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-blue-500" />
                  <span>View & Edit Profile</span>
                </button>
              )}

              {user.status === 'active' && onDeactivate && (
                <button
                  type="button"
                  onClick={() => {
                    setShowMenu(false);
                    onDeactivate(user.id);
                  }}
                  className="w-full text-left px-3 py-2 text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/40 flex items-center gap-2"
                >
                  <UserX className="w-3.5 h-3.5" />
                  <span>Suspend Account</span>
                </button>
              )}

              {user.status !== 'active' && onReactivate && (
                <button
                  type="button"
                  onClick={() => {
                    setShowMenu(false);
                    onReactivate(user.id);
                  }}
                  className="w-full text-left px-3 py-2 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 flex items-center gap-2"
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>Activate Account</span>
                </button>
              )}

              {onDelete && (
                <button
                  type="button"
                  onClick={() => {
                    setShowMenu(false);
                    onDelete(user.id);
                  }}
                  className="w-full text-left px-3 py-2 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 flex items-center gap-2"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete User</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Details List */}
      <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
        <div className="flex items-center gap-2 truncate">
          <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="truncate">{user.email}</span>
        </div>

        <div className="flex items-center gap-2">
          <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="font-mono">+88{user.phone}</span>
        </div>

        {user.division && (
          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>{user.division} Division, Bangladesh</span>
          </div>
        )}

        <div className="flex items-center gap-2 text-[11px] text-slate-400 pt-1">
          <Clock className="w-3 h-3 shrink-0" />
          <span>Last active: {typeof user.lastLogin === 'string' ? user.lastLogin : 'Recent'}</span>
        </div>
      </div>

      {/* Bottom Footer Status */}
      <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px]">
        <span className={`px-2 py-0.5 rounded-full font-semibold border ${statusConfig.badge}`}>
          {statusConfig.label}
        </span>

        {onEdit && (
          <button
            type="button"
            onClick={() => onEdit(user)}
            className="font-bold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
          >
            Manage Permissions &rarr;
          </button>
        )}
      </div>
    </div>
  );
};
