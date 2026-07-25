import { assistanceRuleRegistry } from '../registries/assistanceRuleRegistry';
import { commonRules, citizenRules } from '../rules/standardRules';
import { ruleEngine } from '../rules/ruleEngine';
import { buildAssistanceContext } from '../utilities/buildAssistanceContext';

class AssistanceService {
  constructor() {
    this.initialized = false;
  }

  initialize() {
    if (this.initialized) return;
    assistanceRuleRegistry.register([...commonRules, ...citizenRules]);
    this.initialized = true;
  }

  getSuggestions(rawState) {
    if (!this.initialized) this.initialize();
    
    // Safety check - do not evaluate if guidance is disabled globally
    if (rawState.featureFlags && rawState.featureFlags['enable-guided-assistance'] === false) {
      return [];
    }

    const context = buildAssistanceContext(rawState);
    return ruleEngine.evaluate(context);
  }
  
  getPrecheckResult(rawState) {
    // Only if precheck is explicitly asked for
    if (!this.initialized) this.initialize();
    
    if (rawState.featureFlags && rawState.featureFlags['enable-demo-eligibility-precheck'] === false) {
      return { status: 'precheck-unavailable' };
    }
    
    const context = buildAssistanceContext(rawState);
    // Hardcoded mock response for safe frontend demo
    if (context.formState && context.formState.age >= 18) {
      return { status: 'likely-meets-demo-rules' };
    } else if (context.formState && context.formState.age) {
      return { status: 'does-not-meet-demo-rule' };
    }
    
    return { status: 'missing-information' };
  }
}

export const assistanceService = new AssistanceService();
