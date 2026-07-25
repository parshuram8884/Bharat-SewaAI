/**
 * Models and status definitions for Document Requests and Clarifications
 */

export const DocumentRequestStatuses = {
  OPEN: 'open',
  DRAFT_RESPONSE: 'draft-response',
  SUBMITTED: 'submitted',
  ACCEPTED: 'accepted',
  REJECTED: 'rejected',
  EXPIRED: 'expired',
  CANCELLED: 'cancelled',
};

export const ClarificationStatuses = {
  OPEN: 'open',
  DRAFT: 'draft',
  SUBMITTED: 'submitted',
  REVIEWED: 'reviewed',
  CLOSED: 'closed',
  EXPIRED: 'expired',
};

export const TimelineActorTypes = {
  CITIZEN: 'citizen',
  DEPARTMENT: 'department',
  SYSTEM: 'system',
  FIELD_OFFICER: 'field-officer',
};

/**
 * Example Document Request Model Structure
 * 
 * {
 *   id: string,
 *   applicationId: string,
 *   title: string,
 *   description: string,
 *   reason: string,
 *   documentType: string,
 *   required: boolean,
 *   deadline: ISOString,
 *   status: DocumentRequestStatuses,
 *   requestedAt: ISOString,
 *   respondedAt: ISOString | null,
 *   responseDocumentId: string | null,
 *   officerName: string,
 *   officerRole: string
 * }
 */

/**
 * Example Clarification Request Model Structure
 * 
 * {
 *   id: string,
 *   applicationId: string,
 *   question: string,
 *   reason: string,
 *   deadline: ISOString,
 *   status: ClarificationStatuses,
 *   requestedAt: ISOString,
 *   responseText: string,
 *   attachments: array,
 *   respondedAt: ISOString | null
 * }
 */

/**
 * Example Timeline Model Structure
 * 
 * {
 *   id: string,
 *   applicationId: string,
 *   eventType: string,
 *   status: string,
 *   title: string,
 *   description: string,
 *   timestamp: ISOString,
 *   actorType: TimelineActorTypes,
 *   actorName: string,
 *   source: string,
 *   relatedRequestId: string | null,
 *   visibility: 'public' | 'internal'
 * }
 */
