// Pure JS Eligibility Evaluator Engine for Bharat Sewa AI Phase 5

export function evaluateRule(rule, profile, answers) {
  const value = answers[rule.field] !== undefined ? answers[rule.field] : profile[rule.field];

  if (value === undefined || value === null || value === '') {
    return { status: 'missing', rule };
  }

  let passed = false;

  switch (rule.operator) {
    case 'equals':
      passed = value === rule.expectedValue;
      break;
    case 'notEquals':
      passed = value !== rule.expectedValue;
      break;
    case 'oneOf':
      passed = Array.isArray(rule.expectedValue) && rule.expectedValue.includes(value);
      break;
    case 'greaterThanOrEqual':
      passed = Number(value) >= Number(rule.expectedValue);
      break;
    case 'lessThanOrEqual':
      passed = Number(value) <= Number(rule.expectedValue);
      break;
    case 'between':
      if (Array.isArray(rule.expectedValue) && rule.expectedValue.length === 2) {
        const num = Number(value);
        passed = num >= rule.expectedValue[0] && num <= rule.expectedValue[1];
      }
      break;
    case 'contains':
      passed = typeof value === 'string' && value.toLowerCase().includes(String(rule.expectedValue).toLowerCase());
      break;
    default:
      passed = false;
  }

  return {
    status: passed ? 'matched' : 'unmet',
    rule,
    value
  };
}

export function evaluateEligibility(scheme, profile, answers = {}) {
  const rules = scheme.eligibilityRules || [];
  const matchedRules = [];
  const unmetRules = [];
  const missingInformation = [];

  rules.forEach((rule) => {
    const res = evaluateRule(rule, profile, answers);
    if (res.status === 'matched') {
      matchedRules.push(res);
    } else if (res.status === 'unmet') {
      unmetRules.push(res);
    } else {
      missingInformation.push(res);
    }
  });

  const total = rules.length;
  const matchCount = matchedRules.length;
  const unmetCount = unmetRules.length;
  const missingCount = missingInformation.length;

  let status = 'eligible';
  let score = 100;

  if (unmetCount > 0) {
    if (matchCount > 0) {
      status = 'not-eligible';
      score = Math.round((matchCount / (total || 1)) * 100);
    } else {
      status = 'not-eligible';
      score = 0;
    }
  } else if (missingCount > 0) {
    if (matchCount > 0) {
      status = 'action-required';
      score = Math.round((matchCount / (total || 1)) * 100);
    } else {
      status = 'action-required';
      score = 50;
    }
  } else {
    if (matchCount === total && total > 0) {
      status = 'eligible';
      score = 100;
    } else {
      status = 'likely-eligible';
      score = 85;
    }
  }

  const recommendations = [];
  if (unmetCount > 0) {
    recommendations.push('Review eligibility conditions or check alternative schemes tailored for your profile.');
  }
  if (missingCount > 0) {
    recommendations.push('Complete your citizen profile information or answer remaining questionnaire steps.');
  }
  if (status === 'eligible' || status === 'likely-eligible') {
    recommendations.push('Prepare required documents and proceed toward application submission.');
  }

  return {
    status,
    score,
    matchedRules: matchedRules.map((m) => m.rule),
    unmetRules: unmetRules.map((m) => m.rule),
    missingInformation: missingInformation.map((m) => m.rule),
    recommendations,
    disclaimer: 'This is a preliminary assessment based on provided details. Final eligibility and approval are determined by the concerned government department.'
  };
}
