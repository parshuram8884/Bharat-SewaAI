import { GrievancePublicStatus } from './grievancePublicStatusModel';
import { GrievanceInternalStatus } from './grievanceInternalStatusModel';

export const GrievancePublicTransitions = {
  [GrievancePublicStatus.DRAFT]: [GrievancePublicStatus.SUBMITTED],
  [GrievancePublicStatus.SUBMITTED]: [GrievancePublicStatus.RECEIVED],
  [GrievancePublicStatus.RECEIVED]: [GrievancePublicStatus.UNDER_REVIEW],
  [GrievancePublicStatus.UNDER_REVIEW]: [
    GrievancePublicStatus.CLARIFICATION_REQUIRED,
    GrievancePublicStatus.EVIDENCE_REQUIRED,
    GrievancePublicStatus.ESCALATED,
    GrievancePublicStatus.RESOLUTION_PROPOSED
  ],
  [GrievancePublicStatus.CLARIFICATION_REQUIRED]: [GrievancePublicStatus.UNDER_REVIEW],
  [GrievancePublicStatus.EVIDENCE_REQUIRED]: [GrievancePublicStatus.UNDER_REVIEW],
  [GrievancePublicStatus.ESCALATED]: [GrievancePublicStatus.UNDER_REVIEW],
  [GrievancePublicStatus.RESOLUTION_PROPOSED]: [
    GrievancePublicStatus.RESOLVED,
    GrievancePublicStatus.UNDER_REVIEW // If disputed
  ],
  [GrievancePublicStatus.RESOLVED]: [GrievancePublicStatus.CLOSED],
  [GrievancePublicStatus.CLOSED]: [
    GrievancePublicStatus.REOPENED,
    GrievancePublicStatus.APPEAL_SUBMITTED
  ],
  [GrievancePublicStatus.REOPENED]: [GrievancePublicStatus.UNDER_REVIEW],
  [GrievancePublicStatus.APPEAL_SUBMITTED]: [GrievancePublicStatus.APPEAL_UNDER_REVIEW],
  [GrievancePublicStatus.APPEAL_UNDER_REVIEW]: [GrievancePublicStatus.APPEAL_RESOLVED]
};

export const GrievanceInternalTransitions = {
  [GrievanceInternalStatus.QUEUED]: [GrievanceInternalStatus.ASSIGNED],
  [GrievanceInternalStatus.ASSIGNED]: [GrievanceInternalStatus.REVIEW_STARTED],
  [GrievanceInternalStatus.REVIEW_STARTED]: [GrievanceInternalStatus.CLASSIFICATION_REVIEW],
  [GrievanceInternalStatus.CLASSIFICATION_REVIEW]: [GrievanceInternalStatus.APPLICATION_CONTEXT_REVIEW, GrievanceInternalStatus.EVIDENCE_REVIEW],
  [GrievanceInternalStatus.APPLICATION_CONTEXT_REVIEW]: [GrievanceInternalStatus.EVIDENCE_REVIEW],
  [GrievanceInternalStatus.EVIDENCE_REVIEW]: [
    GrievanceInternalStatus.CITIZEN_RESPONSE_PENDING,
    GrievanceInternalStatus.RESOLUTION_DRAFTING,
    GrievanceInternalStatus.ESCALATION_REVIEW
  ],
  [GrievanceInternalStatus.CITIZEN_RESPONSE_PENDING]: [
    GrievanceInternalStatus.EVIDENCE_REVIEW
  ],
  [GrievanceInternalStatus.RESOLUTION_DRAFTING]: [
    GrievanceInternalStatus.RESOLUTION_APPROVAL_PENDING
  ],
  [GrievanceInternalStatus.RESOLUTION_APPROVAL_PENDING]: [
    GrievanceInternalStatus.RESOLUTION_APPROVED,
    GrievanceInternalStatus.RESOLUTION_DRAFTING // Return for rework
  ],
  [GrievanceInternalStatus.RESOLUTION_APPROVED]: [
    GrievanceInternalStatus.CLOSURE_PENDING,
    GrievanceInternalStatus.EVIDENCE_REVIEW // If citizen disputes
  ],
  [GrievanceInternalStatus.CLOSURE_PENDING]: [GrievanceInternalStatus.CLOSED],
  [GrievanceInternalStatus.CLOSED]: [
    GrievanceInternalStatus.REOPENED_REVIEW,
    GrievanceInternalStatus.APPEAL_REVIEW
  ],
  [GrievanceInternalStatus.REOPENED_REVIEW]: [GrievanceInternalStatus.EVIDENCE_REVIEW],
  [GrievanceInternalStatus.APPEAL_REVIEW]: [GrievanceInternalStatus.APPEAL_DECISION_PENDING],
  [GrievanceInternalStatus.APPEAL_DECISION_PENDING]: [
    GrievanceInternalStatus.APPEAL_CLOSED,
    GrievanceInternalStatus.APPEAL_REVIEW // Return for rework
  ]
};

export function isValidGrievanceTransition(currentStatus, nextStatus, isInternal = true) {
  const map = isInternal ? GrievanceInternalTransitions : GrievancePublicTransitions;
  const validTargets = map[currentStatus] || [];
  return validTargets.includes(nextStatus);
}
