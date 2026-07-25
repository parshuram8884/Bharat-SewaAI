import { create } from 'zustand';

export const useAssistanceUiStore = create((set) => ({
  isPanelOpen: false,
  activeTab: 'suggestions', // 'suggestions', 'checklists', 'history'
  currentStepId: null,
  
  openPanel: () => set({ isPanelOpen: true }),
  closePanel: () => set({ isPanelOpen: false }),
  togglePanel: () => set((state) => ({ isPanelOpen: !state.isPanelOpen })),
  
  setActiveTab: (tab) => set({ activeTab: tab }),
  setCurrentStep: (stepId) => set({ currentStepId: stepId })
}));
