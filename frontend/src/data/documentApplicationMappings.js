// Document-to-Application Mappings Configuration for Phase 7

export const MAPPING_CONFIGURATIONS = {
  'income-certificate': [
    {
      sourceFieldKey: 'annualIncome',
      sourceLabel: 'Annual Family Income',
      targetFieldId: 'annualIncome',
      targetLabel: 'Annual Family Income (₹)',
      transformation: 'currencyNumber',
      requiresConfirmation: true
    },
    {
      sourceFieldKey: 'applicantName',
      sourceLabel: 'Applicant Name',
      targetFieldId: 'fullName',
      targetLabel: 'Full Name',
      transformation: 'trim',
      requiresConfirmation: true
    }
  ],
  'land-record': [
    {
      sourceFieldKey: 'landAreaHectares',
      sourceLabel: 'Total Land Area',
      targetFieldId: 'landArea',
      targetLabel: 'Cultivable Area (Hectares)',
      transformation: 'number',
      requiresConfirmation: true
    },
    {
      sourceFieldKey: 'surveyNumber',
      sourceLabel: 'Survey Number',
      targetFieldId: 'surveyNumber',
      targetLabel: 'Survey / Khasra Number',
      transformation: 'string',
      requiresConfirmation: true
    }
  ],
  'bank-passbook': [
    {
      sourceFieldKey: 'bankName',
      sourceLabel: 'Bank Name',
      targetFieldId: 'bankName',
      targetLabel: 'Bank Name',
      transformation: 'trim',
      requiresConfirmation: true
    },
    {
      sourceFieldKey: 'accountNumber',
      sourceLabel: 'Account Number',
      targetFieldId: 'accountNumber',
      targetLabel: 'Account Number (Masked)',
      transformation: 'maskedString',
      requiresConfirmation: true
    },
    {
      sourceFieldKey: 'ifscCode',
      sourceLabel: 'IFSC Code',
      targetFieldId: 'ifscCode',
      targetLabel: 'IFSC Code',
      transformation: 'uppercase',
      requiresConfirmation: true
    }
  ],
  'aadhaar-card': [
    {
      sourceFieldKey: 'applicantName',
      sourceLabel: 'Full Name',
      targetFieldId: 'fullName',
      targetLabel: 'Full Name',
      transformation: 'trim',
      requiresConfirmation: true
    },
    {
      sourceFieldKey: 'aadhaarNumber',
      sourceLabel: 'Aadhaar Number',
      targetFieldId: 'aadhaarStatus',
      targetLabel: 'Aadhaar Verification Status',
      transformation: 'maskedString',
      requiresConfirmation: true
    }
  ]
};

export function getMappingsForDocumentType(documentType) {
  return MAPPING_CONFIGURATIONS[documentType] || MAPPING_CONFIGURATIONS['income-certificate'];
}
