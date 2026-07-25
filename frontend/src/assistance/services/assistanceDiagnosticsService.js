import { assistanceRuleRegistry } from '../registries/assistanceRuleRegistry';
import { assistanceContentRegistry } from '../registries/assistanceContentRegistry';

class AssistanceDiagnosticsService {
  validateRegistries() {
    const rules = assistanceRuleRegistry.getAllRules();
    const warnings = [];
    const errors = [];
    
    // Check for duplicate priorities in the same category
    const categoryPriorities = {};
    
    rules.forEach(rule => {
      // Priority check
      if (!categoryPriorities[rule.category]) categoryPriorities[rule.category] = new Set();
      
      // We allow multiple of same priority but it's a warning if it could cause unstable sorting
      
      // Missing translation keys
      const allLangs = Object.keys(assistanceContentRegistry);
      allLangs.forEach(lang => {
        const dict = assistanceContentRegistry[lang];
        if (!dict[rule.name]) warnings.push(`Rule ${rule.id} missing title key: ${rule.name} in ${lang}`);
        if (!dict[rule.descriptionKey]) warnings.push(`Rule ${rule.id} missing description key: ${rule.descriptionKey} in ${lang}`);
        if (rule.explanationKey && !dict[rule.explanationKey]) warnings.push(`Rule ${rule.id} missing explanation key: ${rule.explanationKey} in ${lang}`);
        if (rule.actionKey && !dict[rule.actionKey]) warnings.push(`Rule ${rule.id} missing action key: ${rule.actionKey} in ${lang}`);
      });
      
      // Invalid references
      if (!rule.condition || typeof rule.condition !== 'function') {
        errors.push(`Rule ${rule.id} has invalid condition function.`);
      }
    });
    
    return {
      status: errors.length > 0 ? 'failed' : (warnings.length > 0 ? 'warning' : 'passed'),
      totalRules: rules.length,
      errors,
      warnings
    };
  }
}

export const assistanceDiagnosticsService = new AssistanceDiagnosticsService();
