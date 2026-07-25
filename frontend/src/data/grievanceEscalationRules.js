export const GrievanceEscalationLevels = {
  LEVEL_0: 'level-0', // Normal handling
  LEVEL_1: 'level-1', // Grievance manager
  LEVEL_2: 'level-2', // Department administrator
  LEVEL_3: 'level-3'  // Super admin / Cross department
};

export const GrievanceEscalationRules = [
  {
    id: 'rule-sla-breach',
    condition: 'sla-overdue',
    triggerThresholdDays: 1,
    newLevel: GrievanceEscalationLevels.LEVEL_1,
    receivingRole: 'grievance-manager',
    automatic: true,
    description: 'Automatic escalation when resolution SLA is breached.'
  },
  {
    id: 'rule-citizen-request',
    condition: 'citizen-escalation-request',
    triggerThresholdDays: 0,
    newLevel: GrievanceEscalationLevels.LEVEL_1,
    receivingRole: 'grievance-manager',
    automatic: false,
    description: 'Citizen manually requested escalation.'
  },
  {
    id: 'rule-appeal-submitted',
    condition: 'appeal-submitted',
    triggerThresholdDays: 0,
    newLevel: GrievanceEscalationLevels.LEVEL_2,
    receivingRole: 'department-admin',
    automatic: true,
    description: 'Appeals are automatically escalated to department administrators.'
  },
  {
    id: 'rule-repeated-reopen',
    condition: 'reopen-count-exceeded',
    triggerThresholdDays: 0,
    newLevel: GrievanceEscalationLevels.LEVEL_2,
    receivingRole: 'department-admin',
    automatic: true,
    description: 'Complaint reopened multiple times escalates to admin.'
  },
  {
    id: 'rule-unassigned-timeout',
    condition: 'unassigned-timeout',
    triggerThresholdDays: 3,
    newLevel: GrievanceEscalationLevels.LEVEL_1,
    receivingRole: 'grievance-manager',
    automatic: true,
    description: 'Complaint remained unassigned for too long.'
  }
];
