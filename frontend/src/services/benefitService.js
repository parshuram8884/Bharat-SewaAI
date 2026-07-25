import { mapInternalToPublicStatus, PaymentTransitions } from '../data/paymentWorkflowTransitions';
import { BenefitPublicStatus } from '../data/benefitPublicStatusModel';
import { PaymentInternalStatus, SanctionInternalStatus } from '../data/paymentInternalStatusModel';

const getLocalStorageItem = (key, defaultValue = []) => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : defaultValue;
};

const setLocalStorageItem = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const benefitService = {
  getCitizenBenefits(citizenId) {
    const benefits = getLocalStorageItem('bsai_benefits');
    return benefits
      .filter(b => b.citizenId === citizenId)
      .map(this.mapBenefitToCitizenView)
      .sort((a, b) => b.createdAt - a.createdAt);
  },

  getBenefit(benefitId) {
    const benefits = getLocalStorageItem('bsai_benefits');
    const benefit = benefits.find(b => b.id === benefitId);
    if (!benefit) throw new Error('Benefit not found');
    return this.mapBenefitToCitizenView(benefit);
  },

  getBenefitTimeline(benefitId) {
    const benefit = this.getBenefit(benefitId);
    const attempts = getLocalStorageItem('bsai_payment_attempts').filter(a => a.benefitId === benefitId);
    
    const timeline = [];
    
    // Application Approved
    timeline.push({
      id: 'tl-1',
      title: 'Application Approved',
      date: benefit.createdAt,
      status: 'completed'
    });

    // Benefit Sanctioned
    if (benefit.sanctionDate) {
      timeline.push({
        id: 'tl-2',
        title: 'Benefit Sanctioned',
        date: benefit.sanctionDate,
        status: 'completed',
        details: `Sanction Order: ${benefit.sanctionNumber}`
      });
    }

    // Payment Processing
    const processingStatuses = [
      BenefitPublicStatus.PAYMENT_PROCESSING,
      BenefitPublicStatus.PAYMENT_SUCCESSFUL,
      BenefitPublicStatus.BENEFIT_DELIVERED
    ];
    
    if (processingStatuses.includes(benefit.publicStatus)) {
       timeline.push({
         id: 'tl-3',
         title: 'Payment Processing',
         date: benefit.createdAt + 86400000,
         status: 'completed'
       });
    }

    // Process attempts
    attempts.sort((a, b) => a.createdAt - b.createdAt).forEach((attempt, index) => {
      if (attempt.status === PaymentInternalStatus.PAYMENT_FAILED) {
        timeline.push({
          id: `tl-fail-${attempt.id}`,
          title: 'Payment Failed',
          date: attempt.resolvedAt,
          status: 'error'
        });
      } else if (attempt.status === PaymentInternalStatus.PAYMENT_SUCCESS) {
        timeline.push({
          id: `tl-success-${attempt.id}`,
          title: 'Payment Successful',
          date: attempt.resolvedAt,
          status: 'completed',
          details: `Reference: ${benefit.paymentReference}`
        });
        
        if (benefit.publicStatus === BenefitPublicStatus.BENEFIT_DELIVERED || benefit.publicStatus === BenefitPublicStatus.CLOSED) {
           timeline.push({
             id: `tl-delivered-${attempt.id}`,
             title: 'Benefit Delivered',
             date: attempt.resolvedAt + 3600000,
             status: 'completed'
           });
        }
      }
    });

    return timeline;
  },

  getBenefitPaymentHistory(benefitId) {
    const attempts = getLocalStorageItem('bsai_payment_attempts').filter(a => a.benefitId === benefitId);
    return attempts.map(this.mapPaymentAttemptToCitizenTimeline).sort((a, b) => b.createdAt - a.createdAt);
  },

  getBenefitSanction(benefitId) {
    const sanctions = getLocalStorageItem('bsai_sanctions');
    const sanction = sanctions.find(s => s.benefitId === benefitId && s.status === SanctionInternalStatus.APPROVED);
    return sanction ? this.mapSanctionToCitizenView(sanction) : null;
  },

  getSanctionDownloadData(benefitId) {
    const benefit = this.getBenefit(benefitId);
    if (!benefit.sanctionNumber) throw new Error('Sanction order not yet generated');
    
    return {
      ...benefit,
      documentDisclaimer: "Bharat Sewa AI Demonstration Sanction Order\nThis document is generated for demonstration purposes only. It is not an official government sanction order, payment authority, financial instrument or legal record."
    };
  },

  getPaymentAdviceDownloadData(benefitId) {
    const benefit = this.getBenefit(benefitId);
    if (benefit.publicStatus !== BenefitPublicStatus.PAYMENT_SUCCESSFUL && benefit.publicStatus !== BenefitPublicStatus.BENEFIT_DELIVERED) {
      throw new Error('Payment not yet successful');
    }

    return {
      ...benefit,
      documentDisclaimer: "Bharat Sewa AI Demonstration Payment Advice\nThis document is generated for demonstration purposes only. It does not confirm that money has been transferred through any bank, PFMS, NPCI, DBT platform or government payment system."
    };
  },
  
  canReportPaymentIssue(benefitId) {
    const benefit = this.getBenefit(benefitId);
    return [BenefitPublicStatus.PAYMENT_FAILED, BenefitPublicStatus.MANUAL_REVIEW].includes(benefit.publicStatus);
  },

  // Mappers to ensure internal data never leaks to citizen view
  mapBenefitToCitizenView(benefit) {
    return {
      id: benefit.id,
      applicationId: benefit.applicationId,
      citizenId: benefit.citizenId,
      schemeId: benefit.schemeId,
      benefitName: benefit.benefitName,
      sanctionNumber: benefit.sanctionNumber,
      sanctionDate: benefit.sanctionDate,
      benefitAmount: benefit.benefitAmount,
      currency: benefit.currency,
      publicStatus: mapInternalToPublicStatus(benefit.internalStatus),
      paymentMode: benefit.paymentMode,
      bankMasked: benefit.bankMasked,
      accountMasked: benefit.accountMasked,
      paymentReference: benefit.paymentReference,
      createdAt: benefit.createdAt
    };
  },

  mapPaymentAttemptToCitizenTimeline(attempt) {
    return {
      id: attempt.id,
      amount: attempt.amount,
      status: attempt.status === PaymentInternalStatus.PAYMENT_SUCCESS ? 'Success' : 'Failed',
      createdAt: attempt.createdAt,
      resolvedAt: attempt.resolvedAt
    };
  },

  mapSanctionToCitizenView(sanction) {
    return {
      id: sanction.id,
      status: sanction.status,
      createdAt: sanction.createdAt,
      approvedAt: sanction.approvedAt
    };
  }
};
