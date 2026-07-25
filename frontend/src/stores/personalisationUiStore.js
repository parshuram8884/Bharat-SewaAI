import { create } from 'zustand';

export const usePersonalisationUiStore = create((set) => ({
  isCustomizerOpen: false,
  setCustomizerOpen: (val) => set({ isCustomizerOpen: val }),
  activePreviewMode: false,
  setActivePreviewMode: (val) => set({ activePreviewMode: val })
}));

export const useSearchUiStore = create((set) => ({
  isSearchOpen: false,
  setSearchOpen: (val) => set({ isSearchOpen: val }),
  searchQuery: '',
  setSearchQuery: (val) => set({ searchQuery: val }),
  selectedFilter: 'all',
  setSelectedFilter: (val) => set({ selectedFilter: val })
}));

export const useCommandPaletteUiStore = create((set) => ({
  isOpen: false,
  setIsOpen: (val) => set({ isOpen: val }),
  currentCommand: null,
  setCurrentCommand: (cmd) => set({ currentCommand: cmd })
}));

export const useOnboardingUiStore = create((set) => ({
  isTourActive: false,
  setTourActive: (val) => set({ isTourActive: val }),
  currentStepIndex: 0,
  setCurrentStepIndex: (val) => set({ currentStepIndex: val })
}));

export const useHelpUiStore = create((set) => ({
  isHelpDrawerOpen: false,
  setHelpDrawerOpen: (val) => set({ isHelpDrawerOpen: val }),
  activeArticleId: null,
  setActiveArticleId: (val) => set({ activeArticleId: val })
}));
