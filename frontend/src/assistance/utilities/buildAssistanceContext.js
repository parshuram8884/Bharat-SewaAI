/**
 * Securely masks and builds the Assistance Context.
 */
import { AssistanceContextModel } from '../models/assistanceModels';

export const buildAssistanceContext = (rawState) => {
  const {
    user,
    role,
    route,
    module,
    workflowId,
    formState,
    featureFlags,
    preferences
  } = rawState;

  // Mask sensitive information
  const safeFormState = { ...formState };
  if (safeFormState.password) delete safeFormState.password;
  if (safeFormState.aadhaar) safeFormState.aadhaar = 'MASKED';
  
  return AssistanceContextModel.create({
    userId: user?.id || 'guest',
    role: role || 'public',
    currentRoute: route || '/',
    module: module || null,
    workflowId: workflowId || null,
    formState: safeFormState,
    missingFields: rawState.missingFields || [],
    featureFlags: featureFlags || {},
    language: preferences?.language || 'en',
    accessibilityPreferences: preferences?.accessibility || {},
    safeMetadata: {
      isOffline: !navigator.onLine,
      draftAgeDays: rawState.draftLastUpdated ? Math.floor((Date.now() - new Date(rawState.draftLastUpdated).getTime()) / (1000 * 3600 * 24)) : 0
    }
  });
};
