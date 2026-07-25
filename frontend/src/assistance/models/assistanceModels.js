/**
 * Models for Phase 19 Guided Workflows and Smart Assistance.
 * Ensures consistent structure without real database enforcement.
 */

export const AssistanceRuleModel = {
  create: (data) => ({
    id: data.id || `rule_${Date.now()}`,
    version: data.version || '1.0.0',
    name: data.name || '',
    category: data.category || 'general',
    module: data.module || 'global',
    roles: data.roles || [], // Empty implies all roles
    permissions: data.permissions || [],
    featureFlag: data.featureFlag || null,
    condition: data.condition || (() => false),
    resultType: data.resultType || 'guidance', // e.g. 'blocking-requirement', 'next-action', 'field-help'
    priority: data.priority || 'medium', // 'critical', 'high', 'medium', 'low', 'informational'
    blocking: data.blocking || false,
    dismissible: data.dismissible ?? true,
    explanationKey: data.explanationKey || null,
    actionKey: data.actionKey || null,
    enabled: data.enabled ?? true
  })
};

export const AssistanceContextModel = {
  create: (data) => ({
    userId: data.userId || 'guest',
    role: data.role || 'public',
    permissions: data.permissions || [],
    departmentContextId: data.departmentContextId || null,
    centreContextId: data.centreContextId || null,
    currentRoute: data.currentRoute || '/',
    module: data.module || null,
    workflowId: data.workflowId || null,
    stepId: data.stepId || null,
    resourceType: data.resourceType || null,
    resourceId: data.resourceId || null,
    resourceStatus: data.resourceStatus || null,
    ownership: data.ownership || false,
    formState: data.formState || {},
    validationState: data.validationState || {},
    completedSteps: data.completedSteps || [],
    missingFields: data.missingFields || [],
    conflictingFields: data.conflictingFields || [],
    featureFlags: data.featureFlags || {},
    language: data.language || 'en',
    accessibilityPreferences: data.accessibilityPreferences || {},
    safeMetadata: data.safeMetadata || {},
    generatedAt: new Date().toISOString()
  })
};

export const AssistanceSuggestionModel = {
  create: (data) => ({
    id: data.id || `sugg_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
    ruleId: data.ruleId,
    ruleVersion: data.ruleVersion,
    userId: data.userId,
    roleContext: data.roleContext,
    module: data.module,
    workflowId: data.workflowId,
    suggestionType: data.suggestionType,
    titleKey: data.titleKey,
    descriptionKey: data.descriptionKey,
    explanationKey: data.explanationKey,
    priority: data.priority || 'medium',
    blocking: data.blocking || false,
    dismissible: data.dismissible ?? true,
    action: data.action || null,
    route: data.route || null,
    relatedFieldIds: data.relatedFieldIds || [],
    relatedStepIds: data.relatedStepIds || [],
    generatedAt: new Date().toISOString(),
    safeMetadata: data.safeMetadata || {}
  })
};
