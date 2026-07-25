export const reviewChecklistConfigs = {
  'pm-kisan': {
    schemeId: 'pm-kisan',
    sections: [
      {
        id: 'identity',
        label: 'Identity Details',
        required: true,
        checks: [
          {
            id: 'name-match',
            label: 'Applicant name matches Aadhaar exactly',
            type: 'yes-no',
            required: true
          },
          {
            id: 'age-verify',
            label: 'Applicant is of valid age',
            type: 'yes-no-na',
            required: true
          }
        ]
      },
      {
        id: 'land',
        label: 'Land Records',
        required: true,
        checks: [
          {
            id: 'land-size',
            label: 'Cultivable land area is within limits',
            type: 'yes-no',
            required: true
          },
          {
            id: 'land-doc-valid',
            label: 'Land record document is legible and verified',
            type: 'yes-no',
            required: true
          }
        ]
      },
      {
        id: 'financial',
        label: 'Financial Details',
        required: true,
        checks: [
          {
            id: 'bank-verify',
            label: 'Bank account is active and seeded with Aadhaar',
            type: 'yes-no',
            required: true
          },
          {
            id: 'income-limit',
            label: 'Income certificate is valid and within threshold',
            type: 'yes-no',
            required: true
          }
        ]
      }
    ]
  },
  // Fallback default checklist for other schemes
  'default': {
    schemeId: 'default',
    sections: [
      {
        id: 'general',
        label: 'General Application Review',
        required: true,
        checks: [
          {
            id: 'profile-match',
            label: 'Profile information matches submitted documents',
            type: 'yes-no',
            required: true
          },
          {
            id: 'docs-clear',
            label: 'All uploaded documents are legible and valid',
            type: 'yes-no',
            required: true
          },
          {
            id: 'eligibility-confirmed',
            label: 'Applicant meets scheme criteria',
            type: 'yes-no',
            required: true
          }
        ]
      }
    ]
  }
};
