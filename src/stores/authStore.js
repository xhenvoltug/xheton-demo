import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      role: null,
      branch: null,
      permissions: [],
      
      setUser: (user) => set({ user }),
      setRole: (role) => set({ role }),
      setBranch: (branch) => set({ branch }),
      setPermissions: (permissions) => set({ permissions }),
      
      login: (userData) => set({
        user: userData.user,
        role: userData.role,
        branch: userData.branch,
        permissions: userData.permissions
      }),
      
      logout: () => set({
        user: null,
        role: null,
        branch: null,
        permissions: []
      }),
      
      hasPermission: (permission) => {
        const { permissions } = get();
        return permissions.includes(permission);
      },
      
      isAuthenticated: () => {
        const { user } = get();
        return !!user;
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        role: state.role,
        branch: state.branch,
        permissions: state.permissions
      })
    }
  )
);

export default useAuthStore;
