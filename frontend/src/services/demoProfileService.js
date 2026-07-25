import { Roles } from '../data/officerPermissionModel';
import { AnalyticsRoles } from '../data/analyticsPermissionModel';
import { SecurityRoles } from '../data/securityPermissionModel';

export const demoProfiles = [
  {
    id: 'profile_citizen_1',
    displayName: 'Aarav Sharma (Citizen)',
    emailMock: 'citizen.demo@bharatsewa.local',
    roles: [Roles.CITIZEN],
    departmentIds: [],
    centreIds: [],
    language: 'en'
  },
  {
    id: 'profile_officer_1',
    displayName: 'Priya Patel (Officer)',
    emailMock: 'officer.demo@bharatsewa.local',
    roles: [Roles.OFFICER],
    departmentIds: ['dept_health_1'],
    centreIds: [],
    language: 'en'
  },
  {
    id: 'profile_dept_admin',
    displayName: 'Rajesh Kumar (Dept Admin)',
    emailMock: 'department.admin@bharatsewa.local',
    roles: [Roles.DEPARTMENT_ADMIN],
    departmentIds: ['dept_health_1'],
    centreIds: [],
    language: 'en'
  },
  {
    id: 'profile_super_admin',
    displayName: 'Ananya Gupta (Super Admin)',
    emailMock: 'super.admin@bharatsewa.local',
    roles: [Roles.SUPER_ADMIN],
    departmentIds: ['ALL'],
    centreIds: ['ALL'],
    language: 'en'
  },
  {
    id: 'profile_payment_officer',
    displayName: 'Vikram Singh (Payment Officer)',
    emailMock: 'payment.officer@bharatsewa.local',
    roles: [Roles.PAYMENT_OFFICER],
    departmentIds: ['dept_finance_1'],
    centreIds: [],
    language: 'en'
  },
  {
    id: 'profile_finance_mgr',
    displayName: 'Neha Desai (Finance Manager)',
    emailMock: 'finance.manager@bharatsewa.local',
    roles: [Roles.FINANCE_MANAGER],
    departmentIds: ['dept_finance_1'],
    centreIds: [],
    language: 'en'
  },
  {
    id: 'profile_doc_officer',
    displayName: 'Suresh Reddy (Document Officer)',
    emailMock: 'document.officer@bharatsewa.local',
    roles: [Roles.DOCUMENT_OFFICER],
    departmentIds: ['dept_uidai_1'],
    centreIds: [],
    language: 'en'
  },
  {
    id: 'profile_verification_mgr',
    displayName: 'Anita Menon (Verification Manager)',
    emailMock: 'verification.manager@bharatsewa.local',
    roles: [Roles.VERIFICATION_MANAGER],
    departmentIds: ['dept_uidai_1'],
    centreIds: [],
    language: 'en'
  },
  {
    id: 'profile_csc_operator',
    displayName: 'Manoj Tiwari (CSC Operator)',
    emailMock: 'csc.operator@bharatsewa.local',
    roles: [Roles.CSC_OPERATOR],
    departmentIds: [],
    centreIds: ['centre_delhi_1'],
    language: 'en'
  },
  {
    id: 'profile_csc_manager',
    displayName: 'Kavita Joshi (CSC Manager)',
    emailMock: 'csc.manager@bharatsewa.local',
    roles: [Roles.CSC_MANAGER],
    departmentIds: [],
    centreIds: ['centre_delhi_1', 'centre_delhi_2'],
    language: 'en'
  },
  {
    id: 'profile_mis_analyst',
    displayName: 'Deepak Verma (MIS Analyst)',
    emailMock: 'mis.analyst@bharatsewa.local',
    roles: [AnalyticsRoles.MIS_ANALYST],
    departmentIds: ['ALL'],
    centreIds: [],
    language: 'en'
  },
  {
    id: 'profile_dept_analyst',
    displayName: 'Swati Bose (Dept Analyst)',
    emailMock: 'department.analyst@bharatsewa.local',
    roles: [AnalyticsRoles.DEPARTMENT_ANALYST],
    departmentIds: ['dept_health_1'],
    centreIds: [],
    language: 'en'
  },
  {
    id: 'profile_gov_manager',
    displayName: 'Arjun Nair (Data Governance)',
    emailMock: 'governance.manager@bharatsewa.local',
    roles: [AnalyticsRoles.DATA_GOVERNANCE_MANAGER],
    departmentIds: ['ALL'],
    centreIds: [],
    language: 'en'
  },
  {
    id: 'profile_security_auditor',
    displayName: 'Meera Rao (Security Auditor)',
    emailMock: 'security.auditor@bharatsewa.local',
    roles: [SecurityRoles.SECURITY_AUDITOR],
    departmentIds: ['ALL'],
    centreIds: [],
    language: 'en'
  },
  {
    id: 'profile_platform_operator',
    displayName: 'Rohit Iyer (Platform Operator)',
    emailMock: 'platform.operator@bharatsewa.local',
    roles: [SecurityRoles.PLATFORM_OPERATOR],
    departmentIds: ['ALL'],
    centreIds: [],
    language: 'en'
  }
];

export const demoProfileService = {
  getProfiles() {
    return demoProfiles;
  },
  getProfileByEmail(email) {
    return demoProfiles.find(p => p.emailMock === email);
  }
};
