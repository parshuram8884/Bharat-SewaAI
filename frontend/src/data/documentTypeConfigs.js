// Document Type Configurations for Bharat Sewa AI Phase 7 OCR Module

export const DOCUMENT_TYPE_CONFIGS = [
  {
    id: 'aadhaar-card',
    name: 'Aadhaar Card',
    category: 'identity',
    acceptedTypes: ['image/jpeg', 'image/png', 'application/pdf'],
    maxSizeMb: 5,
    requiredPages: 2,
    extractableFields: [
      { key: 'applicantName', label: 'Full Name', type: 'text', sensitive: false, required: true },
      { key: 'dob', label: 'Date of Birth', type: 'date', sensitive: false, required: true },
      { key: 'gender', label: 'Gender', type: 'selectOption', sensitive: false, required: true },
      { key: 'aadhaarNumber', label: 'Aadhaar Number (Masked)', type: 'maskedString', sensitive: true, required: true },
      { key: 'address', label: 'Residential Address', type: 'address', sensitive: false, required: false }
    ],
    sampleData: {
      applicantName: 'Ramesh Kumar',
      dob: '1984-06-15',
      gender: 'male',
      aadhaarNumber: 'XXXX-XXXX-4821',
      address: 'Village Lakhangaon, Taluka Haveli, District Pune, Maharashtra 411001'
    }
  },
  {
    id: 'pan-card',
    name: 'PAN Card',
    category: 'identity',
    acceptedTypes: ['image/jpeg', 'image/png', 'application/pdf'],
    maxSizeMb: 5,
    requiredPages: 1,
    extractableFields: [
      { key: 'applicantName', label: 'Full Name', type: 'text', sensitive: false, required: true },
      { key: 'fatherName', label: "Father's Name", type: 'text', sensitive: false, required: true },
      { key: 'dob', label: 'Date of Birth', type: 'date', sensitive: false, required: true },
      { key: 'panNumber', label: 'PAN Number (Masked)', type: 'maskedString', sensitive: true, required: true }
    ],
    sampleData: {
      applicantName: 'Ramesh Kumar',
      fatherName: 'Suresh Kumar',
      dob: '1984-06-15',
      panNumber: 'ABCXX1234X'
    }
  },
  {
    id: 'income-certificate',
    name: 'Income Certificate',
    category: 'financial',
    acceptedTypes: ['image/jpeg', 'image/png', 'application/pdf'],
    maxSizeMb: 8,
    requiredPages: 1,
    extractableFields: [
      { key: 'applicantName', label: 'Applicant Name', type: 'text', sensitive: false, required: true },
      { key: 'certificateNumber', label: 'Certificate No (Masked)', type: 'maskedString', sensitive: true, required: true },
      { key: 'annualIncome', label: 'Annual Family Income (₹)', type: 'currencyNumber', sensitive: true, required: true },
      { key: 'issuingAuthority', label: 'Issuing Authority', type: 'text', sensitive: false, required: true },
      { key: 'issueDate', label: 'Issue Date', type: 'date', sensitive: false, required: true }
    ],
    sampleData: {
      applicantName: 'Ramesh Kumar',
      certificateNumber: 'INC-2025-XXXX',
      annualIncome: 180000,
      issuingAuthority: 'Tahsildar Haveli, Pune',
      issueDate: '2025-04-10'
    }
  },
  {
    id: 'bank-passbook',
    name: 'Bank Passbook',
    category: 'financial',
    acceptedTypes: ['image/jpeg', 'image/png', 'application/pdf'],
    maxSizeMb: 5,
    requiredPages: 1,
    extractableFields: [
      { key: 'accountHolderName', label: 'Account Holder Name', type: 'text', sensitive: false, required: true },
      { key: 'bankName', label: 'Bank Name', type: 'text', sensitive: false, required: true },
      { key: 'accountNumber', label: 'Account Number (Masked)', type: 'maskedString', sensitive: true, required: true },
      { key: 'ifscCode', type: 'uppercase', label: 'IFSC Code', sensitive: false, required: true }
    ],
    sampleData: {
      accountHolderName: 'Ramesh Kumar',
      bankName: 'State Bank of India',
      accountNumber: 'XXXXXX9021',
      ifscCode: 'SBIN0001234'
    }
  },
  {
    id: 'land-record',
    name: 'Land Record / 7/12 Extract',
    category: 'property',
    acceptedTypes: ['image/jpeg', 'image/png', 'application/pdf'],
    maxSizeMb: 10,
    requiredPages: 1,
    extractableFields: [
      { key: 'ownerName', label: 'Landowner Name', type: 'text', sensitive: false, required: true },
      { key: 'surveyNumber', label: 'Survey / Khasra No', type: 'text', sensitive: false, required: true },
      { key: 'landAreaHectares', label: 'Total Area (Hectares)', type: 'number', sensitive: false, required: true },
      { key: 'district', label: 'District', type: 'text', sensitive: false, required: true }
    ],
    sampleData: {
      ownerName: 'Ramesh Kumar',
      surveyNumber: '142/A',
      landAreaHectares: 1.8,
      district: 'Pune'
    }
  },
  {
    id: 'residence-certificate',
    name: 'Residence Certificate',
    category: 'identity',
    acceptedTypes: ['image/jpeg', 'image/png', 'application/pdf'],
    maxSizeMb: 5,
    requiredPages: 1,
    extractableFields: [
      { key: 'applicantName', label: 'Applicant Name', type: 'text', sensitive: false, required: true },
      { key: 'state', label: 'State', type: 'text', sensitive: false, required: true },
      { key: 'district', label: 'District', type: 'text', sensitive: false, required: true }
    ],
    sampleData: {
      applicantName: 'Ramesh Kumar',
      state: 'Maharashtra',
      district: 'Pune'
    }
  }
];

export function getDocumentTypeConfig(typeId) {
  return DOCUMENT_TYPE_CONFIGS.find((cfg) => cfg.id === typeId) || DOCUMENT_TYPE_CONFIGS[0];
}
