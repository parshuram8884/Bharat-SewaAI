/**
 * Reusable predicate functions for deterministic rule evaluation.
 */

export const predicates = {
  isRole: (context, role) => context.role === role,
  hasFeatureFlag: (context, flag) => !!context.featureFlags[flag],
  isModule: (context, moduleName) => context.module === moduleName,
  hasDraftOlderThan: (context, days) => context.safeMetadata.draftAgeDays > days,
  hasMissingFields: (context) => context.missingFields && context.missingFields.length > 0,
  isFormComplete: (context, requiredFields) => {
    if (!context.formState) return false;
    return requiredFields.every(field => !!context.formState[field]);
  }
};
