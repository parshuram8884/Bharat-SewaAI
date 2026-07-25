// Mock Scheme Data for Bharat Sewa AI Phase 5

export const MOCK_CITIZEN_PROFILE = {
  id: 'profile-1',
  name: 'Ramesh Kumar',
  age: 42,
  gender: 'Male',
  state: 'Maharashtra',
  district: 'Jalgaon',
  occupation: 'Farmer',
  isFarmer: true,
  landholdingHectares: 1.5,
  annualIncome: 120000,
  casteCategory: 'OBC',
  isStudent: false,
  isDisability: false,
  bankAadhaarLinked: true,
  hasCropInsurance: false
};

export const MOCK_SCHEMES = [
  {
    id: 'pm-kisan',
    slug: 'pm-kisan',
    name: 'PM-KISAN',
    localizedNames: {
      hi: 'पीएम-किसान सम्मान निधि',
      mr: 'पीएम-किसान सन्मान निधी'
    },
    shortDescription: 'Direct financial benefit transfer of ₹6,000 per year to small and marginal farmer families across India.',
    fullDescription: 'Pradhan Mantri Kisan Samman Nidhi (PM-KISAN) is a Central Sector scheme with 100% funding from Government of India. Under the scheme, income support of ₹6,000/- per year in three equal installments is provided to all landholding farmer families.',
    category: 'Agriculture',
    department: 'Department of Agriculture & Farmers Welfare',
    governmentLevel: 'Central Government',
    state: 'All States',
    benefitSummary: '₹6,000 per year in 3 installments of ₹2,000 directly to bank accounts.',
    benefits: [
      'Financial support of ₹6,000 per year',
      'Direct Benefit Transfer (DBT) directly into bank account',
      'Transparent online tracking of installments',
      'Covers small and marginal farmer families'
    ],
    eligibilityRules: [
      {
        id: 'r-farmer',
        title: 'Occupation Status',
        description: 'Must be a practicing farmer family.',
        field: 'isFarmer',
        operator: 'equals',
        expectedValue: true,
        importance: 'required',
        failureMessage: 'This scheme is specifically for active landholding farmers.'
      },
      {
        id: 'r-land',
        title: 'Land Ownership',
        description: 'Must own cultivable agricultural land.',
        field: 'landholdingHectares',
        operator: 'greaterThanOrEqual',
        expectedValue: 0.1,
        importance: 'required',
        failureMessage: 'Valid agricultural landholding record is mandatory.'
      },
      {
        id: 'r-bank',
        title: 'Aadhaar-Seeded Bank Account',
        description: 'Bank account must be linked with Aadhaar for DBT.',
        field: 'bankAadhaarLinked',
        operator: 'equals',
        expectedValue: true,
        importance: 'required',
        failureMessage: 'Bank account must be linked with Aadhaar for direct transfer.'
      }
    ],
    requiredDocuments: [
      { id: 'doc-aadhaar', name: 'Aadhaar Card', status: 'Available in Locker' },
      { id: 'doc-land', name: '7/12 Land Record Extracts', status: 'Missing' },
      { id: 'doc-bank', name: 'Bank Passbook Copy', status: 'Available in Locker' }
    ],
    applicationMode: 'Online',
    applicationStatus: 'Open',
    applicationDeadline: '2026-12-31',
    tags: ['Farmer', 'DBT', 'Financial Support', 'Central'],
    matchScore: 92,
    recommendationReasons: [
      'Matches your occupation (Farmer)',
      'Location matches eligible state (Maharashtra)',
      'Income within eligible range'
    ],
    isSaved: false,
    createdAt: '2026-01-01'
  },
  {
    id: 'pm-fasal-bima',
    slug: 'pm-fasal-bima',
    name: 'PM Fasal Bima Yojana',
    localizedNames: {
      hi: 'प्रधानमंत्री फसल बीमा योजना',
      mr: 'प्रधानमंत्री पीक विमा योजना'
    },
    shortDescription: 'Comprehensive crop insurance coverage against natural risks from pre-sowing to post-harvest.',
    fullDescription: 'PM Fasal Bima Yojana aims at supporting sustainable production in agriculture sector by providing financial support to farmers suffering crop loss/damage arising out of unforeseen events.',
    category: 'Agriculture',
    department: 'Ministry of Agriculture',
    governmentLevel: 'Central Government',
    state: 'Maharashtra',
    benefitSummary: 'Low premium crop loss compensation up to full crop value.',
    benefits: [
      'Lowest premium rates: 2% for Kharif, 1.5% for Rabi',
      'Coverage for pre-sowing to post-harvest losses',
      'Use of drone technology for fast assessment',
      'Quick claim settlement directly to bank accounts'
    ],
    eligibilityRules: [
      {
        id: 'r-farmer-fb',
        title: 'Farmer Status',
        description: 'Open to sharecroppers and tenant farmers growing notified crops.',
        field: 'isFarmer',
        operator: 'equals',
        expectedValue: true,
        importance: 'required'
      },
      {
        id: 'r-state-fb',
        title: 'State Residency',
        description: 'Must reside in participating state.',
        field: 'state',
        operator: 'equals',
        expectedValue: 'Maharashtra',
        importance: 'required'
      }
    ],
    requiredDocuments: [
      { id: 'doc-aadhaar', name: 'Aadhaar Card', status: 'Available in Locker' },
      { id: 'doc-crop', name: 'Crop Sowing Certificate', status: 'Missing' },
      { id: 'doc-bank', name: 'Bank Passbook', status: 'Available in Locker' }
    ],
    applicationMode: 'Online',
    applicationStatus: 'Open',
    applicationDeadline: '2026-08-15',
    tags: ['Insurance', 'Farmer', 'Agriculture'],
    matchScore: 88,
    recommendationReasons: [
      'High priority for Maharashtra farmers',
      'Covers current Kharif season'
    ],
    isSaved: true,
    createdAt: '2026-01-05'
  },
  {
    id: 'pmay-g',
    slug: 'pmay-g',
    name: 'Pradhan Mantri Awas Yojana – Gramin',
    localizedNames: {
      hi: 'प्रधानमंत्री आवास योजना - ग्रामीण',
      mr: 'प्रधानमंत्री आवास योजना - ग्रामीण'
    },
    shortDescription: 'Financial assistance to construct pucca houses with basic amenities for homeless rural families.',
    fullDescription: 'PMAY-G aims to provide a pucca house, with basic amenities, to all houseless households and those households living in kutcha and dilapidated house in rural areas.',
    category: 'Housing',
    department: 'Ministry of Rural Development',
    governmentLevel: 'Central Government',
    state: 'All States',
    benefitSummary: '₹1.20 Lakh assistance in plain areas and ₹1.30 Lakh in hilly states.',
    benefits: [
      'Direct grant of ₹1.20 Lakh to ₹1.30 Lakh',
      '90/95 days of unskilled labor under MGNREGA',
      '₹12,000 additional support for toilet construction',
      'Solar light and LPG connection assistance'
    ],
    eligibilityRules: [
      {
        id: 'r-inc-pmay',
        title: 'Annual Income Cap',
        description: 'Family income must be below rural threshold.',
        field: 'annualIncome',
        operator: 'lessThanOrEqual',
        expectedValue: 300000,
        importance: 'required'
      }
    ],
    requiredDocuments: [
      { id: 'doc-aadhaar', name: 'Aadhaar Card', status: 'Available in Locker' },
      { id: 'doc-income', name: 'Income Certificate', status: 'Pending Verification' },
      { id: 'doc-ration', name: 'Ration Card', status: 'Available in Locker' }
    ],
    applicationMode: 'Online & Offline',
    applicationStatus: 'Open',
    applicationDeadline: '2026-11-30',
    tags: ['Housing', 'Rural', 'Financial Support'],
    matchScore: 78,
    recommendationReasons: ['Rural residency', 'Income criteria eligible'],
    isSaved: false,
    createdAt: '2026-02-10'
  },
  {
    id: 'ayushman-bharat',
    slug: 'ayushman-bharat',
    name: 'Ayushman Bharat PM-JAY',
    localizedNames: {
      hi: 'आयुष्मान भारत पीएम-जय',
      mr: 'आयुष्मान भारत पीएम-जय'
    },
    shortDescription: 'Health insurance coverage of up to ₹5 Lakh per family per year for secondary and tertiary care hospitalization.',
    fullDescription: 'PM-JAY is the world’s largest health insurance/assurance scheme fully financed by the government, offering cashless health services.',
    category: 'Health',
    department: 'National Health Authority',
    governmentLevel: 'Central Government',
    state: 'All States',
    benefitSummary: '₹5 Lakh free health cover per family per year.',
    benefits: [
      'Cashless treatment at empanelled hospitals',
      'Over 1,900 medical procedures covered',
      'No cap on family size or age of members',
      'Pre and post-hospitalization expense coverage'
    ],
    eligibilityRules: [
      {
        id: 'r-inc-ayush',
        title: 'Socio-Economic Criteria',
        description: 'Targeted at low-income and vulnerable households.',
        field: 'annualIncome',
        operator: 'lessThanOrEqual',
        expectedValue: 250000,
        importance: 'required'
      }
    ],
    requiredDocuments: [
      { id: 'doc-aadhaar', name: 'Aadhaar Card', status: 'Available in Locker' },
      { id: 'doc-ration', name: 'Ration Card / SECC Record', status: 'Available in Locker' }
    ],
    applicationMode: 'Online',
    applicationStatus: 'Open',
    applicationDeadline: '2026-12-31',
    tags: ['Health', 'Insurance', 'Cashless'],
    matchScore: 95,
    recommendationReasons: ['Income within threshold', 'Family profile matched'],
    isSaved: false,
    createdAt: '2026-01-20'
  },
  {
    id: 'scholarship-portal',
    slug: 'scholarship-portal',
    name: 'National Scholarship Portal Scheme',
    localizedNames: {
      hi: 'राष्ट्रीय छात्रवृत्ति पोर्टल योजना',
      mr: 'राष्ट्रीय शिष्यवृत्ती योजना'
    },
    shortDescription: 'Pre-matric and post-matric financial scholarships for students from minority and low-income backgrounds.',
    fullDescription: 'NSP is a one-stop solution through which various services starting from student application, application verification, processing, and sanction are enabled.',
    category: 'Education',
    department: 'Ministry of Education',
    governmentLevel: 'Central Government',
    state: 'All States',
    benefitSummary: 'Annual tuition waiver and stipend ranging from ₹5,000 to ₹25,000.',
    benefits: [
      'Tuition fee reimbursement',
      'Monthly maintenance allowance',
      'Direct Benefit Transfer to student bank account'
    ],
    eligibilityRules: [
      {
        id: 'r-student',
        title: 'Student Status',
        description: 'Must be enrolled in recognized educational institution.',
        field: 'isStudent',
        operator: 'equals',
        expectedValue: true,
        importance: 'required',
        failureMessage: 'Applicant must be an active student.'
      }
    ],
    requiredDocuments: [
      { id: 'doc-marksheet', name: 'Previous Year Marksheet', status: 'Missing' },
      { id: 'doc-income', name: 'Income Certificate', status: 'Pending Verification' }
    ],
    applicationMode: 'Online',
    applicationStatus: 'Open',
    applicationDeadline: '2026-10-15',
    tags: ['Education', 'Scholarship', 'Students'],
    matchScore: 40,
    recommendationReasons: ['Education category'],
    isSaved: false,
    createdAt: '2026-02-01'
  }
];

