// grievanceTypeConfigs.js
export const grievanceTypes = {
  'application-linked': {
    key: 'application-linked',
    label: 'Application-Linked Grievance',
    description: 'A complaint regarding a specific submitted application.',
    defaultDepartment: 'general',
    requiredFields: ['linkedApplicationId', 'description'],
    evidenceRequirements: 'optional',
    defaultPriority: 'high',
    appealEligibility: true,
    escalationEligibility: true
  },
  'service-delivery': {
    key: 'service-delivery',
    label: 'Service Delivery Delay',
    description: 'Complaint about delayed services.',
    defaultDepartment: 'general',
    requiredFields: ['departmentId', 'description'],
    evidenceRequirements: 'optional',
    defaultPriority: 'normal',
    appealEligibility: true,
    escalationEligibility: true
  },
  'technical-issue': {
    key: 'technical-issue',
    label: 'Technical Issue',
    description: 'Platform bug, error, or glitch.',
    defaultDepartment: 'it-support',
    requiredFields: ['description'],
    evidenceRequirements: 'recommended',
    defaultPriority: 'normal',
    appealEligibility: false,
    escalationEligibility: true
  },
  'payment-related': {
    key: 'payment-related',
    label: 'Payment Issue',
    description: 'Issues with fee payment or refunds.',
    defaultDepartment: 'finance',
    requiredFields: ['description'],
    evidenceRequirements: 'mandatory',
    defaultPriority: 'high',
    appealEligibility: true,
    escalationEligibility: true
  },
  'document-related': {
    key: 'document-related',
    label: 'Document Issue',
    description: 'Problems with document upload or OCR extraction.',
    defaultDepartment: 'general',
    requiredFields: ['description'],
    evidenceRequirements: 'optional',
    defaultPriority: 'normal',
    appealEligibility: true,
    escalationEligibility: true
  },
  'eligibility-related': {
    key: 'eligibility-related',
    label: 'Eligibility Dispute',
    description: 'Dispute regarding eligibility outcome.',
    defaultDepartment: 'general',
    requiredFields: ['description'],
    evidenceRequirements: 'mandatory',
    defaultPriority: 'high',
    appealEligibility: true,
    escalationEligibility: true
  },
  'officer-behaviour': {
    key: 'officer-behaviour',
    label: 'Officer Behaviour',
    description: 'Complaint about unprofessional conduct.',
    defaultDepartment: 'vigilance',
    requiredFields: ['description'],
    evidenceRequirements: 'optional',
    defaultPriority: 'urgent',
    appealEligibility: true,
    escalationEligibility: true
  },
  'incorrect-decision': {
    key: 'incorrect-decision',
    label: 'Incorrect Decision',
    description: 'Appeal or complaint against a decision.',
    defaultDepartment: 'general',
    requiredFields: ['description'],
    evidenceRequirements: 'mandatory',
    defaultPriority: 'high',
    appealEligibility: true,
    escalationEligibility: true
  },
  'accessibility-issue': {
    key: 'accessibility-issue',
    label: 'Accessibility Issue',
    description: 'Difficulties using the portal due to accessibility barriers.',
    defaultDepartment: 'it-support',
    requiredFields: ['description'],
    evidenceRequirements: 'optional',
    defaultPriority: 'normal',
    appealEligibility: false,
    escalationEligibility: true
  },
  'language-support': {
    key: 'language-support',
    label: 'Language Support',
    description: 'Missing or incorrect translations.',
    defaultDepartment: 'it-support',
    requiredFields: ['description'],
    evidenceRequirements: 'optional',
    defaultPriority: 'low',
    appealEligibility: false,
    escalationEligibility: false
  },
  'privacy-concern': {
    key: 'privacy-concern',
    label: 'Privacy Concern',
    description: 'Concerns regarding data handling.',
    defaultDepartment: 'vigilance',
    requiredFields: ['description'],
    evidenceRequirements: 'optional',
    defaultPriority: 'high',
    appealEligibility: true,
    escalationEligibility: true
  },
  'other': {
    key: 'other',
    label: 'Other',
    description: 'Any other complaint.',
    defaultDepartment: 'general',
    requiredFields: ['description'],
    evidenceRequirements: 'optional',
    defaultPriority: 'normal',
    appealEligibility: true,
    escalationEligibility: true
  }
};
