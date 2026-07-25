// Phase 9 Internal Workflow Statuses vs Phase 8 Public Statuses

export const InternalStatus = {
  QUEUED: 'queued',
  ASSIGNED: 'assigned',
  REVIEW_STARTED: 'review-started',
  DOCUMENT_REVIEW: 'document-review',
  ELIGIBILITY_REVIEW: 'eligibility-review',
  CLARIFICATION_PENDING: 'clarification-pending',
  DOCUMENT_RESPONSE_PENDING: 'document-response-pending',
  FIELD_VERIFICATION_PENDING: 'field-verification-pending',
  RECOMMENDATION_SUBMITTED: 'recommendation-submitted',
  DECISION_PENDING: 'decision-pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  RETURNED_FOR_CORRECTION: 'returned-for-correction',
  ESCALATED: 'escalated',
  CLOSED: 'closed'
};

// Maps internal status to safe public status
export const PublicStatusMap = {
  [InternalStatus.QUEUED]: 'under-review',
  [InternalStatus.ASSIGNED]: 'under-review',
  [InternalStatus.REVIEW_STARTED]: 'under-review',
  [InternalStatus.DOCUMENT_REVIEW]: 'under-review',
  [InternalStatus.ELIGIBILITY_REVIEW]: 'under-review',
  [InternalStatus.CLARIFICATION_PENDING]: 'clarification-requested',
  [InternalStatus.DOCUMENT_RESPONSE_PENDING]: 'documents-requested',
  [InternalStatus.FIELD_VERIFICATION_PENDING]: 'field-verification',
  [InternalStatus.RECOMMENDATION_SUBMITTED]: 'under-review',
  [InternalStatus.DECISION_PENDING]: 'under-review',
  [InternalStatus.APPROVED]: 'approved',
  [InternalStatus.REJECTED]: 'rejected',
  [InternalStatus.RETURNED_FOR_CORRECTION]: 'clarification-requested',
  [InternalStatus.ESCALATED]: 'under-review',
  [InternalStatus.CLOSED]: 'closed'
};

// Maps valid transitions from a given state
export const ValidTransitions = {
  [InternalStatus.QUEUED]: [InternalStatus.ASSIGNED],
  [InternalStatus.ASSIGNED]: [InternalStatus.QUEUED, InternalStatus.REVIEW_STARTED],
  [InternalStatus.REVIEW_STARTED]: [
    InternalStatus.DOCUMENT_REVIEW, 
    InternalStatus.CLARIFICATION_PENDING, 
    InternalStatus.DOCUMENT_RESPONSE_PENDING, 
    InternalStatus.FIELD_VERIFICATION_PENDING,
    InternalStatus.RETURNED_FOR_CORRECTION,
    InternalStatus.ESCALATED,
    InternalStatus.QUEUED // Unassigned
  ],
  [InternalStatus.DOCUMENT_REVIEW]: [
    InternalStatus.ELIGIBILITY_REVIEW,
    InternalStatus.CLARIFICATION_PENDING,
    InternalStatus.DOCUMENT_RESPONSE_PENDING
  ],
  [InternalStatus.ELIGIBILITY_REVIEW]: [
    InternalStatus.RECOMMENDATION_SUBMITTED,
    InternalStatus.CLARIFICATION_PENDING
  ],
  [InternalStatus.CLARIFICATION_PENDING]: [InternalStatus.REVIEW_STARTED], // On response
  [InternalStatus.DOCUMENT_RESPONSE_PENDING]: [InternalStatus.REVIEW_STARTED], // On response
  [InternalStatus.FIELD_VERIFICATION_PENDING]: [InternalStatus.REVIEW_STARTED], // On response
  [InternalStatus.RECOMMENDATION_SUBMITTED]: [InternalStatus.DECISION_PENDING],
  [InternalStatus.DECISION_PENDING]: [InternalStatus.APPROVED, InternalStatus.REJECTED, InternalStatus.RETURNED_FOR_CORRECTION],
  [InternalStatus.ESCALATED]: [InternalStatus.ASSIGNED, InternalStatus.DECISION_PENDING],
  [InternalStatus.RETURNED_FOR_CORRECTION]: [InternalStatus.REVIEW_STARTED],
  [InternalStatus.APPROVED]: [InternalStatus.CLOSED],
  [InternalStatus.REJECTED]: [InternalStatus.CLOSED]
};
