import { create } from 'zustand';

export const useOpenDataUiStore = create((set) => ({
  reviewDialogOpen: false,
  setReviewDialogOpen: (isOpen) => set({ reviewDialogOpen: isOpen }),
  selectedDatasetId: null,
  setSelectedDatasetId: (id) => set({ selectedDatasetId: id })
}));
