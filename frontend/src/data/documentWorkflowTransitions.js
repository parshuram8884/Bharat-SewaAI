import { DocumentLifecycleStatus } from './documentLifecycleStatusModel';
import { DocumentVerificationStatus } from './documentVerificationStatusModel';

export const isVerificationStatusFinal = (status) => {
  return [
    DocumentVerificationStatus.APPROVED,
    DocumentVerificationStatus.REJECTED,
    DocumentVerificationStatus.CANCELLED,
    DocumentVerificationStatus.SUPERSEDED,
    DocumentVerificationStatus.REVOKED
  ].includes(status);
};

export const canCitizenRequestVerification = (lifecycleStatus, verificationStatus) => {
  if (lifecycleStatus === DocumentLifecycleStatus.OCR_COMPLETE && verificationStatus === DocumentVerificationStatus.NOT_REQUESTED) {
    return true;
  }
  return false;
};

export const canOfficerAssign = (verificationStatus) => {
  return [
    DocumentVerificationStatus.VERIFICATION_REQUESTED,
    DocumentVerificationStatus.UNASSIGNED
  ].includes(verificationStatus);
};

export const getNextVerificationStatus = (currentStatus, action) => {
  switch (action) {
    case 'request-verification':
      return DocumentVerificationStatus.UNASSIGNED;
    case 'assign':
      return DocumentVerificationStatus.ASSIGNED;
    case 'start-review':
      return DocumentVerificationStatus.UNDER_REVIEW;
    case 'request-clarification':
      return DocumentVerificationStatus.CLARIFICATION_REQUIRED;
    case 'request-replacement':
      return DocumentVerificationStatus.REPLACEMENT_REQUESTED;
    case 'recommend-approval':
      return DocumentVerificationStatus.RECOMMENDED_APPROVAL;
    case 'recommend-rejection':
      return DocumentVerificationStatus.RECOMMENDED_REJECTION;
    case 'approve':
      return DocumentVerificationStatus.APPROVED;
    case 'reject':
      return DocumentVerificationStatus.REJECTED;
    case 'revoke':
      return DocumentVerificationStatus.REVOKED;
    case 'cancel':
      return DocumentVerificationStatus.CANCELLED;
    default:
      return currentStatus;
  }
};
