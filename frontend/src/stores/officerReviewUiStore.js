import { create } from 'zustand';

export const useOfficerReviewUiStore = create((set) => ({
  activeReviewSection: 'summary',
  isSidebarOpen: false,
  isAssignmentDialogOpen: false,
  isClarificationDialogOpen: false,
  isDecisionDialogOpen: false,
  
  setActiveReviewSection: (section) => set({ activeReviewSection: section }),
  setSidebarOpen: (isOpen) => set({ isSidebarOpen: isOpen }),
  setAssignmentDialogOpen: (isOpen) => set({ isAssignmentDialogOpen: isOpen }),
  setClarificationDialogOpen: (isOpen) => set({ isClarificationDialogOpen: isOpen }),
  setDecisionDialogOpen: (isOpen) => set({ isDecisionDialogOpen: isOpen }),
}));
