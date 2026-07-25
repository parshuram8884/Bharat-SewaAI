// accessibilityPreferenceModel.js
export const createAccessibilityPreference = (userId) => ({
  id: 'acc_' + Date.now(),
  userId,
  highContrast: false,
  reducedMotion: false,
  fontScale: 100,
  readingMode: false,
  keyboardMode: false,
  focusHighlight: true,
  simplifiedLayout: false,
  largeTouchTargets: false,
  screenReaderHints: true,
  updatedAt: new Date().toISOString()
});
