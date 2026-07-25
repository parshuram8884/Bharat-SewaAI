import { create } from 'zustand';

export const useApplicationTrackingUiStore = create((set) => ({
  isFilterDrawerOpen: false,
  isWithdrawModalOpen: false,
  isDocumentResponseDialogOpen: false,
  isClarificationSubmitDialogOpen: false,
  selectedTimelineItemId: null,

  setFilterDrawerOpen: (isOpen) => set({ isFilterDrawerOpen: isOpen }),
  setWithdrawModalOpen: (isOpen) => set({ isWithdrawModalOpen: isOpen }),
  setDocumentResponseDialogOpen: (isOpen) => set({ isDocumentResponseDialogOpen: isOpen }),
  setClarificationSubmitDialogOpen: (isOpen) => set({ isClarificationSubmitDialogOpen: isOpen }),
  setSelectedTimelineItemId: (id) => set({ selectedTimelineItemId: id }),
}));
