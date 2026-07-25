export const PaymentFailureReason = {
  BANK_ACCOUNT_MISMATCH: 'bank-account-mismatch',
  ACCOUNT_INACTIVE: 'account-inactive',
  BANK_VALIDATION_FAILED: 'bank-validation-failed',
  DUPLICATE_PAYMENT: 'duplicate-payment',
  TECHNICAL_ISSUE: 'technical-issue',
  MANUAL_REVIEW_REQUIRED: 'manual-review-required',
  PAYMENT_HELD: 'payment-held',
  UNKNOWN: 'unknown'
};

export const PaymentFailureReasonLabels = {
  [PaymentFailureReason.BANK_ACCOUNT_MISMATCH]: 'Bank account details mismatch',
  [PaymentFailureReason.ACCOUNT_INACTIVE]: 'Account is inactive or closed',
  [PaymentFailureReason.BANK_VALIDATION_FAILED]: 'Bank validation failed',
  [PaymentFailureReason.DUPLICATE_PAYMENT]: 'Duplicate payment detected',
  [PaymentFailureReason.TECHNICAL_ISSUE]: 'Technical issue during processing',
  [PaymentFailureReason.MANUAL_REVIEW_REQUIRED]: 'Manual review required',
  [PaymentFailureReason.PAYMENT_HELD]: 'Payment held by bank',
  [PaymentFailureReason.UNKNOWN]: 'Unknown reason'
};

export const NonRetriableFailures = [
  PaymentFailureReason.DUPLICATE_PAYMENT,
  PaymentFailureReason.ACCOUNT_INACTIVE,
  PaymentFailureReason.BANK_ACCOUNT_MISMATCH
];
