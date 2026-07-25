import { create } from 'zustand';

export const useAnalyticsDashboardUiStore = create((set) => ({
  filters: {},
  setFilters: (newFilters) => set({ filters: newFilters }),
  clearFilters: () => set({ filters: {} }),
  expandedMetrics: [],
  toggleMetric: (metricId) => set((state) => ({
    expandedMetrics: state.expandedMetrics.includes(metricId)
      ? state.expandedMetrics.filter(id => id !== metricId)
      : [...state.expandedMetrics, metricId]
  }))
}));
