/**
 * Registry mapping for all frontend rules.
 */

export const assistanceRuleRegistry = {
  rules: [],
  
  register: (ruleObjects) => {
    ruleObjects.forEach(rule => {
      // Avoid duplicates
      if (!assistanceRuleRegistry.rules.find(r => r.id === rule.id)) {
        assistanceRuleRegistry.rules.push(rule);
      }
    });
  },
  
  getRulesForContext: (context) => {
    return assistanceRuleRegistry.rules.filter(rule => {
      if (!rule.enabled) return false;
      if (rule.module && rule.module !== 'global' && rule.module !== context.module) return false;
      if (rule.roles && rule.roles.length > 0 && !rule.roles.includes(context.role)) return false;
      if (rule.featureFlag && context.featureFlags && !context.featureFlags[rule.featureFlag]) return false;
      
      return true;
    });
  },

  getAllRules: () => assistanceRuleRegistry.rules
};
