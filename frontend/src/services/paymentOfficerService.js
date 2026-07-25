import { PaymentInternalStatus, SanctionInternalStatus } from '../data/paymentInternalStatusModel';
import { PaymentTransitions } from '../data/paymentWorkflowTransitions';
import { NonRetriableFailures } from '../data/paymentFailureReasonModel';
import { officerAuthService } from './officerAuthService';

const getLocalStorageItem = (key, defaultValue = []) => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : defaultValue;
};

const setLocalStorageItem = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

const validateOffline = () => {
  if (!navigator.onLine) {
    throw new Error('Offline: Action restricted while offline.');
  }
};

export const paymentOfficerService = {
  getPaymentDashboard() {
    const batches = getLocalStorageItem('bsai_payment_batches');
    const benefits = getLocalStorageItem('bsai_benefits');
    
    return {
      pendingBatches: batches.filter(b => [PaymentInternalStatus.BATCH_APPROVAL_PENDING].includes(b.status)).length,
      failedPayments: benefits.filter(b => b.internalStatus === PaymentInternalStatus.PAYMENT_FAILED).length,
      manualReviews: benefits.filter(b => b.internalStatus === PaymentInternalStatus.MANUAL_REVIEW).length
    };
  },

  getPaymentQueue() {
    const benefits = getLocalStorageItem('bsai_benefits');
    return benefits.filter(b => [
      PaymentInternalStatus.SANCTION_REVIEW,
      PaymentInternalStatus.SANCTION_APPROVED,
      PaymentInternalStatus.PAYMENT_READY,
      PaymentInternalStatus.BATCH_PENDING
    ].includes(b.internalStatus));
  },

  getFailedPayments() {
    return getLocalStorageItem('bsai_benefits').filter(b => b.internalStatus === PaymentInternalStatus.PAYMENT_FAILED);
  },

  getManualReviewPayments() {
    return getLocalStorageItem('bsai_benefits').filter(b => b.internalStatus === PaymentInternalStatus.MANUAL_REVIEW);
  },
  
  getPaymentBatches() {
    return getLocalStorageItem('bsai_payment_batches');
  },

  getPaymentBatch(batchId) {
    const batches = getLocalStorageItem('bsai_payment_batches');
    const batch = batches.find(b => b.id === batchId);
    if (!batch) throw new Error('Batch not found');
    
    const benefits = getLocalStorageItem('bsai_benefits').filter(b => batch.benefitIds.includes(b.id));
    return { ...batch, benefits };
  },

  getPaymentRecord(benefitId) {
    const benefits = getLocalStorageItem('bsai_benefits');
    const benefit = benefits.find(b => b.id === benefitId);
    if (!benefit) throw new Error('Payment not found');
    return benefit;
  },

  createPaymentBatch(departmentId, benefitIds) {
    validateOffline();
    const batches = getLocalStorageItem('bsai_payment_batches');
    const benefits = getLocalStorageItem('bsai_benefits');
    const user = officerAuthService.getCurrentUser();

    // Prevent duplicate batches
    const invalidBenefits = benefits.filter(b => benefitIds.includes(b.id) && b.batchId);
    if (invalidBenefits.length > 0) throw new Error('Some benefits are already in an active batch');

    let totalAmount = 0;
    const batchBenefits = benefits.filter(b => benefitIds.includes(b.id));
    batchBenefits.forEach(b => {
      totalAmount += b.benefitAmount;
      b.batchId = `BSAI-BAT-${Date.now()}`;
      b.internalStatus = PaymentInternalStatus.BATCH_CREATED;
    });

    const newBatch = {
      id: `BSAI-BAT-${Date.now()}`,
      departmentId,
      createdBy: user.id,
      createdAt: Date.now(),
      status: PaymentInternalStatus.BATCH_CREATED,
      benefitIds,
      totalAmount
    };

    batches.push(newBatch);
    setLocalStorageItem('bsai_payment_batches', batches);
    setLocalStorageItem('bsai_benefits', benefits);
    return newBatch;
  },

  submitPaymentBatch(batchId) {
    validateOffline();
    const batches = getLocalStorageItem('bsai_payment_batches');
    const benefits = getLocalStorageItem('bsai_benefits');
    
    const batch = batches.find(b => b.id === batchId);
    if (!batch) throw new Error('Batch not found');
    
    batch.status = PaymentInternalStatus.BATCH_APPROVAL_PENDING;
    benefits.filter(b => batch.benefitIds.includes(b.id)).forEach(b => {
      b.internalStatus = PaymentInternalStatus.BATCH_APPROVAL_PENDING;
    });

    setLocalStorageItem('bsai_payment_batches', batches);
    setLocalStorageItem('bsai_benefits', benefits);
  },

  approvePaymentBatch(batchId) {
    validateOffline();
    const user = officerAuthService.getCurrentUser();
    const batches = getLocalStorageItem('bsai_payment_batches');
    const benefits = getLocalStorageItem('bsai_benefits');
    
    const batch = batches.find(b => b.id === batchId);
    if (!batch) throw new Error('Batch not found');

    if (batch.createdBy === user.id) {
      throw new Error('Maker-checker violation: Cannot approve your own batch');
    }

    batch.status = PaymentInternalStatus.BATCH_APPROVED;
    batch.approvedBy = user.id;
    batch.approvedAt = Date.now();

    benefits.filter(b => batch.benefitIds.includes(b.id)).forEach(b => {
      b.internalStatus = PaymentInternalStatus.BATCH_APPROVED;
    });

    setLocalStorageItem('bsai_payment_batches', batches);
    setLocalStorageItem('bsai_benefits', benefits);
  },

  releasePaymentBatch(batchId) {
    validateOffline();
    const batches = getLocalStorageItem('bsai_payment_batches');
    const benefits = getLocalStorageItem('bsai_benefits');
    
    const batch = batches.find(b => b.id === batchId);
    if (!batch) throw new Error('Batch not found');

    batch.status = PaymentInternalStatus.RELEASE_PENDING;
    benefits.filter(b => batch.benefitIds.includes(b.id)).forEach(b => {
      b.internalStatus = PaymentInternalStatus.RELEASE_PENDING;
    });

    setLocalStorageItem('bsai_payment_batches', batches);
    setLocalStorageItem('bsai_benefits', benefits);
  },

  simulatePaymentProcessing(batchId) {
    validateOffline();
    const batches = getLocalStorageItem('bsai_payment_batches');
    const benefits = getLocalStorageItem('bsai_benefits');
    
    const batch = batches.find(b => b.id === batchId);
    if (!batch) throw new Error('Batch not found');

    batch.status = PaymentInternalStatus.PAYMENT_PROCESSING;
    benefits.filter(b => batch.benefitIds.includes(b.id)).forEach(b => {
      b.internalStatus = PaymentInternalStatus.PAYMENT_PROCESSING;
    });

    setLocalStorageItem('bsai_payment_batches', batches);
    setLocalStorageItem('bsai_benefits', benefits);
  },

  simulatePaymentSuccess(benefitId) {
    validateOffline();
    const benefits = getLocalStorageItem('bsai_benefits');
    const attempts = getLocalStorageItem('bsai_payment_attempts');
    
    const benefit = benefits.find(b => b.id === benefitId);
    if (!benefit) throw new Error('Benefit not found');

    benefit.internalStatus = PaymentInternalStatus.COMPLETED;
    benefit.paymentReference = `PAY-REF-SIM-${Date.now()}`;
    
    attempts.push({
      id: `BSAI-PAY-${Date.now()}`,
      benefitId,
      amount: benefit.benefitAmount,
      status: PaymentInternalStatus.PAYMENT_SUCCESS,
      createdAt: Date.now() - 10000,
      resolvedAt: Date.now(),
      failureReason: null
    });

    setLocalStorageItem('bsai_benefits', benefits);
    setLocalStorageItem('bsai_payment_attempts', attempts);
  },

  simulatePaymentFailure(benefitId, failureReason) {
    validateOffline();
    const benefits = getLocalStorageItem('bsai_benefits');
    const attempts = getLocalStorageItem('bsai_payment_attempts');
    
    const benefit = benefits.find(b => b.id === benefitId);
    if (!benefit) throw new Error('Benefit not found');

    benefit.internalStatus = PaymentInternalStatus.PAYMENT_FAILED;
    
    attempts.push({
      id: `BSAI-PAY-${Date.now()}`,
      benefitId,
      amount: benefit.benefitAmount,
      status: PaymentInternalStatus.PAYMENT_FAILED,
      createdAt: Date.now() - 10000,
      resolvedAt: Date.now(),
      failureReason
    });

    setLocalStorageItem('bsai_benefits', benefits);
    setLocalStorageItem('bsai_payment_attempts', attempts);
  },

  schedulePaymentRetry(benefitId) {
    validateOffline();
    const benefits = getLocalStorageItem('bsai_benefits');
    const attempts = getLocalStorageItem('bsai_payment_attempts');
    
    const benefit = benefits.find(b => b.id === benefitId);
    if (!benefit) throw new Error('Benefit not found');

    const recentAttempt = attempts.filter(a => a.benefitId === benefitId).sort((a,b) => b.createdAt - a.createdAt)[0];
    if (recentAttempt && NonRetriableFailures.includes(recentAttempt.failureReason)) {
      throw new Error('Failure reason is not retriable. Must be sent to manual review.');
    }

    benefit.internalStatus = PaymentInternalStatus.RETRY_APPROVED;
    setLocalStorageItem('bsai_benefits', benefits);
  },

  moveToManualReview(benefitId) {
    validateOffline();
    const benefits = getLocalStorageItem('bsai_benefits');
    const benefit = benefits.find(b => b.id === benefitId);
    if (!benefit) throw new Error('Benefit not found');

    benefit.internalStatus = PaymentInternalStatus.MANUAL_REVIEW;
    setLocalStorageItem('bsai_benefits', benefits);
  },

  approveSanction(benefitId) {
    validateOffline();
    const user = officerAuthService.getCurrentUser();
    const benefits = getLocalStorageItem('bsai_benefits');
    const sanctions = getLocalStorageItem('bsai_sanctions');
    
    const benefit = benefits.find(b => b.id === benefitId);
    if (!benefit) throw new Error('Benefit not found');
    
    const sanction = sanctions.find(s => s.benefitId === benefitId && s.status === SanctionInternalStatus.PENDING_APPROVAL);
    if (sanction) {
      if (sanction.recommendedBy === user.id) {
        throw new Error('Maker-checker violation: Cannot approve your own sanction recommendation');
      }
      sanction.status = SanctionInternalStatus.APPROVED;
      sanction.approvedBy = user.id;
      sanction.approvedAt = Date.now();
      
      benefit.sanctionNumber = `BSAI-SAN-${Date.now()}`;
      benefit.sanctionDate = Date.now();
    }
    
    benefit.internalStatus = PaymentInternalStatus.SANCTION_APPROVED;
    
    setLocalStorageItem('bsai_benefits', benefits);
    setLocalStorageItem('bsai_sanctions', sanctions);
  }
};
