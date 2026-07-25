export const SlaStates = {
  ON_TRACK: 'on-track',
  DUE_SOON: 'due-soon',
  OVERDUE: 'overdue',
  PAUSED_AWAITING_CITIZEN: 'paused-awaiting-citizen',
  COMPLETED: 'completed'
};

export const slaConfig = {
  'pm-kisan': {
    schemeId: 'pm-kisan',
    initialReviewDays: 3,
    documentReviewDays: 5,
    clarificationResponseDays: 7,
    decisionDays: 2,
    escalationDays: 2,
    totalProcessingDays: 14 // Mock limit
  },
  'default': {
    schemeId: 'default',
    initialReviewDays: 5,
    documentReviewDays: 7,
    clarificationResponseDays: 10,
    decisionDays: 3,
    escalationDays: 5,
    totalProcessingDays: 30
  }
};
