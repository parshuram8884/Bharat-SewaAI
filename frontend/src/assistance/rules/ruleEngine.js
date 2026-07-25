/**
 * Deterministic Rule Engine for frontend assistance.
 */
import { assistanceRuleRegistry } from '../registries/assistanceRuleRegistry';
import { AssistanceSuggestionModel } from '../models/assistanceModels';

class RuleEngine {
  evaluate(context) {
    if (!context) return [];
    
    // 1. Get filtered rules based on role, module, feature flags
    const applicableRules = assistanceRuleRegistry.getRulesForContext(context);
    
    // 2. Evaluate deterministic conditions
    const suggestions = [];
    
    for (const rule of applicableRules) {
      try {
        if (rule.condition(context)) {
          suggestions.push(AssistanceSuggestionModel.create({
            ruleId: rule.id,
            ruleVersion: rule.version,
            userId: context.userId,
            roleContext: context.role,
            module: context.module,
            workflowId: context.workflowId,
            suggestionType: rule.resultType,
            titleKey: rule.name, // using name as title key placeholder
            descriptionKey: rule.descriptionKey,
            explanationKey: rule.explanationKey,
            priority: rule.priority,
            blocking: rule.blocking,
            dismissible: rule.dismissible,
            action: rule.actionKey,
            route: null,
            relatedFieldIds: [],
            relatedStepIds: []
          }));
        }
      } catch (error) {
        console.error(`Error evaluating rule ${rule.id}:`, error);
        // Fail safely
      }
    }
    
    // 3. Sort by priority
    const priorityWeights = {
      critical: 5,
      high: 4,
      medium: 3,
      low: 2,
      informational: 1
    };
    
    return suggestions.sort((a, b) => priorityWeights[b.priority] - priorityWeights[a.priority]);
  }
}

export const ruleEngine = new RuleEngine();
