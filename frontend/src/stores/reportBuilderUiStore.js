import { create } from 'zustand';

export const useReportBuilderUiStore = create((set) => ({
  step: 1,
  setStep: (step) => set({ step }),
  selectedMetrics: [],
  toggleMetric: (metricId) => set((state) => ({
    selectedMetrics: state.selectedMetrics.includes(metricId)
      ? state.selectedMetrics.filter(id => id !== metricId)
      : [...state.selectedMetrics, metricId]
  })),
  previewOpen: false,
  setPreviewOpen: (isOpen) => set({ previewOpen: isOpen })
}));
