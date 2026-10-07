import { useState, useCallback } from 'react';
import { User, UserRole, InviteUserData, UserStatus } from '../types/rbac';
import { useToast } from '../context/ToastContext';

export const INITIAL_RBAC_USERS: User[] = [
  {
    id: 'usr-1',
    name: 'Md. Shafiqul Islam',
    email: 'shafiqul@fieldops.com.bd',
    phone: '01712345678',
    role: 'super_admin',
    status: 'active',
    division: 'Dhaka',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    lastLogin: 'Just now',
    createdAt: '2024-01-10',
  },
  {
    id: 'usr-2',
    name: 'Farhana Akhter',
    email: 'farhana.ops@fieldops.com.bd',
    phone: '01722334455',
    role: 'admin',
    status: 'active',
    division: 'Dhaka',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
    lastLogin: '2 hours ago',
    createdAt: '2024-02-01',
  },
  {
    id: 'usr-3',
    name: 'Tanvir Hossain',
    email: 'tanvir.dispatch@fieldops.com.bd',
    phone: '01812345678',
    role: 'dispatcher',
    status: 'active',
    division: 'Chittagong',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    lastLogin: '10 mins ago',
    createdAt: '2024-03-12',
  },
  {
    id: 'usr-4',
    name: 'Rahim Ahmed',
    email: 'rahim.tech@fieldops.com.bd',
    phone: '01912345678',
    role: 'technician',
    status: 'active',
    division: 'Dhaka',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    lastLogin: '35 mins ago',
    createdAt: '2024-03-15',
  },
  {
    id: 'usr-5',
    name: 'Nasrin Sultana',
    email: 'nasrin.mgr@fieldops.com.bd',
    phone: '01611223344',
    role: 'manager',
    status: 'active',
    division: 'Sylhet',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150',
    lastLogin: 'Yesterday',
    createdAt: '2024-02-18',
  },
  {
    id: 'usr-6',
    name: 'Kazi Mahbub Alam',
    email: 'mahbub.finance@fieldops.com.bd',
    phone: '01511223344',
    role: 'accountant',
    status: 'active',
    division: 'Dhaka',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    lastLogin: '1 day ago',
    createdAt: '2024-02-22',
  },
  {
    id: 'usr-7',
    name: 'Grameenphone NOC Desk',
    email: 'noc.client@grameenphone.com',
    phone: '01711002233',
    role: 'customer',
    status: 'active',
    division: 'Dhaka',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150',
    lastLogin: '3 days ago',
    createdAt: '2024-04-01',
  },
  {
    id: 'usr-8',
    name: 'Anisur Rahman',
    email: 'anisur.tech@fieldops.com.bd',
    phone: '01755667788',
    role: 'technician',
    status: 'inactive',
    division: 'Rajshahi',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150',
    lastLogin: '2 weeks ago',
    createdAt: '2024-03-20',
  },
  {
    id: 'usr-9',
    name: 'Sharmin Jahan',
    email: 'sharmin.trainee@fieldops.com.bd',
    phone: '01833445566',
    role: 'dispatcher',
    status: 'pending',
    division: 'Khulna',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
    lastLogin: 'Never',
    createdAt: '2024-05-01',
  },
];

const LOCAL_STORAGE_KEY = 'fieldops_rbac_users';

