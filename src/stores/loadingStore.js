import { create } from 'zustand';

const useLoadingStore = create((set) => ({
  globalLoading: false,
  loadingStates: {},
  
  setGlobalLoading: (loading) => set({ globalLoading: loading }),
  
  setLoading: (key, loading) => set((state) => ({
    loadingStates: {
      ...state.loadingStates,
      [key]: loading
    }
  })),
  
  isLoading: (key) => (state) => state.loadingStates[key] || false
}));

export default useLoadingStore;
