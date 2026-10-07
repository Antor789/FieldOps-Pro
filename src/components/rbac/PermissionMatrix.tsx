import React from 'react';
import { UserRole, StandardPermissionKey } from '../../types/rbac';
import { PERMISSIONS, ROLES, ROLE_PERMISSIONS } from '../../utils/permissions';
import { Check, X, ShieldCheck, Lock, Sparkles, AlertCircle } from 'lucide-react';
import { RoleBadge } from './RoleBadge';

export interface PermissionMatrixProps {
  role?: UserRole;
  customPermissions?: string[];
  onChangeCustomPermissions?: (permissions: string[]) => void;
  isEditable?: boolean;
  selectedRoleForMatrix?: UserRole;
  onRolePermissionToggle?: (role: UserRole, permissionKey: string) => void;
  locale?: 'en' | 'bn';
}

export const PermissionMatrix: React.FC<PermissionMatrixProps> = ({
  role = 'admin',
  customPermissions = [],
  onChangeCustomPermissions,
  isEditable = false,
  locale = 'en',
}) => {
  const roleBasePermissions = ROLE_PERMISSIONS[role] || [];
  const permissionKeys = Object.keys(PERMISSIONS) as StandardPermissionKey[];

  // Group by category
  const categories = Array.from(new Set(permissionKeys.map((k) => PERMISSIONS[k].category)));

  const handleToggle = (permKey: string) => {
    if (!onChangeCustomPermissions) return;

    const isBase = roleBasePermissions.includes(permKey);
    const hasCustom = customPermissions.includes(permKey);

    let updated: string[];
    if (hasCustom) {
      // Remove custom override
      updated = customPermissions.filter((p) => p !== permKey);
    } else {
      // Add custom override
      updated = [...customPermissions, permKey];
    }
    onChangeCustomPermissions(updated);
  };

  return (
    <div className="space-y-4">
      {/* Header Info Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2.5">
          <RoleBadge role={role} size="md" />
          <div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white">
              {locale === 'bn' ? 'অনুমতি ম্যাট্রিক্স' : 'Access Permissions Matrix'}
            </h4>
            <p className="text-[11px] text-slate-500">
              {roleBasePermissions.length} inherited role permissions • {customPermissions.length} custom user overrides
            </p>
          </div>
        </div>

        {isEditable && (
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Editing Enabled</span>
          </div>
        )}
      </div>

      {/* Permission Table Matrix */}
      <div className="border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-xs bg-white dark:bg-slate-900">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">Permission & Resource</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4 text-center">Base Role Access</th>
                <th className="py-3 px-4 text-center">User Status</th>
                {isEditable && <th className="py-3 px-4 text-right">Toggle Override</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {categories.map((category) => {
                const permsInCategory = permissionKeys.filter((k) => PERMISSIONS[k].category === category);

                return (
                  <React.Fragment key={category}>
                    {/* Category Divider Header */}
                    <tr className="bg-slate-100/60 dark:bg-slate-800/40">
                      <td colSpan={isEditable ? 5 : 4} className="py-2 px-4 text-[10px] font-extrabold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                        {category}
                      </td>
                    </tr>

                    {/* Permissions rows */}
                    {permsInCategory.map((permKey) => {
                      const meta = PERMISSIONS[permKey];
                      const isInherited = roleBasePermissions.includes(permKey);
                      const isCustom = customPermissions.includes(permKey);
                      const hasAccess = isInherited || isCustom;

                      return (
                        <tr
                          key={permKey}
                          className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors"
                        >
                          {/* Name & Desc */}
                          <td className="py-3 px-4">
                            <div className="font-semibold text-slate-900 dark:text-white">
                              {locale === 'bn' ? meta.labelBangla : meta.label}
                            </div>
                            <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                              {permKey}
                            </div>
                            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">
                              {meta.description}
                            </div>
                          </td>

                          {/* Category badge */}
                          <td className="py-3 px-4">
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                              {meta.category}
                            </span>
                          </td>

                          {/* Inherited */}
                          <td className="py-3 px-4 text-center">
                            {isInherited ? (
                              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                                <Check className="w-3.5 h-3.5" />
                                <span>Granted</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-400">
                                <X className="w-3.5 h-3.5" />
                                <span>Restricted</span>
                              </span>
                            )}
                          </td>

                          {/* Effective Status */}
                          <td className="py-3 px-4 text-center">
                            {hasAccess ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                                <ShieldCheck className="w-3 h-3" />
                                <span>{isCustom && !isInherited ? 'Custom Granted' : 'Permitted'}</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                                <Lock className="w-3 h-3" />
                                <span>Denied</span>
                              </span>
                            )}
                          </td>

                          {/* Toggle Switch */}
                          {isEditable && (
                            <td className="py-3 px-4 text-right">
                              <button
                                type="button"
                                onClick={() => handleToggle(permKey)}
                                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                                  hasAccess ? 'bg-emerald-600' : 'bg-slate-300 dark:bg-slate-700'
                                }`}
                              >
                                <span
                                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                                    hasAccess ? 'translate-x-4' : 'translate-x-0'
                                  }`}
                                />
                              </button>
                            </td>
                          )}
                        </tr>
                      );
                    })}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
