import { PaymentInternalStatus } from '../data/paymentInternalStatusModel';

const getLocalStorageItem = (key, defaultValue = []) => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : defaultValue;
};

export const paymentAdminService = {
  getPaymentAnalytics() {
    const benefits = getLocalStorageItem('bsai_benefits');
    const attempts = getLocalStorageItem('bsai_payment_attempts');
    
    let totalSanctioned = 0;
    let totalPaid = 0;
    
    benefits.forEach(b => {
      totalSanctioned += b.benefitAmount;
      if (b.internalStatus === PaymentInternalStatus.COMPLETED) {
        totalPaid += b.benefitAmount;
      }
    });
    
    const pending = benefits.filter(b => [
      PaymentInternalStatus.BATCH_APPROVAL_PENDING,
      PaymentInternalStatus.RELEASE_PENDING,
      PaymentInternalStatus.PAYMENT_PROCESSING
    ].includes(b.internalStatus)).length;
    
    const failed = benefits.filter(b => b.internalStatus === PaymentInternalStatus.PAYMENT_FAILED).length;
    const manualReview = benefits.filter(b => b.internalStatus === PaymentInternalStatus.MANUAL_REVIEW).length;
    const retries = benefits.filter(b => b.internalStatus === PaymentInternalStatus.RETRY_APPROVED).length;

    // Failure reasons breakdown
    const failureReasons = {};
    attempts.filter(a => a.status === PaymentInternalStatus.PAYMENT_FAILED).forEach(a => {
      failureReasons[a.failureReason] = (failureReasons[a.failureReason] || 0) + 1;
    });
    
    return {
      totalSanctionedAmount: totalSanctioned,
      totalPaidAmount: totalPaid,
      pendingCount: pending,
      failedCount: failed,
      manualReviewCount: manualReview,
      retryCount: retries,
      failureReasons
    };
  },
  
  getGlobalPaymentAudit() {
    return getLocalStorageItem('bsai_payment_audits').sort((a,b) => b.timestamp - a.timestamp);
  }
};
