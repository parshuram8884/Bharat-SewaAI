import { PaymentInternalStatus } from './paymentInternalStatusModel';

export const PaymentSlaConfig = {
  // Hours expected before warning, and breached
  [PaymentInternalStatus.SANCTION_REVIEW]: { warning: 24, breached: 48 },
  [PaymentInternalStatus.BATCH_PENDING]: { warning: 48, breached: 96 },
  [PaymentInternalStatus.BATCH_APPROVAL_PENDING]: { warning: 24, breached: 48 },
  [PaymentInternalStatus.RELEASE_PENDING]: { warning: 24, breached: 48 },
  [PaymentInternalStatus.PAYMENT_PROCESSING]: { warning: 48, breached: 72 },
  [PaymentInternalStatus.MANUAL_REVIEW]: { warning: 72, breached: 120 }
};

export const getPaymentSlaStatus = (internalStatus, createdAtTimestamp) => {
  const config = PaymentSlaConfig[internalStatus];
  if (!config) return 'ok';

  const now = Date.now();
  const hoursPassed = (now - createdAtTimestamp) / (1000 * 60 * 60);

  if (hoursPassed >= config.breached) return 'breached';
  if (hoursPassed >= config.warning) return 'warning';
  return 'ok';
};
