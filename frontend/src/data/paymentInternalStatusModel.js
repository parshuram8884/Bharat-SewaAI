export const PaymentInternalStatus = {
  SANCTION_CREATED: 'sanction-created',
  SANCTION_REVIEW: 'sanction-review',
  SANCTION_APPROVED: 'sanction-approved',
  PAYMENT_READY: 'payment-ready',
  BATCH_PENDING: 'batch-pending',
  BATCH_CREATED: 'batch-created',
  BATCH_APPROVAL_PENDING: 'batch-approval-pending',
  BATCH_APPROVED: 'batch-approved',
  RELEASE_PENDING: 'release-pending',
  PAYMENT_PROCESSING: 'payment-processing',
  VALIDATION_PENDING: 'validation-pending',
  CONFIRMATION_PENDING: 'confirmation-pending',
  PAYMENT_SUCCESS: 'payment-success',
  PAYMENT_FAILED: 'payment-failed',
  RETRY_PENDING: 'retry-pending',
  RETRY_APPROVED: 'retry-approved',
  MANUAL_REVIEW: 'manual-review',
  PAYMENT_FROZEN: 'payment-frozen',
  PAYMENT_CANCELLED: 'payment-cancelled',
  COMPLETED: 'completed'
};

export const SanctionInternalStatus = {
  DRAFT: 'draft',
  RECOMMENDED: 'recommended',
  PENDING_APPROVAL: 'pending-approval',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  CANCELLED: 'cancelled',
  SUPERSEDED: 'superseded'
};