export const MOCK_ELIGIBILITY_QUESTIONS = {
  'pm-kisan': [
    {
      id: 'q-farmer',
      step: 1,
      type: 'yesno',
      question: 'Are you or your family members actively engaged in farming?',
      helperText: 'Select Yes if farming is your primary or secondary occupation.',
      fieldKey: 'isFarmer',
      required: true
    },
    {
      id: 'q-land',
      step: 2,
      type: 'numeric',
      question: 'How much cultivable agricultural land do you own in hectares?',
      helperText: 'Enter total land size registered in your 7/12 extract.',
      fieldKey: 'landholdingHectares',
      min: 0,
      max: 50,
      stepValue: 0.1,
      required: true
    },
    {
      id: 'q-income',
      step: 3,
      type: 'single-select',
      question: 'What is your annual family income range?',
      helperText: 'Select total combined income from all household sources.',
      fieldKey: 'incomeRange',
      options: [
        { label: 'Below ₹1.5 Lakh', value: 'below-1.5' },
        { label: '₹1.5 Lakh - ₹3.0 Lakh', value: '1.5-3.0' },
        { label: 'Above ₹3.0 Lakh', value: 'above-3.0' }
      ],
      required: true
    },
    {
      id: 'q-bank',
      step: 4,
      type: 'profile-confirm',
      question: 'Is your bank account linked to your Aadhaar card for DBT payments?',
      helperText: 'Confirm the bank information registered in your profile.',
      fieldKey: 'bankAadhaarLinked',
      required: true
    }
  ],
  'pm-fasal-bima': [
    {
      id: 'q-farmer-fb',
      step: 1,
      type: 'yesno',
      question: 'Do you cultivate notified crops in Maharashtra during the current season?',
      helperText: 'Crops like Soyabean, Cotton, Rice, and Wheat are notified.',
      fieldKey: 'isFarmer',
      required: true
    },
    {
      id: 'q-insured',
      step: 2,
      type: 'yesno',
      question: 'Have you already purchased crop insurance from another company this season?',
      helperText: 'Multiple active policies for the same land are not permitted.',
      fieldKey: 'hasCropInsurance',
      required: true
    }
  ]
};
