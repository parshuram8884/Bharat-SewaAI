import { PaymentInternalStatus, SanctionInternalStatus } from './paymentInternalStatusModel';
import { BenefitPublicStatus } from './benefitPublicStatusModel';

export const PaymentTransitions = {
  [PaymentInternalStatus.SANCTION_CREATED]: [PaymentInternalStatus.SANCTION_REVIEW],
  [PaymentInternalStatus.SANCTION_REVIEW]: [PaymentInternalStatus.SANCTION_APPROVED, PaymentInternalStatus.PAYMENT_CANCELLED],
  [PaymentInternalStatus.SANCTION_APPROVED]: [PaymentInternalStatus.PAYMENT_READY],
  [PaymentInternalStatus.PAYMENT_READY]: [PaymentInternalStatus.BATCH_PENDING, PaymentInternalStatus.PAYMENT_CANCELLED],
  [PaymentInternalStatus.BATCH_PENDING]: [PaymentInternalStatus.BATCH_CREATED],
  [PaymentInternalStatus.BATCH_CREATED]: [PaymentInternalStatus.BATCH_APPROVAL_PENDING],
  [PaymentInternalStatus.BATCH_APPROVAL_PENDING]: [PaymentInternalStatus.BATCH_APPROVED, PaymentInternalStatus.PAYMENT_READY],
  [PaymentInternalStatus.BATCH_APPROVED]: [PaymentInternalStatus.RELEASE_PENDING],
  [PaymentInternalStatus.RELEASE_PENDING]: [PaymentInternalStatus.PAYMENT_PROCESSING, PaymentInternalStatus.PAYMENT_FROZEN],
  [PaymentInternalStatus.PAYMENT_PROCESSING]: [PaymentInternalStatus.VALIDATION_PENDING, PaymentInternalStatus.PAYMENT_SUCCESS, PaymentInternalStatus.PAYMENT_FAILED],
  [PaymentInternalStatus.VALIDATION_PENDING]: [PaymentInternalStatus.CONFIRMATION_PENDING, PaymentInternalStatus.PAYMENT_FAILED],
  [PaymentInternalStatus.CONFIRMATION_PENDING]: [PaymentInternalStatus.PAYMENT_SUCCESS, PaymentInternalStatus.PAYMENT_FAILED],
  [PaymentInternalStatus.PAYMENT_SUCCESS]: [PaymentInternalStatus.COMPLETED],
  [PaymentInternalStatus.PAYMENT_FAILED]: [PaymentInternalStatus.RETRY_PENDING, PaymentInternalStatus.MANUAL_REVIEW],
  [PaymentInternalStatus.RETRY_PENDING]: [PaymentInternalStatus.RETRY_APPROVED, PaymentInternalStatus.MANUAL_REVIEW],
  [PaymentInternalStatus.RETRY_APPROVED]: [PaymentInternalStatus.PAYMENT_PROCESSING],
  [PaymentInternalStatus.MANUAL_REVIEW]: [PaymentInternalStatus.PAYMENT_READY, PaymentInternalStatus.PAYMENT_CANCELLED, PaymentInternalStatus.RETRY_PENDING],
  [PaymentInternalStatus.PAYMENT_FROZEN]: [PaymentInternalStatus.RELEASE_PENDING, PaymentInternalStatus.PAYMENT_CANCELLED],
  [PaymentInternalStatus.PAYMENT_CANCELLED]: [],
  [PaymentInternalStatus.COMPLETED]: []
};

export const mapInternalToPublicStatus = (internalStatus) => {
  switch (internalStatus) {
    case PaymentInternalStatus.SANCTION_CREATED:
    case PaymentInternalStatus.SANCTION_REVIEW:
      return BenefitPublicStatus.SANCTION_PENDING;
    case PaymentInternalStatus.SANCTION_APPROVED:
    case PaymentInternalStatus.PAYMENT_READY:
    case PaymentInternalStatus.BATCH_PENDING:
      return BenefitPublicStatus.SANCTIONED;
    case PaymentInternalStatus.BATCH_CREATED:
    case PaymentInternalStatus.BATCH_APPROVAL_PENDING:
    case PaymentInternalStatus.BATCH_APPROVED:
    case PaymentInternalStatus.RELEASE_PENDING:
    case PaymentInternalStatus.PAYMENT_FROZEN:
      return BenefitPublicStatus.AWAITING_PAYMENT;
    case PaymentInternalStatus.PAYMENT_PROCESSING:
    case PaymentInternalStatus.VALIDATION_PENDING:
    case PaymentInternalStatus.CONFIRMATION_PENDING:
      return BenefitPublicStatus.PAYMENT_PROCESSING;
    case PaymentInternalStatus.PAYMENT_SUCCESS:
      return BenefitPublicStatus.PAYMENT_SUCCESSFUL;
    case PaymentInternalStatus.COMPLETED:
      return BenefitPublicStatus.BENEFIT_DELIVERED;
    case PaymentInternalStatus.PAYMENT_FAILED:
      return BenefitPublicStatus.PAYMENT_FAILED;
    case PaymentInternalStatus.RETRY_PENDING:
    case PaymentInternalStatus.RETRY_APPROVED:
      return BenefitPublicStatus.RETRY_SCHEDULED;
    case PaymentInternalStatus.MANUAL_REVIEW:
      return BenefitPublicStatus.MANUAL_REVIEW;
    case PaymentInternalStatus.PAYMENT_CANCELLED:
      return BenefitPublicStatus.CLOSED;
    default:
      return BenefitPublicStatus.CLOSED;
  }
};
