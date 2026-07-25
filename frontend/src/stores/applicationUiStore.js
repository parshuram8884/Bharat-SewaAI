import { create } from 'zustand';

export const useApplicationUiStore = create((set) => ({
  activeApplicationId: null,
  currentStep: 1,
  activeSectionId: 'applicant-details',
  draftUnsavedChanges: false,
  isSaveAndExitDialogOpen: false,
  isDiscardDialogOpen: false,
  isSubmitDialogOpen: false,
  lastFocusedField: null,
  mobileStepDrawerOpen: false,

  setActiveApplicationId: (id) => set({ activeApplicationId: id }),
  setCurrentStep: (step) => set({ currentStep: step }),
  setActiveSectionId: (secId) => set({ activeSectionId: secId }),
  setDraftUnsavedChanges: (hasChanges) => set({ draftUnsavedChanges: hasChanges }),
  setIsSaveAndExitDialogOpen: (isOpen) => set({ isSaveAndExitDialogOpen: isOpen }),
  setIsDiscardDialogOpen: (isOpen) => set({ isDiscardDialogOpen: isOpen }),
  setIsSubmitDialogOpen: (isOpen) => set({ isSubmitDialogOpen: isOpen }),
  setLastFocusedField: (fieldId) => set({ lastFocusedField: fieldId }),
  setMobileStepDrawerOpen: (isOpen) => set({ mobileStepDrawerOpen: isOpen }),

  resetUiState: () =>
    set({
      currentStep: 1,
      activeSectionId: 'applicant-details',
      draftUnsavedChanges: false,
      isSaveAndExitDialogOpen: false,
      isDiscardDialogOpen: false,
      isSubmitDialogOpen: false,
      mobileStepDrawerOpen: false
    })
}));
