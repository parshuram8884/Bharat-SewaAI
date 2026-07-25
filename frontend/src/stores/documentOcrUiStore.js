import { create } from 'zustand';

export const useDocumentOcrUiStore = create((set) => ({
  activeDocumentId: null,
  activeDocumentType: 'income-certificate',
  currentProcessingStep: 1,
  previewZoom: 100,
  previewRotation: 0,
  selectedMappingIds: {},
  isReplaceDialogOpen: false,
  isDeleteDialogOpen: false,
  isConflictDialogOpen: false,
  manualEntryMode: false,
  lastFocusedField: null,

  setActiveDocumentId: (id) => set({ activeDocumentId: id }),
  setActiveDocumentType: (type) => set({ activeDocumentType: type }),
  setCurrentProcessingStep: (step) => set({ currentProcessingStep: step }),
  setPreviewZoom: (zoom) => set({ previewZoom: zoom }),
  setPreviewRotation: (rot) => set({ previewRotation: (rot + 360) % 360 }),
  setSelectedMappingIds: (mappings) => set({ selectedMappingIds: mappings }),
  setIsReplaceDialogOpen: (isOpen) => set({ isReplaceDialogOpen: isOpen }),
  setIsDeleteDialogOpen: (isOpen) => set({ isDeleteDialogOpen: isOpen }),
  setIsConflictDialogOpen: (isOpen) => set({ isConflictDialogOpen: isOpen }),
  setManualEntryMode: (isManual) => set({ manualEntryMode: isManual }),
  setLastFocusedField: (fieldId) => set({ lastFocusedField: fieldId }),

  resetUiState: () =>
    set({
      previewZoom: 100,
      previewRotation: 0,
      selectedMappingIds: {},
      isReplaceDialogOpen: false,
      isDeleteDialogOpen: false,
      isConflictDialogOpen: false,
      manualEntryMode: false
    })
}));
