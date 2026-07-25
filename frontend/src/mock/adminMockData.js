// Bharat Sewa AI - Admin Portal Mock Data (Frontend Only)

export const initialStats = {
  totalCitizens: 1284092,
  totalApplications: 14280,
  pendingApprovals: 342,
  approvedApplications: 13180,
  activeSchemes: 24,
  slaCompliance: 99.4,
  autoVerifiedRate: 78.5,
  activeCitizens: 8940,
  applicationsTrend: [
    { month: 'Jan', applications: 1200, approved: 950, rejected: 150 },
    { month: 'Feb', applications: 1800, approved: 1400, rejected: 250 },
    { month: 'Mar', applications: 2200, approved: 1800, rejected: 300 },
    { month: 'Apr', applications: 2700, approved: 2200, rejected: 350 },
    { month: 'May', applications: 3100, approved: 2500, rejected: 400 },
    { month: 'Jun', applications: 3280, approved: 2750, rejected: 380 },
  ],
  schemeDistribution: [
    { name: 'PM-KISAN Samman Nidhi', value: 45, color: '#022448' },
    { name: 'Ayushman Bharat (PM-JAY)', value: 25, color: '#0051d5' },
    { name: 'Pradhan Mantri Awas Yojana', value: 18, color: '#316bf3' },
    { name: 'MGNREGA Job Card', value: 12, color: '#455f87' },
  ],
  systemStatus: {
    ocrEngine: 'Operational (99.2% accuracy)',
    aiChatbot: 'Operational (45ms avg latency)',
    database: 'Connected (Simulated Local)',
    smsGateway: 'Active (NIC SMS Provider)',
  }
};

