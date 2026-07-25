export const GrievanceSlaConfig = {
  default: {
    acknowledgementHours: 24,
    initialReviewDays: 3,
    citizenResponseDays: 7,
    resolutionDays: 15,
    escalationAfterDays: 15,
    appealReviewDays: 10
  },
  urgent: {
    acknowledgementHours: 4,
    initialReviewDays: 1,
    citizenResponseDays: 3,
    resolutionDays: 3,
    escalationAfterDays: 3,
    appealReviewDays: 3
  },
  high: {
    acknowledgementHours: 12,
    initialReviewDays: 2,
    citizenResponseDays: 5,
    resolutionDays: 7,
    escalationAfterDays: 7,
    appealReviewDays: 7
  },
  low: {
    acknowledgementHours: 48,
    initialReviewDays: 7,
    citizenResponseDays: 14,
    resolutionDays: 30,
    escalationAfterDays: 30,
    appealReviewDays: 15
  }
};
