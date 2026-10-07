import React, { useState } from 'react';
import { User, UserRole } from '../../types/rbac';
import { RoleSelector } from '../../components/rbac/RoleSelector';
import { RoleBadge } from '../../components/rbac/RoleBadge';
import { PermissionMatrix } from '../../components/rbac/PermissionMatrix';
import { useToast } from '../../context/ToastContext';
import {
  User as UserIcon,
  Mail,
  Phone,
  MapPin,
  Clock,
  Shield,
  ShieldCheck,
  UserCheck,
  UserX,
  Save,
  ArrowLeft,
  Calendar,
  AlertTriangle,
  History,
} from 'lucide-react';

export interface UserProfileProps {
  user: User;
  onBack: () => void;
  onUpdateRole: (userId: string, role: UserRole) => Promise<boolean>;
  onUpdatePermissions: (userId: string, perms: string[]) => Promise<boolean>;
  onDeactivate: (userId: string) => Promise<boolean>;
  onReactivate: (userId: string) => Promise<boolean>;
  locale?: 'en' | 'bn';
}

export const UserProfilePage: React.FC<UserProfileProps> = ({
  user,
  onBack,
  onUpdateRole,
  onUpdatePermissions,
  onDeactivate,
  onReactivate,
  locale = 'en',
}) => {
  const { addToast } = useToast();

  const [currentRole, setCurrentRole] = useState<UserRole>(user.role);
  const [customPerms, setCustomPerms] = useState<string[]>(user.customPermissions || []);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'permissions' | 'activity'>('overview');

  const handleSaveRole = async () => {
    setIsSaving(true);
    await onUpdateRole(user.id, currentRole);
    await onUpdatePermissions(user.id, customPerms);
    setIsSaving(false);
  };

  const isSuspended = user.status === 'inactive';

  return (
    <div className="space-y-6 animate-fadeIn font-sans pb-12">
      {/* Top Navigation */}
      <div className="flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to User Directory</span>
        </button>

        <div className="flex items-center gap-2">
          {isSuspended ? (
            <button
              type="button"
              onClick={() => onReactivate(user.id)}
              className="py-2 px-3.5 rounded-xl border border-emerald-300 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-bold hover:bg-emerald-100 dark:hover:bg-emerald-900/60 flex items-center gap-1.5 transition cursor-pointer"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Activate User</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => onDeactivate(user.id)}
              className="py-2 px-3.5 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 text-xs font-bold hover:bg-rose-100 dark:hover:bg-rose-900/60 flex items-center gap-1.5 transition cursor-pointer"
            >
              <UserX className="w-3.5 h-3.5" />
              <span>Suspend Account</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleSaveRole}
            disabled={isSaving}
            className="py-2 px-4 rounded-xl bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-md shadow-emerald-600/20 flex items-center gap-1.5 transition cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
          </button>
        </div>
      </div>

      {/* Main Profile Card Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img
            src={
              user.avatar ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=0284c7&color=fff`
            }
            alt={user.name}
            className="w-16 h-16 rounded-2xl object-cover ring-4 ring-slate-100 dark:ring-slate-800 shrink-0"
          />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
                {user.name}
              </h2>
              <RoleBadge role={user.role} size="md" />
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-2">
              <span>{user.email}</span>
              <span>•</span>
              <span className="font-mono">+88{user.phone}</span>
            </p>
          </div>
        </div>

        {/* Quick Metadata Stats */}
        <div className="flex items-center gap-6 border-t md:border-t-0 md:border-l border-slate-200 dark:border-slate-800 pt-4 md:pt-0 md:pl-6 text-xs text-slate-500">
          <div>
            <span className="text-[11px] block uppercase text-slate-400 font-bold tracking-wider">Status</span>
            <span className={`font-bold capitalize ${
              user.status === 'active' ? 'text-emerald-500' : 'text-rose-500'
            }`}>
              {user.status}
            </span>
          </div>

          <div>
            <span className="text-[11px] block uppercase text-slate-400 font-bold tracking-wider">Division</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              {user.division || 'Dhaka'}
            </span>
          </div>

          <div>
            <span className="text-[11px] block uppercase text-slate-400 font-bold tracking-wider">Created</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              {typeof user.createdAt === 'string' ? user.createdAt : '2024-01-01'}
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 text-xs font-semibold">
        <button
          type="button"
          onClick={() => setActiveTab('overview')}
          className={`py-2.5 px-4 border-b-2 transition cursor-pointer ${
            activeTab === 'overview'
              ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          Role & Access Assignment
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('permissions')}
          className={`py-2.5 px-4 border-b-2 transition cursor-pointer ${
            activeTab === 'permissions'
              ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          Effective Permission Matrix ({customPerms.length} overrides)
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('activity')}
          className={`py-2.5 px-4 border-b-2 transition cursor-pointer ${
            activeTab === 'activity'
              ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          Security Audit Activity
        </button>
      </div>

      {/* TAB CONTENT 1: OVERVIEW & ROLE SELECTOR */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            {/* Role Modifier Box */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Assigned Enterprise Role
                  </h3>
                  <p className="text-xs text-slate-500">
                    Determines what operations, dispatch boards, and reports the user can access.
                  </p>
                </div>
              </div>

              <div className="max-w-md">
                <RoleSelector
                  value={currentRole}
                  onChange={setCurrentRole}
                  locale={locale}
                />
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                <strong>Role inheritance note:</strong> Modifying the role updates all base module privileges. Any explicit custom permission overrides set below will take precedence over role defaults.
              </div>
            </div>

            {/* Account Details Box */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-4 text-xs">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Employee Profile Information
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-500 block mb-1 font-medium">Display Name</label>
                  <input
                    type="text"
                    defaultValue={user.name}
                    className="w-full py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="text-slate-500 block mb-1 font-medium">Corporate Email</label>
                  <input
                    type="email"
                    defaultValue={user.email}
                    className="w-full py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="text-slate-500 block mb-1 font-medium">Mobile (Greenweb BD)</label>
                  <input
                    type="tel"
                    defaultValue={user.phone}
                    className="w-full py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                  />
                </div>

                <div>
                  <label className="text-slate-500 block mb-1 font-medium">Regional Division</label>
                  <input
                    type="text"
                    defaultValue={user.division || 'Dhaka'}
                    className="w-full py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Summary Card */}
          <div className="space-y-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-xs space-y-3 text-xs">
              <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>Security Standing</span>
              </h4>

              <div className="space-y-2 text-slate-600 dark:text-slate-400">
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                  <span>Authentication Method:</span>
                  <span className="font-mono text-slate-900 dark:text-white">JWT + SMS OTP</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                  <span>Account State:</span>
                  <span className="font-semibold text-emerald-500 uppercase">{user.status}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                  <span>2FA Status:</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">Enforced</span>
                </div>
                <div className="flex justify-between py-1">
                  <span>Last Known Login:</span>
                  <span className="text-slate-500">{typeof user.lastLogin === 'string' ? user.lastLogin : 'Recent'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT 2: PERMISSION MATRIX */}
      {activeTab === 'permissions' && (
        <PermissionMatrix
          role={currentRole}
          customPermissions={customPerms}
          onChangeCustomPermissions={setCustomPerms}
          isEditable={true}
          locale={locale}
        />
      )}

      {/* TAB CONTENT 3: ACTIVITY SUMMARY */}
      {activeTab === 'activity' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-4 text-xs">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
            <History className="w-4 h-4 text-purple-500" />
            <h3 className="font-bold text-slate-900 dark:text-white">
              Recent Authentication & Security Events
            </h3>
          </div>

          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
              <span className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
              <div className="flex-1">
                <div className="font-semibold text-slate-900 dark:text-white flex items-center justify-between">
                  <span>Successful Sign In (Web Dispatcher)</span>
                  <span className="text-[11px] text-slate-400 font-mono">10 mins ago</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  IP: 103.108.144.12 • Gulshan 2, Dhaka, Bangladesh • Chrome 122.0
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
              <span className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 shrink-0" />
              <div className="flex-1">
                <div className="font-semibold text-slate-900 dark:text-white flex items-center justify-between">
                  <span>Role Assigned: {user.role.toUpperCase()}</span>
                  <span className="text-[11px] text-slate-400 font-mono">2 days ago</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Action taken by Super Admin (Md. Shafiqul Islam) from Enterprise Admin NOC
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