export const initialCitizens = [
  {
    id: 'CIT-001',
    name: 'Rajesh Kumar Sharma',
    aadhaarLast4: '8842',
    phone: '+91 98765 43210',
    district: 'Varanasi',
    state: 'Uttar Pradesh',
    status: 'Active',
    registeredAt: '2025-11-12',
    applicationsCount: 3,
    complaintsCount: 1,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    documents: [
      { id: 'DOC-101', type: 'Aadhaar Card', status: 'Verified', uploadedAt: '2025-11-12', url: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=400&auto=format&fit=crop&q=80' },
      { id: 'DOC-102', type: 'Income Certificate', status: 'Verified', uploadedAt: '2025-11-14', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&auto=format&fit=crop&q=80' }
    ],
    timeline: [
      { id: 'TL-1', title: 'Account Created via Mobile App', date: '12 Nov 2025, 10:30 AM', type: 'registration' },
      { id: 'TL-2', title: 'Applied for PM-KISAN Samman Nidhi', date: '14 Nov 2025, 02:15 PM', type: 'application' },
      { id: 'TL-3', title: 'Aadhaar OCR Auto-Verification Successful', date: '14 Nov 2025, 02:16 PM', type: 'ocr' }
    ]
  },
  {
    id: 'CIT-002',
    name: 'Sunita Devi Patil',
    aadhaarLast4: '3910',
    phone: '+91 87654 32109',
    district: 'Pune',
    state: 'Maharashtra',
    status: 'Active',
    registeredAt: '2025-12-05',
    applicationsCount: 2,
    complaintsCount: 0,
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    documents: [
      { id: 'DOC-103', type: 'Aadhaar Card', status: 'Verified', uploadedAt: '2025-12-05', url: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=400&auto=format&fit=crop&q=80' },
      { id: 'DOC-104', type: 'Ration Card', status: 'Verified', uploadedAt: '2025-12-06', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&auto=format&fit=crop&q=80' }
    ],
    timeline: [
      { id: 'TL-4', title: 'Account Created at CSC Kendra', date: '05 Dec 2025, 11:00 AM', type: 'registration' },
      { id: 'TL-5', title: 'Applied for Ayushman Bharat (PM-JAY)', date: '06 Dec 2025, 04:20 PM', type: 'application' }
    ]
  },
  {
    id: 'CIT-003',
    name: 'Manoj Kumar Meena',
    aadhaarLast4: '7721',
    phone: '+91 94123 45678',
    district: 'Jaipur',
    state: 'Rajasthan',
    status: 'Suspended',
    registeredAt: '2026-01-15',
    applicationsCount: 1,
    complaintsCount: 2,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    documents: [
      { id: 'DOC-105', type: 'Aadhaar Card', status: 'Flagged', uploadedAt: '2026-01-15', url: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=400&auto=format&fit=crop&q=80' }
    ],
    timeline: [
      { id: 'TL-6', title: 'Account Suspended due to duplicate Aadhaar attempt', date: '20 Jan 2026, 09:10 AM', type: 'alert' }
    ]
  },
  {
    id: 'CIT-004',
    name: 'Lakshmi Narayanan',
    aadhaarLast4: '5519',
    phone: '+91 91234 56780',
    district: 'Madurai',
    state: 'Tamil Nadu',
    status: 'Active',
    registeredAt: '2026-02-10',
    applicationsCount: 4,
    complaintsCount: 0,
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    documents: [
      { id: 'DOC-106', type: 'Aadhaar Card', status: 'Verified', uploadedAt: '2026-02-10', url: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=400&auto=format&fit=crop&q=80' }
    ],
    timeline: [
      { id: 'TL-7', title: 'Applied for Pradhan Mantri Awas Yojana', date: '11 Feb 2026, 01:45 PM', type: 'application' }
    ]
  },
  {
    id: 'CIT-005',
    name: 'Amitabh Verma',
    aadhaarLast4: '1290',
    phone: '+91 99887 76655',
    district: 'Patna',
    state: 'Bihar',
    status: 'Active',
    registeredAt: '2026-03-01',
    applicationsCount: 1,
    complaintsCount: 1,
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    documents: [
      { id: 'DOC-107', type: 'Aadhaar Card', status: 'Pending Review', uploadedAt: '2026-03-01', url: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=400&auto=format&fit=crop&q=80' }
    ],
    timeline: [
      { id: 'TL-8', title: 'Submitted MGNREGA Job Card Application', date: '02 Mar 2026, 11:30 AM', type: 'application' }
    ]
  }
];

export const initialApplications = [
  {
    id: 'APP-2026-0891',
    citizenId: 'CIT-001',
    citizenName: 'Rajesh Kumar Sharma',
    schemeId: 'SCH-01',
    schemeName: 'PM-KISAN Samman Nidhi',
    district: 'Varanasi',
    state: 'Uttar Pradesh',
    submittedAt: '2026-07-24',
    status: 'Pending Review',
    assignedReviewer: 'Tejas Mail',
    ocrStatus: 'Needs Review',
    ocrScore: 84,
    documents: [
      {
        id: 'DOC-REV-01',
        name: 'Land Ownership Document (Khatatauni)',
        type: 'Land Record',
        status: 'Flagged',
        imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
        extractedData: {
          applicantName: 'Rajesh K. Sharma',
          surveyNumber: '142/B',
          landArea: '1.45 Hectares',
          village: 'Shivpur, Varanasi',
          confidence: '84%'
        },
        expectedData: {
          applicantName: 'Rajesh Kumar Sharma',
          surveyNumber: '142/B',
          landArea: '1.50 Hectares',
          village: 'Shivpur, Varanasi'
        },
        discrepancyNote: 'Minor mismatch in land area (1.45 vs 1.50 Hectares) and middle name abbreviation.'
      },
      {
        id: 'DOC-REV-02',
        name: 'Aadhaar Identity Proof',
        type: 'ID Proof',
        status: 'Verified',
        imageUrl: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=600&auto=format&fit=crop&q=80',
        extractedData: {
          applicantName: 'Rajesh Kumar Sharma',
          aadhaarNumber: 'XXXX XXXX 8842',
          dob: '14/05/1982',
          confidence: '99%'
        },
        expectedData: {
          applicantName: 'Rajesh Kumar Sharma',
          aadhaarNumber: 'XXXX XXXX 8842',
          dob: '14/05/1982'
        }
      }
    ],
    timeline: [
      { date: '24 Jul 2026, 10:15 AM', action: 'Application Submitted online via Citizen App', author: 'Rajesh Kumar Sharma' },
      { date: '24 Jul 2026, 10:16 AM', action: 'AI OCR Pipeline initiated. Aadhaar verified (99%). Land record flagged (84%).', author: 'Bharat Sewa AI Engine' },
      { date: '25 Jul 2026, 09:00 AM', action: 'Assigned to Reviewer Tejas Mail for manual verification', author: 'System Admin' }
    ],
    notes: [
      { id: 'N-1', author: 'Tejas Mail', date: '25 Jul 2026, 11:20 AM', text: 'Checked Khatatauni record with UP Bhulekh portal. The 1.45 hectare figure is accurate after recent canal deduction. Ready for approval.' }
    ]
  },
  {
    id: 'APP-2026-0892',
    citizenId: 'CIT-002',
    citizenName: 'Sunita Devi Patil',
    schemeId: 'SCH-02',
    schemeName: 'Ayushman Bharat (PM-JAY)',
    district: 'Pune',
    state: 'Maharashtra',
    submittedAt: '2026-07-23',
    status: 'Approved',
    assignedReviewer: 'Mohit Thakur',
    ocrStatus: 'Verified',
    ocrScore: 98,
    documents: [
      {
        id: 'DOC-REV-03',
        name: 'Ration Card (Yellow/BPL)',
        type: 'Income Proof',
        status: 'Verified',
        imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
        extractedData: {
          applicantName: 'Sunita Devi Patil',
          cardNumber: 'MH-PN-98231',
          category: 'BPL',
          confidence: '98%'
        },
        expectedData: {
          applicantName: 'Sunita Devi Patil',
          cardNumber: 'MH-PN-98231',
          category: 'BPL'
        }
      }
    ],
    timeline: [
      { date: '23 Jul 2026, 03:10 PM', action: 'Application Submitted via CSC Kendra', author: 'CSC Operator #412' },
      { date: '23 Jul 2026, 03:12 PM', action: 'AI OCR Pipeline auto-verified all documents with 98% confidence.', author: 'Bharat Sewa AI Engine' },
      { date: '24 Jul 2026, 11:00 AM', action: 'Application Approved and PM-JAY e-card generated.', author: 'Mohit Thakur' }
    ],
    notes: []
  },
  {
    id: 'APP-2026-0893',
    citizenId: 'CIT-004',
    citizenName: 'Lakshmi Narayanan',
    schemeId: 'SCH-03',
    schemeName: 'Pradhan Mantri Awas Yojana',
    district: 'Madurai',
    state: 'Tamil Nadu',
    submittedAt: '2026-07-22',
    status: 'Documents Requested',
    assignedReviewer: 'Mangesh Patil',
    ocrStatus: 'Failed',
    ocrScore: 42,
    documents: [
      {
        id: 'DOC-REV-04',
        name: 'Bank Passbook Front Page',
        type: 'Bank Proof',
        status: 'Rejected',
        imageUrl: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=600&auto=format&fit=crop&q=80',
        extractedData: {
          applicantName: 'Unreadable / Blurry',
          accountNumber: 'XXXX 4519',
          ifsc: 'Not detected',
          confidence: '42%'
        },
        expectedData: {
          applicantName: 'Lakshmi Narayanan',
          accountNumber: 'XXXX XXXX 4519',
          ifsc: 'SBIN0001234'
        },
        discrepancyNote: 'Image is too blurry to read IFSC code and full branch name. Requested clear photo.'
      }
    ],
    timeline: [
      { date: '22 Jul 2026, 04:00 PM', action: 'Application Submitted', author: 'Lakshmi Narayanan' },
      { date: '22 Jul 2026, 04:01 PM', action: 'OCR verification failed due to poor image clarity (42% score).', author: 'Bharat Sewa AI Engine' },
      { date: '23 Jul 2026, 10:30 AM', action: 'Status changed to Documents Requested. SMS sent to citizen.', author: 'Mangesh Patil' }
    ],
    notes: [
      { id: 'N-2', author: 'Mangesh Patil', date: '23 Jul 2026, 10:30 AM', text: 'Passbook photo taken in low light. Informed applicant via SMS and automated WhatsApp message.' }
    ]
  },
  {
    id: 'APP-2026-0894',
    citizenId: 'CIT-005',
    citizenName: 'Amitabh Verma',
    schemeId: 'SCH-04',
    schemeName: 'MGNREGA Job Card',
    district: 'Patna',
    state: 'Bihar',
    submittedAt: '2026-07-25',
    status: 'Pending Review',
    assignedReviewer: 'Khushi Zope',
    ocrStatus: 'Needs Review',
    ocrScore: 89,
    documents: [
      {
        id: 'DOC-REV-05',
        name: 'Gram Panchayat Recommendation Letter',
        type: 'Local Proof',
        status: 'Pending',
        imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
        extractedData: {
          applicantName: 'Amitabh Verma',
          panchayat: 'Danapur Rural',
          sarpanchSign: 'Detected',
          confidence: '89%'
        },
        expectedData: {
          applicantName: 'Amitabh Verma',
          panchayat: 'Danapur Rural',
          sarpanchSign: 'Required'
        }
      }
    ],
    timeline: [
      { date: '25 Jul 2026, 09:15 AM', action: 'Application submitted online', author: 'Amitabh Verma' },
      { date: '25 Jul 2026, 09:16 AM', action: 'OCR scan complete (89% score). Pending final officer stamp verification.', author: 'Bharat Sewa AI Engine' }
    ],
    notes: []
  }
];

export const initialSchemes = [
  {
    id: 'SCH-01',
    code: 'PM-KISAN',
    name: 'Pradhan Mantri Kisan Samman Nidhi',
    category: 'Agriculture & Rural',
    stateAvailability: 'All India (Central Scheme)',
    status: 'Active',
    beneficiariesCount: 4520,
    maxBenefit: '₹6,000 / Year',
    description: 'Central Sector scheme with 100% funding from Government of India to provide income support to all landholding farmer families across the country.',
    eligibilityRules: [
      'Must be a small or marginal landholding farmer family.',
      'Land cultivable ownership must be registered in state land records.',
      'Must not be an institutional landholder or retired pensioner receiving over ₹10,000/month.'
    ],
    requiredDocuments: [
      'Aadhaar Card linked with bank account',
      'Land Ownership Deed / Khatatauni copy',
      'Active Bank Account Passbook / IFSC code'
    ],
    versionHistory: [
      { version: 'v2.4', date: '01 Jun 2026', changes: 'Updated e-KYC mandatory biometric requirement rules.', author: 'Ministry Admin' },
      { version: 'v2.3', date: '15 Jan 2026', changes: 'Added AI OCR validation for Khatatauni survey numbers.', author: 'System Tech Lead' }
    ]
  },
  {
    id: 'SCH-02',
    code: 'PM-JAY',
    name: 'Ayushman Bharat Pradhan Mantri Jan Arogya Yojana',
    category: 'Healthcare',
    stateAvailability: 'All India (33 States/UTs)',
    status: 'Active',
    beneficiariesCount: 3890,
    maxBenefit: '₹5,00,000 / Family / Year',
    description: 'World\'s largest government funded healthcare program targeting more than 50 crore beneficiaries from vulnerable families for secondary and tertiary hospitalization.',
    eligibilityRules: [
      'Family must be listed in SECC 2011 database under deprived categories (D1, D2, D3, D4, D5, D7).',
      'No age limit or restriction on family size.',
      'Must possess valid BPL / Yellow Ration Card or active labor card.'
    ],
    requiredDocuments: [
      'Aadhaar Card of head of family and members',
      'Ration Card (BPL / Antyodaya Anna Yojana)',
      'Mobile number for OTP verification'
    ],
    versionHistory: [
      { version: 'v3.1', date: '10 Mar 2026', changes: 'Integrated automatic family tree mapping via Ration Card OCR.', author: 'Health Ministry Lead' }
    ]
  },
  {
    id: 'SCH-03',
    code: 'PMAY-G',
    name: 'Pradhan Mantri Awas Yojana - Gramin',
    category: 'Housing & Urban',
    stateAvailability: 'All India (Rural Areas)',
    status: 'Active',
    beneficiariesCount: 2150,
    maxBenefit: '₹1,30,000 Financial Assistance',
    description: 'Aiming to provide a pucca house with basic amenities to all houseless households and households living in kutcha and dilapidated house in rural areas.',
    eligibilityRules: [
      'Households without shelter or living in houses with kutcha wall and kutcha roof.',
      'Households having no adult member between age 16 to 59.',
      'Female-headed households with no adult male member.'
    ],
    requiredDocuments: [
      'Aadhaar Card & Job Card number of MGNREGA',
      'Bank account details linked with Aadhaar',
      'Swachh Bharat Mission (SBM) beneficiary ID'
    ],
    versionHistory: [
      { version: 'v1.8', date: '20 Feb 2026', changes: 'Updated geo-tagging photo upload validation.', author: 'Rural Dev Admin' }
    ]
  },
  {
    id: 'SCH-04',
    code: 'MGNREGA',
    name: 'Mahatma Gandhi National Rural Employment Guarantee Act',
    category: 'Employment & Labor',
    stateAvailability: 'All India',
    status: 'Active',
    beneficiariesCount: 3720,
    maxBenefit: '100 Days Guaranteed Wage Employment',
    description: 'Indian labor law and social security measure that aims to guarantee the \'right to work\' by providing at least 100 days of wage employment in a financial year.',
    eligibilityRules: [
      'Must be a citizen of India residing in a rural area.',
      'Must be 18 years of age or older at the time of application.',
      'Must volunteer to do unskilled manual work.'
    ],
    requiredDocuments: [
      'Photograph of applicant(s)',
      'Name, age and gender of all adult family members',
      'Gram Panchayat residential proof / Voter ID'
    ],
    versionHistory: [
      { version: 'v4.0', date: '01 Apr 2026', changes: 'Revised daily wage rates per state notification.', author: 'Labor Dev Lead' }
    ]
  }
];

export const initialComplaints = [];

export const initialNotifications = [
  {
    id: 'NOTIF-001',
    title: 'PM-KISAN 18th Installment Disbursement Alert',
    message: 'Dear Citizen, the 18th installment of PM-KISAN will be credited to Aadhaar-seeded bank accounts by next week. Ensure your e-KYC is active.',
    targetAudience: 'All Farmers (PM-KISAN Beneficiaries)',
    channel: 'SMS & Push Notification',
    status: 'Sent',
    scheduledAt: '2026-07-20, 10:00 AM',
    sentCount: 4520,
    failedCount: 12
  },
  {
    id: 'NOTIF-002',
    title: 'Monsoon Healthcare Advisory & PM-JAY Benefits',
    message: 'Protect your family from seasonal dengue and malaria. Free diagnostic and inpatient treatments are covered at nearby empaneled private hospitals under PM-JAY.',
    targetAudience: 'Rural Healthcare Beneficiaries',
    channel: 'Push Notification & WhatsApp',
    status: 'Scheduled',
    scheduledAt: '2026-07-28, 09:00 AM',
    sentCount: 0,
    failedCount: 0
  }
];

export const initialAuditLogs = [
  {
    id: 'AUD-901',
    adminName: 'Tejas Mail (Super Admin)',
    action: 'APPROVED_APPLICATION',
    target: 'APP-2026-0892 (Ayushman Bharat)',
    ipAddress: '103.212.14.88',
    timestamp: '2026-07-25, 11:25 AM',
    details: 'Verified BPL Ration Card match via OCR automated checklist.'
  },
  {
    id: 'AUD-902',
    adminName: 'Mohit Thakur (Reviewer)',
    action: 'UPDATED_SCHEME_RULE',
    target: 'SCH-01 (PM-KISAN)',
    ipAddress: '103.212.14.92',
    timestamp: '2026-07-24, 04:15 PM',
    details: 'Added Khatatauni survey number requirement rule.'
  },
  {
    id: 'AUD-903',
    adminName: 'Mangesh Patil (State Admin)',
    action: 'REQUESTED_DOCUMENTS',
    target: 'APP-2026-0893 (PMAY-G)',
    ipAddress: '103.212.15.10',
    timestamp: '2026-07-23, 10:30 AM',
    details: 'Requested re-upload of Bank Passbook front page due to blurriness.'
  }
];

export const adminRolesList = [
  {
    id: 'ROLE-1',
    name: 'Super Admin',
    usersCount: 2,
    description: 'Full access to all platform modules, system settings, RBAC role management, and audit logs.',
    permissions: ['all:access', 'users:manage', 'schemes:crud', 'applications:review', 'reports:export', 'settings:edit']
  },
  {
    id: 'ROLE-2',
    name: 'Verification Officer (Reviewer)',
    usersCount: 8,
    description: 'Can review and verify citizen applications, OCR document comparisons, and resolve complaints.',
    permissions: ['applications:review', 'citizens:view', 'complaints:resolve', 'ocr:verify']
  },
  {
    id: 'ROLE-3',
    name: 'Scheme Nodal Officer',
    usersCount: 4,
    description: 'Can create, edit, and update scheme eligibility rules, required documents, and state availability.',
    permissions: ['schemes:crud', 'reports:view', 'notifications:send']
  }
];
