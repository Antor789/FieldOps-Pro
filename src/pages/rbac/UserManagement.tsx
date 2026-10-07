import React, { useState, useMemo } from 'react';
import { User, UserRole, UserStatus } from '../../types/rbac';
import { useUsers } from '../../hooks/useUsers';
import { usePermissions } from '../../hooks/usePermissions';
import { RoleBadge } from '../../components/rbac/RoleBadge';
import { UserCard } from '../../components/rbac/UserCard';
import { InviteUserModal } from './InviteUser';
import { UserProfilePage } from './UserProfile';
import { RoleManagementPage } from './RoleManagement';
import { RoleSelector } from '../../components/rbac/RoleSelector';
import {
  Users,
  UserPlus,
  Search,
  Filter,
  MoreVertical,
  CheckSquare,
  Square,
  LayoutGrid,
  List,
  ShieldCheck,
  UserCheck,
  UserX,
  Trash2,
  ExternalLink,
  ChevronDown,
  Sparkles,
} from 'lucide-react';

export interface UserManagementProps {
  locale?: 'en' | 'bn';
}

export const UserManagementPage: React.FC<UserManagementProps> = ({ locale = 'en' }) => {
  const {
    users,
    inviteUser,
    updateUserRole,
    deactivateUser,
    reactivateUser,
    bulkUpdateRole,
    updateUserPermissions,
    deleteUser,
  } = useUsers();

  const { isSuperAdmin, isAdmin } = usePermissions();

  // Navigation tab within the RBAC section: 'directory' | 'roles'
  const [activeTab, setActiveTab] = useState<'directory' | 'roles'>('directory');

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string>('all');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

  // Selected user for editing profile
  const [selectedUserForProfile, setSelectedUserForProfile] = useState<User | null>(null);

  // Invite modal state
  const [isInviteOpen, setIsInviteOpen] = useState(false);

  // Bulk selection state
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [bulkTargetRole, setBulkTargetRole] = useState<UserRole>('technician');

  // Filtered users calculation
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchesSearch =
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.phone.includes(searchQuery) ||
        (u.division && u.division.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesRole =
        selectedRoleFilter === 'all' || u.role === selectedRoleFilter;

      const matchesStatus =
        selectedStatusFilter === 'all' || u.status === selectedStatusFilter;

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, searchQuery, selectedRoleFilter, selectedStatusFilter]);

  // Bulk selection handlers
  const handleSelectAll = () => {
    if (selectedUserIds.length === filteredUsers.length) {
      setSelectedUserIds([]);
    } else {
      setSelectedUserIds(filteredUsers.map((u) => u.id));
    }
  };

  const handleToggleSelectUser = (id: string) => {
    if (selectedUserIds.includes(id)) {
      setSelectedUserIds(selectedUserIds.filter((uid) => uid !== id));
    } else {
      setSelectedUserIds([...selectedUserIds, id]);
    }
  };

  const handleApplyBulkRole = async () => {
    if (selectedUserIds.length === 0) return;
    await bulkUpdateRole(selectedUserIds, bulkTargetRole);
    setSelectedUserIds([]);
  };

  // If viewing single user profile:
  if (selectedUserForProfile) {
    const liveUser = users.find((u) => u.id === selectedUserForProfile.id) || selectedUserForProfile;
    return (
      <UserProfilePage
        user={liveUser}
        onBack={() => setSelectedUserForProfile(null)}
        onUpdateRole={updateUserRole}
        onUpdatePermissions={updateUserPermissions}
        onDeactivate={deactivateUser}
        onReactivate={reactivateUser}
        locale={locale}
      />
    );
  }

  return (
    <div className="space-y-6 font-sans pb-12 animate-fadeIn">
      {/* Top Header & Action Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
              <Users className="w-6 h-6 text-emerald-500" />
              <span>{locale === 'bn' ? 'ব্যবহারকারী ও অ্যাক্সেস ব্যবস্থাপনা' : 'User Management & Access Control'}</span>
            </h2>
            <span className="text-[11px] font-mono font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded-full border border-slate-200 dark:border-slate-700">
              {filteredUsers.length} Users
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Provision field technicians, assign regional dispatchers, and govern corporate RBAC access.
          </p>
        </div>

        {/* Action Button: Invite User */}
        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setIsInviteOpen(true)}
            className="flex-1 sm:flex-initial py-2.5 px-4 rounded-xl bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 transition cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>{locale === 'bn' ? 'ইউজার আমন্ত্রণ জানান' : 'Invite Team Member'}</span>
          </button>
        </div>
      </div>

      {/* Primary Section Switcher (User Directory vs Role Management) */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 text-xs font-semibold">
        <button
          type="button"
          onClick={() => setActiveTab('directory')}
          className={`py-2.5 px-4 border-b-2 transition cursor-pointer flex items-center gap-2 ${
            activeTab === 'directory'
              ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>User Directory ({users.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('roles')}
          className={`py-2.5 px-4 border-b-2 transition cursor-pointer flex items-center gap-2 ${
            activeTab === 'roles'
              ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Role Management & Matrix</span>
        </button>
      </div>

      {/* TAB 1: USER DIRECTORY */}
      {activeTab === 'directory' && (
        <div className="space-y-4">
          {/* Filters Bar */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-3 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by name, email, or 01XXXXXXXXX..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full py-2 pl-9 pr-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-xs"
              />
            </div>

            {/* Dropdown Filters & View Switcher */}
            <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto justify-end">
              {/* Filter by Role */}
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] text-slate-400 font-medium">Role:</span>
                <select
                  value={selectedRoleFilter}
                  onChange={(e) => setSelectedRoleFilter(e.target.value)}
                  className="py-1.5 px-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs"
                >
                  <option value="all">All Roles</option>
                  <option value="super_admin">Super Admin</option>
                  <option value="admin">Company Admin</option>
                  <option value="manager">Manager</option>
                  <option value="dispatcher">Dispatcher</option>
                  <option value="technician">Technician</option>
                  <option value="accountant">Accountant</option>
                  <option value="customer">Customer</option>
                </select>
              </div>

              {/* Filter by Status */}
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] text-slate-400 font-medium">Status:</span>
                <select
                  value={selectedStatusFilter}
                  onChange={(e) => setSelectedStatusFilter(e.target.value)}
                  className="py-1.5 px-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs"
                >
                  <option value="all">All Statuses</option>
                  <option value="active">Active</option>
                  <option value="inactive">Suspended</option>
                  <option value="pending">Pending Invite</option>
                </select>
              </div>

              {/* View Switcher (Table vs Cards) */}
              <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => setViewMode('table')}
                  className={`p-1.5 rounded-lg transition ${
                    viewMode === 'table'
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                  }`}
                  title="Table View"
                >
                  <List className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('cards')}
                  className={`p-1.5 rounded-lg transition ${
                    viewMode === 'cards'
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                  }`}
                  title="Cards Grid View"
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Bulk Action Bar (if users selected) */}
          {selectedUserIds.length > 0 && (
            <div className="p-3 rounded-2xl bg-slate-900 text-white flex flex-wrap items-center justify-between gap-3 text-xs shadow-lg animate-fadeIn">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-bold">
                  {selectedUserIds.length} user{selectedUserIds.length > 1 ? 's' : ''} selected
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-slate-400 text-[11px]">Change role to:</span>
                <select
                  value={bulkTargetRole}
                  onChange={(e) => setBulkTargetRole(e.target.value as UserRole)}
                  className="py-1 px-2.5 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs"
                >
                  <option value="technician">Technician</option>
                  <option value="dispatcher">Dispatcher</option>
                  <option value="manager">Manager</option>
                  <option value="accountant">Accountant</option>
                  <option value="admin">Company Admin</option>
                </select>

                <button
                  type="button"
                  onClick={handleApplyBulkRole}
                  className="py-1 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 font-bold transition cursor-pointer"
                >
                  Apply Role
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedUserIds([])}
                  className="py-1 px-2 rounded-lg text-slate-400 hover:text-white transition"
                >
                  Clear
                </button>
              </div>
            </div>
          )}

          {/* VIEW MODE 1: DATA TABLE */}
          {viewMode === 'table' ? (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      <th className="py-3 px-4 w-10 text-center">
                        <button
                          type="button"
                          onClick={handleSelectAll}
                          className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                        >
                          {selectedUserIds.length === filteredUsers.length && filteredUsers.length > 0 ? (
                            <CheckSquare className="w-4 h-4 text-emerald-500" />
                          ) : (
                            <Square className="w-4 h-4" />
                          )}
                        </button>
                      </th>
                      <th className="py-3 px-4">Employee & Contact</th>
                      <th className="py-3 px-4">Role & Level</th>
                      <th className="py-3 px-4">Division</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Last Activity</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {filteredUsers.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-8 text-center text-slate-400">
                          No team members found matching your search criteria.
                        </td>
                      </tr>
                    ) : (
                      filteredUsers.map((user) => {
                        const isSelected = selectedUserIds.includes(user.id);
                        return (
                          <tr
                            key={user.id}
                            className={`hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors ${
                              isSelected ? 'bg-emerald-50/30 dark:bg-emerald-950/20' : ''
                            }`}
                          >
                            {/* Checkbox */}
                            <td className="py-3.5 px-4 text-center">
                              <button
                                type="button"
                                onClick={() => handleToggleSelectUser(user.id)}
                                className="text-slate-400 hover:text-slate-600"
                              >
                                {isSelected ? (
                                  <CheckSquare className="w-4 h-4 text-emerald-500" />
                                ) : (
                                  <Square className="w-4 h-4" />
                                )}
                              </button>
                            </td>

                            {/* Name & Contact */}
                            <td className="py-3.5 px-4">
                              <div className="flex items-center gap-3">
                                <img
                                  src={
                                    user.avatar ||
                                    `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=0284c7&color=fff`
                                  }
                                  alt={user.name}
                                  className="w-8 h-8 rounded-xl object-cover shrink-0"
                                />
                                <div>
                                  <button
                                    type="button"
                                    onClick={() => setSelectedUserForProfile(user)}
                                    className="font-bold text-slate-900 dark:text-white hover:text-emerald-600 dark:hover:text-emerald-400 text-left transition"
                                  >
                                    {user.name}
                                  </button>
                                  <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                                    <span>{user.email}</span>
                                    <span>•</span>
                                    <span className="font-mono">+88{user.phone}</span>
                                  </div>
                                </div>
                              </div>
                            </td>

                            {/* Role Badge */}
                            <td className="py-3.5 px-4">
                              <RoleBadge role={user.role} size="sm" />
                              {user.customPermissions && user.customPermissions.length > 0 && (
                                <span className="block text-[10px] text-emerald-600 dark:text-emerald-400 mt-1 font-semibold">
                                  +{user.customPermissions.length} custom overrides
                                </span>
                              )}
                            </td>

                            {/* Division */}
                            <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400 font-medium">
                              {user.division || 'Dhaka'}
                            </td>

                            {/* Status */}
                            <td className="py-3.5 px-4">
                              <span
                                className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full border ${
                                  user.status === 'active'
                                    ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                                    : user.status === 'inactive'
                                    ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800'
                                    : 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800'
                                }`}
                              >
                                <span
                                  className={`w-1.5 h-1.5 rounded-full ${
                                    user.status === 'active'
                                      ? 'bg-emerald-500'
                                      : user.status === 'inactive'
                                      ? 'bg-rose-500'
                                      : 'bg-amber-500'
                                  }`}
                                />
                                <span className="capitalize">{user.status}</span>
                              </span>
                            </td>

                            {/* Last Activity */}
                            <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400 font-mono text-[11px]">
                              {typeof user.lastLogin === 'string' ? user.lastLogin : 'Recent'}
                            </td>

                            {/* Actions */}
                            <td className="py-3.5 px-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => setSelectedUserForProfile(user)}
                                  className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white transition"
                                  title="Manage Profile"
                                >
                                  <ExternalLink className="w-3.5 h-3.5" />
                                </button>

                                {user.status === 'active' ? (
                                  <button
                                    type="button"
                                    onClick={() => deactivateUser(user.id)}
                                    className="p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 text-slate-400 hover:text-rose-600 transition"
                                    title="Suspend User"
                                  >
                                    <UserX className="w-3.5 h-3.5" />
                                  </button>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => reactivateUser(user.id)}
                                    className="p-1.5 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-slate-400 hover:text-emerald-600 transition"
                                    title="Activate User"
                                  >
                                    <UserCheck className="w-3.5 h-3.5" />
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            /* VIEW MODE 2: CARDS GRID */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredUsers.map((user) => (
                <UserCard
                  key={user.id}
                  user={user}
                  onEdit={(u) => setSelectedUserForProfile(u)}
                  onDeactivate={deactivateUser}
                  onReactivate={reactivateUser}
                  onDelete={deleteUser}
                  locale={locale}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: ROLE MANAGEMENT & PERMISSION MATRIX */}
      {activeTab === 'roles' && (
        <RoleManagementPage locale={locale} />
      )}

      {/* Invite User Modal */}
      {isInviteOpen && (
        <InviteUserModal
          isOpen={isInviteOpen}
          onClose={() => setIsInviteOpen(false)}
          onInvite={inviteUser}
          locale={locale}
        />
      )}
    </div>
  );
};
