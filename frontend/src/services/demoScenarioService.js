/**
 * demoScenarioService.js
 * Scenarios mapping deterministic presentation sequences.
 */

export const DemoScenarios = [
  {
    id: 'scen_1_citizen_scheme',
    title: 'Citizen Scheme Discovery and Application',
    description: 'A citizen logs in, discovers eligible schemes, and submits a mock application.',
    requiredProfileId: 'profile_citizen_1',
    startingRoute: '/schemes',
    estimatedDurationMinutes: 5,
    active: true
  },
  {
    id: 'scen_2_officer_review',
    title: 'Officer Application Review',
    description: 'An officer opens the queue and processes the pending application.',
    requiredProfileId: 'profile_officer_1',
    startingRoute: '/officer/queue',
    estimatedDurationMinutes: 5,
    active: true
  },
  {
    id: 'scen_3_grievance',
    title: 'Grievance and Escalation',
    description: 'Citizen creates a grievance; officer resolves; citizen accepts or reopens.',
    requiredProfileId: 'profile_citizen_1',
    startingRoute: '/grievances/new',
    estimatedDurationMinutes: 8,
    active: true
  },
  {
    id: 'scen_4_payment',
    title: 'Benefit Sanction and Payment',
    description: 'Payment officer creates a batch; Finance manager approves and releases.',
    requiredProfileId: 'profile_payment_officer',
    startingRoute: '/officer/payments/dashboard',
    estimatedDurationMinutes: 6,
    active: true
  },
  {
    id: 'scen_9_security',
    title: 'Security and Platform Health',
    description: 'Security auditor reviews events; Platform operator repairs issues.',
    requiredProfileId: 'profile_platform_operator',
    startingRoute: '/admin/security/health',
    estimatedDurationMinutes: 3,
    active: true
  }
];

export const demoScenarioService = {
  getScenarios() {
    return DemoScenarios;
  }
};
