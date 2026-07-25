import { create } from 'zustand';

const DRAFT_STORAGE_KEY = 'bharat_sewa_draft_text';

function loadInitialDraft() {
  try {
    return localStorage.getItem(DRAFT_STORAGE_KEY) || '';
  } catch (e) {
    return '';
  }
}

export const useAssistantUiStore = create((set) => ({
  draftText: loadInitialDraft(),
  setDraftText: (text) => {
    try {
      localStorage.setItem(DRAFT_STORAGE_KEY, text);
    } catch (e) {}
    set({ draftText: text });
  },

  isListening: false,
  setIsListening: (listening) => set({ isListening: listening }),

  currentTranscript: 'मला पीक विम्यासाठी अर्ज करायचा आहे',
  currentEnglishTranslation: 'I want to apply for crop insurance.',
  setTranscript: (transcript, translation = '') =>
    set({
      currentTranscript: transcript,
      currentEnglishTranslation: translation
    }),

  isTyping: false,
  setIsTyping: (typing) => set({ isTyping: typing }),

  activeCategoryFilter: 'All',
  setActiveCategoryFilter: (filter) => set({ activeCategoryFilter: filter }),

  searchQuery: '',
  setSearchQuery: (query) => set({ searchQuery: query }),

  clearDraft: () => {
    try {
      localStorage.removeItem(DRAFT_STORAGE_KEY);
    } catch (e) {}
    set({ draftText: '' });
  }
}));
