// Application Form Schemas for Bharat Sewa AI Phase 6

export const SCHEME_FORM_SCHEMAS = {
  'pm-kisan': {
    schemeId: 'pm-kisan',
    title: 'PM-KISAN Application Form',
    sections: [
      {
        id: 'applicant-details',
        title: '1. Applicant Profile Verification',
        description: 'Verify your personal details pre-filled from your citizen profile.',
        fields: [
          { id: 'fullName', type: 'profile-confirm', label: 'Full Name', required: true },
          { id: 'state', type: 'profile-confirm', label: 'State of Residence', required: true },
          { id: 'district', type: 'profile-confirm', label: 'District', required: true },
          { id: 'aadhaarStatus', type: 'read-only', label: 'Aadhaar Verification Status', value: 'Verified (XXXX-XXXX-4821)' }
        ]
      },
      {
        id: 'farmer-details',
        title: '2. Farmer & Landholding Information',
        description: 'Provide details about your agricultural land as per 7/12 extract.',
        fields: [
          {
            id: 'category',
            type: 'single-select',
            label: 'Farmer Category',
            required: true,
            options: [
              { label: 'Small Farmer (< 2 Hectares)', value: 'small' },
              { label: 'Marginal Farmer (< 1 Hectare)', value: 'marginal' },
              { label: 'Other Landholding Farmer', value: 'other' }
            ]
          },
          {
            id: 'landArea',
            type: 'number',
            label: 'Cultivable Area (Hectares)',
            required: true,
            min: 0.1,
            max: 50
          },
          {
            id: 'surveyNumber',
            type: 'text',
            label: 'Survey / Khasra Number',
            required: true,
            placeholder: 'e.g. 142/A'
          },
          {
            id: 'isSingleOwner',
            type: 'yes-no',
            label: 'Are you the sole owner of this landholding?',
            required: true
          }
        ]
      },
      {
        id: 'bank-details',
        title: '3. Aadhaar-Linked Bank Account Details',
        description: 'Enter bank account information for Direct Benefit Transfer (DBT).',
        fields: [
          { id: 'bankName', type: 'text', label: 'Bank Name', required: true, placeholder: 'State Bank of India' },
          { id: 'accountNumber', type: 'masked-identifier', label: 'Account Number', required: true, placeholder: 'XXXXXXXX9021' },
          { id: 'ifscCode', type: 'text', label: 'IFSC Code', required: true, placeholder: 'SBIN0001234' },
          { id: 'dbtConsent', type: 'checkbox', label: 'I authorize DBT credit into this Aadhaar-linked account.', required: true }
        ]
      }
    ]
  },
  'pm-fasal-bima': {
    schemeId: 'pm-fasal-bima',
    title: 'PM Fasal Bima Yojana Application',
    sections: [
      {
        id: 'crop-details',
        title: '1. Crop & Season Details',
        description: 'Select crop and coverage season for insurance.',
        fields: [
          {
            id: 'season',
            type: 'radio',
            label: 'Farming Season',
            required: true,
            options: [
              { label: 'Kharif 2026', value: 'kharif' },
              { label: 'Rabi 2026', value: 'rabi' }
            ]
          },
          {
            id: 'cropType',
            type: 'single-select',
            label: 'Crop Name',
            required: true,
            options: [
              { label: 'Soyabean', value: 'soyabean' },
              { label: 'Cotton', value: 'cotton' },
              { label: 'Rice', value: 'rice' },
              { label: 'Wheat', value: 'wheat' }
            ]
          },
          {
            id: 'sowingDate',
            type: 'date',
            label: 'Estimated Sowing Date',
            required: true
          }
        ]
      }
    ]
  }
};
