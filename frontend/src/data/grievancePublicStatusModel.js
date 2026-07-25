export const GrievancePublicStatus = {
  DRAFT: 'draft',
  SUBMITTED: 'submitted',
  RECEIVED: 'received',
  UNDER_REVIEW: 'under-review',
  CLARIFICATION_REQUIRED: 'clarification-required',
  EVIDENCE_REQUIRED: 'evidence-required',
  ESCALATED: 'escalated',
  RESOLUTION_PROPOSED: 'resolution-proposed',
  RESOLVED: 'resolved',
  CLOSED: 'closed',
  REOPENED: 'reopened',
  APPEAL_SUBMITTED: 'appeal-submitted',
  APPEAL_UNDER_REVIEW: 'appeal-under-review',
  APPEAL_RESOLVED: 'appeal-resolved',
  WITHDRAWN: 'withdrawn',
  CANCELLED: 'cancelled'
};

export const GrievancePublicStatusConfig = {
  [GrievancePublicStatus.DRAFT]: { label: 'Draft', color: 'slate', terminal: false },
  [GrievancePublicStatus.SUBMITTED]: { label: 'Submitted', color: 'blue', terminal: false },
  [GrievancePublicStatus.RECEIVED]: { label: 'Received', color: 'indigo', terminal: false },
  [GrievancePublicStatus.UNDER_REVIEW]: { label: 'Under Review', color: 'purple', terminal: false },
  [GrievancePublicStatus.CLARIFICATION_REQUIRED]: { label: 'Clarification Required', color: 'amber', terminal: false },
  [GrievancePublicStatus.EVIDENCE_REQUIRED]: { label: 'Evidence Required', color: 'amber', terminal: false },
  [GrievancePublicStatus.ESCALATED]: { label: 'Escalated', color: 'orange', terminal: false },
  [GrievancePublicStatus.RESOLUTION_PROPOSED]: { label: 'Resolution Proposed', color: 'teal', terminal: false },
  [GrievancePublicStatus.RESOLVED]: { label: 'Resolved', color: 'green', terminal: true },
  [GrievancePublicStatus.CLOSED]: { label: 'Closed', color: 'slate', terminal: true },
  [GrievancePublicStatus.REOPENED]: { label: 'Reopened', color: 'blue', terminal: false },
  [GrievancePublicStatus.APPEAL_SUBMITTED]: { label: 'Appeal Submitted', color: 'indigo', terminal: false },
  [GrievancePublicStatus.APPEAL_UNDER_REVIEW]: { label: 'Appeal Under Review', color: 'purple', terminal: false },
  [GrievancePublicStatus.APPEAL_RESOLVED]: { label: 'Appeal Resolved', color: 'green', terminal: true },
  [GrievancePublicStatus.WITHDRAWN]: { label: 'Withdrawn', color: 'slate', terminal: true },
  [GrievancePublicStatus.CANCELLED]: { label: 'Cancelled', color: 'red', terminal: true }
};
