import { PaymentInternalStatus, SanctionInternalStatus } from '../data/paymentInternalStatusModel';
import { PaymentMode } from '../data/paymentModeModel';
import { PaymentFailureReason } from '../data/paymentFailureReasonModel';

export const benefitDemoDataService = {
  initializeDemoData() {
    this.migrateBenefitStorage();

    const storedBenefits = localStorage.getItem('bsai_benefits');
    if (storedBenefits) {
      return; // Idempotent, already initialized
    }

    const demoBenefits = [
      // 1. Sanction Pending
      {
        id: 'BSAI-BEN-2026-100001',
        applicationId: 'BSAI-APP-2026-000001',
        citizenId: 'citizen-123',
        departmentId: 'dept-agri',
        schemeId: 'PM-KISAN',
        benefitName: 'PM-KISAN Instalment',
        sanctionNumber: null,
        sanctionDate: null,
        benefitAmount: 2000,
        currency: 'INR',
        paymentStatus: PaymentInternalStatus.SANCTION_CREATED,
        internalStatus: PaymentInternalStatus.SANCTION_CREATED,
        paymentMode: PaymentMode.DBT,
        bankMasked: 'XXXXXX1234',
        accountMasked: 'XXXXXXXXXX5678',
        paymentReference: null,
        timelineIds: [],
        auditIds: [],
        createdAt: Date.now() - 86400000 * 2
      },
      // 2. Sanction Approved
      {
        id: 'BSAI-BEN-2026-100002',
        applicationId: 'BSAI-APP-2026-000002',
        citizenId: 'citizen-123',
        departmentId: 'dept-agri',
        schemeId: 'PM-KISAN',
        benefitName: 'PM-KISAN Instalment',
        sanctionNumber: 'BSAI-SAN-2026-100002',
        sanctionDate: Date.now() - 86400000 * 1,
        benefitAmount: 2000,
        currency: 'INR',
        paymentStatus: PaymentInternalStatus.SANCTION_APPROVED,
        internalStatus: PaymentInternalStatus.SANCTION_APPROVED,
        paymentMode: PaymentMode.DBT,
        bankMasked: 'XXXXXX1234',
        accountMasked: 'XXXXXXXXXX5678',
        paymentReference: null,
        timelineIds: [],
        auditIds: [],
        createdAt: Date.now() - 86400000 * 3
      },
      // 3. Awaiting Payment (Payment Ready)
      {
        id: 'BSAI-BEN-2026-100003',
        applicationId: 'BSAI-APP-2026-000003',
        citizenId: 'citizen-456',
        departmentId: 'dept-edu',
        schemeId: 'SCHOLARSHIP-XYZ',
        benefitName: 'Higher Education Scholarship',
        sanctionNumber: 'BSAI-SAN-2026-100003',
        sanctionDate: Date.now() - 86400000 * 2,
        benefitAmount: 10000,
        currency: 'INR',
        paymentStatus: PaymentInternalStatus.PAYMENT_READY,
        internalStatus: PaymentInternalStatus.PAYMENT_READY,
        paymentMode: PaymentMode.SCHOLARSHIP_CREDIT,
        bankMasked: 'XXXXXX5555',
        accountMasked: 'XXXXXXXXXX6666',
        paymentReference: null,
        timelineIds: [],
        auditIds: [],
        createdAt: Date.now() - 86400000 * 4
      },
      // 4. Batch Pending
      {
        id: 'BSAI-BEN-2026-100004',
        applicationId: 'BSAI-APP-2026-000004',
        citizenId: 'citizen-789',
        departmentId: 'dept-edu',
        schemeId: 'SCHOLARSHIP-XYZ',
        benefitName: 'Higher Education Scholarship',
        sanctionNumber: 'BSAI-SAN-2026-100004',
        sanctionDate: Date.now() - 86400000 * 2,
        benefitAmount: 10000,
        currency: 'INR',
        paymentStatus: PaymentInternalStatus.BATCH_PENDING,
        internalStatus: PaymentInternalStatus.BATCH_PENDING,
        paymentMode: PaymentMode.SCHOLARSHIP_CREDIT,
        bankMasked: 'XXXXXX7777',
        accountMasked: 'XXXXXXXXXX8888',
        paymentReference: null,
        timelineIds: [],
        auditIds: [],
        createdAt: Date.now() - 86400000 * 5
      },
      // 5. Batch Approval Pending
      {
        id: 'BSAI-BEN-2026-100005',
        applicationId: 'BSAI-APP-2026-000005',
        citizenId: 'citizen-123',
        departmentId: 'dept-health',
        schemeId: 'HEALTH-PMJAY',
        benefitName: 'PMJAY Subsidy',
        sanctionNumber: 'BSAI-SAN-2026-100005',
        sanctionDate: Date.now() - 86400000 * 3,
        benefitAmount: 5000,
        currency: 'INR',
        paymentStatus: PaymentInternalStatus.BATCH_APPROVAL_PENDING,
        internalStatus: PaymentInternalStatus.BATCH_APPROVAL_PENDING,
        paymentMode: PaymentMode.DBT,
        bankMasked: 'XXXXXX1234',
        accountMasked: 'XXXXXXXXXX5678',
        paymentReference: null,
        timelineIds: [],
        auditIds: [],
        createdAt: Date.now() - 86400000 * 6,
        batchId: 'BSAI-BAT-2026-100001'
      },
      // 6. Processing
      {
        id: 'BSAI-BEN-2026-100006',
        applicationId: 'BSAI-APP-2026-000006',
        citizenId: 'citizen-123',
        departmentId: 'dept-health',
        schemeId: 'HEALTH-PMJAY',
        benefitName: 'PMJAY Subsidy',
        sanctionNumber: 'BSAI-SAN-2026-100006',
        sanctionDate: Date.now() - 86400000 * 4,
        benefitAmount: 5000,
        currency: 'INR',
        paymentStatus: PaymentInternalStatus.PAYMENT_PROCESSING,
        internalStatus: PaymentInternalStatus.PAYMENT_PROCESSING,
        paymentMode: PaymentMode.DBT,
        bankMasked: 'XXXXXX1234',
        accountMasked: 'XXXXXXXXXX5678',
        paymentReference: null,
        timelineIds: [],
        auditIds: [],
        createdAt: Date.now() - 86400000 * 7,
        batchId: 'BSAI-BAT-2026-100002'
      },
      // 7. Successful Payment
      {
        id: 'BSAI-BEN-2026-100007',
        applicationId: 'BSAI-APP-2026-000007',
        citizenId: 'citizen-456',
        departmentId: 'dept-agri',
        schemeId: 'PM-KISAN',
        benefitName: 'PM-KISAN Instalment',
        sanctionNumber: 'BSAI-SAN-2026-100007',
        sanctionDate: Date.now() - 86400000 * 10,
        benefitAmount: 2000,
        currency: 'INR',
        paymentStatus: PaymentInternalStatus.COMPLETED,
        internalStatus: PaymentInternalStatus.COMPLETED,
        paymentMode: PaymentMode.DBT,
        bankMasked: 'XXXXXX5555',
        accountMasked: 'XXXXXXXXXX6666',
        paymentReference: 'PAY-REF-XYZ-12345',
        timelineIds: [],
        auditIds: [],
        createdAt: Date.now() - 86400000 * 12,
        batchId: 'BSAI-BAT-2026-100003'
      },
      // 8. Failed Payment
      {
        id: 'BSAI-BEN-2026-100008',
        applicationId: 'BSAI-APP-2026-000008',
        citizenId: 'citizen-123',
        departmentId: 'dept-edu',
        schemeId: 'SCHOLARSHIP-XYZ',
        benefitName: 'Higher Education Scholarship',
        sanctionNumber: 'BSAI-SAN-2026-100008',
        sanctionDate: Date.now() - 86400000 * 8,
        benefitAmount: 10000,
        currency: 'INR',
        paymentStatus: PaymentInternalStatus.PAYMENT_FAILED,
        internalStatus: PaymentInternalStatus.PAYMENT_FAILED,
        paymentMode: PaymentMode.SCHOLARSHIP_CREDIT,
        bankMasked: 'XXXXXX1234',
        accountMasked: 'XXXXXXXXXX5678',
        paymentReference: null,
        timelineIds: [],
        auditIds: [],
        createdAt: Date.now() - 86400000 * 10,
        batchId: 'BSAI-BAT-2026-100004'
      },
      // 9. Retry Scheduled
      {
        id: 'BSAI-BEN-2026-100009',
        applicationId: 'BSAI-APP-2026-000009',
        citizenId: 'citizen-789',
        departmentId: 'dept-health',
        schemeId: 'HEALTH-PMJAY',
        benefitName: 'PMJAY Subsidy',
        sanctionNumber: 'BSAI-SAN-2026-100009',
        sanctionDate: Date.now() - 86400000 * 15,
        benefitAmount: 5000,
        currency: 'INR',
        paymentStatus: PaymentInternalStatus.RETRY_APPROVED,
        internalStatus: PaymentInternalStatus.RETRY_APPROVED,
        paymentMode: PaymentMode.DBT,
        bankMasked: 'XXXXXX7777',
        accountMasked: 'XXXXXXXXXX8888',
        paymentReference: null,
        timelineIds: [],
        auditIds: [],
        createdAt: Date.now() - 86400000 * 20
      },
      // 10. Manual Review
      {
        id: 'BSAI-BEN-2026-100010',
        applicationId: 'BSAI-APP-2026-000010',
        citizenId: 'citizen-456',
        departmentId: 'dept-agri',
        schemeId: 'PM-KISAN',
        benefitName: 'PM-KISAN Instalment',
        sanctionNumber: 'BSAI-SAN-2026-100010',
        sanctionDate: Date.now() - 86400000 * 30,
        benefitAmount: 2000,
        currency: 'INR',
        paymentStatus: PaymentInternalStatus.MANUAL_REVIEW,
        internalStatus: PaymentInternalStatus.MANUAL_REVIEW,
        paymentMode: PaymentMode.DBT,
        bankMasked: 'XXXXXX5555',
        accountMasked: 'XXXXXXXXXX6666',
        paymentReference: null,
        timelineIds: [],
        auditIds: [],
        createdAt: Date.now() - 86400000 * 35
      },
      // 11. Payment Frozen
      {
        id: 'BSAI-BEN-2026-100011',
        applicationId: 'BSAI-APP-2026-000011',
        citizenId: 'citizen-123',
        departmentId: 'dept-edu',
        schemeId: 'SCHOLARSHIP-XYZ',
        benefitName: 'Higher Education Scholarship',
        sanctionNumber: 'BSAI-SAN-2026-100011',
        sanctionDate: Date.now() - 86400000 * 5,
        benefitAmount: 10000,
        currency: 'INR',
        paymentStatus: PaymentInternalStatus.PAYMENT_FROZEN,
        internalStatus: PaymentInternalStatus.PAYMENT_FROZEN,
        paymentMode: PaymentMode.SCHOLARSHIP_CREDIT,
        bankMasked: 'XXXXXX1234',
        accountMasked: 'XXXXXXXXXX5678',
        paymentReference: null,
        timelineIds: [],
        auditIds: [],
        createdAt: Date.now() - 86400000 * 6,
        batchId: 'BSAI-BAT-2026-100005'
      },
      // 12. Duplicate payment prevented (Failed with DUPLICATE)
      {
        id: 'BSAI-BEN-2026-100012',
        applicationId: 'BSAI-APP-2026-000012',
        citizenId: 'citizen-789',
        departmentId: 'dept-health',
        schemeId: 'HEALTH-PMJAY',
        benefitName: 'PMJAY Subsidy',
        sanctionNumber: 'BSAI-SAN-2026-100012',
        sanctionDate: Date.now() - 86400000 * 40,
        benefitAmount: 5000,
        currency: 'INR',
        paymentStatus: PaymentInternalStatus.PAYMENT_FAILED,
        internalStatus: PaymentInternalStatus.PAYMENT_FAILED,
        paymentMode: PaymentMode.DBT,
        bankMasked: 'XXXXXX7777',
        accountMasked: 'XXXXXXXXXX8888',
        paymentReference: null,
        timelineIds: [],
        auditIds: [],
        createdAt: Date.now() - 86400000 * 45,
        batchId: 'BSAI-BAT-2026-100006'
      }
    ];

    const demoBatches = [
      {
        id: 'BSAI-BAT-2026-100001',
        departmentId: 'dept-health',
        createdBy: 'officer-payment-1',
        createdAt: Date.now() - 86400000 * 2,
        status: PaymentInternalStatus.BATCH_APPROVAL_PENDING,
        benefitIds: ['BSAI-BEN-2026-100005'],
        totalAmount: 5000
      },
      {
        id: 'BSAI-BAT-2026-100002',
        departmentId: 'dept-health',
        createdBy: 'officer-payment-1',
        createdAt: Date.now() - 86400000 * 3,
        status: PaymentInternalStatus.RELEASE_PENDING,
        benefitIds: ['BSAI-BEN-2026-100006'],
        totalAmount: 5000
      },
      {
        id: 'BSAI-BAT-2026-100003',
        departmentId: 'dept-agri',
        createdBy: 'officer-payment-2',
        createdAt: Date.now() - 86400000 * 11,
        status: PaymentInternalStatus.COMPLETED,
        benefitIds: ['BSAI-BEN-2026-100007'],
        totalAmount: 2000
      },
      {
        id: 'BSAI-BAT-2026-100004',
        departmentId: 'dept-edu',
        createdBy: 'officer-payment-3',
        createdAt: Date.now() - 86400000 * 9,
        status: PaymentInternalStatus.COMPLETED,
        benefitIds: ['BSAI-BEN-2026-100008'],
        totalAmount: 10000
      },
      {
        id: 'BSAI-BAT-2026-100005',
        departmentId: 'dept-edu',
        createdBy: 'officer-payment-3',
        createdAt: Date.now() - 86400000 * 5,
        status: PaymentInternalStatus.BATCH_APPROVED,
        benefitIds: ['BSAI-BEN-2026-100011'],
        totalAmount: 10000
      },
      {
        id: 'BSAI-BAT-2026-100006',
        departmentId: 'dept-health',
        createdBy: 'officer-payment-1',
        createdAt: Date.now() - 86400000 * 41,
        status: PaymentInternalStatus.COMPLETED,
        benefitIds: ['BSAI-BEN-2026-100012'],
        totalAmount: 5000
      }
    ];

    const demoAttempts = [
      {
        id: 'BSAI-PAY-2026-100001',
        benefitId: 'BSAI-BEN-2026-100007',
        amount: 2000,
        status: PaymentInternalStatus.PAYMENT_SUCCESS,
        createdAt: Date.now() - 86400000 * 10,
        resolvedAt: Date.now() - 86400000 * 9,
        failureReason: null
      },
      {
        id: 'BSAI-PAY-2026-100002',
        benefitId: 'BSAI-BEN-2026-100008',
        amount: 10000,
        status: PaymentInternalStatus.PAYMENT_FAILED,
        createdAt: Date.now() - 86400000 * 8,
        resolvedAt: Date.now() - 86400000 * 7,
        failureReason: PaymentFailureReason.BANK_VALIDATION_FAILED
      },
      {
        id: 'BSAI-PAY-2026-100003',
        benefitId: 'BSAI-BEN-2026-100012',
        amount: 5000,
        status: PaymentInternalStatus.PAYMENT_FAILED,
        createdAt: Date.now() - 86400000 * 40,
        resolvedAt: Date.now() - 86400000 * 39,
        failureReason: PaymentFailureReason.DUPLICATE_PAYMENT
      }
    ];

    const demoSanctions = [
      {
        id: 'BSAI-SAN-2026-100002',
        benefitId: 'BSAI-BEN-2026-100002',
        status: SanctionInternalStatus.APPROVED,
        recommendedBy: 'officer-reviewer-1',
        approvedBy: 'officer-finance-1',
        createdAt: Date.now() - 86400000 * 2,
        approvedAt: Date.now() - 86400000 * 1
      },
      {
        id: 'BSAI-SAN-2026-100003',
        benefitId: 'BSAI-BEN-2026-100003',
        status: SanctionInternalStatus.APPROVED,
        recommendedBy: 'officer-reviewer-2',
        approvedBy: 'officer-finance-2',
        createdAt: Date.now() - 86400000 * 3,
        approvedAt: Date.now() - 86400000 * 2
      },
      {
        id: 'BSAI-SAN-2026-100004',
        benefitId: 'BSAI-BEN-2026-100004',
        status: SanctionInternalStatus.APPROVED,
        recommendedBy: 'officer-reviewer-3',
        approvedBy: 'officer-finance-1',
        createdAt: Date.now() - 86400000 * 3,
        approvedAt: Date.now() - 86400000 * 2
      },
      {
        id: 'BSAI-SAN-2026-100005',
        benefitId: 'BSAI-BEN-2026-100005',
        status: SanctionInternalStatus.APPROVED,
        recommendedBy: 'officer-reviewer-1',
        approvedBy: 'officer-finance-2',
        createdAt: Date.now() - 86400000 * 4,
        approvedAt: Date.now() - 86400000 * 3
      },
      {
        id: 'BSAI-SAN-2026-100006',
        benefitId: 'BSAI-BEN-2026-100006',
        status: SanctionInternalStatus.APPROVED,
        recommendedBy: 'officer-reviewer-2',
        approvedBy: 'officer-finance-1',
        createdAt: Date.now() - 86400000 * 5,
        approvedAt: Date.now() - 86400000 * 4
      },
      {
        id: 'BSAI-SAN-2026-100007',
        benefitId: 'BSAI-BEN-2026-100007',
        status: SanctionInternalStatus.APPROVED,
        recommendedBy: 'officer-reviewer-3',
        approvedBy: 'officer-finance-2',
        createdAt: Date.now() - 86400000 * 11,
        approvedAt: Date.now() - 86400000 * 10
      },
      {
        id: 'BSAI-SAN-2026-100008',
        benefitId: 'BSAI-BEN-2026-100008',
        status: SanctionInternalStatus.APPROVED,
        recommendedBy: 'officer-reviewer-1',
        approvedBy: 'officer-finance-1',
        createdAt: Date.now() - 86400000 * 9,
        approvedAt: Date.now() - 86400000 * 8
      },
      {
        id: 'BSAI-SAN-2026-100009',
        benefitId: 'BSAI-BEN-2026-100009',
        status: SanctionInternalStatus.APPROVED,
        recommendedBy: 'officer-reviewer-2',
        approvedBy: 'officer-finance-2',
        createdAt: Date.now() - 86400000 * 16,
        approvedAt: Date.now() - 86400000 * 15
      },
      {
        id: 'BSAI-SAN-2026-100010',
        benefitId: 'BSAI-BEN-2026-100010',
        status: SanctionInternalStatus.APPROVED,
        recommendedBy: 'officer-reviewer-3',
        approvedBy: 'officer-finance-1',
        createdAt: Date.now() - 86400000 * 31,
        approvedAt: Date.now() - 86400000 * 30
      },
      {
        id: 'BSAI-SAN-2026-100011',
        benefitId: 'BSAI-BEN-2026-100011',
        status: SanctionInternalStatus.APPROVED,
        recommendedBy: 'officer-reviewer-1',
        approvedBy: 'officer-finance-2',
        createdAt: Date.now() - 86400000 * 6,
        approvedAt: Date.now() - 86400000 * 5
      },
      {
        id: 'BSAI-SAN-2026-100012',
        benefitId: 'BSAI-BEN-2026-100012',
        status: SanctionInternalStatus.APPROVED,
        recommendedBy: 'officer-reviewer-2',
        approvedBy: 'officer-finance-1',
        createdAt: Date.now() - 86400000 * 41,
        approvedAt: Date.now() - 86400000 * 40
      }
    ];

    localStorage.setItem('bsai_benefits', JSON.stringify(demoBenefits));
    localStorage.setItem('bsai_payment_batches', JSON.stringify(demoBatches));
    localStorage.setItem('bsai_payment_attempts', JSON.stringify(demoAttempts));
    localStorage.setItem('bsai_sanctions', JSON.stringify(demoSanctions));
    localStorage.setItem('bsai_payment_audits', JSON.stringify([]));
  },

  migrateBenefitStorage() {
    const version = localStorage.getItem('bsai_benefit_schema_version');
    if (!version) {
      localStorage.setItem('bsai_benefit_schema_version', '1.0');
    }
  },

  validateBenefitStorage() {
    return true;
  },

  resetBenefitDemoData() {
    localStorage.removeItem('bsai_benefits');
    localStorage.removeItem('bsai_payment_batches');
    localStorage.removeItem('bsai_payment_attempts');
    localStorage.removeItem('bsai_sanctions');
    localStorage.removeItem('bsai_payment_audits');
    localStorage.removeItem('bsai_benefit_schema_version');
    this.initializeDemoData();
  }
};
