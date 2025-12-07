import { create } from 'zustand';

// Global state management for XHETON
export const useStore = create((set) => ({
  // Theme
  theme: 'light',
  toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
  
  // User
  user: null,
  setUser: (user) => set({ user }),
  
  // Navigation
  sidebarOpen: true,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  
  // Cart (POS)
  cart: [],
  addToCart: (item) => set((state) => ({ cart: [...state.cart, item] })),
  removeFromCart: (id) => set((state) => ({ cart: state.cart.filter(item => item.id !== id) })),
  clearCart: () => set({ cart: [] }),
  
  // Notifications
  notifications: [],
  addNotification: (notification) => set((state) => ({ 
    notifications: [...state.notifications, { ...notification, id: Date.now() }] 
  })),
  removeNotification: (id) => set((state) => ({ 
    notifications: state.notifications.filter(n => n.id !== id) 
  })),
}));
