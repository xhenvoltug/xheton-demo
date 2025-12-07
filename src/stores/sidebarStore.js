import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useSidebarStore = create(
  persist(
    (set) => ({
      collapsed: false,
      openGroups: [],
      
      toggleCollapsed: () => set((state) => ({ 
        collapsed: !state.collapsed 
      })),
      
      setCollapsed: (collapsed) => set({ collapsed }),
      
      toggleGroup: (groupId) => set((state) => ({
        openGroups: state.openGroups.includes(groupId)
          ? state.openGroups.filter(id => id !== groupId)
          : [...state.openGroups, groupId]
      })),
      
      setOpenGroups: (openGroups) => set({ openGroups })
    }),
    {
      name: 'sidebar-storage'
    }
  )
);

export default useSidebarStore;
