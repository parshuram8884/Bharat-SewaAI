import { create } from 'zustand';

export const useGrievanceOfficerUiStore = create((set) => ({
  selectedQueueIds: [],
  setSelectedQueueIds: (ids) => set({ selectedQueueIds: ids }),
  
  assignmentDialogOpen: false,
  setAssignmentDialogOpen: (open) => set({ assignmentDialogOpen: open }),
  
  clarificationDialogOpen: false,
  setClarificationDialogOpen: (open) => set({ clarificationDialogOpen: open }),
  
  resolutionDialogOpen: false,
  setResolutionDialogOpen: (open) => set({ resolutionDialogOpen: open }),
  
  activeReviewSection: 'summary',
  setActiveReviewSection: (section) => set({ activeReviewSection: section }),
  
  mobileReviewNavOpen: false,
  setMobileReviewNavOpen: (open) => set({ mobileReviewNavOpen: open })
}));
