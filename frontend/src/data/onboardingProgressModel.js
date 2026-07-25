// onboardingProgressModel.js
export const createOnboardingProgress = (userId, tourId, roleContext) => ({
  id: 'onb_' + Date.now(),
  userId,
  tourId,
  roleContext,
  currentStep: 0,
  completedStepIds: [],
  skipped: false,
  completed: false,
  startedAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  completedAt: null,
  tourVersion: 'v1.0'
});
