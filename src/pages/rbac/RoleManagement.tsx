import React, { useState } from 'react';
import { UserRole, RoleDefinition, StandardPermissionKey } from '../../types/rbac';
import { ROLES, PERMISSIONS, ROLE_PERMISSIONS } from '../../utils/permissions';
import { RoleBadge } from '../../components/rbac/RoleBadge';
import { PermissionMatrix } from '../../components/rbac/PermissionMatrix';
import { useUsers } from '../../hooks/useUsers';
import { useToast } from '../../context/ToastContext';
import {
  ShieldCheck,
  Plus,
  Users,
  Check,
  Sparkles,
  Lock,
  Edit2,
  Trash2,
  X,
  FileCheck,
  Save,
} from 'lucide-react';

export interface RoleManagementProps {
  locale?: 'en' | 'bn';
}

export const RoleManagementPage: React.FC<RoleManagementProps> = ({ locale = 'en' }) => {
  const { users } = useUsers();
  const { addToast } = useToast();

  const [rolesList, setRolesList] = useState<RoleDefinition[]>(ROLES);
  const [selectedRole, setSelectedRole] = useState<UserRole>('dispatcher');
  const [isCreatingRole, setIsCreatingRole] = useState(false);
  const [newRoleName, setNewRoleName] = useState('');
  const [newRoleDesc, setNewRoleDesc] = useState('');
  const [newRoleColor, setNewRoleColor] = useState('blue');

  // Count assigned users per role
  const userCounts = users.reduce((acc, u) => {
    acc[u.role] = (acc[u.role] || 0) + 1;
    return acc;
  }, {} as Record<UserRole, number>);

  const activeRoleDef = rolesList.find((r) => r.id === selectedRole) || rolesList[0];

  const handleCreateRole = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoleName.trim()) return;

    const newId = newRoleName.toLowerCase().replace(/[^a-z0-9]/g, '_') as UserRole;
    const newRole: RoleDefinition = {
      id: newId,
      name: newRoleName.trim(),
      nameBangla: newRoleName.trim(),
      description: newRoleDesc.trim() || 'Custom enterprise operational role definition.',
      color: newRoleColor,
      icon: 'Shield',
      permissions: ['work_orders.view'],
      isSystem: false,
    };

    setRolesList([...rolesList, newRole]);
    setSelectedRole(newId);
    setIsCreatingRole(false);
    setNewRoleName('');
    setNewRoleDesc('');

    addToast({
      title: 'Custom Role Defined',
      description: `Role "${newRole.name}" created. You can now configure permissions.`,
      type: 'success',
    });
  };

  return (
    <div className="space-y-6 animate-fadeIn font-sans pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <ShieldCheck className="w-6 h-6 text-emerald-500" />
            <span>{locale === 'bn' ? 'পদবি ও পারমিশন ব্যবস্থাপনা' : 'Role & Permission Matrix Management'}</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Configure system roles, access boundaries, and inspect inherited module privileges.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsCreatingRole(true)}
          className="py-2.5 px-4 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold hover:bg-slate-800 dark:hover:bg-slate-100 transition shadow-sm flex items-center gap-2 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Define Custom Role</span>
        </button>
      </div>

      {/* Role Selection Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {rolesList.map((role) => {
          const isSelected = role.id === selectedRole;
          const count = userCounts[role.id] || 0;

          return (
            <div
              key={role.id}
              onClick={() => setSelectedRole(role.id)}
              className={`p-4 rounded-3xl border transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                isSelected
                  ? 'border-emerald-500 bg-white dark:bg-slate-900 shadow-md ring-2 ring-emerald-500/20'
                  : 'border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <RoleBadge role={role.id} size="md" />
                <span className="text-[11px] font-mono font-bold text-slate-400 flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  {count} {count === 1 ? 'user' : 'users'}
                </span>
              </div>

              <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                {role.description}
              </p>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px]">
                <span className="text-slate-400 font-mono">
                  {role.permissions.length} permissions
                </span>
                {isSelected ? (
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-0.5">
                    <Check className="w-3.5 h-3.5" />
                    Selected
                  </span>
                ) : (
                  <span className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200">
                    View Matrix &rarr;
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Permission Matrix Editor for Selected Role */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>Configuring Privileges for:</span>
              <RoleBadge role={activeRoleDef.id} size="md" />
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Review inherited permissions across work orders, financial audits, technician fleet radar, and customer management.
            </p>
          </div>
        </div>

        <PermissionMatrix
          role={selectedRole}
          isEditable={false}
          locale={locale}
        />
      </div>

      {/* Create Custom Role Modal */}
      {isCreatingRole && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 w-full max-w-md shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-500" />
                <span>Create Custom Enterprise Role</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsCreatingRole(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateRole} className="space-y-3.5 text-xs">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Role Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Regional Billing Auditor"
                  value={newRoleName}
                  onChange={(e) => setNewRoleName(e.target.value)}
                  className="w-full py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Description / Operational Scope
                </label>
                <textarea
                  rows={2}
                  placeholder="Briefly state duties and allowed access level..."
                  value={newRoleDesc}
                  onChange={(e) => setNewRoleDesc(e.target.value)}
                  className="w-full py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Theme Badge Accent
                </label>
                <div className="flex items-center gap-2">
                  {['purple', 'red', 'orange', 'blue', 'green', 'teal', 'gray'].map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setNewRoleColor(c)}
                      className={`w-6 h-6 rounded-full border-2 capitalize ${
                        newRoleColor === c ? 'border-slate-900 dark:border-white scale-110' : 'border-transparent'
                      } ${
                        c === 'purple' ? 'bg-purple-500' :
                        c === 'red' ? 'bg-rose-500' :
                        c === 'orange' ? 'bg-amber-500' :
                        c === 'blue' ? 'bg-blue-500' :
                        c === 'green' ? 'bg-emerald-500' :
                        c === 'teal' ? 'bg-teal-500' : 'bg-slate-500'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsCreatingRole(false)}
                  className="py-2 px-4 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 font-semibold hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-2 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-md shadow-emerald-600/20"
                >
                  Create & Select
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