export function useUsers() {
  const { addToast } = useToast();

  const [users, setUsers] = useState<User[]>(() => {
    if (typeof window === 'undefined') return INITIAL_RBAC_USERS;
    const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch {
        return INITIAL_RBAC_USERS;
      }
    }
    return INITIAL_RBAC_USERS;
  });

  const saveUsers = useCallback((updated: User[]) => {
    setUsers(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    }
  }, []);

  // Invite new user
  const inviteUser = useCallback(
    async (data: InviteUserData): Promise<boolean> => {
      await new Promise((resolve) => setTimeout(resolve, 800));

      const newUser: User = {
        id: `usr-${Date.now().toString(36)}`,
        name: data.name.trim(),
        email: data.email.trim(),
        phone: data.phone.trim(),
        role: data.role,
        division: data.division,
        customPermissions: data.customPermissions || [],
        status: 'pending',
        createdAt: new Date().toISOString().split('T')[0],
        lastLogin: 'Invitation Sent',
      };

      const updated = [newUser, ...users];
      saveUsers(updated);

      addToast({
        title: 'Invitation Dispatched',
        description: `Invite sent to ${data.email}${data.sendSMS ? ` and SMS to +88${data.phone}` : ''}`,
        type: 'success',
      });

      return true;
    },
    [users, saveUsers, addToast]
  );

  // Update user role
  const updateUserRole = useCallback(
    async (userId: string, newRole: UserRole): Promise<boolean> => {
      await new Promise((resolve) => setTimeout(resolve, 500));

      const updated = users.map((u) => {
        if (u.id === userId) {
          return { ...u, role: newRole };
        }
        return u;
      });

      saveUsers(updated);

      const targetUser = users.find((u) => u.id === userId);
      addToast({
        title: 'Role Updated',
        description: `Updated ${targetUser?.name || 'User'} role to ${newRole.toUpperCase().replace('_', ' ')}`,
        type: 'info',
      });

      return true;
    },
    [users, saveUsers, addToast]
  );

  // Deactivate user
  const deactivateUser = useCallback(
    async (userId: string): Promise<boolean> => {
      await new Promise((resolve) => setTimeout(resolve, 500));

      const updated = users.map((u) => {
        if (u.id === userId) {
          return { ...u, status: 'inactive' as UserStatus };
        }
        return u;
      });

      saveUsers(updated);

      addToast({
        title: 'User Suspended',
        description: 'Account access has been revoked immediately.',
        type: 'warning',
      });

      return true;
    },
    [users, saveUsers, addToast]
  );

  // Reactivate user
  const reactivateUser = useCallback(
    async (userId: string): Promise<boolean> => {
      await new Promise((resolve) => setTimeout(resolve, 500));

      const updated = users.map((u) => {
        if (u.id === userId) {
          return { ...u, status: 'active' as UserStatus };
        }
        return u;
      });

      saveUsers(updated);

      addToast({
        title: 'User Reactivated',
        description: 'Account access and permissions restored.',
        type: 'success',
      });

      return true;
    },
    [users, saveUsers, addToast]
  );

  // Bulk update role for multiple users
  const bulkUpdateRole = useCallback(
    async (userIds: string[], role: UserRole): Promise<boolean> => {
      await new Promise((resolve) => setTimeout(resolve, 700));

      const updated = users.map((u) => {
        if (userIds.includes(u.id)) {
          return { ...u, role };
        }
        return u;
      });

      saveUsers(updated);

      addToast({
        title: 'Bulk Role Updated',
        description: `Changed role to ${role.toUpperCase()} for ${userIds.length} users.`,
        type: 'success',
      });

      return true;
    },
    [users, saveUsers, addToast]
  );

  // Update custom permissions for an individual user
  const updateUserPermissions = useCallback(
    async (userId: string, customPermissions: string[]): Promise<boolean> => {
      await new Promise((resolve) => setTimeout(resolve, 500));

      const updated = users.map((u) => {
        if (u.id === userId) {
          return { ...u, customPermissions };
        }
        return u;
      });

      saveUsers(updated);

      addToast({
        title: 'Custom Permissions Saved',
        description: 'User permission overrides updated successfully.',
        type: 'success',
      });

      return true;
    },
    [users, saveUsers, addToast]
  );

  // Delete user
  const deleteUser = useCallback(
    async (userId: string): Promise<boolean> => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const updated = users.filter((u) => u.id !== userId);
      saveUsers(updated);

      addToast({
        title: 'User Removed',
        description: 'User has been permanently removed from the system.',
        type: 'info',
      });

      return true;
    },
    [users, saveUsers, addToast]
  );

  return {
    users,
    inviteUser,
    updateUserRole,
    deactivateUser,
    reactivateUser,
    bulkUpdateRole,
    updateUserPermissions,
    deleteUser,
  };
}
