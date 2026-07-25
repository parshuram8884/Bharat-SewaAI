/**
 * Performs local deterministic evaluation of demo fields for safe frontend pre-checks.
 */

class EligibilityPrecheckService {
  evaluate(context) {
    // We expect the context to have safeMetadata or formState to evaluate.
    if (!context || !context.formState) {
      return { result: 'missing-information', disclaimerKey: 'assistance.citizen.precheck.disclaimer' };
    }

    const { age, income } = context.formState;

    if (age === undefined || income === undefined) {
      return { result: 'missing-information', disclaimerKey: 'assistance.citizen.precheck.disclaimer' };
    }

    // Completely deterministic frontend mockup
    if (age >= 18 && income < 500000) {
      return { result: 'likely-meets-demo-rules', disclaimerKey: 'assistance.citizen.precheck.disclaimer' };
    }

    return { result: 'does-not-meet-demo-rule', disclaimerKey: 'assistance.citizen.precheck.disclaimer' };
  }
}

export const eligibilityPrecheckService = new EligibilityPrecheckService();
