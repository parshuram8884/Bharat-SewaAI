export const DocumentVerificationStatus = {
  NOT_REQUESTED: 'not-requested',
  VERIFICATION_REQUESTED: 'verification-requested',
  UNASSIGNED: 'unassigned',
  ASSIGNED: 'assigned',
  UNDER_REVIEW: 'under-review',
  CLARIFICATION_REQUIRED: 'clarification-required',
  REPLACEMENT_REQUESTED: 'replacement-requested',
  RECOMMENDED_APPROVAL: 'recommended-approval',
  RECOMMENDED_REJECTION: 'recommended-rejection',
  APPROVAL_PENDING: 'approval-pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  CANCELLED: 'cancelled',
  SUPERSEDED: 'superseded',
  REVOKED: 'revoked'
};

export const DocumentVerificationStatusLabels = {
  [DocumentVerificationStatus.NOT_REQUESTED]: 'Not Requested',
  [DocumentVerificationStatus.VERIFICATION_REQUESTED]: 'Requested',
  [DocumentVerificationStatus.UNASSIGNED]: 'Unassigned',
  [DocumentVerificationStatus.ASSIGNED]: 'Assigned',
  [DocumentVerificationStatus.UNDER_REVIEW]: 'Under Review',
  [DocumentVerificationStatus.CLARIFICATION_REQUIRED]: 'Clarification Needed',
  [DocumentVerificationStatus.REPLACEMENT_REQUESTED]: 'Replacement Needed',
  [DocumentVerificationStatus.RECOMMENDED_APPROVAL]: 'Approval Recommended',
  [DocumentVerificationStatus.RECOMMENDED_REJECTION]: 'Rejection Recommended',
  [DocumentVerificationStatus.APPROVAL_PENDING]: 'Pending Final Approval',
  [DocumentVerificationStatus.APPROVED]: 'Verified',
  [DocumentVerificationStatus.REJECTED]: 'Rejected',
  [DocumentVerificationStatus.CANCELLED]: 'Cancelled',
  [DocumentVerificationStatus.SUPERSEDED]: 'Superseded',
  [DocumentVerificationStatus.REVOKED]: 'Revoked'
};
