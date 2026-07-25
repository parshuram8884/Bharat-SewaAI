import { create } from 'zustand';

export const useGrievanceUiStore = create((set) => ({
  grievanceTypePickerOpen: false,
  setGrievanceTypePickerOpen: (open) => set({ grievanceTypePickerOpen: open }),
  
  selectedApplicationId: null,
  setSelectedApplicationId: (id) => set({ selectedApplicationId: id }),
  
  submitDialogOpen: false,
  setSubmitDialogOpen: (open) => set({ submitDialogOpen: open }),
  
  resolutionResponseDialogOpen: false,
  setResolutionResponseDialogOpen: (open) => set({ resolutionResponseDialogOpen: open }),
  
  mobileFilterDrawerOpen: false,
  setMobileFilterDrawerOpen: (open) => set({ mobileFilterDrawerOpen: open })
}));
