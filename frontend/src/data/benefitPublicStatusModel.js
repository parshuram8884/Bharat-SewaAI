export const BenefitPublicStatus = {
  APPROVED: 'approved',
  SANCTION_PENDING: 'sanction-pending',
  SANCTIONED: 'sanctioned',
  AWAITING_PAYMENT: 'awaiting-payment',
  PAYMENT_PROCESSING: 'payment-processing',
  PAYMENT_PENDING: 'payment-pending',
  PAYMENT_SUCCESSFUL: 'payment-successful',
  PAYMENT_FAILED: 'payment-failed',
  RETRY_SCHEDULED: 'retry-scheduled',
  MANUAL_REVIEW: 'manual-review',
  BENEFIT_DELIVERED: 'benefit-delivered',
  CLOSED: 'closed'
};

export const BenefitPublicStatusLabels = {
  [BenefitPublicStatus.APPROVED]: 'Application Approved',
  [BenefitPublicStatus.SANCTION_PENDING]: 'Sanction Pending',
  [BenefitPublicStatus.SANCTIONED]: 'Benefit Sanctioned',
  [BenefitPublicStatus.AWAITING_PAYMENT]: 'Awaiting Payment',
  [BenefitPublicStatus.PAYMENT_PROCESSING]: 'Payment Processing',
  [BenefitPublicStatus.PAYMENT_PENDING]: 'Payment Pending',
  [BenefitPublicStatus.PAYMENT_SUCCESSFUL]: 'Payment Successful',
  [BenefitPublicStatus.PAYMENT_FAILED]: 'Payment Failed',
  [BenefitPublicStatus.RETRY_SCHEDULED]: 'Retry Scheduled',
  [BenefitPublicStatus.MANUAL_REVIEW]: 'Under Manual Review',
  [BenefitPublicStatus.BENEFIT_DELIVERED]: 'Benefit Delivered',
  [BenefitPublicStatus.CLOSED]: 'Closed'
};
